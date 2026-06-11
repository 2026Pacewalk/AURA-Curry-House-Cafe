import { Link } from 'react-router';
import { Phone, MapPin, ShoppingCart, MessageCircle } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

export default function MobileBottomBar() {
  const { totalItems } = useCart();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[1000] lg:hidden" style={{ background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(245,240,232,0.08)' }}>
      <div className="flex items-center justify-around py-2">
        <a href="tel:0721401757" className="flex flex-col items-center gap-0.5 text-sand hover:text-gold transition-colors">
          <Phone className="w-4 h-4" />
          <span className="text-[8px] tracking-wider">CALL</span>
        </a>
        <a href="https://maps.google.com/?q=3/16+Bryants+Rd+Shailer+Park+QLD+4128" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-0.5 text-sand hover:text-gold transition-colors">
          <MapPin className="w-4 h-4" />
          <span className="text-[8px] tracking-wider">DIRECTION</span>
        </a>
        <Link to="/menu" className="flex flex-col items-center gap-0.5 text-sand hover:text-gold transition-colors">
          <ShoppingCart className="w-4 h-4" />
          <span className="text-[8px] tracking-wider">ORDER</span>
        </Link>
        <a href="https://wa.me/61412345678" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-0.5 text-sand hover:text-gold transition-colors">
          <MessageCircle className="w-4 h-4" />
          <span className="text-[8px] tracking-wider">WHATSAPP</span>
        </a>
      </div>
      {totalItems > 0 && (
        <Link to="/checkout" className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-dark rounded-full px-4 py-1 text-[10px] font-semibold shadow-lg">
          {totalItems} item{totalItems > 1 ? 's' : ''} in cart
        </Link>
      )}
    </div>
  );
}
