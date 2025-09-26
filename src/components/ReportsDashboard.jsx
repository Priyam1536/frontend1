import React from 'react';
import { PlusCircle, FileText, Eye, ArrowRightLeft } from 'lucide-react';

const ReportsDashboard = ({ reports = [], onNewReport, onViewReport, onComparePathways }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">LCA Reports</h1>
          <p className="text-gray-600">
            {reports.length} report{reports.length !== 1 ? 's' : ''} generated
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onComparePathways}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <ArrowRightLeft className="mr-2 h-4 w-4" />
            Compare Pathways
          </button>
          <button
            onClick={onNewReport}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Report
          </button>
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center">
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
            <PlusCircle className="h-5 w-5" />
            <span>Create First Report</span>
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reports.map(report => (
            <div key={report.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <FileText className="h-6 w-6 text-blue-500" />
                    <h3 className="mt-2 text-lg font-semibold text-gray-900">{report.name}</h3>
                    <p className="text-sm text-gray-500">{report.metalType}</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {report.status}
                  </span>
                </div>
                <div className="mt-4 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Created:</span>
                    <span className="font-medium">{report.createdDate}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>CO₂ Impact:</span>
                    <span className="font-medium">{report.co2Impact}</span>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 bg-gray-50 px-5 py-3">
                <button
                  onClick={() => onViewReport && onViewReport(report.id)}
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  <Eye className="mr-1 h-4 w-4" />
                  View Report
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportsDashboard;