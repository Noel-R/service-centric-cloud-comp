import type { NextApiRequest, NextApiResponse } from 'next'


import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { users } from '../../../db/schema';
 
const client = createClient({ url: process.env.DATABASE_URL!, authToken: process.env.DATABASE_AUTH_TOKEN });
const db = drizzle(client);

export const dynamic = 'force-dynamic';
 
export async function GET( req: NextApiRequest ) {
    const returned = await db.insert(users).values({ name: "Partial Dan" }).returning({ insertedId: users.id });
    return Response.json({ message: returned[0].insertedId })
} 