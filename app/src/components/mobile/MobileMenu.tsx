import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  X, Search, ShoppingBag, Home, UtensilsCrossed, CalendarDays, Phone,
  MessageCircle, Navigation, Clock, ArrowRight, Facebook, Instagram, MapPin,
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';

interface Props {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { icon: Home, label: 'Home', to: '/' },
  { icon: UtensilsCrossed, label: 'Our Menu', to: '/menu' },
  { icon: CalendarDays, label: 'Reserve a Table', to: '/#reserve' },
  { icon: Phone, label: 'Contact', to: '/#footer' },
];

const categories = [
  { name: 'Quick Snacks', slug: 'quick-snacks' },
  { name: 'South Indian', slug: 'south-indian' },
  { name: 'North Indian', slug: 'north-indian' },
  { name: 'Indo Chinese', slug: 'indo-chinese' },
  { name: 'Biryani', slug: 'biryani' },
  { name: 'Desserts', slug: 'desserts' },
  { name: 'Beverages', slug: 'beverages' },
];

export default function MobileMenu({ open, onClose }: Props) {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const [query, setQuery] = useState('');

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const go = (to: string) => { onClose(); navigate(to); };
  const submitSearch = () => {
    const q = query.trim();
    onClose();
    navigate(q ? `/menu?q=${encodeURIComponent(q)}` : '/menu');
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-[100] lg:hidden flex flex-col animate-in fade-in duration-200" style={{ background: '#0a0a0a' }}>
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 shrink-0" style={{ height: '64px', borderBottom: '1px solid rgba(201,168,76,0.12)' }}>
        <Link to="/" onClick={onClose} className="flex flex-col">
          <span className="font-serif text-gold-gradient text-[22px] leading-none tracking-[0.16em]">AURA</span>
          <span className="text-sand text-[8px] tracking-[0.3em] uppercase mt-1">Curry House Cafe</span>
        </Link>
        <button
          onClick={onClose}
          className="flex items-center justify-center w-11 h-11 rounded-full active:bg-white/5 transition-colors"
          style={{ border: '1px solid rgba(201,168,76,0.3)' }}
          aria-label="Close menu"
        >
          <X className="w-5 h-5 text-gold" strokeWidth={2} />
        </button>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto px-4 pt-4" style={{ paddingBottom: '32px' }}>
        {/* SEARCH */}
        <div className="relative mb-3">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sand" />
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') submitSearch(); }}
            enterKeyHint="search"
            placeholder="Search dishes…"
            className="w-full rounded-full text-parchment text-[14px] pl-11 pr-4 py-3 outline-none focus:border-gold transition-colors placeholder:text-[rgba(168,155,140,0.4)]"
            style={{ background: 'rgba(245,240,232,0.05)', border: '1px solid rgba(245,240,232,0.12)' }}
          />
        </div>

        {/* ORDER ONLINE CTA */}
        <button onClick={() => go('/menu')} className="btn-gold w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-[13px] font-bold tracking-[0.12em] mb-2">
          <ShoppingBag className="w-4 h-4" /> ORDER ONLINE
        </button>
        <button onClick={() => go('/checkout')} className="btn-outline w-full flex items-center justify-between rounded-xl px-4 py-3 text-[13px] font-medium">
          <span className="flex items-center gap-2"><ShoppingBag className="w-4 h-4" /> View Cart</span>
          <span className="flex items-center gap-2 text-gold">
            {totalItems > 0 && <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-gold text-dark text-[10px] font-bold flex items-center justify-center">{totalItems}</span>}
            <ArrowRight className="w-4 h-4" />
          </span>
        </button>

        {/* PRIMARY NAV */}
        <nav className="mt-5 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              onClick={onClose}
              className="group flex items-center gap-4 px-4 py-3.5 rounded-xl active:scale-[0.98] transition-all"
              style={{ background: 'rgba(245,240,232,0.03)', border: '1px solid rgba(245,240,232,0.06)' }}
            >
              <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)' }}>
                <item.icon className="w-5 h-5 text-gold" strokeWidth={1.8} />
              </div>
              <span className="text-parchment text-[15px] font-medium tracking-wide flex-1">{item.label}</span>
              <ArrowRight className="w-4 h-4 text-sand group-active:text-gold transition-colors" />
            </Link>
          ))}
        </nav>

        {/* BROWSE BY CATEGORY */}
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="eyebrow text-base">Browse by Category</span>
            <span className="h-px flex-1 bg-gradient-to-r from-gold/30 to-transparent" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => go(`/menu?cat=${cat.slug}`)}
                className="flex items-center justify-between px-4 py-3.5 rounded-xl text-parchment text-[13px] font-medium active:scale-[0.97] transition-transform"
                style={{ background: 'rgba(245,240,232,0.03)', border: '1px solid rgba(201,168,76,0.15)' }}
              >
                {cat.name}
                <ArrowRight className="w-3.5 h-3.5 text-gold/60" />
              </button>
            ))}
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-3 gap-2 mt-6">
          <a href="tel:0721401757" className="flex flex-col items-center gap-2 py-4 rounded-xl active:scale-[0.97] transition-transform" style={{ background: 'rgba(245,240,232,0.04)', border: '1px solid rgba(245,240,232,0.08)' }}>
            <Phone className="w-5 h-5 text-gold" strokeWidth={1.8} />
            <span className="text-parchment text-[11px] tracking-wider">Call</span>
          </a>
          <a href="https://wa.me/61412345678" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 py-4 rounded-xl active:scale-[0.97] transition-transform" style={{ background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.15)' }}>
            <MessageCircle className="w-5 h-5 text-[#25D366]" strokeWidth={1.8} />
            <span className="text-parchment text-[11px] tracking-wider">WhatsApp</span>
          </a>
          <a href="https://maps.google.com/?q=3/16+Bryants+Rd+Shailer+Park+QLD+4128" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 py-4 rounded-xl active:scale-[0.97] transition-transform" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}>
            <Navigation className="w-5 h-5 text-blue-400" strokeWidth={1.8} />
            <span className="text-parchment text-[11px] tracking-wider">Directions</span>
          </a>
        </div>

        {/* OPENING HOURS */}
        <div className="p-4 rounded-xl mt-6" style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.12)' }}>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-gold" />
            <span className="text-gold text-[12px] uppercase tracking-wider font-semibold">Opening Hours</span>
            <span className="ml-auto flex items-center gap-1.5 text-[10px] text-green-400"><span className="w-1.5 h-1.5 rounded-full bg-green-400" /> Open Now</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-[13px]"><span className="text-sand">Mon – Thu</span><span className="text-parchment">10:00 AM – 09:30 PM</span></div>
            <div className="flex justify-between text-[13px]"><span className="text-sand">Fri – Sat</span><span className="text-parchment">10:00 AM – 10:00 PM</span></div>
            <div className="flex justify-between text-[13px]"><span className="text-sand">Sunday</span><span className="text-parchment">10:00 AM – 09:30 PM</span></div>
          </div>
        </div>

        {/* SOCIAL */}
        <div className="flex items-center justify-center gap-3 mt-6">
          {[{ Icon: Facebook, href: 'https://facebook.com' }, { Icon: Instagram, href: 'https://instagram.com' }].map(({ Icon, href }, i) => (
            <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full flex items-center justify-center active:scale-95 transition-transform" style={{ background: 'rgba(245,240,232,0.04)', border: '1px solid rgba(245,240,232,0.08)' }}>
              <Icon className="w-4 h-4 text-sand" strokeWidth={1.8} />
            </a>
          ))}
        </div>

        {/* FOOTER */}
        <div className="text-center mt-6 pb-4">
          <p className="flex items-center justify-center gap-1.5 text-sand text-[12px]"><MapPin className="w-3.5 h-3.5 text-gold/60" /> 3/16 Bryants Rd, Shailer Park QLD 4128</p>
          <Link to="/credits" onClick={onClose} className="inline-block text-sand text-[11px] mt-3 hover:text-gold transition-colors">Photo Credits</Link>
          <p className="text-sand/60 text-[11px] mt-2">Designed by PACEWALK</p>
        </div>
      </div>
    </div>
  );
}
