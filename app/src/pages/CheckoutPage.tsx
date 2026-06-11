import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, ShoppingCart, Check, Truck, Store, UtensilsCrossed, Users, Clock, MessageSquare } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { trpc } from '@/providers/trpc';

const WHATSAPP_NUMBER = '61412345678';

type OrderType = 'pickup' | 'delivery' | 'dineIn';

const orderTypeConfig: Record<OrderType, { label: string; icon: typeof Truck; desc: string }> = {
  pickup: { label: 'Pickup', icon: Store, desc: 'Collect from restaurant' },
  delivery: { label: 'Delivery', icon: Truck, desc: 'Delivered to your door' },
  dineIn: { label: 'Dine-In', icon: UtensilsCrossed, desc: 'Eat at the restaurant' },
};

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [orderType, setOrderType] = useState<OrderType>('pickup');
  const [form, setForm] = useState({
    name: '', mobile: '', address: '', notes: '',
    guests: '2', dineInTime: '', tableNotes: '',
  });
  const [placed, setPlaced] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const createOrder = trpc.order.create.useMutation({
    onSuccess: (data) => { setOrderId(data.id); setPlaced(true); clearCart(); },
  });

  const updateField = (key: string, val: string) => setForm(p => ({ ...p, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const notes = orderType === 'dineIn'
      ? `Guests: ${form.guests}, Time: ${form.dineInTime}${form.tableNotes ? `, Notes: ${form.tableNotes}` : ''}${form.notes ? ` | ${form.notes}` : ''}`
      : form.notes || undefined;

    createOrder.mutate({
      customerName: form.name,
      customerMobile: form.mobile,
      customerAddress: orderType === 'delivery' ? form.address : undefined,
      deliveryType: orderType,
      notes,
      items: items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, isVeg: i.isVeg })),
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
    });
  };

  const sendToWhatsApp = () => {
    const config = orderTypeConfig[orderType];
    const lines = [
      `*New Order - Aura Curry House Cafe*`,
      ``,
      `*Order #:* ${orderId}`,
      `*Order Type:* ${config.label}`,
      `*Customer:* ${form.name}`,
      `*Mobile:* ${form.mobile}`,
    ];
    if (orderType === 'delivery') lines.push(`*Address:* ${form.address}`);
    if (orderType === 'dineIn') {
      lines.push(`*Guests:* ${form.guests}`);
      lines.push(`*Preferred Time:* ${form.dineInTime}`);
      if (form.tableNotes) lines.push(`*Table Notes:* ${form.tableNotes}`);
    }
    lines.push(``, `*Order Items:*`);
    items.forEach(i => lines.push(`- ${i.name} x${i.quantity} = $${(i.price * i.quantity).toFixed(2)}`));
    lines.push(``, `*Subtotal:* $${subtotal.toFixed(2)}`, `*GST (10%):* $${tax.toFixed(2)}`, `*Total:* $${total.toFixed(2)}`);
    if (form.notes) lines.push(`*Notes:* ${form.notes}`);

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank');
  };

  // ─── Order Placed Success Screen ───
  if (placed && orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5 pt-6">
        <div className="max-w-sm w-full text-center">
          <div className="w-16 h-16 rounded-full bg-gold flex items-center justify-center mx-auto mb-5">
            <Check className="w-7 h-7 text-dark" strokeWidth={3} />
          </div>
          <h1 className="font-display text-parchment text-[22px] mb-1">Order Placed!</h1>
          <p className="text-sand text-[13px] mb-1">Your order <span className="text-gold font-semibold">#{orderId}</span> has been received.</p>
          <p className="text-sand text-[12px] mb-6 opacity-70">Send your order details via WhatsApp to confirm.</p>

          {/* Order Summary Card */}
          <div className="rounded-xl p-4 mb-5 text-left" style={{ background: '#111', border: '1px solid rgba(245,240,232,0.06)' }}>
            <div className="flex items-center gap-2 mb-3 pb-2" style={{ borderBottom: '1px solid rgba(245,240,232,0.06)' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(201,168,76,0.1)' }}>
                <Check className="w-4 h-4 text-gold" />
              </div>
              <div>
                <p className="text-parchment text-[12px] font-medium">{orderTypeConfig[orderType].label}</p>
                <p className="text-sand text-[10px]">{orderType === 'dineIn' ? `${form.guests} guests` : orderType === 'delivery' ? form.address : 'Collect at store'}</p>
              </div>
              <span className="ml-auto text-gold text-[14px] font-display font-semibold">${total.toFixed(2)}</span>
            </div>
            {items.map(i => (
              <div key={i.id} className="flex justify-between text-[11px] py-0.5">
                <span className="text-parchment">{i.name} <span className="text-sand">x{i.quantity}</span></span>
                <span className="text-sand">${(i.price * i.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2.5">
            <button onClick={sendToWhatsApp}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-[13px] font-bold tracking-wider text-white active:scale-[0.98] transition-transform"
              style={{ background: '#25D366' }}>
              <MessageSquare className="w-4 h-4" /> SEND VIA WHATSAPP
            </button>
            <Link to="/menu" className="block w-full border rounded-xl py-3 text-center text-[12px] font-medium text-parchment hover:border-gold transition-colors" style={{ borderColor: 'rgba(245,240,232,0.1)' }}>ORDER MORE</Link>
            <Link to="/" className="text-sand text-[11px] hover:text-gold transition-colors py-1">Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── Empty Cart ───
  if (items.length === 0 && !placed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5">
        <div className="max-w-sm w-full text-center">
          <ShoppingCart className="w-12 h-12 text-sand mx-auto mb-4 opacity-30" />
          <h1 className="font-display text-parchment text-xl mb-2">Your cart is empty</h1>
          <p className="text-sand text-[13px] mb-5">Browse our menu and add your favourite dishes.</p>
          <Link to="/menu" className="inline-block bg-gold text-dark rounded-xl px-6 py-2.5 text-[12px] font-semibold tracking-wider hover:bg-[#e0c86b] transition-colors">BROWSE MENU</Link>
        </div>
      </div>
    );
  }

  // ─── Checkout Form ───
  return (
    <div className="pt-4 pb-24 lg:pb-8 px-4">
      <div className="max-w-lg mx-auto">
        <Link to="/menu" className="flex items-center gap-1.5 text-sand text-[12px] hover:text-gold transition-colors mb-5">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Menu
        </Link>
        <h1 className="font-display text-parchment text-[20px] mb-5">Checkout</h1>

        {/* Order Type - Premium Pill Tabs */}
        <div className="mb-5">
          <label className="text-sand text-[10px] uppercase tracking-[0.15em] font-medium mb-2.5 block">Order Type</label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(orderTypeConfig) as OrderType[]).map((type) => {
              const { label, icon: Icon, desc } = orderTypeConfig[type];
              const isActive = orderType === type;
              return (
                <button
                  key={type}
                  onClick={() => setOrderType(type)}
                  className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl transition-all active:scale-[0.97] ${isActive ? 'border-2 border-gold bg-[rgba(201,168,76,0.08)]' : 'border border-[rgba(245,240,232,0.08)] bg-[rgba(245,240,232,0.02)]'}`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-gold' : 'text-sand'}`} strokeWidth={isActive ? 2 : 1.5} />
                  <span className={`text-[11px] font-semibold tracking-wide ${isActive ? 'text-gold' : 'text-parchment'}`}>{label}</span>
                  <span className={`text-[8px] ${isActive ? 'text-gold/70' : 'text-sand/60'}`}>{desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Order Summary */}
        <div className="rounded-xl p-4 mb-5" style={{ background: '#111', border: '1px solid rgba(245,240,232,0.06)' }}>
          <h2 className="font-semibold text-parchment text-[12px] tracking-wider mb-3">ORDER SUMMARY</h2>
          <div className="space-y-2">
            {items.map(item => (
              <div key={item.id} className="flex items-center justify-between text-[12px]">
                <span className="text-parchment">{item.name} <span className="text-sand">x{item.quantity}</span></span>
                <span className="text-gold">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 space-y-1.5" style={{ borderTop: '1px solid rgba(245,240,232,0.06)' }}>
            <div className="flex justify-between text-[12px]"><span className="text-sand">Subtotal</span><span className="text-parchment">${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-[12px]"><span className="text-sand">GST (10%)</span><span className="text-parchment">${tax.toFixed(2)}</span></div>
            <div className="flex justify-between text-[14px] font-semibold pt-1" style={{ borderTop: '1px solid rgba(245,240,232,0.06)' }}>
              <span className="text-parchment">Total</span><span className="text-gold">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Customer Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-sand text-[10px] uppercase tracking-[0.15em] font-medium mb-1.5 block">Full Name *</label>
            <input type="text" required value={form.name} onChange={e => updateField('name', e.target.value)}
              className="w-full bg-transparent border rounded-xl text-parchment text-[14px] px-4 py-3.5 outline-none focus:border-gold transition-colors placeholder:text-[rgba(168,155,140,0.3)]"
              style={{ borderColor: 'rgba(245,240,232,0.1)' }} placeholder="Your full name" />
          </div>
          <div>
            <label className="text-sand text-[10px] uppercase tracking-[0.15em] font-medium mb-1.5 block">Mobile Number *</label>
            <input type="tel" required value={form.mobile} onChange={e => updateField('mobile', e.target.value)}
              className="w-full bg-transparent border rounded-xl text-parchment text-[14px] px-4 py-3.5 outline-none focus:border-gold transition-colors placeholder:text-[rgba(168,155,140,0.3)]"
              style={{ borderColor: 'rgba(245,240,232,0.1)' }} placeholder="04XX XXX XXX" />
          </div>

          {/* Delivery Address */}
          {orderType === 'delivery' && (
            <div>
              <label className="text-sand text-[10px] uppercase tracking-[0.15em] font-medium mb-1.5 block">Delivery Address *</label>
              <textarea required value={form.address} onChange={e => updateField('address', e.target.value)}
                className="w-full bg-transparent border rounded-xl text-parchment text-[14px] px-4 py-3.5 outline-none focus:border-gold transition-colors placeholder:text-[rgba(168,155,140,0.3)] resize-none"
                style={{ borderColor: 'rgba(245,240,232,0.1)' }} rows={2} placeholder="Street address, suburb, postcode" />
            </div>
          )}

          {/* Dine-In Fields */}
          {orderType === 'dineIn' && (
            <>
              <div>
                <label className="text-sand text-[10px] uppercase tracking-[0.15em] font-medium mb-1.5 block flex items-center gap-1"><Users className="w-3 h-3" /> Number of Guests *</label>
                <select required value={form.guests} onChange={e => updateField('guests', e.target.value)}
                  className="w-full bg-transparent border rounded-xl text-parchment text-[14px] px-4 py-3.5 outline-none focus:border-gold transition-colors appearance-none"
                  style={{ borderColor: 'rgba(245,240,232,0.1)' }}>
                  {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n} className="bg-[#111]">{n} {n === 1 ? 'Guest' : 'Guests'}</option>)}
                  <option value="11" className="bg-[#111]">10+ (Large group)</option>
                </select>
              </div>
              <div>
                <label className="text-sand text-[10px] uppercase tracking-[0.15em] font-medium mb-1.5 block flex items-center gap-1"><Clock className="w-3 h-3" /> Preferred Time *</label>
                <select required value={form.dineInTime} onChange={e => updateField('dineInTime', e.target.value)}
                  className="w-full bg-transparent border rounded-xl text-parchment text-[14px] px-4 py-3.5 outline-none focus:border-gold transition-colors appearance-none"
                  style={{ borderColor: 'rgba(245,240,232,0.1)' }}>
                  <option value="" className="bg-[#111]">Select arrival time</option>
                  {['11:30 AM','12:00 PM','12:30 PM','1:00 PM','1:30 PM','5:30 PM','6:00 PM','6:30 PM','7:00 PM','7:30 PM','8:00 PM','8:30 PM','9:00 PM'].map(t =>
                    <option key={t} value={t} className="bg-[#111]">{t}</option>
                  )}
                </select>
              </div>
              <div>
                <label className="text-sand text-[10px] uppercase tracking-[0.15em] font-medium mb-1.5 block">Table Notes / Special Request</label>
                <textarea value={form.tableNotes} onChange={e => updateField('tableNotes', e.target.value)}
                  className="w-full bg-transparent border rounded-xl text-parchment text-[14px] px-4 py-3.5 outline-none focus:border-gold transition-colors placeholder:text-[rgba(168,155,140,0.3)] resize-none"
                  style={{ borderColor: 'rgba(245,240,232,0.1)' }} rows={2} placeholder="High chair, window seat, birthday, allergies..." />
              </div>
            </>
          )}

          {/* Notes */}
          {orderType !== 'dineIn' && (
            <div>
              <label className="text-sand text-[10px] uppercase tracking-[0.15em] font-medium mb-1.5 block">Notes (Optional)</label>
              <textarea value={form.notes} onChange={e => updateField('notes', e.target.value)}
                className="w-full bg-transparent border rounded-xl text-parchment text-[14px] px-4 py-3.5 outline-none focus:border-gold transition-colors placeholder:text-[rgba(168,155,140,0.3)] resize-none"
                style={{ borderColor: 'rgba(245,240,232,0.1)' }} rows={2} placeholder="Any special instructions..." />
            </div>
          )}

          {/* Place Order Button */}
          <button type="submit" disabled={createOrder.isPending}
            className="w-full py-4 rounded-xl text-[14px] font-bold tracking-wider text-dark active:scale-[0.98] transition-transform disabled:opacity-50 mt-2"
            style={{ background: '#c9a84c' }}>
            {createOrder.isPending ? 'Placing Order...' : `PLACE ORDER - $${total.toFixed(2)}`}
          </button>
        </form>
      </div>
    </div>
  );
}
