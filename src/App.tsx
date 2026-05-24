import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, PhoneCall, ShieldAlert, BadgeInfo, Check, MapPin, 
  Trash2, Star, Plus, Moon, Sun, Languages, Eye, UserCheck, 
  Sparkles, Calendar, PlusCircle, CheckCircle, Smartphone, SlidersHorizontal, Lock, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, Order, Review, Language, Theme, OrderStatus } from './types';
import GroomingChatbot from './components/GroomingChatbot';
import TrackingMap from './components/TrackingMap';
import CheckoutModal from './components/CheckoutModal';
import AdminPanel from './components/AdminPanel';

// Default initial catalog
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'minoxidil-1',
    nameBn: 'কিরকল্যান্ড মিনোক্সিডিল ৫% লিকুইড ( Kirkland Minoxidil 5% )',
    nameEn: 'Kirkland Minoxidil 5% Exra Strength Liquid (1 Bottle)',
    price: 1199,
    image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&q=80&w=600',
    descriptionBn: 'দাড়ি ও চুল গজানোর জন্য বিশ্বখ্যাত এবং চিকিৎসাবিজ্ঞানের একমাত্র লাইসেন্সকৃত বৈজ্ঞানিক সমাধান। প্রতি বোতলে ৬০ মিলি দ্রবণ থাকে যা ১ মাসের জন্য যথেষ্ট।',
    descriptionEn: 'The world-famous and only medically proven solution for beard and hair regrowth. Each bottle contains 60ml solution, sufficient for 1 month.',
    category: 'hair',
    inStock: true,
    rating: 4.8,
    reviewsCount: 142
  },
  {
    id: 'roller-1',
    nameBn: 'প্রিমিয়াম ডার্মারোলার ০.৫মিমি ( Premium Dermaroller 0.5mm )',
    nameEn: 'Premium Dermaroller 0.5mm Collagen stimulation',
    price: 450,
    image: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&q=80&w=600',
    descriptionBn: 'চুল ও দাড়ির স্ক্রিনে আলতো চাপে ম্যাসাজ করলে ৫৪০টি সুক্ষ্ম নিডল দ্বারা রক্ত সঞ্চালন বাড়ে এবং মিনোক্সিডিল শোষণ ক্ষমতা প্রায় ৩০০% বাড়িয়ে দেয়।',
    descriptionEn: 'Featuring 540 micro needles that stimulate collagen synthesis under the skin. Dramatically increases minoxidil absorption by up to 300%.',
    category: 'accessory',
    inStock: true,
    rating: 4.6,
    reviewsCount: 94
  },
  {
    id: 'combo-1',
    nameBn: 'সম্পূর্ণ হেয়ার এন্ড বিয়ার্ড গ্রোথ কম্বো ( 1 Minoxidil + 1 Dermaroller )',
    nameEn: 'Beard & Hair Growth Complete Combo Pack (Best Value)',
    price: 1500,
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=600',
    descriptionBn: 'দ্রুত এবং নিশ্চিত সমাধান পেতে আমাদের সবচেয়ে জনপ্রিয় কম্বো কিট। ১টি কিরকল্যান্ড মিনোক্সিডিল এবং ১টি ডার্মারোলার এক সাথে পাচ্ছেন বিশেষ ছাড়ে।',
    descriptionEn: 'Get our fast and most reliable combo kit. Includes 1 bottle of original Kirkland Minoxidil plus 1 Premium Dermaroller at supreme discounted price.',
    category: 'combo',
    inStock: true,
    rating: 4.9,
    reviewsCount: 310
  }
];

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    userName: 'মারুফ আহমেদ',
    rating: 5,
    commentBn: '৩ মাস নিয়মিত মিনোক্সিডিল আর ডার্মারোলার ব্যবহারের পর আমার দাড়ি গজিয়েছে! আমি অত্যন্ত খুশি পণ্যটির অরিজিনাল কোয়ালিটি পেয়ে।',
    commentEn: 'After 3 months of consistent use of Minoxidil + Dermaroller combo, my thick beard finally came! Extremely happy with Men\'s Grooming BD original imports.',
    date: '2026-05-18',
    isApproved: true
  },
  {
    id: 'rev-2',
    userName: 'শফিকুল ইসলাম',
    rating: 5,
    commentBn: 'মাথার সামনের অংশে নতুন বেবি হেয়ার গজাচ্ছে। ব্যবহার করা খুব সহজ। আর কুরিয়ারটি ডাকার বাইরে ২ দিনের ভেতরে হাতে পেয়েছি।',
    commentEn: 'Seeing excellent new baby hair regrowth on my scalp crown! Simple directions on use. Very prompt home delivery inside Gazipur within 2 days.',
    date: '2026-05-20',
    isApproved: true
  }
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'MGBD-2026-A1',
    customerName: 'সাজ্জাদ হোসেন',
    customerPhone: '01712345678',
    address: 'বাড়ি ৫, রোড ২, মিরপুর-১০, ঢাকা',
    area: 'inside',
    paymentMethod: 'bkash',
    paymentStatus: 'success',
    items: [{ productId: 'combo-1', quantity: 1, price: 1500 }],
    subtotal: 1500,
    deliveryCharge: 80,
    total: 1580,
    status: 'delivered',
    date: '2026-05-21T10:00:00Z',
    courierProgress: 100
  }
];

export default function App() {
  // Localization & Themes
  const [language, setLanguage] = useState<Language>('bn');
  const [theme, setTheme] = useState<Theme>('dark');
  
  // Storage loaded databases
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  
  // Layout routing selectors
  const [view, setView] = useState<'store' | 'tracking' | 'dashboard'>('store');
  const [adminOpen, setAdminOpen] = useState(false);

  // Cart indicators
  const [cart, setCart] = useState<{ productId: string; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);

  // Profile customization models
  const [profileName, setProfileName] = useState('কাস্টমার ইউজার');
  const [profilePhone, setProfilePhone] = useState('01606716918');
  const [profileTarget, setProfileTarget] = useState<'beard' | 'hair'>('beard');
  const [streakDays, setStreakDays] = useState<number>(5);
  // Usage checklist of treatment (e.g. Minos applied morning / night)
  const [todayMorningUsed, setTodayMorningUsed] = useState(true);
  const [todayNightUsed, setTodayNightUsed] = useState(false);

  // New review form
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');

  // Active Toast notifications array
  const [toasts, setToasts] = useState<{ id: string; msg: string; type: 'success' | 'info' | 'error' }[]>([]);
  
  // Real time offline connectivity indicator
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [offlineOrdersQueue, setOfflineOrdersQueue] = useState<any[]>([]);

  const subtotal = cart.reduce((acc, item) => {
    const prod = products.find(p => p.id === item.productId);
    return acc + (prod ? prod.price * item.quantity : 0);
  }, 0);

  // Sound and timing notification systems
  const addToast = (msg: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Watch network state
  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => {
      setIsOnline(true);
      addToast(language === 'bn' ? 'আপনি আবার অনলাইনে এসেছেন! ডিভাইস সিঙ্ক সম্পন্ন।' : 'Network connection restored. Sync complete.', 'success');
      // If any offline orders were cached, process or notify
      if (offlineOrdersQueue.length > 0) {
        addToast(
          language === 'bn' 
            ? `বকেয়া (${offlineOrdersQueue.length}) অর্ডার সফলভাবে সিঙ্ক করা হয়েছে` 
            : `Synced (${offlineOrdersQueue.length}) queued offline orders!`, 
          'success'
        );
        setOfflineOrdersQueue([]);
      }
    };
    const handleOffline = () => {
      setIsOnline(false);
      addToast(language === 'bn' ? 'অফলাইন মোড সক্রিয় করা হয়েছে! আপনি এখনও ভিজিট বা রিস্টোর করতে পারবেন।' : 'Device offline. Offline capabilities activated.', 'error');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [offlineOrdersQueue, language]);

  // Load from local Cache
  useEffect(() => {
    const cachedProducts = localStorage.getItem('mgbd_products');
    const cachedReviews = localStorage.getItem('mgbd_reviews');
    const cachedOrders = localStorage.getItem('mgbd_orders');
    
    if (cachedProducts) setProducts(JSON.parse(cachedProducts));
    if (cachedReviews) setReviews(JSON.parse(cachedReviews));
    if (cachedOrders) setOrders(JSON.parse(cachedOrders));
  }, []);

  // Sync cache changes
  const updateProductsCache = (updated: Product[]) => {
    setProducts(updated);
    localStorage.setItem('mgbd_products', JSON.stringify(updated));
  };
  const updateReviewsCache = (updated: Review[]) => {
    setReviews(updated);
    localStorage.setItem('mgbd_reviews', JSON.stringify(updated));
  };
  const updateOrdersCache = (updated: Order[]) => {
    setOrders(updated);
    localStorage.setItem('mgbd_orders', JSON.stringify(updated));
  };

  // Cart operations
  const handleAddToCart = (productId: string) => {
    const prod = products.find(p => p.id === productId);
    if (!prod || !prod.inStock) {
      addToast(language === 'bn' ? 'পণ্যটি স্টক শেষ!' : 'Product is out of stock', 'error');
      return;
    }
    
    setCart(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        addToast(
          language === 'bn' ? 'কার্টে পণ্যের সংখ্যা বৃদ্ধি করা হয়েছে!' : 'Quantity increased in shopping cart!', 
          'success'
        );
        return prev.map(item => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item);
      }
      addToast(
        language === 'bn' ? `${prod.nameBn} কার্টে যুক্ত করা হয়েছে!` : `${prod.nameEn} added to cart!`, 
        'success'
      );
      return [...prev, { productId, quantity: 1 }];
    });
  };

  const handleAddToCartAndCheckoutDirectly = (productId: string) => {
    // Empty cart and push this product, then trigger modal
    setCart([{ productId, quantity: 1 }]);
    setCheckoutModalOpen(true);
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
    addToast(language === 'bn' ? 'পণ্য কার্ট থেকে সরিয়ে ফেলা হয়েছে!' : 'Product removed from card.', 'info');
  };

  const handleUpdateCartQuantity = (productId: string, val: number) => {
    setCart(prev => prev.map(item => {
      if (item.productId === productId) {
        const nextQty = Math.max(1, item.quantity + val);
        return { ...item, quantity: nextQty };
      }
      return item;
    }));
  };

  // New review submission flow
  const handleNewReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) {
      addToast(language === 'bn' ? 'সবগুলো বিবরণ পূরণ করুন!' : 'Fill in all the review inputs!', 'error');
      return;
    }

    const reviewItem: Review = {
      id: 'rev-' + Date.now(),
      userName: newReviewName,
      rating: newReviewRating,
      commentBn: newReviewComment,
      commentEn: newReviewComment,
      date: new Date().toISOString().split('T')[0],
      isApproved: true, // Autoapprove for simulation and instant visual feedback
    };

    const nextReviews = [reviewItem, ...reviews];
    updateReviewsCache(nextReviews);
    setNewReviewName('');
    setNewReviewComment('');
    addToast(
      language === 'bn' ? 'আপনার মূল্যবান রিভিউ যুক্ত করা হয়েছে!' : 'Thank you for your testimonial review!',
      'success'
    );
  };

  // Checkout checkout modal success trigger
  const handleOrderSuccessHandler = (orderData: {
    customerName: string;
    customerPhone: string;
    address: string;
    area: 'inside' | 'outside';
    paymentMethod: 'bkash' | 'nagad' | 'rocket' | 'cod';
    paymentStatus: 'pending' | 'success';
    walletNumber?: string;
  }) => {
    const subtotal = cart.reduce((acc, item) => {
      const prod = products.find(p => p.id === item.productId);
      return acc + (prod ? prod.price * item.quantity : 0);
    }, 0);
    const deliveryCharge = orderData.area === 'inside' ? 80 : 150;
    const total = subtotal + deliveryCharge;

    const uniqueOrderId = `MGBD-2026-X${orders.length + 1}`;

    const newOrder: Order = {
      id: uniqueOrderId,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      address: orderData.address,
      area: orderData.area,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentStatus,
      paymentDetails: orderData.walletNumber ? { walletNumber: orderData.walletNumber } : undefined,
      items: [...cart.map(c => ({ productId: c.productId, quantity: c.quantity, price: products.find(p => p.id === c.productId)?.price || 0 }))],
      subtotal,
      deliveryCharge,
      total,
      status: 'confirmed',
      date: new Date().toISOString(),
      courierProgress: 15, // starts at 15% progress on live map
    };

    if (!isOnline) {
      // Offline fallback order queue mechanism
      setOfflineOrdersQueue(prev => [...prev, newOrder]);
      addToast(
        language === 'bn' 
          ? ' ডিভাইস বর্তমানে অফলাইনে। অর্ডার স্থানীয় কিউতে সেভ হয়েছে, অনলাইন ফিরে এলে সিঙ্ক হবে' 
          : 'Gained offline backup. Complete order cached into LocalSync nodes.',
        'info'
      );
    } else {
      const nextOrders = [newOrder, ...orders];
      updateOrdersCache(nextOrders);
      addToast(
        language === 'bn' ? 'আপনার অর্ডার কনফার্মড! লাইভ ট্র্যাক করতে পারেন।' : 'Order dispatched successfully!', 
        'success'
      );
    }

    setCart([]);
    setView('tracking');
  };

  // ADMIN OPERATIONS CALLS BONDED
  const handleAdminUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    // progress calculations
    let courierProgress = 15;
    if (status === 'confirmed') courierProgress = 30;
    if (status === 'packaging') courierProgress = 55;
    if (status === 'shipped') courierProgress = 80;
    if (status === 'delivered') courierProgress = 100;

    const updated = orders.map(o => o.id === orderId ? { ...o, status, courierProgress } : o);
    updateOrdersCache(updated);
    addToast(
      language === 'bn' ? `অর্ডারের স্থিতি পরিবর্তন হয়েছে: ${status}` : `Order status update dispatch: ${status}`,
      'info'
    );
  };

  const handleAdminAddProduct = (p: Omit<Product, 'id' | 'rating' | 'reviewsCount'>) => {
    const item: Product = {
      ...p,
      id: 'prod-' + Date.now(),
      rating: 5,
      reviewsCount: 1
    };
    updateProductsCache([item, ...products]);
  };

  const handleAdminDeleteProduct = (productId: string) => {
    updateProductsCache(products.filter(p => p.id !== productId));
  };

  const handleAdminToggleReviewApproval = (reviewId: string) => {
    updateReviewsCache(reviews.map(r => r.id === reviewId ? { ...r, isApproved: !r.isApproved } : r));
  };

  const handleAdminBackupDatabase = () => {
    const dbPayload = {
      products,
      reviews,
      orders,
      personalized: { profileName, profilePhone, streakDays }
    };
    
    const blob = new Blob([JSON.stringify(dbPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MensGroomingBD_DB_Backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    addToast(language === 'bn' ? 'ডাটাবেজ ব্যাকআপ ডাউনলোড সম্পূর্ণ!' : 'Database JSON stream exported successfully!', 'success');
  };

  const handleAdminRestoreDatabase = (jsonContent: string) => {
    try {
      const parsed = JSON.parse(jsonContent);
      if (parsed.products) updateProductsCache(parsed.products);
      if (parsed.reviews) updateReviewsCache(parsed.reviews);
      if (parsed.orders) updateOrdersCache(parsed.orders);
      if (parsed.personalized) {
        if (parsed.personalized.profileName) setProfileName(parsed.personalized.profileName);
        if (parsed.personalized.profilePhone) setProfilePhone(parsed.personalized.profilePhone);
        if (parsed.personalized.streakDays) setStreakDays(parsed.personalized.streakDays);
      }
    } catch (e) {
      addToast('Invalid restore file format.', 'error');
    }
  };

  const toggleTreatmentStreak = (time: 'morning' | 'night') => {
    if (time === 'morning') {
      const next = !todayMorningUsed;
      setTodayMorningUsed(next);
      if (next && todayNightUsed) setStreakDays(prev => prev + 1);
      if (!next && todayNightUsed) setStreakDays(prev => Math.max(0, prev - 1));
    } else {
      const next = !todayNightUsed;
      setTodayNightUsed(next);
      if (next && todayMorningUsed) setStreakDays(prev => prev + 1);
      if (!next && todayMorningUsed) setStreakDays(prev => Math.max(0, prev - 1));
    }
    addToast(
      language === 'bn' ? 'ব্যবহার রেকর্ড সফলভাবে আপডেট করা হয়েছে!' : 'Grooming application calendar status saved!',
      'success'
    );
  };

  // Get active order details (default most recent order)
  const activeOrderTrack = orders[0] || null;

  return (
    <div className={`min-h-screen font-sans ${theme === 'dark' ? 'bg-geo-black text-[#E4E4E7]' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Toast notifications container */}
      <div id="toast-wrapper-panel" className="fixed top-5 right-5 z-50 space-y-3 max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              id={`toast-card-${t.id}`}
              key={t.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              className={`p-4 rounded-xl shadow-2xl flex items-center gap-3 border pointer-events-auto ${
                t.type === 'success' 
                  ? 'bg-geo-card border-geo-amber/30 text-slate-100' 
                  : t.type === 'error'
                    ? 'bg-red-950/90 border-red-800 text-red-200'
                    : 'bg-geo-dark border-geo-border text-white'
              }`}
            >
              <Check className={`w-5 h-5 shrink-0 ${t.type === 'success' ? 'text-geo-amber' : t.type === 'error' ? 'text-red-500' : 'text-geo-amber'}`} />
              <p className="text-xs font-semibold leading-relaxed">{t.msg}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Offline Alert Strip */}
      {!isOnline && (
        <div id="offline-alert-strip" className="bg-amber-600 text-slate-950 px-4 py-2 text-xs font-bold flex items-center justify-center gap-2 text-center animate-pulse tracking-wide select-none">
          <ShieldAlert className="w-4 h-4" />
          <span>{language === 'bn' ? 'অফলাইন মোড চালিত: আপনি সিঙ্ক করা ডাটা উপভোগ করতে পারছেন।' : 'OFFLINE MODE DETECTED. ALL PLACED ORDERS WILL AUTOMATICALLY SYNC ON CONNECTIVITY RE-ESTABLISHED.'}</span>
        </div>
      )}

      {/* Navigation Header */}
      <header id="landing-master-header" className={`sticky top-0 z-40 border-b transition-colors ${theme === 'dark' ? 'bg-geo-dark border-geo-border' : 'bg-white border-slate-200'} py-4`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          
          {/* Branded elements */}
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${theme === 'dark' ? 'bg-geo-amber text-geo-black' : 'bg-slate-900 text-white'} rounded-lg flex items-center justify-center font-display font-black text-xl tracking-tight shadow-md select-none border border-white/5`}>
              M
            </div>
            <div>
              <h1 className={`font-display font-bold text-sm md:text-base tracking-tight ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'} flex items-center gap-1.5`}>
                Men's Grooming BD
                <span className={`text-[10px] ${theme === 'dark' ? 'bg-geo-amber/10 border-geo-amber/30 text-geo-amber' : 'bg-slate-100 border-slate-300 text-slate-700'} space-x-1 border font-mono px-1.5 py-0.2 rounded-md uppercase font-bold`}>ORIGINAL</span>
              </h1>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1.5 mt-0.5">
                <Smartphone className="w-3.5 h-3.5 text-geo-amber" />
                {language === 'bn' ? 'হটলাইন:' : 'Call Hotline:'} <span className={`font-bold underline ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>01606716918</span>
              </p>
            </div>
          </div>

          {/* Navigation options */}
          <nav className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-display">
            <button
              id="nav-store-btn"
              onClick={() => { setView('store'); setAdminOpen(false); }}
              className={`px-4 py-2 rounded-lg border transition-all cursor-pointer ${view === 'store' && !adminOpen ? (theme === 'dark' ? 'bg-geo-amber text-geo-black border-geo-amber/50 font-extrabold' : 'bg-slate-900 text-white border-slate-900') : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-white/5'}`}
            >
              {language === 'bn' ? 'মূল শপ' : 'Our Shop'}
            </button>
            <button
              id="nav-track-btn"
              onClick={() => { setView('tracking'); setAdminOpen(false); }}
              className={`px-4 py-2 rounded-lg border transition-all cursor-pointer ${view === 'tracking' && !adminOpen ? (theme === 'dark' ? 'bg-geo-amber text-geo-black border-geo-amber/50 font-extrabold' : 'bg-slate-900 text-white border-slate-900') : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-white/5'}`}
            >
              {language === 'bn' ? 'অর্ডার ট্র্যাক' : 'Track Order'}
            </button>
            <button
              id="nav-dash-btn"
              onClick={() => { setView('dashboard'); setAdminOpen(false); }}
              className={`px-4 py-2 rounded-lg border transition-all cursor-pointer ${view === 'dashboard' && !adminOpen ? (theme === 'dark' ? 'bg-geo-amber text-geo-black border-geo-amber/50 font-extrabold' : 'bg-slate-900 text-white border-slate-900') : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-white/5'}`}
            >
              {language === 'bn' ? 'পার্সোনাল হাব' : 'My Dashboard'}
            </button>
          </nav>

          {/* Settings trigger */}
          <div className="flex items-center gap-3">
            {/* Language toggle selector */}
            <button
              id="language-switch-btn"
              onClick={() => {
                const nextLang = language === 'bn' ? 'en' : 'bn';
                setLanguage(nextLang);
                addToast(nextLang === 'bn' ? 'বাংলা ভাষা নির্বাচন করা হয়েছে' : 'Language switched to English', 'info');
              }}
              className={`p-2.5 rounded-lg border ${theme === 'dark' ? 'border-geo-border bg-slate-900/40 text-slate-400 hover:text-slate-100' : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900'} transition-colors cursor-pointer`}
              title="Switch Language"
            >
              <Languages className="w-4 h-4" />
            </button>

            {/* Dark light theme selector */}
            <button
              id="theme-switch-btn"
              onClick={() => {
                const nextTheme = theme === 'dark' ? 'light' : 'dark';
                setTheme(nextTheme);
                addToast(nextTheme === 'dark' ? 'ডার্ক মোড সক্রিয় করা হয়েছে' : 'Light mode activated', 'info');
              }}
              className={`p-2.5 rounded-lg border ${theme === 'dark' ? 'border-geo-border bg-slate-900/40 text-slate-400 hover:text-slate-100' : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900'} transition-colors cursor-pointer`}
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-geo-amber" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Active Shopping bags triggers */}
            <button
              id="cart-trigger-top-btn"
              onClick={() => setIsCartOpen(true)}
              className={`relative p-2.5 rounded-lg ${theme === 'dark' ? 'bg-geo-amber text-geo-black hover:bg-geo-amber-hover border border-geo-amber/20' : 'bg-slate-900 text-white hover:bg-slate-800'} cursor-pointer transition-colors shadow-lg`}
            >
              <ShoppingBag className="w-4 h-4" />
              {cart.reduce((a, b) => a + b.quantity, 0) > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white font-extrabold text-[10px] flex items-center justify-center animate-bounce font-mono">
                  {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
              )}
            </button>

            {/* Top Secure Admin lock trigger */}
            <button
              id="admin-top-panel-lock-toggle"
              onClick={() => setAdminOpen(!adminOpen)}
              className={`p-2.5 rounded-lg text-xs font-bold tracking-wide transition-colors cursor-pointer ${
                adminOpen 
                  ? 'bg-geo-amber text-geo-black border border-geo-amber shadow-md' 
                  : (theme === 'dark' ? 'border border-geo-border bg-slate-900/40 text-slate-400 hover:text-slate-100' : 'border border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900')
              }`}
              title="Toggle Admin Control"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* Hero Header Presentation (Inside Store view) */}
      {view === 'store' && !adminOpen && (
        <section id="store-hero-showcase" className={`relative p-8 md:py-16 text-center max-w-7xl mx-auto px-4 ${theme === 'dark' ? 'bg-geo-dark border border-geo-border' : 'bg-white border border-slate-200'} rounded-xl mt-6 overflow-hidden`}>
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.04)_0,transparent_100%)]" />
          
          <div className="space-y-4 max-w-3xl mx-auto">
            <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 ${theme === 'dark' ? 'bg-geo-amber/10 border border-geo-amber/20 text-geo-amber' : 'bg-slate-100 border border-slate-200 text-slate-700'} rounded-md text-xs font-bold font-display tracking-widest uppercase select-none animate-pulse`}>
              <Sparkles className="w-3.5 h-3.5" />
              {language === 'bn' ? '১০০% কার্যকর ও বৈজ্ঞানিক হেয়ার সল্যুশন' : 'Imported Scientific Kirkland Formula'}
            </span>
            
            <h2 className={`text-3xl md:text-5xl font-display font-medium tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'} leading-[1.12]\`}`}>
              {language === 'bn' ? (
                <>চুল পড়া ও দাড়ি গজানোর সমস্যা? <br />আমাদের <span className="text-geo-amber underline decoration-wavy decoration-geo-amber/40">বিজ্ঞানসম্মত মিনোক্সিডিলই</span> একমাত্র কার্যকারী সমাধান!</>
              ) : (
                <>Beard and Hair Loss Struggles? <br />Our <span className="text-geo-amber underline decoration-wavy decoration-geo-amber/40">Verified Kirkland Minoxidil</span> is the Answer!</>
              )}
            </h2>
            
            <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
              {language === 'bn' 
                ? 'আমেরিকা থেকে সরাসরি আমদানিকৃত ১০০% অরিজিনাল কিরকল্যান্ড মিনোক্সিডিল ৫% এবং প্রিমিয়াম ডার্মারোলার দিয়ে ঘরে বসেই গজিয়ে তুলুন ঘন সুবিন্যস্ত চুল ও দাড়ি।' 
                : 'Accelerate follicles blood circulation, stimulate collagen and opening absorption pathways in under 3 months with original imports.'}
            </p>

            <div className="pt-4 flex flex-col md:flex-row items-center justify-center gap-3 font-semibold text-xs py-3">
              <a 
                href={`tel:01606716918`}
                className={`w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 border ${theme === 'dark' ? 'border-geo-amber/30 bg-geo-dark hover:bg-white/5 text-geo-amber' : 'border-slate-300 bg-slate-50 text-slate-705'} rounded-md shadow-lg transition-all`}
              >
                <PhoneCall className="w-4 h-4 animate-bounce" />
                {language === 'bn' ? 'সরাসরি ফোন করুন: 01606716918' : 'Call Dispatcher: 01606716918'}
              </a>

              <button
                id="hero-scroll-combo-btn"
                onClick={() => handleAddToCartAndCheckoutDirectly('combo-1')}
                className={`w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 ${theme === 'dark' ? 'bg-geo-amber hover:bg-geo-amber-hover text-geo-black' : 'bg-slate-900 hover:bg-slate-850 text-white'} rounded-md shadow-xl cursor-pointer font-bold transition-all`}
              >
                {language === 'bn' ? 'বিজ্ঞানসম্মত কম্বো প্যাক কিনুন (৳১,৫০০)' : 'Buy Scientific Growth Combo Pack (৳1,500)'}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Main body content section wrapper */}
      <main className="max-w-7xl mx-auto px-4 pb-20">

        {/* ADMIN CONTROLLER CONDITIONAL OVERLAY */}
        {adminOpen && (
          <div id="admin-panel-envelop" className="py-4 animate-scale-up">
            <AdminPanel
              language={language}
              theme={theme}
              products={products}
              orders={orders}
              reviews={reviews}
              onUpdateOrderStatus={handleAdminUpdateOrderStatus}
              onAddProduct={handleAdminAddProduct}
              onDeleteProduct={handleAdminDeleteProduct}
              onToggleReviewApproval={handleAdminToggleReviewApproval}
              onBackupDatabase={handleAdminBackupDatabase}
              onRestoreDatabase={handleAdminRestoreDatabase}
              addToast={addToast}
            />
          </div>
        )}

        {/* VIEWS SELECTION: 1 - STORE CATALOG VIEW */}
        {view === 'store' && !adminOpen && (
          <div className="space-y-12">
            
            {/* Products container */}
            <div id="store-products-showcase" className="space-y-6 pt-6">
              <div className={`border-b ${theme === 'dark' ? 'border-geo-border' : 'border-slate-200'} pb-4`}>
                <h3 className={`text-xl font-display font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
                  <ShoppingBag className="w-5 h-5 text-geo-amber" />
                  {language === 'bn' ? 'আমাদের অত্যন্ত কার্যকরী পণ্যসমূহ' : 'Highly Optimized Regrowth Formulas'}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {language === 'bn' 
                    ? 'চুল পড়া রোধ এবং দাড়ি গজানোর সকল কার্যকরী উপকরণ এক নজরে দেখে নিন।' 
                    : 'Check detailed description and apply to carts instantly.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.filter(p => p.inStock).map((prod) => (
                  <div 
                    id={`product-show-card-${prod.id}`}
                    key={prod.id} 
                    className={`group rounded-xl border ${theme === 'dark' ? 'border-geo-border bg-geo-card hover:border-geo-amber/50' : 'border-slate-200 bg-white hover:border-slate-400'} overflow-hidden flex flex-col justify-between transition-all p-5 shadow-lg relative`}
                  >
                    <div>
                      {/* Product image container */}
                      <div className="relative rounded-lg overflow-hidden aspect-video border border-white/5 mb-4 shrink-0 bg-slate-950">
                        <img 
                          src={prod.image} 
                          alt={prod.nameEn} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        
                        <div className={`absolute top-3 left-3 bg-geo-black/95 px-2.5 py-1 rounded text-[10px] ${theme === 'dark' ? 'text-geo-amber' : 'text-amber-500'} font-bold border border-white/10 uppercase tracking-widest font-display`}>
                          {prod.category === 'combo' ? (language === 'bn' ? 'বিশেষ ছাড় প্যাক' : 'Combo Pack') : (language === 'bn' ? 'অরিজিনাল সল্যুশন' : 'Verified Solution')}
                        </div>
                      </div>

                      {/* Title & Desc */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400 text-xs">{"★".repeat(Math.round(prod.rating))}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({prod.reviewsCount})</span>
                        </div>
                        
                        <h4 className={`font-display font-bold text-sm ${theme === 'dark' ? 'text-slate-100 group-hover:text-geo-amber' : 'text-slate-900 group-hover:text-amber-600'} transition-colors`}>
                          {language === 'bn' ? prod.nameBn : prod.nameEn}
                        </h4>
                        
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {language === 'bn' ? prod.descriptionBn : prod.descriptionEn}
                        </p>
                      </div>
                    </div>

                    <div className={`pt-5 border-t ${theme === 'dark' ? 'border-geo-border' : 'border-slate-100'} mt-5 flex items-center justify-between`}>
                      <span className={`text-lg font-bold ${theme === 'dark' ? 'text-geo-amber' : 'text-slate-900'} font-mono`}>৳{prod.price}</span>
                      
                      <div className="flex items-center gap-2">
                        <button
                          id={`product-${prod.id}-cart-add-btn`}
                          onClick={() => handleAddToCart(prod.id)}
                          className={`px-3 py-2 border ${theme === 'dark' ? 'border-zinc-700 hover:border-zinc-500 text-slate-300 hover:bg-white/5' : 'border-slate-300 hover:bg-slate-50 text-slate-700'} rounded-lg text-xs font-bold transition-all cursor-pointer`}
                        >
                          {language === 'bn' ? 'কার্টে রাখুন' : 'Add to Cart'}
                        </button>
                        
                        <button
                          id={`product-${prod.id}-buy-now-btn`}
                          onClick={() => handleAddToCartAndCheckoutDirectly(prod.id)}
                          className={`px-4 py-2 ${theme === 'dark' ? 'bg-geo-amber hover:bg-geo-amber-hover text-geo-black' : 'bg-slate-900 hover:bg-slate-850 text-white'} rounded-lg text-xs font-bold transition-all cursor-pointer`}
                        >
                          {language === 'bn' ? 'সরাসরি কিনুন' : 'Order Now'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Scientific Guide Explaining Section */}
            <section id="scientific-minoxidil-mechanism" className={`p-6 md:p-8 rounded-xl border ${theme === 'dark' ? 'border-geo-border bg-geo-dark' : 'border-slate-200 bg-white shadow-sm'} grid grid-cols-1 md:grid-cols-2 gap-6 items-center`}>
              <div>
                <span className={`text-[10px] ${theme === 'dark' ? 'text-geo-amber' : 'text-amber-600'} font-bold uppercase tracking-widest font-display`}>SCIENCE GUIDES US • HOW IT WORKS</span>
                <h4 className={`text-xl md:text-2xl font-display font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mt-1`}>
                  {language === 'bn' ? 'মিনোক্সিডিল এবং ডার্মারোলার কেন একসাথে ব্যবহার করবেন?' : 'Combining Minoxidil & Dermaroller?'}
                </h4>
                
                <ul className="text-xs text-slate-400 mt-4 space-y-3 leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-geo-amber shrink-0 mt-0.5" />
                    <span><b>{language === 'bn' ? 'ফলিকল রক্তপ্রবাহ বৃদ্ধি:' : 'Expanding Vasodilation:'}</b> {language === 'bn' ? 'মিনোক্সিডিল চুলের গোড়ায় ক্ষুদ্র রক্তনালী প্রসারিত করে কোষগুলোতে পুষ্টি ও অক্সিজেনের প্রবাহ ত্বরান্বিত করে।' : 'Minoxidil dilates microblood vessels around shrunken beard/scalp follicles.'}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-geo-amber shrink-0 mt-0.5" />
                    <span><b>{language === 'bn' ? 'কোলাজেন এবং নিউ চ্যানেল তৈরি:' : 'Stimulating Collagen Channels:'}</b> {language === 'bn' ? 'ডার্মারোলারের সুক্ষ্ম নিডল ত্বকের ওপর ম্যাসাজ করলে প্রাকৃতিক হিলিং প্রতিক্রিয়া কোলাজেন সিন্থেসিস বাড়িয়ে দেয়।' : 'Dermaroller creates 540 microscopic micro-punctures, triggers skin restorative cycles.'}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-geo-amber shrink-0 mt-0.5" />
                    <span><b>{language === 'bn' ? '৩০০% পর্যন্ত উচ্চ শোষণ ক্ষমতা:' : '3X Absorption Integration:'}</b> {language === 'bn' ? 'ডার্মারোলার ব্যবহারের পর মিনোক্সিডিল লাগালে তরল উপাদান চামড়ার ৩ গুণ গভীরে প্রবেশ করে দ্রুত চুল পড়া বন্ধ করতে ও নতুন দাড়ি গজাতে সাহায্য করে।' : 'Opening routes allows Minoxidil liquids to enter much deeper into the hair cells.'}</span>
                  </li>
                </ul>
              </div>
              
              <div className={`space-y-4 ${theme === 'dark' ? 'bg-geo-black' : 'bg-slate-50'} p-5 rounded-lg border ${theme === 'dark' ? 'border-geo-border' : 'border-slate-205'} text-xs`}>
                <h5 className={`font-bold font-display ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'} flex items-center gap-1.5 border-b ${theme === 'dark' ? 'border-geo-border' : 'border-slate-200'} pb-2`}>
                  <Calendar className="w-4 h-4 text-geo-amber" />
                  {language === 'bn' ? 'অরিজিনাল ব্যবহারের সঠিক সাপ্তাহিক রুটিন:' : 'Weekly Treatment Recommended Schedule'}
                </h5>
                <div className="space-y-3 pt-1">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-300">১. {language === 'bn' ? 'মিনোক্সিডিল প্রয়োগ:' : 'Minoxidil application'}</span>
                    <span className="text-slate-400 text-right">{language === 'bn' ? 'প্রতিদিন ২ বার (সকাল-রাত) শুষ্ক স্থানে ১ মিলি করে' : 'Every morning & evening 1ml'}</span>
                  </div>
                  <div className="flex justify-between items-start border-t border-geo-border/50 pt-2">
                    <span className="font-bold text-slate-300">২. {language === 'bn' ? 'ডার্মারোলার ব্যবহার:' : 'Dermaroller massage'}</span>
                    <span className="text-slate-400 text-right">{language === 'bn' ? 'সপ্তাহে ২-৩ দিন রাতে, ব্যবহারের আগে হালকা চাপে ৫ মিনিট' : '2-3 nights a week, lightly roll before minox'}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Testimonials customer reviews sections */}
            <section id="testimonials-reviews-center" className="space-y-6">
              
              <div className={`border-b ${theme === 'dark' ? 'border-geo-border' : 'border-slate-200'} pb-4`}>
                <h3 className={`text-lg font-display font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  {language === 'bn' ? 'সন্তুষ্ট গ্রাহকদের লাইভ রিভিউ' : 'Original Customer Feedbacks'}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {language === 'bn' 
                    ? 'তানা ৩ মাস ব্যবহারে যারা নিশ্চিত ফলাফল পেয়েছেন তাদের সৎ মতামত।' 
                    : 'Authentic success reports from verified grooming users.'}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                
                {/* Form to submit review */}
                <form 
                  id="submit-review-form"
                  onSubmit={handleNewReviewSubmit} 
                  className={`p-5 rounded-xl border ${theme === 'dark' ? 'border-geo-border bg-geo-card' : 'border-slate-200 bg-white shadow-sm'} space-y-4`}
                >
                  <h4 className={`font-display font-bold text-sm ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
                    {language === 'bn' ? 'আপনার মতামত আমাদের জানান:' : 'Share Your Regrowth Review'}
                  </h4>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1 font-bold">নাম</label>
                      <input
                        id="review-name-input"
                        type="text"
                        required
                        value={newReviewName}
                        onChange={(e) => setNewReviewName(e.target.value)}
                        placeholder={language === 'bn' ? 'উদা: মোঃ সজীব' : 'Sajeeb Ahmed'}
                        className={`w-full rounded-lg px-4 py-2 ${theme === 'dark' ? 'bg-geo-black border-geo-border text-white focus:border-geo-amber' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500'} outline-none`}
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-bold">রেটিং</label>
                      <select
                        id="review-rating-select"
                        value={newReviewRating}
                        onChange={(e) => setNewReviewRating(Number(e.target.value))}
                        className={`w-full rounded-lg px-4 py-2 ${theme === 'dark' ? 'bg-geo-black border-geo-border text-white focus:border-geo-amber' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500'} outline-none`}
                      >
                        <option value={5}>★★★★★ (5/5)</option>
                        <option value={4}>★★★★☆ (4/5)</option>
                        <option value={3}>★★★☆☆ (3/5)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-bold">কমেন্ট</label>
                      <textarea
                        id="review-comment-textarea"
                        required
                        rows={3}
                        value={newReviewComment}
                        onChange={(e) => setNewReviewComment(e.target.value)}
                        placeholder={language === 'bn' ? 'ব্যবহার করে আপনার মতামত সংক্ষেপে লিখুন...' : 'Write your results comments...'}
                        className={`w-full rounded-lg px-4 py-2 ${theme === 'dark' ? 'bg-geo-black border-geo-border text-white focus:border-geo-amber' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500'} outline-none`}
                      />
                    </div>
                  </div>

                  <button
                    id="submit-review-btn"
                    type="submit"
                    className={`w-full py-2.5 ${theme === 'dark' ? 'bg-geo-amber hover:bg-geo-amber-hover text-geo-black' : 'bg-slate-900 hover:bg-slate-850 text-white'} rounded-lg text-xs font-bold transition-all cursor-pointer`}
                  >
                    {language === 'bn' ? 'রিভিউ সাবমিট করুন' : 'Submit Review'}
                  </button>
                </form>

                {/* List of reviews */}
                <div className="lg:col-span-2 space-y-4">
                  {reviews.filter(r => r.isApproved).map((rev) => (
                    <div 
                      id={`customer-review-${rev.id}`}
                      key={rev.id} 
                      className={`p-5 rounded-xl border ${theme === 'dark' ? 'border-geo-border bg-geo-card' : 'border-slate-200 bg-white/80'} flex gap-4`}
                    >
                      <div className={`w-10 h-10 ${theme === 'dark' ? 'bg-geo-black text-geo-amber border border-geo-border' : 'bg-slate-150 text-slate-800'} rounded-lg flex items-center justify-center font-display font-black text-sm uppercase shrink-0`}>
                        {rev.userName[0]}
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h5 className={`font-bold text-xs ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{rev.userName}</h5>
                          <div className="flex text-yellow-400 font-mono text-xs">{"★".repeat(rev.rating)}</div>
                          <span className="text-[9px] text-slate-500 font-mono">({rev.date})</span>
                        </div>
                        
                        <p className="text-xs text-slate-400 leading-relaxed italic">
                          "{language === 'bn' ? rev.commentBn : rev.commentEn}"
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </section>

          </div>
        )}

        {/* VIEWS SELECTION: 2 - ORDER LIVE DISPATCH TRACKING VIEW */}
        {view === 'tracking' && !adminOpen && (
          <div className="space-y-8 animate-fade-in max-w-4xl mx-auto pt-6">
            
            {/* Header tracking section */}
            <div className={`border-b ${theme === 'dark' ? 'border-geo-border' : 'border-slate-200'} pb-4`}>
              <h3 className={`text-xl font-display font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {language === 'bn' ? 'রিয়েল-টাইম অর্ডার ট্র্যাকিং উইং' : 'Dynamic Order Dispatch Dashboard'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {language === 'bn' 
                  ? 'আপনার সক্রিয় বা শেষ অর্ডারের কুরিয়ারের অবস্থান এবং গন্তব্য ম্যাপ।' 
                  : 'Look up live courier scooter positions towards your geographic target.'}
              </p>
            </div>

            {activeOrderTrack ? (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                
                {/* Timeline status list left */}
                <div className={`lg:col-span-2 space-y-4 ${theme === 'dark' ? 'bg-geo-card border-geo-border' : 'bg-white border-slate-200 shadow-sm'} p-5 rounded-xl border h-max`}>
                  <h4 className="font-bold text-xs text-slate-300 uppercase tracking-widest font-display mb-2">
                    {language === 'bn' ? 'ডেলিভারির সর্বশেষ আপডেট' : 'Dispatch Milestones Status'}
                  </h4>

                  <div className="relative border-l border-geo-border pl-4 ml-2 space-y-4 text-xs">
                    
                    {/* Received step */}
                    <div className="relative">
                      <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-md ${
                        ['confirmed', 'packaging', 'shipped', 'delivered'].includes(activeOrderTrack.status) ? 'bg-geo-amber' : 'bg-slate-700'
                      }`} />
                      <h5 className="font-bold text-slate-200">{language === 'bn' ? '১. অর্ডার নিশ্চিত করা হয়েছে' : '1. Order Confirmed'}</h5>
                      <p className="text-[10px] text-slate-500 leading-normal">{language === 'bn' ? 'মেনস গ্রুমিং টিম আপনার অর্ডার পেয়েছেন।' : 'Package catalog successfully approved.'}</p>
                    </div>

                    {/* Packaged step */}
                    <div className="relative">
                      <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-md ${
                        ['packaging', 'shipped', 'delivered'].includes(activeOrderTrack.status) ? 'bg-geo-amber font-bold' : 'bg-slate-700'
                      }`} />
                      <h5 className="font-bold text-slate-200">{language === 'bn' ? '২. প্যাকেজিং সম্পন্ন' : '2. Quality Package Checks'}</h5>
                      <p className="text-[10px] text-slate-500 leading-normal">{language === 'bn' ? 'অরিজিনাল মিনোক্সিডিল ও ডার্মারোলার প্যাক করা হচ্ছে।' : 'Assembled with secure security patches.'}</p>
                    </div>

                    {/* Shipped step */}
                    <div className="relative">
                      <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-md ${
                        ['shipped', 'delivered'].includes(activeOrderTrack.status) ? 'bg-geo-amber' : 'bg-slate-700 animate-ping'
                      }`} />
                      <h5 className="font-bold text-slate-200">{language === 'bn' ? '৩. ডেলিভারি পথে রয়েছে' : '3. Transiting on Road'}</h5>
                      <p className="text-[10px] text-slate-500 leading-normal">{language === 'bn' ? 'কুরিয়ার রাইডার আপনার ঠিকানায় আসছে।' : 'Courier rider dispatched in Dhaka corridor.'}</p>
                    </div>

                    {/* Delivered step */}
                    <div className="relative">
                      <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-md ${
                        activeOrderTrack.status === 'delivered' ? 'bg-geo-amber' : 'bg-slate-700'
                      }`} />
                      <h5 className="font-bold text-slate-200">{language === 'bn' ? '৪. ডেলিভারি সম্পন্ন' : '4. Arrived Hand Delivered'}</h5>
                      <p className="text-[10px] text-slate-500 leading-normal">{language === 'bn' ? 'পণ্য আপনার হাতে হস্তান্তর করা হয়েছে।' : 'Success package collection completed.'}</p>
                    </div>

                  </div>
                </div>

                {/* Right Interactive Maps Panel */}
                <div className="lg:col-span-3">
                  <TrackingMap
                    language={language}
                    theme={theme}
                    customerName={activeOrderTrack.customerName}
                    customerArea={activeOrderTrack.area}
                    courierProgress={activeOrderTrack.courierProgress || 15}
                  />
                </div>

              </div>
            ) : (
              <div className="text-center py-20 border border-dashed border-zinc-800 rounded-xl text-slate-400">
                <ShoppingBag className="w-16 h-16 text-zinc-800 mx-auto mb-4" />
                <h4 className="font-bold text-slate-300 font-display">{language === 'bn' ? 'কোনো সক্রিয় অর্ডার পাওয়া যায়নি!' : 'No tracking orders found!'}</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">{language === 'bn' ? 'মূল শপ থেকে একটি অর্ডার সম্পূর্ণ করা হলে এখানে রিয়েল-টাইম ট্র্যাকিং দৃশ্যমান হবে।' : 'Complete checkouts from shop catalog to visualize route status.'}</p>
                <button
                  id="go-back-shopping-btn"
                  onClick={() => setView('store')}
                  className={`mt-4 px-5 py-2 ${theme === 'dark' ? 'bg-geo-amber hover:bg-geo-amber-hover text-geo-black' : 'bg-slate-900 text-white hover:bg-slate-850'} rounded-lg text-xs font-bold font-mono cursor-pointer transition-all`}
                >
                  {language === 'bn' ? 'শপিং শুরু করুন' : 'Start Shopping'}
                </button>
              </div>
            )}

          </div>
        )}

        {/* VIEWS SELECTION: 3 - PERSONALIZED CLIENT HABIT DASHBOARD VIEW */}
        {view === 'dashboard' && !adminOpen && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in text-xs leading-relaxed pt-6">
            
            {/* Header section */}
            <div className={`border-b ${theme === 'dark' ? 'border-geo-border' : 'border-slate-200'} pb-4`}>
              <h3 className={`text-xl font-display font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
                <UserCheck className="w-5 h-5 text-geo-amber" />
                {language === 'bn' ? 'পার্সোনালাইজড গ্রুমিং ড্যাশবোর্ড' : 'Personal Grooming & Streaks Planner'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {language === 'bn' 
                  ? 'আপনার দাড়ি ও হরমোনাল হেয়ার কেয়ারের দৈনিক রুটিন এবং অগ্রগতি ট্র্যাকার।' 
                  : 'Track your daily consistency, monitor Minoxidil treatment habits streaks.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Profile Config panel */}
              <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'border-geo-border bg-geo-card' : 'border-slate-200 bg-white shadow-sm'} space-y-4`}>
                <h4 className={`font-display font-bold text-sm ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'} flex items-center gap-1.5 mb-1`}>
                  <SlidersHorizontal className="w-4 h-4 text-geo-amber" />
                  {language === 'bn' ? 'আপনার গ্রুমিং প্রোফাইল' : 'My Treatment Profile'}
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">গ্রাহকের নাম:</label>
                    <input
                      id="profile-name-input"
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className={`w-full rounded-lg px-4 py-2 border ${theme === 'dark' ? 'bg-geo-black border-geo-border text-white focus:border-geo-amber' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500'} outline-none font-semibold`}
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1">লক্ষ্য নির্ধারণ (Target Focus):</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        id="profile-beard-target-btn"
                        onClick={() => setProfileTarget('beard')}
                        className={`p-2 rounded-lg border text-center font-bold tracking-wider font-display text-[11px] transition-all ${profileTarget === 'beard' ? (theme === 'dark' ? 'border-geo-amber text-geo-amber bg-geo-amber/5' : 'border-amber-500 text-amber-600 bg-amber-50/50') : (theme === 'dark' ? 'border-zinc-800 text-slate-500 hover:border-zinc-700' : 'border-slate-200 text-slate-400 hover:border-slate-300')}`}
                      >
                        {language === 'bn' ? 'দাড়ি গজানো (Beard)' : 'Beard Regrowth'}
                      </button>
                      <button
                        id="profile-hair-target-btn"
                        onClick={() => setProfileTarget('hair')}
                        className={`p-2 rounded-lg border text-center font-bold tracking-wider font-display text-[11px] transition-all ${profileTarget === 'hair' ? (theme === 'dark' ? 'border-geo-amber text-geo-amber bg-geo-amber/5' : 'border-amber-500 text-amber-600 bg-amber-50/50') : (theme === 'dark' ? 'border-zinc-800 text-slate-500 hover:border-zinc-700' : 'border-slate-200 text-slate-400 hover:border-slate-300')}`}
                      >
                        {language === 'bn' ? 'চুল গজানো (Hair)' : 'Hair Regrowth'}
                      </button>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg border text-xs ${theme === 'dark' ? 'bg-geo-black/40 border-geo-border' : 'bg-amber-50/40 border-amber-200/50'} space-y-1 block leading-normal`}>
                    <p className={`font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>🔍 {language === 'bn' ? 'বিয়ার্ড এক্সপার্ট টিপস:' : 'Consultant Tip:'}</p>
                    <p className="text-[11px] text-slate-400">
                      {profileTarget === 'beard' 
                        ? (language === 'bn' ? 'মিনোক্সিডিল প্রয়োগের ২০ মিনিট আগে আলতোভাবে ফেস ডার্মারোলার দিয়ে ০.৫মিমি ম্যাসাজ করুন। সপ্তাহে ৩ দিনের বেশি রোলিং প্র্যাকটিস করবেন না।' : 'Keep your beard moisturized with jojoba oil to avoid minor dryness.')
                        : (language === 'bn' ? 'চুলের মাথায় কিরকল্যান্ড ব্যবহারের ৪ ঘণ্টার মধ্যে শ্যাম্পু বা ওয়াশ করবেন না। সকালে ড্রপার দিয়ে ১ মিলি ব্যবহার করুন।' : 'Do not wash scalp for at least 4 hours after minox drops.')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Consistency streaks tracking calendar */}
              <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'border-geo-border bg-geo-card' : 'border-slate-200 bg-white shadow-sm'} space-y-4`}>
                <div className="flex items-center justify-between">
                  <h4 className={`font-display font-bold text-sm ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'} flex items-center gap-1.5`}>
                    <Calendar className="w-4 h-4 text-geo-amber" />
                    {language === 'bn' ? 'ট্রিটমেন্ট ধারাবাহিকতা রেকর্ড' : 'Daily Streak Counter'}
                  </h4>
                  <span className={`text-[10px] ${theme === 'dark' ? 'text-geo-amber bg-geo-amber/10' : 'text-amber-700 bg-amber-50'} px-2 py-0.5 rounded font-bold`}>
                    {streakDays} {language === 'bn' ? 'দিনের রেকর্ড!' : 'Days Streak'}
                  </span>
                </div>

                <div className={`p-4 ${theme === 'dark' ? 'bg-geo-black' : 'bg-slate-50'} rounded-lg text-center space-y-2`}>
                  <h6 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                    {language === 'bn' ? 'টানা ব্যবহারের ধারাবাহিকতা স্কোর' : 'Consistency Level'}
                  </h6>
                  <p className="text-3xl font-extrabold text-geo-amber font-mono tracking-tight">{streakDays} 🔥</p>
                  <p className="text-[10px] text-slate-400 leading-normal">{language === 'bn' ? 'মিনোক্সিডিল লাগানোর রেকর্ড ধরে রাখুন।' : 'Consistency is strictly key to results!'}</p>
                </div>

                {/* Treatment morning night switches */}
                <div className="space-y-3">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">
                    {language === 'bn' ? 'আজকের ব্যবহার চেক (Today Application Log)' : 'Today Application Checklist'}
                  </p>

                  <div className={`flex items-center justify-between p-3 rounded-lg ${theme === 'dark' ? 'bg-geo-black/40 border-geo-border' : 'bg-slate-50 border-slate-205'}`}>
                    <div>
                      <p className={`font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{language === 'bn' ? 'সকালের ডোজ (Morning - 1ml)' : 'Morning Dose (1ml)'}</p>
                      <p className="text-[10px] text-slate-500">{language === 'bn' ? 'শুষ্ক চামড়ায় লাগিয়েছেন?' : 'Applied on dry surface?'}</p>
                    </div>
                    <button
                      id="streak-morning-toggle-btn"
                      onClick={() => toggleTreatmentStreak('morning')}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                        todayMorningUsed 
                          ? 'bg-geo-amber text-geo-black' 
                          : (theme === 'dark' ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-200 text-slate-600 hover:bg-slate-300')
                      }`}
                    >
                      {todayMorningUsed ? (language === 'bn' ? '✓ সম্পন্ন' : '✓ Done') : (language === 'bn' ? '⏳ বাকি আছে' : '⏳ Pending')}
                    </button>
                  </div>

                  <div className={`flex items-center justify-between p-3 rounded-lg ${theme === 'dark' ? 'bg-geo-black/40 border-geo-border' : 'bg-slate-50 border-slate-205'}`}>
                    <div>
                      <p className={`font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{language === 'bn' ? 'রাতের ডোজ (Night - 1ml)' : 'Night Dose (1ml)'}</p>
                      <p className="text-[10px] text-slate-500">{language === 'bn' ? 'ঘুমোনোর ১ ঘণ্টা আগে লাগিয়েছেন?' : 'Applied 1 hour before sleep?'}</p>
                    </div>
                    <button
                      id="streak-night-toggle-btn"
                      onClick={() => toggleTreatmentStreak('night')}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                        todayNightUsed 
                          ? 'bg-geo-amber text-geo-black' 
                          : (theme === 'dark' ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-200 text-slate-600 hover:bg-slate-300')
                      }`}
                    >
                      {todayNightUsed ? (language === 'bn' ? '✓ সম্পন্ন' : '✓ Done') : (language === 'bn' ? '⏳ বাকি আছে' : '⏳ Pending')}
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </main>

      {/* FLOATING AI CONSULTATION CHATBOT WIDGET */}
      <GroomingChatbot
        language={language}
        theme={theme}
        onAddToCartDirectly={handleAddToCartAndCheckoutDirectly}
        phoneNumber="01606716918"
      />

      {/* INVENTIVE DESIGNS: SHOPPING CART SLIDE OVER DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <div id="cart-drawer-overlay-blur" className="fixed inset-0 bg-slate-950/80 z-50 flex justify-end backdrop-blur-xs font-sans">
            <motion.div
              id="cart-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className={`w-96 max-w-full h-full flex flex-col justify-between ${
                theme === 'dark' ? 'bg-geo-dark text-slate-100 border-l border-geo-border' : 'bg-white text-slate-800'
              }`}
            >
              <div className={`p-6 border-b ${theme === 'dark' ? 'border-geo-border' : 'border-slate-100'} flex items-center justify-between`}>
                <h3 className="font-bold text-xs uppercase tracking-widest font-display text-slate-400">
                  {language === 'bn' ? 'আপনার বাজার তালিকা' : 'Shopping Cart Drawer'}
                </h3>
                <button
                  id="cart-close-btn"
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/5"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-20 text-slate-400">
                    <ShoppingBag className="w-12 h-12 text-zinc-800 mx-auto mb-3" />
                    <p className="text-xs">{language === 'bn' ? 'আপনার কার্ট বর্তমানে খালি আছে!' : 'Your shipping cart is empty!'}</p>
                  </div>
                ) : (
                  cart.map((item) => {
                    const prod = products.find(p => p.id === item.productId);
                    if (!prod) return null;
                    return (
                      <div id={`cart-item-row-${prod.id}`} key={item.productId} className={`flex gap-4 p-3 rounded-lg ${theme === 'dark' ? 'bg-geo-black border-geo-border' : 'bg-slate-50 border-slate-100'} border items-center justify-between text-xs`}>
                        <img src={prod.image} alt={prod.nameEn} className="w-12 h-12 rounded object-cover" referrerPolicy="no-referrer" />
                        
                        <div className="flex-1 space-y-1 ml-1 truncate">
                          <h4 className="font-bold text-xs truncate text-slate-200">
                            {language === 'bn' ? prod.nameBn : prod.nameEn}
                          </h4>
                          <span className={`font-bold ${theme === 'dark' ? 'text-geo-amber' : 'text-amber-600'} font-mono`}>৳{prod.price}</span>
                        </div>

                        {/* Qty increment */}
                        <div className={`flex items-center gap-1.5 ${theme === 'dark' ? 'bg-slate-900 border border-thin border-white/5' : 'bg-slate-100'} px-2 py-1 rounded`}>
                          <button
                            id={`cart-qty-minus-${prod.id}`}
                            onClick={() => handleUpdateCartQuantity(item.productId, -1)}
                            className="w-4 h-4 flex items-center justify-center font-bold text-slate-400 hover:text-white"
                          >
                            -
                          </button>
                          <span className="font-bold font-mono text-[11px] text-slate-300 mx-1">{item.quantity}</span>
                          <button
                            id={`cart-qty-plus-${prod.id}`}
                            onClick={() => handleUpdateCartQuantity(item.productId, 1)}
                            className="w-4 h-4 flex items-center justify-center font-bold text-slate-400 hover:text-white"
                          >
                            +
                          </button>
                        </div>

                        {/* Trash */}
                        <button
                          id={`cart-remove-item-${prod.id}`}
                          onClick={() => handleRemoveFromCart(item.productId)}
                          className="p-1.5 text-red-500 rounded hover:bg-red-500/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                      </div>
                    );
                  })
                )}
              </div>

              {/* Drawer footer values totals */}
              <div className={`p-6 ${theme === 'dark' ? 'bg-geo-black/40 border-t border-geo-border' : 'bg-slate-50 border-t border-slate-100'} space-y-4 text-xs font-bold font-semibold`}>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{language === 'bn' ? 'পণ্যের মোট মূল্য' : 'Subtotal'}</span>
                  <span className={`font-mono ${theme === 'dark' ? 'text-geo-amber' : 'text-slate-900'}`}>৳{subtotal}</span>
                </div>
                
                <button
                  id="cart-drawer-checkout-btn"
                  disabled={cart.length === 0}
                  onClick={() => {
                    setIsCartOpen(false);
                    setCheckoutModalOpen(true);
                  }}
                  className={`w-full py-3 ${theme === 'dark' ? 'bg-geo-amber hover:bg-geo-amber-hover text-geo-black' : 'bg-slate-900 text-white hover:bg-slate-850'} disabled:opacity-40 disabled:cursor-not-allowed select-none rounded-lg font-bold cursor-pointer transition-all shadow-lg`}
                >
                  {language === 'bn' ? 'অर्डर সম্পূর্ণ করতে পেমেন্ট করুন' : 'Confirm Purchase Address'}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SECURE CENTRAL CHECKOUT FLOW SCREEN MODAL */}
      <CheckoutModal
        language={language}
        theme={theme}
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        cart={cart}
        products={products}
        onOrderSuccess={handleOrderSuccessHandler}
        addToast={addToast}
      />

      {/* Elegant minimalist landing footer */}
      <footer id="landing-master-footer" className={`p-8 border-t ${theme === 'dark' ? 'border-geo-border' : 'border-slate-200'} text-center text-xs text-slate-500 font-medium`}>
        <p>© 2026 Men's Grooming BD. All Rights Reserved.</p>
        <p className="mt-1 flex items-center justify-center gap-1.5 font-mono text-[10px]">
          <span className="w-2 h-2 rounded-full bg-geo-amber animate-pulse" />
          {language === 'bn' ? '১০০% আমদানিকৃত এবং বৈজ্ঞানিক ফরমুলা' : 'Authentic Certified Imports Solutions'}
        </p>
      </footer>

    </div>
  );
}
