import React, { useState, useRef } from 'react';
import { 
  Database, ShieldCheck, Download, Upload, Trash2, Edit3, Plus, 
  Package, ShoppingCart, Check, Sliders, AlertTriangle, RefreshCw, FileText 
} from 'lucide-react';
import { Product, Order, Review, OrderStatus, Language, Theme } from '../types';

interface AdminPanelProps {
  language: Language;
  theme: Theme;
  products: Product[];
  orders: Order[];
  reviews: Review[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onAddProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewsCount'>) => void;
  onDeleteProduct: (productId: string) => void;
  onToggleReviewApproval: (reviewId: string) => void;
  onBackupDatabase: () => void;
  onRestoreDatabase: (jsonContent: string) => void;
  addToast: (msg: string, type: 'success' | 'info' | 'error') => void;
}

export default function AdminPanel({
  language,
  theme,
  products,
  orders,
  reviews,
  onUpdateOrderStatus,
  onAddProduct,
  onDeleteProduct,
  onToggleReviewApproval,
  onBackupDatabase,
  onRestoreDatabase,
  addToast
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'reviews' | 'database'>('orders');
  
  // Product state management
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProdNameBn, setNewProdNameBn] = useState('');
  const [newProdNameEn, setNewProdNameEn] = useState('');
  const [newProdPrice, setNewProdPrice] = useState(1000);
  const [newProdCategory, setNewProdCategory] = useState<'hair' | 'beard' | 'combo' | 'accessory'>('combo');
  const [newProdDescBn, setNewProdDescBn] = useState('');
  const [newProdDescEn, setNewProdDescEn] = useState('');
  const [newProdImage, setNewProdImage] = useState('https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&q=80&w=600');

  // Security Patches Simulated Log State
  const [isPatching, setIsPatching] = useState(false);
  const [securityStatus, setSecurityStatus] = useState<'secure' | 'warning' | 'patched'>('secure');
  const [patchLogs, setPatchLogs] = useState<string[]>([
    "System Boot: Men's Grooming BD Database Shield activated.",
    "Firewall check: SSL certificates validated successfully.",
    "Vulnerability status: No immediate critical exposure found."
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Triggering the Restore DB flow
  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        // Verify JSON basic shape before sending up
        const parsed = JSON.parse(content);
        if (parsed.products || parsed.orders) {
          onRestoreDatabase(content);
          addToast(
            language === 'bn' ? 'ডাটাবেজ সফলভাবে রিস্টোর করা হয়েছে!' : 'Database restored successfully!',
            'success'
          );
        } else {
          throw new Error("Invalid structure");
        }
      } catch (err) {
        addToast(
          language === 'bn' ? 'ভুল ফরম্যাট! অনুগ্রহ করে সঠিক ব্যাকআপ ফাইল আপলোড করুন।' : 'Invalid JSON content structure.',
          'error'
        );
      }
    };
    reader.readAsText(file);
  };

  // Simulated installation of safety updates (Security Patches)
  const applySecurityPatch = () => {
    setIsPatching(true);
    setPatchLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Scanning database schemas...`]);
    
    setTimeout(() => {
      setPatchLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Sanitizing SQL transaction logs.`,
        `[${new Date().toLocaleTimeString()}] Adding SHA-256 integrity layers on Order checkouts.`,
        `[${new Date().toLocaleTimeString()}] Rate limiter filters enabled for endpoint '/api/chatbot'.`
      ]);
    }, 1000);

    setTimeout(() => {
      setIsPatching(false);
      setSecurityStatus('patched');
      setPatchLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] All Security patches successfully applied! DB integrity score: 100%`]);
      addToast(
        language === 'bn' ? 'সিকিউরিটি প্যাচ ও সুরক্ষাবলয় সফলভাবে আপডেট হয়েছে!' : 'Security patches and Firewalls successfully updated!',
        'success'
      );
    }, 2800);
  };

  const handleAddNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdNameBn || !newProdNameEn) {
      addToast(language === 'bn' ? 'পণ্যের নাম পূরণ করা জরুরি!' : 'Product names are required!', 'error');
      return;
    }

    onAddProduct({
      nameBn: newProdNameBn,
      nameEn: newProdNameEn,
      price: Number(newProdPrice),
      category: newProdCategory,
      descriptionBn: newProdDescBn,
      descriptionEn: newProdDescEn,
      image: newProdImage,
      inStock: true
    });

    setNewProdNameBn('');
    setNewProdNameEn('');
    setNewProdPrice(1000);
    setNewProdDescBn('');
    setNewProdDescEn('');
    setShowAddProduct(false);
    addToast(language === 'bn' ? 'নতুন পণ্য সফলভাবে যুক্ত হয়েছে!' : 'New product successfully added!', 'success');
  };

  return (
    <div id="admin-panel-viewport" className={`p-6 rounded-xl border shadow-xl font-sans text-xs ${theme === 'dark' ? 'bg-geo-dark text-white border-geo-border' : 'bg-white border-slate-200 text-slate-800'}`}>
      
      {/* Header */}
      <div className={`flex flex-col md:flex-row items-start md:items-center justify-between border-b pb-5 mb-6 gap-4 ${theme === 'dark' ? 'border-geo-border' : 'border-slate-100'}`}>
        <div>
          <h2 className="text-xl font-display font-bold flex items-center gap-2">
            <Database className="w-5 h-5 text-geo-amber animate-pulse" />
            {language === 'bn' ? "Men's Grooming BD এডমিন কন্ট্রোল" : "Mens Grooming BD Admin Dashboard"}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'bn' 
              ? 'অর্ডার ট্র্যাকিং, প্রোডাক্ট ইনভেন্টরি ব্যাকআপ এবং সিকিউরিটি প্যাচ কন্ট্রোল ও নিরীক্ষণ করুন।' 
              : 'Execute orders, manage products catalog, backup database and apply security filters.'}
          </p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            id="admin-backup-top-btn"
            onClick={onBackupDatabase}
            className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${theme === 'dark' ? 'bg-geo-black hover:bg-white/5 text-slate-200 border border-geo-border' : 'bg-slate-100 hover:bg-slate-250 text-slate-700'}`}
          >
            <Download className="w-3.5 h-3.5" />
            {language === 'bn' ? 'ব্যাকআপ ডাউনলোড' : 'Download Backup'}
          </button>
          
          <button
            id="admin-restore-top-btn"
            onClick={() => fileInputRef.current?.click()}
            className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${theme === 'dark' ? 'bg-geo-amber text-geo-black hover:opacity-90' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}
          >
            <Upload className="w-3.5 h-3.5" />
            {language === 'bn' ? 'ব্যাকআপ আপলোড' : 'Upload Backup'}
          </button>
          <input
            id="import-db-file-input"
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileImport}
            className="hidden"
          />
        </div>
      </div>

      {/* Tabs Menu */}
      <div className={`flex border-b mb-6 font-semibold overflow-x-auto gap-2 ${theme === 'dark' ? 'border-geo-border' : 'border-slate-200'}`}>
        {(['orders', 'products', 'reviews', 'database'] as const).map(tab => (
          <button
            id={`admin-tab-btn-${tab}`}
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-xs tracking-wide uppercase border-b-2 transition-all cursor-pointer inline-flex items-center gap-2 font-display ${
              activeTab === tab
                ? 'border-geo-amber text-geo-amber font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            {tab === 'orders' && <ShoppingCart className="w-3.5 h-3.5" />}
            {tab === 'products' && <Package className="w-3.5 h-3.5" />}
            {tab === 'reviews' && <FileText className="w-3.5 h-3.5" />}
            {tab === 'database' && <Sliders className="w-3.5 h-3.5" />}
            {tab === 'orders' && (language === 'bn' ? 'অর্ডার সমূহ' : 'Active Orders')}
            {tab === 'products' && (language === 'bn' ? 'পণ্য তালিকা' : 'Products Stock')}
            {tab === 'reviews' && (language === 'bn' ? 'রিভিউ অনুমোদন' : 'Reviews Audit')}
            {tab === 'database' && (language === 'bn' ? 'ডাটাবেজ ও সিকিউরিটি' : 'Database Security')}
          </button>
        ))}
      </div>

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div id="admin-orders-tab" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-700 dark:text-slate-200">
              {language === 'bn' ? `সর্বমোট সক্রিয় অর্ডার: (${orders.length})` : `Total Orders: (${orders.length})`}
            </h3>
          </div>

          {orders.length === 0 ? (
            <div className={`text-center py-10 px-4 border border-dashed rounded-lg text-slate-400 ${theme === 'dark' ? 'border-geo-border bg-geo-black/30' : 'border-slate-200'}`}>
              <ShoppingCart className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              {language === 'bn' ? 'কোনো অর্ডার এখনো পাওয়া যায়নি।' : 'No active orders registered yet.'}
            </div>
          ) : (
            <div className={`overflow-x-auto rounded-lg border ${theme === 'dark' ? 'border-geo-border' : 'border-slate-205'}`}>
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className={`font-semibold border-b ${theme === 'dark' ? 'bg-geo-black text-slate-400 border-geo-border' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                    <th className="p-3">ID / Date</th>
                    <th className="p-3">Customer Details</th>
                    <th className="p-3">Items & Value</th>
                    <th className="p-3">Payment</th>
                    <th className="p-3">Dispatch Tracker Stage</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${theme === 'dark' ? 'divide-geo-border bg-geo-black/10' : 'divide-slate-100'}`}>
                  {orders.map((order) => (
                    <tr key={order.id} className={`${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-slate-50/50'}`}>
                      <td className="p-3 space-y-1">
                        <span className={`font-mono text-[10px] block px-2 py-0.5 rounded border font-mono ${theme === 'dark' ? 'bg-geo-amber/10 text-geo-amber border-geo-amber/20' : 'bg-amber-100 text-slate-900 border-amber-200'}`}>
                          {order.id}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          {new Date(order.date).toLocaleString()}
                        </span>
                      </td>
                      <td className="p-3 space-y-1">
                        <p className="font-bold text-slate-700 dark:text-slate-200">{order.customerName}</p>
                        <p className="text-slate-400 dark:text-slate-500 font-mono">{order.customerPhone}</p>
                        <p className="text-slate-555 dark:text-slate-400 block max-w-xs truncate">{order.address}</p>
                      </td>
                      <td className="p-3 space-y-1">
                        <div className="font-medium text-slate-600 dark:text-slate-300">
                          {order.items.map((i, k) => {
                            const prod = products.find(p => p.id === i.productId);
                            return (
                              <div key={k}>
                                • {language === 'bn' ? prod?.nameBn : prod?.nameEn} (x{i.quantity})
                              </div>
                            );
                          })}
                        </div>
                        <p className="text-geo-amber font-bold font-mono">
                          ৳{order.total} <span className="text-[10px] text-slate-400 font-normal">({order.area === 'inside' ? (language === 'bn' ? 'ঢাকা সিটি' : 'Dhaka') : (language === 'bn' ? 'ঢাকার বাইরে' : 'Outside')})</span>
                        </p>
                      </td>
                      <td className="p-3">
                        <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold ${
                          order.paymentMethod === 'cod' 
                            ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-350' 
                            : 'bg-geo-amber/10 text-geo-amber border border-geo-amber/20'
                        }`}>
                          {order.paymentMethod.toUpperCase()}
                        </span>
                        <p className={`text-[10px] font-medium mt-1 ${
                          order.paymentStatus === 'success' ? 'text-geo-amber' : 'text-slate-400'
                        }`}>
                          {order.paymentStatus === 'success' 
                            ? (language === 'bn' ? '✓ পেইড' : '✓ Paid') 
                            : (language === 'bn' ? '⏳ ক্যাশ অন ডেলিভারি' : '⏳ Cash On Del')}
                        </p>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-col gap-1.5 w-max">
                          <select
                            id={`admin-order-status-select-${order.id}`}
                            value={order.status}
                            onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                            className={`text-xs border rounded px-2.5 py-1 focus:outline-none ${theme === 'dark' ? 'bg-geo-black text-slate-200 border-geo-border focus:border-geo-amber' : 'bg-white border-slate-200'}`}
                          >
                            <option value="pending">⏳ {language === 'bn' ? 'অপেক্ষামান' : 'Pending'}</option>
                            <option value="confirmed">✓ {language === 'bn' ? 'কনফার্মড' : 'Confirmed'}</option>
                            <option value="packaging">📦 {language === 'bn' ? 'প্যাকেজিং' : 'Packaging'}</option>
                            <option value="shipped">🏍️ {language === 'bn' ? 'ডেলিভারি পথে' : 'Shipped'}</option>
                            <option value="delivered">🎉 {language === 'bn' ? 'ডেলিভারি সম্পন্ন' : 'Delivered'}</option>
                            <option value="cancelled">❌ {language === 'bn' ? 'বাতিল' : 'Cancelled'}</option>
                          </select>
                          
                          <div className={`w-32 h-1 rounded overflow-hidden ${theme === 'dark' ? 'bg-zinc-800' : 'bg-slate-100'}`}>
                            <div 
                              className="bg-geo-amber h-full transition-all"
                              style={{ 
                                width: `${
                                  order.status === 'pending' ? 10 :
                                  order.status === 'confirmed' ? 30 :
                                  order.status === 'packaging' ? 55 :
                                  order.status === 'shipped' ? 80 :
                                  order.status === 'delivered' ? 100 : 0
                                }%` 
                              }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div id="admin-products-tab" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-700 dark:text-slate-200">
              {language === 'bn' ? `পণ্য সমূহের মোট সংখ্যা: (${products.length})` : `Products Count: (${products.length})`}
            </h3>
            <button
              id="admin-show-add-prod-btn"
              onClick={() => setShowAddProduct(!showAddProduct)}
              className="flex items-center gap-1.5 bg-geo-amber hover:opacity-90 text-geo-black rounded-lg text-xs font-bold px-3 py-2 cursor-pointer transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              {language === 'bn' ? 'নতুন পণ্য যুক্ত করুন' : 'Add Product'}
            </button>
          </div>

          {showAddProduct && (
            <form onSubmit={handleAddNewProduct} className={`p-5 rounded-lg border space-y-4 ${theme === 'dark' ? 'bg-geo-black border-geo-border' : 'bg-slate-50 border-slate-200'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">प्रोডাক্টের নাম (বাংলা)</label>
                  <input
                    id="new-product-name-bn"
                    type="text"
                    required
                    value={newProdNameBn}
                    onChange={(e) => setNewProdNameBn(e.target.value)}
                    className={`w-full text-xs rounded-lg px-3 py-2 border focus:outline-none focus:border-geo-amber ${theme === 'dark' ? 'border-geo-border bg-geo-dark text-white' : 'border-slate-200 bg-white'}`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">Product Name (English)</label>
                  <input
                    id="new-product-name-en"
                    type="text"
                    required
                    value={newProdNameEn}
                    onChange={(e) => setNewProdNameEn(e.target.value)}
                    className={`w-full text-xs rounded-lg px-3 py-2 border focus:outline-none focus:border-geo-amber ${theme === 'dark' ? 'border-geo-border bg-geo-dark text-white' : 'border-slate-200 bg-white'}`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">পণ্যের ক্যাটাগরি</label>
                  <select
                    id="new-product-category"
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value as any)}
                    className={`w-full text-xs rounded-lg px-3 py-2 border focus:outline-none focus:border-geo-amber ${theme === 'dark' ? 'border-geo-border bg-geo-dark text-white' : 'border-slate-200 bg-white'}`}
                  >
                    <option value="combo">Combo Kit</option>
                    <option value="hair">Hair Solutions</option>
                    <option value="beard">Beard Solutions</option>
                    <option value="accessory">Accessories</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">মূল্য (টাকা)</label>
                  <input
                    id="new-product-price"
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className={`w-full text-xs rounded-lg px-3 py-2 border focus:outline-none focus:border-geo-amber ${theme === 'dark' ? 'border-geo-border bg-geo-dark text-white font-mono text-geo-amber' : 'border-slate-200 bg-white'}`}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">ছবি URL (ইমেজ লিংক)</label>
                  <input
                    id="new-product-image-url"
                    type="text"
                    required
                    value={newProdImage}
                    onChange={(e) => setNewProdImage(e.target.value)}
                    className={`w-full text-xs rounded-lg px-3 py-2 border focus:outline-none focus:border-geo-amber ${theme === 'dark' ? 'border-geo-border bg-geo-dark text-white font-mono' : 'border-slate-200 bg-white'}`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">বর্ণনা (বাংলা)</label>
                  <textarea
                    id="new-product-description-bn"
                    rows={3}
                    value={newProdDescBn}
                    onChange={(e) => setNewProdDescBn(e.target.value)}
                    className={`w-full text-xs rounded-lg px-3 py-2 border focus:outline-none focus:border-geo-amber ${theme === 'dark' ? 'border-geo-border bg-geo-dark text-slate-200' : 'border-slate-200 bg-white'}`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">Description (English)</label>
                  <textarea
                    id="new-product-description-en"
                    rows={3}
                    value={newProdDescEn}
                    onChange={(e) => setNewProdDescEn(e.target.value)}
                    className={`w-full text-xs rounded-lg px-3 py-2 border focus:outline-none focus:border-geo-amber ${theme === 'dark' ? 'border-geo-border bg-geo-dark text-slate-200' : 'border-slate-200 bg-white'}`}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 text-xs font-bold pt-2">
                <button
                  id="admin-cancel-add-prod-btn"
                  type="button"
                  onClick={() => setShowAddProduct(false)}
                  className={`px-4 py-2 border rounded-lg transition-colors cursor-pointer ${theme === 'dark' ? 'border-geo-border text-slate-400 hover:bg-white/5' : 'border-slate-200 text-slate-500 hover:bg-slate-100'}`}
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  id="admin-confirm-add-prod-btn"
                  type="submit"
                  className="px-4 py-2 bg-geo-amber text-geo-black font-bold rounded-lg hover:opacity-90 transition-all cursor-pointer"
                >
                  {language === 'bn' ? 'যুক্ত করুন' : 'Confirm Save'}
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((prod) => (
              <div key={prod.id} className={`p-4 rounded-lg border flex flex-col justify-between transition-all ${theme === 'dark' ? 'border-geo-border bg-geo-black/40 hover:bg-geo-black/60' : 'border-slate-200 bg-white'}`}>
                <div className="flex gap-3">
                  <img src={prod.image} alt={prod.nameEn} className={`w-14 h-14 rounded border object-cover shrink-0 ${theme === 'dark' ? 'border-geo-border' : 'border-slate-200'}`} referrerPolicy="no-referrer" />
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100">
                      {language === 'bn' ? prod.nameBn : prod.nameEn}
                    </h4>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 tracking-wider uppercase font-mono block mt-0.5">
                      Category: {prod.category}
                    </span>
                    <p className="text-emerald-600 font-extrabold text-sm mt-1">৳{prod.price}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-3 mt-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    prod.inStock ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20' : 'bg-red-50 text-red-500'
                  }`}>
                    {prod.inStock ? (language === 'bn' ? 'স্টকে আছে' : 'In Stock') : (language === 'bn' ? 'স্টক শেষ' : 'Out of Stock')}
                  </span>
                  
                  <button
                    id={`admin-delete-prod-btn-${prod.id}`}
                    onClick={() => {
                      if (confirm(language === 'bn' ? 'পণ্যটি কি মুছে ফেলতে চান?' : 'Are you sure to delete this product?')) {
                        onDeleteProduct(prod.id);
                        addToast(language === 'bn' ? 'পণ্যটি মুছে ফেলা হয়েছে!' : 'Product deleted successfully!', 'info');
                      }
                    }}
                    className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REVIEWS TAB */}
      {activeTab === 'reviews' && (
        <div id="admin-reviews-tab" className="space-y-4">
          <h3 className="font-bold text-sm text-slate-700 dark:text-slate-200">
            {language === 'bn' ? `সর্বমোট গ্রাহক রিভিউ সংখ্যা: (${reviews.length})` : `Total Reviews: (${reviews.length})`}
          </h3>

          <div className={`border rounded-lg overflow-hidden divide-y ${theme === 'dark' ? 'border-geo-border bg-geo-black/20 divide-geo-border/60' : 'border-slate-200 bg-white divide-slate-100'}`}>
            {reviews.map((rev) => (
              <div key={rev.id} className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-slate-700 dark:text-slate-200">{rev.userName}</p>
                    <span className="text-geo-amber font-mono text-xs">{"★".repeat(rev.rating)}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({rev.date})</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                    "{language === 'bn' ? rev.commentBn : rev.commentEn}"
                  </p>
                </div>

                <button
                  id={`admin-approve-review-btn-${rev.id}`}
                  onClick={() => {
                    onToggleReviewApproval(rev.id);
                    addToast(
                      rev.isApproved 
                        ? (language === 'bn' ? 'রিভিউ লুকানো হয়েছে!' : 'Review hidden from store') 
                        : (language === 'bn' ? 'রিভিউ অনুমোদন করা হয়েছে!' : 'Review approved and live'),
                      'success'
                    );
                  }}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wide uppercase transition-all cursor-pointer ${
                    rev.isApproved
                      ? 'bg-geo-amber text-geo-black font-extrabold'
                      : 'bg-white/5 text-slate-355 border border-geo-border hover:bg-white/10'
                  }`}
                >
                  {rev.isApproved ? (language === 'bn' ? '✓ লাইভ (অনুমোদিত)' : '✓ Live Approved') : (language === 'bn' ? '⏳ অনুমোদন দিন' : '⏳ Approve Now')}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DATABASE & SECURITY SCHEMA CONTROLS */}
      {activeTab === 'database' && (
        <div id="admin-database-tab" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* DB Control Box */}
          <div className={`space-y-4 p-5 rounded-lg border ${theme === 'dark' ? 'bg-geo-black/35 border-geo-border' : 'bg-slate-50 border-slate-200'}`}>
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Database className="w-4 h-4 text-geo-amber" />
              {language === 'bn' ? 'ডাটাবেজ ব্যাকআপ ক্যাশিং কন্ট্রোল' : 'LocalStorage DB Cache Management'}
            </h4>
            
            <p className="text-xs text-slate-500 leading-relaxed dark:text-slate-400">
              {language === 'bn' 
                ? 'মেনস গ্রুমিং বিডি ব্যাকআপ সিস্টেম ডাটাবেজের সমস্ত পণ্য তালিকা, অর্ডার স্ট্রাকচার, রিভিউ রেকর্ড এবং গ্রাহকদের প্যারামিটার অফলাইন স্টোরেজ থেকে সরাসরি ব্যাকআপ জেনারেট করে।' 
                : 'Instantly compile localized app schema including custom added products, active dispatch routes and testimonials configurations into standard serialized stream.'}
            </p>

            <div className="flex gap-2 pt-2">
              <button
                id="admin-db-action-backup-btn"
                onClick={onBackupDatabase}
                className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  theme === 'dark' ? 'bg-geo-black border border-geo-border hover:bg-white/5 text-slate-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                }`}
              >
                <Download className="w-4 h-4" />
                {language === 'bn' ? 'ডাটা এক্সপোর্ট করুন' : 'Export JSON'}
              </button>
              <button
                id="admin-db-action-restore-btn"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-geo-amber hover:opacity-90 text-geo-black rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                {language === 'bn' ? 'ইম্পোর্ট / রিস্টোর' : 'Import JSON'}
              </button>
            </div>
          </div>

          {/* Security Shield and hot patches */}
          <div className={`space-y-4 p-5 rounded-lg border ${theme === 'dark' ? 'bg-geo-black/35 border-geo-border' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <ShieldCheck className={`w-5 h-5 ${securityStatus === 'patched' ? 'text-geo-amber' : 'text-amber-500'}`} />
                {language === 'bn' ? ' can-apply লাইভ সিকিউরিটি শিল্ড ও প্যাচ' : 'Vulnerabilities & Patching Matrix'}
              </h4>
              <span className={`text-[10px] font-bold font-mono px-2.5 py-0.5 rounded ${
                securityStatus === 'patched' ? 'bg-geo-amber/10 text-geo-amber border border-geo-amber/20' : 'bg-slate-200 text-slate-600'
              }`}>
                {securityStatus === 'patched' ? '✓ FULLY PATCHED' : '✓ SECURED'}
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed dark:text-slate-400">
              {language === 'bn' 
                ? 'আপনার ডাটাবেজ ইন্টিগ্রিটি ও গ্রাহকদের পেমেন্ট ট্রানজেকশন সম্পূর্ণ নিরাপদ রাখতে নিয়মিত সিকিউরিটি হটপ্যাচ চেক এবং আপডেট ইনস্টল করুন।' 
                : 'Monitor incoming packets integrity, sanitize checkout payload configurations, block CSRF injection, and safely guard automated endpoints.'}
            </p>

            {/* Simulated Live Logs terminal */}
            <div className={`p-3 rounded-lg font-mono text-[9px] h-24 overflow-y-auto space-y-1 shadow-inner select-none ${
              theme === 'dark' ? 'bg-geo-black border border-geo-border text-geo-amber' : 'bg-slate-950 text-emerald-400 border border-slate-200'
            }`}>
              <p className="text-slate-500">// Men's Grooming BD Database Security Shield Console</p>
              {patchLogs.map((log, index) => (
                <p key={index} className="leading-relaxed">{log}</p>
              ))}
            </div>

            <button
              id="admin-apply-security-patch-btn"
              onClick={applySecurityPatch}
              disabled={isPatching}
              className={`w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold transition-all disabled:opacity-40 select-none cursor-pointer ${
                theme === 'dark' ? 'bg-geo-amber/10 border border-geo-amber/20 text-geo-amber hover:bg-geo-amber/20' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPatching ? 'animate-spin' : ''}`} />
              {isPatching 
                ? (language === 'bn' ? 'প্যাচ আপডেট হচ্ছে...' : 'Installing patches...') 
                : (language === 'bn' ? 'সিকিউরিটি প্যাচ এবং আপডেট করুন' : 'Apply Security Patches')}
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
