import React, { useState } from 'react';
import { Save, Plus, Trash2, Calculator } from 'lucide-react';

interface ProcessEditorProps {
  data?: any;
}

const ProcessEditor: React.FC<ProcessEditorProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [processData, setProcessData] = useState({
    name: data?.name || 'New Process',
    category: data?.category || '',
    description: data?.description || '',
    location: data?.location || '',
    inputs: data?.inputs || [],
    outputs: data?.outputs || [],
    parameters: data?.parameters || []
  });

  const tabs = [
    { id: 'general', label: 'General Information' },
    { id: 'inputs', label: 'Inputs' },
    { id: 'outputs', label: 'Outputs' },
    { id: 'allocation', label: 'Allocation' },
    { id: 'parameters', label: 'Parameters' },
    { id: 'documentation', label: 'Documentation' }
  ];

  const renderGeneralTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
          <input
            type="text"
            value={processData.name}
            onChange={(e) => setProcessData({...processData, name: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={processData.category}
            onChange={(e) => setProcessData({...processData, category: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select category</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Transportation">Transportation</option>
            <option value="Energy">Energy</option>
            <option value="End-of-Life">End-of-Life</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={processData.description}
          onChange={(e) => setProcessData({...processData, description: e.target.value})}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
        <input
          type="text"
          value={processData.location}
          onChange={(e) => setProcessData({...processData, location: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., Europe, Global, US"
        />
      </div>
    </div>
  );

  const renderInputsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Process Inputs</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Input</span>
        </button>
      </div>
      
      <div className="bg-gray-50 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Flow</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Amount</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Unit</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="px-4 py-3 text-sm text-gray-900">Electricity, grid mix</td>
              <td className="px-4 py-3 text-sm text-gray-900">45.2</td>
              <td className="px-4 py-3 text-sm text-gray-900">kWh</td>
              <td className="px-4 py-3">
                <button className="text-red-600 hover:text-red-800">
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm text-gray-900">Silicon, raw</td>
              <td className="px-4 py-3 text-sm text-gray-900">1.0</td>
              <td className="px-4 py-3 text-sm text-gray-900">kg</td>
              <td className="px-4 py-3">
                <button className="text-red-600 hover:text-red-800">
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOutputsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Process Outputs</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Output</span>
        </button>
      </div>
      
      <div className="bg-gray-50 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Flow</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Amount</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Unit</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Type</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="px-4 py-3 text-sm text-gray-900">Silicon, purified</td>
              <td className="px-4 py-3 text-sm text-gray-900">0.95</td>
              <td className="px-4 py-3 text-sm text-gray-900">kg</td>
              <td className="px-4 py-3">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Product</span>
              </td>
              <td className="px-4 py-3">
                <button className="text-red-600 hover:text-red-800">
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm text-gray-900">CO2, fossil</td>
              <td className="px-4 py-3 text-sm text-gray-900">12.4</td>
              <td className="px-4 py-3 text-sm text-gray-900">kg</td>
              <td className="px-4 py-3">
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Emission</span>
              </td>
              <td className="px-4 py-3">
                <button className="text-red-600 hover:text-red-800">
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralTab();
      case 'inputs':
        return renderInputsTab();
      case 'outputs':
        return renderOutputsTab();
      case 'allocation':
        return <div className="text-gray-500">Allocation settings will be implemented here</div>;
      case 'parameters':
        return <div className="text-gray-500">Process parameters will be implemented here</div>;
      case 'documentation':
        return <div className="text-gray-500">Documentation section will be implemented here</div>;
      default:
        return renderGeneralTab();
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Process Editor</h2>
          <div className="flex items-center space-x-3">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
              <Calculator className="h-4 w-4" />
              <span>Calculate</span>
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Save className="h-4 w-4" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ProcessEditor;