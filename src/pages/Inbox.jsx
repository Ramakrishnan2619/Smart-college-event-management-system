import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Menu, Search, Settings, HelpCircle, LayoutGrid,
  Inbox as InboxIcon, Star, Clock, Send, File, AlertCircle,
  Archive, Trash2, ArrowLeft, Download, Hash, CreditCard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES } from '../data/mockData';

const Inbox = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [receipt, setReceipt] = useState(null);
  const [selectedEmail, setSelectedEmail] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Check for receipt in sessionStorage (saved after payment)
    const data = sessionStorage.getItem('scems_receipt');
    if (data) {
      setReceipt(JSON.parse(data));
      // Show notification briefly to simulate email arriving
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 4000);
    }
  }, []);

  const getCategoryEmoji = (categoryId) => {
    const cat = CATEGORIES.find((c) => c.id === categoryId);
    return cat ? cat.emoji : '📌';
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatTimestamp = (ts) => {
    return new Date(ts).toLocaleString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const getSidebarItems = () => [
    { icon: <InboxIcon size={20} />, label: 'Inbox', count: receipt ? 1 : 0, active: true },
    { icon: <Star size={20} />, label: 'Starred' },
    { icon: <Clock size={20} />, label: 'Snoozed' },
    { icon: <Send size={20} />, label: 'Sent' },
    { icon: <File size={20} />, label: 'Drafts' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Gmail Header */}
      <header className="h-16 flex items-center px-4 bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center gap-4 w-64">
          <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-2 text-xl font-medium text-gray-700">
            <div className="w-8 h-8 rounded bg-red-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            MockMail
          </div>
        </div>

        <div className="flex-1 max-w-2xl px-4">
          <div className="bg-gray-100 rounded-full flex items-center px-4 py-2 border border-transparent focus-within:bg-white focus-within:border-gray-300 focus-within:shadow-sm transition-all">
            <Search className="text-gray-500 mr-3" size={20} />
            <input
              type="text"
              placeholder="Search mail"
              className="bg-transparent border-none outline-none w-full text-gray-700"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto text-gray-600">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden sm:block"><HelpCircle size={22} /></button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden sm:block"><Settings size={22} /></button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden sm:block"><LayoutGrid size={22} /></button>
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold ml-2">
            {user?.name?.charAt(0) || 'U'}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white hidden lg:flex flex-col py-4">
          <div className="px-3 mb-4">
            <button className="bg-white border border-gray-300 rounded-2xl py-3 px-6 font-medium text-gray-700 flex items-center gap-3 shadow-sm hover:shadow transition-shadow">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              </div>
              Compose
            </button>
          </div>
          <nav className="flex-1 pr-3">
            {getSidebarItems().map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between px-6 py-2 rounded-r-full cursor-pointer mb-1 ${
                  item.active ? 'bg-red-50 text-red-600 font-bold' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={item.active ? 'text-red-600' : 'text-gray-500'}>{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
                </div>
                {item.count > 0 && <span className="text-xs">{item.count}</span>}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-white flex flex-col overflow-hidden relative rounded-tl-2xl border-t border-l border-gray-200">
          
          {/* Email Arriving Notification */}
          <AnimatePresence>
            {showNotification && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.9 }}
                className="absolute bottom-6 left-6 z-20 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">M</div>
                <div>
                  <p className="text-sm font-medium">New message from SCEMS</p>
                  <p className="text-xs text-gray-300">Registration Receipt Confirmed</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!selectedEmail ? (
            <div className="flex-1 overflow-y-auto">
              {/* Email List View */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 text-gray-500">
                <div className="flex items-center gap-4">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                  <ArrowLeft size={18} className="cursor-pointer" />
                </div>
                <div className="text-xs">1-1 of 1</div>
              </div>

              {receipt ? (
                <div 
                  onClick={() => setSelectedEmail(true)}
                  className="flex items-center px-4 py-3 border-b border-gray-200 hover:shadow-md cursor-pointer bg-white group transition-all"
                >
                  <div className="flex items-center gap-4 w-48 shrink-0">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 opacity-50 group-hover:opacity-100" />
                    <Star size={20} className="text-gray-300 hover:text-yellow-400" />
                    <span className="font-bold text-gray-900 text-sm">SCEMS Platform</span>
                  </div>
                  <div className="flex-1 truncate pr-4">
                    <span className="font-bold text-gray-800 text-sm mr-2">Registration Confirmed: Receipt for your events</span>
                    <span className="text-gray-500 text-sm truncate">- Thank you for registering for {receipt.events.length} event(s)...</span>
                  </div>
                  <div className="text-xs font-bold text-gray-900 w-16 text-right shrink-0">
                    {new Date(receipt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 pt-20">
                  <InboxIcon size={48} className="mb-4 text-gray-300" />
                  <p>Your inbox is empty</p>
                  <p className="text-sm mt-2">Complete a checkout to see a receipt email here.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto bg-white flex flex-col">
              {/* Email Detail View */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 text-gray-600 sticky top-0 bg-white">
                <div className="flex items-center gap-6">
                  <button onClick={() => setSelectedEmail(false)} className="hover:bg-gray-100 p-2 rounded-full cursor-pointer">
                    <ArrowLeft size={20} />
                  </button>
                  <button className="hover:bg-gray-100 p-2 rounded-full"><Archive size={18} /></button>
                  <button className="hover:bg-gray-100 p-2 rounded-full"><AlertCircle size={18} /></button>
                  <button onClick={() => { sessionStorage.removeItem('scems_receipt'); setReceipt(null); setSelectedEmail(false); }} className="hover:bg-gray-100 p-2 rounded-full cursor-pointer"><Trash2 size={18} /></button>
                </div>
              </div>

              <div className="p-8 max-w-4xl mx-auto w-full">
                <h1 className="text-2xl font-normal text-gray-800 mb-6 flex items-center justify-between">
                  Registration Confirmed: Receipt for your events
                  <div className="flex gap-2">
                    <span className="px-2 py-0.5 bg-gray-100 text-xs rounded text-gray-600 border border-gray-200">Inbox</span>
                  </div>
                </h1>

                <div className="flex gap-4 mb-8">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    S
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline">
                      <div>
                        <span className="font-bold text-gray-800 text-sm">SCEMS Platform</span>
                        <span className="text-gray-500 text-xs ml-2">&lt;noreply@campus.edu&gt;</span>
                      </div>
                      <div className="flex items-center gap-4 text-gray-500 text-xs">
                        {formatTimestamp(receipt.timestamp)}
                        <Star size={18} className="cursor-pointer hover:text-yellow-400" />
                      </div>
                    </div>
                    <div className="text-gray-500 text-xs mt-1">
                      to me <span className="ml-1 cursor-pointer hover:underline border border-gray-200 px-1 rounded">▼</span>
                    </div>
                  </div>
                </div>

                {/* Email Body HTML formatting */}
                <div className="text-gray-800 text-sm leading-relaxed border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  {/* Email content header */}
                  <div className="bg-indigo-600 text-white p-6 text-center">
                    <h2 className="text-2xl font-bold mb-2">SCEMS</h2>
                    <p className="opacity-90">Your registration is confirmed!</p>
                  </div>
                  
                  {/* Email body */}
                  <div className="p-8 bg-white">
                    <p className="mb-6 text-base">Hi {receipt.user?.name || 'Student'},</p>
                    <p className="mb-8">Thank you for registering. We've received your payment and your seats are confirmed. Below are the details of your transaction.</p>
                    
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-8">
                      <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                        <div>
                          <p className="text-gray-500 text-xs mb-1">Transaction ID</p>
                          <p className="font-mono font-medium">{receipt.transactionId}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-1">Payment Method</p>
                          <p className="font-medium capitalize">{receipt.paymentMethod}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-1">Date</p>
                          <p className="font-medium">{formatDate(receipt.timestamp)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-1">Total Amount</p>
                          <p className="font-bold text-indigo-600 text-base">{receipt.totalAmount > 0 ? `₹${receipt.totalAmount}` : 'FREE'}</p>
                        </div>
                      </div>
                    </div>

                    <h3 className="font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">Registered Events ({receipt.events.length})</h3>
                    <div className="space-y-4 mb-8">
                      {receipt.events.map((evt, idx) => (
                        <div key={idx} className="flex gap-4 p-4 border border-gray-100 rounded-lg bg-gray-50">
                          <div className="text-2xl pt-1">{getCategoryEmoji(evt.categoryId)}</div>
                          <div>
                            <p className="font-bold text-gray-800">{evt.title}</p>
                            <p className="text-gray-500 text-xs mt-1 flex items-center gap-3">
                              <span>📅 {formatDate(evt.date)}</span>
                              <span>⏰ {evt.time}</span>
                              <span>📍 {evt.venue}</span>
                            </p>
                          </div>
                          <div className="ml-auto font-bold text-gray-700">
                            {evt.fee ? `₹${evt.fee}` : 'Free'}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="text-center pt-6 border-t border-gray-200">
                      <p className="text-gray-500 text-xs mb-4">You can download your ticket from your dashboard.</p>
                      <button onClick={() => navigate('/dashboard')} className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-md hover:bg-indigo-700 transition-colors">
                        View Dashboard
                      </button>
                    </div>
                  </div>
                  
                  {/* Email Footer */}
                  <div className="bg-gray-100 p-6 text-center text-xs text-gray-500">
                    <p>Smart Campus Event Management System</p>
                    <p className="mt-1">© 2026 Campus Inc. All rights reserved.</p>
                    <p className="mt-4 opacity-50">Please do not reply to this automated email.</p>
                  </div>
                </div>

                {/* Reply section */}
                <div className="mt-6 flex gap-3">
                  <button className="border border-gray-300 text-gray-600 px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
                    <ArrowLeft size={16} /> Reply
                  </button>
                  <button className="border border-gray-300 text-gray-600 px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
                    <ArrowLeft size={16} className="rotate-180" /> Forward
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Inbox;
