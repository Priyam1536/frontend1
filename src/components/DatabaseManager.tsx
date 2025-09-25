import React, { useState } from 'react';
import { 
  Database, 
  Search, 
  Plus,
  Filter,
  Download,
  Upload,
  Zap,
  Package,
  Layers,
  Activity
} from 'lucide-react';

const DatabaseManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('processes');
  const [searchTerm, setSearchTerm] = useState('');

  const tabs = [
    { id: 'processes', label: 'Processes', icon: Activity, count: 1247 },
    { id: 'flows', label: 'Flows', icon: Layers, count: 3456 },
    { id: 'products', label: 'Products', icon: Package, count: 892 }
  ];

  const sampleData = {
    processes: [
      {
        id: 1,
        name: 'Electricity production, photovoltaic',
        category: 'Energy/Electricity',
        location: 'Europe',
        unit: 'kWh',
        dataQuality: 'High',
        lastUpdated: '2025-01-10',
        source: 'ecoinvent v3.8'
      },
      {
        id: 2,
        name: 'Steel production, converter',
        category: 'Materials/Metals',
        location: 'Global',
        unit: 'kg',
        dataQuality: 'Medium',
        lastUpdated: '2025-01-08',
        source: 'IDEMAT 2001'
      },
      {
        id: 3,
        name: 'Transport, freight, lorry',
        category: 'Transport/Road',
        location: 'Europe',
        unit: 'tkm',
        dataQuality: 'High',
        lastUpdated: '2025-01-12',
        source: 'ecoinvent v3.8'
      }
    ],
    flows: [
      {
        id: 1,
        name: 'Carbon dioxide, fossil',
        category: 'Emissions/Air',
        unit: 'kg',
        type: 'Elementary flow',
        compartment: 'Air',
        lastUpdated: '2025-01-10'
      },
      {
        id: 2,
        name: 'Electricity, low voltage',
        category: 'Energy/Electricity',
        unit: 'kWh',
        type: 'Product flow',
        compartment: 'Technosphere',
        lastUpdated: '2025-01-09'
      }
    ],
    products: [
      {
        id: 1,
        name: 'Solar panel, photovoltaic',
        category: 'Energy/Equipment',
        unit: 'm2',
        mass: '12.5 kg/m2',
        lifespan: '25 years',
        lastUpdated: '2025-01-11'
      }
    ]
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'High':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderProcesses = () => (
    <div className="space-y-4">
      {sampleData.processes.map((process) => (
        <div key={process.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">{process.name}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Category: {process.category}</span>
                <span>Location: {process.location}</span>
                <span>Unit: {process.unit}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getQualityColor(process.dataQuality)}`}>
                {process.dataQuality} Quality
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Source: {process.source}</span>
            <span>Updated: {process.lastUpdated}</span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderFlows = () => (
    <div className="space-y-4">
      {sampleData.flows.map((flow) => (
        <div key={flow.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">{flow.name}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Category: {flow.category}</span>
                <span>Type: {flow.type}</span>
                <span>Unit: {flow.unit}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                flow.type === 'Elementary flow' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
              }`}>
                {flow.compartment}
              </span>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            <span>Updated: {flow.lastUpdated}</span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-4">
      {sampleData.products.map((product) => (
        <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Category: {product.category}</span>
                <span>Unit: {product.unit}</span>
                <span>Mass: {product.mass}</span>
                <span>Lifespan: {product.lifespan}</span>
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            <span>Updated: {product.lastUpdated}</span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'flows':
        return renderFlows();
      case 'products':
        return renderProducts();
      default:
        return renderProcesses();
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Database Manager</h2>
          <p className="text-gray-600 mt-1">Manage your LCA database and inventory data</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Upload className="h-4 w-4" />
            <span>Import</span>
          </button>
          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-green-700 transition-all duration-200 flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Entry</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>All Categories</option>
                <option>Energy</option>
                <option>Materials</option>
                <option>Transport</option>
                <option>Waste</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6">
          {renderContent()}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Zap className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI Database Enhancement</h3>
        </div>
        <p className="text-gray-700 mb-4">
          Let our AI engine analyze your database for missing data, quality improvements, and optimization opportunities.
        </p>
        <div className="flex items-center space-x-3">
          <button className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-green-700 transition-all duration-200">
            Run AI Analysis
          </button>
          <button className="border border-blue-300 text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
            Schedule Auto-Updates
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatabaseManager;