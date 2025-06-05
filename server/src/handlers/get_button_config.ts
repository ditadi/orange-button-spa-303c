
import { db } from '../db';
import { uiConfigTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

// Define the schema types for button configuration
export const getButtonConfigInputSchema = z.object({
  button_id: z.string().optional().default('default-button')
});

export type GetButtonConfigInput = z.infer<typeof getButtonConfigInputSchema>;

export const buttonConfigSchema = z.object({
  color: z.string(),
  text: z.string(),
  action: z.string().nullable()
});

export type ButtonConfig = z.infer<typeof buttonConfigSchema>;

export const getButtonConfig = async (input: GetButtonConfigInput = { button_id: 'default-button' }): Promise<ButtonConfig> => {
  try {
    // Get all UI config entries for this button
    const configs = await db.select()
      .from(uiConfigTable)
      .where(eq(uiConfigTable.component_id, input.button_id))
      .execute();

    // Default button configuration
    const defaultConfig: ButtonConfig = {
      color: 'red',
      text: 'click here',
      action: null
    };

    // If no configs found, return default
    if (configs.length === 0) {
      return defaultConfig;
    }

    // Build config from database entries
    const config = { ...defaultConfig };
    
    configs.forEach(entry => {
      switch (entry.style_property) {
        case 'color':
          config.color = entry.style_value;
          break;
        case 'text':
          config.text = entry.style_value;
          break;
        case 'action':
          config.action = entry.style_value === 'null' ? null : entry.style_value;
          break;
      }
    });

    return config;
  } catch (error) {
    console.error('Failed to get button config:', error);
    throw error;
  }
};
