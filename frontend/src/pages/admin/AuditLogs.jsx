import React, { useState, useEffect } from 'react';
import { ShieldCheck, Search, RefreshCw, User, Calendar, FileText } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { formatDate } from '../../utils/formatters';
import Loading from '../../components/common/Loading';
import toast from 'react-hot-toast';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAuditLogs();
      setLogs(data?.logs || data || []);
    } catch (err) {
      toast.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log =>
    (log.action && log.action.toLowerCase().includes(search.toLowerCase())) ||
    (log.target && log.target.toLowerCase().includes(search.toLowerCase())) ||
    (log.admin?.name && log.admin.name.toLowerCase().includes(search.toLowerCase())) ||
    (log.admin?.email && log.admin.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Security & Compliance Audit Logs</h1>
          <p className="text-gray-500 text-sm mt-1">Immutable track record of administrative actions and security events</p>
        </div>
        <button
          onClick={fetchLogs}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition shadow-sm w-fit"
        >
          <RefreshCw className="w-4 h-4" /> Refresh Audit Trail
        </button>
      </div>

      <div className="flex items-center bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm max-w-md">
        <Search className="w-5 h-5 text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Filter by action, admin, resource..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent border-none text-sm focus:outline-none text-gray-900"
        />
      </div>

      {loading ? (
        <Loading message="Fetching compliance audit trail..." />
      ) : filteredLogs.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm">
          <ShieldCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-800">No Audit Events Logged</h3>
          <p className="text-gray-500 text-sm mt-1">Administrative actions such as job approvals, status updates, and user modifications will be tracked here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/75 text-gray-600 font-medium">
                  <th className="py-3.5 px-4">Admin / Operator</th>
                  <th className="py-3.5 px-4">Action</th>
                  <th className="py-3.5 px-4">Target Resource</th>
                  <th className="py-3.5 px-4">IP Address</th>
                  <th className="py-3.5 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50/60 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                          {log.admin?.name ? log.admin.name.charAt(0).toUpperCase() : 'A'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-xs">{log.admin?.name || 'System / Admin'}</p>
                          <p className="text-gray-400 text-xs">{log.admin?.email || 'admin@grabjob.in'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-700 text-xs font-mono">
                      {log.target || log.targetId || 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 text-xs font-mono">
                      {log.ipAddress || '127.0.0.1'}
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap text-xs">
                      {formatDate(log.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
