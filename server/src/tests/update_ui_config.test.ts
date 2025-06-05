
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { uiConfigTable } from '../db/schema';
import { type CreateUIConfigInput, type UpdateUIConfigInput } from '../schema';
import { updateUIConfig } from '../handlers/update_ui_config';
import { eq } from 'drizzle-orm';

// Test data
const testUIConfig: CreateUIConfigInput = {
  component_type: 'button',
  component_id: 'main-button',
  style_property: 'color',
  style_value: 'blue'
};

const updateInput: UpdateUIConfigInput = {
  id: 1,
  style_value: 'red'
};

describe('updateUIConfig', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should update UI configuration', async () => {
    // Create initial UI config
    const created = await db.insert(uiConfigTable)
      .values(testUIConfig)
      .returning()
      .execute();

    const configId = created[0].id;
    
    // Update the configuration
    const result = await updateUIConfig({
      id: configId,
      style_value: 'red'
    });

    // Verify updated fields
    expect(result.id).toEqual(configId);
    expect(result.component_type).toEqual('button');
    expect(result.component_id).toEqual('main-button');
    expect(result.style_property).toEqual('color');
    expect(result.style_value).toEqual('red');
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save updated configuration to database', async () => {
    // Create initial UI config
    const created = await db.insert(uiConfigTable)
      .values(testUIConfig)
      .returning()
      .execute();

    const configId = created[0].id;
    
    // Update the configuration
    await updateUIConfig({
      id: configId,
      style_value: 'red'
    });

    // Query database to verify update
    const configs = await db.select()
      .from(uiConfigTable)
      .where(eq(uiConfigTable.id, configId))
      .execute();

    expect(configs).toHaveLength(1);
    expect(configs[0].style_value).toEqual('red');
    expect(configs[0].component_type).toEqual('button');
    expect(configs[0].updated_at).toBeInstanceOf(Date);
  });

  it('should update multiple fields', async () => {
    // Create initial UI config
    const created = await db.insert(uiConfigTable)
      .values(testUIConfig)
      .returning()
      .execute();

    const configId = created[0].id;
    
    // Update multiple fields
    const result = await updateUIConfig({
      id: configId,
      component_type: 'div',
      style_property: 'background-color',
      style_value: 'green'
    });

    expect(result.component_type).toEqual('div');
    expect(result.style_property).toEqual('background-color');
    expect(result.style_value).toEqual('green');
    expect(result.component_id).toEqual('main-button'); // Unchanged
  });

  it('should throw error for non-existent configuration', async () => {
    await expect(updateUIConfig({
      id: 999,
      style_value: 'red'
    })).rejects.toThrow(/not found/i);
  });

  it('should update only provided fields', async () => {
    // Create initial UI config
    const created = await db.insert(uiConfigTable)
      .values(testUIConfig)
      .returning()
      .execute();

    const configId = created[0].id;
    const originalUpdatedAt = created[0].updated_at;
    
    // Update only style_value
    const result = await updateUIConfig({
      id: configId,
      style_value: 'red'
    });

    // Verify only style_value changed
    expect(result.style_value).toEqual('red');
    expect(result.component_type).toEqual('button');
    expect(result.component_id).toEqual('main-button');
    expect(result.style_property).toEqual('color');
    expect(result.updated_at).not.toEqual(originalUpdatedAt);
  });
});
