import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, Star, ChevronDown, ChevronUp } from 'lucide-react';
import NoteCard from '../components/cards/NoteCard';
import { useStore } from '../store/useStore';

const denominationOptions = [10, 20, 50, 100, 200, 500, 1000];
const categoryOptions = [
  { key: 'fancy', label: 'ফ্যান্সি' },
  { key: 'radar', label: 'রাডার' },
  { key: 'solid', label: 'সলিড' },
  { key: 'dateMatch', label: 'তারিখ মিল' },
  { key: 'lowSerial', label: 'লো সিরিয়াল' },
  { key: 'repeating', label: 'রিপিটিং' },
];
const conditionOptions = [
  { key: 'uncirculated', label: 'আনসার্কুলেটেড' },
  { key: 'good', label: 'ভালো' },
  { key: 'fair', label: 'মোটামুটি' },
];
const sortOptions = [
  { key: 'recent', label: 'সাম্প্রতিক' },
  { key: 'priceLow', label: 'মূল্য কম-বেশি' },
  { key: 'priceHigh', label: 'মূল্য বেশি-কম' },
  { key: 'popular', label: 'সর্বাধিক অফার' },
];

export default function BrowsePage() {
  const [searchParams] = useSearchParams();
  const { listings, searchQuery } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sort, setSort] = useState('recent');
  const [filters, setFilters] = useState({
    denominations: [],
    categories: searchParams.get('category') ? [searchParams.get('category')] : [],
    priceMin: '',
    priceMax: '',
    conditions: [],
    minRating: 0,
  });

  const toggleFilter = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value) 
        ? prev[type].filter(v => v !== value) 
        : [...prev[type], value]
    }));
  };

  const resetFilters = () => {
    setFilters({ denominations: [], categories: [], priceMin: '', priceMax: '', conditions: [], minRating: 0 });
  };

  const filteredListings = useMemo(() => {
    let result = [...listings];

    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(l => 
        l.serialNumber.toLowerCase().includes(q) ||
        l.description?.toLowerCase().includes(q)
      );
    }

    // Denomination filter
    if (filters.denominations.length > 0) {
      result = result.filter(l => filters.denominations.includes(l.denomination));
    }

    // Category filter
    if (filters.categories.length > 0) {
      result = result.filter(l => 
        l.serialPatterns?.some(p => filters.categories.includes(p))
      );
    }

    // Price filter
    if (filters.priceMin) result = result.filter(l => l.askingPrice >= parseInt(filters.priceMin));
    if (filters.priceMax) result = result.filter(l => l.askingPrice <= parseInt(filters.priceMax));

    // Condition filter
    if (filters.conditions.length > 0) {
      result = result.filter(l => filters.conditions.includes(l.condition));
    }

    // Sort
    if (sort === 'priceLow') result.sort((a, b) => a.askingPrice - b.askingPrice);
    else if (sort === 'priceHigh') result.sort((a, b) => b.askingPrice - a.askingPrice);
    else result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return result;
  }, [listings, searchQuery, filters, sort]);

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Denomination */}
      <div>
        <h3 className="text-sm font-bold mb-3 font-[family-name:var(--font-heading)]">নোটের মূল্যমান</h3>
        <div className="space-y-2">
          {denominationOptions.map(d => (
            <label key={d} className="flex items-center gap-2 cursor-pointer text-sm font-[family-name:var(--font-heading)]">
              <input
                type="checkbox"
                checked={filters.denominations.includes(d)}
                onChange={() => toggleFilter('denominations', d)}
                className="w-4 h-4 accent-primary rounded"
              />
              ৳{d}
            </label>
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <h3 className="text-sm font-bold mb-3 font-[family-name:var(--font-heading)]">ক্যাটাগরি</h3>
        <div className="space-y-2">
          {categoryOptions.map(c => (
            <label key={c.key} className="flex items-center gap-2 cursor-pointer text-sm font-[family-name:var(--font-heading)]">
              <input
                type="checkbox"
                checked={filters.categories.includes(c.key)}
                onChange={() => toggleFilter('categories', c.key)}
                className="w-4 h-4 accent-primary rounded"
              />
              {c.label}
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-bold mb-3 font-[family-name:var(--font-heading)]">মূল্য পরিসীমা (৳)</h3>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="সর্বনিম্ন"
            value={filters.priceMin}
            onChange={(e) => setFilters(prev => ({ ...prev, priceMin: e.target.value }))}
            className="input text-sm py-2"
          />
          <input
            type="number"
            placeholder="সর্বোচ্চ"
            value={filters.priceMax}
            onChange={(e) => setFilters(prev => ({ ...prev, priceMax: e.target.value }))}
            className="input text-sm py-2"
          />
        </div>
      </div>

      {/* Condition */}
      <div>
        <h3 className="text-sm font-bold mb-3 font-[family-name:var(--font-heading)]">অবস্থা</h3>
        <div className="space-y-2">
          {conditionOptions.map(c => (
            <label key={c.key} className="flex items-center gap-2 cursor-pointer text-sm font-[family-name:var(--font-heading)]">
              <input
                type="checkbox"
                checked={filters.conditions.includes(c.key)}
                onChange={() => toggleFilter('conditions', c.key)}
                className="w-4 h-4 accent-primary rounded"
              />
              {c.label}
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="text-sm font-bold mb-3 font-[family-name:var(--font-heading)]">বিক্রেতার রেটিং</h3>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(s => (
            <button
              key={s}
              onClick={() => setFilters(prev => ({ ...prev, minRating: s }))}
              className="p-1"
            >
              <Star className={`w-5 h-5 ${s <= filters.minRating ? 'text-accent fill-accent' : 'text-border'}`} />
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={resetFilters} className="text-sm text-text-muted hover:text-primary font-[family-name:var(--font-heading)]">
          রিসেট
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <div className="container-custom py-6">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="btn btn-green-outline btn-sm"
          >
            <SlidersHorizontal className="w-4 h-4" /> ফিল্টার
            {sidebarOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {sidebarOpen && (
            <div className="card p-5 mt-3">
              <FilterSidebar />
            </div>
          )}
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="card p-5 sticky top-24">
              <h2 className="text-lg font-bold mb-4 font-[family-name:var(--font-heading)]">ফিল্টার</h2>
              <FilterSidebar />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Sort & Count */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <p className="text-sm text-text-muted font-[family-name:var(--font-heading)]">
                <span className="font-bold text-text">{filteredListings.length}</span>টি নোট পাওয়া গেছে
              </p>
              <div className="flex gap-2 pills-scroll">
                {sortOptions.map(s => (
                  <button
                    key={s.key}
                    onClick={() => setSort(s.key)}
                    className={`pill text-xs ${sort === s.key ? 'active' : ''}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid */}
            {filteredListings.length > 0 ? (
              <div className="grid-listings">
                {filteredListings.map(listing => (
                  <NoteCard key={listing._id} listing={listing} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-text-muted font-[family-name:var(--font-heading)]">
                  কোনো নোট পাওয়া যায়নি
                </h3>
                <p className="text-text-muted mt-2 font-[family-name:var(--font-heading)]">
                  ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
