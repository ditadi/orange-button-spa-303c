
import { serial, text, pgTable, timestamp } from 'drizzle-orm/pg-core';

export const uiConfigTable = pgTable('ui_config', {
  id: serial('id').primaryKey(),
  component_type: text('component_type').notNull(),
  component_id: text('component_id').notNull(),
  style_property: text('style_property').notNull(),
  style_value: text('style_value').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export type UIConfig = typeof uiConfigTable.$inferSelect;
export type NewUIConfig = typeof uiConfigTable.$inferInsert;

export const tables = { uiConfig: uiConfigTable };
