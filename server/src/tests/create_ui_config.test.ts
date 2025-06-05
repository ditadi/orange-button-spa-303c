
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { uiConfigTable } from '../db/schema';
import { type CreateUIConfigInput } from '../schema';
import { createUIConfig } from '../handlers/create_ui_config';
import { eq } from 'drizzle-orm';

// Test input for button color configuration
const testInput: CreateUIConfigInput = {
  component_type: 'button',
  component_id: 'main-button',
  style_property: 'color',
  style_value: 'red'
};

describe('createUIConfig', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a UI config', async () => {
    const result = await createUIConfig(testInput);

    // Basic field validation
    expect(result.component_type).toEqual('button');
    expect(result.component_id).toEqual('main-button');
    expect(result.style_property).toEqual('color');
    expect(result.style_value).toEqual('red');
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save UI config to database', async () => {
    const result = await createUIConfig(testInput);

    // Query using proper drizzle syntax
    const configs = await db.select()
      .from(uiConfigTable)
      .where(eq(uiConfigTable.id, result.id))
      .execute();

    expect(configs).toHaveLength(1);
    expect(configs[0].component_type).toEqual('button');
    expect(configs[0].component_id).toEqual('main-button');
    expect(configs[0].style_property).toEqual('color');
    expect(configs[0].style_value).toEqual('red');
    expect(configs[0].created_at).toBeInstanceOf(Date);
    expect(configs[0].updated_at).toBeInstanceOf(Date);
  });

  it('should create button color config with red value', async () => {
    const buttonColorInput: CreateUIConfigInput = {
      component_type: 'button',
      component_id: 'click-button',
      style_property: 'background-color',
      style_value: 'red'
    };

    const result = await createUIConfig(buttonColorInput);

    expect(result.component_type).toEqual('button');
    expect(result.style_property).toEqual('background-color');
    expect(result.style_value).toEqual('red');
    expect(typeof result.id).toEqual('number');
  });
});
