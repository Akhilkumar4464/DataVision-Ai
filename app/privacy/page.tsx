'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Lock, Shield, Database, Eye, Bell } from 'lucide-react';

export default function PrivacyPage() {
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
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                <Lock className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-600">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="glass p-8 sm:p-10 rounded-2xl shadow-soft-lg space-y-8"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Shield className="w-6 h-6 text-blue-600" />
                1. Overview
              </h2>
              <p className="text-gray-700 leading-relaxed">
                At DataVision, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our application.
              </p>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Database className="w-6 h-6 text-blue-600" />
                2. Information We Collect
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                We collect information that you provide directly to us when registering for an account or using our platform:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
                <li><strong className="text-gray-900">Personal Information:</strong> Name, email address, and encrypted credentials.</li>
                <li><strong className="text-gray-900">Uploaded Data:</strong> Datasets, spreadsheets (CSV, XLSX), documents (PDF, DOCX) uploaded for visualization.</li>
                <li><strong className="text-gray-900">Usage Information:</strong> Generated chart configurations, query metadata, and report history.</li>
              </ul>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Eye className="w-6 h-6 text-blue-600" />
                3. How We Use Your Information
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                We use the information we collect strictly to deliver and improve our services:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
                <li>To provide, operate, and maintain our AI data analytics platform.</li>
                <li>To process your uploaded datasets and generate analytical charts and summaries.</li>
                <li>To authenticate user sessions and secure your account.</li>
                <li>We do <strong className="text-gray-900">NOT</strong> sell your personal information or training data to third parties.</li>
              </ul>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                4. Data Security
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We implement industry-standard encryption (TLS/HTTPS for transit and AES-256 for storage) and strict database access controls. Passwords are securely hashed using bcrypt. While we use commercially acceptable means to protect your information, no method of transmission over the Internet is 100% secure.
              </p>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Bell className="w-6 h-6 text-blue-600" />
                5. Your Data Rights
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Depending on your location, you have rights regarding your personal data:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
                <li>Access, download, or review your stored data and reports at any time.</li>
                <li>Request deletion of your account and all associated datasets from our servers.</li>
                <li>Update or correct your account information directly from your dashboard.</li>
              </ul>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                6. Contact Our Privacy Team
              </h2>
              <p className="text-gray-700 leading-relaxed">
                For privacy-related inquiries or data requests, please reach out to{' '}
                <span className="font-semibold text-blue-600">privacy@datavision.ai</span>.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
