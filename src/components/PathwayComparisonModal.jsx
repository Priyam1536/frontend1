import React, { useState } from 'react';
import { 
  X, ArrowRight, Recycle, Factory, FileText, Download, BarChart3, 
  Zap, Waves, Mountain, Truck, TreePine, ChevronDown, ChevronUp,
  Leaf, Trash2, Thermometer, DollarSign, CircleSlash, Info
} from 'lucide-react';

const PathwayComparisonModal = ({ onClose }) => {
  const [selectedMetal, setSelectedMetal] = useState('aluminum');
  const [activeTab, setActiveTab] = useState('environmental');
  const [expandedSection, setExpandedSection] = useState('resourceUse');
  
  // Toggle section expansion
  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  // Sample data for pathway comparison
  const comparisonData = {
    aluminum: {
      conventional: {
        energyUse: 85,
        waterUse: 70,
        co2Emissions: 90,
        landUse: 75,
        wasteGenerated: 80,
        resourceEfficiency: 40,
        costIndex: 100,
        toxicityScore: 65,
        biodiversityImpact: 70,
        circularityRate: 25,
        rawMaterialConsumption: 100,
        productionCosts: {
          materials: 40,
          energy: 30,
          labor: 20,
          regulatory: 10
        },
        risks: {
          supplyChain: 'High',
          regulatory: 'Medium',
          market: 'Medium',
          reputational: 'Medium'
        },
        description: "Traditional linear extraction-to-waste pathway with primary raw material inputs.",
        steps: [
          "Virgin bauxite extraction requiring significant land disturbance",
          "Energy-intensive Bayer process and Hall-Héroult electrolysis",
          "Single-use product manufacturing with limited recyclability focus",
          "Global transportation with high carbon footprint",
          "Products often disposed of after single use cycle",
          "25-30% collection for recycling, remainder to landfill"
        ],
        byProducts: ["Red mud", "Carbon dioxide", "Perfluorocarbons", "Waste heat"]
      },
      circular: {
        energyUse: 45,
        waterUse: 35,
        co2Emissions: 40,
        landUse: 30,
        wasteGenerated: 25,
        resourceEfficiency: 85,
        costIndex: 80,
        toxicityScore: 25,
        biodiversityImpact: 30,
        circularityRate: 85,
        rawMaterialConsumption: 35,
        productionCosts: {
          materials: 20,
          energy: 25,
          labor: 25,
          regulatory: 5
        },
        risks: {
          supplyChain: 'Low',
          regulatory: 'Low',
          market: 'Low',
          reputational: 'Very Low'
        },
        description: "Closed-loop system prioritizing recycled inputs and design for recyclability.",
        steps: [
          "Limited virgin material input blended with recycled sources",
          "Energy-efficient remelting and reforming processes",
          "Design for disassembly and high recyclability",
          "Optimized regional transportation systems",
          "Extended product lifespans through repair and reuse",
          "Advanced collection and sorting with minimal material loss"
        ],
        byProducts: ["Dross (recycled)", "Minimal waste water (recycled)", "Recoverable heat"]
      }
    }
  };

  // Get data for the selected metal
  const data = comparisonData[selectedMetal] || comparisonData.aluminum;
  const { conventional, circular } = data;

  // Available metals for comparison
  const availableMetals = [
    { value: 'aluminum', label: 'Aluminum' },
    { value: 'copper', label: 'Copper' },
    { value: 'steel', label: 'Steel' },
    { value: 'gold', label: 'Gold' },
    { value: 'lithium', label: 'Lithium' }
  ];

  // Helper function to render bar comparison chart
  const renderBarComparison = (title, conventional, circular, icon, unit = '%', positive = false) => {
    const difference = positive ? 
      circular - conventional : 
      conventional - circular;
    const differenceText = positive ? 
      `+${difference}${unit}` : 
      `-${difference}${unit}`;
    const differenceClass = positive ? 'text-green-600' : 'text-blue-600';
    
    return (
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center mb-2">
          {icon}
          <h4 className="text-sm font-medium text-gray-700 ml-2">{title}</h4>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="flex justify-between text-xs mb-1">
              <span>Conventional</span>
              <span className="font-medium">{conventional}{unit}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-red-500 rounded-full" 
                style={{ width: `${conventional}%` }}
              ></div>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-xs mb-1">
              <span>Circular</span>
              <span className="font-medium">{circular}{unit}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-green-500 rounded-full" 
                style={{ width: `${circular}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div className={`mt-2 text-xs text-center font-medium ${differenceClass}`}>
          {differenceText} with circular pathway
        </div>
      </div>
    );
  };

  // Render chart for breakdown of production costs
  const renderProductionCostChart = (conventional, circular) => {
    const categories = Object.keys(conventional.productionCosts);
    const maxValue = 100; // Total percentage
    
    return (
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Production Cost Breakdown</h4>
        
        <div className="space-y-4">
          {categories.map(category => (
            <div key={category} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="capitalize">{category}</span>
                <div>
                  <span className="text-red-600 font-medium">{conventional.productionCosts[category]}%</span>
                  <span className="mx-1 text-gray-400">vs</span>
                  <span className="text-green-600 font-medium">{circular.productionCosts[category]}%</span>
                </div>
              </div>
              <div className="h-6 bg-gray-100 rounded-full overflow-hidden flex">
                <div 
                  className="bg-red-500 h-full flex items-center justify-end px-2"
                  style={{ width: `${conventional.productionCosts[category]}%` }}
                >
                  {conventional.productionCosts[category] > 15 && (
                    <span className="text-xs text-white font-medium">Conv.</span>
                  )}
                </div>
                <div 
                  className="bg-green-500 h-full flex items-center px-2"
                  style={{ width: `${circular.productionCosts[category]}%` }}
                >
                  {circular.productionCosts[category] > 15 && (
                    <span className="text-xs text-white font-medium">Circ.</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between mt-4 text-xs text-gray-500">
          <div>
            <span className="inline-block w-3 h-3 bg-red-500 mr-1 rounded-sm"></span>
            <span>Conventional</span>
          </div>
          <div>
            <span className="inline-block w-3 h-3 bg-green-500 mr-1 rounded-sm"></span>
            <span>Circular</span>
          </div>
        </div>
      </div>
    );
  };

  // Render risk assessment table
  const renderRiskTable = (conventional, circular) => {
    const riskCategories = Object.keys(conventional.risks);
    
    const riskLevelToClass = {
      'Very Low': 'bg-green-100 text-green-800',
      'Low': 'bg-green-50 text-green-600',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'High': 'bg-red-100 text-red-800',
      'Very High': 'bg-red-200 text-red-900'
    };
    
    return (
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Risk Assessment</h4>
        
        <div className="overflow-hidden border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-xs font-medium text-gray-500 text-left">Risk Category</th>
                <th className="px-4 py-2 text-xs font-medium text-gray-500 text-left">Conventional</th>
                <th className="px-4 py-2 text-xs font-medium text-gray-500 text-left">Circular</th>
                <th className="px-4 py-2 text-xs font-medium text-gray-500 text-left">Benefit</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {riskCategories.map(category => {
                const convRisk = conventional.risks[category];
                const circRisk = circular.risks[category];
                const improvement = getBenefitLevel(convRisk, circRisk);
                
                return (
                  <tr key={category}>
                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-700 capitalize">{category}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${riskLevelToClass[convRisk]}`}>
                        {convRisk}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${riskLevelToClass[circRisk]}`}>
                        {circRisk}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-xs text-green-600 font-medium">
                      {improvement}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Helper function to determine benefit level
  const getBenefitLevel = (conventional, circular) => {
    const riskLevels = ['Very Low', 'Low', 'Medium', 'High', 'Very High'];
    const convIndex = riskLevels.indexOf(conventional);
    const circIndex = riskLevels.indexOf(circular);
    
    const difference = convIndex - circIndex;
    
    if (difference === 0) return 'No change';
    if (difference === 1) return 'Slight improvement';
    if (difference === 2) return 'Moderate improvement';
    if (difference >= 3) return 'Significant improvement';
    return 'N/A';
  };

  // Render by-products comparison
  const renderByProductsComparison = (conventional, circular) => {
    return (
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">By-products & Waste Streams</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="text-xs font-medium text-gray-500 mb-2 flex items-center">
              <Trash2 className="h-4 w-4 mr-1 text-red-500" /> Conventional
            </h5>
            <ul className="space-y-1">
              {conventional.byProducts.map((item, idx) => (
                <li key={idx} className="text-xs text-gray-700 bg-red-50 border border-red-100 px-2 py-1 rounded-md">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h5 className="text-xs font-medium text-gray-500 mb-2 flex items-center">
              <Recycle className="h-4 w-4 mr-1 text-green-500" /> Circular
            </h5>
            <ul className="space-y-1">
              {circular.byProducts.map((item, idx) => (
                <li key={idx} className="text-xs text-gray-700 bg-green-50 border border-green-100 px-2 py-1 rounded-md">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-4 text-xs text-gray-600 bg-blue-50 p-2 rounded-md border border-blue-100">
          <p><strong>Key difference:</strong> Circular pathways typically have fewer waste streams, with most by-products being recycled back into the process or utilized in other applications.</p>
        </div>
      </div>
    );
  };

  // Render pathway diagram
  const renderPathwayDiagram = (type) => {
    const isConventional = type === 'conventional';
    const data = isConventional ? conventional : circular;
    const bgColor = isConventional ? 'bg-red-50' : 'bg-green-50';
    const textColor = isConventional ? 'text-red-700' : 'text-green-700';
    const borderColor = isConventional ? 'border-red-200' : 'border-green-200';
    const title = isConventional ? 'Conventional Pathway' : 'Circular Pathway';
    const icon = isConventional ? <Factory className="h-5 w-5 text-red-600" /> : <Recycle className="h-5 w-5 text-green-600" />;

    return (
      <div className={`p-4 rounded-lg ${bgColor} ${borderColor} border h-full flex flex-col`}>
        <div className="flex items-center mb-3">
          {icon}
          <h3 className={`ml-2 font-medium ${textColor}`}>{title}</h3>
        </div>
        
        <div className="flex-grow">
          {data.steps.map((step, index) => (
            <div key={index} className="flex items-center mb-3">
              <div className={`flex-shrink-0 w-6 h-6 rounded-full ${isConventional ? 'bg-red-200 text-red-600' : 'bg-green-200 text-green-600'} flex items-center justify-center text-xs font-bold`}>
                {index + 1}
              </div>
              <ArrowRight className={`h-4 w-4 mx-2 ${isConventional ? 'text-red-400' : 'text-green-400'}`} />
              <div className={`text-sm ${isConventional ? 'text-red-600' : 'text-green-600'}`}>{step}</div>
            </div>
          ))}
        </div>
        
        <div className="mt-auto">
          <p className="mt-3 text-sm text-gray-600">{data.description}</p>
        </div>
      </div>
    );
  };

  // Render key metrics for circularity comparison
  const renderCircularityMetrics = () => {
    const circularityDifference = circular.circularityRate - conventional.circularityRate;
    const materialSavings = conventional.rawMaterialConsumption - circular.rawMaterialConsumption;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
          <div className="flex items-center mb-2">
            <Recycle className="h-5 w-5 text-green-600 mr-2" />
            <h3 className="text-sm font-medium text-gray-700">Circularity Rate</h3>
          </div>
          <div className="mt-2 flex justify-between items-baseline">
            <div className="text-2xl font-bold text-green-600">{circular.circularityRate}%</div>
            <div className="text-sm text-gray-500 flex items-center">
              <span className="text-green-500">+{circularityDifference}%</span>
              <ArrowRight className="h-3 w-3 mx-1 text-gray-400" />
              <span className="text-gray-600">{conventional.circularityRate}%</span>
            </div>
          </div>
          <div className="mt-1 text-xs text-gray-600">
            Percentage of materials kept in productive use
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
          <div className="flex items-center mb-2">
            <Mountain className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-sm font-medium text-gray-700">Raw Material Savings</h3>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-blue-600">{materialSavings}%</div>
          </div>
          <div className="mt-1 text-xs text-gray-600">
            Reduction in virgin material consumption
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-purple-200 shadow-sm">
          <div className="flex items-center mb-2">
            <CircleSlash className="h-5 w-5 text-purple-600 mr-2" />
            <h3 className="text-sm font-medium text-gray-700">Waste Elimination</h3>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-purple-600">{conventional.wasteGenerated - circular.wasteGenerated}%</div>
          </div>
          <div className="mt-1 text-xs text-gray-600">
            Reduction in waste generation
          </div>
        </div>
      </div>
    );
  };

  // Render interactive tabs
  const renderTabs = () => {
    const tabs = [
      { id: 'environmental', label: 'Environmental Impact', icon: <Leaf className="h-4 w-4" /> },
      { id: 'economic', label: 'Economic Analysis', icon: <DollarSign className="h-4 w-4" /> },
      { id: 'circularity', label: 'Circularity Metrics', icon: <Recycle className="h-4 w-4" /> },
      { id: 'process', label: 'Process Comparison', icon: <Factory className="h-4 w-4" /> }
    ];
    
    return (
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-3 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    );
  };

  // Render environmental impact tab content
  const renderEnvironmentalContent = () => (
    <div className="space-y-6">
      {/* Collapsible section: Resource Use */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <button 
          className="w-full flex justify-between items-center p-4 focus:outline-none"
          onClick={() => toggleSection('resourceUse')}
        >
          <span className="font-medium text-gray-800 flex items-center">
            <Thermometer className="h-5 w-5 mr-2 text-blue-600" />
            Resource Consumption & Emissions
          </span>
          {expandedSection === 'resourceUse' ? 
            <ChevronUp className="h-5 w-5 text-gray-500" /> : 
            <ChevronDown className="h-5 w-5 text-gray-500" />
          }
        </button>
        
        {expandedSection === 'resourceUse' && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {renderBarComparison('Energy Use', conventional.energyUse, circular.energyUse, <Zap className="h-4 w-4 text-yellow-500" />)}
              {renderBarComparison('Water Use', conventional.waterUse, circular.waterUse, <Waves className="h-4 w-4 text-blue-500" />)}
              {renderBarComparison('CO₂ Emissions', conventional.co2Emissions, circular.co2Emissions, <Factory className="h-4 w-4 text-gray-500" />)}
              {renderBarComparison('Land Use', conventional.landUse, circular.landUse, <TreePine className="h-4 w-4 text-green-500" />)}
              {renderBarComparison('Waste Generated', conventional.wasteGenerated, circular.wasteGenerated, <Trash2 className="h-4 w-4 text-red-500" />)}
              {renderBarComparison('Resource Efficiency', conventional.resourceEfficiency, circular.resourceEfficiency, <Recycle className="h-4 w-4 text-green-500" />, '%', true)}
            </div>
          </div>
        )}
      </div>
      
      {/* Collapsible section: Ecological Impact */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <button 
          className="w-full flex justify-between items-center p-4 focus:outline-none"
          onClick={() => toggleSection('ecological')}
        >
          <span className="font-medium text-gray-800 flex items-center">
            <Leaf className="h-5 w-5 mr-2 text-green-600" />
            Ecological & Health Impact
          </span>
          {expandedSection === 'ecological' ? 
            <ChevronUp className="h-5 w-5 text-gray-500" /> : 
            <ChevronDown className="h-5 w-5 text-gray-500" />
          }
        </button>
        
        {expandedSection === 'ecological' && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderBarComparison('Toxicity Score', conventional.toxicityScore, circular.toxicityScore, <Trash2 className="h-4 w-4 text-red-500" />)}
              {renderBarComparison('Biodiversity Impact', conventional.biodiversityImpact, circular.biodiversityImpact, <TreePine className="h-4 w-4 text-green-500" />)}
              
              {/* By-products comparison */}
              <div className="md:col-span-2">
                {renderByProductsComparison(conventional, circular)}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h4 className="font-medium text-blue-800 mb-2 flex items-center">
          <Info className="h-5 w-5 mr-2" /> Environmental Impact Summary
        </h4>
        <p className="text-sm text-blue-700">
          Circular processing pathways for {selectedMetal} demonstrate significant environmental advantages, reducing energy use by {conventional.energyUse - circular.energyUse}%, water consumption by {conventional.waterUse - circular.waterUse}%, and CO₂ emissions by {conventional.co2Emissions - circular.co2Emissions}% compared to conventional approaches. These improvements stem from decreased virgin material extraction, energy-efficient recycling processes, and reduced waste generation.
        </p>
      </div>
    </div>
  );

  // Render economic analysis tab content
  const renderEconomicContent = () => (
    <div className="space-y-6">
      {/* Cost advantage overview */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Economic Advantage of Circular Pathway</h3>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Cost Index (Conventional = 100)</h4>
            <div className="h-6 bg-gray-200 rounded-full relative">
              <div className="absolute inset-y-0 left-0 bg-blue-500 rounded-full" style={{ width: `${conventional.costIndex}%` }}></div>
              <div className="absolute inset-y-0 left-0 bg-green-500 rounded-full" style={{ width: `${circular.costIndex}%` }}></div>
              <div className="absolute inset-0 flex justify-between items-center px-3 text-xs font-bold">
                <span className="text-white">Circular ({circular.costIndex})</span>
                <span className="text-white">Conventional ({conventional.costIndex})</span>
              </div>
            </div>
            
            <div className="mt-4 bg-green-50 p-3 rounded-lg border border-green-200">
              <h5 className="font-medium text-green-800 text-sm">Cost Savings with Circular Pathway</h5>
              <p className="text-2xl font-bold text-green-700 mt-1">
                {conventional.costIndex - circular.costIndex}% <span className="text-sm font-normal text-green-600">Lower production costs</span>
              </p>
            </div>
          </div>
          
          <div className="flex-1">
            {renderProductionCostChart(conventional, circular)}
          </div>
        </div>
      </div>
      
      {/* Risk assessment */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Business Risk Comparison</h3>
        {renderRiskTable(conventional, circular)}
        
        <div className="mt-4 text-sm text-gray-600">
          <p>Circular business models typically face lower risks across multiple categories due to reduced reliance on volatile raw material markets, better alignment with tightening regulations, and positive public perception.</p>
        </div>
      </div>
    </div>
  );

  // Render circularity metrics tab content
  const renderCircularityContent = () => (
    <div className="space-y-6">
      {/* Key circularity metrics */}
      {renderCircularityMetrics()}
      
      {/* Material flow visualization */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Material Flow Comparison</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Conventional Linear Flow</h4>
            <div className="relative h-16 bg-gray-100 rounded-lg overflow-hidden">
              <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-blue-500 to-red-500 flex items-center">
                <div className="flex-1 h-full flex items-center justify-center text-white text-xs font-medium">
                  Raw Materials
                </div>
                <div className="flex-1 h-full flex items-center justify-center text-white text-xs font-medium">
                  Production
                </div>
                <div className="flex-1 h-full flex items-center justify-center text-white text-xs font-medium">
                  Use
                </div>
                <div className="flex-1 h-full flex items-center justify-center text-white text-xs font-medium">
                  Disposal
                </div>
              </div>
              <div className="absolute top-0 right-0 h-full w-1/4 bg-gray-800 opacity-30"></div>
              <div className="absolute bottom-1 right-2 text-xs text-white font-medium">
                Waste: {100 - conventional.circularityRate}%
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1 px-2">
              <span>Input: 100%</span>
              <span>Output: {conventional.circularityRate}%</span>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Circular Flow</h4>
            <div className="relative h-16 bg-gray-100 rounded-lg overflow-hidden">
              <div className="absolute inset-y-0 left-0 right-0 h-full">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                  <defs>
                    <linearGradient id="circularGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#10B981" />
                    </linearGradient>
                  </defs>
                  <path d="M0,50 C30,10 70,90 100,50 L100,100 L0,100 Z" fill="url(#circularGradient)"></path>
                </svg>
                <div className="absolute inset-0 flex justify-center items-center">
                  <div className="bg-white rounded-full h-10 w-10 flex items-center justify-center shadow-md">
                    <Recycle className="h-6 w-6 text-green-500" />
                  </div>
                </div>
                <div className="absolute left-2 top-2 text-xs font-medium text-white">
                  Input: {100 - circular.circularityRate}% new
                </div>
                <div className="absolute right-2 bottom-1 text-xs font-medium text-white">
                  Recycled: {circular.circularityRate}%
                </div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1 px-2">
              <span>Virgin material: {100 - circular.circularityRate}%</span>
              <span>Waste: {100 - circular.circularityRate}%</span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 bg-blue-50 p-3 rounded-md text-sm text-blue-800 border border-blue-100">
          <p><strong>Note:</strong> Circular flow systems drastically reduce the need for virgin raw material inputs by keeping materials in use through multiple product lifecycles.</p>
        </div>
      </div>
    </div>
  );

  // Render process comparison tab content
  const renderProcessContent = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {renderPathwayDiagram('conventional')}
      {renderPathwayDiagram('circular')}
    </div>
  );

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'environmental':
        return renderEnvironmentalContent();
      case 'economic':
        return renderEconomicContent();
      case 'circularity':
        return renderCircularityContent();
      case 'process':
        return renderProcessContent();
      default:
        return renderEnvironmentalContent();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900 flex items-center">
          <ArrowRight className="h-5 w-5 text-gray-500 mr-2" />
          Conventional vs. Circular Processing Pathway Comparison
        </h1>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Metal selection */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Select a metal to compare pathways</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-2">
                <select
                  value={selectedMetal}
                  onChange={(e) => setSelectedMetal(e.target.value)}
                  className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  {availableMetals.map(metal => (
                    <option key={metal.value} value={metal.value}>{metal.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <button 
                  className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm flex items-center justify-center"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Export Comparison
                </button>
              </div>
            </div>
          </div>
          
          {/* Interactive tabs */}
          {renderTabs()}
          
          {/* Tab content */}
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default PathwayComparisonModal;
