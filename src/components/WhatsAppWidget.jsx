'use client'

import React, { useState } from 'react';
import { X, Send } from 'lucide-react';

export default function WhatsAppWidget({ settings }) {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  // Extract settings or use defaults
  const waNumber = settings?.whatsappNumber || '+919876543210';
  const waWelcome = settings?.whatsappWelcome || 'Hello! Welcome to Ishaya Luxury Perfumes. How can we assist you today?';
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
    <div className="whatsapp-widget-container">
      {/* Floating Chat Box */}
      {isOpen && (
        <div className="whatsapp-chat-box">
          {/* Header */}
          <div className="whatsapp-header">
            <div className="whatsapp-header-info">
              <div className="whatsapp-avatar">
                <span>IL</span>
                <span className="whatsapp-status-dot"></span>
              </div>
              <div>
                <h4 className="whatsapp-title">Ishaya Luxury Support</h4>
                <p className="whatsapp-subtitle">Online • Typically replies in mins</p>
              </div>
            </div>
            <button className="whatsapp-close-btn" onClick={() => setIsOpen(false)} aria-label="Close Chat">
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="whatsapp-body">
            <div className="whatsapp-chat-bubble">
              <p className="whatsapp-welcome-text">{waWelcome}</p>
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
          <form className="whatsapp-footer" onSubmit={handleSendCustomMsg}>
            <input 
              type="text" 
              placeholder="Type your message..."
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              className="whatsapp-input"
            />
            <button type="submit" className="whatsapp-send-btn" aria-label="Send WhatsApp Message">
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button 
        className={`whatsapp-toggle-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Chat on WhatsApp"
      >
        <span className="whatsapp-icon-wrapper">
          {isOpen ? (
            <X size={24} />
          ) : (
            <svg 
              viewBox="0 0 24 24" 
              width="26" 
              height="26" 
              fill="currentColor"
              className="whatsapp-svg-icon"
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.803-4.394 9.806-9.8.001-2.605-1.01-5.057-2.85-6.895A9.704 9.704 0 0 0 12.008 2.01c-5.41 0-9.81 4.403-9.813 9.81-.001 1.57.426 3.102 1.236 4.471l-1.01 3.693 3.78-1.02a9.718 9.718 0 0 0 3.846.883zm11.237-7.447c-.31-.155-1.838-.907-2.122-1.01-.284-.102-.49-.153-.697.156-.206.31-.8.997-.98 1.205-.18.207-.36.233-.67.078-1.748-.874-2.875-1.56-4.01-3.51-.3-.514.3-.477.859-1.59.09-.18.046-.337-.023-.492-.069-.155-.697-1.678-.955-2.3-.25-.6-.525-.515-.716-.525-.186-.01-.399-.01-.612-.01-.214 0-.56.08-.853.4-.293.32-1.12 1.096-1.12 2.67 0 1.574 1.147 3.097 1.307 3.305.16.208 2.256 3.447 5.467 4.832.763.328 1.357.525 1.822.673.766.243 1.464.209 2.016.126.615-.093 1.838-.75 2.096-1.475.258-.724.258-1.344.18-1.475-.078-.13-.284-.207-.593-.362z"/>
            </svg>
          )}
        </span>
      </button>
    </div>
  );
}
