'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FileText, ShieldCheck, AlertCircle, HelpCircle } from 'lucide-react';

export default function TermsPage() {
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
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Terms of Service
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
                <ShieldCheck className="w-6 h-6 text-blue-600" />
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing or using DataVision (&ldquo;the Service&rdquo;), you agree to be bound by these Terms of Service.
                If you do not agree with any part of these terms, you may not use our services.
              </p>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                2. User Accounts & Security
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                When you create an account with us, you must provide accurate and complete information.
                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
                <li>You must notify us immediately of any unauthorized use of your account.</li>
                <li>You must be at least 18 years of age or have parental consent to use the Service.</li>
                <li>One person or legal entity may not maintain more than one free account.</li>
              </ul>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                3. Data Usage & Intellectual Property
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                You retain all rights and ownership to the datasets and files you upload to DataVision.
                By uploading files, you grant DataVision a limited license solely to process, analyze, and render visualizations on your behalf.
              </p>
              <p className="text-gray-700 leading-relaxed">
                All software, algorithms, designs, and content provided by DataVision are the exclusive property of DataVision and are protected by applicable intellectual property laws.
              </p>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-amber-500" />
                4. Acceptable Use
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                You agree not to misuse the Service or assist anyone else in doing so. You must not:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
                <li>Upload malicious files, viruses, or harmful scripts.</li>
                <li>Attempt to reverse engineer or decompile any part of the platform.</li>
                <li>Use automated systems to extract data or exceed reasonable API rate limits.</li>
                <li>Upload content that infringes upon the privacy or intellectual property of others.</li>
              </ul>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                5. Limitation of Liability
              </h2>
              <p className="text-gray-700 leading-relaxed">
                DataVision and its AI-generated insights are provided on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis.
                While we strive for high precision and data integrity, we do not guarantee that insights will be error-free.
                In no event shall DataVision be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use the Service.
              </p>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-blue-600" />
                6. Contact Us
              </h2>
              <p className="text-gray-700 leading-relaxed">
                If you have questions about these Terms of Service, please contact our support team at{' '}
                <span className="font-semibold text-blue-600">support@datavision.ai</span>.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
