import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Download, Filter } from 'lucide-react';

const ImpactResults = () => {
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [timeRange, setTimeRange] = useState('year');

  // Sample data for different environmental impacts
  const impactData = [
    {
      category: 'Carbon Footprint',
      value: 2.5,
      unit: 'kg CO₂-eq',
      trend: 'down',
      change: -12,
      status: 'good',
      benchmark: 3.2
    },
    {
      category: 'Water Usage',
      value: 15.2,
      unit: 'L/kg',
      trend: 'up',
      change: 8,
      status: 'warning',
      benchmark: 12.0
    },
    {
      category: 'Energy Consumption',
      value: 45.8,
      unit: 'MJ/kg',
      trend: 'down',
      change: -5,
      status: 'good',
      benchmark: 48.0
    },
    {
      category: 'Land Use',
      value: 0.08,
      unit: 'm²/kg',
      trend: 'stable',
      change: 0,
      status: 'neutral',
      benchmark: 0.08
    }
  ];

  const monthlyTrends = [
    { month: 'Jan', carbonFootprint: 2.8, waterUsage: 14.5, energyConsumption: 48.2 },
    { month: 'Feb', carbonFootprint: 2.7, waterUsage: 14.8, energyConsumption: 47.5 },
    { month: 'Mar', carbonFootprint: 2.6, waterUsage: 15.1, energyConsumption: 46.8 },
    { month: 'Apr', carbonFootprint: 2.5, waterUsage: 15.2, energyConsumption: 45.8 },
    { month: 'May', carbonFootprint: 2.4, waterUsage: 15.0, energyConsumption: 45.2 },
    { month: 'Jun', carbonFootprint: 2.5, waterUsage: 15.2, energyConsumption: 45.8 }
  ];

  const processBreakdown = [
    { name: 'Mining', value: 40, color: '#8884d8' },
    { name: 'Processing', value: 35, color: '#82ca9d' },
    { name: 'Transportation', value: 15, color: '#ffc658' },
    { name: 'Packaging', value: 10, color: '#ff7300' }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-green-500" />;
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-full overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Environmental Impact Results</h1>
            <p className="text-gray-600 mt-1">Comprehensive analysis of environmental impacts across all processes</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              Export Report
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex gap-4 mb-6">
          <select 
            value={selectedMetric} 
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Metrics</option>
            <option value="carbon">Carbon Footprint</option>
            <option value="water">Water Usage</option>
            <option value="energy">Energy Consumption</option>
          </select>
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {impactData.map((metric, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">{metric.category}</h3>
              {getStatusIcon(metric.status)}
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                <p className="text-sm text-gray-500">{metric.unit}</p>
              </div>
              <div className="flex items-center gap-2">
                {getTrendIcon(metric.trend)}
                <span className={`text-sm font-medium ${
                  metric.change > 0 ? 'text-red-600' : 
                  metric.change < 0 ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {metric.change !== 0 && `${metric.change > 0 ? '+' : ''}${metric.change}%`}
                </span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Benchmark: {metric.benchmark} {metric.unit}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Trends */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="carbonFootprint" stroke="#8884d8" name="Carbon Footprint" />
              <Line type="monotone" dataKey="waterUsage" stroke="#82ca9d" name="Water Usage" />
              <Line type="monotone" dataKey="energyConsumption" stroke="#ffc658" name="Energy Consumption" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Process Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Impact by Process</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={processBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {processBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Impact Analysis</h3>
        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Impact Category</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Current Value</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Industry Average</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Performance</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Recommendations</th>
              </tr>
            </thead>
            <tbody>
              {impactData.map((metric, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{metric.category}</td>
                  <td className="py-3 px-4">{metric.value} {metric.unit}</td>
                  <td className="py-3 px-4">{metric.benchmark} {metric.unit}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      metric.status === 'good' ? 'bg-green-100 text-green-800' :
                      metric.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {metric.status === 'good' ? 'Above Average' : 
                       metric.status === 'warning' ? 'Below Average' : 'Average'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-blue-600 hover:text-blue-800 cursor-pointer">
                    View Details →
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ImpactResults;