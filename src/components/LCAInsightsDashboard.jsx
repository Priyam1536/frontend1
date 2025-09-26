import React from 'react';
import { 
  BarChart3, 
  CheckCircle, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  AlertTriangle,
  Zap,
  Droplets,
  Trash2,
  Mountain,
  Truck,
  RefreshCw,
  Leaf
} from 'lucide-react';

const LCAInsightsDashboard = ({ insights, formData }) => {
  // If no insights are available, show placeholder
  if (!insights) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg shadow-sm text-center">
        <p className="text-gray-500">No insights available yet. Complete the LCA form to generate insights.</p>
      </div>
    );
  }
  
  // Helper to determine impact severity colors
  const getImpactColor = (severity) => {
    switch(severity) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-amber-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };
  
  // Determine the metal type for contextual display
  const metalType = formData?.metalType || 'metal';
  
  // Derive some metrics for the visualizations based on form data
  const metrics = {
    energyEfficiency: formData?.energyConsumptionProcessing ? 
      (formData.energyConsumptionProcessing < 5000 ? 'high' : 
       formData.energyConsumptionProcessing < 10000 ? 'medium' : 'low') : 'medium',
    recycledContent: formData?.recycledInputRate ? 
      (formData.recycledInputRate > 50 ? 'high' : 
       formData.recycledInputRate > 20 ? 'medium' : 'low') : 'low',
    waterUsage: formData?.waterConsumptionMining ? 
      (formData.waterConsumptionMining < 50 ? 'low' : 
       formData.waterConsumptionMining < 100 ? 'medium' : 'high') : 'medium',
    emissions: formData?.globalWarmingPotential ? 
      (formData.globalWarmingPotential < 1000 ? 'low' : 
       formData.globalWarmingPotential < 5000 ? 'medium' : 'high') : 'high'
  };

  return (
    <div className="space-y-8">
      {/* Summary Card */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-xl border border-blue-100 shadow-sm">
        <div className="flex items-start">
          <div className="bg-white p-3 rounded-lg shadow-sm mr-4">
            <BarChart3 className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">LCA Summary for {metalType}</h3>
            <p className="text-gray-700">{insights.lca_summary}</p>
          </div>
        </div>
      </div>
      
      {/* Impact Categories Grid */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Environmental Impact Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Energy Impact */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center mb-2">
              <Zap className={`h-5 w-5 mr-2 ${getImpactColor(metrics.energyEfficiency)}`} />
              <h4 className="font-medium text-gray-800">Energy Use</h4>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Efficiency</span>
              <span className={`font-medium ${getImpactColor(metrics.energyEfficiency)}`}>
                {metrics.energyEfficiency.toUpperCase()}
              </span>
            </div>
            <div className="mt-2 bg-gray-200 h-2 rounded-full">
              <div 
                className={`h-full rounded-full ${
                  metrics.energyEfficiency === 'high' ? 'bg-green-500' : 
                  metrics.energyEfficiency === 'medium' ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: metrics.energyEfficiency === 'high' ? '80%' : 
                         metrics.energyEfficiency === 'medium' ? '50%' : '30%' }}
              ></div>
            </div>
          </div>
          
          {/* Water Impact */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center mb-2">
              <Droplets className={`h-5 w-5 mr-2 ${getImpactColor(metrics.waterUsage === 'high' ? 'low' : metrics.waterUsage === 'low' ? 'high' : 'medium')}`} />
              <h4 className="font-medium text-gray-800">Water Usage</h4>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Efficiency</span>
              <span className={`font-medium ${getImpactColor(metrics.waterUsage === 'high' ? 'low' : metrics.waterUsage === 'low' ? 'high' : 'medium')}`}>
                {metrics.waterUsage.toUpperCase()}
              </span>
            </div>
            <div className="mt-2 bg-gray-200 h-2 rounded-full">
              <div 
                className={`h-full rounded-full ${
                  metrics.waterUsage === 'low' ? 'bg-green-500' : 
                  metrics.waterUsage === 'medium' ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: metrics.waterUsage === 'low' ? '80%' : 
                         metrics.waterUsage === 'medium' ? '50%' : '30%' }}
              ></div>
            </div>
          </div>
          
          {/* Recycled Content */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center mb-2">
              <RefreshCw className={`h-5 w-5 mr-2 ${getImpactColor(metrics.recycledContent)}`} />
              <h4 className="font-medium text-gray-800">Circularity</h4>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Recycled Content</span>
              <span className={`font-medium ${getImpactColor(metrics.recycledContent)}`}>
                {metrics.recycledContent.toUpperCase()}
              </span>
            </div>
            <div className="mt-2 bg-gray-200 h-2 rounded-full">
              <div 
                className={`h-full rounded-full ${
                  metrics.recycledContent === 'high' ? 'bg-green-500' : 
                  metrics.recycledContent === 'medium' ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: metrics.recycledContent === 'high' ? '80%' : 
                         metrics.recycledContent === 'medium' ? '50%' : '30%' }}
              ></div>
            </div>
          </div>
          
          {/* Emissions */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center mb-2">
              <ArrowUpCircle className={`h-5 w-5 mr-2 ${getImpactColor(metrics.emissions === 'high' ? 'low' : metrics.emissions === 'low' ? 'high' : 'medium')}`} />
              <h4 className="font-medium text-gray-800">Emissions</h4>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Carbon Impact</span>
              <span className={`font-medium ${getImpactColor(metrics.emissions === 'high' ? 'low' : metrics.emissions === 'low' ? 'high' : 'medium')}`}>
                {metrics.emissions.toUpperCase()}
              </span>
            </div>
            <div className="mt-2 bg-gray-200 h-2 rounded-full">
              <div 
                className={`h-full rounded-full ${
                  metrics.emissions === 'low' ? 'bg-green-500' : 
                  metrics.emissions === 'medium' ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: metrics.emissions === 'low' ? '80%' : 
                         metrics.emissions === 'medium' ? '50%' : '30%' }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recommendations Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Leaf className="h-5 w-5 text-green-600 mr-2" />
          AI-Generated Sustainability Recommendations
        </h3>
        
        <div className="space-y-4">
          {insights.recommendations.map((recommendation, index) => (
            <div key={index} className="bg-white p-5 rounded-lg border-l-4 border-green-500 shadow-sm">
              <div className="flex">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-gray-800">{recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Lifecycle Hotspots */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Lifecycle Hotspots</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Mining Hotspot */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="bg-amber-100 p-2 rounded-lg mr-3">
                  <Mountain className="h-5 w-5 text-amber-600" />
                </div>
                <h4 className="font-medium text-gray-800">Mining & Extraction</h4>
              </div>
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </div>
            <p className="text-sm text-gray-600">
              Moderate impact from mining operations. Consider ore grade and energy sources.
            </p>
          </div>
          
          {/* Processing Hotspot */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="bg-red-100 p-2 rounded-lg mr-3">
                  <Zap className="h-5 w-5 text-red-600" />
                </div>
                <h4 className="font-medium text-gray-800">Energy & Processing</h4>
              </div>
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <p className="text-sm text-gray-600">
              High impact area. Focus on renewable energy adoption and efficiency improvements.
            </p>
          </div>
          
          {/* Transport Hotspot */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <Truck className="h-5 w-5 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-800">Transportation</h4>
              </div>
              <AlertTriangle className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-sm text-gray-600">
              Notable impact from logistics. Optimize routes and consider lower-emission transport modes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LCAInsightsDashboard;
