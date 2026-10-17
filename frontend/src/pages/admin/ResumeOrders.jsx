import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  FileCheck,
  Download,
  Mail,
  CheckCircle2,
  XCircle,
  Eye,
  ExternalLink,
  Clock,
  AlertCircle,
  Percent,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { LoadingSpinner } from '../../components/common/Loading';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function AdminResumeOrders() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-resumes'],
    queryFn: () => adminService.getResumeOrders({}),
  });

  const orders = data?.data || [];

  const filteredOrders = orders.filter((order) => {
    if (statusFilter === 'All') return true;
    if (statusFilter === 'pending_verification') return order.paymentStatus === 'pending_verification';
    if (statusFilter === 'verified') return order.paymentStatus === 'verified' || order.isPaid;
    if (statusFilter === 'rejected') return order.paymentStatus === 'rejected';
    return true;
  });

  const handleVerify = async (orderId, approved) => {
    try {
      setProcessingId(orderId);
      const res = await adminService.verifyResumePayment(orderId, {
        approved,
        adminNotes: approved ? 'Payment verified from UPI statement' : 'Invalid or unconfirmed UTR reference number',
      });

      if (res.success) {
        toast.success(
          approved
            ? '✓ Payment verified! Tailored ATS PDF generated and emailed to candidate.'
            : 'Payment marked as rejected.'
        );
        queryClient.invalidateQueries(['admin-resumes']);
      }
    } catch (err) {
      toast.error('Action failed. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">ATS Resume Orders & Payment Verification</h1>
          <p className="text-slate-500 text-sm mt-1">
            Verify candidate ₹50 UPI payments (UTR & Screenshot), auto-generate tailored ATS PDFs, and dispatch emails.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200">
          {['All', 'pending_verification', 'verified', 'rejected'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition capitalize ${
                statusFilter === status
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {status === 'pending_verification' ? 'Pending Approval' : status}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <LoadingSpinner message="Loading resume orders..." />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <FileCheck size={40} className="mx-auto mb-2 text-slate-300" />
            <p className="font-semibold text-slate-700">No resume orders found</p>
            <p className="text-xs text-slate-400 mt-1">Orders submitted with ₹50 UPI payment will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-600 font-semibold">
                  <th className="py-3.5 px-4">Candidate</th>
                  <th className="py-3.5 px-4">Target Role / JD</th>
                  <th className="py-3.5 px-4">Selection %</th>
                  <th className="py-3.5 px-4">Payment & UTR</th>
                  <th className="py-3.5 px-4">Proof</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Dispatched</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredOrders.map((r) => {
                  const isPending = r.paymentStatus === 'pending_verification';
                  const isVerified = r.paymentStatus === 'verified' || r.isPaid;
                  const isRejected = r.paymentStatus === 'rejected';

                  return (
                    <tr key={r._id} className="hover:bg-slate-50/60 transition">
                      {/* Candidate */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{r.user?.name || 'Deepak Kumar'}</div>
                        <div className="text-[11px] text-slate-400">{r.user?.email}</div>
                      </td>

                      {/* Target Role */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="font-semibold text-slate-900 truncate">
                          {r.targetJobTitle || r.targetJob?.title || 'Target Job Description'}
                        </p>
                        {r.jobDescription && (
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">{r.jobDescription}</p>
                        )}
                      </td>

                      {/* Selection Probability */}
                      <td className="py-3.5 px-4 font-bold">
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          {r.selectionProbability || r.aiAnalysis?.matchScore || 78}%
                        </span>
                      </td>

                      {/* Payment & UTR */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">₹{r.paymentAmount || 50}</div>
                        {r.utrNumber ? (
                          <div className="font-mono text-[11px] text-blue-600 font-semibold mt-0.5">
                            UTR: {r.utrNumber}
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400">No UTR</span>
                        )}
                      </td>

                      {/* Screenshot Proof */}
                      <td className="py-3.5 px-4">
                        {r.paymentScreenshot ? (
                          <button
                            type="button"
                            onClick={() => setSelectedScreenshot(`http://localhost:5000${r.paymentScreenshot}`)}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline"
                          >
                            <Eye size={12} /> View Slip
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[10px]">None</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {isPending && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            <Clock size={11} className="animate-spin" /> Pending Approval
                          </span>
                        )}
                        {isVerified && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 size={11} /> Verified
                          </span>
                        )}
                        {isRejected && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <XCircle size={11} /> Rejected
                          </span>
                        )}
                      </td>

                      {/* Email Delivered */}
                      <td className="py-3.5 px-4">
                        {r.isEmailDelivered ? (
                          <span className="text-emerald-600 font-bold flex items-center gap-1">
                            <Mail size={12} /> Emailed
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Pending</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isPending && (
                            <>
                              <button
                                type="button"
                                disabled={processingId === r._id}
                                onClick={() => handleVerify(r._id, true)}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs flex items-center gap-1"
                              >
                                <CheckCircle2 size={12} />
                                {processingId === r._id ? 'Generating...' : 'Approve & Send PDF'}
                              </button>
                              <button
                                type="button"
                                disabled={processingId === r._id}
                                onClick={() => handleVerify(r._id, false)}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-lg text-xs font-bold transition"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {isVerified && r.generatedPdfUrl && (
                            <a
                              href={`http://localhost:5000${r.generatedPdfUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs font-bold transition flex items-center gap-1"
                            >
                              <Download size={12} /> Download PDF
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Screenshot Preview Modal */}
      {selectedScreenshot && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-slate-900 text-sm">Payment Screenshot Proof</h3>
              <button
                type="button"
                onClick={() => setSelectedScreenshot(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>
            <img src={selectedScreenshot} alt="Payment Receipt" className="w-full max-h-96 object-contain rounded-lg border" />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedScreenshot(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200"
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
