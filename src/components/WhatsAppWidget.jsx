'use client'

import React, { useState } from 'react';
import { X, Send } from 'lucide-react';

export default function WhatsAppWidget({ settings }) {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  // Extract settings or use defaults
  const waNumber = settings?.whatsappNumber || '+919876543210';
  const waWelcome = settings?.whatsappWelcome || 'Hello! Welcome to C&S Perfumes. How can we assist you today?';
  const waQuestions = settings?.whatsappQuestions && settings.whatsappQuestions.filter(Boolean).length > 0
    ? settings.whatsappQuestions.filter(Boolean)
    : [
        'Help me find the right fragrance for me!',
        'Is cash on delivery (COD) available?',
        'How can I track my perfume order?',
        'Are your perfumes long-lasting?'
      ];

  const cleanNumber = waNumber.replace(/[^0-9+]/g, ''); // strip spaces, hyphens, etc.

  const handleQuestionClick = (questionText) => {
    const encoded = encodeURIComponent(questionText);
    window.open(`https://wa.me/${cleanNumber}?text=${encoded}`, '_blank');
    setIsOpen(false);
  };

  const handleSendCustomMsg = (e) => {
    e.preventDefault();
    if (!customMsg.trim()) return;
    const encoded = encodeURIComponent(customMsg.trim());
    window.open(`https://wa.me/${cleanNumber}?text=${encoded}`, '_blank');
    setCustomMsg('');
    setIsOpen(false);
  };

  return (
    <div className="whatsapp-widget">
      {/* Floating Chat Box */}
      {isOpen && (
        <div className="whatsapp-popup">
          {/* Header */}
          <div className="whatsapp-popup-header">
            <div className="whatsapp-header-info">
              <div className="whatsapp-avatar">
                <span>IL</span>
                <span className="whatsapp-status-dot"></span>
              </div>
              <div>
                <h4 className="whatsapp-title">C&S Perfumes Support</h4>
                <p className="whatsapp-subtitle">Online • Typically replies in mins</p>
              </div>
            </div>
            <button className="whatsapp-close-btn" onClick={() => setIsOpen(false)} aria-label="Close Chat">
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="whatsapp-popup-body">
            <div className="whatsapp-chat-bubble">
              <p className="whatsapp-popup-text">{waWelcome}</p>
              <span className="whatsapp-chat-time">Just now</span>
            </div>

            <div className="whatsapp-quick-questions">
              <p className="whatsapp-quick-label">Or choose a quick question:</p>
              <div className="whatsapp-questions-list">
                {waQuestions.map((qText, idx) => (
                  <button 
                    key={idx} 
                    className="whatsapp-question-pill"
                    onClick={() => handleQuestionClick(qText)}
                  >
                    {qText}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer / Input */}
          <form className="whatsapp-popup-footer" onSubmit={handleSendCustomMsg}>
            <input 
              type="text" 
              placeholder="Type your message..."
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              className="whatsapp-popup-input"
            />
            <button type="submit" className="whatsapp-popup-send" aria-label="Send WhatsApp Message">
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button 
        className={`whatsapp-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Chat on WhatsApp"
      >
        <span className="whatsapp-icon-wrapper">
          {isOpen ? (
            <X size={24} />
          ) : (
            <svg 
              viewBox="0 0 16 16" 
              width="28" 
              height="28" 
              fill="currentColor"
              className="whatsapp-svg-icon"
            >
              <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
            </svg>
          )}
        </span>
      </button>
    </div>
  );
}
