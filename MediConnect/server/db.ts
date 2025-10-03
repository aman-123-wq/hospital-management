import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;

// OPTIMIZED CONNECTION SETTINGS
export const pool = connectionString 
  ? new Pool({ 
      connectionString,
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
      maxUses: 7500,
    })
  : null;

export const db = pool ? drizzle({ client: pool, schema }) : null;
export const isDbAvailable = () => !!db;
