export interface Product {
  id: string;
  nameBn: string;
  nameEn: string;
  price: number;
  image: string;
  descriptionBn: string;
  descriptionEn: string;
  category: 'hair' | 'beard' | 'combo' | 'accessory';
  inStock: boolean;
  rating: number;
  reviewsCount: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'packaging' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  address: string;
  area: 'inside' | 'outside';
  paymentMethod: 'bkash' | 'nagad' | 'rocket' | 'cod';
  paymentStatus: 'pending' | 'success' | 'failed';
  paymentDetails?: {
    walletNumber?: string;
    transactionId?: string;
  };
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  status: OrderStatus;
  date: string;
  latitude?: number;
  longitude?: number;
  courierProgress?: number; // 0 to 100 for live animation
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  commentBn: string;
  commentEn: string;
  date: string;
  isApproved: boolean;
}

export interface PersonalizedProfile {
  name: string;
  phone: string;
  hairType: string;
  beardType: string;
  streaks: number; // consecutive usage streak in days
  lastStreakUpdate: string;
}

export type Language = 'bn' | 'en';
export type Theme = 'dark' | 'light';

export interface AppTranslation {
  heroTitle: string;
  heroSub: string;
  heroButton: string;
  phoneContact: string;
  productsTitle: string;
  productsSub: string;
  reviewsTitle: string;
  reviewsSub: string;
  addReview: string;
  rating: string;
  name: string;
  phone: string;
  address: string;
  orderSummary: string;
  cart: string;
  checkout: string;
  buyNow: string;
  confirmOrder: string;
  orderSuccess: string;
  adminPanel: string;
  dashboard: string;
  orderTracking: string;
  offlineHeader: string;
  offlineSub: string;
  chatbotHeader: string;
  chatbotPlaceholder: string;
  chatbotButton: string;
}
