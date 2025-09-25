import React, { useState } from 'react';
import { Save, Plus } from 'lucide-react';

interface FlowEditorProps {
  data?: any;
}

const FlowEditor: React.FC<FlowEditorProps> = ({ data }) => {
  const [flowData, setFlowData] = useState({
    name: data?.name || 'New Flow',
    category: data?.category || '',
    description: data?.description || '',
    type: data?.type || 'Elementary flow',
    unit: data?.unit || '',
    formula: data?.formula || ''
  });

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Flow Editor</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Save className="h-4 w-4" />
            <span>Save</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={flowData.name}
                onChange={(e) => setFlowData({...flowData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={flowData.type}
                onChange={(e) => setFlowData({...flowData, type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Elementary flow">Elementary flow</option>
                <option value="Product flow">Product flow</option>
                <option value="Waste flow">Waste flow</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <input
              type="text"
              value={flowData.category}
              onChange={(e) => setFlowData({...flowData, category: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Emissions/Air, Materials/Metals"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={flowData.description}
              onChange={(e) => setFlowData({...flowData, description: e.target.value})}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reference Unit</label>
              <input
                type="text"
                value={flowData.unit}
                onChange={(e) => setFlowData({...flowData, unit: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., kg, kWh, m3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Chemical Formula</label>
              <input
                type="text"
                value={flowData.formula}
                onChange={(e) => setFlowData({...flowData, formula: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., CO2, H2O"
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Flow Properties</h3>
            <p className="text-sm text-blue-700 mb-3">Define the quantitative properties of this flow</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Property</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowEditor;