import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Search, ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import MobileMenu from './MobileMenu';

export default function MobileHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const submitSearch = () => {
    const q = query.trim();
    if (!q) return;
    navigate(`/menu?q=${encodeURIComponent(q)}`);
    setSearchOpen(false);
    setQuery('');
  };

  return (
    <>
      {/* HEADER — solid, fixed at top */}
      <header
        className="fixed top-0 left-0 right-0 z-[90] lg:hidden"
        style={{ background: '#0a0a0a', borderBottom: '1px solid rgba(245,240,232,0.08)' }}
      >
        <div className="flex items-center justify-between h-[56px] px-4">
          {/* LEFT: Logo */}
          <Link to="/" className="flex flex-col">
            <span className="font-serif text-gold-gradient text-[22px] leading-none tracking-[0.14em]">AURA</span>
            <span className="text-sand text-[10px] tracking-[0.2em] uppercase mt-0.5">Curry House Cafe</span>
          </Link>

          {/* RIGHT: Search + Cart + Menu */}
          <div className="flex items-center gap-0">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(p => !p)}
              className="flex items-center justify-center w-12 h-12 rounded-full active:bg-white/5 transition-colors"
              aria-label="Search"
            >
              {searchOpen ? (
                <X className="w-5 h-5 text-parchment" strokeWidth={2} />
              ) : (
                <Search className="w-5 h-5 text-parchment" strokeWidth={2} />
              )}
            </button>

            {/* Cart */}
            <Link
              to="/checkout"
              className="relative flex items-center justify-center w-12 h-12 rounded-full active:bg-white/5 transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5 text-parchment" strokeWidth={2} />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-gold text-dark text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* MENU BUTTON — rightmost, gold accent */}
            <button
              onClick={() => setMenuOpen(true)}
              className="flex items-center justify-center w-12 h-12 rounded-full active:bg-white/5 transition-colors ml-1"
              style={{ border: '1px solid rgba(201,168,76,0.3)' }}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6 text-gold" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Search expand */}
        {searchOpen && (
          <div className="px-4 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sand" />
              <input
                type="search"
                placeholder="Search for food..."
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') submitSearch(); }}
                enterKeyHint="search"
                className="w-full rounded-xl text-parchment text-[15px] pl-10 pr-4 py-3 outline-none placeholder:text-[rgba(168,155,140,0.35)]"
                style={{ background: 'rgba(245,240,232,0.06)', border: '1px solid rgba(245,240,232,0.1)' }}
              />
            </div>
          </div>
        )}
      </header>

      {/* Full-screen menu */}
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
