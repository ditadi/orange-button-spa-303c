
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { trpc } from '@/utils/trpc';
import { useState, useEffect, useCallback } from 'react';
import type { UIConfig, CreateUIConfigInput } from '../../server/src/schema';

function App() {
  const [configs, setConfigs] = useState<UIConfig[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonColor, setButtonColor] = useState('');

  // Form state for creating new UI config
  const [formData, setFormData] = useState<CreateUIConfigInput>({
    component_type: 'button',
    component_id: 'main-button',
    style_property: 'background-color',
    style_value: 'red'
  });

  const loadUIConfigs = useCallback(async () => {
    try {
      const result = await trpc.getUIConfig.query({
        componentType: 'button',
        componentId: 'main-button'
      });
      setConfigs(result);
      
      // Find background-color config to apply to button
      const colorConfig = result.find(config => 
        config.style_property === 'background-color'
      );
      if (colorConfig) {
        setButtonColor(colorConfig.style_value);
      }
    } catch (error) {
      console.error('Failed to load UI configs:', error);
    }
  }, []);

  useEffect(() => {
    loadUIConfigs();
  }, [loadUIConfigs]);

  const handleCreateConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await trpc.createUIConfig.mutate(formData);
      setConfigs((prev: UIConfig[]) => [...prev, response]);
      
      // If this config is for background-color, update button color
      if (response.style_property === 'background-color') {
        setButtonColor(response.style_value);
      }
    } catch (error) {
      console.error('Failed to create UI config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickColorChange = async (color: string) => {
    setIsLoading(true);
    try {
      const configData: CreateUIConfigInput = {
        component_type: 'button',
        component_id: 'main-button',
        style_property: 'background-color',
        style_value: color
      };
      
      const response = await trpc.createUIConfig.mutate(configData);
      setConfigs((prev: UIConfig[]) => [...prev, response]);
      setButtonColor(color);
    } catch (error) {
      console.error('Failed to update button color:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">🎨 UI Configuration Manager</h1>
      
      {/* Demo Button Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>🔘 Demo Button</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button 
            style={buttonColor ? { backgroundColor: buttonColor, color: 'white' } : {}}
            className="px-8 py-4 text-lg"
          >
            click here
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>⚡ Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={() => handleQuickColorChange('red')}
              disabled={isLoading}
              variant="outline"
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Make Red 🔴
            </Button>
            <Button 
              onClick={() => handleQuickColorChange('blue')}
              disabled={isLoading}
              variant="outline"
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Make Blue 🔵
            </Button>
            <Button 
              onClick={() => handleQuickColorChange('green')}
              disabled={isLoading}
              variant="outline"
              className="bg-green-500 text-white hover:bg-green-600"
            >
              Make Green 🟢
            </Button>
            <Button 
              onClick={() => handleQuickColorChange('purple')}
              disabled={isLoading}
              variant="outline"
              className="bg-purple-500 text-white hover:bg-purple-600"
            >
              Make Purple 🟣
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Custom Configuration Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>⚙️ Custom Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateConfig} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="component_type">Component Type</Label>
                <Input
                  id="component_type"
                  value={formData.component_type}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData((prev: CreateUIConfigInput) => ({ ...prev, component_type: e.target.value }))
                  }
                  placeholder="e.g., button, input, card"
                  required
                />
              </div>
              <div>
                <Label htmlFor="component_id">Component ID</Label>
                <Input
                  id="component_id"
                  value={formData.component_id}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData((prev: CreateUIConfigInput) => ({ ...prev, component_id: e.target.value }))
                  }
                  placeholder="e.g., main-button, header-nav"
                  required
                />
              </div>
              <div>
                <Label htmlFor="style_property">Style Property</Label>
                <Input
                  id="style_property"
                  value={formData.style_property}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData((prev: CreateUIConfigInput) => ({ ...prev, style_property: e.target.value }))
                  }
                  placeholder="e.g., background-color, font-size"
                  required
                />
              </div>
              <div>
                <Label htmlFor="style_value">Style Value</Label>
                <Input
                  id="style_value"
                  value={formData.style_value}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData((prev: CreateUIConfigInput) => ({ ...prev, style_value: e.target.value }))
                  }
                  placeholder="e.g., red, 16px, bold"
                  required
                />
              </div>
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? '⏳ Creating...' : '✨ Create Configuration'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Current Configurations */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Current Configurations</CardTitle>
        </CardHeader>
        <CardContent>
          {configs.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              🎯 No configurations yet. Create one above to style your components!
            </p>
          ) : (
            <div className="space-y-3">
              {configs.map((config: UIConfig) => (
                <div key={config.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Type:</span> {config.component_type}
                    </div>
                    <div>
                      <span className="font-medium">ID:</span> {config.component_id}
                    </div>
                    <div>
                      <span className="font-medium">Property:</span> {config.style_property}
                    </div>
                    <div>
                      <span className="font-medium">Value:</span> 
                      <span className="ml-1 px-2 py-1 bg-white rounded border">
                        {config.style_value}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    Created: {config.created_at.toLocaleDateString()} at {config.created_at.toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
