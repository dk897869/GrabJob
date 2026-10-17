import React from 'react';
import { Bot, User } from 'lucide-react';

export default function ChatMessage({ message }) {
  const isBot = message.role === 'assistant';

  return (
    <div
      style={{
        display: 'flex',
        gap: '10px',
        alignItems: 'flex-start',
        marginBottom: '14px',
        flexDirection: isBot ? 'row' : 'row-reverse',
      }}
    >
      <div
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: isBot ? 'var(--primary)' : '#0f172a',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {isBot ? <Bot size={16} /> : <User size={16} />}
      </div>

      <div
        style={{
          maxWidth: '80%',
          padding: '10px 14px',
          borderRadius: isBot ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
          background: isBot ? '#f1f5f9' : 'var(--primary)',
          color: isBot ? '#0f172a' : '#ffffff',
          fontSize: '0.88rem',
          lineHeight: '1.5',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {message.content}
        <div
          style={{
            fontSize: '0.7rem',
            opacity: 0.7,
            marginTop: '4px',
            textAlign: isBot ? 'left' : 'right',
          }}
        >
          {message.timestamp || 'Just now'}
        </div>
      </div>
    </div>
  );
}
