
import { db } from '../db';
import { uiConfigTable } from '../db/schema';
import { type UIConfig } from '../schema';
import { eq, and } from 'drizzle-orm';

export const getUIConfig = async (componentType: string, componentId: string): Promise<UIConfig[]> => {
  try {
    const results = await db.select()
      .from(uiConfigTable)
      .where(
        and(
          eq(uiConfigTable.component_type, componentType),
          eq(uiConfigTable.component_id, componentId)
        )
      )
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to get UI config:', error);
    throw error;
  }
};
