import React, { useState } from 'react';
import { Save, Play, BarChart3 } from 'lucide-react';

const ProjectEditor = ({ data }) => {
  const [projectData, setProjectData] = useState({
    name: data?.name || 'New Project',
    description: data?.description || '',
    goal: data?.goal || '',
    scope: data?.scope || '',
    functionalUnit: data?.functionalUnit || ''
  });

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Project Editor</h2>
          <div className="flex items-center space-x-3">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
              <Play className="h-4 w-4" />
              <span>Run Analysis</span>
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Save className="h-4 w-4" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl space-y-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Project Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                <input
                  type="text"
                  value={projectData.name}
                  onChange={(e) => setProjectData({...projectData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={projectData.description}
                  onChange={(e) => setProjectData({...projectData, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Goal & Scope Definition</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Goal of the Study</label>
                <textarea
                  value={projectData.goal}
                  onChange={(e) => setProjectData({...projectData, goal: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Define the intended application, reasons for carrying out the study, intended audience..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Scope of the Study</label>
                <textarea
                  value={projectData.scope}
                  onChange={(e) => setProjectData({...projectData, scope: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Define the product system, functions, functional unit, system boundaries..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Functional Unit</label>
                <input
                  type="text"
                  value={projectData.functionalUnit}
                  onChange={(e) => setProjectData({...projectData, functionalUnit: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 1 kWh of electricity, 1 kg of product"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Product Systems</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-600 text-center">No product systems added yet</p>
            </div>
            <button className="mt-3 inline-flex items-center px-3 py-1.5 border border-blue-600 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-50">
              + Add Product System
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Impact Assessment Methods</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                <div>
                  <h4 className="font-medium">IPCC 2021 GWP100</h4>
                  <p className="text-sm text-gray-500">Global Warming Potential</p>
                </div>
                <div className="flex space-x-1">
                  <input type="checkbox" className="rounded text-blue-600" checked />
                </div>
              </div>
            </div>
            <button className="mt-3 inline-flex items-center px-3 py-1.5 border border-blue-600 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-50">
              + Add Impact Assessment Method
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectEditor;