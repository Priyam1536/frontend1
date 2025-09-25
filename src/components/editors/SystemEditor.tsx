import React, { useState } from 'react';
import { Save, Play, GitBranch, Plus } from 'lucide-react';

interface SystemEditorProps {
  data?: any;
}

const SystemEditor: React.FC<SystemEditorProps> = ({ data }) => {
  const [systemData, setSystemData] = useState({
    name: data?.name || 'New Product System',
    description: data?.description || '',
    referenceProcess: data?.referenceProcess || '',
    targetAmount: data?.targetAmount || 1,
    targetUnit: data?.targetUnit || ''
  });

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Product System Editor</h2>
          <div className="flex items-center space-x-3">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
              <Play className="h-4 w-4" />
              <span>Calculate</span>
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Save className="h-4 w-4" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        <div className="w-1/3 border-r border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">System Properties</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={systemData.name}
                onChange={(e) => setSystemData({...systemData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={systemData.description}
                onChange={(e) => setSystemData({...systemData, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reference Process</label>
              <select
                value={systemData.referenceProcess}
                onChange={(e) => setSystemData({...systemData, referenceProcess: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select process</option>
                <option value="silicon-purification">Silicon Purification</option>
                <option value="cell-assembly">Battery Cell Assembly</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Amount</label>
                <input
                  type="number"
                  value={systemData.targetAmount}
                  onChange={(e) => setSystemData({...systemData, targetAmount: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                <input
                  type="text"
                  value={systemData.targetUnit}
                  onChange={(e) => setSystemData({...systemData, targetUnit: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="kg, kWh, etc."
                />
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h4 className="text-md font-medium text-gray-900 mb-3">System Processes</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <GitBranch className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-900">Silicon Purification</span>
                </div>
                <button className="text-red-600 hover:text-red-800 text-sm">Remove</button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <GitBranch className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-900">Transportation</span>
                </div>
                <button className="text-red-600 hover:text-red-800 text-sm">Remove</button>
              </div>
            </div>
            <button className="w-full mt-3 border-2 border-dashed border-gray-300 rounded-lg p-3 text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Process</span>
            </button>
          </div>
        </div>

        <div className="flex-1 p-6">
          <div className="h-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
            <div className="text-center">
              <GitBranch className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">System Flow Diagram</h3>
              <p className="text-gray-600 mb-4">Visual representation of your product system</p>
              <p className="text-sm text-gray-500">Add processes to see the flow diagram</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemEditor;