import { Router } from "express";
import { z } from "zod";
import multer from "multer";
import path from "path";
import { pool } from "../db/pool";
import { requireRole, requireTenantScoped } from "../middleware/rbac";
import { sendPushToCitySubscribers } from "../lib/push";
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const router = Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'city-pulse-editions',
    resource_type: 'auto',
    allowed_formats: ['jpg', 'png', 'pdf'],
    public_id: (req: Express.Request, file: Express.Multer.File) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      return file.fieldname + "-" + uniqueSuffix;
    }
  } as any,
});

const upload = multer({ storage: storage });

// Middleware: Require PUBLISHER role and City Context
router.use(requireRole("PUBLISHER"));
router.use(requireTenantScoped);

// Schema for text fields (files handled separately)
// We make pdf_url optional here because it might come from the file upload
const createEditionSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  pdf_url: z.string().url().optional(),
  cover_url: z.string().url().optional(),
  publish_date: z.string().optional(), // ISO date string
});

// GET /publisher/editions - List editions for my city
router.get("/editions", async (req, res) => {
  try {
    const { cityId } = req;
    
    // Find publisher for this city
    const pubRes = await pool.query(
      "select id from publishers where city_id = $1",
      [cityId]
    );
    
    if (pubRes.rows.length === 0) {
      return res.status(404).json({ error: "Publisher license not found for this city" });
    }
    
    const publisherId = pubRes.rows[0].id;
    
    const result = await pool.query(
      "select * from editions where publisher_id = $1 order by created_at desc",
      [publisherId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /publisher/editions - Create new edition
router.post("/editions", upload.fields([{ name: 'pdf', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), async (req, res) => {
  try {
    const { cityId } = req;
    
    // Parse text body
    // Note: req.body will contain text fields from multipart form
    const body = createEditionSchema.parse(req.body);
    
    let pdfUrl = body.pdf_url;
    let coverUrl = body.cover_url;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // Handle file uploads if present
    if (files?.['pdf']?.[0]) {
      // Cloudinary storage puts the URL in 'path'
      pdfUrl = files['pdf'][0].path;
    }

    if (files?.['cover']?.[0]) {
      coverUrl = files['cover'][0].path;
    }

    if (!pdfUrl) {
      return res.status(400).json({ error: "PDF is required (either as file upload or URL)" });
    }

    // Find publisher for this city
    const pubRes = await pool.query(
      "select id from publishers where city_id = $1",
      [cityId]
    );
    
    if (pubRes.rows.length === 0) {
      return res.status(404).json({ error: "Publisher license not found for this city" });
    }
    
    const publisherId = pubRes.rows[0].id;
    
    const result = await pool.query(
      `insert into editions (publisher_id, title, description, pdf_url, cover_url, publish_date)
       values ($1, $2, $3, $4, $5, $6)
       returning *`,
      [
        publisherId,
        body.title,
        body.description || null,
        pdfUrl,
        coverUrl || null,
        body.publish_date || null
      ]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /publisher/editions/:id - Update edition
router.put("/editions/:id", upload.fields([{ name: 'pdf', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), async (req, res) => {
  try {
    const { cityId } = req;
    const { id } = req.params;
    
    // Verify ownership
    const checkRes = await pool.query(
      `select e.id, e.pdf_url, e.cover_url
       from editions e
       join publishers p on e.publisher_id = p.id
       where e.id = $1 and p.city_id = $2`,
      [id, cityId]
    );
    
    if (checkRes.rows.length === 0) {
      return res.status(404).json({ error: "Edition not found or access denied" });
    }

    const currentEdition = checkRes.rows[0];
    
    // Parse body (zod schema is same as create but optional fields)
    const updateSchema = createEditionSchema.partial();
    const body = updateSchema.parse(req.body);
    
    let pdfUrl = currentEdition.pdf_url;
    let coverUrl = currentEdition.cover_url;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (files?.['pdf']?.[0]) {
      pdfUrl = files['pdf'][0].path;
    }

    if (files?.['cover']?.[0]) {
      coverUrl = files['cover'][0].path;
    }

    const result = await pool.query(
      `update editions 
       set title = coalesce($1, title),
           description = coalesce($2, description),
           pdf_url = $3,
           cover_url = $4,
           publish_date = coalesce($5, publish_date),
           updated_at = now()
       where id = $6
       returning *`,
      [
        body.title || null,
        body.description || null,
        pdfUrl,
        coverUrl,
        body.publish_date || null,
        id
      ]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /publisher/editions/:id/publish
router.patch("/editions/:id/publish", async (req, res) => {
  try {
    const { cityId } = req;
    const { id } = req.params;

    // Verify ownership and get details
    const checkRes = await pool.query(
      `select e.id, e.title, p.city_id, c.name as city_name
       from editions e
       join publishers p on e.publisher_id = p.id
       join cities c on p.city_id = c.id
       where e.id = $1 and p.city_id = $2`,
      [id, cityId]
    );

    if (checkRes.rows.length === 0) {
      return res.status(404).json({ error: "Edition not found or access denied" });
    }

    const edition = checkRes.rows[0];

    // Update status
    await pool.query(
      "update editions set status = 'published', publish_date = now() where id = $1",
      [id]
    );

    // Send notification asynchronously
    // We don't await this to keep response fast, but catch errors
    sendPushToCitySubscribers(cityId!, {
      title: `New Edition: ${edition.title}`,
      body: `A new edition is available in ${edition.city_name}. Read it now!`,
      url: `/read/${edition.id}`
    }).catch(err => console.error("Async push error:", err));

    res.json({ success: true, status: 'published' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /publisher/editions/:id
router.delete("/editions/:id", async (req, res) => {
  try {
    const { cityId } = req;
    const { id } = req.params;
    
    // Verify ownership via publisher -> city
    const checkRes = await pool.query(
      `select e.id 
       from editions e
       join publishers p on e.publisher_id = p.id
       where e.id = $1 and p.city_id = $2`,
      [id, cityId]
    );
    
    if (checkRes.rows.length === 0) {
      return res.status(404).json({ error: "Edition not found or access denied" });
    }
    
    await pool.query("delete from editions where id = $1", [id]);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
