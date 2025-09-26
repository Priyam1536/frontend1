import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Mountain, 
  Factory, 
  Truck, 
  Timer, 
  Recycle, 
  BarChart3, 
  ArrowDownCircle,
  LayoutGrid,
  ArrowUpCircle,
  Waves,
  TreePine,
  ChevronRight,
  Zap,
  Download,
  Eye
} from 'lucide-react';

const LCAForm = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Metal Information
    metalType: '',
    miningLocation: '',
    oreGrade: '',
    productionVolume: '',
    functionalUnit: '',
    
    // Step 2: Mining & Ore Extraction
    energyConsumptionMining: '',
    energyTypeMining: '',
    waterConsumptionMining: '',
    emissionsMining: '',
    emissionsTypeMining: '',
    landUse: '',
    
    // Step 3: Processing & Energy
    transportToProcessing: '',
    transportDistanceToProcessing: '',
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
    wasteGenerated: '',
    airWaterEmissions: '',
    landUseChange: '',
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
    if (e) e.preventDefault();
    setIsCompleted(true);
    onComplete(formData);
  };

  const handleExport = () => {
    // Create a JSON blob from the form data
    const jsonData = JSON.stringify(formData, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    
    // Create a download link and trigger it
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lca-assessment-${formData.metalType || 'data'}.json`;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleView = () => {
    // Open a new modal or redirect to view the completed assessment
    // For now, we'll just show an alert with the data
    alert("View functionality will be implemented to show the full LCA assessment in a readable format.");
    console.log("LCA Assessment Data:", formData);
    
    // Here you would typically:
    // 1. Either navigate to a view page
    // 2. Or open a modal with formatted results
    // For example:
    // openModal({ type: 'lcaView', data: formData });
    // or
    // navigate('/lca/view', { state: { lcaData: formData } });
  };

  // Helper function to render progress steps
  const renderProgressSteps = () => {
    const steps = [
      { name: 'Metal Info', icon: LayoutGrid },
      { name: 'Mining & Extraction', icon: Mountain },
      { name: 'Processing', icon: Factory },
      { name: 'Transport', icon: Truck },
      { name: 'Use Phase', icon: Timer },
      { name: 'End of Life', icon: Recycle },
      { name: 'Impact Metrics', icon: BarChart3 }
    ];

    return (
      <div className="relative mb-12">
        {/* Connection line */}
        <div className="absolute top-7 left-0 right-0 h-1 bg-gray-200 z-0">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>
        
        {/* Steps */}
        <div className="flex items-center justify-between relative z-10 px-2">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = currentStep === stepNumber;
            const isCompleted = currentStep > stepNumber;
            const StepIcon = step.icon;
            
            return (
              <div key={stepNumber} className="flex flex-col items-center">
                <div 
                  className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 shadow-md transition-all duration-300
                    ${isActive ? 'bg-gradient-to-br from-blue-500 to-green-500 text-white scale-110' : 
                      isCompleted ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white' : 
                      'bg-white text-gray-400 border border-gray-200'}`}
                >
                  {isCompleted ? 
                    <CheckCircle className="h-6 w-6" /> : 
                    <StepIcon className="h-6 w-6" />
                  }
                </div>
                <div className={`text-xs font-medium text-center max-w-[80px] 
                  ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                  {step.name}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Progress percentage */}
        <div className="mt-2 text-center text-sm font-medium text-blue-600">
          {Math.round(((currentStep - 1) / (steps.length - 1)) * 100)}% Complete
        </div>
      </div>
    );
  };

  // Render form content based on current step
  const renderFormContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <div>
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-xl mb-6 border border-blue-100">
              <div className="flex items-center mb-3">
                <LayoutGrid className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-xl font-semibold text-gray-800">Metal Information</h3>
              </div>
              <p className="text-sm text-gray-600">
                Please provide basic information about the metal and production system. This data forms the foundation of your lifecycle assessment.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <LayoutGrid className="h-5 w-5 text-blue-600" />
                  </div>
                  <label className="block text-sm font-medium text-gray-700">
                    Metal Type
                  </label>
                </div>
                <select
                  name="metalType"
                  value={formData.metalType}
                  onChange={handleInputChange}
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                <div className="mt-2 text-xs text-gray-500">Select the primary metal in your product or process</div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <Mountain className="h-5 w-5 text-green-600" />
                  </div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mining Location
                  </label>
                </div>
                <input
                  type="text"
                  name="miningLocation"
                  value={formData.miningLocation}
                  onChange={handleInputChange}
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Country or region"
                />
                <div className="mt-2 text-xs text-gray-500">Location impacts transportation emissions and regional factors</div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                    <ArrowUpCircle className="h-5 w-5 text-yellow-600" /> {/* Changed from CircleArrowUp */}
                  </div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ore Grade (%)
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    name="oreGrade"
                    value={formData.oreGrade}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    max="100"
                    className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. 0.5"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-gray-500">%</span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">Higher grade ores generally require less energy for processing</div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <Factory className="h-5 w-5 text-purple-600" />
                  </div>
                  <label className="block text-sm font-medium text-gray-700">
                    Production Volume
                  </label>
                </div>
                <div className="flex rounded-md shadow-sm">
                  <input
                    type="number"
                    name="productionVolume"
                    value={formData.productionVolume}
                    onChange={handleInputChange}
                    className="flex-1 min-w-0 block w-full p-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. 1000"
                  />
                  <span className="inline-flex items-center px-4 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm font-medium">
                    tonnes
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray-500">Total production volume for the assessment period</div>
              </div>
            </div>

            <div className="mt-6">
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
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-xl mb-6 border border-blue-100">
              <div className="flex items-center mb-3">
                <Mountain className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-xl font-semibold text-gray-800">Mining & Ore Extraction</h3>
              </div>
              <p className="text-sm text-gray-600">
                Please provide information about the mining and extraction processes used to obtain the metal ore.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                    <Zap className="h-5 w-5 text-yellow-600" />
                  </div>
                  <label className="block text-sm font-medium text-gray-700">
                    Energy Consumption (MJ/tonne ore)
                  </label>
                </div>
                <input
                  type="number"
                  name="energyConsumptionMining"
                  value={formData.energyConsumptionMining}
                  onChange={handleInputChange}
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. 500"
                />
                <div className="mt-2 text-xs text-gray-500">Total energy used in mining operations per tonne of ore</div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                    <Zap className="h-5 w-5 text-yellow-600" />
                  </div>
                  <label className="block text-sm font-medium text-gray-700">
                    Energy Type
                  </label>
                </div>
                <select
                  name="energyTypeMining"
                  value={formData.energyTypeMining}
                  onChange={handleInputChange}
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select energy type</option>
                  <option value="diesel">Diesel</option>
                  <option value="electricity">Electricity</option>
                  <option value="natural_gas">Natural Gas</option>
                  <option value="mixed">Mixed Sources</option>
                </select>
                <div className="mt-2 text-xs text-gray-500">Primary energy source used in mining operations</div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <Waves className="h-5 w-5 text-blue-600" />
                  </div>
                  <label className="block text-sm font-medium text-gray-700">
                    Water Consumption (m³/tonne ore)
                  </label>
                </div>
                <input
                  type="number"
                  name="waterConsumptionMining"
                  value={formData.waterConsumptionMining}
                  onChange={handleInputChange}
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. 50"
                />
                <div className="mt-2 text-xs text-gray-500">Volume of water used in mining and processing per tonne of ore</div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                    <ArrowUpCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <label className="block text-sm font-medium text-gray-700">
                    Emissions (kg CO₂-eq/tonne ore)
                  </label>
                </div>
                <input
                  type="number"
                  name="emissionsMining"
                  value={formData.emissionsMining}
                  onChange={handleInputChange}
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. 100"
                />
                <div className="mt-2 text-xs text-gray-500">Total greenhouse gas emissions from mining operations</div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                    <ArrowUpCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <label className="block text-sm font-medium text-gray-700">
                    Emissions Type
                  </label>
                </div>
                <select
                  name="emissionsTypeMining"
                  value={formData.emissionsTypeMining}
                  onChange={handleInputChange}
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select primary emissions</option>
                  <option value="dust">Dust</option>
                  <option value="particulates">Particulates</option>
                  <option value="methane">Methane</option>
                  <option value="mixed">Mixed Emissions</option>
                </select>
                <div className="mt-2 text-xs text-gray-500">Primary type of emissions from mining operations</div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <TreePine className="h-5 w-5 text-green-600" />
                  </div>
                  <label className="block text-sm font-medium text-gray-700">
                    Land Use (m²/tonne ore)
                  </label>
                </div>
                <input
                  type="number"
                  name="landUse"
                  value={formData.landUse}
                  onChange={handleInputChange}
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. 10"
                />
                <div className="mt-2 text-xs text-gray-500">Area of land disturbed or used for mining operations</div>
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-xl mb-6 border border-blue-100">
              <div className="flex items-center mb-3">
                <Factory className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-xl font-semibold text-gray-800">Processing & Energy</h3>
              </div>
              <p className="text-sm text-gray-600">
                Please provide information about the processing and energy requirements for refining the metal.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <Truck className="h-5 w-5 text-purple-600" />
                  </div>
                  <label className="block text-sm font-medium text-gray-700">
                    Transport to Processing
                  </label>
                </div>
                <select
                  name="transportToProcessing"
                  value={formData.transportToProcessing}
                  onChange={handleInputChange}
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select transport mode</option>
                  <option value="truck">Truck</option>
                  <option value="rail">Rail</option>
                  <option value="ship">Ship</option>
                  <option value="mixed">Mixed Modes</option>
                </select>
                <div className="mt-2 text-xs text-gray-500">Primary transport mode from mine to processing facility</div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <Truck className="h-5 w-5 text-purple-600" />
                  </div>
                  <label className="block text-sm font-medium text-gray-700">
                    Transport Distance (km)
                  </label>
                </div>
                <input
                  type="number"
                  name="transportDistanceToProcessing"
                  value={formData.transportDistanceToProcessing}
                  onChange={handleInputChange}
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. 250"
                />
                <div className="mt-2 text-xs text-gray-500">Distance from mine to processing facility</div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                    <Zap className="h-5 w-5 text-yellow-600" />
                  </div>
                  <label className="block text-sm font-medium text-gray-700">
                    Energy Source
                  </label>
                </div>
                <select
                  name="energySource"
                  value={formData.energySource}
                  onChange={handleInputChange}
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select energy source</option>
                  <option value="grid">Grid Electricity</option>
                  <option value="coal">Coal</option>
                  <option value="natural_gas">Natural Gas</option>
                  <option value="renewables">Renewables</option>
                  <option value="mixed">Mixed Sources</option>
                </select>
                <div className="mt-2 text-xs text-gray-500">Primary energy source for processing operations</div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                    <Zap className="h-5 w-5 text-yellow-600" />
                  </div>
                  <label className="block text-sm font-medium text-gray-700">
                    Energy Consumption (MJ/tonne)
                  </label>
                </div>
                <input
                  type="number"
                  name="energyConsumptionProcessing"
                  value={formData.energyConsumptionProcessing}
                  onChange={handleInputChange}
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. 15000"
                />
                <div className="mt-2 text-xs text-gray-500">Energy used in smelting/refining per tonne of product</div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <Factory className="h-5 w-5 text-blue-600" />
                  </div>
                  <label className="block text-sm font-medium text-gray-700">
                    Processing Route
                  </label>
                </div>
                <select
                  name="processingRoute"
                  value={formData.processingRoute}
                  onChange={handleInputChange}
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select processing route</option>
                  <option value="primary">Primary Production</option>
                  <option value="secondary">Secondary/Recycled</option>
                  <option value="mixed">Mixed Primary/Secondary</option>
                </select>
                <div className="mt-2 text-xs text-gray-500">Type of processing route used</div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <Recycle className="h-5 w-5 text-green-600" />
                  </div>
                  <label className="block text-sm font-medium text-gray-700">
                    Recycled Input Rate (%)
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    name="recycledInputRate"
                    value={formData.recycledInputRate}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. 30"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-gray-500">%</span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">Percentage of recycled/scrap material used as input</div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                    <Factory className="h-5 w-5 text-red-600" />
                  </div>
                  <label className="block text-sm font-medium text-gray-700">
                    Chemical Inputs
                  </label>
                </div>
                <input
                  type="text"
                  name="chemicalInputs"
                  value={formData.chemicalInputs}
                  onChange={handleInputChange}
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. sulfuric acid, lime, flocculant"
                />
                <div className="mt-2 text-xs text-gray-500">Major reagents, chemicals, or fluxes used in processing</div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                    <ArrowUpCircle className="h-5 w-5 text-orange-600" />
                  </div>
                  <label className="block text-sm font-medium text-gray-700">
                    Recovery Rate (%)
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    name="recoveryRate"
                    value={formData.recoveryRate}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. 85"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-gray-500">%</span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">Percentage of metal recovered during processing</div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-xl mb-6 border border-blue-100">
              <div className="flex items-center mb-3">
                <Truck className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-xl font-semibold text-gray-800">Transport & Supply Chain</h3>
              </div>
              <p className="text-sm text-gray-600">
                Please provide information about transportation and logistics throughout the supply chain.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <Truck className="h-5 w-5 text-purple-600" />
                  </div>
                  <label className="block text-sm font-medium text-gray-700">
                    Transport Distances (km)
                  </label>
                </div>
                <input
                  type="number"
                  name="transportDistances"
                  value={formData.transportDistances}
                  onChange={handleInputChange}
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. 1500"
                />
                <div className="mt-2 text-xs text-gray-500">Total transport distance across all stages</div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <Truck className="h-5 w-5 text-purple-600" />
                  </div>
                  <label className="block text-sm font-medium text-gray-700">
                    Transport Mode
                  </label>
                </div>
                <select
                  name="transportMode"
                  value={formData.transportMode}
                  onChange={handleInputChange}
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select primary transport mode</option>
                  <option value="truck">Truck/Road</option>
                  <option value="rail">Rail</option>
                  <option value="ship">Ocean Freight</option>
                  <option value="air">Air Freight</option>
                  <option value="mixed">Mixed Modes</option>
                </select>
                <div className="mt-2 text-xs text-gray-500">Primary mode of transport used</div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <LayoutGrid className="h-5 w-5 text-blue-600" />
                  </div>
                  <label className="block text-sm font-medium text-gray-700">
                    Packaging Material
                  </label>
                </div>
                <input
                  type="text"
                  name="packaging"
                  value={formData.packaging}
                  onChange={handleInputChange}
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. steel drums, pallets, shrink wrap"
                />
                <div className="mt-2 text-xs text-gray-500">Types of packaging materials used</div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-xl mb-6 border border-blue-100">
              <div className="flex items-center mb-3">
                <Timer className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-xl font-semibold text-gray-800">Use Phase</h3>
              </div>
              <p className="text-sm text-gray-600">
                Please provide information about how the metal is used in its application.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <Timer className="h-5 w-5 text-blue-600" />
                </div>
                <label className="block text-sm font-medium text-gray-700">
                  Expected Product Lifetime (years)
                </label>
              </div>
              <input
                type="number"
                name="productLifetime"
                value={formData.productLifetime}
                onChange={handleInputChange}
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. 15"
              />
              <div className="mt-2 text-sm text-gray-500">Average expected lifetime of products made with this metal</div>
              <div className="mt-4 bg-blue-50 p-4 rounded-md">
                <p className="text-sm text-blue-700">
                  Longer product lifetimes generally improve sustainability by reducing the need for replacement and additional resource extraction.
                </p>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-xl mb-6 border border-blue-100">
              <div className="flex items-center mb-3">
                <Recycle className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-xl font-semibold text-gray-800">End-of-Life / Circularity</h3>
              </div>
              <p className="text-sm text-gray-600">
                Please provide information about what happens to the metal at the end of its useful life.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <Recycle className="h-5 w-5 text-green-600" />
                  </div>
                  <label className="block text-sm font-medium text-gray-700">
                    Reuse / Repurposing Rate (%)
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    name="reuseRate"
                    value={formData.reuseRate}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. 15"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-gray-500">%</span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">Percentage of metal directly reused without reprocessing</div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <Recycle className="h-5 w-5 text-green-600" />
                  </div>
                  <label className="block text-sm font-medium text-gray-700">
                    Recycling Rate (%)
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    name="recyclingRate"
                    value={formData.recyclingRate}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. 60"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-gray-500">%</span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">Percentage of metal collected for recycling</div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <Recycle className="h-5 w-5 text-green-600" />
                  </div>
                  <label className="block text-sm font-medium text-gray-700">
                    Recycling Efficiency (%)
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    name="recyclingEfficiency"
                    value={formData.recyclingEfficiency}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. 85"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-gray-500">%</span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">Percentage of metal actually recovered in recycling process</div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                    <ArrowDownCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <label className="block text-sm font-medium text-gray-700">
                    Disposal Route
                  </label>
                </div>
                <select
                  name="disposalRoute"
                  value={formData.disposalRoute}
                  onChange={handleInputChange}
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select disposal route</option>
                  <option value="landfill">Landfill</option>
                  <option value="incineration">Incineration</option>
                  <option value="special_waste">Special Waste Treatment</option>
                  <option value="mixed">Mixed Disposal Methods</option>
                </select>
                <div className="mt-2 text-xs text-gray-500">Primary method for disposing non-recycled material</div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <Truck className="h-5 w-5 text-purple-600" />
                  </div>
                  <label className="block text-sm font-medium text-gray-700">
                    Transport for Disposal (km)
                  </label>
                </div>
                <input
                  type="number"
                  name="transportDisposal"
                  value={formData.transportDisposal}
                  onChange={handleInputChange}
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. 100"
                />
                <div className="mt-2 text-xs text-gray-500">Average distance for transporting waste/recycling</div>
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-xl mb-6 border border-blue-100">
              <div className="flex items-center mb-3">
                <BarChart3 className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-xl font-semibold text-gray-800">Impact Metrics</h3>
              </div>
              <p className="text-sm text-gray-600">
                Please provide environmental impact indicators if available from previous assessments.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                    <ArrowUpCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <label className="block text-sm font-medium text-gray-700">
                    Global Warming Potential (kg CO₂-eq)
                  </label>
                </div>
                <input
                  type="number"
                  name="globalWarmingPotential"
                  value={formData.globalWarmingPotential}
                  onChange={handleInputChange}
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. 10000"
                />
                <div className="mt-2 text-xs text-gray-500">Carbon footprint per functional unit</div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                    <ArrowUpCircle className="h-5 w-5 text-yellow-600" />
                  </div>
                  <label className="block text-sm font-medium text-gray-700">
                    Acidification Potential (kg SO₂-eq)
                  </label>
                </div>
                <input
                  type="number"
                  name="acidificationPotential"
                  value={formData.acidificationPotential}
                  onChange={handleInputChange}
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. 50"
                />
                <div className="mt-2 text-xs text-gray-500">Contributes to acid rain and ocean acidification</div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <Waves className="h-5 w-5 text-blue-600" />
                  </div>
                  <label className="block text-sm font-medium text-gray-700">
                    Eutrophication Potential (kg PO₄-eq)
                  </label>
                </div>
                <input
                  type="number"
                  name="eutrophicationPotential"
                  value={formData.eutrophicationPotential}
                  onChange={handleInputChange}
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. 2.5"
                />
                <div className="mt-2 text-xs text-gray-500">Impacts on water quality and aquatic ecosystems</div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <ArrowUpCircle className="h-5 w-5 text-purple-600" />
                  </div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ozone Depletion Potential (kg CFC-11-eq)
                  </label>
                </div>
                <input
                  type="number"
                  name="ozoneDepletionPotential"
                  value={formData.ozoneDepletionPotential}
                  onChange={handleInputChange}
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. 0.001"
                />
                <div className="mt-2 text-xs text-gray-500">Impact on the ozone layer</div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <Waves className="h-5 w-5 text-blue-600" />
                  </div>
                  <label className="block text-sm font-medium text-gray-700">
                    Water Scarcity Footprint (m³-eq)
                  </label>
                </div>
                <input
                  type="number"
                  name="waterScarcityFootprint"
                  value={formData.waterScarcityFootprint}
                  onChange={handleInputChange}
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. 1000"
                />
                <div className="mt-2 text-xs text-gray-500">Water usage weighted by regional water scarcity</div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                    <Zap className="h-5 w-5 text-yellow-600" />
                  </div>
                  <label className="block text-sm font-medium text-gray-700">
                    Cumulative Energy Demand (MJ)
                  </label>
                </div>
                <input
                  type="number"
                  name="cumulativeEnergyDemand"
                  value={formData.cumulativeEnergyDemand}
                  onChange={handleInputChange}
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. 100000"
                />
                <div className="mt-2 text-xs text-gray-500">Total energy used across the entire life cycle</div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                    <ArrowUpCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <label className="block text-sm font-medium text-gray-700">
                    Human Toxicity Potential (CTUh)
                  </label>
                </div>
                <input
                  type="number"
                  name="humanToxicityPotential"
                  value={formData.humanToxicityPotential}
                  onChange={handleInputChange}
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. 0.05"
                />
                <div className="mt-2 text-xs text-gray-500">Potential health impacts from toxic substances</div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                    <ArrowDownCircle className="h-5 w-5 text-orange-600" />
                  </div>
                  <label className="block text-sm font-medium text-gray-700">
                    Waste Generated (kg)
                  </label>
                </div>
                <input
                  type="number"
                  name="wasteGenerated"
                  value={formData.wasteGenerated}
                  onChange={handleInputChange}
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. 500"
                />
                <div className="mt-2 text-xs text-gray-500">Total solid, liquid and chemical waste generated</div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <Waves className="h-5 w-5 text-blue-600" />
                  </div>
                  <label className="block text-sm font-medium text-gray-700">
                    Air/Water Emissions
                  </label>
                </div>
                <input
                  type="text"
                  name="airWaterEmissions"
                  value={formData.airWaterEmissions}
                  onChange={handleInputChange}
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. SOx, NOx, particulates, heavy metals"
                />
                <div className="mt-2 text-xs text-gray-500">Major pollutants emitted to air and water</div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <TreePine className="h-5 w-5 text-green-600" />
                  </div>
                  <label className="block text-sm font-medium text-gray-700">
                    Land Use Change (m²)
                  </label>
                </div>
                <input
                  type="number"
                  name="landUseChange"
                  value={formData.landUseChange}
                  onChange={handleInputChange}
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. 5000"
                />
                <div className="mt-2 text-xs text-gray-500">Area of habitat affected or converted</div>
              </div>
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
        
        {!isCompleted ? (
          <>
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
          </>
        ) : (
          <div className="space-y-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-medium text-gray-900 mb-2">
                LCA Assessment Complete!
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Your Life Cycle Assessment for {formData.metalType || 'your metal'} has been completed successfully. You can now export the data or view the results.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-4">Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Metal Type:</span> {formData.metalType || 'Not specified'}
                </div>
                <div>
                  <span className="font-medium">Mining Location:</span> {formData.miningLocation || 'Not specified'}
                </div>
                <div>
                  <span className="font-medium">Production Volume:</span> {formData.productionVolume ? `${formData.productionVolume} tonnes` : 'Not specified'}
                </div>
                <div>
                  <span className="font-medium">Global Warming Potential:</span> {formData.globalWarmingPotential ? `${formData.globalWarmingPotential} kg CO₂-eq` : 'Not specified'}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleExport}
                className="flex items-center justify-center py-3 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
              >
                <Download className="mr-2 h-5 w-5" />
                Export Assessment Data
              </button>
              
              <button
                onClick={handleView}
                className="flex items-center justify-center py-3 px-6 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 w-full sm:w-auto"
              >
                <Eye className="mr-2 h-5 w-5" />
                View Full Assessment
              </button>
            </div>
            
            <div className="text-center">
              <button 
                onClick={() => {
                  setIsCompleted(false);
                  setCurrentStep(1);
                  setFormData({
                    // Reset form data to initial state
                    metalType: '',
                    miningLocation: '',
                    oreGrade: '',
                    productionVolume: '',
                    functionalUnit: '',
                    
                    // Step 2: Mining & Ore Extraction
                    energyConsumptionMining: '',
                    energyTypeMining: '',
                    waterConsumptionMining: '',
                    emissionsMining: '',
                    emissionsTypeMining: '',
                    landUse: '',
                    
                    // Step 3: Processing & Energy
                    transportToProcessing: '',
                    transportDistanceToProcessing: '',
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
                    wasteGenerated: '',
                    airWaterEmissions: '',
                    landUseChange: '',
                  });
                }}
                className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
              >
                Start New Assessment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LCAForm;