
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { uiConfigTable } from '../db/schema';
import { getButtonConfig, type GetButtonConfigInput } from '../handlers/get_button_config';

describe('getButtonConfig', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return default button config when no database entries exist', async () => {
    const result = await getButtonConfig();

    expect(result.color).toEqual('red');
    expect(result.text).toEqual('click here');
    expect(result.action).toBeNull();
  });

  it('should return default config for specific button ID when no entries exist', async () => {
    const input: GetButtonConfigInput = { button_id: 'my-button' };
    const result = await getButtonConfig(input);

    expect(result.color).toEqual('red');
    expect(result.text).toEqual('click here');
    expect(result.action).toBeNull();
  });

  it('should return config from database when entries exist', async () => {
    // Insert test UI config entries
    await db.insert(uiConfigTable)
      .values([
        {
          component_type: 'button',
          component_id: 'test-button',
          style_property: 'color',
          style_value: 'blue'
        },
        {
          component_type: 'button',
          component_id: 'test-button',
          style_property: 'text',
          style_value: 'custom text'
        },
        {
          component_type: 'button',
          component_id: 'test-button',
          style_property: 'action',
          style_value: 'submit'
        }
      ])
      .execute();

    const input: GetButtonConfigInput = { button_id: 'test-button' };
    const result = await getButtonConfig(input);

    expect(result.color).toEqual('blue');
    expect(result.text).toEqual('custom text');
    expect(result.action).toEqual('submit');
  });

  it('should handle partial config from database with defaults', async () => {
    // Insert only color config
    await db.insert(uiConfigTable)
      .values({
        component_type: 'button',
        component_id: 'partial-button',
        style_property: 'color',
        style_value: 'green'
      })
      .execute();

    const input: GetButtonConfigInput = { button_id: 'partial-button' };
    const result = await getButtonConfig(input);

    expect(result.color).toEqual('green');
    expect(result.text).toEqual('click here'); // Default value
    expect(result.action).toBeNull(); // Default value
  });

  it('should handle null action value correctly', async () => {
    await db.insert(uiConfigTable)
      .values({
        component_type: 'button',
        component_id: 'null-action-button',
        style_property: 'action',
        style_value: 'null'
      })
      .execute();

    const input: GetButtonConfigInput = { button_id: 'null-action-button' };
    const result = await getButtonConfig(input);

    expect(result.action).toBeNull();
  });

  it('should use default button_id when input is undefined', async () => {
    const result = await getButtonConfig();

    expect(result.color).toEqual('red');
    expect(result.text).toEqual('click here');
    expect(result.action).toBeNull();
  });
});
