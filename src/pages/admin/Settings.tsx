import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEditMode } from '../../context/EditModeContext';
import { supabase } from '../../lib/supabase';
import { Key, CheckCircle, AlertCircle, Edit3, User, Mail, Shield } from 'lucide-react';
import LogoAndPagesEditor from '../../components/admin/LogoAndPagesEditor';

export default function AdminSettings() {
  const { user } = useAuth();
  const { isEditMode, toggleEditMode } = useEditMode();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account preferences and security settings</p>
      </div>

      {/* Global Message */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg border flex items-center gap-3 ${
            message.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      {/* Logo and Pages Editor */}
      <div className="mb-8">
        <LogoAndPagesEditor />
      </div>

      {/* Grid Layout for Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Account Information Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Account Information</h2>
              <p className="text-sm text-gray-500">Your account details</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-500 block mb-1">Email Address</span>
                <p className="font-semibold text-gray-900">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Shield className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-500 block mb-1">Account Role</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">Administrator</span>
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                    Full Access
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-500 block mb-1">Account Status</span>
                <p className="font-semibold text-green-600">Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Frontend Edit Mode Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Edit3 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Frontend Edit Mode</h2>
              <p className="text-sm text-gray-500">Edit content directly on your site</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-gray-900 mb-2">Enable Edit Mode</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  When enabled, edit buttons will appear on images and content throughout the site, allowing you to make changes directly while browsing.
                </p>
              </div>
              <button
                onClick={toggleEditMode}
                className={`relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                  isEditMode ? 'bg-purple-600' : 'bg-gray-300'
                }`}
                role="switch"
                aria-checked={isEditMode ? 'true' : 'false'}
                aria-label="Toggle edit mode"
                title={isEditMode ? 'Disable edit mode' : 'Enable edit mode'}
              >
                <span
                  className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isEditMode ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {isEditMode && (
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-purple-900 mb-1">Edit Mode Active</p>
                    <p className="text-sm text-purple-700 leading-relaxed">
                      Navigate to any page on the site and you'll see edit buttons on images and content. Click them to make changes directly.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!isEditMode && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-600 leading-relaxed">
                  <strong className="text-gray-900">Tip:</strong> Enable edit mode to quickly update images, text, and other content without navigating through the admin panel.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Change Password Card - Full Width */}
        <div className="sm:col-span-2 lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-100 rounded-lg">
              <Key className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>
              <p className="text-sm text-gray-500">Update your password to keep your account secure</p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="Enter new password"
                />
                <p className="mt-1 text-xs text-gray-500">Minimum 6 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="Confirm new password"
                />
                <p className="mt-1 text-xs text-gray-500">Must match new password</p>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4" />
                    Update Password
                  </>
                )}
              </button>

              {(newPassword || confirmPassword) && (
                <button
                  type="button"
                  onClick={() => {
                    setNewPassword('');
                    setConfirmPassword('');
                    setMessage(null);
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-yellow-900 mb-1">Security Reminder</p>
                  <p className="text-sm text-yellow-700 leading-relaxed">
                    Choose a strong password that you don't use elsewhere. After changing your password, you'll need to log in again with your new credentials.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
