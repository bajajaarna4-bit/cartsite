import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Check, 
  Wallet, 
  ShieldCheck, 
  Sparkles,
  Zap,
  ArrowRight
} from 'lucide-react';
import { AccessPass } from '../types';

export const PaymentModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { currentUser, topUpWallet, purchasePass } = useApp();
  const [activeTab, setActiveTab] = useState<'passes' | 'wallet'>('passes');
  const [selectedAmount, setSelectedAmount] = useState<number>(100);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const passTiers: {
    id: AccessPass['passType'];
    title: string;
    price: number;
    days: number;
    desc: string;
    badge?: string;
  }[] = [
    {
      id: 'weekly_commuter',
      title: 'Weekly Commuter Pass',
      price: 99,
      days: 7,
      desc: 'Unlimited rides across campus for 7 days. Ideal for exam revisions and rainy weeks.'
    },
    {
      id: 'unlimited_monthly',
      title: 'Monthly All-Campus Pass',
      price: 299,
      days: 30,
      desc: 'Complete 30-day all-inclusive e-cart access. Save 65% vs single hops.',
      badge: 'Most Popular'
    },
    {
      id: 'exam_week',
      title: 'Exam Rush Fast Pass',
      price: 49,
      days: 5,
      desc: 'Priority queueing during peak morning examination blocks.'
    }
  ];

  const handleBuyPass = (tier: typeof passTiers[0]) => {
    setIsProcessing(true);
    setTimeout(() => {
      purchasePass(tier.id, tier.price, tier.days, `${tier.title} (Razorpay Test Mode)`);
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1500);
    }, 900);
  };

  const handleWalletRecharge = () => {
    setIsProcessing(true);
    setTimeout(() => {
      topUpWallet(selectedAmount, 'Razorpay UPI Test Mode');
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1500);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-3xl bg-charcoal-900 border border-charcoal-700 shadow-2xl text-gray-100 overflow-hidden">
        {/* Header with Razorpay mock test badge */}
        <div className="p-5 border-b border-charcoal-800 bg-gradient-to-r from-campus-950/70 to-charcoal-850 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-campus-600/20 text-campus-400 border border-campus-500/30 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base font-['Plus_Jakarta_Sans'] text-white">
                  CampusCart Payments
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase tracking-wider">
                  Razorpay Sandbox
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Wallet Balance: <span className="font-bold text-emerald-400">₹{currentUser.walletBalance}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-charcoal-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-2 p-1.5 bg-charcoal-950 border-b border-charcoal-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('passes')}
            className={`py-2 rounded-xl transition-all ${
              activeTab === 'passes'
                ? 'bg-charcoal-800 text-campus-400 shadow'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Transit Passes & Subscriptions
          </button>
          <button
            onClick={() => setActiveTab('wallet')}
            className={`py-2 rounded-xl transition-all ${
              activeTab === 'wallet'
                ? 'bg-charcoal-800 text-campus-400 shadow'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Recharge Campus Wallet
          </button>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[70vh] overflow-y-auto">
          {isSuccess ? (
            <div className="py-10 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto animate-bounce">
                <Check className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-white">Payment Completed!</h4>
              <p className="text-xs text-gray-400">
                Your account was credited successfully in test mode.
              </p>
            </div>
          ) : isProcessing ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-10 h-10 border-2 border-campus-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-semibold text-gray-300">
                Authorizing with Razorpay Test Gateway...
              </p>
            </div>
          ) : activeTab === 'passes' ? (
            <div className="space-y-3">
              {passTiers.map(tier => (
                <div
                  key={tier.id}
                  className="relative p-4 rounded-2xl bg-charcoal-800/80 border border-charcoal-700 hover:border-campus-500/50 transition-all group"
                >
                  {tier.badge && (
                    <span className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full bg-gradient-to-r from-campus-600 to-indigo-600 text-white text-[10px] font-bold shadow">
                      {tier.badge}
                    </span>
                  )}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-campus-300 transition-colors">
                        {tier.title}
                      </h4>
                      <p className="text-[11px] text-gray-400 mt-1 leading-snug">
                        {tier.desc}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-lg font-extrabold text-white">₹{tier.price}</span>
                      <span className="text-[10px] text-gray-400 block">/{tier.days} days</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-charcoal-700/60 flex items-center justify-between">
                    <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Instant Activation
                    </span>
                    <button
                      onClick={() => handleBuyPass(tier)}
                      className="px-3.5 py-1.5 rounded-xl bg-campus-600 hover:bg-campus-500 text-white font-semibold text-xs flex items-center gap-1 transition-all"
                    >
                      <span>Pay ₹{tier.price}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="p-3.5 rounded-2xl bg-charcoal-850 border border-charcoal-700 text-xs text-gray-400 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-campus-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Need medical/accessibility exemption?</strong> Injured or disabled students can receive 100% free passes granted directly by the Transport Office.
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">
                  Select Recharge Amount:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[50, 100, 200, 500].map(amt => (
                    <button
                      key={amt}
                      onClick={() => setSelectedAmount(amt)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                        selectedAmount === amt
                          ? 'bg-campus-600/20 text-campus-300 border-campus-500'
                          : 'bg-charcoal-800 text-gray-300 border-charcoal-700 hover:bg-charcoal-750'
                      }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Simulated QR Code / UPI screen */}
              <div className="p-4 rounded-2xl bg-charcoal-850 border border-charcoal-700 flex flex-col items-center justify-center text-center space-y-2">
                <div className="p-2 bg-white rounded-xl shadow">
                  {/* SVG Mock QR Code */}
                  <svg className="w-28 h-28 text-black" viewBox="0 0 100 100">
                    <rect width="100" height="100" fill="white" />
                    <rect x="10" y="10" width="30" height="30" fill="black" />
                    <rect x="15" y="15" width="20" height="20" fill="white" />
                    <rect x="20" y="20" width="10" height="10" fill="black" />
                    <rect x="60" y="10" width="30" height="30" fill="black" />
                    <rect x="65" y="15" width="20" height="20" fill="white" />
                    <rect x="70" y="20" width="10" height="10" fill="black" />
                    <rect x="10" y="60" width="30" height="30" fill="black" />
                    <rect x="15" y="65" width="20" height="20" fill="white" />
                    <rect x="20" y="70" width="10" height="10" fill="black" />
                    <rect x="50" y="50" width="15" height="15" fill="black" />
                    <rect x="70" y="65" width="15" height="15" fill="black" />
                    <rect x="55" y="75" width="10" height="15" fill="black" />
                  </svg>
                </div>
                <div className="text-[11px] text-gray-400">
                  <span>UPI ID: </span>
                  <code className="text-gray-200 font-mono">greentech.ecart@icici</code>
                </div>
              </div>

              <button
                onClick={handleWalletRecharge}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-campus-600 to-violet-600 hover:from-campus-500 hover:to-violet-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-campus-600/30 transition-all hover:scale-[1.01]"
              >
                <Wallet className="w-4 h-4" />
                <span>Simulate Pay ₹{selectedAmount} (Test Mode)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
