import { Link } from 'react-router-dom';
import { Copy, Star, Gift, Check } from 'lucide-react';
import { useState } from 'react';
import { formatBDT, toBengaliNumeral } from '../../utils/serialAnalyzer';

const badgeColorMap = {
  radar: 'badge-purple',
  solid: 'badge-blue',
  fancy: 'badge-gold',
  dateMatch: 'badge-pink',
  lowSerial: 'badge-green',
  repeating: 'badge-gold',
  birthday: 'badge-pink',
  anniversary: 'badge-pink',
};

const badgeLabelMap = {
  radar: 'রাডার',
  solid: 'সলিড',
  fancy: 'ফ্যান্সি',
  dateMatch: 'তারিখ মিল',
  lowSerial: 'লো সিরিয়াল',
  repeating: 'রিপিটিং',
  birthday: 'জন্মদিন মিল',
  anniversary: 'বিবাহবার্ষিকী',
};

const denominationColors = {
  10: '#16A34A',
  20: '#0D9488',
  50: '#7C3AED',
  100: '#DC2626',
  200: '#EA580C', 
  500: '#2563EB',
  1000: '#1B4332',
};

export default function NoteCard({ listing, highlight = '' }) {
  const [copied, setCopied] = useState(false);

  const copySerial = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(listing.serialNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderSerial = () => {
    if (!highlight || !listing.serialNumber.includes(highlight)) {
      return <span>{listing.serialNumber}</span>;
    }
    const idx = listing.serialNumber.indexOf(highlight);
    return (
      <>
        {listing.serialNumber.slice(0, idx)}
        <span className="serial-highlight">{highlight}</span>
        {listing.serialNumber.slice(idx + highlight.length)}
      </>
    );
  };

  const seller = listing.sellerId || {};

  return (
    <Link to={`/listing/${listing._id}`} className="no-underline">
      <div className="card gold-shimmer group cursor-pointer">
        {/* Note Image */}
        <div className="relative h-44 bg-gradient-to-br from-bg to-border overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="text-6xl font-bold opacity-10 font-[family-name:var(--font-mono)]"
              style={{ color: denominationColors[listing.denomination] || '#1B4332' }}
            >
              ৳{listing.denomination}
            </div>
          </div>
          {/* Denomination Badge */}
          <div 
            className="absolute top-3 left-3 px-3 py-1 rounded-full text-white text-xs font-bold"
            style={{ backgroundColor: denominationColors[listing.denomination] || '#1B4332' }}
          >
            ৳{listing.denomination}
          </div>
          {/* Gift Badge */}
          {listing.isGiftable && (
            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
              <Gift className="w-4 h-4 text-pink" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Serial Number */}
          <div className="flex items-center justify-between">
            <div className="serial-number text-lg text-primary">
              {renderSerial()}
            </div>
            <button 
              onClick={copySerial}
              className="p-1.5 hover:bg-bg rounded-md transition-colors"
              title="কপি করুন"
            >
              {copied ? (
                <Check className="w-4 h-4 text-success" />
              ) : (
                <Copy className="w-4 h-4 text-text-muted" />
              )}
            </button>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-1.5">
            {listing.serialPatterns?.map((pattern) => (
              <span key={pattern} className={`badge ${badgeColorMap[pattern] || 'badge-gold'}`}>
                {badgeLabelMap[pattern] || pattern}
              </span>
            ))}
          </div>

          {/* Date Match Info */}
          {listing.matchingDates?.length > 0 && (
            <p className="text-xs text-text-muted font-[family-name:var(--font-heading)]">
              📅 তারিখ মিল: {listing.matchingDates.join(', ')}
            </p>
          )}

          {/* Price */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-lg font-bold text-primary font-[family-name:var(--font-heading)]">
              মূল্য: {formatBDT(listing.askingPrice)}
            </span>
          </div>

          {/* Seller */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                {seller.name?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="text-xs font-medium text-text font-[family-name:var(--font-heading)]">{seller.name || 'Unknown'}</p>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-accent fill-accent" />
                  <span className="text-[11px] text-text-muted">{seller.rating || '4.5'}</span>
                </div>
              </div>
            </div>
            {seller.isVerified && (
              <span className="badge badge-green text-[10px]">✓ যাচাইকৃত</span>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button className="btn btn-green-outline btn-sm flex-1 text-xs">
              অফার করুন
            </button>
            <button className="btn btn-green btn-sm flex-1 text-xs">
              মেসেজ করুন
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
