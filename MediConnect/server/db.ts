import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// For Render deployment - don't check DATABASE_URL during build
if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
  console.warn('DATABASE_URL not found, but continuing for build...');
  // Don't throw error during build
}

// Only throw error in production runtime, not during build
if (process.env.NODE_ENV === 'production' && process.env.RENDER && !process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });
