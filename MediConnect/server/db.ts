import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// DEBUG: Check what's happening with DATABASE_URL
console.log('DEBUG: DATABASE_URL exists?', !!process.env.DATABASE_URL);
console.log('DEBUG: NODE_ENV:', process.env.NODE_ENV);
console.log('DEBUG: RENDER:', process.env.RENDER);

const connectionString = process.env.DATABASE_URL;

// Only create pool if DATABASE_URL exists
export const pool = connectionString 
  ? new Pool({ connectionString })
  : null;

export const db = pool ? drizzle({ client: pool, schema }) : null;

// Helper function to check if database is available
export const isDbAvailable = () => {
  const available = !!db;
  console.log('DEBUG: isDbAvailable:', available);
  return available;
};
