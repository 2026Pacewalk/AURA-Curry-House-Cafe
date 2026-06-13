import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { Phone, Menu, X, ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems } = useCart();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const navLinks = [
    { label: 'HOME', to: '/' },
    { label: 'MENU', to: '/menu' },
    { label: 'ABOUT', to: '/#experience' },
    { label: 'RESERVE', to: '/#reserve' },
    { label: 'CONTACT', to: '/#footer' },
  ];

  return (
    <>
      <header className={`sticky top-[28px] left-0 right-0 z-[1000] transition-all duration-300 ${scrolled ? 'shadow-lg' : ''}`}
        style={{ background: scrolled ? 'rgba(10,10,10,0.96)' : 'rgba(10,10,10,0.88)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: scrolled ? '1px solid rgba(245,240,232,0.06)' : '1px solid transparent' }}>
        <div className="max-w-[1400px] mx-auto flex items-center justify-between h-[60px] px-4 md:px-8 lg:px-[60px]">
          <Link to="/" className="flex flex-col items-start shrink-0">
            <span className="font-serif text-gold-gradient text-[24px] leading-none tracking-[0.18em]">AURA</span>
            <span className="text-sand text-[8px] tracking-[0.3em] uppercase mt-1">Curry House Cafe</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              link.to.startsWith('/#') ? (
                <a key={link.label} href={link.to} className="text-[11px] font-medium tracking-[0.12em] text-parchment hover:text-gold transition-colors">
                  {link.label}
                </a>
              ) : (
                <Link key={link.label} to={link.to} className="text-[11px] font-medium tracking-[0.12em] text-parchment hover:text-gold transition-colors">
                  {link.label}
                </Link>
              )
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <a href="tel:0721401757" className="flex items-center gap-1.5 border rounded-full px-3 py-1.5 text-[11px] font-medium text-gold hover:bg-[rgba(201,168,76,0.1)] transition-colors" style={{ borderColor: 'rgba(201,168,76,0.4)' }}>
              <Phone className="w-3 h-3" /> (07) 2140 1757
            </a>
            <Link to="/menu" className="btn-gold rounded-full px-5 py-2 text-[11px] font-semibold tracking-[0.1em]">
              ORDER ONLINE
            </Link>
            <Link to="/checkout" className="relative p-2 text-parchment hover:text-gold transition-colors">
              <ShoppingCart className="w-4 h-4" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold text-dark text-[9px] font-bold rounded-full flex items-center justify-center">{totalItems}</span>
              )}
            </Link>
          </div>

          <div className="flex lg:hidden items-center gap-2">
            <Link to="/checkout" className="relative p-2 text-parchment">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold text-dark text-[9px] font-bold rounded-full flex items-center justify-center">{totalItems}</span>
              )}
            </Link>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2">
              {mobileOpen ? <X className="w-5 h-5 text-parchment" /> : <Menu className="w-5 h-5 text-parchment" />}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center gap-5 lg:hidden" style={{ background: 'rgba(10,10,10,0.98)', top: '88px' }}>
          {navLinks.map(link => (
            <Link key={link.label} to={link.to.startsWith('/#') ? '/' : link.to} onClick={() => setMobileOpen(false)}
              className="font-display text-parchment text-lg tracking-[0.1em] hover:text-gold transition-colors">
              {link.label}
            </Link>
          ))}
          <a href="tel:0721401757" className="flex items-center gap-2 bg-gold text-dark rounded-full px-6 py-2.5 text-sm font-semibold mt-2">
            <Phone className="w-4 h-4" /> (07) 2140 1757
          </a>
        </div>
      )}
    </>
  );
}
