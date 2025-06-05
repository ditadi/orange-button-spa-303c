
import { db } from '../db';
import { uiConfigTable } from '../db/schema';
import { type UpdateUIConfigInput, type UIConfig } from '../schema';
import { eq } from 'drizzle-orm';

export const updateUIConfig = async (input: UpdateUIConfigInput): Promise<UIConfig> => {
  try {
    // Build the update object with only provided fields
    const updateData: Partial<typeof uiConfigTable.$inferInsert> = {
      updated_at: new Date()
    };

    if (input.component_type !== undefined) {
      updateData.component_type = input.component_type;
    }
    if (input.component_id !== undefined) {
      updateData.component_id = input.component_id;
    }
    if (input.style_property !== undefined) {
      updateData.style_property = input.style_property;
    }
    if (input.style_value !== undefined) {
      updateData.style_value = input.style_value;
    }

    // Update the UI configuration record
    const result = await db.update(uiConfigTable)
      .set(updateData)
      .where(eq(uiConfigTable.id, input.id))
      .returning()
      .execute();

    if (result.length === 0) {
      throw new Error(`UI configuration with id ${input.id} not found`);
    }

    return result[0];
  } catch (error) {
    console.error('UI configuration update failed:', error);
    throw error;
  }
};
