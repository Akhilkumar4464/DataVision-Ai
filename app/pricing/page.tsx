'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Check, ArrowRight } from 'lucide-react';

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Pricing</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the plan that works best for you. All plans include our core features.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className={`glass p-8 rounded-2xl shadow-soft-lg ${
                  plan.featured ? 'ring-2 ring-blue-500 scale-105' : ''
                }`}
              >
                {plan.featured && (
                  <div className="inline-block px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full mb-4">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.period && (
                    <span className="text-gray-600 ml-2">/{plan.period}</span>
                  )}
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/signup"
                  className={`block w-full text-center px-6 py-3 rounded-lg font-semibold transition-colors ${
                    plan.featured
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Get Started
                  <ArrowRight className="inline-block ml-2 w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'month',
    featured: false,
    features: [
      '5 file uploads per month',
      'Basic visualizations',
      'Standard insights',
      'PDF export',
      'Community support',
    ],
  },
  {
    name: 'Pro',
    price: '$29',
    period: 'month',
    featured: true,
    features: [
      'Unlimited file uploads',
      'All visualization types',
      'Advanced AI insights',
      'All export formats',
      'Priority support',
      'Report history',
      'Team collaboration',
    ],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    featured: false,
    features: [
      'Everything in Pro',
      'Custom integrations',
      'Dedicated support',
      'Advanced security',
      'Custom analytics',
      'SLA guarantee',
      'On-premise deployment',
    ],
  },
];
