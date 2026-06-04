import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Edit3, CheckCircle2, PartyPopper,
  CreditCard, Smartphone, Building2, Shield
} from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { getEventById } from '../api/events';
import { registerForEvent } from '../api/registrations';
import { useAuth } from '../context/AuthContext';
import StepIndicator from '../components/StepIndicator';

const step1Schema = z.object({
  fullName: z.string().min(3, 'Name must be at least 3 characters'),
  rollNo: z.string().regex(/^[0-9]{2}[A-Z]{2}[0-9]{3}$/, 'Format: 21CS045'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Must be 10 digits'),
});

const step2Schema = z.object({
  department: z.string().min(1, 'Select a department'),
  year: z.string().min(1, 'Select year of study'),
  specialReqs: z.string().optional(),
});

const RegistrationForm = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');

  const registrationFee = 149;
  const transactionId = 'TXN' + Date.now().toString().slice(-8);

  useEffect(() => {
    const fetch = async () => {
      const data = await getEventById(eventId);
      setEvent(data);
    };
    fetch();
  }, [eventId]);

  const form1 = useForm({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      fullName: user?.name || '',
      rollNo: user?.rollNo || '',
      email: user?.email || '',
      phone: '',
    },
  });

  const form2 = useForm({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      department: user?.department || '',
      year: user?.year?.toString() || '',
      specialReqs: '',
    },
  });

  const handleNext = async () => {
    if (step === 1) {
      const valid = await form1.trigger();
      if (valid) setStep(2);
    } else if (step === 2) {
      const valid = await form2.trigger();
      if (valid) setStep(3);
    } else if (step === 3) {
      setStep(4); // Go to payment
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handlePayment = async () => {
    // Validate payment inputs
    if (paymentMethod === 'upi' && !upiId.includes('@')) {
      toast.error('Enter a valid UPI ID (e.g., name@upi)');
      return;
    }
    if (paymentMethod === 'card') {
      if (cardNumber.replace(/\s/g, '').length < 16) {
        toast.error('Enter a valid 16-digit card number');
        return;
      }
      if (!cardExpiry || !cardCvv || !cardName) {
        toast.error('Fill all card details');
        return;
      }
    }

    setPaymentProcessing(true);
    toast.loading('Processing payment...');

    // Simulate payment processing
    await new Promise((r) => setTimeout(r, 2500));
    toast.dismiss();

    setPaymentSuccess(true);
    toast.success(`₹${registrationFee} paid successfully! 🎉`);

    // Now register
    await new Promise((r) => setTimeout(r, 500));
    toast.loading('Confirming registration...');

    try {
      await registerForEvent(eventId, {
        ...form1.getValues(),
        ...form2.getValues(),
        studentId: user?.id,
        paymentId: transactionId,
        amountPaid: registrationFee,
      });
      toast.dismiss();
      toast.success('Registration confirmed! 🎉');
      setSuccess(true);
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#6366F1', '#10B981', '#F59E0B', '#EC4899'],
      });
    } catch {
      toast.dismiss();
      toast.error('Registration failed. Try again.');
    } finally {
      setPaymentProcessing(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s/g, '').replace(/\D/g, '').slice(0, 16);
    return v.replace(/(.{4})/g, '$1 ').trim();
  };

  const InputField = ({ label, error, ...props }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
        {label}
      </label>
      <input
        className="w-full px-4 py-2.5 rounded-xl text-sm transition-all"
        style={{
          backgroundColor: 'var(--bg-surface)',
          color: 'var(--text-primary)',
          border: error ? '2px solid var(--accent-danger)' : '1px solid var(--border)',
        }}
        {...props}
      />
      {error && (
        <p className="text-xs mt-1 font-medium" style={{ color: 'var(--accent-danger)' }}>
          {error.message}
        </p>
      )}
    </div>
  );

  if (success) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center px-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <motion.div
          className="text-center max-w-md mx-auto"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <CheckCircle2 size={80} style={{ color: 'var(--accent-em)' }} className="mx-auto mb-6" />
          </motion.div>
          <h1 className="font-clash font-bold text-3xl mb-3" style={{ color: 'var(--text-primary)' }}>
            Registration Confirmed! 🎉
          </h1>
          <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
            You're registered for
          </p>
          <p className="font-semibold text-lg mb-1" style={{ color: 'var(--accent)' }}>
            {event?.title}
          </p>
          <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
            {formatDate(event?.date)} · {event?.time}
          </p>
          <div
            className="inline-block rounded-lg px-4 py-2 mb-6 text-xs"
            style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-em)' }}
          >
            <p className="font-semibold">Payment Successful</p>
            <p>₹{registrationFee} · TXN: {transactionId}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/dashboard" className="btn-base btn-filled no-underline">
              View My Registrations
            </Link>
            <Link to="/events" className="btn-base btn-outlined no-underline">
              Browse More Events
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 px-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-clash font-bold text-2xl mb-2 text-center" style={{ color: 'var(--text-primary)' }}>
            Event Registration
          </h1>
          {event && (
            <p className="text-center text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
              {event.title} · {formatDate(event.date)}
            </p>
          )}

          <StepIndicator currentStep={step} steps={['Personal', 'Academic', 'Review', 'Payment']} />

          <div className="glass rounded-2xl p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {/* Step 1 */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                  <h2 className="font-clash font-semibold text-lg mb-6" style={{ color: 'var(--text-primary)' }}>
                    Personal Information
                  </h2>
                  <InputField label="Full Name *" placeholder="Enter your full name" error={form1.formState.errors.fullName} {...form1.register('fullName')} />
                  <InputField label="Roll Number *" placeholder="e.g., 21CS045" error={form1.formState.errors.rollNo} {...form1.register('rollNo')} />
                  <InputField label="Email *" type="email" placeholder="your.email@college.edu" error={form1.formState.errors.email} {...form1.register('email')} />
                  <InputField label="Phone *" placeholder="10-digit mobile number" error={form1.formState.errors.phone} {...form1.register('phone')} />
                </motion.div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                  <h2 className="font-clash font-semibold text-lg mb-6" style={{ color: 'var(--text-primary)' }}>
                    Academic Information
                  </h2>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Department *</label>
                    <select
                      className="w-full px-4 py-2.5 rounded-xl text-sm"
                      style={{
                        backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)',
                        border: form2.formState.errors.department ? '2px solid var(--accent-danger)' : '1px solid var(--border)',
                      }}
                      {...form2.register('department')}
                    >
                      <option value="">Select Department</option>
                      {['CSE', 'ECE', 'Mech', 'Civil', 'EEE', 'IT'].map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                    {form2.formState.errors.department && <p className="text-xs mt-1" style={{ color: 'var(--accent-danger)' }}>{form2.formState.errors.department.message}</p>}
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Year of Study *</label>
                    <select
                      className="w-full px-4 py-2.5 rounded-xl text-sm"
                      style={{
                        backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)',
                        border: form2.formState.errors.year ? '2px solid var(--accent-danger)' : '1px solid var(--border)',
                      }}
                      {...form2.register('year')}
                    >
                      <option value="">Select Year</option>
                      {[1, 2, 3, 4].map((y) => <option key={y} value={y}>Year {y}</option>)}
                    </select>
                    {form2.formState.errors.year && <p className="text-xs mt-1" style={{ color: 'var(--accent-danger)' }}>{form2.formState.errors.year.message}</p>}
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Special Requirements</label>
                    <textarea rows={3} className="w-full px-4 py-2.5 rounded-xl text-sm resize-none" placeholder="Any special needs..."
                      style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                      {...form2.register('specialReqs')}
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 3 - Review */}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                  <h2 className="font-clash font-semibold text-lg mb-6" style={{ color: 'var(--text-primary)' }}>
                    Review & Confirm
                  </h2>
                  <div className="rounded-xl p-5 mb-4 space-y-3" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Registration Details</h3>
                      <button onClick={() => setStep(1)} className="flex items-center gap-1 text-xs font-medium cursor-pointer bg-transparent border-none" style={{ color: 'var(--accent)' }}>
                        <Edit3 size={14} /> Edit
                      </button>
                    </div>
                    {[
                      ['Full Name', form1.getValues('fullName')],
                      ['Roll Number', form1.getValues('rollNo')],
                      ['Email', form1.getValues('email')],
                      ['Phone', form1.getValues('phone')],
                      ['Department', form2.getValues('department')],
                      ['Year', `Year ${form2.getValues('year')}`],
                      ['Special Reqs', form2.getValues('specialReqs') || 'None'],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between text-sm">
                        <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{value}</span>
                      </div>
                    ))}
                  </div>

                  {event && (
                    <div className="rounded-xl p-4 flex items-center gap-4" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                      <div className="w-3 h-12 rounded-full flex-shrink-0" style={{ backgroundColor: event.bannerColor }} />
                      <div>
                        <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{event.title}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{formatDate(event.date)} · {event.time} · {event.venue}</p>
                      </div>
                    </div>
                  )}

                  {/* Fee breakdown */}
                  <div className="rounded-xl p-4 mt-4" style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
                    <div className="flex justify-between text-sm mb-1">
                      <span style={{ color: 'var(--text-muted)' }}>Registration Fee</span>
                      <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>₹{registrationFee}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: 'var(--text-muted)' }}>Platform Fee</span>
                      <span style={{ color: 'var(--accent-em)' }}>FREE</span>
                    </div>
                    <div className="border-t mt-2 pt-2 flex justify-between text-sm font-bold" style={{ borderColor: 'var(--border)' }}>
                      <span style={{ color: 'var(--text-primary)' }}>Total</span>
                      <span style={{ color: 'var(--accent)' }}>₹{registrationFee}</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4 - Payment */}
              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                  <h2 className="font-clash font-semibold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                    Payment
                  </h2>
                  <p className="text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
                    <Shield size={12} className="inline mr-1" />
                    Secure mock payment — no real charges
                  </p>

                  {/* Amount banner */}
                  <div className="rounded-xl p-4 mb-6 text-center" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-em))', color: '#fff' }}>
                    <p className="text-xs opacity-80">Amount to Pay</p>
                    <p className="font-clash font-bold text-3xl">₹{registrationFee}</p>
                    <p className="text-xs opacity-70 mt-1">{event?.title}</p>
                  </div>

                  {/* Payment method tabs */}
                  <div className="flex gap-2 mb-5">
                    {[
                      { id: 'upi', label: 'UPI', icon: <Smartphone size={16} /> },
                      { id: 'card', label: 'Card', icon: <CreditCard size={16} /> },
                      { id: 'netbanking', label: 'Net Banking', icon: <Building2 size={16} /> },
                    ].map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer border-none"
                        style={{
                          backgroundColor: paymentMethod === method.id ? 'var(--accent)' : 'var(--bg-surface)',
                          color: paymentMethod === method.id ? '#ffffff' : 'var(--text-muted)',
                          border: paymentMethod === method.id ? 'none' : '1px solid var(--border)',
                        }}
                      >
                        {method.icon}
                        {method.label}
                      </button>
                    ))}
                  </div>

                  {/* UPI */}
                  {paymentMethod === 'upi' && (
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>UPI ID</label>
                      <input
                        type="text"
                        placeholder="yourname@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl text-sm mb-3"
                        style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                      />
                      <div className="flex flex-wrap gap-2 mb-4">
                        {['GooglePay', 'PhonePe', 'Paytm'].map((app) => (
                          <button
                            key={app}
                            onClick={() => setUpiId(`student@${app.toLowerCase()}`)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer border-none"
                            style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--accent)', border: '1px solid var(--border)' }}
                          >
                            {app}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Card */}
                  {paymentMethod === 'card' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Card Number</label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          maxLength={19}
                          className="w-full px-4 py-2.5 rounded-xl text-sm"
                          style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Card Holder Name</label>
                        <input
                          type="text"
                          placeholder="Name on card"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl text-sm"
                          style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                        />
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Expiry</label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value.slice(0, 5))}
                            maxLength={5}
                            className="w-full px-4 py-2.5 rounded-xl text-sm"
                            style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>CVV</label>
                          <input
                            type="password"
                            placeholder="•••"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.slice(0, 3))}
                            maxLength={3}
                            className="w-full px-4 py-2.5 rounded-xl text-sm"
                            style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Net Banking */}
                  {paymentMethod === 'netbanking' && (
                    <div className="grid grid-cols-2 gap-3">
                      {['SBI', 'HDFC', 'ICICI', 'Axis', 'PNB', 'Kotak'].map((bank) => (
                        <button
                          key={bank}
                          onClick={() => toast.success(`Redirecting to ${bank}...`)}
                          className="py-3 rounded-xl text-sm font-medium cursor-pointer border-none transition-all hover:opacity-80"
                          style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                        >
                          🏦 {bank} Bank
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="flex justify-between mt-8">
              {step > 1 ? (
                <button onClick={handleBack} className="btn-base btn-outlined text-sm" disabled={paymentProcessing}>
                  <ArrowLeft size={16} /> Back
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button onClick={handleNext} className="btn-base btn-filled text-sm">
                  Next <ArrowRight size={16} />
                </button>
              ) : step === 3 ? (
                <button onClick={handleNext} className="btn-base btn-filled text-sm">
                  Proceed to Pay ₹{registrationFee} <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  onClick={handlePayment}
                  disabled={paymentProcessing}
                  className="btn-base btn-filled text-sm"
                  style={{ opacity: paymentProcessing ? 0.7 : 1 }}
                >
                  {paymentProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard size={16} />
                      Pay ₹{registrationFee}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegistrationForm;
