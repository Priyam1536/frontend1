import React, { useState } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  Copy, 
  Play,
  GitBranch,
  Settings,
  FileText
} from 'lucide-react';

const FlowTemplates = ({ 
  flowTemplates = [], 
  onSelectTemplate, 
  onSaveTemplate, 
  onDeleteTemplate, 
  onCreateTemplate,
  currentParameters = {} 
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    category: 'custom',
    parameters: {}
  });

  // Sample default templates
  const defaultTemplates = [
    {
      id: 'renewable-energy',
      name: 'Renewable Energy Assessment',
      description: 'Standard template for solar/wind energy projects',
      category: 'energy',
      parameters: {
        projectName: 'Solar Farm Project',
        functionalUnit: '1 MWh electricity',
        systemBoundary: 'Cradle-to-Gate',
        impactCategories: ['Climate Change', 'Resource Depletion'],
        geographicScope: 'Global',
        timeHorizon: '25 years',
        allocationMethod: 'Economic'
      }
    },
    {
      id: 'manufacturing',
      name: 'Manufacturing Process',
      description: 'Template for product manufacturing LCA',
      category: 'manufacturing',
      parameters: {
        projectName: 'Product Manufacturing',
        functionalUnit: '1 unit product',
        systemBoundary: 'Cradle-to-Grave',
        impactCategories: ['Climate Change', 'Acidification', 'Eutrophication'],
        geographicScope: 'Regional',
        timeHorizon: '10 years',
        allocationMethod: 'Mass-based'
      }
    },
    {
      id: 'construction',
      name: 'Construction Materials',
      description: 'Building materials and construction impact assessment',
      category: 'construction',
      parameters: {
        projectName: 'Building Construction',
        functionalUnit: '1 m² building area',
        systemBoundary: 'Cradle-to-End-of-Life',
        impactCategories: ['Climate Change', 'Resource Depletion', 'Land Use'],
        geographicScope: 'National',
        timeHorizon: '50 years',
        allocationMethod: 'System expansion'
      }
    }
  ];

  const allTemplates = [...defaultTemplates, ...flowTemplates];

  const handleCreateTemplate = () => {
    if (newTemplate.name.trim()) {
      const template = {
        ...newTemplate,
        id: `custom-${Date.now()}`,
        parameters: currentParameters,
        createdAt: new Date().toISOString()
      };
      onCreateTemplate(template);
      setNewTemplate({ name: '', description: '', category: 'custom', parameters: {} });
      setShowCreateForm(false);
    }
  };

  const handleSelectTemplate = (template) => {
    onSelectTemplate(template);
  };

  const handleEditTemplate = (template) => {
    setEditingTemplate(template);
    setNewTemplate({
      name: template.name,
      description: template.description,
      category: template.category,
      parameters: template.parameters
    });
  };

  const handleSaveEdit = () => {
    if (editingTemplate) {
      const updatedTemplate = {
        ...editingTemplate,
        ...newTemplate,
        updatedAt: new Date().toISOString()
      };
      onSaveTemplate(updatedTemplate);
      setEditingTemplate(null);
      setNewTemplate({ name: '', description: '', category: 'custom', parameters: {} });
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'energy': return '⚡';
      case 'manufacturing': return '🏭';
      case 'construction': return '🏗️';
      default: return '📋';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'energy': return 'bg-green-100 text-green-800';
      case 'manufacturing': return 'bg-blue-100 text-blue-800';
      case 'construction': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <GitBranch className="h-6 w-6 text-blue-600" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Flow Templates</h1>
              <p className="text-sm text-gray-600">Parameter presets for quick LCA setup</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>New Template</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Create/Edit Form */}
        {(showCreateForm || editingTemplate) && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingTemplate ? 'Edit Template' : 'Create New Template'}
              </h3>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingTemplate(null);
                  setNewTemplate({ name: '', description: '', category: 'custom', parameters: {} });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template Name
                </label>
                <input
                  type="text"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter template name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="2"
                  placeholder="Describe this template"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={newTemplate.category}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="custom">Custom</option>
                  <option value="energy">Energy</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="construction">Construction</option>
                </select>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={editingTemplate ? handleSaveEdit : handleCreateTemplate}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{editingTemplate ? 'Update' : 'Save'} Template</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allTemplates.map((template) => (
            <div key={template.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{getCategoryIcon(template.category)}</div>
                  <div>
                    <h3 className="font-medium text-gray-900">{template.name}</h3>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${getCategoryColor(template.category)}`}>
                      {template.category}
                    </span>
                  </div>
                </div>
                
                {template.id.startsWith('custom-') && (
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEditTemplate(template)}
                      className="text-gray-400 hover:text-blue-600"
                      title="Edit template"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeleteTemplate(template.id)}
                      className="text-gray-400 hover:text-red-600"
                      title="Delete template"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{template.description}</p>
              
              {/* Parameter Preview */}
              <div className="mb-4">
                <h4 className="text-xs font-medium text-gray-700 mb-2">Parameters Preview:</h4>
                <div className="space-y-1">
                  {Object.entries(template.parameters).slice(0, 3).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-xs">
                      <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                      <span className="text-gray-700 truncate ml-2 max-w-32">{value}</span>
                    </div>
                  ))}
                  {Object.keys(template.parameters).length > 3 && (
                    <div className="text-xs text-gray-400">
                      +{Object.keys(template.parameters).length - 3} more parameters
                    </div>
                  )}
                </div>
              </div>
              
              <button
                onClick={() => handleSelectTemplate(template)}
                className="w-full bg-blue-50 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-100 transition-colors flex items-center justify-center space-x-2"
              >
                <Play className="h-4 w-4" />
                <span>Use Template</span>
              </button>
            </div>
          ))}
        </div>

        {allTemplates.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No templates yet</h3>
            <p className="mt-2 text-gray-600">Create your first flow template to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlowTemplates;