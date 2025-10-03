import React, { useState, useEffect } from 'react';
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
  FileText,
  Loader,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  ChevronRight,
  Move
} from 'lucide-react';

// Helper function for API calls
const API_URL = 'https://perfect-earliest-gsm-programmers.trycloudflare.com/api';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [draggedStep, setDraggedStep] = useState(null);
  const [expandedSteps, setExpandedSteps] = useState({});
  
  // Enhanced new template state with process steps
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    category: 'custom',
    parameters: {},
    processSteps: [] // Array of process steps with configuration
  });

  // Fetch templates from the backend on component mount
  useEffect(() => {
    fetchTemplates();
  }, []);
  
  // Function to fetch templates from the database
  const fetchTemplates = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/templates`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch templates: ${response.statusText}`);
      }
      
      const data = await response.json();
      setTemplates(data.templates || []);
      
    } catch (err) {
      console.error('Error fetching templates:', err);
      // setError('Failed to load templates from database.');
      // Initialize with empty templates rather than falling back to local ones
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to save template to the database
  const saveTemplateToDatabase = async (template) => {
    setLoading(true);
    setError(null);
    
    try {
      const isUpdate = !!template.id && !template.id.startsWith('local-');
      const url = isUpdate 
        ? `${API_URL}/templates/${template.id}`
        : `${API_URL}/templates`;
      
      const method = isUpdate ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          // Add auth header if user is logged in
          ...localStorage.getItem('authToken') ? 
            { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` } : {}
        },
        body: JSON.stringify(template)
      });
      
      if (!response.ok) {
        // throw new Error(`Failed to save template: ${response.statusText}`);
      }
      
      const savedTemplate = await response.json();
      
      // Update local state
      if (isUpdate) {
        setTemplates(prev => prev.map(t => t.id === savedTemplate.id ? savedTemplate : t));
      } else {
        setTemplates(prev => [...prev, savedTemplate]);
      }
      
      return savedTemplate;
      
    } catch (err) {
      console.error('Error saving template:', err);
      
      // Fall back to local saving
      const localTemplate = {
        ...template,
        id: template.id || `local-${Date.now()}`,
        updatedAt: new Date().toISOString()
      };
      
      // Update local state
      if (template.id) {
        setTemplates(prev => prev.map(t => t.id === template.id ? localTemplate : t));
      } else {
        setTemplates(prev => [...prev, localTemplate]);
      }
      
      return localTemplate;
    } finally {
      setLoading(false);
    }
  };
  
  // Function to delete template from the database
  const deleteTemplateFromDatabase = async (templateId) => {
    setLoading(true);
    setError(null);
    
    try {
      // Skip API call for local templates
      if (templateId.startsWith('local-')) {
        setTemplates(prev => prev.filter(t => t.id !== templateId));
        return true;
      }
      
      const response = await fetch(`${API_URL}/templates/${templateId}`, {
        method: 'DELETE',
        headers: {
          // Add auth header if user is logged in
          ...localStorage.getItem('authToken') ? 
            { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` } : {}
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete template: ${response.statusText}`);
      }
      
      // Update local state
      setTemplates(prev => prev.filter(t => t.id !== templateId));
      return true;
      
    } catch (err) {
      console.error('Error deleting template:', err);
      setError('Failed to delete template from database.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Use only templates from the database
  const allTemplates = [...templates];

  // Function to handle creating a new template
  const handleCreateTemplate = async () => {
    if (!newTemplate.name.trim()) {
      return;
    }
    
    // Create process steps from LCA form if not already defined
    let processSteps = newTemplate.processSteps;
    if (processSteps.length === 0 && currentParameters) {
      // Generate process steps from current parameters
      processSteps = generateProcessStepsFromParameters(currentParameters);
    }
    
    const template = {
      ...newTemplate,
      processSteps,
      parameters: currentParameters,
      createdAt: new Date().toISOString()
    };
    
    // Save to database and get saved template
    const savedTemplate = await saveTemplateToDatabase(template);
    
    // Call parent handler
    if (onCreateTemplate) {
      onCreateTemplate(savedTemplate);
    }
    
    // Reset form
    setNewTemplate({
      name: '',
      description: '',
      category: 'custom',
      parameters: {},
      processSteps: []
    });
    setShowCreateForm(false);
  };

  // Generate process steps from LCA form parameters
  const generateProcessStepsFromParameters = (params) => {
    const steps = [];
    
    // Raw Materials step
    if (params.metalType || params.miningLocation || params.oreGrade) {
      steps.push({
        id: `step-${Date.now()}-1`,
        name: 'Raw Material',
        description: `Extraction of ${params.metalType || 'metal'} ore`,
        inputs: {
          metalType: params.metalType,
          miningLocation: params.miningLocation,
          oreGrade: params.oreGrade,
          energyConsumptionMining: params.energyConsumptionMining,
          waterConsumptionMining: params.waterConsumptionMining,
          landUse: params.landUse
        }
      });
    }
    
    // Processing step
    if (params.energySource || params.processingRoute || params.recoveryRate) {
      steps.push({
        id: `step-${Date.now()}-2`,
        name: 'Processing',
        description: `Processing of ${params.metalType || 'metal'}`,
        inputs: {
          processingRoute: params.processingRoute,
          energySource: params.energySource,
          energyConsumptionProcessing: params.energyConsumptionProcessing,
          waterConsumptionProcessing: params.waterConsumptionProcessing,
          recoveryRate: params.recoveryRate,
          recycledInputRate: params.recycledInputRate
        }
      });
    }
    
    // Manufacturing step
    if (params.manufacturingWaste !== undefined) {
      steps.push({
        id: `step-${Date.now()}-3`,
        name: 'Manufacturing',
        description: 'Manufacturing and assembly',
        inputs: {
          manufacturingWaste: params.manufacturingWaste,
          energyConsumptionManufacturing: params.energyConsumptionManufacturing
        }
      });
    }
    
    // Transport step
    if (params.transportMode || params.transportDistances) {
      steps.push({
        id: `step-${Date.now()}-4`,
        name: 'Distribution',
        description: 'Product distribution and logistics',
        inputs: {
          transportMode: params.transportMode,
          transportDistances: params.transportDistances,
          packaging: params.packaging
        }
      });
    }
    
    // Use phase
    if (params.productLifetime) {
      steps.push({
        id: `step-${Date.now()}-5`,
        name: 'Use Phase',
        description: 'Product use phase',
        inputs: {
          productLifetime: params.productLifetime,
          energyConsumptionUse: params.energyConsumptionUse
        }
      });
    }
    
    // End of life
    if (params.recyclingRate || params.reuseRate || params.disposalRoute) {
      steps.push({
        id: `step-${Date.now()}-6`,
        name: 'End of Life',
        description: 'End of life management',
        inputs: {
          recyclingRate: params.recyclingRate,
          reuseRate: params.reuseRate,
          disposalRoute: params.disposalRoute
        }
      });
    }
    
    // Impact metrics
    if (params.globalWarmingPotential || params.acidificationPotential) {
      steps.push({
        id: `step-${Date.now()}-7`,
        name: 'Impact Analysis',
        description: 'Environmental impact metrics',
        inputs: {
          globalWarmingPotential: params.globalWarmingPotential,
          acidificationPotential: params.acidificationPotential,
          eutrophicationPotential: params.eutrophicationPotential,
          waterScarcityFootprint: params.waterScarcityFootprint
        }
      });
    }
    
    return steps;
  };

  // Function to handle selecting a template
  const handleSelectTemplate = (template) => {
    if (onSelectTemplate) {
      onSelectTemplate(template);
    }
  };

  // Function to handle editing a template
  const handleEditTemplate = (template) => {
    setEditingTemplate(template);
    setNewTemplate({
      name: template.name,
      description: template.description,
      category: template.category,
      parameters: template.parameters,
      processSteps: template.processSteps || []
    });
  };

  // Function to save edited template
  const handleSaveEdit = async () => {
    if (!editingTemplate) return;
    
    const updatedTemplate = {
      ...editingTemplate,
      ...newTemplate,
      updatedAt: new Date().toISOString()
    };
    
    // Save to database
    const savedTemplate = await saveTemplateToDatabase(updatedTemplate);
    
    // Call parent handler
    if (onSaveTemplate) {
      onSaveTemplate(savedTemplate);
    }
    
    // Reset state
    setEditingTemplate(null);
    setNewTemplate({
      name: '',
      description: '',
      category: 'custom',
      parameters: {},
      processSteps: []
    });
  };
  
  // Function to handle deleting a template
  const handleDeleteTemplate = async (templateId) => {
    if (!confirm('Are you sure you want to delete this template?')) {
      return;
    }
    
    const success = await deleteTemplateFromDatabase(templateId);
    
    if (success && onDeleteTemplate) {
      onDeleteTemplate(templateId);
    }
  };

  // Add a new step to the template being created/edited
  const addProcessStep = () => {
    const newStep = {
      id: `step-${Date.now()}`,
      name: 'New Process Step',
      description: 'Description of this process step',
      inputs: {}
    };
    
    setNewTemplate(prev => ({
      ...prev,
      processSteps: [...prev.processSteps, newStep]
    }));
    
    // Auto-expand the new step
    setExpandedSteps(prev => ({
      ...prev,
      [newStep.id]: true
    }));
  };

  // Remove a process step
  const removeProcessStep = (stepId) => {
    setNewTemplate(prev => ({
      ...prev,
      processSteps: prev.processSteps.filter(step => step.id !== stepId)
    }));
  };

  // Update a process step
  const updateProcessStep = (stepId, updatedData) => {
    setNewTemplate(prev => ({
      ...prev,
      processSteps: prev.processSteps.map(step => 
        step.id === stepId ? { ...step, ...updatedData } : step
      )
    }));
  };

  // Move a process step up or down
  const moveProcessStep = (stepId, direction) => {
    const steps = [...newTemplate.processSteps];
    const index = steps.findIndex(step => step.id === stepId);
    
    if (index < 0) return;
    
    if (direction === 'up' && index > 0) {
      // Swap with previous
      [steps[index], steps[index - 1]] = [steps[index - 1], steps[index]];
    } else if (direction === 'down' && index < steps.length - 1) {
      // Swap with next
      [steps[index], steps[index + 1]] = [steps[index + 1], steps[index]];
    }
    
    setNewTemplate(prev => ({
      ...prev,
      processSteps: steps
    }));
  };

  // Toggle expanding/collapsing a step
  const toggleStepExpansion = (stepId) => {
    setExpandedSteps(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  // Handle drag start
  const handleDragStart = (e, step) => {
    setDraggedStep(step);
    e.dataTransfer.setData('text/plain', step.id);
    // Make the drag image transparent
    const dragImage = new Image();
    e.dataTransfer.setDragImage(dragImage, 0, 0);
  };

  // Handle drag over
  const handleDragOver = (e, targetStep) => {
    e.preventDefault();
    if (!draggedStep || draggedStep.id === targetStep.id) return;
    
    const draggedIndex = newTemplate.processSteps.findIndex(step => step.id === draggedStep.id);
    const targetIndex = newTemplate.processSteps.findIndex(step => step.id === targetStep.id);
    
    if (draggedIndex !== targetIndex) {
      const newSteps = [...newTemplate.processSteps];
      newSteps.splice(draggedIndex, 1);
      newSteps.splice(targetIndex, 0, draggedStep);
      
      setNewTemplate(prev => ({
        ...prev,
        processSteps: newSteps
      }));
    }
  };

  // Handle drag end
  const handleDragEnd = () => {
    setDraggedStep(null);
  };

  // Get category icon and color
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

  // Render the process step editor
  const renderProcessStepEditor = () => {
    if (!newTemplate.processSteps || newTemplate.processSteps.length === 0) {
      return (
        <div className="border border-dashed border-gray-300 rounded-md p-8 text-center">
          <p className="text-gray-500 mb-4">No process steps defined yet</p>
          <button
            onClick={addProcessStep}
            className="bg-blue-50 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100"
          >
            <Plus className="h-4 w-4 inline mr-2" />
            Add First Process Step
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-medium text-gray-700">Process Flow Steps</h4>
          <button
            onClick={addProcessStep}
            className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md hover:bg-blue-100 text-sm flex items-center"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Step
          </button>
        </div>
        
        {newTemplate.processSteps.map((step, index) => (
          <div 
            key={step.id}
            className={`border rounded-md bg-white ${draggedStep?.id === step.id ? 'border-blue-500 shadow-md opacity-70' : 'border-gray-200'}`}
            draggable={true}
            onDragStart={(e) => handleDragStart(e, step)}
            onDragOver={(e) => handleDragOver(e, step)}
            onDragEnd={handleDragEnd}
          >
            <div className="px-4 py-3 flex items-center justify-between cursor-pointer"
                onClick={() => toggleStepExpansion(step.id)}>
              <div className="flex items-center">
                <div className="bg-blue-100 text-blue-600 rounded-full h-6 w-6 flex items-center justify-center mr-3">
                  {index + 1}
                </div>
                <div className="font-medium">{step.name}</div>
              </div>
              <div className="flex items-center">
                <button
                  onClick={(e) => { e.stopPropagation(); moveProcessStep(step.id, 'up'); }}
                  disabled={index === 0}
                  className={`p-1 rounded-md ${index === 0 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); moveProcessStep(step.id, 'down'); }}
                  disabled={index === newTemplate.processSteps.length - 1}
                  className={`p-1 rounded-md ${index === newTemplate.processSteps.length - 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
                <Move className="h-4 w-4 text-gray-400 ml-2" />
                <button
                  onClick={(e) => { e.stopPropagation(); removeProcessStep(step.id); }}
                  className="p-1 rounded-md text-red-500 hover:bg-red-50 ml-2"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                {expandedSteps[step.id] ? (
                  <ChevronDown className="h-4 w-4 ml-2" />
                ) : (
                  <ChevronRight className="h-4 w-4 ml-2" />
                )}
              </div>
            </div>
            
            {expandedSteps[step.id] && (
              <div className="px-4 pb-3 pt-0 border-t border-gray-100">
                <div className="grid grid-cols-1 gap-3 mt-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Step Name</label>
                    <input
                      type="text"
                      value={step.name}
                      onChange={(e) => updateProcessStep(step.id, { name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={step.description}
                      onChange={(e) => updateProcessStep(step.id, { description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      rows="2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Input Parameters</label>
                    <div className="border border-gray-200 rounded-md bg-gray-50 p-3 text-sm">
                      {/* Dynamically generated input fields based on step type */}
                      {Object.entries(step.inputs || {}).map(([key, value]) => (
                        <div key={key} className="flex items-center mb-2 last:mb-0">
                          <div className="w-1/3 text-gray-600">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</div>
                          <input
                            type={typeof value === 'number' ? 'number' : 'text'}
                            value={value}
                            onChange={(e) => {
                              const newValue = typeof value === 'number' ? 
                                parseFloat(e.target.value) : e.target.value;
                              
                              updateProcessStep(step.id, { 
                                inputs: {
                                  ...step.inputs,
                                  [key]: newValue
                                }
                              });
                            }}
                            className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                      ))}
                      
                      {/* Add new parameter button */}
                      <button
                        className="mt-2 text-xs text-blue-600 hover:text-blue-800 flex items-center"
                        onClick={() => {
                          const paramName = prompt('Enter parameter name:');
                          if (paramName) {
                            updateProcessStep(step.id, { 
                              inputs: {
                                ...step.inputs,
                                [paramName]: ''
                              }
                            });
                          }
                        }}
                      >
                        <Plus className="h-3 w-3 mr-1" /> Add Parameter
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
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
              <p className="text-sm text-gray-600">Create and manage reusable LCA process flows</p>
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
        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center mb-4">
            <Loader className="animate-spin h-5 w-5 text-blue-500 mr-3" />
            <span className="text-gray-600">Loading templates...</span>
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-400 mr-3 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        
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
                  setNewTemplate({
                    name: '',
                    description: '',
                    category: 'custom',
                    parameters: {},
                    processSteps: []
                  });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <option value="mining">Mining & Extraction</option>
                    <option value="recycling">Recycling & End of Life</option>
                  </select>
                </div>
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
              
              {/* Process Steps Editor */}
              <div className="mt-6">
                <h4 className="font-medium text-gray-800 mb-3">Template Process Flow</h4>
                {renderProcessStepEditor()}
              </div>
              
              {/* Action buttons */}
              <div className="flex space-x-3 pt-4">
                {/* Import from current form */}
                {Object.keys(currentParameters).length > 0 && (
                  <button
                    onClick={() => {
                      // Import process steps from current form parameters
                      const processSteps = generateProcessStepsFromParameters(currentParameters);
                      setNewTemplate(prev => ({
                        ...prev,
                        parameters: currentParameters,
                        processSteps
                      }));
                    }}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 flex items-center space-x-2"
                  >
                    <Copy className="h-4 w-4" />
                    <span>Import from Current Form</span>
                  </button>
                )}
                
                <button
                  onClick={editingTemplate ? handleSaveEdit : handleCreateTemplate}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
                  disabled={!newTemplate.name.trim()}
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
                
                {(template.id.startsWith('custom-') || template.id.startsWith('local-')) && (
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEditTemplate(template)}
                      className="text-gray-400 hover:text-blue-600"
                      title="Edit template"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="text-gray-400 hover:text-red-600"
                      title="Delete template"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{template.description}</p>
              
              {/* Process Flow Preview */}
              <div className="mb-4">
                <h4 className="text-xs font-medium text-gray-700 mb-2">Process Flow:</h4>
                {template.processSteps && template.processSteps.length > 0 ? (
                  <div className="bg-gray-50 p-2 rounded-md">
                    {template.processSteps.slice(0, 3).map((step, index) => (
                      <div key={step.id} className="flex items-center text-xs py-1">
                        <div className="bg-blue-100 text-blue-600 rounded-full h-4 w-4 flex items-center justify-center mr-2 text-[10px]">
                          {index + 1}
                        </div>
                        <span className="truncate">{step.name}</span>
                      </div>
                    ))}
                    {template.processSteps.length > 3 && (
                      <div className="text-xs text-gray-500 pl-6 pt-1">
                        +{template.processSteps.length - 3} more steps
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-gray-500">No process steps defined</div>
                )}
              </div>
              
              {/* Parameter Preview */}
              <div className="mb-4">
                <h4 className="text-xs font-medium text-gray-700 mb-2">Parameters Preview:</h4>
                <div className="space-y-1">
                  {Object.entries(template.parameters || {}).slice(0, 3).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-xs">
                      <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                      <span className="text-gray-700 truncate ml-2 max-w-32">{value}</span>
                    </div>
                  ))}
                  {Object.keys(template.parameters || {}).length > 3 && (
                    <div className="text-xs text-gray-400">
                      +{Object.keys(template.parameters || {}).length - 3} more parameters
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

        {/* Empty state when no templates exist */}
        {allTemplates.length === 0 && !loading && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No templates yet</h3>
            <p className="mt-2 text-gray-600">Click on "New Template" to create your first template</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors mx-auto"
            >
              <Plus className="h-4 w-4" />
              <span>New Template</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlowTemplates;