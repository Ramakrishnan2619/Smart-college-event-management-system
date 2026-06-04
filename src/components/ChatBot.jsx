import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, HelpCircle } from 'lucide-react';

const FAQ_RESPONSES = {
  'refund': 'For refund requests, please contact the event organizer directly through the event details page. Refunds are typically processed within 3-5 business days. If you paid via UPI, the amount will be credited back to your original payment method.',
  'register': 'To register for an event: 1) Browse events from the Events page, 2) Click "Add to Cart" on events you like, 3) Go to Cart and click "Proceed to Checkout", 4) Complete payment and you\'re registered!',
  'cancel': 'To cancel a registration, go to your Dashboard → My Registrations → Click on the event → Select "Cancel Registration". Note: Cancellation is available up to 24 hours before the event.',
  'payment': 'We accept UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, and Net Banking. All payments are processed securely. For free events, no payment is required.',
  'certificate': 'Certificates are provided for workshops and competitions. After the event ends, certificates will be available for download in your Dashboard within 48 hours.',
  'contact': 'You can reach the SCEMS support team at scems.support@campus.edu or visit the Student Affairs Office (Block A, Room 101) during office hours (9 AM - 5 PM).',
  'seats': 'Seat availability is shown in real-time on each event page. Once all seats are filled, the event will show "Sold Out". You can join the waitlist for popular events.',
  'help': 'I can help you with: Registration, Payments, Refunds, Cancellation, Certificates, Seat Availability, and Contact Information. Just type your query!',
};

const QUICK_REPLIES = [
  { label: '📋 How to register?', key: 'register' },
  { label: '💳 Payment methods?', key: 'payment' },
  { label: '🔄 Refund policy?', key: 'refund' },
  { label: '❌ Cancel registration?', key: 'cancel' },
  { label: '📜 Certificates?', key: 'certificate' },
  { label: '📞 Contact support', key: 'contact' },
];

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hi there! 👋 I\'m the SCEMS Support Bot. How can I help you today?',
      time: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const findResponse = (query) => {
    const q = query.toLowerCase();
    for (const [key, response] of Object.entries(FAQ_RESPONSES)) {
      if (q.includes(key)) return response;
    }
    // Fuzzy matching
    if (q.includes('how') && (q.includes('sign') || q.includes('join'))) return FAQ_RESPONSES['register'];
    if (q.includes('money') || q.includes('pay') || q.includes('fee')) return FAQ_RESPONSES['payment'];
    if (q.includes('return') || q.includes('refund') || q.includes('money back')) return FAQ_RESPONSES['refund'];
    if (q.includes('cancel') || q.includes('remove')) return FAQ_RESPONSES['cancel'];
    if (q.includes('cert') || q.includes('proof')) return FAQ_RESPONSES['certificate'];
    if (q.includes('seat') || q.includes('full') || q.includes('available')) return FAQ_RESPONSES['seats'];
    if (q.includes('call') || q.includes('email') || q.includes('phone') || q.includes('reach')) return FAQ_RESPONSES['contact'];

    return 'I\'m not sure I understand that query. You can ask me about registration, payments, refunds, cancellation, certificates, or contact information. Type "help" for all options!';
  };

  const addBotReply = (text) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), type: 'bot', text, time: new Date() },
      ]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), type: 'user', text: input.trim(), time: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    const response = findResponse(input.trim());
    setInput('');
    addBotReply(response);
  };

  const handleQuickReply = (key) => {
    const label = QUICK_REPLIES.find((q) => q.key === key)?.label || key;
    const userMsg = { id: Date.now(), type: 'user', text: label, time: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    addBotReply(FAQ_RESPONSES[key]);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => {
              setIsOpen(true);
              setTimeout(() => inputRef.current?.focus(), 300);
            }}
            className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-xl cursor-pointer border-none"
            style={{
              background: 'linear-gradient(135deg, var(--accent), #8B5CF6)',
              color: '#fff',
            }}
            aria-label="Open support chat"
          >
            <MessageCircle size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-6 z-50 w-[360px] max-w-[calc(100vw-48px)] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{
              height: '520px',
              maxHeight: 'calc(100vh - 120px)',
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, var(--accent), #8B5CF6)',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">SCEMS Support</h4>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-white/70 text-[10px]">Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white cursor-pointer border-none hover:bg-white/20 transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm"
                    style={{
                      backgroundColor: msg.type === 'user' ? 'var(--accent)' : 'var(--bg-surface)',
                      color: msg.type === 'user' ? '#fff' : 'var(--text-primary)',
                      borderBottomRightRadius: msg.type === 'user' ? '4px' : '16px',
                      borderBottomLeftRadius: msg.type === 'bot' ? '4px' : '16px',
                    }}
                  >
                    <p className="leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                    <p
                      className="text-[9px] mt-1"
                      style={{ color: msg.type === 'user' ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)' }}
                    >
                      {formatTime(msg.time)}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div
                    className="rounded-2xl px-4 py-3 text-sm flex items-center gap-1"
                    style={{ backgroundColor: 'var(--bg-surface)' }}
                  >
                    <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--text-muted)', animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--text-muted)', animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--text-muted)', animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {QUICK_REPLIES.map((qr) => (
                  <button
                    key={qr.key}
                    onClick={() => handleQuickReply(qr.key)}
                    className="text-[11px] px-3 py-1.5 rounded-full cursor-pointer border-none transition-all hover:scale-105"
                    style={{
                      backgroundColor: 'rgba(99, 102, 241, 0.1)',
                      color: 'var(--accent)',
                    }}
                  >
                    {qr.label}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div
              className="flex items-center gap-2 px-4 py-3 flex-shrink-0"
              style={{ borderTop: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)' }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your question..."
                className="flex-1 px-3 py-2 rounded-xl text-sm border-none outline-none"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer border-none transition-all hover:scale-105"
                style={{
                  backgroundColor: input.trim() ? 'var(--accent)' : 'var(--bg-card)',
                  color: input.trim() ? '#fff' : 'var(--text-muted)',
                }}
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
