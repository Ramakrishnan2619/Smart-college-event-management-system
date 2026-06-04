import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ChevronLeft, CreditCard, Building2, Smartphone, Loader2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const MobilePayment = () => {
  const { txnId, amount } = useParams();
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const navigate = useNavigate();

  const displayAmount = amount === '0' || amount === 0 ? '499.00' : Number(amount).toFixed(2);

  const handlePay = async () => {
    setProcessing(true);
    
    // Simulate Razorpay's processing delay
    await new Promise(resolve => setTimeout(resolve, 7000));
    
    try {
      const host = window.location.hostname;
      fetch(`http://${host}:8080/api/payment/success/${txnId}`, {
        method: 'POST'
      }).catch(() => {});
    } catch (err) {
      // Ignore
    }
    
    setSuccess(true);
    setProcessing(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 font-sans">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center w-full max-w-sm"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-24 h-24 bg-green-500 rounded-full mx-auto flex items-center justify-center mb-6 shadow-lg shadow-green-200"
          >
            <CheckCircle2 size={50} className="text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful</h2>
          <p className="text-gray-500 mb-8">Transaction ID: {txnId}</p>
          
          <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500">Amount Paid</span>
              <span className="text-xl font-bold text-gray-900">₹{displayAmount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Paid To</span>
              <span className="font-semibold text-gray-900">SCEMS Platform</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 font-medium">
            <Shield size={16} className="text-green-500" />
            Secured by Razorpay
          </div>
          <p className="text-xs text-gray-400 mt-4">
            You can now look at your laptop screen.
          </p>
        </motion.div>
      </div>
    );
  }

  if (processing) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 font-sans">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-[#3385ff] mx-auto mb-6" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Processing Payment</h2>
          <p className="text-sm text-gray-500">Please do not press back or close this screen.</p>
          <div className="mt-12 flex items-center justify-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-widest">
            <Shield size={14} /> Secured by Razorpay
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      {/* Razorpay-style Header */}
      <div className="bg-[#02042b] text-white px-4 py-4 flex items-center gap-3 shadow-md">
        <button onClick={() => navigate('/')} className="p-1 cursor-pointer hover:bg-white/10 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1">
          <h1 className="font-medium text-lg tracking-wide">SCEMS Platform</h1>
        </div>
      </div>

      {/* Amount Section */}
      <div className="bg-[#02042b] text-white px-6 pb-8 pt-2 rounded-b-3xl shadow-lg relative overflow-hidden">
        <div className="absolute opacity-10 right-0 top-0 w-32 h-32 bg-white rounded-full translate-x-1/3 -translate-y-1/3 blur-2xl" />
        <p className="text-white/70 text-sm font-medium mb-1">Total Amount</p>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-semibold">₹</span>
          <span className="text-5xl font-bold tracking-tight">{displayAmount}</span>
        </div>
        <div className="mt-4 inline-block px-3 py-1 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
          <p className="text-xs text-white/80 font-mono">TXN: {txnId}</p>
        </div>
      </div>

      {/* Payment Options */}
      <div className="flex-1 p-4 -mt-4 z-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Preferred Payment Methods</h3>
          </div>
          
          <div className="p-2">
            {/* UPI Option */}
            <div 
              onClick={() => setSelectedMethod('upi')}
              className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-colors ${selectedMethod === 'upi' ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50 border border-transparent'}`}
            >
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                <Smartphone size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 text-sm">UPI - Google Pay, PhonePe</h4>
                <p className="text-xs text-gray-500">Pay directly from your bank account</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'upi' ? 'border-[#3385ff]' : 'border-gray-300'}`}>
                {selectedMethod === 'upi' && <div className="w-2.5 h-2.5 rounded-full bg-[#3385ff]" />}
              </div>
            </div>

            {/* Card Option */}
            <div 
              onClick={() => setSelectedMethod('card')}
              className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-colors mt-2 ${selectedMethod === 'card' ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50 border border-transparent'}`}
            >
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                <CreditCard size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 text-sm">Credit / Debit Card</h4>
                <p className="text-xs text-gray-500">Visa, Mastercard, RuPay</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'card' ? 'border-[#3385ff]' : 'border-gray-300'}`}>
                {selectedMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-[#3385ff]" />}
              </div>
            </div>

            {/* Netbanking Option */}
            <div 
              onClick={() => setSelectedMethod('netbanking')}
              className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-colors mt-2 ${selectedMethod === 'netbanking' ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50 border border-transparent'}`}
            >
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <Building2 size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 text-sm">Net Banking</h4>
                <p className="text-xs text-gray-500">All major Indian banks</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'netbanking' ? 'border-[#3385ff]' : 'border-gray-300'}`}>
                {selectedMethod === 'netbanking' && <div className="w-2.5 h-2.5 rounded-full bg-[#3385ff]" />}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handlePay}
            className="w-full bg-[#3385ff] hover:bg-[#2970db] active:bg-[#1f5bb8] text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex justify-center items-center gap-2 cursor-pointer"
          >
            Pay ₹{displayAmount}
          </button>
        </div>

        <div className="mt-8 flex justify-center items-center gap-2 text-xs font-semibold text-gray-400 tracking-wider">
          <Shield size={14} className="text-gray-400" />
          SECURED BY RAZORPAY
        </div>
      </div>
    </div>
  );
};

export default MobilePayment;
