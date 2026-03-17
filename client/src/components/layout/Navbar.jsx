import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, X, Leaf } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { searchQuery, setSearchQuery, isAuthenticated } = useStore();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <div className="container-custom">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 no-underline shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-bold text-primary font-[family-name:var(--font-heading)]">
                NoterHaat
              </span>
              <span className="text-[11px] text-accent font-semibold font-[family-name:var(--font-heading)]">
                নোটের হাট
              </span>
            </div>
          </Link>

          {/* Search Bar — Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Serial নম্বর, তারিখ বা ক্যাটাগরি খুঁজুন..."
                className="input pl-10 py-2.5 text-sm rounded-full bg-bg border-border"
              />
            </div>
          </form>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/post" className="btn btn-gold-outline btn-sm">
              বিক্রি করুন
            </Link>
            <Link to="/chat" className="relative p-2 hover:bg-bg rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-text-muted" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
            </Link>
            {useStore.getState().user?.role === 'admin' && (
              <Link to="/admin" className="btn btn-gold-outline btn-sm">
                Admin Panel
              </Link>
            )}
            {isAuthenticated ? (
              <Link to="/profile/me" className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                র
              </Link>

            ) : (
              <Link to="/browse" className="btn btn-green btn-sm">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 hover:bg-bg rounded-lg transition-colors"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-3 animate-[slideUp_0.2s_ease]">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Serial নম্বর, তারিখ বা ক্যাটাগরি খুঁজুন..."
                  className="input pl-10 text-sm"
                />
              </div>
            </form>
            <div className="flex gap-2">
              <Link to="/post" className="btn btn-gold-outline btn-sm flex-1" onClick={() => setMenuOpen(false)}>
                বিক্রি করুন
              </Link>
              <Link to="/browse" className="btn btn-green btn-sm flex-1" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
