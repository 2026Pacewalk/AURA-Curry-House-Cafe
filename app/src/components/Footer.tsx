import { Link } from 'react-router';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const quickLinks = [
    { label: 'Home', to: '/' },
    { label: 'Menu', to: '/menu' },
    { label: 'About Us', to: '/#experience' },
    { label: 'Reserve Table', to: '/#reserve' },
    { label: 'Contact', to: '/#footer' },
  ];

  const menuLinks = ['Quick Snacks', 'South Indian', 'North Indian', 'Indo Chinese', 'Biryani', 'Desserts', 'Beverages'];

  const hours = [
    { day: 'Monday', time: '10:00 AM – 09:30 PM' },
    { day: 'Tuesday', time: '10:00 AM – 09:30 PM' },
    { day: 'Wednesday', time: '10:00 AM – 09:30 PM' },
    { day: 'Thursday', time: '10:00 AM – 09:30 PM' },
    { day: 'Friday', time: '10:00 AM – 10:00 PM' },
    { day: 'Saturday', time: '10:00 AM – 10:00 PM' },
    { day: 'Sunday', time: '10:00 AM – 09:30 PM' },
  ];

  return (
    <footer id="footer" className="relative" style={{ zIndex: 1, background: '#080808', borderTop: '1px solid rgba(245,240,232,0.05)' }}>
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-[60px] pt-14 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-6">
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="font-serif text-gold-gradient text-[26px] tracking-[0.18em] block">AURA</span>
              <span className="text-sand text-[9px] tracking-[0.3em] uppercase">Curry House Cafe</span>
            </Link>
            <p className="text-sand text-[11px] leading-relaxed mb-5 max-w-[220px]">
              Aura Curry House Cafe brings you the authentic taste of India with a modern twist. Good food, great ambience, and unforgettable experiences.
            </p>
            <div className="flex items-center gap-2">
              {['facebook', 'instagram', 'x', 'tiktok'].map(social => (
                <button key={social} onClick={() => {}} className="w-7 h-7 rounded-full border flex items-center justify-center text-sand hover:text-gold hover:border-gold transition-colors" style={{ borderColor: 'rgba(245,240,232,0.12)' }}>
                  {social === 'facebook' && <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>}
                  {social === 'instagram' && <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M16 4H8a4 4 0 00-4 4v8a4 4 0 004 4h8a4 4 0 004-4V8a4 4 0 00-4-4zm-4 12a4 4 0 110-8 4 4 0 010 8zm4-8a1 1 0 110-2 1 1 0 010 2z"/></svg>}
                  {social === 'x' && <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231z"/></svg>}
                  {social === 'tiktok' && <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/></svg>}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-parchment text-[11px] tracking-[0.15em] mb-4">QUICK LINKS</h4>
            <ul className="space-y-2">
              {quickLinks.map(link => (
                <li key={link.label}>
                  {link.to.startsWith('/#') ? (
                    <a href={link.to.slice(1)} className="text-sand text-[11px] hover:text-gold transition-colors">{link.label}</a>
                  ) : (
                    <Link to={link.to} className="text-sand text-[11px] hover:text-gold transition-colors">{link.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-parchment text-[11px] tracking-[0.15em] mb-4">MENU</h4>
            <ul className="space-y-2">
              {menuLinks.map(item => (
                <li key={item}><Link to="/menu" className="text-sand text-[11px] hover:text-gold transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-parchment text-[11px] tracking-[0.15em] mb-4">CONTACT</h4>
            <ul className="space-y-3">
              <li><a href="tel:0721401757" className="flex items-start gap-2 text-sand text-[11px] hover:text-gold transition-colors"><Phone className="w-3 h-3 mt-0.5 text-gold shrink-0" />(07) 2140 1757</a></li>
              <li><a href="mailto:info@auracurryhousecafe.com" className="flex items-start gap-2 text-sand text-[11px] hover:text-gold transition-colors"><Mail className="w-3 h-3 mt-0.5 text-gold shrink-0" />info@auracurryhousecafe.com</a></li>
              <li><span className="flex items-start gap-2 text-sand text-[11px]"><MapPin className="w-3 h-3 mt-0.5 text-gold shrink-0" />3/16 Bryants Rd, Shailer Park QLD 4128</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-parchment text-[11px] tracking-[0.15em] mb-4">OPENING HOURS</h4>
            <ul className="space-y-1.5">
              {hours.map(h => (
                <li key={h.day} className="flex justify-between text-[10px]"><span className="text-sand">{h.day}</span><span className="text-parchment">{h.time}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(245,240,232,0.05)' }}>
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-[60px] flex flex-col md:flex-row items-center justify-between py-3 gap-2">
          <span className="text-sand text-[10px]">&copy; 2026 Aura Curry House Cafe. All Rights Reserved.</span>
          <div className="flex items-center gap-3 text-[10px]">
            <span className="text-sand">Privacy Policy</span>
            <span className="text-[rgba(245,240,232,0.15)]">|</span>
            <span className="text-sand">Terms & Conditions</span>
            <span className="text-[rgba(245,240,232,0.15)]">|</span>
            <span className="text-sand">Designed by PACEWALK</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
