import { User } from "./models/index.js";
import dotenv from "dotenv";
import { sequelize } from "./config/db.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    // Authenticate with DB
    await sequelize.authenticate();
    console.log("Database connection established.");

    const adminEmail = "admin@ecomunch.com";
    const adminPassword = "AdminPassword123";

    // Check if admin already exists
    const existingAdmin = await User.findOne({ where: { email: adminEmail } });

    if (existingAdmin) {
      console.log("Admin user already exists.");
      // Ensure it has the admin role
      if (existingAdmin.role !== "admin") {
        existingAdmin.role = "admin";
        await existingAdmin.save();
        console.log("Updated existing user to admin role.");
      }
    } else {
      // Create admin user
      await User.create({
        name: "EcoMunch Admin",
        email: adminEmail,
        password: adminPassword,
        role: "admin",
      });
      console.log("Admin user created successfully!");
    }

    console.log("\n--- Admin Credentials ---");
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log("-------------------------\n");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
