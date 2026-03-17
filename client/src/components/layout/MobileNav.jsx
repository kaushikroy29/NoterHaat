import { NavLink } from 'react-router-dom';
import { Home, Search, PlusCircle, ClipboardList, MessageCircle } from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'হোম' },
  { to: '/browse', icon: Search, label: 'খুঁজুন' },
  { to: '/post', icon: PlusCircle, label: 'পোস্ট' },
  { to: '/wanted', icon: ClipboardList, label: 'চাওয়া' },
  { to: '/chat', icon: MessageCircle, label: 'মেসেজ' },
];

export default function MobileNav() {
  return (
    <div className="mobile-nav md:hidden">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `mobile-nav-item ${isActive ? 'active' : ''}`
          }
        >
          <Icon />
          <span>{label}</span>
        </NavLink>
      ))}
    </div>
  );
}
