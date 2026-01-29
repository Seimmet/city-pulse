// @ts-nocheck
import fs from 'fs';
import path from 'path';

const API_URL = "http://localhost:4000";

async function run() {
  console.log("Starting MVP Verification...");

  // 1. Signup Super Admin
  const adminEmail = `admin-${Date.now()}@test.com`;
  const adminPass = "password123";
  console.log(`1. Creating Super Admin: ${adminEmail}`);
  
  const adminSignupRes = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: adminEmail,
      password: adminPass,
      role: "SUPER_ADMIN",
      fullName: "Super Admin"
    })
  });
  
  if (!adminSignupRes.ok) {
    console.error("Admin Signup Failed:", await adminSignupRes.text());
    process.exit(1);
  }
  const adminData = await adminSignupRes.json();
  const adminToken = adminData.token;
  console.log("   Admin Created & Logged In");

  // 2. Create City
  console.log("2. Creating City...");
  const cityName = `Test City ${Date.now()}`;
  const cityRes = await fetch(`${API_URL}/admin/cities`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${adminToken}`,
      "x-user-role": "SUPER_ADMIN"
    },
    body: JSON.stringify({
      name: cityName,
      country: "Testland"
    })
  });
  
  if (!cityRes.ok) {
    console.error("Create City Failed:", await cityRes.text());
    process.exit(1);
  }
  const city = await cityRes.json();
  console.log(`   City Created: ${city.name} (${city.id})`);

  // 3. Create Publisher
  console.log("3. Creating Publisher...");
  const pubEmail = `pub-${Date.now()}@test.com`;
  const pubPass = "password123";
  const pubRes = await fetch(`${API_URL}/admin/publishers`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${adminToken}`,
      "x-user-role": "SUPER_ADMIN"
    },
    body: JSON.stringify({
      city_id: city.id,
      name: `${cityName} Publisher`,
      email: pubEmail,
      password: pubPass
    })
  });

  if (!pubRes.ok) {
    console.error("Create Publisher Failed:", await pubRes.text());
    process.exit(1);
  }
  const publisher = await pubRes.json();
  console.log(`   Publisher Created: ${publisher.name} (${publisher.id})`);

  // 4. Login as Publisher
  console.log("4. Logging in as Publisher...");
  const loginRes = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: pubEmail,
      password: pubPass
    })
  });

  if (!loginRes.ok) {
    console.error("Publisher Login Failed:", await loginRes.text());
    process.exit(1);
  }
  const pubAuth = await loginRes.json();
  const pubToken = pubAuth.token;
  const pubCityId = pubAuth.user.city_id;
  
  if (pubCityId !== city.id) {
    console.error(`   Mismatch City ID! Expected ${city.id}, got ${pubCityId}`);
    process.exit(1);
  }
  console.log("   Publisher Logged In successfully");

  // 5. Create Edition (Upload)
  console.log("5. Creating Edition (File Upload)...");
  
  // Create dummy files
  const pdfPath = path.resolve("dummy.pdf");
  const coverPath = path.resolve("dummy.jpg");
  fs.writeFileSync(pdfPath, "dummy pdf content");
  fs.writeFileSync(coverPath, "dummy cover content");

  const formData = new FormData();
  formData.append("title", "First Edition");
  formData.append("description", "This is a test edition");
  formData.append("publish_date", new Date().toISOString());
  
  // Use Blob for files in Node fetch
  const pdfBlob = new Blob([fs.readFileSync(pdfPath)], { type: 'application/pdf' });
  const coverBlob = new Blob([fs.readFileSync(coverPath)], { type: 'image/jpeg' });
  
  formData.append("pdf", pdfBlob, "test.pdf");
  formData.append("cover", coverBlob, "cover.jpg");

  const editionRes = await fetch(`${API_URL}/publisher/editions`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${pubToken}`,
      "x-user-role": "PUBLISHER",
      "x-city-id": pubCityId
    },
    body: formData
  });

  // Clean up files
  fs.unlinkSync(pdfPath);
  fs.unlinkSync(coverPath);

  if (!editionRes.ok) {
    console.error("Create Edition Failed:", await editionRes.text());
    process.exit(1);
  }
  const edition = await editionRes.json();
  console.log(`   Edition Created: ${edition.title} (${edition.id})`);
  console.log(`   PDF URL: ${edition.pdf_url}`);
  console.log(`   Cover URL: ${edition.cover_url}`);

  if (!edition.pdf_url.includes("test")) {
     console.error("   PDF URL seems wrong (should contain filename)");
  }

  // 6. Update Edition
  console.log("6. Updating Edition...");
  const updateForm = new FormData();
  updateForm.append("title", "Updated Edition Title");
  
  const updateRes = await fetch(`${API_URL}/publisher/editions/${edition.id}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${pubToken}`,
      "x-user-role": "PUBLISHER",
      "x-city-id": pubCityId
    },
    body: updateForm
  });

  if (!updateRes.ok) {
    console.error("Update Edition Failed:", await updateRes.text());
    process.exit(1);
  }
  const updatedEdition = await updateRes.json();
  if (updatedEdition.title !== "Updated Edition Title") {
    console.error("   Title update failed");
    process.exit(1);
  }
  console.log(`   Edition Updated: ${updatedEdition.title}`);

  console.log("SUCCESS: All MVP flows verified!");
}

run().catch(err => console.error(err));
