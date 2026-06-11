import { Link } from 'react-router';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BookOpen, ShoppingBag, CalendarDays, Award, Utensils, Star, Leaf, ChevronLeft, ChevronRight, Plus, Flame, Users, PartyPopper } from 'lucide-react';
import { trpc } from '@/providers/trpc';
import { useCart } from '@/hooks/useCart';
import { useIsMobile } from '@/hooks/useIsMobile';
import MobileHome from '@/components/mobile/MobileHome';

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const isMobile = useIsMobile(1024);
  if (isMobile) return <MobileHome />;
  return <HomePageDesktop />;
}

function HomePageDesktop() {
const stats = [
  { icon: Award, value: '10+', label: 'YEARS OF EXPERIENCE' },
  { icon: Utensils, value: '50+', label: 'DELICIOUS DISHES' },
  { icon: Star, value: '4.8', label: 'GOOGLE REVIEWS' },
  { icon: Leaf, value: '100%', label: 'FRESH INGREDIENTS' },
];

const features = [
  { icon: Flame, title: 'AUTHENTIC RECIPES', desc: 'Traditional recipes crafted with authentic spices' },
  { icon: Leaf, title: 'FRESH INGREDIENTS', desc: 'Only the freshest & highest quality ingredients' },
  { icon: Users, title: 'FAMILY DINING', desc: 'Perfect place for family gatherings & celebrations' },
  { icon: PartyPopper, title: 'CATERING SERVICES', desc: 'Professional catering for all occasions' },
  { icon: ShoppingBag, title: 'ONLINE ORDERING', desc: 'Order your favorite dishes online with ease' },
];
  const heroRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const { addItem } = useCart();
  const { data: categories } = trpc.category.list.useQuery();
  const { data: bestSellers } = trpc.menu.bestSellers.useQuery();
  const createReservation = trpc.reservation.create.useMutation({
    onSuccess: () => setSubmitted(true),
  });

  useEffect(() => {
    if (!heroRef.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.animate-in').forEach((el: HTMLElement) => {
        gsap.fromTo(el, { opacity: 0, y: 30 }, {
          opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
        });
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  const [resForm, setResForm] = useState({ name: '', phone: '', date: '', time: '', guests: '2' });
  const [resError, setResError] = useState('');

  const handleReservation = (e: React.FormEvent) => {
    e.preventDefault();
    setResError('');
    if (!resForm.name.trim() || !resForm.phone.trim() || !resForm.date || !resForm.time) {
      setResError('Please fill in all required fields');
      return;
    }
    createReservation.mutate({
      name: resForm.name.trim(),
      phone: resForm.phone.trim(),
      date: resForm.date,
      time: resForm.time,
      guests: Number(resForm.guests),
    });
  };

  return (
    <div ref={heroRef}>
      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[95vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/hero-main.jpg" alt="Indian food" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/40" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
        </div>
        <div className="relative w-full pb-14 px-4 md:px-8 lg:px-[60px]">
          <div className="max-w-[1400px] mx-auto">
            <div className="max-w-[640px]">
              <span className="animate-in inline-flex items-center gap-2 eyebrow text-xl md:text-2xl mb-4">
                <span className="w-8 h-px bg-gold/60" /> Welcome to Aura
              </span>
              <h1 className="animate-in font-display text-parchment text-shadow mb-1" style={{ fontSize: 'clamp(2.4rem, 5.2vw, 4.4rem)', lineHeight: 1.05, letterSpacing: '0.01em' }}>AUTHENTIC INDIAN</h1>
              <h1 className="animate-in font-display text-parchment text-shadow mb-1" style={{ fontSize: 'clamp(2.4rem, 5.2vw, 4.4rem)', lineHeight: 1.05, letterSpacing: '0.01em' }}>FLAVOURS,</h1>
              <h1 className="animate-in font-display text-gold-gradient text-shadow mb-6" style={{ fontSize: 'clamp(2.4rem, 5.2vw, 4.4rem)', lineHeight: 1.05, letterSpacing: '0.01em' }}>CRAFTED WITH PASSION</h1>
              <p className="animate-in text-sand text-[15px] md:text-[16px] leading-relaxed max-w-[460px] mb-8">Experience the perfect blend of traditional Indian spices and modern culinary artistry — crafted fresh, served with heart.</p>
              <div className="animate-in flex flex-wrap gap-3 mb-12">
                <Link to="/menu" className="btn-gold flex items-center gap-2 rounded-full px-7 py-3.5 text-[12px] font-semibold tracking-[0.12em]">
                  <BookOpen className="w-4 h-4" /> VIEW MENU
                </Link>
                <Link to="/menu" className="btn-outline flex items-center gap-2 rounded-full px-7 py-3.5 text-[12px] font-medium tracking-[0.12em]">
                  <ShoppingBag className="w-4 h-4" /> ORDER ONLINE
                </Link>
                <a href="#reserve" className="btn-outline flex items-center gap-2 rounded-full px-7 py-3.5 text-[12px] font-medium tracking-[0.12em]">
                  <CalendarDays className="w-4 h-4" /> RESERVE TABLE
                </a>
              </div>
            </div>
            <div className="animate-in flex flex-wrap gap-4 md:gap-0 md:grid md:grid-cols-4 max-w-[680px] p-5 md:p-6 rounded-xl shadow-lux" style={{ background: 'rgba(15,15,15,0.6)', backdropFilter: 'blur(14px)', border: '1px solid rgba(201,168,76,0.14)' }}>
              {stats.map(s => (
                <div key={s.label} className="flex items-center gap-3 md:border-r md:last:border-0 md:px-5" style={{ borderColor: 'rgba(245,240,232,0.08)' }}>
                  <s.icon className="w-8 h-8 text-gold shrink-0" strokeWidth={1.2} />
                  <div><div className="font-display text-parchment text-2xl font-semibold leading-none mb-1">{s.value}</div><div className="text-sand text-[9px] tracking-[0.14em] leading-tight whitespace-pre-line">{s.label}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CATEGORIES ═══ */}
      <CategoriesSection categories={categories || []} />

      {/* ═══ CHEF RECOMMENDATIONS ═══ */}
      <section className="py-20 md:py-28 px-4 md:px-8 lg:px-[60px]" style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #0e0e0e 50%, #0a0a0a 100%)' }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col items-center text-center mb-14">
            <span className="animate-in eyebrow text-2xl mb-2">Chef's</span>
            <h2 className="animate-in font-display text-parchment text-3xl md:text-[2.6rem] tracking-wide leading-tight">RECOMMENDATIONS</h2>
            <div className="animate-in gold-rule mt-5" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
            {(bestSellers || []).slice(0, 5).map(item => (
              <div key={item.id} className="animate-in group card-lux rounded-xl overflow-hidden">
                <div className="relative overflow-hidden h-[180px] md:h-[200px]">
                  <img src={item.image || `/images/cat-${categories?.find(c => c.id === item.categoryId)?.slug || 'south-indian'}.jpg`} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0c0b] via-transparent to-transparent" />
                  {item.isBestSeller && <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[8px] font-bold tracking-[0.12em] text-dark" style={{ background: 'var(--gold-grad)' }}>BEST SELLER</div>}
                  {item.isVeg ? <div className="absolute top-2.5 right-2.5 w-4 h-4 border border-green-500 rounded-sm flex items-center justify-center bg-[#111]/60"><div className="w-2.5 h-2.5 rounded-full bg-green-500" /></div> : <div className="absolute top-2.5 right-2.5 w-4 h-4 border border-red-500 rounded-sm flex items-center justify-center bg-[#111]/60"><div className="w-2.5 h-2.5 rounded-full bg-red-500" /></div>}
                </div>
                <div className="p-4 pt-3">
                  <h3 className="font-display text-parchment text-[15px] tracking-wide mb-1 truncate">{item.name}</h3>
                  <p className="text-sand text-[11px] leading-snug mb-3 line-clamp-2 h-[30px]">{item.description || 'Authentic Indian delicacy'}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-gold text-lg font-semibold">${item.price}</span>
                    <button onClick={() => addItem({ id: item.id, name: item.name, price: Number(item.price), isVeg: item.isVeg, image: item.image || `/images/cat-${categories?.find(c => c.id === item.categoryId)?.slug || 'south-indian'}.jpg` })}
                      className="w-8 h-8 rounded-full border flex items-center justify-center text-gold hover:bg-gold hover:text-dark transition-colors" style={{ borderColor: 'rgba(201,168,76,0.4)' }}>
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/menu" className="btn-outline animate-in inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-[11px] font-medium tracking-[0.14em]">VIEW FULL MENU</Link>
          </div>
        </div>
      </section>

      {/* ═══ EXPERIENCE ═══ */}
      <section id="experience" className="py-20 md:py-28 px-4 md:px-8 lg:px-[60px]" style={{ background: '#0a0a0a', borderTop: '1px solid rgba(245,240,232,0.04)', borderBottom: '1px solid rgba(245,240,232,0.04)' }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 items-start">
            <div>
              <span className="animate-in block eyebrow text-2xl mb-2">The Aura</span>
              <h2 className="animate-in font-display text-parchment text-3xl md:text-[2.6rem] tracking-wide mb-5 leading-tight">EXPERIENCE</h2>
              <div className="animate-in h-px w-16 bg-gold/50 mb-5" />
              <p className="animate-in text-sand text-[14px] leading-relaxed max-w-[300px]">We don't just serve food, we serve experiences. From authentic recipes to warm hospitality, every moment at Aura is special.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {features.map(f => (
                <div key={f.title} className="animate-in group card-lux text-center p-5 rounded-xl">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full border border-gold/30 flex items-center justify-center group-hover:bg-[rgba(201,168,76,0.12)] group-hover:border-gold/60 transition-colors">
                    <f.icon className="w-5 h-5 text-gold" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-semibold text-parchment text-[11px] tracking-[0.1em] mb-2">{f.title}</h3>
                  <p className="text-sand text-[10.5px] leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ RESERVATION ═══ */}
      <section id="reserve" className="py-20 md:py-28 px-4 md:px-8 lg:px-[60px]" style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #0d0d0d 50%, #0a0a0a 100%)' }}>
        <div className="max-w-[620px] mx-auto">
          <div className="flex flex-col items-center text-center mb-10">
            <span className="animate-in eyebrow text-2xl mb-2">Book a Table</span>
            <h2 className="animate-in font-display text-parchment text-3xl md:text-[2.6rem] tracking-wide leading-tight">MAKE A RESERVATION</h2>
            <div className="animate-in gold-rule mt-5 mb-4" />
            <p className="animate-in text-sand text-[14px]">Reserve your table for an unforgettable dining experience</p>
          </div>
          {submitted ? (
            <div className="flex flex-col items-center gap-3 py-10">
              <div className="w-14 h-14 rounded-full bg-gold flex items-center justify-center">
                <svg className="w-6 h-6 text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="font-display text-parchment text-xl">Reservation Confirmed</h3>
              <p className="text-sand text-[14px] text-center">We will call you shortly to confirm your booking.</p>
            </div>
          ) : (
            <form onSubmit={handleReservation} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resError && (
                <div className="md:col-span-2 text-red-400 text-[13px] bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">{resError}</div>
              )}
              <div>
                <label className="text-sand text-[11px] uppercase tracking-wider mb-1.5 block">Full Name *</label>
                <input type="text" value={resForm.name} onChange={e => setResForm({ ...resForm, name: e.target.value })} placeholder="Your name"
                  className="w-full bg-transparent border rounded-lg text-parchment text-[14px] px-4 py-3 outline-none focus:border-gold transition-colors placeholder:text-[rgba(168,155,140,0.3)]"
                  style={{ borderColor: 'rgba(245,240,232,0.1)' }} />
              </div>
              <div>
                <label className="text-sand text-[11px] uppercase tracking-wider mb-1.5 block">Phone Number *</label>
                <input type="tel" value={resForm.phone} onChange={e => setResForm({ ...resForm, phone: e.target.value })} placeholder="04XX XXX XXX"
                  className="w-full bg-transparent border rounded-lg text-parchment text-[14px] px-4 py-3 outline-none focus:border-gold transition-colors placeholder:text-[rgba(168,155,140,0.3)]"
                  style={{ borderColor: 'rgba(245,240,232,0.1)' }} />
              </div>
              <div>
                <label className="text-sand text-[11px] uppercase tracking-wider mb-1.5 block">Date *</label>
                <input type="date" value={resForm.date} min={new Date().toISOString().split('T')[0]} onChange={e => setResForm({ ...resForm, date: e.target.value })}
                  className="w-full bg-transparent border rounded-lg text-parchment text-[14px] px-4 py-3 outline-none focus:border-gold transition-colors"
                  style={{ borderColor: 'rgba(245,240,232,0.1)', colorScheme: 'dark' }} />
              </div>
              <div>
                <label className="text-sand text-[11px] uppercase tracking-wider mb-1.5 block">Time *</label>
                <select value={resForm.time} onChange={e => setResForm({ ...resForm, time: e.target.value })}
                  className="w-full bg-transparent border rounded-lg text-parchment text-[14px] px-4 py-3 outline-none focus:border-gold transition-colors appearance-none"
                  style={{ borderColor: 'rgba(245,240,232,0.1)' }}>
                  <option value="" className="bg-[#111]">Select time</option>
                  {['11:30 AM','12:00 PM','12:30 PM','1:00 PM','5:30 PM','6:00 PM','6:30 PM','7:00 PM','7:30 PM','8:00 PM','8:30 PM','9:00 PM'].map(t => <option key={t} value={t} className="bg-[#111]">{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sand text-[11px] uppercase tracking-wider mb-1.5 block">Guests *</label>
                <select value={resForm.guests} onChange={e => setResForm({ ...resForm, guests: e.target.value })}
                  className="w-full bg-transparent border rounded-lg text-parchment text-[14px] px-4 py-3 outline-none focus:border-gold transition-colors appearance-none"
                  style={{ borderColor: 'rgba(245,240,232,0.1)' }}>
                  {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n} className="bg-[#111]">{n} {n === 1 ? 'Guest' : 'Guests'}</option>)}
                  <option value="9" className="bg-[#111]">9+ (Large group)</option>
                </select>
              </div>
              <div className="flex items-end">
                <button type="submit" disabled={createReservation.isPending}
                  className="btn-gold w-full rounded-lg py-3.5 text-[13px] font-semibold tracking-[0.12em] disabled:opacity-50">
                  {createReservation.isPending ? 'Submitting...' : 'BOOK TABLE'}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

/* ═══ Categories Carousel Sub-component ═══ */
function CategoriesSection({ categories }: { categories: Array<{ id: number; name: string; slug: string; description: string | null; image: string | null }> }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const check = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 10);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 260, behavior: 'smooth' });
    setTimeout(check, 400);
  };

  return (
    <section className="py-20 md:py-28 px-4 md:px-8 lg:px-[60px]" style={{ background: '#0a0a0a' }}>
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col items-center text-center mb-14">
          <span className="animate-in eyebrow text-2xl mb-2">Explore Our</span>
          <h2 className="animate-in font-display text-parchment text-3xl md:text-[2.6rem] tracking-wide leading-tight">POPULAR CATEGORIES</h2>
          <div className="animate-in gold-rule mt-5" />
        </div>
        <div className="relative">
          {canLeft && <button onClick={() => scroll(-1)} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-[rgba(15,15,15,0.9)] border border-[rgba(245,240,232,0.1)] flex items-center justify-center text-parchment hover:text-gold transition-colors"><ChevronLeft className="w-4 h-4" /></button>}
          <div ref={scrollRef} onScroll={check} className="flex gap-4 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-3">
            {(categories || []).map(cat => (
              <Link to="/menu" key={cat.id} className="animate-in snap-start shrink-0 group cursor-pointer" style={{ width: '230px' }}>
                <div className="relative overflow-hidden rounded-xl mb-4 h-[300px] ring-1 ring-[rgba(201,168,76,0.08)] group-hover:ring-[rgba(201,168,76,0.35)] transition-all">
                  <img src={cat.image || `/images/cat-${cat.slug}.jpg`} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/25 to-transparent" />
                  <div className="absolute inset-0 bg-gold/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                    <h3 className="font-display text-parchment text-[15px] tracking-[0.08em] group-hover:text-gold transition-colors">{cat.name.toUpperCase()}</h3>
                    <p className="text-sand text-[10.5px] mt-1 leading-snug">{cat.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {canRight && <button onClick={() => scroll(1)} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-[rgba(15,15,15,0.9)] border border-[rgba(245,240,232,0.1)] flex items-center justify-center text-parchment hover:text-gold transition-colors"><ChevronRight className="w-4 h-4" /></button>}
        </div>
      </div>
    </section>
  );
}