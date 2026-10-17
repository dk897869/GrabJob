import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GOOGLE_CLIENT_ID } from './utils/constants';

// Layouts
import MainLayout from './layouts/MainLayout';
import CandidateLayout from './layouts/CandidateLayout';
import AdminLayout from './layouts/AdminLayout';

// Route Protectors
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

// Auth & Store
import { useAuthStore } from './store/authStore';

// Public Pages
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import WalkinJobs from './pages/WalkinJobs';
import MapJobs from './pages/MapJobs';
import FreelanceJobs from './pages/FreelanceJobs';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Pricing from './pages/Pricing';
import NotFound from './pages/NotFound';

// Candidate Pages
import Dashboard from './pages/candidate/Dashboard';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import MyApplications from './pages/MyApplications';
import SavedJobs from './pages/SavedJobs';
import Notifications from './pages/Notifications';
import InterviewAssistance from './pages/InterviewAssistance';
import ResumeBuilder from './pages/ResumeBuilder';
import PaymentResult from './pages/PaymentResult';
import Settings from './pages/Settings';
import ChangePassword from './pages/ChangePassword';
import Network from './pages/Network';
import Messages from './pages/Messages';
import UserProfile from './pages/UserProfile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/Users';
import AdminJobs from './pages/admin/Jobs';
import JobCreateEdit from './pages/admin/JobCreateEdit';
import AdminWalkins from './pages/admin/Walkins';
import AdminFreelance from './pages/admin/Freelance';
import AdminPayments from './pages/admin/Payments';
import AdminInterviews from './pages/admin/Interviews';
import ResumeOrders from './pages/admin/ResumeOrders';
import JobSources from './pages/admin/JobSources';
import EmailLogs from './pages/admin/EmailLogs';
import AuditLogs from './pages/admin/AuditLogs';
import AdminSettings from './pages/admin/AdminSettings';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

export default function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#1e293b',
                color: '#ffffff',
                fontSize: '0.88rem',
                borderRadius: '10px',
              },
            }}
          />

          <Routes>
            {/* Public Layout */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:id" element={<JobDetails />} />
              <Route path="/walkin-jobs" element={<WalkinJobs />} />
              <Route path="/map" element={<MapJobs />} />
              <Route path="/freelance" element={<FreelanceJobs />} />
              <Route path="/resume-builder" element={<ResumeBuilder />} />
              <Route path="/profile/:id" element={<UserProfile />} />
              <Route
                path="/network"
                element={
                  <ProtectedRoute>
                    <Network />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/messages"
                element={
                  <ProtectedRoute>
                    <Messages />
                  </ProtectedRoute>
                }
              />
              
              {/* Auth Pages */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />

              {/* Informational & Marketing Pages */}
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/pricing" element={<Pricing />} />

              {/* Candidate Dashboard Nested under MainLayout */}
              <Route
                element={
                  <ProtectedRoute>
                    <CandidateLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/edit" element={<EditProfile />} />
                <Route path="/applications" element={<MyApplications />} />
                <Route path="/saved-jobs" element={<SavedJobs />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/interview-assistance" element={<InterviewAssistance />} />
                <Route path="/interview-assistance/:jobId" element={<InterviewAssistance />} />
                <Route path="/resume-builder" element={<ResumeBuilder />} />
                <Route path="/payment/:id" element={<PaymentResult />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/change-password" element={<ChangePassword />} />
              </Route>
            </Route>

            {/* Admin Console Nested Layout (Dedicated fullscreen theme) */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="jobs" element={<AdminJobs />} />
              <Route path="jobs/create" element={<JobCreateEdit />} />
              <Route path="jobs/:id/edit" element={<JobCreateEdit />} />
              <Route path="walkins" element={<AdminWalkins />} />
              <Route path="freelance" element={<AdminFreelance />} />
              <Route path="payments" element={<AdminPayments />} />
              <Route path="interviews" element={<AdminInterviews />} />
              <Route path="resumes" element={<ResumeOrders />} />
              <Route path="job-sources" element={<JobSources />} />
              <Route path="email-logs" element={<EmailLogs />} />
              <Route path="audit-logs" element={<AuditLogs />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}
