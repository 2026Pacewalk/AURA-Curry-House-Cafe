import { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Search, Plus, Minus, Leaf, Flame, ShoppingCart, ChevronUp, X, ArrowRight } from 'lucide-react';
import { trpc } from '@/providers/trpc';
import { useCart } from '@/hooks/useCart';

const catIcons: Record<string, string> = {
  'quick-snacks': '/images/cat-street-food.jpg',
  'south-indian': '/images/cat-south-indian.jpg',
  'north-indian': '/images/cat-north-indian.jpg',
  'indo-chinese': '/images/cat-indo-chinese.jpg',
  biryani: '/images/hero-main.jpg',
  desserts: '/images/cat-desserts.jpg',
  beverages: '/images/cat-beverages.jpg',
};

export default function MobileMenuPage() {
  const [searchParams] = useSearchParams();
  const [activeCat, setActiveCat] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') ?? '');
  const [vegOnly, setVegOnly] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const cartScrollRef = useRef<HTMLDivElement>(null);

  // Keep in sync when a search is submitted from the header while already on /menu
  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) setSearchQuery(q);
  }, [searchParams]);

  const { data: categories } = trpc.category.list.useQuery();
  const { data: menuItems } = trpc.menu.listAvailable.useQuery();
  const { items: cartItems, addItem, updateQuantity, totalItems, subtotal } = useCart();

  // Filter items
  const filtered = useMemo(() => {
    let list = menuItems || [];
    if (activeCat !== 'all') list = list.filter(i => i.categoryId === activeCat);
    if (searchQuery.trim()) list = list.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()));
    if (vegOnly) list = list.filter(i => i.isVeg);
    return list;
  }, [menuItems, activeCat, searchQuery, vegOnly]);

  // Group by category
  const grouped = useMemo(() => {
    const cats = (categories || []).filter(c => activeCat === 'all' || c.id === activeCat);
    const result: Array<{ cat: typeof cats[0]; items: typeof filtered }> = [];
    for (const cat of cats) {
      const items = filtered.filter(i => i.categoryId === cat.id);
      if (items.length > 0) result.push({ cat, items });
    }
    return result;
  }, [filtered, categories, activeCat]);

  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  // Scroll to category
  const catRefs = useRef<Record<number, HTMLDivElement | null>>({});

  return (
    <div className="pt-2 pb-24 lg:hidden">
      {/* Search Bar */}
      <div className="px-3 mb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sand" />
          <input
            type="text"
            placeholder="Search butter chicken, dosa..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            className="w-full rounded-xl text-parchment text-[13px] pl-9 pr-9 py-3 outline-none placeholder:text-[rgba(168,155,140,0.35)] transition-all"
            style={{ background: 'rgba(245,240,232,0.05)', border: searchFocused ? '1px solid rgba(201,168,76,0.4)' : '1px solid rgba(245,240,232,0.08)' }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-sand" />
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs with Icons - Sticky */}
      <div className="sticky top-[58px] z-30 px-3 py-2" style={{ background: '#0a0a0a' }}>
        <div className="flex gap-2 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-0.5 items-center">
          {/* Veg Toggle */}
          <button
            onClick={() => setVegOnly(!vegOnly)}
            className={`snap-start shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium tracking-wider transition-all ${vegOnly ? 'bg-green-500/15 text-green-400 border border-green-500/30' : 'text-sand border border-[rgba(245,240,232,0.08)]'}`}
          >
            <Leaf className="w-3 h-3" /> VEG
          </button>

          <button
            onClick={() => setActiveCat('all')}
            className={`snap-start shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-medium tracking-wider transition-all ${activeCat === 'all' ? 'bg-gold text-dark' : 'text-sand border border-[rgba(245,240,232,0.08)]'}`}
          >
            ALL
          </button>

          {(categories || []).map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`snap-start shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium tracking-wider transition-all whitespace-nowrap ${activeCat === cat.id ? 'bg-gold text-dark' : 'text-sand border border-[rgba(245,240,232,0.08)]'}`}
            >
              {cat.name.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-3 mt-2">
        {grouped.length === 0 ? (
          <div className="text-center py-16">
            <Search className="w-10 h-10 text-sand mx-auto mb-3 opacity-30" />
            <p className="text-sand text-[13px]">No items found</p>
            <p className="text-sand text-[11px] opacity-50 mt-1">Try a different search or filter</p>
          </div>
        ) : (
          grouped.map(({ cat, items }) => (
            <div key={cat.id} className="mb-6" ref={el => { catRefs.current[cat.id] = el; }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0">
                  <img src={catIcons[cat.slug] || ''} alt={cat.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <h2 className="text-parchment text-[14px] font-semibold tracking-wide">{cat.name}</h2>
                <span className="text-sand text-[10px]">({items.length})</span>
              </div>
              <div className="space-y-2.5">
                {items.map(item => (
                  <FoodCard key={item.id} item={item} cartItems={cartItems} addItem={addItem} updateQuantity={updateQuantity} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Sticky Cart Bar */}
      {totalItems > 0 && !showCart && (
        <div className="fixed bottom-[56px] left-0 right-0 z-[900] px-3">
          <button
            onClick={() => setShowCart(true)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl shadow-2xl active:scale-[0.99] transition-transform"
            style={{ background: '#c9a84c' }}
          >
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-dark" />
                <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-dark text-gold text-[8px] font-bold rounded-full flex items-center justify-center px-1">{totalItems}</span>
              </div>
              <div className="text-left">
                <span className="text-dark text-[12px] font-bold">{totalItems} item{totalItems !== 1 ? 's' : ''} added</span>
                <span className="block text-dark/60 text-[9px]">Extra charges may apply</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-dark text-[14px] font-bold">${total.toFixed(2)}</span>
              <ChevronUp className="w-4 h-4 text-dark" />
            </div>
          </button>
        </div>
      )}

      {/* Cart Bottom Sheet */}
      {showCart && (
        <div className="fixed inset-0 z-[2000] lg:hidden flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowCart(false)} />
          <div
            ref={cartScrollRef}
            className="relative rounded-t-2xl max-h-[75vh] flex flex-col"
            style={{ background: '#0f0f0f', borderTop: '1px solid rgba(245,240,232,0.08)' }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-2 pb-1">
              <div className="w-8 h-1 rounded-full bg-[rgba(245,240,232,0.15)]" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 pb-3" style={{ borderBottom: '1px solid rgba(245,240,232,0.06)' }}>
              <h3 className="font-display text-parchment text-[16px]">Your Cart</h3>
              <button onClick={() => setShowCart(false)} className="p-1"><X className="w-5 h-5 text-sand" /></button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-xl" style={{ background: '#111' }}>
                  <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-[rgba(245,240,232,0.05)]">
                    {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-parchment text-[12px] font-medium truncate">{item.name}</h4>
                    <span className="text-gold text-[12px] font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-0 shrink-0">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 bg-[rgba(245,240,232,0.08)] rounded-l-lg flex items-center justify-center"><Minus className="w-3 h-3 text-parchment" /></button>
                    <div className="w-7 h-7 bg-gold text-dark flex items-center justify-center text-[10px] font-bold">{item.quantity}</div>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 bg-[rgba(245,240,232,0.08)] rounded-r-lg flex items-center justify-center"><Plus className="w-3 h-3 text-parchment" /></button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bill Summary */}
            <div className="px-4 py-3 space-y-1.5" style={{ borderTop: '1px solid rgba(245,240,232,0.06)', background: '#0a0a0a' }}>
              <div className="flex justify-between text-[11px]"><span className="text-sand">Item Total</span><span className="text-parchment">${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-[11px]"><span className="text-sand">GST (10%)</span><span className="text-parchment">${tax.toFixed(2)}</span></div>
              <div className="flex justify-between text-[13px] font-semibold pt-1" style={{ borderTop: '1px solid rgba(245,240,232,0.06)' }}>
                <span className="text-parchment">To Pay</span><span className="text-gold">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <div className="px-4 pb-4 pt-1">
              <Link
                to="/checkout"
                onClick={() => setShowCart(false)}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-[13px] font-bold tracking-wider text-dark active:scale-[0.98] transition-transform"
                style={{ background: '#c9a84c' }}
              >
                PROCEED TO PAY <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══ Food Card ═══ */
function FoodCard({ item, cartItems, addItem, updateQuantity }: {
  item: { id: number; name: string; description: string | null; price: string; isVeg: boolean; spiceLevel: number; isBestSeller: boolean; isFeatured: boolean; categoryId: number; image: string | null };
  cartItems: Array<{ id: number; quantity: number }>;
  addItem: (i: { id: number; name: string; price: number; isVeg: boolean; image?: string }) => void;
  updateQuantity: (id: number, q: number) => void;
}) {
  const qty = cartItems.find(c => c.id === item.id)?.quantity || 0;
  const slugs = ['quick-snacks', 'south-indian', 'north-indian', 'indo-chinese', 'biryani', 'desserts', 'beverages'];
  const img = item.image || catIcons[slugs[item.categoryId - 1]] || '';

  return (
    <div className="flex gap-3 p-2.5 rounded-xl" style={{ background: '#111', border: '1px solid rgba(245,240,232,0.04)' }}>
      {/* Image */}
      <div className="relative w-[90px] h-[90px] rounded-lg overflow-hidden shrink-0 self-center">
        <img src={img} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111]/40 to-transparent" />
        {/* Tags - top right */}
        <div className="absolute top-1.5 right-1.5 flex flex-col gap-1 items-end">
          {item.isBestSeller && <span className="px-1.5 py-0.5 rounded-[3px] text-[7px] font-bold tracking-wider bg-[#c9a84c] text-white shadow-md">BESTSELLER</span>}
          {item.isFeatured && !item.isBestSeller && <span className="px-1.5 py-0.5 rounded-[3px] text-[7px] font-bold tracking-wider bg-[#8B6914] text-white shadow-md">CHEF&apos;S</span>}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            {item.isVeg ? (
              <div className="w-3.5 h-3.5 border border-green-500 rounded-[2px] flex items-center justify-center shrink-0"><div className="w-2 h-2 rounded-full bg-green-500" /></div>
            ) : (
              <div className="w-3.5 h-3.5 border border-red-500 rounded-[2px] flex items-center justify-center shrink-0"><div className="w-2 h-2 rounded-full bg-red-500" /></div>
            )}
            <h3 className="text-parchment text-[13px] font-medium truncate">{item.name}</h3>
          </div>
          <p className="text-sand text-[10px] line-clamp-2 leading-snug">{item.description || 'Authentic Indian preparation'}</p>
          {item.spiceLevel > 0 && (
            <div className="flex gap-0.5 mt-1">
              {[1,2,3].map(i => <Flame key={i} className={`w-2.5 h-2.5 ${i <= item.spiceLevel ? 'text-red-400' : 'text-[rgba(245,240,232,0.08)]'}`} />)}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-1.5">
          <span className="text-gold text-[15px] font-display font-semibold">${item.price}</span>
          {qty === 0 ? (
            <button
              onClick={() => addItem({ id: item.id, name: item.name, price: Number(item.price), isVeg: item.isVeg, image: img })}
              className="flex items-center gap-1 px-4 py-1.5 rounded-lg text-[11px] font-bold tracking-wider bg-gold text-dark active:scale-95 transition-transform shadow-lg"
            >
              <Plus className="w-3 h-3" /> ADD
            </button>
          ) : (
            <div className="flex items-center rounded-lg overflow-hidden" style={{ border: '1px solid rgba(201,168,76,0.3)' }}>
              <button onClick={() => updateQuantity(item.id, qty - 1)} className="w-8 h-8 flex items-center justify-center bg-[rgba(245,240,232,0.06)]"><Minus className="w-3.5 h-3.5 text-parchment" /></button>
              <div className="w-8 h-8 bg-gold text-dark flex items-center justify-center text-[12px] font-bold">{qty}</div>
              <button onClick={() => updateQuantity(item.id, qty + 1)} className="w-8 h-8 flex items-center justify-center bg-[rgba(245,240,232,0.06)]"><Plus className="w-3.5 h-3.5 text-parchment" /></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
