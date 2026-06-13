import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Search, Plus, Minus, ShoppingCart, Leaf, Flame, X, ChevronUp } from 'lucide-react';
import { trpc } from '@/providers/trpc';
import { useCart } from '@/hooks/useCart';
import { useIsMobile } from '@/hooks/useIsMobile';
import MobileMenuPage from '@/components/mobile/MobileMenuPage';

export default function MenuPage() {
  const isMobile = useIsMobile(1024);
  if (isMobile) return <MobileMenuPage />;
  return <MenuPageDesktop />;
}

function MenuPageDesktop() {
  const [searchParams] = useSearchParams();
  const [activeCat, setActiveCat] = useState<number | 'all'>('all');
  const [search, setSearch] = useState(() => searchParams.get('q') ?? '');
  const [vegOnly, setVegOnly] = useState(false);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) setSearch(q);
  }, [searchParams]);
  const { data: categories } = trpc.category.list.useQuery();

  // Pre-select a category when arriving via /menu?cat=<slug>
  useEffect(() => {
    const slug = searchParams.get('cat');
    if (slug && categories) {
      const match = categories.find(c => c.slug === slug);
      if (match) setActiveCat(match.id);
    }
  }, [searchParams, categories]);
  const { data: menuItems } = trpc.menu.listAvailable.useQuery();
  const { items: cartItems, addItem, updateQuantity, totalItems, subtotal } = useCart();

  const filtered = useMemo(() => {
    let list = menuItems || [];
    if (activeCat !== 'all') list = list.filter(i => i.categoryId === activeCat);
    if (search) list = list.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
    if (vegOnly) list = list.filter(i => i.isVeg);
    return list;
  }, [menuItems, activeCat, search, vegOnly]);

  const grouped = useMemo(() => {
    const cats = categories || [];
    const map: Record<number, typeof filtered> = {};
    for (const c of cats) map[c.id] = [];
    for (const item of filtered) {
      if (!map[item.categoryId]) map[item.categoryId] = [];
      map[item.categoryId].push(item);
    }
    return cats.filter(c => map[c.id]?.length > 0).map(c => ({ category: c, items: map[c.id] }));
  }, [filtered, categories]);

  return (
    <div className="pb-24 md:pb-12">
      {/* Hero header */}
      <div className="relative overflow-hidden border-b" style={{ borderColor: 'rgba(201,168,76,0.12)' }}>
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'url(/images/hero-main.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(120% 100% at 50% 0%, rgba(201,168,76,0.06), transparent 60%)' }} />
        <div className="relative px-4 md:px-8 lg:px-[60px] pt-10 pb-8">
          <div className="max-w-[1400px] mx-auto text-center flex flex-col items-center">
            <span className="block eyebrow text-2xl mb-1">Our Menu</span>
            <h1 className="font-display text-parchment text-4xl md:text-[3rem] tracking-wide leading-tight">ORDER YOUR <span className="text-gold-gradient">FAVOURITES</span></h1>
            <div className="gold-rule mt-5 mb-4" />
            <p className="text-sand text-[13px] max-w-[440px] leading-relaxed">Freshly prepared Indian classics — from sizzling street snacks to slow-cooked curries and house desserts.</p>
          </div>
        </div>
      </div>

      {/* Sticky filter + category bar */}
      <div className="sticky top-[88px] z-40 border-b" style={{ background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderColor: 'rgba(245,240,232,0.06)' }}>
        <div className="px-4 md:px-8 lg:px-[60px]">
          <div className="max-w-[1400px] mx-auto py-3.5">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sand" />
                <input type="text" placeholder="Search dishes..." value={search} onChange={e => setSearch(e.target.value)}
                  className="w-full bg-transparent border rounded-full text-parchment text-[13px] pl-10 pr-3 py-2.5 outline-none focus:border-gold transition-colors placeholder:text-[rgba(168,155,140,0.4)]"
                  style={{ borderColor: 'rgba(245,240,232,0.12)' }} />
              </div>
              <button onClick={() => setVegOnly(!vegOnly)}
                className={`flex items-center gap-1.5 border rounded-full px-4 py-2.5 text-[12px] font-medium transition-colors shrink-0 ${vegOnly ? 'bg-green-500/10 border-green-500/40 text-green-400' : 'text-sand hover:border-gold'}`}
                style={!vegOnly ? { borderColor: 'rgba(245,240,232,0.12)' } : {}}>
                <Leaf className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Veg Only</span>
              </button>
              <button onClick={() => setShowCart(true)} className="btn-gold relative flex items-center gap-2 rounded-full px-5 py-2.5 text-[12px] font-semibold tracking-[0.1em] shrink-0">
                <ShoppingCart className="w-4 h-4" /> <span className="hidden sm:inline">Cart</span> {totalItems > 0 && `(${totalItems})`}
              </button>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
              <button onClick={() => setActiveCat('all')} className={`shrink-0 px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-[0.12em] transition-all ${activeCat === 'all' ? 'text-dark' : 'text-sand hover:text-parchment border'}`} style={activeCat === 'all' ? { background: 'var(--gold-grad)' } : { borderColor: 'rgba(245,240,232,0.12)' }}>ALL</button>
              {(categories || []).map(c => (
                <button key={c.id} onClick={() => setActiveCat(c.id)} className={`shrink-0 px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-[0.12em] transition-all whitespace-nowrap ${activeCat === c.id ? 'text-dark' : 'text-sand hover:text-parchment border'}`} style={activeCat === c.id ? { background: 'var(--gold-grad)' } : { borderColor: 'rgba(245,240,232,0.12)' }}>
                  {c.name.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 md:px-8 lg:px-[60px] pt-10">
        <div className="max-w-[1400px] mx-auto">
          {grouped.length === 0 ? (
            <div className="text-center py-24">
              <Search className="w-10 h-10 text-sand/30 mx-auto mb-4" />
              <p className="text-parchment text-[15px] font-display mb-1">No dishes found</p>
              <p className="text-sand text-[12px]">Try a different search or filter.</p>
            </div>
          ) : (
            grouped.map(({ category, items }) => (
              <div key={category.id} className="mb-16">
                <div className="flex items-center gap-4 mb-6">
                  <div>
                    <span className="eyebrow text-lg block leading-none mb-0.5">{items.length} dishes</span>
                    <h2 className="font-display text-parchment text-[1.9rem] tracking-wide leading-none">{category.name}</h2>
                  </div>
                  <span className="h-px flex-1 bg-gradient-to-r from-gold/30 to-transparent mt-3" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {items.map(item => <MenuItemCard key={item.id} item={item} cartItems={cartItems} addItem={addItem} updateQuantity={updateQuantity} />)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Cart Slide-over */}
      {showCart && <CartPanel onClose={() => setShowCart(false)} />}

      {/* Mobile Bottom Sticky Bar */}
      {totalItems > 0 && (
        <div className="fixed bottom-14 left-0 right-0 z-[998] lg:hidden" onClick={() => setShowCart(true)}>
          <div className="mx-4 bg-gold text-dark rounded-lg px-4 py-3 flex items-center justify-between cursor-pointer shadow-lg">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              <span className="text-[13px] font-semibold">{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold">${subtotal.toFixed(2)}</span>
              <ChevronUp className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Menu Item Card ─── */
function MenuItemCard({ item, cartItems, addItem, updateQuantity }: {
  item: { id: number; name: string; description: string | null; price: string; isVeg: boolean; spiceLevel: number; isBestSeller: boolean; isFeatured: boolean; image: string | null; categoryId: number };
  cartItems: Array<{ id: number; quantity: number }>;
  addItem: (i: { id: number; name: string; price: number; isVeg: boolean; image?: string }) => void;
  updateQuantity: (id: number, q: number) => void;
}) {
  const cartItem = cartItems.find(c => c.id === item.id);
  const qty = cartItem?.quantity || 0;
  const img = item.image || `/images/cat-${['quick-snacks','south-indian','north-indian','indo-chinese','biryani','desserts','beverages'][item.categoryId - 1] || 'south-indian'}.jpg`;

  return (
    <div className="card-lux group rounded-2xl overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img src={img} alt={item.name} className="w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.08]" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#100e0b] via-[#100e0b]/15 to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {item.isBestSeller && <span className="px-2.5 py-1 rounded-full text-[8px] font-bold text-dark tracking-[0.14em] shadow-md" style={{ background: 'var(--gold-grad)' }}>BESTSELLER</span>}
          {item.isFeatured && !item.isBestSeller && <span className="px-2.5 py-1 rounded-full text-[8px] font-bold tracking-[0.14em] text-parchment shadow-md" style={{ background: 'rgba(10,10,10,0.7)', border: '1px solid rgba(201,168,76,0.5)' }}>CHEF'S SPECIAL</span>}
        </div>

        {/* Veg / Non-veg */}
        <div className="absolute top-3 right-3 w-5 h-5 rounded-[3px] flex items-center justify-center" style={{ background: 'rgba(10,10,10,0.65)', border: `1px solid ${item.isVeg ? '#22c55e' : '#ef4444'}` }}>
          <div className={`w-2.5 h-2.5 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
        </div>

        {/* Price chip */}
        <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full backdrop-blur-md" style={{ background: 'rgba(10,10,10,0.6)', border: '1px solid rgba(201,168,76,0.3)' }}>
          <span className="font-display text-gold text-[15px] font-semibold">${item.price}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-display text-parchment text-[16px] tracking-wide leading-tight flex-1">{item.name}</h3>
          {item.spiceLevel > 0 && (
            <div className="flex gap-0.5 shrink-0">
              {[1,2,3].map(i => <Flame key={i} className={`w-3 h-3 ${i <= item.spiceLevel ? 'text-red-400 fill-red-400/30' : 'text-[rgba(245,240,232,0.12)]'}`} />)}
            </div>
          )}
        </div>
        <p className="text-sand text-[11.5px] leading-relaxed line-clamp-2 mb-3.5 min-h-[32px]">{item.description || 'Authentic Indian preparation'}</p>

        <div className="mt-auto">
          {qty === 0 ? (
            <button onClick={() => addItem({ id: item.id, name: item.name, price: Number(item.price), isVeg: item.isVeg, image: img })}
              className="btn-outline w-full rounded-full py-2.5 text-[11px] font-semibold tracking-[0.16em] flex items-center justify-center gap-1.5">
              <Plus className="w-3.5 h-3.5" /> ADD TO CART
            </button>
          ) : (
            <div className="flex items-center justify-between rounded-full overflow-hidden" style={{ background: 'var(--gold-grad)' }}>
              <button onClick={() => updateQuantity(item.id, qty - 1)} className="w-11 h-10 flex items-center justify-center text-dark hover:bg-black/10 transition-colors">
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-dark text-[14px] font-bold">{qty} in cart</span>
              <button onClick={() => updateQuantity(item.id, qty + 1)} className="w-11 h-10 flex items-center justify-center text-dark hover:bg-black/10 transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Cart Panel ─── */
function CartPanel({ onClose }: { onClose: () => void }) {
  const { items, updateQuantity, subtotal, clearCart } = useCart();
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="fixed inset-0 z-[2000] flex justify-end">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-md h-full flex flex-col" style={{ background: '#0a0a0a' }}>
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'rgba(245,240,232,0.08)' }}>
          <h2 className="font-display text-parchment text-lg">Your Cart</h2>
          <button onClick={onClose} className="p-1 text-sand hover:text-parchment"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-20 text-sand text-[14px]">Your cart is empty</div>
          ) : (
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: '#111' }}>
                  <div className="w-12 h-12 rounded-md overflow-hidden shrink-0 bg-[rgba(245,240,232,0.05)]">
                    {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-parchment text-[12px] font-medium truncate">{item.name}</h4>
                    <span className="text-gold text-[12px]">${item.price.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-0 shrink-0">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 bg-[rgba(245,240,232,0.08)] rounded-l flex items-center justify-center"><Minus className="w-3 h-3 text-parchment" /></button>
                    <div className="w-6 h-6 bg-gold text-dark flex items-center justify-center text-[10px] font-bold">{item.quantity}</div>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 bg-[rgba(245,240,232,0.08)] rounded-r flex items-center justify-center"><Plus className="w-3 h-3 text-parchment" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t" style={{ borderColor: 'rgba(245,240,232,0.08)', background: '#0f0f0f' }}>
            <div className="space-y-1.5 mb-3">
              <div className="flex justify-between text-[12px]"><span className="text-sand">Subtotal</span><span className="text-parchment">${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-[12px]"><span className="text-sand">GST (10%)</span><span className="text-parchment">${tax.toFixed(2)}</span></div>
              <div className="flex justify-between text-[13px] font-semibold pt-1 border-t" style={{ borderColor: 'rgba(245,240,232,0.08)' }}>
                <span className="text-parchment">Total</span><span className="text-gold">${total.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={clearCart} className="flex-1 border rounded-md py-2.5 text-[11px] font-medium text-sand hover:border-gold transition-colors" style={{ borderColor: 'rgba(245,240,232,0.15)' }}>Clear</button>
              <Link to="/checkout" onClick={onClose} className="flex-[2] bg-gold text-dark rounded-md py-2.5 text-[12px] font-semibold tracking-wider text-center hover:bg-[#e0c86b] transition-colors">PROCEED TO CHECKOUT</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
