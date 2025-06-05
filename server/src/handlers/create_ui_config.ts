
import { db } from '../db';
import { uiConfigTable } from '../db/schema';
import { type CreateUIConfigInput, type UIConfig } from '../schema';

export const createUIConfig = async (input: CreateUIConfigInput): Promise<UIConfig> => {
  try {
    // Insert UI config record
    const result = await db.insert(uiConfigTable)
      .values({
        component_type: input.component_type,
        component_id: input.component_id,
        style_property: input.style_property,
        style_value: input.style_value
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('UI config creation failed:', error);
    throw error;
  }
};
