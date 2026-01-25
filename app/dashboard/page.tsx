'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { parseFile, ParsedData } from '@/lib/utils/dataParser.client';
import { generateInsights, Insights } from '@/lib/utils/insights';
import { generateReport, ReportContent } from '@/lib/utils/reportGenerator';
import { exportChartAsPNG, exportChartAsSVG, exportChartAsPDF, exportReportAsPDF, exportReportAsDOCX } from '@/lib/utils/export';
import BarChart from '@/components/charts/BarChart';
import LineChart from '@/components/charts/LineChart';
import PieChart from '@/components/charts/PieChart';
import AreaChart from '@/components/charts/AreaChart';
import RadarChart from '@/components/charts/RadarChart';
import { Upload, FileText, BarChart3, TrendingUp, AlertTriangle, Lightbulb, Download, Save, X } from 'lucide-react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [report, setReport] = useState<ReportContent | null>(null);
  const [selectedChartType, setSelectedChartType] = useState<string>('bar');
  const [xColumn, setXColumn] = useState<string>('');
  const [yColumn, setYColumn] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [chartData, setChartData] = useState<any[]>([]);
  const [savedReports, setSavedReports] = useState<any[]>([]);
  const [reportTitle, setReportTitle] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  const fetchReports = useCallback(async () => {
    try {
      const response = await fetch('/api/reports');
      if (response.ok) {
        const data = await response.json();
        setSavedReports(data);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
    }
  }, []);

  useEffect(() => {
    if (session) {
      fetchReports();
    }
  }, [session, fetchReports]);

  const prepareChartData = useCallback(() => {
    if (!parsedData) return;

    const xIndex = parsedData.columns.indexOf(xColumn);
    const yIndex = parsedData.columns.indexOf(yColumn);

    if (xIndex === -1 || yIndex === -1) return;

    let data: any[] = [];

    if (selectedChartType === 'pie' || selectedChartType === 'radar') {
      // For pie and radar charts, aggregate data
      const grouped: { [key: string]: number } = {};
      parsedData.rows.forEach((row) => {
        const key = String(row[xIndex] || 'Unknown');
        const value = parseFloat(row[yIndex]) || 0;
        grouped[key] = (grouped[key] || 0) + value;
      });

      if (selectedChartType === 'pie') {
        data = Object.entries(grouped).map(([name, value]) => ({
          name,
          value,
        }));
      } else {
        data = Object.entries(grouped).map(([name, value]) => ({
          name,
          value,
        }));
      }
    } else {
      // For other charts, use first N rows
      data = parsedData.rows.slice(0, 50).map((row) => ({
        [xColumn]: row[xIndex],
        [yColumn]: parseFloat(row[yIndex]) || 0,
      }));
    }

    setChartData(data);
  }, [parsedData, xColumn, yColumn, selectedChartType]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');
    setParsedData(null);
    setInsights(null);
    setReport(null);

    try {
      let data: ParsedData;
      const fileName = file.name.toLowerCase();
      const fileType = file.type || '';

      // Check if file needs server-side parsing (PDF, DOCX)
      if (
        fileType.includes('pdf') || 
        fileName.endsWith('.pdf') ||
        fileType.includes('wordprocessingml') || 
        fileName.endsWith('.docx')
      ) {
        // Use API route for PDF and DOCX
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/files/parse', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to parse file');
        }

        data = await response.json();
      } else {
        // Use client-side parsing for Excel and CSV
        data = await parseFile(file);
      }

      setParsedData(data);
      
      // Auto-select first two columns if available
      if (data.columns.length >= 2) {
        setXColumn(data.columns[0]);
        setYColumn(data.columns[1]);
      } else if (data.columns.length === 1) {
        setXColumn(data.columns[0]);
        setYColumn(data.columns[0]);
      }

      // Generate AI insights via API
      try {
        const insightsResponse = await fetch('/api/insights/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data }),
        });

        if (!insightsResponse.ok) {
          throw new Error('Failed to generate AI insights');
        }

        const generatedInsights = await insightsResponse.json();
        setInsights(generatedInsights);

        const generatedReport = generateReport(file.name, data, generatedInsights);
        setReport(generatedReport);
        setReportTitle(file.name.replace(/\.[^/.]+$/, ''));
      } catch (insightsError: any) {
        // Fallback to local insights generation if API fails
        console.warn('AI insights failed, using fallback:', insightsError);
        const generatedInsights = generateInsights(data);
        setInsights(generatedInsights);

        const generatedReport = generateReport(file.name, data, generatedInsights);
        setReport(generatedReport);
        setReportTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to parse file');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveReport = async () => {
    if (!parsedData || !insights || !report || !session) return;

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: reportTitle || parsedData.metadata?.fileName || 'Untitled Report',
          fileName: parsedData.metadata?.fileName || 'unknown',
          fileType: parsedData.metadata?.fileType || 'unknown',
          data: parsedData,
          insights,
          charts: [{ type: selectedChartType, data: chartData }],
        }),
      });

      if (response.ok) {
        await fetchReports();
        alert('Report saved successfully!');
      } else {
        throw new Error('Failed to save report');
      }
    } catch (err) {
      alert('Error saving report');
    }
  };

  if (status === 'loading') {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </main>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {/* File Upload */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 rounded-2xl shadow-soft-lg mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">Upload File</h2>
            {parsedData && (
              <button
                onClick={() => {
                  setParsedData(null);
                  setInsights(null);
                  setReport(null);
                  setChartData([]);
                }}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-10 h-10 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">Excel, CSV, PDF, DOCX (MAX. 10MB)</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept=".xlsx,.xls,.csv,.pdf,.docx"
              onChange={handleFileUpload}
              disabled={loading}
            />
          </label>

          {loading && (
            <div className="mt-4 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Processing file...</p>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
        </motion.div>

        {parsedData && insights && (
          <>
            {/* Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
            >
              <div className="glass p-6 rounded-2xl shadow-soft">
                <div className="flex items-center mb-4">
                  <FileText className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Summary</h3>
                </div>
                <p className="text-gray-700">{insights.summary}</p>
              </div>

              <div className="glass p-6 rounded-2xl shadow-soft">
                <div className="flex items-center mb-4">
                  <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Trends</h3>
                </div>
                <ul className="space-y-2">
                  {insights.trends.length > 0 ? (
                    insights.trends.map((trend, idx) => (
                      <li key={idx} className="text-gray-700 text-sm">• {trend}</li>
                    ))
                  ) : (
                    <li className="text-gray-500 text-sm">No trends detected</li>
                  )}
                </ul>
              </div>

              <div className="glass p-6 rounded-2xl shadow-soft">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Anomalies</h3>
                </div>
                <ul className="space-y-2 max-h-40 overflow-y-auto">
                  {insights.anomalies.length > 0 ? (
                    insights.anomalies.slice(0, 5).map((anomaly, idx) => (
                      <li key={idx} className="text-gray-700 text-sm">• {anomaly}</li>
                    ))
                  ) : (
                    <li className="text-gray-500 text-sm">No anomalies detected</li>
                  )}
                </ul>
              </div>

              <div className="glass p-6 rounded-2xl shadow-soft">
                <div className="flex items-center mb-4">
                  <Lightbulb className="w-5 h-5 text-purple-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Recommendations</h3>
                </div>
                <ul className="space-y-2">
                  {insights.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-gray-700 text-sm">• {rec}</li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Chart Configuration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-8 rounded-2xl shadow-soft-lg mb-8"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Visualizations</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Chart Type</label>
                  <select
                    value={selectedChartType}
                    onChange={(e) => setSelectedChartType(e.target.value)}
                    className="w-full px-4 py-2 border text-gray-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="bar">Bar Chart</option>
                    <option value="line">Line Chart</option>
                    <option value="pie">Pie Chart</option>
                    <option value="area">Area Chart</option>
                    <option value="radar">Radar Chart</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">X Axis</label>
                  <select
                    value={xColumn}
                    onChange={(e) => setXColumn(e.target.value)}
                    className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    {parsedData.columns.map((col) => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Y Axis</label>
                  <select
                    value={yColumn}
                    onChange={(e) => setYColumn(e.target.value)}
                    className="w-full px-4 py-2 border text-gray-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    {parsedData.columns.map((col) => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </div>
              </div>

              {chartData.length > 0 && (
                <div id="chart-container" className="mb-6 p-4 bg-white rounded-lg">
                  {selectedChartType === 'bar' && (
                    <BarChart data={chartData} xKey={xColumn} yKey={yColumn} />
                  )}
                  {selectedChartType === 'line' && (
                    <LineChart data={chartData} xKey={xColumn} yKey={yColumn} />
                  )}
                  {selectedChartType === 'pie' && (
                    <PieChart data={chartData} nameKey="name" valueKey="value" />
                  )}
                  {selectedChartType === 'area' && (
                    <AreaChart data={chartData} xKey={xColumn} yKey={yColumn} />
                  )}
                  {selectedChartType === 'radar' && (
                    <RadarChart data={chartData} dataKey="value" />
                  )}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => exportChartAsPNG('chart-container', 'chart')}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  PNG
                </button>
                <button
                  onClick={() => exportChartAsSVG('chart-container', 'chart')}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  SVG
                </button>
                <button
                  onClick={() => exportChartAsPDF('chart-container', 'chart')}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </button>
              </div>
            </motion.div>

            {/* Report Generation */}
            {report && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-8 rounded-2xl shadow-soft-lg mb-8"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Report</h2>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Report Title</label>
                  <input
                    type="text"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    className="w-full px-4 py-2 border text-gray-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Enter report title"
                  />
                </div>

                <div className="mb-6 p-6 bg-white rounded-lg max-h-96 overflow-y-auto">
                  <h3 className="text-xl font-bold mb-4">{report.title}</h3>
                  {report.sections.map((section, idx) => (
                    <div key={idx} className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{section.heading}</h4>
                      <p className="text-gray-700 whitespace-pre-line">{section.content}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleSaveReport}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Report
                  </button>
                  <button
                    onClick={() => report && exportReportAsPDF(report)}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export PDF
                  </button>
                  <button
                    onClick={() => report && exportReportAsDOCX(report)}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export DOCX
                  </button>
                </div>
              </motion.div>
            )}
          </>
        )}

        {/* Saved Reports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 rounded-2xl shadow-soft-lg"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Saved Reports</h2>
          
          {savedReports.length === 0 ? (
            <p className="text-gray-600">No saved reports yet. Upload and analyze a file to get started!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedReports.map((report) => (
                <div key={report._id} className="p-4 bg-white rounded-lg shadow-soft hover:shadow-soft-lg transition-shadow">
                  <h3 className="font-semibold text-gray-900 mb-2">{report.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/dashboard/reports/${report._id}`)}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
