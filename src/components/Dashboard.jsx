import React from 'react';
import { 
  TrendingUp, 
  Activity, 
  Database, 
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart
} from 'lucide-react';

const Dashboard = () => {
  const metrics = [
    {
      title: 'Active Projects',
      value: '12',
      change: '+3.2%',
      trend: 'up',
      icon: BarChart3,
      color: 'blue'
    },
    {
      title: 'Carbon Footprint',
      value: '2.4k',
      change: '-12.1%',
      trend: 'down',
      icon: Activity,
      color: 'green'
    },
    {
      title: 'Database Records',
      value: '45.2k',
      change: '+8.4%',
      trend: 'up',
      icon: Database,
      color: 'purple'
    },
    {
      title: 'AI Insights',
      value: '156',
      change: '+24.6%',
      trend: 'up',
      icon: Zap,
      color: 'orange'
    }
  ];

  const recentProjects = [
    { name: 'Solar Panel Manufacturing', status: 'In Progress', completion: 75, impact: 'Medium' },
    { name: 'Electric Vehicle Battery', status: 'Completed', completion: 100, impact: 'High' },
    { name: 'Packaging Analysis', status: 'In Progress', completion: 40, impact: 'Low' },
    { name: 'Wind Turbine Components', status: 'Planning', completion: 15, impact: 'High' }
  ];

  const aiInsights = [
    {
      title: 'Optimization Opportunity',
      description: 'Reducing transport distance could lower emissions by 18%',
      priority: 'High',
      project: 'Solar Panel Manufacturing'
    },
    {
      title: 'Data Quality Alert',
      description: 'Missing emission factors for 3 processes detected',
      priority: 'Medium',
      project: 'Electric Vehicle Battery'
    },
    {
      title: 'Benchmark Analysis',
      description: 'Your project performs 15% better than industry average',
      priority: 'Info',
      project: 'Packaging Analysis'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600 mt-1">Overview of your LCA projects and insights</p>
        </div>
        <button className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-green-700 transition-all duration-200">
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const TrendIcon = metric.trend === 'up' ? ArrowUpRight : ArrowDownRight;
          
          return (
            <div key={metric.title} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-${metric.color}-50 flex items-center justify-center`}>
                  <Icon className={`h-6 w-6 text-${metric.color}-600`} />
                </div>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                  metric.trend === 'up' 
                    ? 'bg-green-50 text-green-700' 
                    : 'bg-red-50 text-red-700'
                }`}>
                  <TrendIcon className="h-3 w-3" />
                  <span>{metric.change}</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</h3>
              <p className="text-gray-600 text-sm">{metric.title}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Projects</h3>
          <div className="space-y-4">
            {recentProjects.map((project, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{project.name}</h4>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.status === 'Completed' 
                        ? 'bg-green-100 text-green-800'
                        : project.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {project.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.impact === 'High'
                        ? 'bg-red-100 text-red-800'
                        : project.impact === 'Medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {project.impact} Impact
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.completion}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">{project.completion}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Zap className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
          </div>
          <div className="space-y-4">
            {aiInsights.map((insight, index) => (
              <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border-l-4 border-blue-600">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{insight.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    insight.priority === 'High'
                      ? 'bg-red-100 text-red-800'
                      : insight.priority === 'Medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {insight.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{insight.description}</p>
                <p className="text-xs text-gray-500">Project: {insight.project}</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-green-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-green-700 transition-all duration-200">
            View All Insights
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;