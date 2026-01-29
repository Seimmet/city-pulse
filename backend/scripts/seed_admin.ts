import { pool } from "../src/db/pool";
import bcrypt from "bcryptjs";

async function seedAdmin() {
  const email = "admin@citypulse.com";
  const password = "admin123";
  
  console.log(`Seeding admin user: ${email}`);

  try {
    const hash = await bcrypt.hash(password, 10);
    
    // Check if user exists
    const existing = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    
    if (existing.rows.length > 0) {
      console.log("Admin user exists. Updating password...");
      await pool.query(
        "UPDATE users SET password_hash = $1, role = 'SUPER_ADMIN' WHERE email = $2",
        [hash, email]
      );
    } else {
      console.log("Creating new admin user...");
      await pool.query(
        "INSERT INTO users (email, password_hash, role, full_name) VALUES ($1, $2, 'SUPER_ADMIN', 'System Admin')",
        [email, hash]
      );
    }
    
    console.log("Admin user seeded successfully.");
  } catch (error) {
    console.error("Error seeding admin:", error);
  } finally {
    await pool.end();
  }
}

seedAdmin();
