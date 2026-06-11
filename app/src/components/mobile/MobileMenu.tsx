import { useEffect } from 'react';
import { Link } from 'react-router';
import { X, Home, UtensilsCrossed, Star, CalendarDays, Tag, Phone, MessageCircle, Navigation, Clock } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { icon: Home, label: 'Home', to: '/' },
  { icon: UtensilsCrossed, label: 'Menu', to: '/menu' },
  { icon: Star, label: 'Best Sellers', to: '/menu' },
  { icon: CalendarDays, label: 'Reserve Table', to: '/#reserve' },
  { icon: Tag, label: 'Offers', to: '#' },
];

const categories = [
  'Quick Snacks',
  'South Indian',
  'North Indian',
  'Indo Chinese',
  'Biryani',
  'Desserts',
  'Beverages',
];

export default function MobileMenu({ open, onClose }: Props) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] lg:hidden" style={{ background: '#0a0a0a' }}>
      {/* TOP BAR */}
      <div
        className="flex items-center justify-between px-4"
        style={{ height: '56px', borderBottom: '1px solid rgba(245,240,232,0.08)' }}
      >
        <span className="font-serif text-gold text-[20px] tracking-[0.12em]">MENU</span>
        <button
          onClick={onClose}
          className="flex items-center justify-center w-12 h-12 rounded-full active:bg-white/5 transition-colors"
          style={{ border: '1px solid rgba(201,168,76,0.3)' }}
          aria-label="Close menu"
        >
          <X className="w-5 h-5 text-gold" strokeWidth={2} />
        </button>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="overflow-y-auto px-4" style={{ height: 'calc(100dvh - 56px)', paddingBottom: '40px' }}>
        {/* MAIN NAV LINKS */}
        <nav className="mt-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              onClick={onClose}
              className="flex items-center gap-4 px-4 py-4 rounded-xl active:scale-[0.98] transition-transform"
              style={{ background: 'rgba(245,240,232,0.03)', border: '1px solid rgba(245,240,232,0.06)' }}
            >
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)' }}
              >
                <item.icon className="w-5 h-5 text-gold" strokeWidth={1.8} />
              </div>
              <span className="text-parchment text-[16px] font-medium tracking-wide">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* DIVIDER */}
        <div className="my-5" style={{ height: '1px', background: 'rgba(245,240,232,0.06)' }} />

        {/* FOOD CATEGORIES */}
        <div>
          <span className="text-gold text-[11px] uppercase tracking-[0.2em] font-semibold">Food Categories</span>
          <div className="grid grid-cols-2 gap-2 mt-3">
            {categories.map((cat) => (
              <Link
                key={cat}
                to="/menu"
                onClick={onClose}
                className="flex items-center justify-center px-3 py-3.5 rounded-xl text-parchment text-[13px] font-medium active:scale-[0.97] transition-transform"
                style={{ background: 'rgba(245,240,232,0.03)', border: '1px solid rgba(201,168,76,0.15)' }}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>

        {/* DIVIDER */}
        <div className="my-5" style={{ height: '1px', background: 'rgba(245,240,232,0.06)' }} />

        {/* OPENING HOURS */}
        <div
          className="p-4 rounded-xl"
          style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.12)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-gold" />
            <span className="text-gold text-[12px] uppercase tracking-wider font-semibold">Opening Hours</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-[13px]">
              <span className="text-sand">Mon – Thu</span>
              <span className="text-parchment">10:00 AM – 09:30 PM</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-sand">Fri – Sat</span>
              <span className="text-parchment">10:00 AM – 10:00 PM</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-sand">Sunday</span>
              <span className="text-parchment">10:00 AM – 09:30 PM</span>
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="my-5" style={{ height: '1px', background: 'rgba(245,240,232,0.06)' }} />

        {/* CONTACT BUTTONS */}
        <div className="grid grid-cols-3 gap-2">
          <a
            href="tel:0721401757"
            className="flex flex-col items-center gap-2 py-4 rounded-xl"
            style={{ background: 'rgba(245,240,232,0.04)', border: '1px solid rgba(245,240,232,0.08)' }}
          >
            <Phone className="w-5 h-5 text-gold" strokeWidth={1.8} />
            <span className="text-parchment text-[11px] tracking-wider">Call</span>
          </a>
          <a
            href="https://wa.me/61412345678"
            className="flex flex-col items-center gap-2 py-4 rounded-xl"
            style={{ background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.15)' }}
          >
            <MessageCircle className="w-5 h-5 text-[#25D366]" strokeWidth={1.8} />
            <span className="text-parchment text-[11px] tracking-wider">WhatsApp</span>
          </a>
          <a
            href="https://maps.google.com/?q=3/16+Bryants+Rd+Shailer+Park+QLD+4128"
            className="flex flex-col items-center gap-2 py-4 rounded-xl"
            style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}
          >
            <Navigation className="w-5 h-5 text-blue-400" strokeWidth={1.8} />
            <span className="text-parchment text-[11px] tracking-wider">Direction</span>
          </a>
        </div>

        {/* DIVIDER */}
        <div className="my-5" style={{ height: '1px', background: 'rgba(245,240,232,0.06)' }} />

        {/* FOOTER */}
        <div className="text-center space-y-2 pb-4">
          <p className="text-sand text-[12px]">3/16 Bryants Rd, Shailer Park QLD 4128</p>
          <p className="text-sand text-[12px]">(07) 2140 1757</p>
          <p className="text-sand text-[11px] mt-3">Designed by PACEWALK</p>
        </div>
      </div>
    </div>
  );
}
