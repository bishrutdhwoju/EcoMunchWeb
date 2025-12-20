import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Database configuration from environment variables
export const sequelize = new Sequelize(
  process.env.DB_NAME || "EcoMunch",
  process.env.DB_USER || "postgres",
  process.env.DB_PASSWORD || "root",
  {
    dialect: process.env.DB_DIALECT || "postgres",
    host: process.env.DB_HOST || "localhost",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
  }
);

export const dbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully");
    
    // Sync all models with the database
    await sequelize.sync({ alter: true });
    console.log("✅ All models synchronized");
  } catch (error) {
    console.error(`❌ Database connection failed: ${error.message}`);
    process.exit(1);
  }
};
