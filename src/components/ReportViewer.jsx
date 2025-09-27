import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, BarChart, FileText, Printer } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { reportUtils } from '../utils/api';

const ReportViewer = ({ reportId, reportData, onBack }) => {
  const [report, setReport] = useState(reportData || null);
  const [loading, setLoading] = useState(!reportData);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If report data was passed directly, use that
    if (reportData) {
      console.log("Using directly provided report data:", reportData);
      setReport(reportData);
      setLoading(false);
      return;
    }
    
    const fetchReport = () => {
      try {
        setLoading(true);
        console.log("Looking for report with ID:", reportId);
        
        // Try to get from localStorage
        const savedReports = JSON.parse(localStorage.getItem('savedReports') || '[]');
        console.log("Available reports in localStorage:", savedReports);
        
        // Try to match by id (string comparison)
        let foundReport = savedReports.find(r => String(r.id) === String(reportId));
        
        if (foundReport) {
          console.log("Found report in localStorage:", foundReport);
          setReport(foundReport);
        } else {
          // As a fallback, try to match by index
          const index = parseInt(reportId);
          if (!isNaN(index) && index >= 0 && index < savedReports.length) {
            foundReport = savedReports[index];
            console.log("Found report by index:", foundReport);
            setReport(foundReport);
          } else {
            console.error("Report not found with ID:", reportId);
            setError('Report not found');
          }
        }
      } catch (err) {
        console.error('Error fetching report:', err);
        setError('Failed to load report');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId]);

  const handleDownloadPDF = () => {
    if (!report) return;
    
    try {
      // Use the same PDF generation logic as in PDFReportButton component
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(22);
      doc.setTextColor(0, 51, 102); // Navy blue color for the title
      doc.text('Life Cycle Assessment Report', 105, 20, { align: 'center' });
      
      // Add date
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100); // Gray color for the date
      doc.text(`Generated on: ${new Date(report.date).toLocaleDateString()}`, 105, 30, { align: 'center' });
      
      // Add horizontal line
      doc.setDrawColor(220, 220, 220);
      doc.line(20, 35, 190, 35);
      
      // Reset text color
      doc.setTextColor(0, 0, 0);
      
      // Start position for content
      let yPosition = 45;
      
      // Add metal type if available
      const metalType = report.metalType || 'Unknown Metal';
      doc.setFontSize(16);
      doc.text(`Life Cycle Assessment for: ${metalType}`, 20, yPosition);
      yPosition += 10;
      
      // Generate AI insights
      doc.setFontSize(14);
      doc.setTextColor(0, 102, 204); // Blue for section headers
      doc.text('AI-Generated LCA Insights', 20, yPosition);
      yPosition += 10;
      
      // Add insights content
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      const insights = report.insights || reportUtils.generateInsights(report.formData);
      
      // Handle text wrapping for insights
      const splitInsights = doc.splitTextToSize(insights, 170);
      doc.text(splitInsights, 20, yPosition);
      yPosition += splitInsights.length * 7 + 10;
      
      // Add recommendations section
      doc.setFontSize(14);
      doc.setTextColor(0, 102, 204);
      doc.text('Recommendations', 20, yPosition);
      yPosition += 10;
      
      // Add recommendations with bullet points
      const recommendations = report.recommendations || reportUtils.generateRecommendations(report.formData);
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      
      recommendations.forEach((recommendation, index) => {
        // Add bullet point
        doc.text('•', 20, yPosition);
        
        // Add wrapped recommendation text
        const splitRecommendation = doc.splitTextToSize(recommendation, 160);
        doc.text(splitRecommendation, 25, yPosition);
        yPosition += splitRecommendation.length * 7 + 5;
        
        // Add page if needed
        if (yPosition > 270 && index < recommendations.length - 1) {
          doc.addPage();
          yPosition = 20;
        }
      });
      
      // Save the PDF file
      const filename = `OreSense_LCA_Report_${metalType.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.pdf`;
      doc.save(filename);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Failed to generate PDF');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 my-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Reports
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center p-8">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No report found</h3>
        <p className="mt-1 text-sm text-gray-500">The requested report could not be found.</p>
        <div className="mt-6">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Reports
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {report.title || `${report.metalType} Life Cycle Assessment`}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Generated on {new Date(report.date).toLocaleDateString()}
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Printer className="mr-2 h-4 w-4" />
            Print
          </button>
          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </button>
          <button
            onClick={onBack}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </button>
        </div>
      </div>
      
      {/* Report Content */}
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        <div className="space-y-6">
          {/* Metal Type and Basic Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-lg font-medium text-gray-900">Basic Information</h4>
            <div className="mt-2 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Metal Type</dt>
                <dd className="mt-1 text-sm text-gray-900">{report.metalType}</dd>
              </div>
              
              {report.formData?.miningLocation && (
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Mining Location</dt>
                  <dd className="mt-1 text-sm text-gray-900">{report.formData.miningLocation}</dd>
                </div>
              )}
              
              {report.formData?.oreGrade && (
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Ore Grade</dt>
                  <dd className="mt-1 text-sm text-gray-900">{report.formData.oreGrade}</dd>
                </div>
              )}
              
              {report.formData?.productionVolume && (
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Production Volume</dt>
                  <dd className="mt-1 text-sm text-gray-900">{report.formData.productionVolume}</dd>
                </div>
              )}
            </div>
          </div>
          
          {/* AI Insights */}
          <div>
            <h4 className="text-lg font-medium text-blue-800 flex items-center">
              <BarChart className="mr-2 h-5 w-5 text-blue-600" />
              AI-Generated Insights
            </h4>
            <div className="mt-2 p-4 bg-blue-50 border border-blue-100 rounded-md text-sm text-gray-800">
              {report.insights || "No insights were generated for this report."}
            </div>
          </div>
          
          {/* Recommendations */}
          {report.recommendations && report.recommendations.length > 0 && (
            <div>
              <h4 className="text-lg font-medium text-green-800">Recommendations</h4>
              <ul className="mt-2 divide-y divide-gray-200">
                {report.recommendations.map((recommendation, index) => (
                  <li key={index} className="py-3 flex">
                    <span className="text-green-500 mr-2">•</span>
                    <span className="text-sm text-gray-800">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Environmental Impact Data */}
          {report.formData && (
            <div>
              <h4 className="text-lg font-medium text-gray-900">Environmental Impact Data</h4>
              <div className="mt-2 border-t border-gray-200">
                <dl className="divide-y divide-gray-200">
                  {report.formData.globalWarmingPotential && (
                    <div className="py-3 grid grid-cols-3 gap-4">
                      <dt className="text-sm font-medium text-gray-500">Global Warming Potential</dt>
                      <dd className="text-sm text-gray-900 col-span-2">{report.formData.globalWarmingPotential}</dd>
                    </div>
                  )}
                  
                  {report.formData.acidificationPotential && (
                    <div className="py-3 grid grid-cols-3 gap-4">
                      <dt className="text-sm font-medium text-gray-500">Acidification Potential</dt>
                      <dd className="text-sm text-gray-900 col-span-2">{report.formData.acidificationPotential}</dd>
                    </div>
                  )}
                  
                  {report.formData.waterScarcityFootprint && (
                    <div className="py-3 grid grid-cols-3 gap-4">
                      <dt className="text-sm font-medium text-gray-500">Water Scarcity Footprint</dt>
                      <dd className="text-sm text-gray-900 col-span-2">{report.formData.waterScarcityFootprint}</dd>
                    </div>
                  )}
                  
                  {report.formData.energyConsumptionMining && (
                    <div className="py-3 grid grid-cols-3 gap-4">
                      <dt className="text-sm font-medium text-gray-500">Energy Consumption (Mining)</dt>
                      <dd className="text-sm text-gray-900 col-span-2">{report.formData.energyConsumptionMining}</dd>
                    </div>
                  )}
                  
                  {report.formData.energyConsumptionProcessing && (
                    <div className="py-3 grid grid-cols-3 gap-4">
                      <dt className="text-sm font-medium text-gray-500">Energy Consumption (Processing)</dt>
                      <dd className="text-sm text-gray-900 col-span-2">{report.formData.energyConsumptionProcessing}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportViewer;