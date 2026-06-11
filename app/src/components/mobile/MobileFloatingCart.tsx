import { useState } from 'react';
import { Link } from 'react-router';
import { ShoppingCart, X, Minus, Plus, ArrowRight } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

export default function MobileFloatingCart() {
  const { items, totalItems, subtotal, updateQuantity } = useCart();
  const [open, setOpen] = useState(false);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  if (totalItems === 0) return null;

  return (
    <>
      {/* Floating button above bottom nav */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-[72px] right-3 z-[95] w-14 h-14 rounded-full shadow-2xl flex items-center justify-center lg:hidden active:scale-95 transition-transform"
          style={{ background: '#c9a84c' }}
        >
          <ShoppingCart className="w-5 h-5 text-dark" />
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-[#0a0a0a]">
            {totalItems}
          </span>
        </button>
      )}

      {/* Cart Popup */}
      {open && (
        <div className="fixed inset-0 z-[2000] lg:hidden flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="relative rounded-t-2xl max-h-[70vh] flex flex-col" style={{ background: '#0f0f0f', borderTop: '1px solid rgba(245,240,232,0.08)' }}>
            <div className="flex justify-center pt-2 pb-1"><div className="w-8 h-1 rounded-full bg-[rgba(245,240,232,0.15)]" /></div>
            <div className="flex items-center justify-between px-4 pb-2" style={{ borderBottom: '1px solid rgba(245,240,232,0.06)' }}>
              <h3 className="font-display text-parchment text-[15px]">Your Cart ({totalItems})</h3>
              <button onClick={() => setOpen(false)} className="p-1"><X className="w-5 h-5 text-sand" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-xl" style={{ background: '#111' }}>
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                    <img src={item.image || ''} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0"><h4 className="text-parchment text-[11px] truncate">{item.name}</h4><span className="text-gold text-[11px]">${item.price.toFixed(2)}</span></div>
                  <div className="flex items-center gap-0 rounded-lg overflow-hidden" style={{ border: '1px solid rgba(245,240,232,0.08)' }}>
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center bg-[rgba(245,240,232,0.05)]"><Minus className="w-3 h-3 text-parchment" /></button>
                    <div className="w-6 h-6 bg-gold text-dark flex items-center justify-center text-[9px] font-bold">{item.quantity}</div>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center bg-[rgba(245,240,232,0.05)]"><Plus className="w-3 h-3 text-parchment" /></button>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 space-y-1" style={{ borderTop: '1px solid rgba(245,240,232,0.06)', background: '#0a0a0a' }}>
              <div className="flex justify-between text-[11px]"><span className="text-sand">Item Total</span><span className="text-parchment">${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-[11px]"><span className="text-sand">GST (10%)</span><span className="text-parchment">${tax.toFixed(2)}</span></div>
              <div className="flex justify-between text-[13px] font-semibold pt-1"><span className="text-parchment">To Pay</span><span className="text-gold">${total.toFixed(2)}</span></div>
            </div>
            <div className="px-4 pb-4 pt-1">
              <Link to="/checkout" onClick={() => setOpen(false)} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-[12px] font-bold tracking-wider text-dark active:scale-[0.98] transition-transform" style={{ background: '#c9a84c' }}>
                PROCEED TO PAY <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
