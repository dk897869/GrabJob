import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Trash2, Sparkles } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';
import { chatService } from '../../services/chatService';
import ChatMessage from './ChatMessage';

export default function AIChatbot() {
  const { isChatbotOpen, toggleChatbot } = useUiStore();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I am your GrabJob AI Career Assistant.\nHow can I help with your job search, interview prep, or resume today?",
      timestamp: 'Now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedPills = [
    'Find jobs for me',
    'Improve my resume',
    'Prepare for interview',
    'What skills do I need?',
    'Career advice',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (customText = null) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() || loading) return;

    const userMessage = {
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    if (!customText) setInputText('');
    setLoading(true);

    try {
      // Backend chat endpoint
      const formattedForApi = newHistory.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await chatService.sendMessage({ messages: formattedForApi });
      if (res.success && res.data?.reply) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: res.data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I encountered an issue connecting to the career service. Please try again.',
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Chat cleared. How can I assist with your career or job search?',
        timestamp: 'Now',
      },
    ]);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        className="ai-chatbot-toggle"
        onClick={toggleChatbot}
        aria-label="Open GrabJob AI Assistant"
      >
        {isChatbotOpen ? <X size={26} /> : <Bot size={28} />}
      </button>

      {/* Chat Window */}
      {isChatbotOpen && (
        <div className="ai-chatbot-window animate-fade-in">
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
              color: '#ffffff',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sparkles size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0 }}>GrabJob AI</h4>
                <span style={{ fontSize: '0.72rem', opacity: 0.85 }}>Career & Job Assistant</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={handleClear}
                title="Clear Chat"
                style={{ color: '#ffffff', opacity: 0.8, padding: '4px' }}
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={toggleChatbot}
                title="Close"
                style={{ color: '#ffffff', opacity: 0.8, padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div
            style={{
              flex: 1,
              padding: '16px',
              overflowY: 'auto',
              background: '#ffffff',
            }}
          >
            {messages.map((m, idx) => (
              <ChatMessage key={idx} message={m} />
            ))}
            {loading && (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#64748b', fontSize: '0.82rem' }}>
                <Bot size={16} color="var(--primary)" />
                <span>GrabJob AI is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Pills */}
          <div
            style={{
              display: 'flex',
              gap: '6px',
              padding: '8px 12px',
              background: '#f8fafc',
              borderTop: '1px solid #e2e8f0',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
            }}
          >
            {suggestedPills.map((pill, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(pill)}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '9999px',
                  padding: '4px 10px',
                  fontSize: '0.75rem',
                  color: '#334155',
                  fontWeight: 500,
                  flexShrink: 0,
                }}
              >
                {pill}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px 14px',
              background: '#ffffff',
              borderTop: '1px solid #e2e8f0',
              gap: '8px',
            }}
          >
            <input
              type="text"
              placeholder="Ask anything about jobs or careers..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '0.88rem',
                color: '#0f172a',
              }}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || loading}
              style={{
                background: inputText.trim() ? 'var(--primary)' : '#e2e8f0',
                color: '#ffffff',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
