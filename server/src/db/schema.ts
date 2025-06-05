
import { serial, text, pgTable, timestamp } from 'drizzle-orm/pg-core';

export const buttonConfigTable = pgTable('button_config', {
  id: serial('id').primaryKey(),
  text: text('text').notNull(),
  color: text('color').notNull(),
  action: text('action'), // Nullable - no action for this button
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// TypeScript type for the table schema
export type ButtonConfig = typeof buttonConfigTable.$inferSelect;
export type NewButtonConfig = typeof buttonConfigTable.$inferInsert;

// Export all tables for proper query building
export const tables = { buttonConfig: buttonConfigTable };
