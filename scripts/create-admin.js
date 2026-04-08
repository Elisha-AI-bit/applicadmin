#!/usr/bin/env node

// Simple script to add admin user data to localStorage for development
// This bypasses Firebase authentication for development purposes

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const adminUser = {
  id: "JJwbaDlUsng3ssVZF3Eto7h5Nfi1",
  name: "Admin User",
  email: "admin@gmail.com",
  role: "super_admin",
  permissions: [],
  isActive: true,
  createdAt: new Date().toISOString(),
  lastLoginAt: new Date().toISOString()
};

console.log("=== Creating Admin User for Development ===");
console.log("Email:", adminUser.email);
console.log("UID:", adminUser.id);
console.log("Role:", adminUser.role);

// Create a simple JSON file with admin user data that can be used by the app
try {
  // Create admin-user.json file in the public directory so it can be accessed via fetch
  const adminDataPath = path.join(__dirname, '..', 'public', 'admin-user.json');
  fs.writeFileSync(adminDataPath, JSON.stringify(adminUser, null, 2));
  
  console.log("\n=== Admin user data created! ===");
  console.log("File created at: public/admin-user.json");
  console.log("\nTo use this admin user:");
  console.log("1. The app will automatically detect this file and use it for authentication");
  console.log("2. You can login with email: admin@gmail.com");
  console.log("3. Any password will work (development mode)");
  console.log("4. The user will have super_admin privileges");
  
  console.log("\n=== Admin User Details ===");
  console.log(JSON.stringify(adminUser, null, 2));
  
  console.log("\nScript completed successfully!");
  
} catch (error) {
  console.error("Error creating admin user file:", error);
  process.exit(1);
}
