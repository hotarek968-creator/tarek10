import React, { useState } from 'react';
import { 
  X, Check, ArrowRight, ShieldCheck, CreditCard, ShoppingCart, 
  MapPin, Phone, User, Landmark, HelpCircle, Compass, Truck
} from 'lucide-react';
import { Product, Language, Theme } from '../types';

interface CartItem {
  productId: string;
  quantity: number;
}

interface CheckoutModalProps {
  language: Language;
  theme: Theme;
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  products: Product[];
  onOrderSuccess: (orderData: {
    customerName: string;
    customerPhone: string;
    address: string;
    area: 'inside' | 'outside';
    paymentMethod: 'bkash' | 'nagad' | 'rocket' | 'cod';
    paymentStatus: 'pending' | 'success';
    walletNumber?: string;
  }) => void;
  addToast: (msg: string, type: 'success' | 'info' | 'error') => void;
}

export default function CheckoutModal({
  language,
  theme,
  isOpen,
  onClose,
  cart,
  products,
  onOrderSuccess,
  addToast,
}: CheckoutModalProps) {
  // Checkout flow state
  const [step, setStep] = useState<'details' | 'payment-select' | 'payment-gateway' | 'completed'>('details');
  
  // Billing details
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState<'inside' | 'outside'>('inside');
  
  // Geolocation simulation flags
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Selected payment method
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'rocket' | 'cod'>('cod');
  
  // Mock Mobile banking gateway properties
  const [walletNumber, setWalletNumber] = useState('');
  const [pinNumber, setPinNumber] = useState('');
  const [gatewayStep, setGatewayStep] = useState<'wallet' | 'pin' | 'processing'>('wallet');

  if (!isOpen) return null;

  // Cart values calculations
  const subtotal = cart.reduce((acc, item) => {
    const prod = products.find(p => p.id === item.productId);
    return acc + (prod ? prod.price * item.quantity : 0);
  }, 0);

  const deliveryCharge = area === 'inside' ? 80 : 150;
  const grandTotal = subtotal + deliveryCharge;

  // Attempt using browser GPS coordinate optimization for rapid dispatch routing
  const autofillAddressCoordinates = () => {
    if (!navigator.geolocation) {
      addToast(
        language === 'bn' ? 'জিপিএস সুবিধা আপনার ব্রাউজারে সাপোর্ট করছে না।' : 'Geolocation not supported.', 
        'error'
      );
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGpsLoading(false);
        addToast(
          language === 'bn' ? 'জিপিএস লোকেশন পাওয়া গেছে! দ্রুত ডেলিভারি রুট সেট আপ করা হয়েছে।' : 'GPS matched for lightning fast delivery routing!',
          'success'
        );
      },
      (err) => {
        console.warn(err);
        setGpsLoading(false);
        addToast(
          language === 'bn' ? 'লোকেশন অ্যাক্সেস করা যায়নি। অনুগ্রহ করে ম্যানুয়ালি লিখুন।' : 'GPS access denied. Enter address manually.',
          'info'
        );
      }
    );
  };

  const handleNextToPaymentSelect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast(language === 'bn' ? 'আপনার নাম প্রবেশ করুন!' : 'Please enter your name!', 'error');
      return;
    }
    if (phone.length < 11) {
      addToast(language === 'bn' ? 'সঠিক ১১ সংখ্যার মোবাইল নাম্বার প্রবেশ করুন!' : 'Enter a valid 11-digit mobile number!', 'error');
      return;
    }
    if (!address.trim()) {
      addToast(language === 'bn' ? 'ডেলিভারি ঠিকানা প্রবেশ করুন!' : 'Please enter delivery address!', 'error');
      return;
    }
    setStep('payment-select');
  };

  const handleSelectGateway = (method: 'bkash' | 'nagad' | 'rocket' | 'cod') => {
    setPaymentMethod(method);
    if (method === 'cod') {
      // Cash on delivery can bypass mobile pins
      onOrderSuccess({
        customerName: name,
        customerPhone: phone,
        address: address,
        area: area,
        paymentMethod: 'cod',
        paymentStatus: 'pending',
      });
      setStep('completed');
    } else {
      setStep('payment-gateway');
      setGatewayStep('wallet');
      setWalletNumber(phone); // autofill with phone
    }
  };

  const handleMobileGatewaySubmit = () => {
    if (gatewayStep === 'wallet') {
      if (walletNumber.length < 11) {
        addToast(language === 'bn' ? '১১ ডিজিটের সঠিক ওয়ালেট নাম্বার দিন' : 'Enter valid mobile wallet number', 'error');
        return;
      }
      setGatewayStep('pin');
    } else if (gatewayStep === 'pin') {
      if (!pinNumber || pinNumber.length < 4) {
        addToast(language === 'bn' ? '৪ ডিজিটের ওয়ালেট পিন দিন' : 'Enter 4-digit PIN', 'error');
        return;
      }
      setGatewayStep('processing');
      
      // Simulate real-time secure handshake with the banking API
      setTimeout(() => {
        onOrderSuccess({
          customerName: name,
          customerPhone: phone,
          address: address,
          area: area,
          paymentMethod: paymentMethod,
          paymentStatus: 'success',
          walletNumber: walletNumber,
        });
        setStep('completed');
      }, 2500);
    }
  };

  // UI styling helpers based on payment channels
  const getBrandingClass = () => {
    if (paymentMethod === 'bkash') return { bg: 'bg-pink-600', text: 'text-pink-600', accent: '#d1156a', label: 'bKash (বিকাশ)' };
    if (paymentMethod === 'nagad') return { bg: 'bg-orange-500', text: 'text-orange-500', accent: '#f85c2c', label: 'Nagad (নগদ)' };
    return { bg: 'bg-purple-700', text: 'text-purple-700', accent: '#8224e3', label: 'Rocket (রকেট)' };
  };

  const branding = getBrandingClass();

  return (
    <div id="checkout-modal-dimmed-overlay" className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm font-sans animate-fade-in">
      
      <div 
        id="checkout-inner-dialog"
        className={`w-full max-w-lg rounded-xl overflow-hidden shadow-2xl flex flex-col relative ${
          theme === 'dark' ? 'bg-geo-dark text-white border border-geo-border' : 'bg-white text-slate-800'
        }`}
      >
        
        {/* Closed top icon */}
        <button
          id="checkout-close-top-icon"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/5 transition-colors z-10 cursor-pointer"
        >
          <X className="w-5 h-5 text-slate-400" />
        </button>

        {/* STEP 1: BILLING DETAILS */}
        {step === 'details' && (
          <form onSubmit={handleNextToPaymentSelect} className="flex flex-col h-full">
            <div className={`p-6 border-b ${theme === 'dark' ? 'border-geo-border' : 'border-slate-100'}`}>
              <h3 className="text-lg font-display font-bold flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-geo-amber animate-pulse" />
                {language === 'bn' ? 'অর্ডার শিপিং এবং গন্তব্য' : 'Shipping & Customer Summary'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {language === 'bn' 
                  ? 'অনুগ্রহ করে ডেলিভারি ও দ্রুত যোগাযোগের জন্য সঠিক তথ্য দিন।' 
                  : 'Please review and fill your destination info for immediate shipping dispatch.'}
              </p>
            </div>

            <div className="p-6 space-y-4 flex-1 overflow-y-auto max-h-[400px]">
              
              {/* Checkout Progress summary */}
              <div className={`rounded-lg p-4 border ${theme === 'dark' ? 'bg-geo-black border-geo-border' : 'bg-amber-50 border-amber-200'}`}>
                <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                  <span>{language === 'bn' ? 'পণ্যের মোট দাম:' : 'Subtotal:'}</span>
                  <span className={`font-mono text-sm ${theme === 'dark' ? 'text-geo-amber' : 'text-slate-900'}`}>৳{subtotal}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 mt-1.5 border-t border-white/5 pt-1.5">
                  <span>{language === 'bn' ? 'ডেলিভারি এলাকা:' : 'Area Delivery:'}</span>
                  <span className={theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}>{area === 'inside' ? (language === 'bn' ? 'ঢাকা সিটি (+৳৮০)' : 'Dhaka (+৳80)') : (language === 'bn' ? 'ঢাকার বাইরে (+৳১৫০)' : 'Outside Dhaka (+৳150)')}</span>
                </div>
                <div className="flex items-center justify-between text-sm font-extrabold text-slate-300 border-t border-white/5 pt-2 mt-2">
                  <span>{language === 'bn' ? 'মোট দেয় বিল:' : 'Total Payable Amount:'}</span>
                  <span className={`font-mono text-base ${theme === 'dark' ? 'text-geo-amber' : 'text-slate-100'}`}>৳{grandTotal}</span>
                </div>
              </div>

              {/* Input forms */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-400 uppercase mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-geo-amber" />
                    {language === 'bn' ? 'আপনার নাম' : 'Customer Name'}
                  </label>
                  <input
                    id="checkout-name-input"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={language === 'bn' ? 'উদা: মোঃ আব্দুর রহমান' : 'e.g. John Doe'}
                    className={`w-full rounded-lg px-4 py-2.5 outline-none border ${
                      theme === 'dark' 
                        ? 'bg-geo-black border-geo-border text-white focus:border-geo-amber' 
                        : 'bg-slate-50 border-slate-200 focus:border-amber-500 focus:bg-white'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-400 uppercase mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-geo-amber" />
                    {language === 'bn' ? 'মোবাইল নাম্বার' : 'Active Mobile Phone'}
                  </label>
                  <input
                    id="checkout-phone-input"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className={`w-full font-mono rounded-lg px-4 py-2.5 outline-none border ${
                      theme === 'dark' 
                        ? 'bg-geo-black border-geo-border text-white focus:border-geo-amber' 
                        : 'bg-slate-50 border-slate-200 focus:border-amber-500 focus:bg-white'
                    }`}
                  />
                </div>

                {/* Delivery area selector */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    id="area-inside-btn"
                    type="button"
                    onClick={() => setArea('inside')}
                    className={`p-3 rounded-lg border text-center transition-all cursor-pointer ${
                      area === 'inside'
                        ? (theme === 'dark' ? 'border-geo-amber bg-geo-amber/5 text-geo-amber font-bold' : 'border-slate-900 bg-slate-900 text-white font-bold')
                        : (theme === 'dark' ? 'border-zinc-800 text-slate-400 hover:border-zinc-750' : 'border-slate-205 text-slate-400')
                    }`}
                  >
                    <p className="text-xs">{language === 'bn' ? 'ঢাকা সিটির ভেতরে' : 'Inside Dhaka'}</p>
                    <p className="text-[10px] mt-0.5 opacity-80">৳৮০</p>
                  </button>
                  <button
                    id="area-outside-btn"
                    type="button"
                    onClick={() => setArea('outside')}
                    className={`p-3 rounded-lg border text-center transition-all cursor-pointer ${
                      area === 'outside'
                        ? (theme === 'dark' ? 'border-geo-amber bg-geo-amber/5 text-geo-amber font-bold' : 'border-slate-900 bg-slate-900 text-white font-bold')
                        : (theme === 'dark' ? 'border-zinc-800 text-slate-400 hover:border-zinc-750' : 'border-slate-205 text-slate-400')
                    }`}
                  >
                    <p className="text-xs">{language === 'bn' ? 'ঢাকার বাইরে' : 'Outside Dhaka'}</p>
                    <p className="text-[10px] mt-0.5 opacity-80">৳১৫০</p>
                  </button>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-slate-400 uppercase flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-geo-amber" />
                      {language === 'bn' ? 'সম্পূর্ণ ও সঠিক ঠিকানা' : 'Detailed Shipping Address'}
                    </label>
                    <button
                      id="checkout-gps-fill-btn"
                      type="button"
                      onClick={autofillAddressCoordinates}
                      disabled={gpsLoading}
                      className="text-[10px] text-geo-amber flex items-center gap-1 cursor-pointer hover:underline disabled:opacity-50"
                    >
                      <Compass className={`w-3 h-3 ${gpsLoading ? 'animate-spin' : ''}`} />
                      {language === 'bn' ? 'জিপিএস অটোফিল' : 'Auto Fill Coords'}
                    </button>
                  </div>
                  
                  <textarea
                    id="checkout-address-input"
                    rows={2}
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={
                      language === 'bn' 
                        ? 'হাউস নং, রোড নং, এলাকা এবং থানার নাম লিখুন...' 
                        : 'House, Street, Road, Sub-district (e.g. Uttara sector 4, Dhaka)'
                    }
                    className={`w-full rounded-lg px-4 py-2.5 outline-none border ${
                      theme === 'dark' 
                        ? 'bg-geo-black border-geo-border text-white focus:border-geo-amber' 
                        : 'bg-slate-50 border-slate-200 focus:border-amber-500 focus:bg-white'
                    }`}
                  />

                  {gpsCoords && (
                    <p className="text-[9px] font-mono text-geo-amber mt-1 flex items-center gap-1">
                      <Compass className="w-3 h-3 animate-pulse" />
                      GPS Coordinate optimization bound: {gpsCoords.lat.toFixed(5)}° N, {gpsCoords.lng.toFixed(5)}° E
                    </p>
                  )}
                </div>
              </div>

            </div>

            <div className={`p-6 ${theme === 'dark' ? 'bg-geo-black/40 border-t border-geo-border' : 'bg-slate-50 border-t border-slate-205'} flex items-center justify-between`}>
              <span className="text-[10px] text-slate-400 flex items-center gap-1 font-bold">
                <ShieldCheck className="w-4 h-4 text-geo-amber animate-pulse" />
                {language === 'bn' ? '১০০% ডাবল ফিল্টারিং সিকিউর বিলিং' : '100% Encrypted Payment Gateway'}
              </span>
              
              <button
                id="checkout-next-to-pay-btn"
                type="submit"
                className={`flex items-center gap-1.5 px-5 py-2.5 ${theme === 'dark' ? 'bg-geo-amber text-geo-black' : 'bg-slate-900 text-white'} text-xs font-bold rounded-lg cursor-pointer transition-all hover:opacity-90`}
              >
                {language === 'bn' ? 'পেমেন্ট করুন' : 'Select Payment Method'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: SELECT PAYMENT OPTION */}
        {step === 'payment-select' && (
          <div className="flex flex-col h-full animate-slide-up text-xs">
            <div className={`p-6 border-b ${theme === 'dark' ? 'border-geo-border' : 'border-slate-100'}`}>
              <h3 className="text-lg font-display font-medium flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-geo-amber" />
                {language === 'bn' ? 'পেমেন্ট চ্যানেল সিলেক্ট করুন' : 'Select Payment Channel'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {language === 'bn' 
                  ? 'নিচের যেকোনো একটি পেমেন্ট গেটওয়ের মাধ্যমে পরিশোধ করুন।' 
                  : 'Fast checkout using mobile banking or select cash on delivery to pay at your door.'}
              </p>
            </div>

            <div className="p-6 space-y-4 flex-1">
              
              {/* Payment aggregate cards */}
              <div className="grid grid-cols-2 gap-3">
                
                {/* bKash card logic */}
                <button
                  id="checkout-method-bkash-btn"
                  onClick={() => handleSelectGateway('bkash')}
                  className={`p-4 rounded-lg border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${theme === 'dark' ? 'border-geo-border hover:border-pink-500 bg-geo-black text-slate-200' : 'border-slate-200 hover:border-pink-500 bg-slate-50 text-slate-800'}`}
                >
                  <div className="w-10 h-10 bg-pink-500/10 rounded flex items-center justify-center text-pink-500 font-extrabold text-sm border border-pink-500/20">
                    bK
                  </div>
                  <span className="text-xs font-bold font-mono">bKash (বিকাশ)</span>
                  <span className="text-[9px] text-pink-500 font-bold">{language === 'bn' ? 'ইনস্ট্যান্ট পেমেন্ট' : 'Instant 2% Save'}</span>
                </button>

                {/* Nagad card logic */}
                <button
                  id="checkout-method-nagad-btn"
                  onClick={() => handleSelectGateway('nagad')}
                  className={`p-4 rounded-lg border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${theme === 'dark' ? 'border-geo-border hover:border-orange-500 bg-geo-black text-slate-200' : 'border-slate-200 hover:border-orange-500 bg-slate-50 text-slate-800'}`}
                >
                  <div className="w-10 h-10 bg-orange-500/10 rounded flex items-center justify-center text-orange-500 font-extrabold text-sm border border-orange-500/20">
                    N
                  </div>
                  <span className="text-xs font-bold font-mono">Nagad (নগদ)</span>
                  <span className="text-[9px] text-orange-500 font-bold">{language === 'bn' ? 'সরকারি ডাক সেবা' : 'Popular Gateway'}</span>
                </button>

                {/* Rocket card logic */}
                <button
                  id="checkout-method-rocket-btn"
                  onClick={() => handleSelectGateway('rocket')}
                  className={`p-4 rounded-lg border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${theme === 'dark' ? 'border-geo-border hover:border-purple-500 bg-geo-black text-slate-200' : 'border-slate-200 hover:border-purple-500 bg-slate-50 text-slate-800'}`}
                >
                  <div className="w-10 h-10 bg-purple-500/10 rounded flex items-center justify-center text-purple-400 font-extrabold text-sm border border-purple-500/20">
                    R
                  </div>
                  <span className="text-xs font-bold font-mono">Rocket (রকেট)</span>
                  <span className="text-[9px] text-purple-400 font-bold">{language === 'bn' ? 'ডাচ বাংলা ব্যাংক' : 'DBBL safe'}</span>
                </button>

                {/* Cash on Delivery */}
                <button
                  id="checkout-method-cod-btn"
                  onClick={() => handleSelectGateway('cod')}
                  className={`p-4 rounded-lg border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${theme === 'dark' ? 'border-geo-border hover:border-geo-amber bg-geo-black text-slate-200' : 'border-slate-200 hover:border-slate-900 bg-slate-50 text-slate-800'}`}
                >
                  <div className={`w-10 h-10 ${theme === 'dark' ? 'bg-geo-amber/10' : 'bg-slate-200'} rounded flex items-center justify-center text-geo-amber`}>
                    <Truck className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold">{language === 'bn' ? 'ক্যাশ অন ডেলিভারি' : 'Cash On Delivery'}</span>
                  <span className="text-[9px] text-slate-400">{language === 'bn' ? 'হাতে পেয়ে টাকা দিন' : 'Pay at delivery'}</span>
                </button>

              </div>
              
              <div className={`rounded-lg p-4 text-[10px] text-slate-400 space-y-1 block leading-relaxed border ${theme === 'dark' ? 'bg-geo-black/30 border-geo-border' : 'bg-amber-50/40 border-amber-200'}`}>
                <p>💡 <b>{language === 'bn' ? 'পরামর্শ:' : 'Note:'}</b> {language === 'bn' ? 'বিকাশ ও নগদ পেমেন্ট সম্পূর্ণ অটোমেটেড ও সুরক্ষিত। ক্যাশ অন ডেলিভারির ক্ষেত্রে ঢাকা সিটির ভেতর ২৪-৪৮ ঘণ্টার মধ্যে ডেলিভারি বয় আপনার বাসায় পৌঁছে দেবে।' : 'Your digital payments are processed through secured banking APIs with zero retention.'}</p>
              </div>

            </div>

            <div className={`p-6 ${theme === 'dark' ? 'bg-geo-black/40 border-t border-geo-border' : 'bg-slate-50 border-t border-slate-200'} flex items-center justify-between text-xs font-bold`}>
              <button
                id="checkout-back-to-details-btn"
                type="button"
                onClick={() => setStep('details')}
                className="px-4 py-2 text-slate-400 hover:text-white cursor-pointer"
              >
                {language === 'bn' ? '← পেছনে ফিরে যান' : '← Back'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: MOCK PAYMENTS INTRUSIVE WINDOW */}
        {step === 'payment-gateway' && (
          <div className="flex flex-col h-full overflow-hidden animate-slide-up">
            
            {/* Header styled for matching mobile gateway */}
            <div className={`p-5 ${branding.bg} text-white flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-white animate-pulse" />
                <span className="text-sm font-extrabold tracking-widest">{branding.label} SECURE DEPLOY GATEWAY</span>
              </div>
              <div className="text-xs font-bold font-mono tracking-wider">৳{grandTotal}</div>
            </div>

            <div className="p-6 space-y-4">
              
              {gatewayStep === 'wallet' && (
                <div className="space-y-4 animate-fade-in" id="gateway-wallet-view">
                  <div className="text-center py-2">
                    <p className="text-xs text-slate-500">
                      {language === 'bn' ? 'আপনার মোবাইল ব্যাংক একাউন্ট নম্বর প্রবেশ করুন' : 'Enter mobile banking transaction wallet digits'}
                    </p>
                  </div>
                  
                  <div className="relative">
                    <span className="absolute left-4 top-2.5 text-xs text-slate-400 font-mono">+৮৮</span>
                    <input
                      id="gateway-wallet-input"
                      type="tel"
                      value={walletNumber}
                      onChange={(e) => setWalletNumber(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      maxLength={11}
                      className={`w-full text-center font-mono font-bold tracking-widest text-lg rounded-lg pl-12 pr-4 py-2.5 outline-none border ${theme === 'dark' ? 'bg-geo-black border-geo-border text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                    />
                  </div>

                  <button
                    id="gateway-wallet-submit"
                    onClick={handleMobileGatewaySubmit}
                    className={`w-full py-3 ${branding.bg} text-white rounded-lg text-xs font-bold shadow-lg cursor-pointer hover:opacity-90 transition-all`}
                  >
                    {language === 'bn' ? 'পরবর্তী ধাপে যান' : 'Verify Wallet & Next'}
                  </button>
                </div>
              )}

              {gatewayStep === 'pin' && (
                <div className="space-y-4 animate-fade-in" id="gateway-pin-view">
                  <div className="text-center py-2">
                    <p className="text-xs text-geo-amber font-bold">
                      ✓ {walletNumber} {language === 'bn' ? 'ওয়ালেট নাম্বার ভেরিফাইড' : 'Wallet Number Verified'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {language === 'bn' ? 'নিরাপদে লেনদেন সম্পূর্ণ করতে ৪-৫ সংখ্যার পিন লিখুন' : 'Enter 4-5 digit payment PIN to authenticate purchase'}
                    </p>
                  </div>
                  
                  <input
                    id="gateway-pin-input"
                    type="password"
                    value={pinNumber}
                    onChange={(e) => setPinNumber(e.target.value)}
                    placeholder="••••"
                    maxLength={5}
                    className={`w-full text-center font-mono font-bold tracking-[1.5rem] text-2xl rounded-lg px-4 py-2.5 outline-none border ${theme === 'dark' ? 'bg-geo-black border-geo-border text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                  />

                  <div className="flex gap-2">
                    <button
                      id="gateway-pin-back"
                      onClick={() => setGatewayStep('wallet')}
                      className={`flex-1 py-3 text-xs rounded-lg cursor-pointer ${theme === 'dark' ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-500'}`}
                    >
                      {language === 'bn' ? 'নাম্বার বদলান' : 'Change No'}
                    </button>
                    <button
                      id="gateway-pin-submit"
                      onClick={handleMobileGatewaySubmit}
                      className={`flex-1 py-3 ${branding.bg} text-white rounded-lg text-xs font-bold shadow-lg cursor-pointer hover:opacity-90 transition-all`}
                    >
                      {language === 'bn' ? 'পেমেন্ট নিশ্চিত করুন' : 'Confirm & Authenticate'}
                    </button>
                  </div>
                </div>
              )}

              {gatewayStep === 'processing' && (
                <div className="py-8 space-y-4 text-center animate-pulse" id="gateway-processing-view">
                  <div className="w-12 h-12 rounded border-4 border-slate-800 border-t-geo-amber animate-spin mx-auto" />
                  <div>
                    <h4 className="font-bold text-sm text-slate-100 font-display">{language === 'bn' ? 'পেমেন্ট ভেরিফাই করা হচ্ছে...' : 'Verifying Digital Transaction...'}</h4>
                    <p className="text-[10px] text-slate-500 mt-1 uppercase font-mono tracking-wider">Dialing secure SSL gateway nodes</p>
                  </div>
                </div>
              )}

            </div>

            <div className={`p-4 border-t ${theme === 'dark' ? 'bg-geo-black border-geo-border' : 'bg-slate-50 border-slate-200'} text-[10px] text-slate-400 text-center uppercase tracking-widest font-bold`}>
              🔒 SSL Encrypted Checkout Handshake • MGBD Security
            </div>
          </div>
        )}

        {/* STEP 4: ORDER CONGRATULATIONS */}
        {step === 'completed' && (
          <div className="p-8 text-center space-y-5 animate-slide-up" id="checkout-completed-view">
            <div className={`w-16 h-16 ${theme === 'dark' ? 'bg-geo-amber/10 text-geo-amber border-geo-amber/20' : 'bg-green-100 text-green-600'} rounded-lg flex items-center justify-center mx-auto border animate-bounce`}>
              <Check className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h3 className={`text-xl font-display font-medium ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
                {language === 'bn' ? 'অভিনন্দন! আপনার অর্ডারটি সফল হয়েছে' : 'Thank You! Your order is placed'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                {language === 'bn' 
                  ? 'আপনার অর্ডার সেশন বুক করা হয়েছে। অবিলম্বে আমাদের কুরিয়ার টিম আপনার সাথে যোগাযোগ করবে এবং পণ্য পৌঁছানোর জন্য প্রস্তুত করবে।' 
                  : 'Your package is queued for assembly. Our delivery agent will contact you shortly to dispatch items directly.'}
              </p>
            </div>

            {/* Generated dummy Tracking ID information bar */}
            <div className={`p-4 rounded-lg border font-mono text-center ${theme === 'dark' ? 'bg-geo-black border-geo-border' : 'bg-slate-50 border-slate-200'}`}>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">{language === 'bn' ? 'অর্ডার ট্র্যাকিং আইডি' : 'ORDER TRACKING ID'}</p>
              <p className="text-geo-amber font-display font-bold block mt-1 tracking-wider text-base">MGBD-2026-X</p>
            </div>

            <button
              id="checkout-success-close-btn"
              onClick={onClose}
              className={`w-full py-3 ${theme === 'dark' ? 'bg-geo-amber hover:bg-geo-amber-hover text-geo-black' : 'bg-slate-900 text-white hover:bg-slate-850'} rounded-lg text-xs font-bold transition-colors shadow-lg cursor-pointer`}
            >
              {language === 'bn' ? 'অর্ডার ট্র্যাকিং পেজে যান' : 'Live Tracking Dashboard'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
