"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Database, 
  ExternalLink, 
  Copy, 
  CheckCircle, 
  AlertCircle,
  ChevronRight,
  ChevronDown,
  Code,
  Settings,
  Play
} from 'lucide-react'
import toast from 'react-hot-toast'

interface DatabaseSetupGuideProps {
  isOpen: boolean
  onClose: () => void
}

const DatabaseSetupGuide: React.FC<DatabaseSetupGuideProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [expandedStep, setExpandedStep] = useState<number | null>(1)
  const [copiedText, setCopiedText] = useState<string | null>(null)

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(label)
      toast.success(`${label} copied to clipboard!`)
      setTimeout(() => setCopiedText(null), 2000)
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const sqlSchema = `-- Shyam Trading Company Database Schema
-- Run this SQL in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    image TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    price VARCHAR(50),
    specifications JSONB DEFAULT '{}'::jsonb,
    in_stock BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content table (for hero, about, CTA sections)
CREATE TABLE IF NOT EXISTS content (
    id SERIAL PRIMARY KEY,
    section VARCHAR(50) NOT NULL UNIQUE,
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settings table (for company info, theme, etc.)
CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) NOT NULL UNIQUE,
    value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Media table
CREATE TABLE IF NOT EXISTS media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('image', 'video')),
    category VARCHAR(50) DEFAULT 'general',
    alt TEXT,
    size INTEGER,
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    text TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access for products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read access for content" ON content FOR SELECT USING (true);
CREATE POLICY "Public read access for settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Public read access for media" ON media FOR SELECT USING (true);
CREATE POLICY "Public read access for testimonials" ON testimonials FOR SELECT USING (true);`

  const envTemplate = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here`

  const steps = [
    {
      id: 1,
      title: "Create Supabase Project",
      description: "Set up a new Supabase project for your database",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            First, you'll need to create a new Supabase project to host your database.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Steps:</h4>
            <ol className="list-decimal list-inside space-y-2 text-blue-800">
              <li>Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline">supabase.com</a></li>
              <li>Sign up or log in to your account</li>
              <li>Click "New Project"</li>
              <li>Choose your organization</li>
              <li>Enter a project name (e.g., "shyam-trading-website")</li>
              <li>Set a strong database password</li>
              <li>Select a region close to your users</li>
              <li>Click "Create new project"</li>
            </ol>
          </div>
          <div className="flex items-center space-x-3">
            <a
              href="https://supabase.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <ExternalLink size={16} />
              <span>Open Supabase</span>
            </a>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Run Database Schema",
      description: "Create the necessary tables and structure",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            Copy and run this SQL script in your Supabase SQL editor to create the database structure.
          </p>
          <div className="bg-gray-900 rounded-lg p-4 relative">
            <button
              onClick={() => copyToClipboard(sqlSchema, 'SQL Schema')}
              className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white transition-colors"
            >
              {copiedText === 'SQL Schema' ? <CheckCircle size={16} /> : <Copy size={16} />}
            </button>
            <pre className="text-green-400 text-xs overflow-x-auto pr-10">
              {sqlSchema}
            </pre>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-900 mb-2">How to run:</h4>
            <ol className="list-decimal list-inside space-y-1 text-yellow-800 text-sm">
              <li>Go to your Supabase dashboard</li>
              <li>Navigate to "SQL Editor" in the sidebar</li>
              <li>Click "New Query"</li>
              <li>Paste the SQL code above</li>
              <li>Click "Run" to execute the script</li>
            </ol>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Configure Environment Variables",
      description: "Set up your connection credentials",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            Add your Supabase credentials to your environment variables file.
          </p>
          <div className="bg-gray-900 rounded-lg p-4 relative">
            <button
              onClick={() => copyToClipboard(envTemplate, 'Environment Variables')}
              className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white transition-colors"
            >
              {copiedText === 'Environment Variables' ? <CheckCircle size={16} /> : <Copy size={16} />}
            </button>
            <pre className="text-green-400 text-sm pr-10">
              {envTemplate}
            </pre>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Steps:</h4>
            <ol className="list-decimal list-inside space-y-2 text-blue-800">
              <li>Create a file named <code className="bg-blue-100 px-1 rounded">.env.local</code> in your project root</li>
              <li>Go to your Supabase dashboard → Settings → API</li>
              <li>Copy your "Project URL" and "anon public" key</li>
              <li>Replace the placeholder values in the .env.local file</li>
              <li>Restart your development server</li>
            </ol>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Test Connection",
      description: "Verify everything is working correctly",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            Once you've completed the setup, test the connection to make sure everything works.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-2">Verification steps:</h4>
            <ul className="list-disc list-inside space-y-1 text-green-800">
              <li>Restart your development server</li>
              <li>Go to Admin → Settings → Database tab</li>
              <li>Check that the status shows "Connected to Supabase"</li>
              <li>Try adding a test product to verify write operations</li>
              <li>Check that changes appear on the main website</li>
            </ul>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertCircle size={16} className="text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-900 mb-1">Troubleshooting</h4>
                <p className="text-yellow-800 text-sm">
                  If you see connection errors, check the browser console for detailed error messages. 
                  Make sure your environment variables are correct and your Supabase project is active.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ]

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Database size={24} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Database Setup Guide</h2>
                <p className="text-gray-600">Set up Supabase for global data synchronization</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="space-y-4">
              {steps.map((step) => (
                <div key={step.id} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        currentStep > step.id 
                          ? 'bg-green-100 text-green-600' 
                          : currentStep === step.id 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'bg-gray-100 text-gray-600'
                      }`}>
                        {currentStep > step.id ? <CheckCircle size={16} /> : step.id}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{step.title}</h3>
                        <p className="text-sm text-gray-600">{step.description}</p>
                      </div>
                    </div>
                    {expandedStep === step.id ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  </button>
                  
                  <AnimatePresence>
                    {expandedStep === step.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-gray-200"
                      >
                        <div className="p-4">
                          {step.content}
                          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                            <button
                              onClick={() => setCurrentStep(Math.max(1, step.id - 1))}
                              disabled={step.id === 1}
                              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Previous
                            </button>
                            <button
                              onClick={() => {
                                if (step.id < steps.length) {
                                  setCurrentStep(step.id + 1)
                                  setExpandedStep(step.id + 1)
                                } else {
                                  onClose()
                                }
                              }}
                              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              {step.id === steps.length ? 'Complete' : 'Next Step'}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default DatabaseSetupGuide
