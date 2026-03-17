import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Calendar, Search, Gift } from 'lucide-react';
import { findDateInSerial, formatDateBengali, getOccasionLabel } from '../utils/dateFinder';
import NoteCard from '../components/cards/NoteCard';
import { useStore } from '../store/useStore';

const denominations = [10, 20, 50, 100, 200, 500, 1000];

const patternTypes = [
  { type: 'DDMM', icon: '📅', example: '1402', desc: 'দিন + মাস — "1402" (১৪ ফেব্রুয়ারি)' },
  { type: 'MMDD', icon: '📅', example: '0214', desc: 'মাস + দিন — "0214" (ফেব্রুয়ারি ১৪)' },
  { type: 'DDMMYY', icon: '📅', example: '140295', desc: 'দিন + মাস + বছর — "140295"' },
  { type: 'DDMMYYYY', icon: '📅', example: '14021995', desc: 'সম্পূর্ণ তারিখ — "14021995"' },
  { type: 'YYYY', icon: '📅', example: '1995', desc: 'শুধু বছর — "1995"' },
  { type: 'MMYYYY', icon: '📅', example: '021995', desc: 'মাস + বছর — "021995"' },
];

export default function DateMatchPage() {
  const [searchParams] = useSearchParams();
  const [date1, setDate1] = useState(searchParams.get('date') || '');
  const [date2, setDate2] = useState('');
  const [occasion, setOccasion] = useState(searchParams.get('occasion') || '');
  const [selectedDenom, setSelectedDenom] = useState(null);
  const [filterTab, setFilterTab] = useState('all');
  const [searched, setSearched] = useState(false);
  const { listings } = useStore();

  const datePatterns = useMemo(() => {
    if (!date1) return null;
    const parts = date1.split('-');
    if (parts.length === 3) {
      return findDateInSerial(`${parts[2]}/${parts[1]}/${parts[0]}`);
    }
    return null;
  }, [date1]);

  const matchedListings = useMemo(() => {
    if (!datePatterns || !searched) return [];
    return listings.filter(listing => {
      const serial = listing.serialNumber.replace(/[^0-9]/g, '');
      const denomMatch = !selectedDenom || listing.denomination === selectedDenom;
      const patternMatch = datePatterns.patterns.some(p => serial.includes(p.pattern));
      return denomMatch && patternMatch;
    });
  }, [datePatterns, listings, selectedDenom, searched]);

  const handleSearch = () => {
    setSearched(true);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="paper-texture py-12 md:py-20">
        <div className="container-custom text-center max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4 font-[family-name:var(--font-heading)]">
            তোমার জীবনের সেরা দিনটি{' '}
            <span className="text-gradient">ধরে রাখো একটি নোটে</span>
          </h1>
          <p className="text-lg text-text-muted font-[family-name:var(--font-heading)]">
            জন্মদিন, বিবাহবার্ষিকী, প্রথম দেখার দিন — যেকোনো বিশেষ মুহূর্তকে অর্থবহ করে তোলো
          </p>
        </div>
      </section>

      {/* Date Input Form */}
      <section className="section">
        <div className="container-custom max-w-3xl mx-auto">
          <div className="card p-6 md:p-8 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold mb-1.5 block font-[family-name:var(--font-heading)]">
                  <Calendar className="w-4 h-4 inline mr-1" /> তোমার বিশেষ তারিখ
                </label>
                <input
                  type="date"
                  value={date1}
                  onChange={(e) => { setDate1(e.target.value); setSearched(false); }}
                  className="input"
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-1.5 block font-[family-name:var(--font-heading)]">
                  <Gift className="w-4 h-4 inline mr-1" /> অন্য কারো তারিখ (গিফটের জন্য)
                </label>
                <input
                  type="date"
                  value={date2}
                  onChange={(e) => setDate2(e.target.value)}
                  className="input"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold mb-1.5 block font-[family-name:var(--font-heading)]">উপলক্ষ</label>
              <div className="flex flex-wrap gap-2">
                {['birthday', 'anniversary', 'graduation', 'firstMeeting', 'other'].map((occ) => {
                  const { emoji, bn } = getOccasionLabel(occ);
                  return (
                    <button
                      key={occ}
                      onClick={() => setOccasion(occ)}
                      className={`pill ${occasion === occ ? 'active' : ''}`}
                    >
                      {emoji} {bn}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold mb-1.5 block font-[family-name:var(--font-heading)]">নোটের মূল্যমান</label>
              <div className="flex flex-wrap gap-2">
                {denominations.map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDenom(selectedDenom === d ? null : d)}
                    className={`pill ${selectedDenom === d ? 'active' : ''}`}
                  >
                    ৳{d}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleSearch} className="btn btn-gold btn-lg w-full justify-center">
              <Search className="w-5 h-5" /> নোট খুঁজুন
            </button>
          </div>
        </div>
      </section>

      {/* How It Matches */}
      <section className="section bg-white">
        <div className="container-custom">
          <h2 className="text-2xl font-bold text-center mb-8 font-[family-name:var(--font-heading)]">
            কীভাবে তারিখ মেলানো হয়
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {patternTypes.map((pt) => (
              <div key={pt.type} className="card p-5 space-y-2 hover:border-accent">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{pt.icon}</span>
                  <span className="serial-number text-primary">{pt.type}</span>
                </div>
                <p className="text-sm text-text-muted font-[family-name:var(--font-heading)]">{pt.desc}</p>
                {datePatterns && (
                  <div className="pt-2 border-t border-border">
                    <span className="serial-number text-sm text-accent">
                      → {datePatterns.patterns.find(p => p.type === pt.type)?.pattern || '—'}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      {searched && (
        <section className="section">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)]">
                🔍 ফলাফল
              </h2>
              <span className="text-sm text-text-muted font-[family-name:var(--font-heading)]">
                {matchedListings.length}টি নোট পাওয়া গেছে
              </span>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 pills-scroll">
              {[
                { key: 'all', label: 'সব' },
                { key: 'start', label: 'সিরিয়াল শুরুতে' },
                { key: 'middle', label: 'সিরিয়াল মাঝে' },
                { key: 'end', label: 'সিরিয়াল শেষে' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilterTab(tab.key)}
                  className={`pill ${filterTab === tab.key ? 'active' : ''}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {matchedListings.length > 0 ? (
              <div className="grid-listings">
                {matchedListings.map((listing) => (
                  <NoteCard
                    key={listing._id}
                    listing={listing}
                    highlight={datePatterns?.patterns[0]?.pattern}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-text-muted mb-2 font-[family-name:var(--font-heading)]">
                  এই তারিখের কোনো নোট এখনো নেই
                </h3>
                <p className="text-text-muted mb-6 font-[family-name:var(--font-heading)]">
                  চাহিদা বোর্ডে পোস্ট করুন — বিক্রেতারা আপনাকে খুঁজে বের করবেন!
                </p>
                <Link to="/wanted" className="btn btn-gold">
                  📋 চাহিদা পোস্ট করুন
                </Link>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
