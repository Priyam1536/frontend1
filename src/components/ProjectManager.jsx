import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Calendar,
  User,
  Target,
  TrendingUp
} from 'lucide-react';

const ProjectManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const projects = [
    {
      id: 1,
      name: 'Solar Panel Manufacturing LCA',
      description: 'Comprehensive life cycle assessment of photovoltaic solar panels',
      status: 'In Progress',
      progress: 75,
      owner: 'Sarah Chen',
      dueDate: '2025-02-15',
      impact: 'High',
      category: 'Energy',
      co2Equivalent: '2.4 kg CO2-eq'
    },
    {
      id: 2,
      name: 'Electric Vehicle Battery Analysis',
      description: 'LCA study focusing on lithium-ion battery production and disposal',
      status: 'Completed',
      progress: 100,
      owner: 'Mike Rodriguez',
      dueDate: '2025-01-20',
      impact: 'Very High',
      category: 'Transportation',
      co2Equivalent: '8.7 kg CO2-eq'
    },
    {
      id: 3,
      name: 'Biodegradable Packaging Study',
      description: 'Comparing traditional vs biodegradable packaging materials',
      status: 'In Progress',
      progress: 40,
      owner: 'Emily Watson',
      dueDate: '2025-03-10',
      impact: 'Medium',
      category: 'Materials',
      co2Equivalent: '0.8 kg CO2-eq'
    },
    {
      id: 4,
      name: 'Wind Turbine Components LCA',
      description: 'Life cycle analysis of wind turbine manufacturing and operation',
      status: 'Planning',
      progress: 15,
      owner: 'David Park',
      dueDate: '2025-04-05',
      impact: 'High',
      category: 'Energy',
      co2Equivalent: 'TBD'
    }
  ];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || project.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Planning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'Very High':
        return 'bg-red-100 text-red-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Projects</h2>
          <p className="text-gray-600 mt-1">Manage your LCA projects and studies</p>
        </div>
        <button className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-green-700 transition-all duration-200 flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>New Project</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="planning">Planning</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredProjects.map((project) => (
            <div key={project.id} className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{project.owner}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{project.dueDate}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Target className="h-4 w-4" />
                      <span>{project.category}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-4 w-4" />
                      <span>{project.co2Equivalent}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getImpactColor(project.impact)}`}>
                        {project.impact} Impact
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-600">{project.progress}%</span>
                    </div>
                  </div>
                  
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search criteria or create a new project.</p>
          <button className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-green-700 transition-all duration-200">
            Create New Project
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectManager;