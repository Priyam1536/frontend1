import React, { useState, useEffect } from 'react';
import { Settings2, Save, RotateCcw, Info, AlertTriangle, CheckCircle, Upload, Download } from 'lucide-react';

const Parameters = ({ currentParameters = {}, onParametersChange }) => {
  const [activeCategory, setActiveCategory] = useState('general');
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  
  // Initialize parameters with currentParameters from flow templates
  const [parameters, setParameters] = useState({
    general: {
      defaultFunctionalUnit: 'kg',
      timeHorizon: '100',
      impactMethod: 'IPCC 2013',
      uncertaintyAnalysis: true,
      monteCarlo: false,
      numberOfIterations: 1000
    },
    mining: {
      energyIntensity: 45.2,
      waterConsumption: 15.8,
      landUseEfficiency: 0.85,
      wasteGeneration: 12.5,
      recoveryRate: 0.92,
      transportDistance: 150
    },
    processing: {
      energyMix: 'grid',
      thermalEfficiency: 0.78,
      chemicalInputs: 'standard',
      waterRecycling: 0.65,
      emissionControls: true,
      processTemperature: 1200
    },
    transport: {
      defaultMode: 'truck',
      fuelEfficiency: 8.5,
      loadFactor: 0.85,
      returnJourney: true,
      infrastructureImpact: false,
      routeOptimization: true
    },
    endOfLife: {
      recyclingRate: 0.75,
      recyclingEfficiency: 0.85,
      disposalMethod: 'landfill',
      energyRecovery: false,
      materialRecovery: true,
      treatmentEfficiency: 0.90
    }
  });

  const categories = [
    { id: 'general', label: 'General Settings', icon: Settings2 },
    { id: 'mining', label: 'Mining Parameters', icon: Settings2 },
    { id: 'processing', label: 'Processing Parameters', icon: Settings2 },
    { id: 'transport', label: 'Transport Parameters', icon: Settings2 },
    { id: 'endOfLife', label: 'End-of-Life Parameters', icon: Settings2 }
  ];

  const parameterDefinitions = {
    general: [
      { key: 'defaultFunctionalUnit', label: 'Default Functional Unit', type: 'select', options: ['kg', 'ton', 'lb'], description: 'Standard unit for reporting results' },
      { key: 'timeHorizon', label: 'Time Horizon (years)', type: 'number', description: 'Time period for impact assessment' },
      { key: 'impactMethod', label: 'Impact Assessment Method', type: 'select', options: ['IPCC 2013', 'ReCiPe 2016', 'CML 2001'], description: 'Methodology for calculating environmental impacts' },
      { key: 'uncertaintyAnalysis', label: 'Enable Uncertainty Analysis', type: 'boolean', description: 'Include uncertainty calculations in results' },
      { key: 'monteCarlo', label: 'Monte Carlo Simulation', type: 'boolean', description: 'Use Monte Carlo method for uncertainty analysis' },
      { key: 'numberOfIterations', label: 'Number of Iterations', type: 'number', description: 'Iterations for Monte Carlo simulation' }
    ],
    mining: [
      { key: 'energyIntensity', label: 'Energy Intensity (MJ/kg)', type: 'number', description: 'Energy consumption per unit of extracted material' },
      { key: 'waterConsumption', label: 'Water Consumption (L/kg)', type: 'number', description: 'Water usage per unit of extracted material' },
      { key: 'landUseEfficiency', label: 'Land Use Efficiency', type: 'number', step: 0.01, max: 1, description: 'Efficiency of land utilization (0-1)' },
      { key: 'wasteGeneration', label: 'Waste Generation (kg/kg)', type: 'number', description: 'Waste produced per unit of extracted material' },
      { key: 'recoveryRate', label: 'Recovery Rate', type: 'number', step: 0.01, max: 1, description: 'Fraction of material successfully recovered' },
      { key: 'transportDistance', label: 'Average Transport Distance (km)', type: 'number', description: 'Distance from mining site to processing facility' }
    ],
    processing: [
      { key: 'energyMix', label: 'Energy Mix', type: 'select', options: ['grid', 'renewable', 'natural_gas', 'coal'], description: 'Primary energy source for processing' },
      { key: 'thermalEfficiency', label: 'Thermal Efficiency', type: 'number', step: 0.01, max: 1, description: 'Efficiency of thermal processes (0-1)' },
      { key: 'chemicalInputs', label: 'Chemical Inputs', type: 'select', options: ['standard', 'optimized', 'minimal'], description: 'Level of chemical additives used' },
      { key: 'waterRecycling', label: 'Water Recycling Rate', type: 'number', step: 0.01, max: 1, description: 'Fraction of water recycled in process' },
      { key: 'emissionControls', label: 'Advanced Emission Controls', type: 'boolean', description: 'Use of advanced emission control technologies' },
      { key: 'processTemperature', label: 'Process Temperature (°C)', type: 'number', description: 'Operating temperature for main processes' }
    ],
    transport: [
      { key: 'defaultMode', label: 'Default Transport Mode', type: 'select', options: ['truck', 'rail', 'ship', 'pipeline'], description: 'Primary mode of transportation' },
      { key: 'fuelEfficiency', label: 'Fuel Efficiency (L/100km)', type: 'number', description: 'Fuel consumption per distance traveled' },
      { key: 'loadFactor', label: 'Load Factor', type: 'number', step: 0.01, max: 1, description: 'Average capacity utilization (0-1)' },
      { key: 'returnJourney', label: 'Include Return Journey', type: 'boolean', description: 'Account for empty return trips' },
      { key: 'infrastructureImpact', label: 'Include Infrastructure Impact', type: 'boolean', description: 'Account for infrastructure construction impacts' },
      { key: 'routeOptimization', label: 'Route Optimization', type: 'boolean', description: 'Use optimized routing algorithms' }
    ],
    endOfLife: [
      { key: 'recyclingRate', label: 'Recycling Rate', type: 'number', step: 0.01, max: 1, description: 'Fraction of material that gets recycled' },
      { key: 'recyclingEfficiency', label: 'Recycling Efficiency', type: 'number', step: 0.01, max: 1, description: 'Efficiency of recycling process (0-1)' },
      { key: 'disposalMethod', label: 'Primary Disposal Method', type: 'select', options: ['landfill', 'incineration', 'hazardous_waste'], description: 'Main method for non-recycled material disposal' },
      { key: 'energyRecovery', label: 'Energy Recovery', type: 'boolean', description: 'Recover energy from disposal processes' },
      { key: 'materialRecovery', label: 'Material Recovery', type: 'boolean', description: 'Recover materials during disposal' },
      { key: 'treatmentEfficiency', label: 'Treatment Efficiency', type: 'number', step: 0.01, max: 1, description: 'Efficiency of waste treatment processes' }
    ]
  };

  // Effect to update parameters when currentParameters changes (from flow templates)
  useEffect(() => {
    if (currentParameters && Object.keys(currentParameters).length > 0) {
      // Merge currentParameters with existing parameters
      setParameters(prev => {
        const updated = { ...prev };
        
        // Map common parameter names to our parameter structure
        const parameterMapping = {
          'projectName': ['general', 'projectName'],
          'functionalUnit': ['general', 'defaultFunctionalUnit'],
          'systemBoundary': ['general', 'systemBoundary'],
          'impactCategories': ['general', 'impactCategories'],
          'geographicScope': ['general', 'geographicScope'],
          'timeHorizon': ['general', 'timeHorizon'],
          'allocationMethod': ['general', 'allocationMethod']
        };
        
        // Apply mapped parameters
        Object.entries(currentParameters).forEach(([key, value]) => {
          if (parameterMapping[key]) {
            const [category, paramKey] = parameterMapping[key];
            if (updated[category]) {
              updated[category] = { ...updated[category], [paramKey]: value };
            }
          }
        });
        
        return updated;
      });
      
      setUnsavedChanges(true);
      
      // Notify parent of parameter changes if callback provided
      if (onParametersChange) {
        onParametersChange(parameters);
      }
    }
  }, [currentParameters]);

  const handleParameterChange = (category, key, value) => {
    const updatedParameters = {
      ...parameters,
      [category]: {
        ...parameters[category],
        [key]: value
      }
    };
    
    setParameters(updatedParameters);
    setUnsavedChanges(true);
    
    // Notify parent of parameter changes
    if (onParametersChange) {
      onParametersChange(updatedParameters);
    }
  };

  const saveParameters = () => {
    // Save parameters logic here
    setUnsavedChanges(false);
    console.log('Parameters saved:', parameters);
  };

  const resetToDefaults = () => {
    // Reset logic here
    setUnsavedChanges(false);
  };

  const exportParameters = () => {
    const dataStr = JSON.stringify(parameters, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'oresense-parameters.json';
    link.click();
  };

  const renderParameterInput = (param, category) => {
    const value = parameters[category][param.key];
    
    switch (param.type) {
      case 'boolean':
        return (
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => handleParameterChange(category, param.key, e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              {value ? 'Enabled' : 'Disabled'}
            </span>
          </label>
        );
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleParameterChange(category, param.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {param.options.map(option => (
              <option key={option} value={option}>
                {option.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
        );
      case 'number':
        return (
          <input
            type="number"
            value={value}
            step={param.step || 1}
            max={param.max}
            onChange={(e) => handleParameterChange(category, param.key, parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleParameterChange(category, param.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-full overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Model Parameters</h1>
            <p className="text-gray-600 mt-1">Configure LCA model parameters and calculation settings</p>
          </div>
          <div className="flex gap-3">
            {unsavedChanges && (
              <div className="flex items-center gap-2 px-3 py-2 bg-yellow-100 text-yellow-800 rounded-lg">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">Unsaved changes</span>
              </div>
            )}
            <button
              onClick={exportParameters}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={resetToDefaults}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button
              onClick={saveParameters}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Parameters
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Category Navigation */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-600 mb-3">Parameter Categories</h3>
            <nav className="space-y-1">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeCategory === category.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {category.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Parameter Configuration */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Settings2 className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                {categories.find(c => c.id === activeCategory)?.label}
              </h2>
            </div>

            <div className="space-y-6">
              {parameterDefinitions[activeCategory]?.map((param) => (
                <div key={param.key} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        {param.label}
                      </label>
                      {param.description && (
                        <div className="flex items-center gap-2 mb-3">
                          <Info className="w-4 h-4 text-gray-400" />
                          <p className="text-sm text-gray-600">{param.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="max-w-md">
                    {renderParameterInput(param, activeCategory)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Parameter Impact Summary */}
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Parameter Impact Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-900">Valid Parameters</p>
                  <p className="text-lg font-bold text-green-700">24/24</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                <Settings2 className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Configured Categories</p>
                  <p className="text-lg font-bold text-blue-700">5/5</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-purple-900">Optimization Score</p>
                  <p className="text-lg font-bold text-purple-700">87%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Parameters;