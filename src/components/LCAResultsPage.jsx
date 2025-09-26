import React, { Suspense, lazy } from 'react';
import { 
  ChevronLeft, 
  Download, 
  Share2, 
  Printer, 
  BarChart3, 
  FileText, 
  CheckCircle,
  AlertCircle,
  Loader
} from 'lucide-react';

// Lazy load components for better performance
const LCAProcessFlow = lazy(() => import('./LCAProcessFlow'));
const LCAInsightsDashboard = lazy(() => import('./LCAInsightsDashboard'));

const LCAResultsPage = ({ 
  formData, 
  insights, 
  isLoading = false, 
  error = null, 
  onBack, 
  onExport 
}) => {
  if (!formData || Object.keys(formData).length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Data Available</h2>
          <p className="text-gray-600 mb-6">Assessment data is missing. Please complete an LCA assessment first.</p>
          <button
            onClick={onBack}
            className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const metalType = formData.metalType || 'Material';

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <button
              onClick={onBack}
              className="flex items-center text-sm text-blue-600 hover:text-blue-800 mb-2"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              LCA Results: {metalType.charAt(0).toUpperCase() + metalType.slice(1)}
            </h1>
            <p className="text-gray-600 mt-1">
              Comprehensive lifecycle assessment analysis and recommendations
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onExport && onExport('pdf')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </button>
            <button
              onClick={() => navigator.share && navigator.share({
                title: `LCA Results: ${metalType}`,
                text: 'View my Life Cycle Assessment results',
              })}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </button>
          </div>
        </div>

        {/* Main Content */}
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Loader className="animate-spin h-10 w-10 text-blue-500 mx-auto mb-4" />
            <p className="text-lg text-gray-700">Generating LCA insights...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Results</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={onBack}
              className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar with Summary */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Assessment Summary
                </h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Metal Type:</span>
                    <span className="font-medium">{formData.metalType || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Production Volume:</span>
                    <span className="font-medium">
                      {formData.productionVolume ? `${formData.productionVolume} tonnes` : 'Not specified'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ore Grade:</span>
                    <span className="font-medium">
                      {formData.oreGrade ? `${formData.oreGrade}%` : 'Not specified'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Energy Source:</span>
                    <span className="font-medium">{formData.energySource || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Processing Route:</span>
                    <span className="font-medium">{formData.processingRoute || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Recycled Input:</span>
                    <span className="font-medium">
                      {formData.recycledInputRate ? `${formData.recycledInputRate}%` : 'Not specified'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Product Lifetime:</span>
                    <span className="font-medium">
                      {formData.productLifetime ? `${formData.productLifetime} years` : 'Not specified'}
                    </span>
                  </div>
                </div>
                
                <div className="mt-6 border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Environmental Impact</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">GWP:</span>
                      <span className="font-medium">
                        {formData.globalWarmingPotential ? 
                          `${formData.globalWarmingPotential} kg CO₂-eq` : 'Not specified'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Energy Demand:</span>
                      <span className="font-medium">
                        {formData.cumulativeEnergyDemand ? 
                          `${formData.cumulativeEnergyDemand} MJ` : 'Not specified'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Process Flow Visualization */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Process Flow</h2>
                <div className="h-[350px]">
                  <Suspense fallback={<div className="flex items-center justify-center h-full"><Loader className="animate-spin h-8 w-8 text-blue-500" /></div>}>
                    <LCAProcessFlow currentStep={7} formData={formData} />
                  </Suspense>
                </div>
              </div>
            </div>
            
            {/* Main Content - AI Insights Dashboard */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <BarChart3 className="h-6 w-6 mr-2 text-blue-600" />
                  Lifecycle Analysis Insights
                </h2>
                
                <Suspense fallback={<div className="flex items-center justify-center h-96"><Loader className="animate-spin h-8 w-8 text-blue-500" /></div>}>
                  <LCAInsightsDashboard insights={insights} formData={formData} />
                </Suspense>
                
                {insights && insights.recommendations && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                      Key Recommendations
                    </h3>
                    
                    <div className="space-y-4">
                      {insights.recommendations.map((rec, index) => (
                        <div 
                          key={index} 
                          className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-100"
                        >
                          <div className="flex">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-800 font-medium text-sm mr-3">
                              {index + 1}
                            </span>
                            <p className="text-gray-800">{rec}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LCAResultsPage;
