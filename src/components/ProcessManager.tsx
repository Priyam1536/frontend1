import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  GitBranch,
  Zap,
  Database,
  ArrowRight,
  MoreVertical,
  Filter
} from 'lucide-react';

const ProcessManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const processes = [
    {
      id: 1,
      name: 'Silicon Purification',
      category: 'Manufacturing',
      description: 'High-purity silicon production for solar cells',
      inputs: ['Raw Silicon', 'Electricity', 'Chemical Reagents'],
      outputs: ['Purified Silicon', 'Waste Heat', 'Chemical Waste'],
      co2Impact: '12.4 kg CO2-eq/kg',
      energyConsumption: '45.2 kWh/kg',
      status: 'Verified',
      aiOptimized: true
    },
    {
      id: 2,
      name: 'Battery Cell Assembly',
      category: 'Manufacturing',
      description: 'Lithium-ion battery cell manufacturing process',
      inputs: ['Lithium', 'Cobalt', 'Nickel', 'Electricity'],
      outputs: ['Battery Cells', 'Manufacturing Waste'],
      co2Impact: '8.9 kg CO2-eq/unit',
      energyConsumption: '32.1 kWh/unit',
      status: 'Draft',
      aiOptimized: false
    },
    {
      id: 3,
      name: 'Plastic Injection Molding',
      category: 'Manufacturing',
      description: 'Polymer processing for packaging components',
      inputs: ['Polymer Pellets', 'Electricity', 'Cooling Water'],
      outputs: ['Molded Parts', 'Plastic Waste', 'Wastewater'],
      co2Impact: '2.1 kg CO2-eq/kg',
      energyConsumption: '3.4 kWh/kg',
      status: 'Verified',
      aiOptimized: true
    },
    {
      id: 4,
      name: 'Wind Turbine Transportation',
      category: 'Transportation',
      description: 'Heavy-duty transport of wind turbine components',
      inputs: ['Diesel Fuel', 'Transportation Service'],
      outputs: ['Transport Service', 'Emissions'],
      co2Impact: '0.8 kg CO2-eq/km',
      energyConsumption: '2.1 kWh/km',
      status: 'Under Review',
      aiOptimized: false
    },
    {
      id: 5,
      name: 'Solar Panel Recycling',
      category: 'End-of-Life',
      description: 'Recovery of materials from decommissioned solar panels',
      inputs: ['Used Solar Panels', 'Electricity', 'Chemical Solvents'],
      outputs: ['Recovered Silicon', 'Recovered Metals', 'Waste'],
      co2Impact: '-1.2 kg CO2-eq/panel',
      energyConsumption: '5.8 kWh/panel',
      status: 'Verified',
      aiOptimized: true
    }
  ];

  const categories = ['all', 'Manufacturing', 'Transportation', 'End-of-Life', 'Energy'];

  const filteredProcesses = processes.filter(process => {
    const matchesSearch = process.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         process.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || process.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verified':
        return 'bg-green-100 text-green-800';
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Process Manager</h2>
          <p className="text-gray-600 mt-1">Manage and optimize your LCA processes</p>
        </div>
        <button className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-green-700 transition-all duration-200 flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>New Process</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search processes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          {filteredProcesses.map((process) => (
            <div key={process.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200 cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <GitBranch className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{process.name}</h3>
                    <p className="text-sm text-gray-500">{process.category}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {process.aiOptimized && (
                    <div className="flex items-center space-x-1 bg-gradient-to-r from-blue-50 to-green-50 px-2 py-1 rounded-full">
                      <Zap className="h-3 w-3 text-blue-600" />
                      <span className="text-xs font-medium text-blue-700">AI Optimized</span>
                    </div>
                  )}
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(process.status)}`}>
                    {process.status}
                  </span>
                  <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">{process.description}</p>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">CO2 Impact:</span>
                  <span className="font-medium text-gray-900">{process.co2Impact}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Energy Consumption:</span>
                  <span className="font-medium text-gray-900">{process.energyConsumption}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Inputs</h4>
                  <div className="flex flex-wrap gap-1">
                    {process.inputs.map((input, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                        {input}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-center py-2">
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Outputs</h4>
                  <div className="flex flex-wrap gap-1">
                    {process.outputs.map((output, index) => (
                      <span key={index} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">
                        {output}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredProcesses.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="text-gray-400 mb-4">
            <Database className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No processes found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search criteria or create a new process.</p>
          <button className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-green-700 transition-all duration-200">
            Create New Process
          </button>
        </div>
      )}
    </div>
  );
};

export default ProcessManager;