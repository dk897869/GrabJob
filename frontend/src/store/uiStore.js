import { create } from 'zustand';

export const useUiStore = create((set) => ({
  isChatbotOpen: false,
  toggleChatbot: () => set((state) => ({ isChatbotOpen: !state.isChatbotOpen })),
  openChatbot: () => set({ isChatbotOpen: true }),
  closeChatbot: () => set({ isChatbotOpen: false }),

  // Payment Modal
  paymentModal: {
    isOpen: false,
    serviceType: 'interview_assistance', // or 'resume_builder'
    jobId: null,
    jobTitle: '',
    amount: 100,
    resumeId: null,
  },

  openPaymentModal: (payload) =>
    set({
      paymentModal: {
        isOpen: true,
        serviceType: payload.serviceType || 'interview_assistance',
        jobId: payload.jobId || null,
        jobTitle: payload.jobTitle || '',
        amount: payload.amount || (payload.serviceType === 'resume_builder' ? 50 : 100),
        resumeId: payload.resumeId || null,
      },
    }),

  closePaymentModal: () =>
    set((state) => ({
      paymentModal: { ...state.paymentModal, isOpen: false },
    })),

  mobileMenuOpen: false,
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),
}));
