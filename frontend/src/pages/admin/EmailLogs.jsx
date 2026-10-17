import React, { useState, useEffect } from 'react';
import { Mail, Search, AlertCircle, CheckCircle, RefreshCw, Calendar, Eye } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { formatDate } from '../../utils/formatters';
import Loading from '../../components/common/Loading';
import toast from 'react-hot-toast';

export default function EmailLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await adminService.getEmailLogs();
      setLogs(data?.logs || data || []);
    } catch (err) {
      toast.error('Failed to load email logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log =>
    (log.to && log.to.toLowerCase().includes(search.toLowerCase())) ||
    (log.subject && log.subject.toLowerCase().includes(search.toLowerCase())) ||
    (log.template && log.template.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Email Logs & Notifications</h1>
          <p className="text-gray-500 text-sm mt-1">Audit trail of all transactional emails sent by the GrabJob platform</p>
        </div>
        <button
          onClick={fetchLogs}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition shadow-sm w-fit"
        >
          <RefreshCw className="w-4 h-4" /> Refresh Logs
        </button>
      </div>

      <div className="flex items-center bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm max-w-md">
        <Search className="w-5 h-5 text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search by recipient, subject, template..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent border-none text-sm focus:outline-none text-gray-900"
        />
      </div>

      {loading ? (
        <Loading message="Loading email audit logs..." />
      ) : filteredLogs.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm">
          <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-800">No Email Logs Found</h3>
          <p className="text-gray-500 text-sm mt-1">Transactional emails dispatched by the server will appear here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/75 text-gray-600 font-medium">
                  <th className="py-3.5 px-4">Recipient</th>
                  <th className="py-3.5 px-4">Subject</th>
                  <th className="py-3.5 px-4">Template</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Sent At</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50/60 transition">
                    <td className="py-3.5 px-4 font-medium text-gray-900">{log.to}</td>
                    <td className="py-3.5 px-4 text-gray-700 max-w-xs truncate">{log.subject}</td>
                    <td className="py-3.5 px-4 text-gray-600">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-xs font-mono">
                        {log.template || 'generic'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {log.status === 'sent' || log.status === 'simulated' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-xs font-medium border border-emerald-200">
                          <CheckCircle className="w-3 h-3" /> {log.status}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-2 py-0.5 rounded-full text-xs font-medium border border-red-200">
                          <AlertCircle className="w-3 h-3" /> {log.status || 'failed'}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap">
                      {formatDate(log.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 transition"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-gray-900">Email Details</h3>
              <button onClick={() => setSelectedLog(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="space-y-2 text-sm text-gray-700">
              <p><span className="font-semibold text-gray-900">To:</span> {selectedLog.to}</p>
              <p><span className="font-semibold text-gray-900">Subject:</span> {selectedLog.subject}</p>
              <p><span className="font-semibold text-gray-900">Template:</span> {selectedLog.template}</p>
              <p><span className="font-semibold text-gray-900">Status:</span> {selectedLog.status}</p>
              <p><span className="font-semibold text-gray-900">Timestamp:</span> {new Date(selectedLog.createdAt).toLocaleString()}</p>
              {selectedLog.error && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-mono">
                  {selectedLog.error}
                </div>
              )}
            </div>
            <div className="flex justify-end pt-3">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
