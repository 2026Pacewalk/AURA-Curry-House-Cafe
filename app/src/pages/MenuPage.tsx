import { useState, useMemo } from 'react';
import { Link } from 'react-router';
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
  const [activeCat, setActiveCat] = useState<number | 'all'>('all');
  const [search, setSearch] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const { data: categories } = trpc.category.list.useQuery();
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
    <div className="pt-4 pb-24 md:pb-8">
      {/* Header */}
      <div className="px-4 md:px-8 lg:px-[60px] mb-8 pt-6">
        <div className="max-w-[1400px] mx-auto">
          <span className="block eyebrow text-2xl mb-1">Our Menu</span>
          <h1 className="font-display text-parchment text-3xl md:text-[2.4rem] tracking-wide mb-6 leading-tight">ORDER YOUR <span className="text-gold-gradient">FAVOURITES</span></h1>

          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sand" />
              <input type="text" placeholder="Search dishes..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full bg-transparent border rounded-md text-parchment text-[13px] pl-9 pr-3 py-2.5 outline-none focus:border-gold transition-colors placeholder:text-[rgba(168,155,140,0.4)]"
                style={{ borderColor: 'rgba(245,240,232,0.1)' }} />
            </div>
            <button onClick={() => setVegOnly(!vegOnly)}
              className={`flex items-center gap-1.5 border rounded-md px-3 py-2.5 text-[12px] font-medium transition-colors shrink-0 ${vegOnly ? 'bg-green-500/10 border-green-500/40 text-green-400' : 'text-sand hover:border-gold'}`}
              style={!vegOnly ? { borderColor: 'rgba(245,240,232,0.1)' } : {}}>
              <Leaf className="w-3.5 h-3.5" /> Veg Only
            </button>
            <button onClick={() => setShowCart(true)} className="btn-gold relative flex items-center gap-2 rounded-md px-5 py-2.5 text-[12px] font-semibold tracking-[0.1em] shrink-0">
              <ShoppingCart className="w-4 h-4" /> Cart {totalItems > 0 && `(${totalItems})`}
              {totalItems > 0 && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[8px] rounded-full flex items-center justify-center">{totalItems}</span>}
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-1.5 overflow-x-auto hide-scrollbar pb-1">
            <button onClick={() => setActiveCat('all')} className={`shrink-0 px-3 py-1.5 rounded-md text-[11px] font-medium tracking-wider transition-colors ${activeCat === 'all' ? 'bg-gold text-dark' : 'text-sand hover:text-parchment border'}`} style={activeCat !== 'all' ? { borderColor: 'rgba(245,240,232,0.1)' } : {}}>ALL</button>
            {(categories || []).map(c => (
              <button key={c.id} onClick={() => setActiveCat(c.id)} className={`shrink-0 px-3 py-1.5 rounded-md text-[11px] font-medium tracking-wider transition-colors ${activeCat === c.id ? 'bg-gold text-dark' : 'text-sand hover:text-parchment border'}`} style={activeCat !== c.id ? { borderColor: 'rgba(245,240,232,0.1)' } : {}}>
                {c.name.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 md:px-8 lg:px-[60px]">
        <div className="max-w-[1400px] mx-auto">
          {grouped.length === 0 ? (
            <div className="text-center py-20 text-sand text-[14px]">No items found matching your criteria.</div>
          ) : (
            grouped.map(({ category, items }) => (
              <div key={category.id} className="mb-12">
                <h2 className="font-display text-parchment text-2xl tracking-wide mb-5 flex items-center gap-3">
                  {category.name}
                  <span className="h-px flex-1 max-w-[120px] bg-gold/25" />
                  <span className="text-sand text-[11px] font-normal tracking-wider">{items.length} items</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
  addItem: (i: { id: number; name: string; price: number; isVeg: boolean }) => void;
  updateQuantity: (id: number, q: number) => void;
}) {
  const cartItem = cartItems.find(c => c.id === item.id);
  const qty = cartItem?.quantity || 0;

  return (
    <div className="card-lux flex gap-3.5 p-3.5 rounded-xl">
      <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden group">
        <img src={item.image || `/images/cat-${['quick-snacks','south-indian','north-indian','indo-chinese','biryani','desserts','beverages'][item.categoryId - 1] || 'south-indian'}.jpg`} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
        {item.isBestSeller && <div className="absolute top-1 left-1 px-2 py-0.5 rounded-full text-[7px] font-bold text-dark tracking-[0.1em]" style={{ background: 'var(--gold-grad)' }}>BEST</div>}
      </div>
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            {item.isVeg ? <Leaf className="w-3.5 h-3.5 text-green-500 shrink-0" /> : <Flame className="w-3.5 h-3.5 text-red-500 shrink-0" />}
            <h3 className="font-display text-parchment text-[14px] tracking-wide truncate">{item.name}</h3>
          </div>
          <span className="font-display text-gold text-base font-semibold shrink-0">${item.price}</span>
        </div>
        <p className="text-sand text-[11px] leading-snug mt-1 line-clamp-2 mb-2">{item.description || 'Authentic Indian preparation'}</p>
        {item.spiceLevel > 0 && (
          <div className="flex gap-0.5 mb-2">
            {[1,2,3].map(i => <Flame key={i} className={`w-2.5 h-2.5 ${i <= item.spiceLevel ? 'text-red-400' : 'text-[rgba(245,240,232,0.1)]'}`} />)}
          </div>
        )}
        <div className="mt-auto">
        {qty === 0 ? (
          <button onClick={() => addItem({ id: item.id, name: item.name, price: Number(item.price), isVeg: item.isVeg })}
            className="btn-gold w-full rounded-md py-2 text-[11px] font-semibold tracking-[0.12em]">
            ADD
          </button>
        ) : (
          <div className="flex items-center gap-0">
            <button onClick={() => updateQuantity(item.id, qty - 1)} className="w-8 h-7 bg-[rgba(245,240,232,0.08)] rounded-l-md flex items-center justify-center text-parchment hover:bg-[rgba(245,240,232,0.15)] transition-colors">
              <Minus className="w-3 h-3" />
            </button>
            <div className="w-8 h-7 bg-gold text-dark flex items-center justify-center text-[11px] font-bold">{qty}</div>
            <button onClick={() => updateQuantity(item.id, qty + 1)} className="w-8 h-7 bg-[rgba(245,240,232,0.08)] rounded-r-md flex items-center justify-center text-parchment hover:bg-[rgba(245,240,232,0.15)] transition-colors">
              <Plus className="w-3 h-3" />
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
                  <div className="w-12 h-12 rounded-md overflow-hidden shrink-0">
                    <img src={item.image || ''} alt={item.name} className="w-full h-full object-cover" />
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
