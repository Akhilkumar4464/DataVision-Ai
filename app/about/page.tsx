'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Target, Users, Zap, Shield } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-4">About DataVision</h1>
            <p className="text-xl text-gray-600">
              Making data analysis accessible to everyone
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="glass p-8 rounded-2xl shadow-soft-lg mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              DataVision was born from the belief that powerful data analysis shouldn't be
              limited to data scientists. We're on a mission to democratize data insights,
              making it easy for anyone to transform their data into actionable intelligence.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Whether you're a small business owner analyzing sales data, a researcher
              working with survey results, or a student exploring datasets, DataVision
              empowers you to unlock the stories hidden in your data.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                className="glass p-6 rounded-2xl shadow-soft"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="glass p-8 rounded-2xl shadow-soft-lg"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold mr-4">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Upload Your Data</h3>
                  <p className="text-gray-600">
                    Simply upload your Excel, CSV, PDF, or DOCX files through our intuitive interface.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold mr-4">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Automatic Analysis</h3>
                  <p className="text-gray-600">
                    Our AI engine automatically parses, normalizes, and analyzes your data in seconds.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold mr-4">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Visualize & Insights</h3>
                  <p className="text-gray-600">
                    Explore your data through rich visualizations and get AI-powered insights, trends,
                    and recommendations.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold mr-4">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Export & Share</h3>
                  <p className="text-gray-600">
                    Export your charts and reports in multiple formats and share them with your team.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

const values = [
  {
    icon: Target,
    title: 'Accuracy',
    description: 'We ensure your data is analyzed with precision and accuracy, providing reliable insights you can trust.',
  },
  {
    icon: Zap,
    title: 'Speed',
    description: 'Process and analyze large datasets in seconds, not hours. Get insights when you need them.',
  },
  {
    icon: Shield,
    title: 'Security',
    description: 'Your data is encrypted and stored securely. We never share your information with third parties.',
  },
  {
    icon: Users,
    title: 'Accessibility',
    description: 'Built for everyone, regardless of technical expertise. Intuitive design meets powerful features.',
  },
];
