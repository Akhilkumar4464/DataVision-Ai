'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { exportReportAsPDF, exportReportAsDOCX } from '@/lib/utils/export';
import { Download, ArrowLeft, Trash2 } from 'lucide-react';

export default function ReportDetailPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReport = useCallback(async () => {
    try {
      const response = await fetch(`/api/reports/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setReport(data);
      } else {
        setError('Report not found');
      }
    } catch (err) {
      setError('Failed to load report');
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (session && params.id) {
      fetchReport();
    }
  }, [session, params.id, fetchReport]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this report?')) return;

    try {
      const response = await fetch(`/api/reports/${params.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/dashboard');
      } else {
        alert('Failed to delete report');
      }
    } catch (err) {
      alert('Error deleting report');
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading report...</p>
        </div>
      </main>
    );
  }

  if (error || !report) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Report Not Found</h1>
          <p className="text-gray-600 mb-8">{error || 'The report you are looking for does not exist.'}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
        <Footer />
      </main>
    );
  }

  const reportContent = {
    title: report.title,
    sections: [
      {
        heading: 'Executive Summary',
        content: report.insights?.summary || 'No summary available.',
      },
      {
        heading: 'Dataset Overview',
        content: `This report analyzes ${report.fileName} (${report.fileType}) containing ${report.data?.metadata?.rowCount || 0} rows and ${report.data?.metadata?.columnCount || 0} columns.`,
      },
      {
        heading: 'Key Trends',
        content: report.insights?.trends?.length > 0
          ? report.insights.trends.map((trend: string, idx: number) => `${idx + 1}. ${trend}`).join('\n')
          : 'No significant trends detected.',
      },
      {
        heading: 'Data Anomalies',
        content: report.insights?.anomalies?.length > 0
          ? report.insights.anomalies.slice(0, 10).map((anomaly: string, idx: number) => `${idx + 1}. ${anomaly}`).join('\n')
          : 'No significant anomalies detected.',
      },
      {
        heading: 'Recommendations',
        content: report.insights?.recommendations?.length > 0
          ? report.insights.recommendations.map((rec: string, idx: number) => `${idx + 1}. ${rec}`).join('\n')
          : 'No recommendations available.',
      },
    ],
    generatedAt: new Date(report.createdAt),
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 rounded-2xl shadow-soft-lg mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{report.title}</h1>
              <p className="text-gray-600">
                Created: {new Date(report.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => exportReportAsPDF(reportContent)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                PDF
              </button>
              <button
                onClick={() => exportReportAsDOCX(reportContent)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                DOCX
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {reportContent.sections.map((section, idx) => (
              <div key={idx} className="p-6 bg-white rounded-lg">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">{section.heading}</h2>
                <p className="text-gray-700 whitespace-pre-line">{section.content}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
