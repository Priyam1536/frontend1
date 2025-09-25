import React from 'react';
import { 
  FileText, 
  Plus, 
  Calendar,
  TrendingUp,
  Download,
  Eye
} from 'lucide-react';

interface Report {
  id: string;
  name: string;
  metalType: string;
  createdDate: string;
  status: 'completed' | 'draft';
  co2Impact: string;
}

interface ReportsDashboardProps {
  reports: Report[];
  onNewReport: () => void;
  onViewReport: (reportId: string) => void;
}

const ReportsDashboard: React.FC<ReportsDashboardProps> = ({ 
  reports, 
  onNewReport, 
  onViewReport 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (reports.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reports Made Till Now</h3>
          <p className="text-gray-600 mb-6">
            Start your first LCA assessment to generate comprehensive environmental impact reports.
          </p>
          <button
            onClick={onNewReport}
            className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-green-700 transition-all duration-200 flex items-center space-x-2 mx-auto"
          >
            <Plus className="h-5 w-5" />
            <span>Create First Report</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">LCA Reports</h2>
          <p className="text-gray-600 mt-1">
            {reports.length} report{reports.length !== 1 ? 's' : ''} generated
          </p>
        </div>
        <button
          onClick={onNewReport}
          className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-green-700 transition-all duration-200 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>New Report</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div key={report.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{report.name}</h3>
                  <p className="text-sm text-gray-500">{report.metalType}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                {report.status}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">CO₂ Impact:</span>
                <span className="font-medium text-gray-900">{report.co2Impact}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Created:</span>
                <span className="font-medium text-gray-900">{report.createdDate}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onViewReport(report.id)}
                className="flex-1 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg font-medium hover:bg-blue-100 transition-colors flex items-center justify-center space-x-1"
              >
                <Eye className="h-4 w-4" />
                <span>View</span>
              </button>
              <button className="bg-gray-50 text-gray-700 px-3 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center justify-center">
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportsDashboard;