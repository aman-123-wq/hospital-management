import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// SIMPLE FIX - Don't check during build, only use if available
const connectionString = process.env.DATABASE_URL;

// Only create pool if DATABASE_URL exists
export const pool = connectionString 
  ? new Pool({ connectionString })
  : null;

export const db = pool ? drizzle({ client: pool, schema }) : null;

// Helper function to check if database is available
export const isDbAvailable = () => !!db;
