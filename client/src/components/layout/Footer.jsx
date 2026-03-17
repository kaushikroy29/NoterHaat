import { Link } from 'react-router-dom';
import { Leaf, Facebook, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-accent" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl font-bold font-[family-name:var(--font-heading)]">NoterHaat</span>
                <span className="text-xs text-accent font-[family-name:var(--font-heading)]">নোটের হাট</span>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed font-[family-name:var(--font-heading)]">
              বাংলাদেশের প্রথম বিশেষ সিরিয়াল নম্বরের নোট কেনাবেচার মার্কেটপ্লেস
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-accent font-semibold mb-4 font-[family-name:var(--font-heading)]">দ্রুত লিংক</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/browse', label: 'নোট খুঁজুন' },
                { to: '/date-match', label: 'তারিখ মিলান' },
                { to: '/post', label: 'নোট বিক্রি করুন' },
                { to: '/wanted', label: 'চাহিদা বোর্ড' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-white/60 hover:text-accent transition-colors text-sm font-[family-name:var(--font-heading)] no-underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-accent font-semibold mb-4 font-[family-name:var(--font-heading)]">ক্যাটাগরি</h3>
            <ul className="space-y-2.5">
              {['ফ্যান্সি নম্বর', 'রাডার নম্বর', 'সলিড নম্বর', 'তারিখ মিল', 'লো সিরিয়াল'].map((cat) => (
                <li key={cat}>
                  <Link to="/browse" className="text-white/60 hover:text-accent transition-colors text-sm font-[family-name:var(--font-heading)] no-underline">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-accent font-semibold mb-4 font-[family-name:var(--font-heading)]">যোগাযোগ</h3>
            <ul className="space-y-2.5 text-white/60 text-sm font-[family-name:var(--font-heading)]">
              <li>📧 info@noterhaat.com</li>
              <li>📞 +880 1XXX-XXXXXX</li>
              <li>📍 ঢাকা, বাংলাদেশ</li>
            </ul>
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-accent hover:text-primary-dark flex items-center justify-center transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-accent hover:text-primary-dark flex items-center justify-center transition-all">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-white/40 text-sm font-[family-name:var(--font-heading)]">
          <p>© ২০২৬ NoterHaat — সর্বস্বত্ব সংরক্ষিত</p>
          <p>Made with ❤️ in Bangladesh</p>
        </div>
      </div>
    </footer>
  );
}
