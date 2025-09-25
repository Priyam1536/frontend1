import React, { useState } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart,
  Download,
  Zap,
  AlertTriangle,
  CheckCircle,
  Activity
} from 'lucide-react';

const ImpactAssessment: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState('ReCiPe');
  const [selectedProject, setSelectedProject] = useState('solar-panel');

  const assessmentMethods = ['ReCiPe', 'CML', 'TRACI', 'ILCD'];
  
  const projects = [
    { id: 'solar-panel', name: 'Solar Panel Manufacturing' },
    { id: 'ev-battery', name: 'Electric Vehicle Battery' },
    { id: 'packaging', name: 'Biodegradable Packaging' }
  ];

  const impactCategories = [
    {
      name: 'Climate Change',
      value: '2.4',
      unit: 'kg CO2-eq',
      change: '-12.3%',
      trend: 'down',
      status: 'good'
    },
    {
      name: 'Ozone Depletion',
      value: '1.2e-6',
      unit: 'kg CFC-11-eq',
      change: '+5.7%',
      trend: 'up',
      status: 'warning'
    },
    {
      name: 'Acidification',
      value: '0.018',
      unit: 'kg SO2-eq',
      change: '-8.9%',
      trend: 'down',
      status: 'good'
    },
    {
      name: 'Eutrophication',
      value: '0.0045',
      unit: 'kg PO4-eq',
      change: '+2.1%',
      trend: 'up',
      status: 'neutral'
    },
    {
      name: 'Human Toxicity',
      value: '0.82',
      unit: 'CTUh',
      change: '-15.4%',
      trend: 'down',
      status: 'good'
    },
    {
      name: 'Ecotoxicity',
      value: '12.5',
      unit: 'CTUe',
      change: '-7.8%',
      trend: 'down',
      status: 'good'
    }
  ];

  const lifecyclePhases = [
    { phase: 'Raw Material Extraction', percentage: 35, color: 'bg-red-500' },
    { phase: 'Manufacturing', percentage: 28, color: 'bg-orange-500' },
    { phase: 'Transportation', percentage: 12, color: 'bg-yellow-500' },
    { phase: 'Use Phase', percentage: 18, color: 'bg-green-500' },
    { phase: 'End-of-Life', percentage: 7, color: 'bg-blue-500' }
  ];

  const aiRecommendations = [
    {
      title: 'Material Substitution',
      description: 'Replacing aluminum with recycled steel could reduce climate change impact by 18%',
      priority: 'High',
      potentialSaving: '0.43 kg CO2-eq',
      category: 'Climate Change'
    },
    {
      title: 'Process Optimization',
      description: 'Optimizing energy consumption in manufacturing phase',
      priority: 'Medium',
      potentialSaving: '0.21 kg CO2-eq',
      category: 'Climate Change'
    },
    {
      title: 'Transportation Efficiency',
      description: 'Consolidating shipments could reduce transportation impact by 25%',
      priority: 'Medium',
      potentialSaving: '0.15 kg CO2-eq',
      category: 'Climate Change'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default:
        return <Activity className="h-5 w-5 text-blue-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Impact Assessment</h2>
          <p className="text-gray-600 mt-1">Analyze environmental impacts and optimization opportunities</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
          <select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {assessmentMethods.map(method => (
              <option key={method} value={method}>{method} Method</option>
            ))}
          </select>
          <button className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-green-700 transition-all duration-200 flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {impactCategories.map((category, index) => (
          <div key={index} className={`border-2 rounded-xl p-6 ${getStatusColor(category.status)} transition-all duration-200 hover:shadow-md`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {getStatusIcon(category.status)}
                <h3 className="font-semibold text-gray-900">{category.name}</h3>
              </div>
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                category.trend === 'down' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                <TrendingUp className={`h-3 w-3 ${category.trend === 'down' ? 'rotate-180' : ''}`} />
                <span>{category.change}</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{category.value}</div>
            <div className="text-sm text-gray-600">{category.unit}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <PieChart className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Lifecycle Phase Contribution</h3>
          </div>
          
          <div className="space-y-4">
            {lifecyclePhases.map((phase, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-32 text-sm text-gray-600">{phase.phase}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div 
                    className={`${phase.color} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${phase.percentage}%` }}
                  ></div>
                </div>
                <div className="w-12 text-sm font-medium text-gray-900 text-right">{phase.percentage}%</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Zap className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">AI Optimization Recommendations</h3>
          </div>
          
          <div className="space-y-4">
            {aiRecommendations.map((rec, index) => (
              <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border-l-4 border-blue-600">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{rec.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    rec.priority === 'High'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {rec.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{rec.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Category: {rec.category}</span>
                  <span className="font-medium text-green-700">Save: {rec.potentialSaving}</span>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-green-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-green-700 transition-all duration-200">
            Apply Recommendations
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Detailed Impact Analysis</h3>
          </div>
          <button className="text-blue-600 hover:text-blue-700 font-medium">View Detailed Report</button>
        </div>
        
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Interactive charts and detailed analysis will be displayed here</p>
            <p className="text-sm text-gray-500 mt-1">Connect to your data visualization library</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactAssessment;