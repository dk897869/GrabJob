import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import MobileBottomNav from '../components/common/MobileBottomNav';
import AIChatbot from '../components/chatbot/AIChatbot';
import PaymentModal from '../components/payments/PaymentModal';

export default function MainLayout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
      <AIChatbot />
      <PaymentModal />
    </div>
  );
}
