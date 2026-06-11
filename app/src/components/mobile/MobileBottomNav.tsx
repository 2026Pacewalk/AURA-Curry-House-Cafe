import { Link, useLocation } from 'react-router';
import { Home, UtensilsCrossed, ClipboardList, Tag, Phone } from 'lucide-react';

const tabs = [
  { icon: Home, label: 'Home', to: '/' },
  { icon: UtensilsCrossed, label: 'Menu', to: '/menu' },
  { icon: ClipboardList, label: 'Orders', to: '#' },
  { icon: Tag, label: 'Offers', to: '#' },
  { icon: Phone, label: 'Contact', to: 'tel:0721401757' },
];

export default function MobileBottomNav() {
  const location = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[90] lg:hidden"
      style={{
        background: 'rgba(8,8,8,0.95)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(245,240,232,0.06)',
        paddingBottom: 'env(safe-area-inset-bottom, 6px)',
      }}
    >
      <div className="flex items-center justify-around h-[60px]">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.to;
          const isExternal = tab.to.startsWith('tel:');

          const inner = (
            <div className="flex flex-col items-center justify-center gap-[3px] relative min-w-[48px] min-h-[48px]">
              {isActive && (
                <div
                  className="absolute -top-[1px] w-5 h-[2px] rounded-full"
                  style={{ background: '#c9a84c' }}
                />
              )}
              <tab.icon
                className={`w-5 h-5 transition-colors ${isActive ? 'text-gold' : 'text-[#8d8073]'}`}
                strokeWidth={isActive ? 2.2 : 1.5}
              />
              <span
                className={`text-[9px] tracking-[0.06em] transition-colors ${isActive ? 'text-gold font-semibold' : 'text-[#8d8073]'}`}
              >
                {tab.label}
              </span>
            </div>
          );

          return isExternal ? (
            <a key={tab.label} href={tab.to} className="flex justify-center items-center">
              {inner}
            </a>
          ) : (
            <Link key={tab.label} to={tab.to} className="flex justify-center items-center">
              {inner}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
