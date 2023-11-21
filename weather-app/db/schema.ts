import { v1 as uuid1 } from 'uuid';
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";
 
export const users = sqliteTable('users', {
  id: text('id').unique().$defaultFn(() => uuid1()).primaryKey(),
  name: text('name'),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
