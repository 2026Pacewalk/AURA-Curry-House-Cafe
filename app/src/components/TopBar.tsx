import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function TopBar() {
  return (
    <div className="hidden lg:block w-full relative z-[1002]" style={{ background: '#0f0f0f', borderBottom: '1px solid rgba(245,240,232,0.06)' }}>
      <div className="max-w-[1400px] mx-auto flex items-center justify-between py-2 px-4 md:px-8 lg:px-[60px]">
        <div className="flex items-center gap-5">
          <a href="tel:0721401757" className="flex items-center gap-1.5 text-sand hover:text-gold transition-colors text-[12px]">
            <Phone className="w-3 h-3" /> (07) 2140 1757
          </a>
          <a href="mailto:info@auracurryhousecafe.com" className="flex items-center gap-1.5 text-sand hover:text-gold transition-colors text-[12px]">
            <Mail className="w-3 h-3" /> info@auracurryhousecafe.com
          </a>
          <span className="flex items-center gap-1.5 text-sand text-[12px]">
            <MapPin className="w-3 h-3" /> 3/16 Bryants Rd, Shailer Park QLD 4128
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-sand text-[12px]">
          <Clock className="w-3 h-3 shrink-0" />
          <span>Mon – Sun: 10:00 AM – 09:30 PM</span>
        </div>
      </div>
    </div>
  );
}
