
import { z } from 'zod';

export const uiConfigSchema = z.object({
  id: z.number(),
  component_type: z.string(),
  component_id: z.string(),
  style_property: z.string(),
  style_value: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type UIConfig = z.infer<typeof uiConfigSchema>;

export const createUIConfigInputSchema = z.object({
  component_type: z.string(),
  component_id: z.string(),
  style_property: z.string(),
  style_value: z.string()
});

export type CreateUIConfigInput = z.infer<typeof createUIConfigInputSchema>;

export const updateUIConfigInputSchema = z.object({
  id: z.number(),
  component_type: z.string().optional(),
  component_id: z.string().optional(),
  style_property: z.string().optional(),
  style_value: z.string().optional()
});

export type UpdateUIConfigInput = z.infer<typeof updateUIConfigInputSchema>;
