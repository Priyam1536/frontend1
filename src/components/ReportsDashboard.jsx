import React, { useState, useEffect } from 'react';
import { PlusCircle, FileText, Eye, ArrowRightLeft, Loader } from 'lucide-react';
import ReportsList from './ReportsList';
import ReportViewer from './ReportViewer';

const ReportsDashboard = ({ reports: initialReports = [], onNewReport, onComparePathways }) => {
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reports, setReports] = useState([]);

  // Fetch reports from MongoDB when component mounts
  useEffect(() => {
    const fetchReportsFromDB = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:8000/api/lca/reports', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Include auth token if available
            ...localStorage.getItem('authToken') ? 
              { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` } : {}
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch reports');
        }

        const data = await response.json();
        
        if (data.success) {
          // Transform MongoDB report format to match our component's expected format
          const formattedReports = data.reports.map(report => ({
            id: report._id,
            name: report.name,
            metalType: report.metalType,
            createdDate: new Date(report.createdAt).toLocaleDateString(),
            status: report.status || 'completed',
            co2Impact: report.formData?.globalWarmingPotential ? 
              `${report.formData.globalWarmingPotential} kg CO₂-eq` : 'Not calculated',
            formData: report.formData,
            insights: report.insights
          }));
          
          setReports(formattedReports);
        } else {
          throw new Error(data.message || 'Failed to fetch reports');
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
        setError(error.message);
        // Fall back to using localStorage reports or the initial reports passed as props
        const savedReports = JSON.parse(localStorage.getItem('savedReports') || '[]');
        
        if (savedReports && savedReports.length > 0) {
          // Format localStorage reports to match the expected structure
          const formattedReports = savedReports.map(report => ({
            id: report.id || Date.now().toString(),
            name: report.title || `${report.metalType} Assessment`,
            metalType: report.metalType || 'Unknown',
            createdDate: new Date(report.date).toLocaleDateString(),
            status: 'completed',
            co2Impact: report.formData?.globalWarmingPotential ? 
              `${report.formData.globalWarmingPotential} kg CO₂-eq` : 'Not calculated',
            formData: report.formData || {},
            insights: report.insights || '',
            recommendations: report.recommendations || []
          }));
          
          setReports(formattedReports);
        } else if (initialReports && initialReports.length > 0) {
          setReports(initialReports);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportsFromDB();
  }, [initialReports]);

  // Handle deleting a report
  const handleDeleteReport = async (reportId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/lca/reports/${reportId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Include auth token if available
          ...localStorage.getItem('authToken') ? 
            { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` } : {}
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete report');
      }

      const data = await response.json();
      
      if (data.success) {
        // Remove the deleted report from our local state
        setReports(reports.filter(report => report.id !== reportId));
      } else {
        throw new Error(data.message || 'Failed to delete report');
      }
    } catch (error) {
      console.error('Error deleting report:', error);
      alert(`Error deleting report: ${error.message}`);
    }
  };

  // Handler for viewing a report
  const handleViewReport = (reportId) => {
    console.log("ReportsDashboard: Setting selected report ID to:", reportId);
    setSelectedReportId(reportId);
  };

  // Handler for going back to the list
  const handleBackToList = () => {
    setSelectedReportId(null);
  };

  // If a report is selected, show the report viewer
  if (selectedReportId) {
    // Find the report data first to pass directly
    const reportData = reports.find(r => String(r.id) === String(selectedReportId));
    
    return (
      <div className="space-y-6">
        <ReportViewer 
          reportId={selectedReportId}
          reportData={reportData} // Pass the full report data if available
          onBack={handleBackToList} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">LCA Reports</h1>
          <p className="text-gray-600">
            {reports.length} report{reports.length !== 1 ? 's' : ''} available
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

      {isLoading ? (
        <div className="bg-white p-12 rounded-lg border border-gray-200 shadow-sm text-center">
          <div className="flex flex-col items-center">
            <Loader className="h-8 w-8 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Loading reports...</p>
          </div>
        </div>
      ) : reports.length === 0 ? (
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
            <PlusCircle className="h-5 w-5 mr-2" />
            <span>Create First Report</span>
          </button>
        </div>
      ) : (
        <ReportsList 
          reports={reports}
          onViewReport={handleViewReport} 
          onDeleteReport={handleDeleteReport}
        />
      )}
    </div>
  );
};

export default ReportsDashboard;