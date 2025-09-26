import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

const LCAForm = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Metal Information
    metalType: '',
    miningLocation: '',
    oreGrade: '',
    productionVolume: '',
    functionalUnit: '',
    
    // Step 2: Mining & Ore Extraction
    energyConsumptionMining: '',
    waterConsumptionMining: '',
    emissionsMining: '',
    landUse: '',
    
    // Step 3: Processing & Energy
    transportToProcessing: '',
    energySource: '',
    energyConsumptionProcessing: '',
    processingRoute: '',
    recycledInputRate: '',
    chemicalInputs: '',
    recoveryRate: '',
    
    // Step 4: Transport & Supply Chain
    transportDistances: '',
    transportMode: '',
    packaging: '',
    
    // Step 5: Use Phase
    productLifetime: '',
    
    // Step 6: End-of-Life
    reuseRate: '',
    recyclingRate: '',
    recyclingEfficiency: '',
    disposalRoute: '',
    transportDisposal: '',
    
    // Step 7: Impact Metrics
    globalWarmingPotential: '',
    acidificationPotential: '',
    eutrophicationPotential: '',
    ozoneDepletionPotential: '',
    waterScarcityFootprint: '',
    cumulativeEnergyDemand: '',
    humanToxicityPotential: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete(formData);
  };

  // Helper function to render progress steps
  const renderProgressSteps = () => {
    const steps = [
      'Metal Info',
      'Mining & Extraction',
      'Processing',
      'Transport',
      'Use Phase',
      'End of Life',
      'Impact Metrics'
    ];

    return (
      <div className="flex items-center justify-between mb-8 px-2">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = currentStep === stepNumber;
          const isCompleted = currentStep > stepNumber;
          
          return (
            <div key={stepNumber} className="flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm mb-1
                  ${isActive ? 'bg-blue-600 text-white' : 
                    isCompleted ? 'bg-green-600 text-white' : 
                    'bg-gray-200 text-gray-600'}`}
              >
                {isCompleted ? <CheckCircle className="h-5 w-5" /> : stepNumber}
              </div>
              <div className={`text-xs ${isActive ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                {step}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render form content based on current step
  const renderFormContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Metal Information</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please provide basic information about the metal and production system.
            </p>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Metal Type
              </label>
              <select
                name="metalType"
                value={formData.metalType}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                required
              >
                <option value="">Select metal type</option>
                <option value="aluminum">Aluminum</option>
                <option value="copper">Copper</option>
                <option value="gold">Gold</option>
                <option value="iron">Iron</option>
                <option value="lead">Lead</option>
                <option value="lithium">Lithium</option>
                <option value="nickel">Nickel</option>
                <option value="silver">Silver</option>
                <option value="steel">Steel</option>
                <option value="zinc">Zinc</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mining Location
              </label>
              <input
                type="text"
                name="miningLocation"
                value={formData.miningLocation}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="Country or region"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ore Grade (%)
              </label>
              <input
                type="number"
                name="oreGrade"
                value={formData.oreGrade}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                max="100"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="e.g. 0.5"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Production Volume
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="number"
                  name="productionVolume"
                  value={formData.productionVolume}
                  onChange={handleInputChange}
                  className="flex-1 min-w-0 block w-full p-2 border border-gray-300 rounded-l-md"
                  placeholder="e.g. 1000"
                />
                <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  tonnes
                </span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Functional Unit
              </label>
              <input
                type="text"
                name="functionalUnit"
                value={formData.functionalUnit}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="e.g. 1 tonne of refined metal"
              />
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Mining & Ore Extraction</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please provide information about the mining and extraction processes.
            </p>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Energy Consumption (MJ/tonne ore)
              </label>
              <input
                type="number"
                name="energyConsumptionMining"
                value={formData.energyConsumptionMining}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="e.g. 500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Water Consumption (m³/tonne ore)
              </label>
              <input
                type="number"
                name="waterConsumptionMining"
                value={formData.waterConsumptionMining}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="e.g. 50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Emissions (kg CO₂-eq/tonne ore)
              </label>
              <input
                type="number"
                name="emissionsMining"
                value={formData.emissionsMining}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="e.g. 100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Land Use (m²/tonne ore)
              </label>
              <input
                type="number"
                name="landUse"
                value={formData.landUse}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="e.g. 10"
              />
            </div>
          </div>
        );
        
      // Additional steps would go here
      // For brevity, I'll only include the final step
        
      case 7:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Impact Metrics</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please provide environmental impact indicators if available.
            </p>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Global Warming Potential (kg CO₂-eq)
              </label>
              <input
                type="number"
                name="globalWarmingPotential"
                value={formData.globalWarmingPotential}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="e.g. 10000"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Acidification Potential (kg SO₂-eq)
              </label>
              <input
                type="number"
                name="acidificationPotential"
                value={formData.acidificationPotential}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="e.g. 50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Human Toxicity Potential (CTUh)
              </label>
              <input
                type="number"
                name="humanToxicityPotential"
                value={formData.humanToxicityPotential}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="e.g. 0.05"
              />
            </div>
          </div>
        );
        
      default:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Processing step {currentStep}</h3>
            <p>This is placeholder content for step {currentStep}.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Life Cycle Assessment Form
        </h2>
        
        {renderProgressSteps()}
        
        <form onSubmit={handleSubmit}>
          {renderFormContent()}
          
          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={currentStep === 1 ? onCancel : handlePrevious}
              className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              {currentStep === 1 ? (
                'Cancel'
              ) : (
                <div className="flex items-center">
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Previous
                </div>
              )}
            </button>
            
            <button
              type="button"
              onClick={currentStep === 7 ? handleSubmit : handleNext}
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              {currentStep === 7 ? (
                'Complete LCA'
              ) : (
                <div className="flex items-center">
                  Next
                  <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LCAForm;