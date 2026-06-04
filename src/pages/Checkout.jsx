import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard, Smartphone, Building2, Shield, Lock,
  CheckCircle2, Loader2, ArrowLeft, QrCode
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { registerForEvent } from '../api/registrations';

const Checkout = () => {
  const { cartItems, cartCount, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [processing, setProcessing] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  
  // Real-time payment sync state
  const [txnId, setTxnId] = useState('');
  const [polling, setPolling] = useState(false);
  const [qrUrl, setQrUrl] = useState('');

  useEffect(() => {
    // Only redirect to cart if it's empty AND we aren't in the middle of a successful payment
    if (cartCount === 0 && !sessionStorage.getItem('scems_receipt')) {
      navigate('/cart');
    }
  }, [cartCount, navigate]);

  if (cartCount === 0) return null;

  const generateTransactionId = () => {
    return 'TXN' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();
  };

  // Generate transaction ID only once per checkout session
  useEffect(() => {
    setTxnId(generateTransactionId());
  }, []);

  useEffect(() => {
    if (paymentMethod === 'upi' && txnId) {
      // 1. Tell backend we have a new pending transaction
      fetch(`http://localhost:8080/api/payment/init/${txnId}`, { method: 'POST' }).catch(() => {});
      
      // 2. Generate QR Code URL
      // Use the specific LAN IP we discovered so the phone can access it
      const host = window.location.hostname === 'localhost' ? '172.17.32.248' : window.location.hostname;
      const mobilePayUrl = `http://${host}:5174/mobile-pay/${txnId}/${totalAmount || 0}`;
      setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(mobilePayUrl)}`);
      
      // 3. Start polling
      setPolling(true);
    } else {
      setPolling(false);
    }
  }, [paymentMethod, txnId, totalAmount]);

  useEffect(() => {
    let interval;
    let timeout;
    if (polling && txnId) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`http://localhost:8080/api/payment/status/${txnId}`);
          const data = await res.json();
          if (data.status === 'SUCCESS') {
            setPolling(false);
            clearInterval(interval);
            clearTimeout(timeout);
            handleSuccessPayment();
          }
        } catch (err) {
          // Ignore network errors during polling
        }
      }, 2000);
      
      // Auto-success fallback after 15 seconds for the demo
      // (7 seconds for mobile processing + 8 seconds buffer)
      timeout = setTimeout(() => {
        if (polling) {
            setPolling(false);
            clearInterval(interval);
            handleSuccessPayment();
        }
      }, 15000);
    }
    return () => {
        clearInterval(interval);
        clearTimeout(timeout);
    };
  }, [polling, txnId]);

  const handleSuccessPayment = async () => {
    setProcessing(true);
    
    // Register the user for all items in the cart via backend
    try {
      await Promise.all(
        cartItems.map(item => 
          registerForEvent(item.id || item.eventId, {
            studentId: user?.id || 'S001',
            paymentId: txnId,
            amountPaid: item.fee || 0
          })
        )
      );
    } catch (err) {
      console.error("Failed to register in backend", err);
    }

    const receiptData = {
      transactionId: txnId,
      events: cartItems,
      totalAmount,
      paymentMethod,
      user: { name: user?.name, email: user?.email, rollNo: user?.rollNo },
      timestamp: new Date().toISOString(),
      status: 'SUCCESS',
    };

    sessionStorage.setItem('scems_receipt', JSON.stringify(receiptData));
    clearCart();
    setProcessing(false);
    toast.success('Payment successful! 🎉');
    navigate('/receipt');
  };

  const handlePayment = async () => {
    if (paymentMethod === 'upi') {
      toast.info('Please scan the QR code to pay');
      return;
    }
    // Basic validation
    if (paymentMethod === 'card' && cardNumber.replace(/\s/g, '').length < 16) {
      toast.error('Please enter a valid card number');
      return;
    }

    setProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2500));
    handleSuccessPayment();
  };
  const paymentMethods = [
    { id: 'upi', label: 'UPI', icon: <Smartphone size={20} />, desc: 'Google Pay, PhonePe, Paytm' },
    { id: 'card', label: 'Card', icon: <CreditCard size={20} />, desc: 'Credit / Debit Card' },
    { id: 'netbanking', label: 'Net Banking', icon: <Building2 size={20} />, desc: 'All major banks' },
  ];

  return (
    <div className="min-h-screen pt-20 pb-24" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Back */}
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center gap-2 text-sm mb-6 cursor-pointer border-none bg-transparent transition-all hover:opacity-70"
          style={{ color: 'var(--text-muted)' }}
        >
          <ArrowLeft size={16} /> Back to Cart
        </button>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Payment Form */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-6 sm:p-8"
            >
              <div className="flex items-center gap-2 mb-6">
                <Lock size={18} style={{ color: 'var(--accent-em)' }} />
                <h2 className="font-clash font-semibold text-xl" style={{ color: 'var(--text-primary)' }}>
                  Secure Checkout
                </h2>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3 mb-6">
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Select Payment Method
                </p>
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className="w-full flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all border-none"
                    style={{
                      backgroundColor: paymentMethod === method.id ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg-surface)',
                      border: paymentMethod === method.id ? '2px solid var(--accent)' : '2px solid var(--border)',
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: paymentMethod === method.id ? 'var(--accent)' : 'var(--bg-card)',
                        color: paymentMethod === method.id ? '#fff' : 'var(--text-muted)',
                      }}
                    >
                      {method.icon}
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {method.label}
                      </div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {method.desc}
                      </div>
                    </div>
                    {paymentMethod === method.id && (
                      <CheckCircle2 size={20} className="ml-auto" style={{ color: 'var(--accent)' }} />
                    )}
                  </button>
                ))}
              </div>

              {/* Payment Details */}
              <div className="space-y-4 mb-6">
                {paymentMethod === 'upi' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-4">
                    <p className="text-sm font-semibold mb-4 text-center" style={{ color: 'var(--text-primary)' }}>
                      Scan QR Code with any UPI App
                    </p>
                    <div 
                      className="bg-white p-3 rounded-2xl mb-4 cursor-pointer hover:scale-105 transition-transform" 
                      style={{ border: '2px solid var(--accent)' }}
                      onClick={() => {
                        if (polling) {
                          setPolling(false);
                          handleSuccessPayment();
                        }
                      }}
                      title="Click to simulate successful payment"
                    >
                      {qrUrl ? (
                        <img src={qrUrl} alt="UPI QR Code" className="w-48 h-48" />
                      ) : (
                        <div className="w-48 h-48 flex items-center justify-center bg-gray-100 rounded-xl">
                          <Loader2 className="animate-spin text-gray-400" size={32} />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                      <Loader2 size={14} className="animate-spin" />
                      Waiting for payment confirmation...
                    </div>
                  </motion.div>
                )}

                {paymentMethod === 'card' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="w-full px-4 py-3 rounded-xl text-sm"
                        style={{
                          backgroundColor: 'var(--bg-surface)',
                          color: 'var(--text-primary)',
                          border: '1px solid var(--border)',
                        }}
                      />
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>
                          Expiry
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="w-full px-4 py-3 rounded-xl text-sm"
                          style={{
                            backgroundColor: 'var(--bg-surface)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border)',
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>
                          CVV
                        </label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="•••"
                          maxLength={3}
                          className="w-full px-4 py-3 rounded-xl text-sm"
                          style={{
                            backgroundColor: 'var(--bg-surface)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border)',
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {paymentMethod === 'netbanking' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>
                      Select Bank
                    </label>
                    <select
                      className="w-full px-4 py-3 rounded-xl text-sm"
                      style={{
                        backgroundColor: 'var(--bg-surface)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      <option>State Bank of India</option>
                      <option>HDFC Bank</option>
                      <option>ICICI Bank</option>
                      <option>Axis Bank</option>
                      <option>Kotak Mahindra Bank</option>
                    </select>
                  </motion.div>
                )}
              </div>

              {/* Pay Button */}
              <button
                onClick={handlePayment}
                disabled={processing}
                className="btn-base btn-filled w-full py-3.5 text-sm"
                style={{ opacity: processing ? 0.7 : 1 }}
              >
                {processing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Shield size={18} />
                    Pay {totalAmount > 0 ? `₹${totalAmount}` : 'Free'} & Register
                  </>
                )}
              </button>

              {/* Security Note */}
              <div className="flex items-center justify-center gap-2 mt-4 text-[10px]" style={{ color: 'var(--text-muted)' }}>
                <Lock size={12} />
                Your payment information is encrypted and secure
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-[280px]">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass rounded-2xl p-5 lg:sticky lg:top-24"
            >
              <h3 className="font-clash font-semibold text-base mb-4" style={{ color: 'var(--text-primary)' }}>
                Order Summary
              </h3>
              <div className="space-y-2 mb-4">
                {cartItems.map((item) => (
                  <div key={item.eventId || item.id} className="flex justify-between text-xs">
                    <span className="truncate mr-2" style={{ color: 'var(--text-muted)' }}>{item.title}</span>
                    <span style={{ color: 'var(--text-primary)' }}>{item.fee ? `₹${item.fee}` : 'Free'}</span>
                  </div>
                ))}
              </div>
              <div
                className="flex justify-between text-sm font-bold pt-3"
                style={{ borderTop: '1px solid var(--border)', color: 'var(--text-primary)' }}
              >
                <span>Total</span>
                <span style={{ color: 'var(--accent)' }}>
                  {totalAmount > 0 ? `₹${totalAmount}` : 'FREE'}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
