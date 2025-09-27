import React, { useEffect } from 'react';
import { 
  FileText, 
  Eye, 
  Trash2, 
  Calendar, 
  AlertCircle
} from 'lucide-react';

// Updated to receive reports as props instead of fetching internally
const ReportsList = ({ reports = [], onViewReport, onDeleteReport }) => {
  // On mount, ensure we have all reports properly saved to localStorage for viewing
  useEffect(() => {
    if (reports && reports.length > 0) {
      try {
        const savedReports = JSON.parse(localStorage.getItem('savedReports') || '[]');
        
        // Ensure all displayed reports are in localStorage
        const updatedReports = [...savedReports];
        let needsUpdate = false;
        
        reports.forEach(report => {
          // Check if this report exists in localStorage by ID
          const existingIndex = updatedReports.findIndex(r => 
            String(r.id) === String(report.id)
          );
          
          if (existingIndex === -1) {
            // Add this report to localStorage
            updatedReports.push({
              id: report.id,
              date: new Date().toISOString(),
              title: report.name || `${report.metalType} Life Cycle Assessment`,
              metalType: report.metalType,
              insights: report.insights || "",
              recommendations: report.recommendations || [],
              formData: report.formData || {}
            });
            needsUpdate = true;
          }
        });
        
        if (needsUpdate) {
          localStorage.setItem('savedReports', JSON.stringify(updatedReports));
          console.log("Updated localStorage with all current reports");
        }
      } catch (err) {
        console.error("Error syncing reports with localStorage:", err);
      }
    }
  }, [reports]);
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (!reports || reports.length === 0) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
        <FileText className="h-8 w-8 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-2">No saved reports found</p>
        <p className="text-sm text-gray-500">Complete an LCA assessment to create your first report.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <div 
            key={report.id} 
            className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{report.name}</h3>
                  <p className="text-sm text-gray-500">{report.metalType}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  report.status === 'completed' ? 'bg-green-100 text-green-800' : 
                  report.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-gray-100 text-gray-800'
                }`}>
                  {report.status}
                </span>
              </div>
              
              <div className="mt-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                  <span>Created: {report.createdDate || formatDate(report.createdAt)}</span>
                </div>
                
                {report.co2Impact && (
                  <div className="mt-1">
                    <span className="font-medium">CO₂ Impact:</span> {report.co2Impact}
                  </div>
                )}
              </div>
            </div>
            
            <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 flex justify-between">
              <button
                onClick={() => {
                  console.log("View button clicked for report:", report);
                  if (onViewReport) {
                    const reportId = String(report.id);
                    console.log("Viewing report with ID:", reportId);
                    onViewReport(reportId);
                  }
                }}
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                aria-label={`View report for ${report.name}`}
              >
                <Eye className="mr-1 h-4 w-4" /> View
              </button>
              
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this report?')) {
                    // Remove from localStorage
                    const savedReports = JSON.parse(localStorage.getItem('savedReports') || '[]');
                    const updatedReports = savedReports.filter(r => r.id !== report.id);
                    localStorage.setItem('savedReports', JSON.stringify(updatedReports));
                    
                    // Call the parent component's delete handler
                    onDeleteReport && onDeleteReport(report.id);
                  }
                }}
                className="inline-flex items-center text-sm text-red-600 hover:text-red-800"
              >
                <Trash2 className="mr-1 h-4 w-4" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportsList;
  