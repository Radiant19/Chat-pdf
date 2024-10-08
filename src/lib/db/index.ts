import {neon, neonConfig} from '@neondatabase/serverless'
import {drizzle} from 'drizzle-orm/neon-http'

neonConfig.fetchConnectionCache = true

import { config } from "dotenv";
config({ path: ".env" }); // or .env.local

if(!process.env.DATABASE_URL){
    throw new Error('database url not found')
}

const sql = neon(process.env.DATABASE_URL) 

export const db = drizzle(sql) 