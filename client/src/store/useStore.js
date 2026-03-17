import { create } from 'zustand';

// Sample mock data for development
const mockListings = [
  {
    _id: '1',
    sellerId: { _id: 'u1', name: 'রহিম আহমেদ', avatar: null, rating: 4.8, totalSales: 120, isVerified: true },
    denomination: 500,
    serialNumber: 'কখ 1402199',
    serialPatterns: ['dateMatch'],
    matchingDates: ['1402'],
    occasion: 'birthday',
    isGiftable: true,
    condition: 'uncirculated',
    images: [],
    askingPrice: 2500,
    minOfferPrice: 2000,
    allowOffers: true,
    description: 'সম্পূর্ণ নতুন ৫০০ টাকার নোট। সিরিয়ালে ১৪/০২ তারিখ রয়েছে — ভালোবাসা দিবসের জন্য পারফেক্ট!',
    status: 'active',
    createdAt: '2026-03-15T10:00:00Z',
  },
  {
    _id: '2',
    sellerId: { _id: 'u2', name: 'সাবরিনা ইসলাম', avatar: null, rating: 4.9, totalSales: 85, isVerified: true },
    denomination: 1000,
    serialNumber: 'গঘ 1234567',
    serialPatterns: ['fancy'],
    matchingDates: [],
    occasion: '',
    isGiftable: false,
    condition: 'uncirculated',
    images: [],
    askingPrice: 5000,
    minOfferPrice: 4000,
    allowOffers: true,
    description: 'ফ্যান্সি অ্যাসেন্ডিং সিরিয়াল নম্বর 1234567! সংগ্রহযোগ্য!',
    status: 'active',
    createdAt: '2026-03-14T08:30:00Z',
  },
  {
    _id: '3',
    sellerId: { _id: 'u3', name: 'নাইম হাসান', avatar: null, rating: 4.7, totalSales: 45, isVerified: true },
    denomination: 100,
    serialNumber: 'চছ 5555555',
    serialPatterns: ['solid'],
    matchingDates: [],
    occasion: '',
    isGiftable: true,
    condition: 'good',
    images: [],
    askingPrice: 8000,
    minOfferPrice: 6000,
    allowOffers: true,
    description: 'সলিড ৫ এর সিরিয়াল — অত্যন্ত বিরল!',
    status: 'active',
    createdAt: '2026-03-13T14:20:00Z',
  },
  {
    _id: '4',
    sellerId: { _id: 'u4', name: 'তানিয়া আক্তার', avatar: null, rating: 5.0, totalSales: 200, isVerified: true },
    denomination: 500,
    serialNumber: 'জঝ 1234321',
    serialPatterns: ['radar'],
    matchingDates: [],
    occasion: '',
    isGiftable: true,
    condition: 'uncirculated',
    images: [],
    askingPrice: 3500,
    minOfferPrice: 3000,
    allowOffers: true,
    description: 'রাডার নম্বর — সামনে-পিছনে একই পড়া যায়!',
    status: 'active',
    createdAt: '2026-03-12T16:45:00Z',
  },
  {
    _id: '5',
    sellerId: { _id: 'u1', name: 'রহিম আহমেদ', avatar: null, rating: 4.8, totalSales: 120, isVerified: true },
    denomination: 200,
    serialNumber: 'টঠ 0607199',
    serialPatterns: ['dateMatch'],
    matchingDates: ['060719'],
    occasion: 'birthday',
    isGiftable: true,
    condition: 'uncirculated',
    images: [],
    askingPrice: 1800,
    minOfferPrice: 1500,
    allowOffers: true,
    description: 'জুলাই ৬, ১৯৯৮ সালের সাথে মিলে যায়। ৭ জুলাই জন্মদিনের জন্যও!',
    status: 'active',
    createdAt: '2026-03-11T09:10:00Z',
  },
  {
    _id: '6',
    sellerId: { _id: 'u5', name: 'ফারহান রাব্বি', avatar: null, rating: 4.6, totalSales: 32, isVerified: false },
    denomination: 50,
    serialNumber: 'ডঢ 0000010',
    serialPatterns: ['lowSerial'],
    matchingDates: [],
    occasion: '',
    isGiftable: false,
    condition: 'good',
    images: [],
    askingPrice: 4000,
    minOfferPrice: 3000,
    allowOffers: true,
    description: 'সিরিয়াল নম্বর মাত্র ১০! অত্যন্ত বিরল লো সিরিয়াল নোট!',
    status: 'active',
    createdAt: '2026-03-10T11:30:00Z',
  },
];

const mockWantedPosts = [
  {
    _id: 'w1',
    buyerId: { _id: 'ub1', name: 'মিথিলা সরকার', avatar: null },
    denomination: 100,
    targetDate: '15/08/2000',
    targetSerial: '',
    occasion: 'birthday',
    maxBudget: 3000,
    description: 'আমি আমার মেয়ের জন্মদিনের (১৫ আগস্ট ২০০০) সাথে মিলে যাওয়া ১০০ টাকার নোট খুঁজছি',
    status: 'active',
    createdAt: '2026-03-16T08:00:00Z',
  },
  {
    _id: 'w2',
    buyerId: { _id: 'ub2', name: 'আরিফ করিম', avatar: null },
    denomination: 500,
    targetDate: '14/02/1995',
    targetSerial: '',
    occasion: 'anniversary',
    maxBudget: 5000,
    description: 'বিবাহবার্ষিকী উপহারের জন্য ১৪ ফেব্রুয়ারি ১৯৯৫ তারিখ মিলের নোট দরকার',
    status: 'active',
    createdAt: '2026-03-15T12:00:00Z',
  },
  {
    _id: 'w3',
    buyerId: { _id: 'ub3', name: 'সুমাইয়া জাহান', avatar: null },
    denomination: 1000,
    targetDate: '',
    targetSerial: '7777777',
    occasion: 'other',
    maxBudget: 15000,
    description: 'সলিড ৭ এর ১০০০ টাকার নোট কিনতে চাই। যেকোনো কন্ডিশন চলবে',
    status: 'active',
    createdAt: '2026-03-14T15:00:00Z',
  },
];

export const useStore = create((set, get) => ({
  // Auth state
  user: null,
  isAuthenticated: false,
  
  // Listings
  listings: mockListings,
  featuredListings: mockListings,
  
  // Wanted
  wantedPosts: mockWantedPosts,
  
  // Chat
  conversations: [],
  activeConversation: null,
  messages: [],
  
  // UI State
  searchQuery: '',
  selectedCategory: null,
  isLoading: false,
  
  // Actions
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setLoading: (loading) => set({ isLoading: loading }),
  
  // Listing actions
  addListing: (listing) => set((state) => ({ 
    listings: [listing, ...state.listings] 
  })),
  
  // Wanted actions
  addWantedPost: (post) => set((state) => ({
    wantedPosts: [post, ...state.wantedPosts]
  })),
  
  // Chat actions
  setActiveConversation: (conv) => set({ activeConversation: conv }),
  addMessage: (msg) => set((state) => ({
    messages: [...state.messages, msg]
  })),
}));
