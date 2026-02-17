import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function ConfigurationNotice() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-yellow-100 p-3 rounded-full">
            <AlertCircle className="w-8 h-8 text-yellow-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Configuration Required</h1>
            <p className="text-gray-600">EOMC E-Commerce Platform</p>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="text-sm text-yellow-800">
            <strong>Database Not Connected:</strong> This site requires Supabase configuration to function.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Setup Instructions:</h2>
          
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
              <div>
                <h3 className="font-medium text-gray-900">Create Supabase Project</h3>
                <p className="text-sm text-gray-600">Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">supabase.com</a> and create a free account and project</p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
              <div>
                <h3 className="font-medium text-gray-900">Get Your Credentials</h3>
                <p className="text-sm text-gray-600">Copy your Project URL and anon/public key from Project Settings → API</p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
              <div>
                <h3 className="font-medium text-gray-900">Add to Vercel</h3>
                <p className="text-sm text-gray-600">Go to Vercel → Settings → Environment Variables and add:</p>
                <ul className="mt-2 space-y-1 text-sm text-gray-600 font-mono bg-white p-2 rounded border">
                  <li>VITE_SUPABASE_URL</li>
                  <li>VITE_SUPABASE_ANON_KEY</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
              <div>
                <h3 className="font-medium text-gray-900">Run Database Migrations</h3>
                <p className="text-sm text-gray-600">Execute the SQL migrations from the <code className="bg-white px-1 rounded">supabase/migrations/</code> folder in your Supabase SQL Editor</p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">5</span>
              <div>
                <h3 className="font-medium text-gray-900">Redeploy</h3>
                <p className="text-sm text-gray-600">Trigger a new deployment in Vercel or push to GitHub</p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">📚 Documentation</h3>
            <p className="text-sm text-blue-800">
              For detailed setup instructions, check the <code className="bg-white px-1 rounded">DEPLOYMENT_GUIDE.md</code> and <code className="bg-white px-1 rounded">ADMIN_SETUP.md</code> files in your repository.
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              EOMC Apparel - E-Commerce Platform | Deployed on Vercel
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
