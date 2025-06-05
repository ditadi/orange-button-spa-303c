
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { uiConfigTable } from '../db/schema';
import { getUIConfig } from '../handlers/get_ui_config';

describe('getUIConfig', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should get UI config for specific component', async () => {
    // Create test UI config
    await db.insert(uiConfigTable)
      .values({
        component_type: 'button',
        component_id: 'main-button',
        style_property: 'color',
        style_value: 'red'
      })
      .execute();

    const result = await getUIConfig('button', 'main-button');

    expect(result).toHaveLength(1);
    expect(result[0].component_type).toEqual('button');
    expect(result[0].component_id).toEqual('main-button');
    expect(result[0].style_property).toEqual('color');
    expect(result[0].style_value).toEqual('red');
    expect(result[0].id).toBeDefined();
    expect(result[0].created_at).toBeInstanceOf(Date);
    expect(result[0].updated_at).toBeInstanceOf(Date);
  });

  it('should return multiple configs for same component', async () => {
    // Create multiple style configs for same component
    await db.insert(uiConfigTable)
      .values([
        {
          component_type: 'button',
          component_id: 'main-button',
          style_property: 'color',
          style_value: 'red'
        },
        {
          component_type: 'button',
          component_id: 'main-button',
          style_property: 'font-size',
          style_value: '16px'
        }
      ])
      .execute();

    const result = await getUIConfig('button', 'main-button');

    expect(result).toHaveLength(2);
    expect(result.find(r => r.style_property === 'color')?.style_value).toEqual('red');
    expect(result.find(r => r.style_property === 'font-size')?.style_value).toEqual('16px');
  });

  it('should return empty array when no config found', async () => {
    const result = await getUIConfig('button', 'nonexistent-button');

    expect(result).toHaveLength(0);
  });

  it('should filter by both component type and id', async () => {
    // Create configs for different components
    await db.insert(uiConfigTable)
      .values([
        {
          component_type: 'button',
          component_id: 'button1',
          style_property: 'color',
          style_value: 'red'
        },
        {
          component_type: 'button',
          component_id: 'button2',
          style_property: 'color',
          style_value: 'blue'
        },
        {
          component_type: 'input',
          component_id: 'button1',
          style_property: 'color',
          style_value: 'green'
        }
      ])
      .execute();

    const result = await getUIConfig('button', 'button1');

    expect(result).toHaveLength(1);
    expect(result[0].component_type).toEqual('button');
    expect(result[0].component_id).toEqual('button1');
    expect(result[0].style_value).toEqual('red');
  });
});
