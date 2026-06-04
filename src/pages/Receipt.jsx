import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  CheckCircle2, Download, Mail, Calendar, MapPin,
  Clock, Hash, CreditCard, User, FileText,
} from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import toast from 'react-hot-toast';

const Receipt = () => {
  const [receipt, setReceipt] = useState(() => {
    const data = sessionStorage.getItem('scems_receipt');
    return data ? JSON.parse(data) : null;
  });
  const [emailSent, setEmailSent] = useState(false);

  const getCategoryEmoji = (categoryId) => {
    const cat = CATEGORIES.find((c) => c.id === categoryId);
    return cat ? cat.emoji : '📌';
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatTimestamp = (ts) => {
    const d = new Date(ts);
    return d.toLocaleString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const handleSendEmail = () => {
    // Simulated email sending
    setEmailSent(true);
    toast.success('Mock receipt successfully sent to your email! 📧', { duration: 4000 });
    setTimeout(() => setEmailSent(false), 3000);
  };

  const handleDownload = () => {
    // Generate a text-based receipt for download
    if (!receipt) return;
    let text = '═══════════════════════════════════════\n';
    text += '        SCEMS - REGISTRATION RECEIPT\n';
    text += '═══════════════════════════════════════\n\n';
    text += `Transaction ID: ${receipt.transactionId}\n`;
    text += `Date: ${formatTimestamp(receipt.timestamp)}\n`;
    text += `Status: ${receipt.status}\n`;
    text += `Payment Method: ${receipt.paymentMethod.toUpperCase()}\n\n`;
    text += `Student: ${receipt.user.name}\n`;
    text += `Email: ${receipt.user.email || 'N/A'}\n`;
    text += `Roll No: ${receipt.user.rollNo || 'N/A'}\n\n`;
    text += '───────────────────────────────────────\n';
    text += 'REGISTERED EVENTS:\n';
    text += '───────────────────────────────────────\n\n';
    receipt.events.forEach((evt, i) => {
      text += `${i + 1}. ${evt.title}\n`;
      text += `   Date: ${evt.date} | Time: ${evt.time}\n`;
      text += `   Venue: ${evt.venue}\n`;
      text += `   Fee: ${evt.fee ? '₹' + evt.fee : 'FREE'}\n\n`;
    });
    text += '───────────────────────────────────────\n';
    text += `TOTAL: ${receipt.totalAmount > 0 ? '₹' + receipt.totalAmount : 'FREE'}\n`;
    text += '═══════════════════════════════════════\n';
    text += '\nThank you for registering! See you at the event! 🎉\n';

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SCEMS_Receipt_${receipt.transactionId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!receipt) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <FileText size={48} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
          <h2 className="font-clash font-bold text-xl mb-2" style={{ color: 'var(--text-primary)' }}>No receipt found</h2>
          <Link to="/events" className="btn-base btn-filled text-sm no-underline mt-4">Browse Events</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-24" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Success Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <CheckCircle2
              size={72}
              className="mx-auto mb-4"
              style={{ color: 'var(--accent-em)' }}
            />
          </motion.div>
          <h1 className="font-clash font-bold text-2xl sm:text-3xl mb-2" style={{ color: 'var(--text-primary)' }}>
            Registration Successful! 🎉
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Your payment has been processed and you are registered for {receipt.events.length} event{receipt.events.length > 1 ? 's' : ''}.
          </p>
        </motion.div>

        {/* Receipt Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl overflow-hidden"
        >
          {/* Receipt Header */}
          <div
            className="px-6 py-4 flex items-center justify-between"
            style={{ backgroundColor: 'rgba(99, 102, 241, 0.08)', borderBottom: '1px solid var(--border)' }}
          >
            <div>
              <h2 className="font-clash font-bold text-lg" style={{ color: 'var(--accent)' }}>SCEMS</h2>
              <p className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                Registration Receipt
              </p>
            </div>
            <div
              className="px-3 py-1 rounded-full text-xs font-bold"
              style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-em)' }}
            >
              ✓ PAID
            </div>
          </div>

          {/* Receipt Body */}
          <div className="p-6">
            {/* Transaction Info */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <div className="flex items-center gap-1.5 text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                  <Hash size={12} /> Transaction ID
                </div>
                <div className="text-sm font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {receipt.transactionId}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                  <Calendar size={12} /> Date & Time
                </div>
                <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {formatTimestamp(receipt.timestamp)}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                  <User size={12} /> Student
                </div>
                <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {receipt.user.name}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                  <CreditCard size={12} /> Payment
                </div>
                <div className="text-sm font-semibold capitalize" style={{ color: 'var(--text-primary)' }}>
                  {receipt.paymentMethod}
                </div>
              </div>
            </div>

            {/* Registered Events */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
                Registered Events
              </h3>
              <div className="space-y-3">
                {receipt.events.map((evt, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
                  >
                    <div className="text-xl">{getCategoryEmoji(evt.categoryId)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                        {evt.title}
                      </div>
                      <div className="flex flex-wrap gap-x-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <span className="flex items-center gap-1"><Calendar size={10} /> {formatDate(evt.date)}</span>
                        <span className="flex items-center gap-1"><Clock size={10} /> {evt.time}</span>
                        <span className="flex items-center gap-1"><MapPin size={10} /> {evt.venue}</span>
                      </div>
                    </div>
                    <div className="text-sm font-bold flex-shrink-0" style={{ color: 'var(--accent-em)' }}>
                      {evt.fee ? `₹${evt.fee}` : 'Free'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div
              className="flex justify-between items-center py-3 px-4 rounded-xl"
              style={{ backgroundColor: 'rgba(99, 102, 241, 0.06)', border: '1px solid var(--border)' }}
            >
              <span className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>Total Amount</span>
              <span className="text-lg font-bold font-clash" style={{ color: 'var(--accent)' }}>
                {receipt.totalAmount > 0 ? `₹${receipt.totalAmount}` : 'FREE'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div
            className="px-6 py-4 flex flex-wrap gap-3"
            style={{ borderTop: '1px solid var(--border)', backgroundColor: 'rgba(255,255,255,0.02)' }}
          >
            <button
              onClick={handleDownload}
              className="btn-base btn-outlined text-xs flex-1"
            >
              <Download size={14} /> Download Receipt
            </button>
            <button
              onClick={handleSendEmail}
              className="btn-base btn-filled text-xs flex-1"
            >
              <Mail size={14} /> {emailSent ? 'Email Sent! ✓' : 'Send to Email'}
            </button>
          </div>
        </motion.div>

        {/* Back to Dashboard */}
        <div className="text-center mt-6 space-x-4">
          <Link to="/dashboard" className="btn-base btn-filled text-sm no-underline">
            Go to Dashboard
          </Link>
          <Link to="/events" className="btn-base btn-outlined text-sm no-underline">
            Browse More Events
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
