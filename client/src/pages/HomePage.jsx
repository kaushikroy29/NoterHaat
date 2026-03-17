import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ChevronRight, Shield, Lock, Package, Star, Gift, Heart, Search } from 'lucide-react';
import NoteCard from '../components/cards/NoteCard';
import WantedCard from '../components/cards/WantedCard';
import { useStore } from '../store/useStore';

const categories = [
  { emoji: '🔢', label: 'ফ্যান্সি নম্বর', key: 'fancy' },
  { emoji: '📅', label: 'তারিখ মিল', key: 'dateMatch' },
  { emoji: '🔄', label: 'রাডার নম্বর', key: 'radar' },
  { emoji: '💯', label: 'সলিড নম্বর', key: 'solid' },
  { emoji: '⬇️', label: 'লো সিরিয়াল', key: 'lowSerial' },
  { emoji: '📈', label: 'হাই ভ্যালু নোট', key: 'highValue' },
  { emoji: '🎂', label: 'জন্মদিন স্পেশাল', key: 'birthday' },
  { emoji: '💍', label: 'বিবাহবার্ষিকী', key: 'anniversary' },
];

const tickerMessages = [
  'নতুন: ৫০০৳ নোট — সিরিয়াল 0714XXXX বিক্রয় হচ্ছে',
  '🔥 ১০০০৳ সলিড ৭ এর নোট — ১৫,০০০৳ এ বিক্রি হয়েছে!',
  '📅 ১৪ ফেব্রুয়ারির নোট — ৩ জন ক্রেতা আগ্রহী',
  '🎂 জন্মদিনের নোট খুঁজছেন? আজই তারিখ মিলিয়ে দেখুন!',
  '✨ নতুন ফ্যান্সি নম্বর: 1234567 — ৫,০০০৳',
];

export default function HomePage() {
  const { featuredListings, wantedPosts } = useStore();
  const [specialDate, setSpecialDate] = useState('');
  const [occasion, setOccasion] = useState('');

  return (
    <div className="min-h-screen">
      {/* ===================== HERO SECTION ===================== */}
      <section className="paper-texture relative overflow-hidden">
        <div className="container-custom py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-primary leading-tight font-[family-name:var(--font-heading)]">
                তোমার স্মৃতির তারিখ{' '}
                <span className="text-gradient">এখন তোমার হাতে</span>
              </h1>
              <p className="text-lg text-text-muted font-[family-name:var(--font-heading)] leading-relaxed max-w-lg">
                জন্মদিন, বিবাহবার্ষিকী বা যেকোনো বিশেষ দিনের সিরিয়াল নম্বরের নোট খুঁজুন ও সংগ্রহ করুন
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/date-match" className="btn btn-gold btn-lg">
                  🎂 বিশেষ তারিখে নোট খুঁজুন
                </Link>
                <Link to="/post" className="btn btn-green-outline btn-lg">
                  🏷️ আমার নোট বিক্রি করুন
                </Link>
              </div>
            </div>

            {/* Right: 3D Note */}
            <div className="flex justify-center">
              <div className="note-3d relative">
                <div className="w-80 h-48 rounded-xl bg-gradient-to-br from-primary via-primary-light to-accent shadow-xl flex flex-col items-center justify-center text-white p-6 border border-white/20">
                  <div className="text-sm opacity-60 mb-1 font-[family-name:var(--font-heading)]">বাংলাদেশ ব্যাংক</div>
                  <div className="text-5xl font-bold font-[family-name:var(--font-mono)]">৳১০০</div>
                  <div className="mt-3 serial-number text-xs tracking-[4px] opacity-80 bg-white/10 px-3 py-1 rounded-full">
                    কখ ১২৩৪৫৬৭
                  </div>
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-accent/30 flex items-center justify-center">
                    <Star className="w-4 h-4 text-accent-light" />
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute -bottom-2 -right-2 w-16 h-16 rounded-full bg-accent/20 blur-xl"></div>
                  <div className="absolute -top-2 -left-2 w-12 h-12 rounded-full bg-white/10 blur-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Animated Ticker */}
        <div className="bg-primary/5 border-y border-border py-3 overflow-hidden">
          <div className="ticker-animate whitespace-nowrap">
            {tickerMessages.map((msg, i) => (
              <span key={i} className="inline-block mx-8 text-sm text-text-muted font-[family-name:var(--font-heading)]">
                {msg}
                <span className="mx-4 text-accent">•</span>
              </span>
            ))}
            {tickerMessages.map((msg, i) => (
              <span key={`dup-${i}`} className="inline-block mx-8 text-sm text-text-muted font-[family-name:var(--font-heading)]">
                {msg}
                <span className="mx-4 text-accent">•</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== SPECIAL DATE FINDER ===================== */}
      <section className="section">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 font-[family-name:var(--font-heading)]">
            🎂 তোমার বিশেষ দিনের নোট খোঁজো
          </h2>
          <div className="max-w-2xl mx-auto">
            <div className="rounded-2xl p-6 md:p-8 bg-gradient-to-br from-primary to-primary-light text-white space-y-5 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm opacity-80 mb-1.5 block font-[family-name:var(--font-heading)]">তোমার বিশেষ তারিখ লিখুন</label>
                  <input
                    type="date"
                    value={specialDate}
                    onChange={(e) => setSpecialDate(e.target.value)}
                    className="input bg-white/10 border-white/20 text-white placeholder:text-white/50 [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="text-sm opacity-80 mb-1.5 block font-[family-name:var(--font-heading)]">কোন উপলক্ষ?</label>
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="input select bg-white/10 border-white/20 text-white"
                  >
                    <option value="" className="text-text">বাছাই করুন</option>
                    <option value="birthday" className="text-text">🎂 জন্মদিন</option>
                    <option value="anniversary" className="text-text">💍 বিবাহবার্ষিকী</option>
                    <option value="graduation" className="text-text">🎓 স্নাতক</option>
                    <option value="firstMeeting" className="text-text">💫 প্রথম দেখা</option>
                    <option value="other" className="text-text">✨ অন্যান্য</option>
                  </select>
                </div>
              </div>
              <Link
                to={specialDate ? `/date-match?date=${specialDate}&occasion=${occasion}` : '/date-match'}
                className="btn bg-accent text-primary-dark font-bold w-full justify-center text-base hover:bg-accent-light no-underline"
              >
                🔍 এই তারিখের নোট খুঁজুন
              </Link>
              <p className="text-xs text-white/60 text-center font-[family-name:var(--font-heading)]">
                যেমন: ১৪/০২/১৯৯৫ → সিরিয়াল শুরু: 1402, 1995, 140295, 14021995 ইত্যাদি
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== GIFT A NOTE ===================== */}
      <section className="section bg-white">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 font-[family-name:var(--font-heading)]">
            🎁 প্রিয়জনকে গিফট করুন একটি অর্থবহ নোট
          </h2>
          <p className="text-center text-text-muted mb-10 font-[family-name:var(--font-heading)]">
            শুধু টাকা নয়, একটি গল্প উপহার দিন
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { emoji: '💝', title: 'বিশেষ সিরিয়াল', desc: 'তার জন্মতারিখের নোট' },
              { emoji: '💌', title: 'গিফট মেসেজ', desc: 'নোটের সাথে হৃদয়ের কথা' },
              { emoji: '📦', title: 'গিফট র্যাপিং', desc: 'সুন্দর প্যাকেজিংয়ে পাঠান' },
            ].map((item) => (
              <div key={item.title} className="card p-6 text-center space-y-3 hover:border-accent">
                <div className="text-4xl">{item.emoji}</div>
                <h3 className="text-lg font-bold text-primary font-[family-name:var(--font-heading)]">{item.title}</h3>
                <p className="text-sm text-text-muted font-[family-name:var(--font-heading)]">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link to="/browse?gift=true" className="btn btn-gold btn-lg">
              🎁 গিফট হিসেবে কিনুন
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== BROWSE BY CATEGORY ===================== */}
      <section className="section">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)]">ক্যাটাগরি অনুযায়ী খুঁজুন</h2>
            <Link to="/browse" className="text-primary hover:text-accent text-sm flex items-center gap-1 font-[family-name:var(--font-heading)] no-underline">
              সব দেখুন <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="pills-scroll">
            {categories.map((cat) => (
              <Link key={cat.key} to={`/browse?category=${cat.key}`} className="pill no-underline">
                <span>{cat.emoji}</span> {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FEATURED LISTINGS ===================== */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)]">✨ বিশেষ নোট</h2>
            <Link to="/browse" className="text-primary hover:text-accent text-sm flex items-center gap-1 font-[family-name:var(--font-heading)] no-underline">
              সব দেখুন <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid-listings">
            {featuredListings.slice(0, 6).map((listing) => (
              <NoteCard key={listing._id} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      {/* ===================== WANTED BOARD PREVIEW ===================== */}
      <section className="section">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)]">📋 ক্রেতারা যা খুঁজছেন</h2>
            <Link to="/wanted" className="text-primary hover:text-accent text-sm flex items-center gap-1 font-[family-name:var(--font-heading)] no-underline">
              সব দেখুন <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {wantedPosts.slice(0, 3).map((post) => (
              <WantedCard key={post._id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* ===================== TRUST & STATS BAR ===================== */}
      <section className="bg-primary/5 border-y border-border py-8">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: <Shield className="w-6 h-6 text-primary" />, stat: '৫,০০০+', label: 'যাচাইকৃত বিক্রেতা' },
              { icon: <Lock className="w-6 h-6 text-primary" />, stat: '১০০%', label: 'নিরাপদ চ্যাট' },
              { icon: <Package className="w-6 h-6 text-primary" />, stat: '৬৪', label: 'জেলায় ডেলিভারি' },
              { icon: <Star className="w-6 h-6 text-accent fill-accent" />, stat: '৯৮%', label: 'সন্তুষ্ট ক্রেতা' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                {item.icon}
                <div className="text-2xl font-bold text-primary font-[family-name:var(--font-heading)]">{item.stat}</div>
                <div className="text-sm text-text-muted font-[family-name:var(--font-heading)]">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
