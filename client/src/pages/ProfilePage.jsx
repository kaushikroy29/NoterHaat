import { useState } from 'react';
import { Shield, Star, Award, Calendar, Package, MapPin, Search } from 'lucide-react';
import { useStore } from '../store/useStore';
import NoteCard from '../components/cards/NoteCard';

export default function ProfilePage() {
  const { user, listings } = useStore();
  const [activeTab, setActiveTab] = useState('active');

  // Hardcode my profile if no user logged in
  const profile = user || {
    name: 'রহিম আহমেদ',
    avatar: 'র',
    isVerified: true,
    rating: 4.8,
    reviews: 42,
    totalSales: 120,
    joinDate: 'জানুয়ারি ২০২৫',
    location: 'ঢাকা',
    bio: 'বিশেষ সিরিয়াল এবং পুরোনো নোটের একজন শৌখিন সংগ্রাহক। আমার কালেকশনের নোটগুলো সব নিখুঁত অবস্থার।',
  };

  const myActiveListings = listings.slice(0, 3);
  const mySoldListings = listings.slice(3, 5);

  return (
    <div className="min-h-screen pb-12">
      {/* Cover & Header */}
      <div className="h-48 md:h-64 bg-gradient-to-br from-primary via-primary-dark to-black relative">
        <div className="absolute inset-0 bg-paper-texture opacity-30 mix-blend-overlay"></div>
      </div>
      
      <div className="container-custom px-4 sm:px-6 relative">
        {/* Profile Card Overlay */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 -mt-20 relative z-10 border border-border flex flex-col md:flex-row gap-6 md:items-end">
          <div className="shrink-0 -mt-16 md:-mt-24 w-32 h-32 md:w-40 md:h-40 bg-white rounded-full p-2 shadow-xl shrink-0 mx-auto md:mx-0">
            <div className="w-full h-full bg-gradient-to-br from-primary-light to-primary rounded-full flex items-center justify-center text-4xl md:text-6xl font-bold text-white font-[family-name:var(--font-heading)]">
              {profile.avatar}
            </div>
            {profile.isVerified && (
              <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 w-8 h-8 md:w-10 md:h-10 bg-success text-white rounded-full border-4 border-white flex items-center justify-center shadow-md">
                <Shield className="w-4 h-4 md:w-5 md:h-5" />
              </div>
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-3">
            <h1 className="text-3xl font-bold text-primary font-[family-name:var(--font-heading)] flex flex-col md:flex-row md:items-center gap-2">
              {profile.name}
              {profile.isVerified && <span className="badge badge-green hidden md:inline-flex text-sm"><Shield className="w-3.5 h-3.5"/> বিশ্বস্ত বিক্রেতা</span>}
            </h1>
            
            <p className="text-text-muted text-sm md:text-base max-w-xl font-[family-name:var(--font-heading)]">
              {profile.bio}
            </p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6 pt-2">
              <div className="flex items-center gap-1.5 text-sm font-semibold font-[family-name:var(--font-heading)]">
                <Star className="w-4 h-4 text-accent fill-accent" />
                <span>{profile.rating}</span>
                <span className="text-text-muted font-normal">({profile.reviews} রিভিউ)</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-text-muted font-[family-name:var(--font-heading)]">
                <Package className="w-4 h-4" />
                <span>{profile.totalSales}টি বিক্রয়</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-text-muted font-[family-name:var(--font-heading)]">
                <MapPin className="w-4 h-4" />
                <span>{profile.location}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-text-muted font-[family-name:var(--font-heading)]">
                <Calendar className="w-4 h-4" />
                <span>যোগদান: {profile.joinDate}</span>
              </div>
            </div>
          </div>
          
          <div className="shrink-0 flex flex-col gap-2 w-full md:w-auto mt-4 md:mt-0">
             <button className="btn btn-gold w-full md:w-auto justify-center">এডিট প্রোফাইল</button>
             <button className="btn border border-border hover:bg-bg w-full md:w-auto justify-center">শেয়ার করুন</button>
          </div>
        </div>

        {/* Tabs & Content */}
        <div className="mt-8 flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4 shrink-0 hidden lg:block">
            {/* Left sidebar info could go here for desktop */}
            <div className="card p-5 sticky top-24">
               <h3 className="font-bold mb-4 font-[family-name:var(--font-heading)] flex items-center gap-2">
                 <Award className="w-5 h-5 text-accent"/> অর্জনসমূহ
               </h3>
               <div className="space-y-3">
                 <div className="flex items-center gap-3 p-2 bg-bg rounded-lg">
                   <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent-dark">🏆</div>
                   <div className="text-sm font-semibold font-[family-name:var(--font-heading)]">১০০+ সফল বিক্রয়</div>
                 </div>
                 <div className="flex items-center gap-3 p-2 bg-bg rounded-lg">
                   <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center text-success">⭐</div>
                   <div className="text-sm font-semibold font-[family-name:var(--font-heading)]">টপ রেটেড সেলার</div>
                 </div>
                 <div className="flex items-center gap-3 p-2 bg-bg rounded-lg">
                   <div className="w-8 h-8 rounded-full bg-blue/20 flex items-center justify-center text-blue">💎</div>
                   <div className="text-sm font-semibold font-[family-name:var(--font-heading)]">বিরল কালেকশন</div>
                 </div>
               </div>
            </div>
          </div>

          <div className="lg:w-3/4 min-w-0">
            <div className="flex border-b border-border overflow-x-auto pills-scroll mb-6">
              {[
                { key: 'active', label: `সক্রিয় লিস্টিং (${myActiveListings.length})` },
                { key: 'sold', label: `বিক্রিত নোট (${mySoldListings.length})` },
                { key: 'reviews', label: 'ক্রেতার রিভিউ' },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`whitespace-nowrap py-3 px-6 text-sm font-bold font-[family-name:var(--font-heading)] border-b-2 transition-colors ${
                    activeTab === tab.key 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-text-muted hover:text-text'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="animate-[fadeIn_0.3s_ease]">
              {activeTab === 'active' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myActiveListings.map(listing => (
                    <NoteCard key={listing._id} listing={listing} />
                  ))}
                  <div className="border-2 border-dashed border-border hover:border-primary transition-colors rounded-xl flex flex-col items-center justify-center p-6 text-center cursor-pointer min-h-[350px]">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                       <span className="text-2xl text-primary">+</span>
                    </div>
                    <p className="font-bold text-lg mb-2 font-[family-name:var(--font-heading)]">নতুন নোট বিক্রি করুন</p>
                    <p className="text-sm text-text-muted px-4 font-[family-name:var(--font-heading)]">আপনার কালেকশনের বিশেষ নোটটি এখানে লিস্ট করুন।</p>
                    <button className="btn btn-green btn-sm mt-4">লিস্ট করুন</button>
                  </div>
                </div>
              )}

              {activeTab === 'sold' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 opacity-70">
                  {mySoldListings.map(listing => (
                    <div key={listing._id} className="relative">
                      <NoteCard listing={listing} />
                      <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] rounded-xl flex items-center justify-center z-10 pointer-events-none">
                        <span className="bg-success text-white px-6 py-2 rounded-full font-bold shadow-lg transform -rotate-12 border-2 border-white scale-125">
                          বিক্রিত
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="max-w-2xl space-y-4">
                  {[1,2,3].map(i => (
                    <div key={i} className="card p-5 bg-white">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex gap-3">
                           <div className="w-10 h-10 bg-bg rounded-full border border-border flex items-center justify-center shrink-0">U{i}</div>
                           <div>
                             <p className="font-bold text-sm font-[family-name:var(--font-heading)]">ইউজার{i}৮৯৭</p>
                             <div className="flex">
                               {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 text-accent fill-accent"/>)}
                             </div>
                           </div>
                        </div>
                        <span className="text-xs text-text-muted">২ সপ্তাহ আগে</span>
                      </div>
                      <p className="text-sm text-text-muted font-[family-name:var(--font-heading)]">
                        নোটটি ঠিক ছবির মতোই সুন্দর। বিক্রেতা খুবই আন্তরিক এবং দ্রুত ডেলিভারি দিয়েছেন। ধন্যবাদ!
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
