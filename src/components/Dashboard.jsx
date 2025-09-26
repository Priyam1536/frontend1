import React, { useState } from 'react';
import LCAForm from './LCAForm';
import { 
  TrendingUp, 
  Activity, 
  Database, 
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart,
  User
} from 'lucide-react';

const Dashboard = () => {
  const [username, setUsername] = useState('John Doe');

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

  const handleLCAComplete = (data) => {
    console.log('LCA completed:', data);
    // Handle the completed LCA data
  };
  
  const handleLCACancel = () => {
    console.log('LCA cancelled');
    // Handle cancellation
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navigation bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left side of navbar */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {/* You can add logo or app name here */}
                <h1 className="text-xl font-bold text-blue-600">OreSense AI</h1>
              </div>
            </div>
            
            {/* Right side with welcome message - ENHANCED VISIBILITY */}
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-100 to-blue-50 border border-blue-200 rounded-lg px-5 py-2.5 flex items-center shadow-sm">
                <User className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <div className="text-xs font-medium text-blue-600">Welcome</div>
                  <div className="text-sm font-semibold text-gray-900">{username}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LCAForm 
            onComplete={handleLCAComplete} 
            onCancel={handleLCACancel}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;