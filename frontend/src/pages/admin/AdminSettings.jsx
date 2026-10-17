import React, { useState } from 'react';
import { Settings, Shield, Bell, Database, Server, Key, Save, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: 'GrabJob India',
    supportEmail: 'support@grabjob.in',
    walkinRadiusKm: 50,
    atsPriceInr: 50,
    interviewAssistancePriceInr: 100,
    autoVerifyJobs: true,
    maintenanceMode: false,
    aiModel: 'gpt-4o-mini',
    paymentGatewayActive: true,
    enableEmailNotifications: true
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Admin platform settings updated successfully!');
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Configuration & Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage global GrabJob parameters, pricing tiers, and AI configurations</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Settings */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Settings className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-gray-900">General Platform Information</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Platform Name</label>
              <input
                type="text"
                name="siteName"
                value={settings.siteName}
                onChange={handleChange}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Support Email</label>
              <input
                type="email"
                name="supportEmail"
                value={settings.supportEmail}
                onChange={handleChange}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Default Walk-in Geosearch Radius (km)</label>
              <input
                type="number"
                name="walkinRadiusKm"
                value={settings.walkinRadiusKm}
                onChange={handleChange}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">AI Chatbot Engine</label>
              <select
                name="aiModel"
                value={settings.aiModel}
                onChange={handleChange}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="gpt-4o-mini">OpenAI GPT-4o-mini (Recommended)</option>
                <option value="gpt-3.5-turbo">OpenAI GPT-3.5 Turbo</option>
                <option value="heuristic-fallback">Local Heuristic Advisor (Offline)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Server className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-gray-900">Career Assistance Pricing Tiers (INR)</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">ATS Resume Builder Fee (₹)</label>
              <input
                type="number"
                name="atsPriceInr"
                value={settings.atsPriceInr}
                onChange={handleChange}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span className="text-xs text-gray-400">Fixed rate for professional PDF/Word ATS optimization</span>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Walk-in Interview Assistance Fee (₹)</label>
              <input
                type="number"
                name="interviewAssistancePriceInr"
                value={settings.interviewAssistancePriceInr}
                onChange={handleChange}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span className="text-xs text-gray-400">Verified scheduling, checklist, route map & recruiter desk guide</span>
            </div>
          </div>
        </div>

        {/* System Flags */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Shield className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-gray-900">Feature Toggles & Safety</h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/50 cursor-pointer hover:bg-gray-50">
              <div>
                <p className="text-sm font-semibold text-gray-800">Auto-verify Aggregated Jobs</p>
                <p className="text-xs text-gray-500">Automatically mark jobs from trusted authorized sources as verified</p>
              </div>
              <input
                type="checkbox"
                name="autoVerifyJobs"
                checked={settings.autoVerifyJobs}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/50 cursor-pointer hover:bg-gray-50">
              <div>
                <p className="text-sm font-semibold text-gray-800">Razorpay Payment Gateway Mode</p>
                <p className="text-xs text-gray-500">Enable live/simulated transaction processing</p>
              </div>
              <input
                type="checkbox"
                name="paymentGatewayActive"
                checked={settings.paymentGatewayActive}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/50 cursor-pointer hover:bg-gray-50">
              <div>
                <p className="text-sm font-semibold text-gray-800">Transactional Email Notifications</p>
                <p className="text-xs text-gray-500">Send automated confirmation emails on job applications & payments</p>
              </div>
              <input
                type="checkbox"
                name="enableEmailNotifications"
                checked={settings.enableEmailNotifications}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-amber-200 bg-amber-50/50 cursor-pointer">
              <div>
                <p className="text-sm font-semibold text-amber-900">Maintenance Mode</p>
                <p className="text-xs text-amber-700">Display a maintenance notice to public visitors while allowing admin logins</p>
              </div>
              <input
                type="checkbox"
                name="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={handleChange}
                className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold shadow-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
