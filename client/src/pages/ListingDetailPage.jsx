import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Copy, Check, Star, Gift, Heart, MessageCircle, DollarSign, ArrowLeft, Shield, Calendar, Tag, TrendingUp } from 'lucide-react';
import { useStore } from '../store/useStore';
import { analyzeSerial, formatBDT } from '../utils/serialAnalyzer';
import NoteCard from '../components/cards/NoteCard';

const denominationColors = {
  10: '#16A34A', 20: '#0D9488', 50: '#7C3AED',
  100: '#DC2626', 200: '#EA580C', 500: '#2563EB', 1000: '#1B4332',
};

export default function ListingDetailPage() {
  const { id } = useParams();
  const { listings } = useStore();
  const listing = listings.find(l => l._id === id) || listings[0];
  const [copied, setCopied] = useState(false);
  const [showOffer, setShowOffer] = useState(false);
  const [offerPrice, setOfferPrice] = useState('');
  const [offerMessage, setOfferMessage] = useState('');
  const [wishlisted, setWishlisted] = useState(false);

  if (!listing) return <div className="min-h-screen flex items-center justify-center text-text-muted">Loading...</div>;

  const analysis = analyzeSerial(listing.serialNumber);
  const seller = listing.sellerId || {};
  const relatedListings = listings.filter(l => l._id !== listing._id).slice(0, 3);

  const copySerial = () => {
    navigator.clipboard.writeText(listing.serialNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen">
      <div className="container-custom py-6">
        {/* Back */}
        <Link to="/browse" className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-primary mb-6 no-underline font-[family-name:var(--font-heading)]">
          <ArrowLeft className="w-4 h-4" /> ফিরে যান
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left — Image & Details (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Main Image */}
            <div className="card overflow-hidden">
              <div className="relative h-64 md:h-80 bg-gradient-to-br from-bg to-border flex items-center justify-center group cursor-pointer">
                <div
                  className="text-8xl font-bold opacity-15 font-[family-name:var(--font-mono)]"
                  style={{ color: denominationColors[listing.denomination] || '#1B4332' }}
                >
                  ৳{listing.denomination}
                </div>
                <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-text-muted font-[family-name:var(--font-heading)]">
                  সামনের দিক
                </div>
              </div>
              {/* Image Gallery */}
              <div className="flex gap-2 p-3 bg-bg">
                {['সামনে', 'পিছনে'].map((label, i) => (
                  <div key={i} className="flex-1 h-20 rounded-md bg-border/50 flex items-center justify-center text-xs text-text-muted font-[family-name:var(--font-heading)] cursor-pointer hover:bg-border transition-colors">
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Serial Number Big */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="serial-number text-3xl text-primary">{listing.serialNumber}</h2>
                <button onClick={copySerial} className="btn btn-green-outline btn-sm">
                  {copied ? <><Check className="w-4 h-4" /> কপি হয়েছে</> : <><Copy className="w-4 h-4" /> কপি</>}
                </button>
              </div>
              
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {analysis.patternLabels.map((label, i) => (
                  <span key={i} className={`badge badge-${label.color}`}>
                    ✓ {label.bn}
                  </span>
                ))}
              </div>

              {/* Date Matches */}
              {analysis.hasDateMatch && analysis.dateMatches.length > 0 && (
                <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 mt-4">
                  <p className="text-sm font-semibold text-accent-dark font-[family-name:var(--font-heading)] mb-2">
                    📅 তারিখ মিল শনাক্ত হয়েছে!
                  </p>
                  {analysis.dateMatches.slice(0, 3).map((dm, i) => (
                    <p key={i} className="text-sm text-text-muted font-[family-name:var(--font-heading)]">
                      এই সিরিয়ালে '<span className="serial-highlight">{dm.pattern}</span>' আছে — 
                      {dm.type} ফর্ম্যাটে {dm.date} এর সাথে মিলে যায়!
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* Serial Analysis */}
            <div className="card p-6">
              <h3 className="text-lg font-bold mb-4 font-[family-name:var(--font-heading)]">
                <TrendingUp className="w-5 h-5 inline mr-1 text-primary" /> সিরিয়াল বিশ্লেষণ
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-bg rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-primary">{analysis.collectibilityScore}/10</div>
                  <div className="text-xs text-text-muted mt-1 font-[family-name:var(--font-heading)]">সংগ্রহযোগ্যতা স্কোর</div>
                </div>
                <div className="bg-bg rounded-lg p-4 text-center">
                  <div className="text-lg font-bold text-success font-[family-name:var(--font-heading)]">
                    {formatBDT(analysis.suggestedPriceRange.min)} — {formatBDT(analysis.suggestedPriceRange.max)}
                  </div>
                  <div className="text-xs text-text-muted mt-1 font-[family-name:var(--font-heading)]">প্রস্তাবিত মূল্য</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="card p-6">
              <h3 className="text-lg font-bold mb-3 font-[family-name:var(--font-heading)]">বিবরণ</h3>
              <p className="text-text-muted leading-relaxed font-[family-name:var(--font-heading)]">
                {listing.description}
              </p>
            </div>
          </div>

          {/* Right — Sticky Sidebar (2 cols) */}
          <div className="lg:col-span-2">
            <div className="card p-6 space-y-5 lg:sticky lg:top-24">
              {/* Denomination */}
              <span 
                className="inline-block px-4 py-1.5 rounded-full text-white text-sm font-bold"
                style={{ backgroundColor: denominationColors[listing.denomination] || '#1B4332' }}
              >
                ৳{listing.denomination} নোট
              </span>

              {/* Price */}
              <div>
                <p className="text-sm text-text-muted font-[family-name:var(--font-heading)]">বিক্রয় মূল্য</p>
                <p className="text-3xl font-bold text-primary font-[family-name:var(--font-heading)]">
                  {formatBDT(listing.askingPrice)}
                </p>
              </div>

              {/* Seller Card */}
              <div className="bg-bg rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                    {seller.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold font-[family-name:var(--font-heading)]">{seller.name}</p>
                      {seller.isVerified && <Shield className="w-4 h-4 text-success" />}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-muted">
                      <Star className="w-3.5 h-3.5 text-accent fill-accent" />
                      <span>{seller.rating}</span>
                      <span>•</span>
                      <span className="font-[family-name:var(--font-heading)]">{seller.totalSales}টি বিক্রয়</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button className="btn btn-green w-full justify-center">
                  <MessageCircle className="w-4 h-4" /> মেসেজ করুন
                </button>
                <button onClick={() => setShowOffer(true)} className="btn btn-gold w-full justify-center">
                  <DollarSign className="w-4 h-4" /> অফার করুন
                </button>
                <button className="btn btn-gold-outline w-full justify-center">
                  <Gift className="w-4 h-4" /> গিফট হিসেবে কিনুন
                </button>
                <button 
                  onClick={() => setWishlisted(!wishlisted)}
                  className={`btn w-full justify-center ${wishlisted ? 'btn-green' : 'btn-green-outline'}`}
                >
                  <Heart className={`w-4 h-4 ${wishlisted ? 'fill-white' : ''}`} /> 
                  {wishlisted ? 'ওয়াচলিস্টে আছে' : 'ওয়াচলিস্টে রাখুন'}
                </button>
              </div>

              {/* Condition & Date */}
              <div className="border-t border-border pt-4 space-y-2 text-sm text-text-muted font-[family-name:var(--font-heading)]">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <span>অবস্থা: <strong className="text-text">{listing.condition === 'uncirculated' ? 'আনসার্কুলেটেড' : listing.condition === 'good' ? 'ভালো' : 'মোটামুটি'}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>তারিখ: {new Date(listing.createdAt).toLocaleDateString('bn-BD')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Offer Modal */}
        {showOffer && (
          <div className="modal-overlay" onClick={() => setShowOffer(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h3 className="text-xl font-bold mb-4 font-[family-name:var(--font-heading)]">💰 অফার করুন</h3>
              <p className="text-sm text-text-muted mb-4 font-[family-name:var(--font-heading)]">
                বিক্রেতা মূল্য: <strong>{formatBDT(listing.askingPrice)}</strong>
              </p>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold mb-1 block font-[family-name:var(--font-heading)]">আপনার অফার মূল্য (BDT)</label>
                  <input
                    type="number"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    placeholder="৳"
                    className="input text-2xl text-center font-bold"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1 block font-[family-name:var(--font-heading)]">বার্তা (ঐচ্ছিক)</label>
                  <textarea
                    value={offerMessage}
                    onChange={(e) => setOfferMessage(e.target.value)}
                    placeholder="বিক্রেতার কাছে কিছু বলুন..."
                    className="input resize-none h-20"
                  />
                </div>
                <p className="text-xs text-text-muted font-[family-name:var(--font-heading)]">
                  বিক্রেতা ৪৮ ঘণ্টায় সাড়া দেবেন
                </p>
                <button className="btn btn-gold w-full justify-center">
                  অফার পাঠান
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Related Listings */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6 font-[family-name:var(--font-heading)]">এরকম আরো নোট</h2>
          <div className="grid-listings">
            {relatedListings.map(l => (
              <NoteCard key={l._id} listing={l} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
