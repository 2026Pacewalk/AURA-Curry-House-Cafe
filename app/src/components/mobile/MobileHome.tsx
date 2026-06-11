import { Link } from 'react-router';
import { Flame, Clock, Star, ArrowRight, Bike, Store } from 'lucide-react';
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

export default function MobileHome() {
  const { data: categories } = trpc.category.list.useQuery();
  const { data: bestSellers } = trpc.menu.bestSellers.useQuery();
  const { data: featured } = trpc.menu.featured.useQuery();
  const { addItem } = useCart();

  return (
    <div className="pb-20 lg:hidden">
      {/* Hero Banner — full width, no gap, no animation */}
      <div className="relative h-[280px]" style={{ zIndex: 1 }}>
        <img src="/images/hero-main.jpg" alt="Aura Curry House" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/55 to-[#0a0a0a]/25" />
        <div className="absolute bottom-0 left-0 right-0 p-4 pb-5">
          <p className="eyebrow text-xl mb-1.5">Authentic Indian Flavours</p>
          <h1 className="font-display text-parchment text-[28px] leading-[1.08] mb-3">
            CRAFTED WITH<br /><span className="text-gold-gradient">PASSION</span>
          </h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.25)' }}>
              <Clock className="w-3 h-3 text-gold" />
              <span className="text-gold text-[10px] font-medium">30-45 min</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: 'rgba(245,240,232,0.06)' }}>
              <Star className="w-3 h-3 text-gold fill-gold" />
              <span className="text-parchment text-[10px]">4.8</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="px-3 -mt-3 relative z-10">
        <div className="grid grid-cols-2 gap-2">
          <Link to="/menu" className="flex items-center gap-2.5 p-3 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.12), rgba(201,168,76,0.04))', border: '1px solid rgba(201,168,76,0.15)' }}>
            <Bike className="w-5 h-5 text-gold" />
            <div><span className="text-parchment text-[12px] font-semibold block">Delivery</span><span className="text-sand text-[9px]">Order to your door</span></div>
          </Link>
          <Link to="/menu" className="flex items-center gap-2.5 p-3 rounded-xl" style={{ background: 'rgba(245,240,232,0.04)', border: '1px solid rgba(245,240,232,0.06)' }}>
            <Store className="w-5 h-5 text-parchment" />
            <div><span className="text-parchment text-[12px] font-semibold block">Pickup</span><span className="text-sand text-[9px]">Collect in store</span></div>
          </Link>
        </div>
      </div>

      {/* Category Pills - Horizontal Scroll */}
      <div className="mt-5 px-3">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="font-display text-parchment text-[18px] tracking-wide">Categories</h2>
          <Link to="/menu" className="text-gold text-[10px] flex items-center gap-0.5">See All <ArrowRight className="w-3 h-3" /></Link>
        </div>
        <div className="flex gap-2.5 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-1">
          {(categories || []).map(cat => (
            <Link to="/menu" key={cat.id} className="snap-start flex flex-col items-center gap-1.5 shrink-0" style={{ width: '72px' }}>
              <div className="w-[72px] h-[72px] rounded-full overflow-hidden shrink-0" style={{ border: '1px solid rgba(201,168,76,0.15)' }}>
                <img src={catIcons[cat.slug] || cat.image || ''} alt={cat.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <span className="text-parchment text-[9px] text-center leading-tight font-medium">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Best Sellers */}
      <div className="mt-5 px-3">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="font-display text-parchment text-[18px] tracking-wide flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-gold" /> Best Sellers
          </h2>
          <Link to="/menu" className="text-gold text-[10px] flex items-center gap-0.5">See All <ArrowRight className="w-3 h-3" /></Link>
        </div>
        <div className="flex gap-3 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-1">
          {(bestSellers || []).slice(0, 6).map(item => (
            <div key={item.id} className="snap-start shrink-0 rounded-xl overflow-hidden" style={{ width: '160px', background: '#111', border: '1px solid rgba(245,240,232,0.06)' }}>
              <div className="relative h-[120px] overflow-hidden">
                <img src={catIcons[['quick-snacks','south-indian','north-indian','indo-chinese','biryani','desserts','beverages'][item.categoryId - 1] || 'south-indian']} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent" />
                <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                  {item.isBestSeller && <span className="px-1.5 py-0.5 rounded-[3px] text-[7px] font-bold tracking-wider bg-[#c9a84c] text-white shadow-md">BESTSELLER</span>}
                </div>
                <div className="absolute top-2 left-2">
                  {item.isVeg ? (
                    <div className="w-4 h-4 border border-green-500 rounded-[2px] flex items-center justify-center bg-[#111]/60"><div className="w-2.5 h-2.5 rounded-full bg-green-500" /></div>
                  ) : (
                    <div className="w-4 h-4 border border-red-500 rounded-[2px] flex items-center justify-center bg-[#111]/60"><div className="w-2.5 h-2.5 rounded-full bg-red-500" /></div>
                  )}
                </div>
              </div>
              <div className="p-2.5">
                <h3 className="text-parchment text-[11px] font-medium truncate">{item.name}</h3>
                <p className="text-sand text-[9px] line-clamp-1 mt-0.5">{item.description || 'Authentic Indian'}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-gold text-[13px] font-display font-semibold">${item.price}</span>
                  <button onClick={() => addItem({ id: item.id, name: item.name, price: Number(item.price), isVeg: item.isVeg, image: item.image || catIcons[['quick-snacks','south-indian','north-indian','indo-chinese','biryani','desserts','beverages'][item.categoryId - 1]] })}
                    className="px-3 py-1 rounded-md text-[10px] font-semibold bg-gold text-dark active:scale-95 transition-transform">ADD</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Items - Horizontal Cards */}
      <div className="mt-5 px-3">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="font-display text-parchment text-[18px] tracking-wide">Chef's Special</h2>
          <Link to="/menu" className="text-gold text-[10px] flex items-center gap-0.5">See All <ArrowRight className="w-3 h-3" /></Link>
        </div>
        <div className="space-y-2.5">
          {(featured || []).slice(0, 4).map(item => (
            <div key={item.id} className="flex gap-3 p-2.5 rounded-xl" style={{ background: '#111', border: '1px solid rgba(245,240,232,0.05)' }}>
              <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 self-center">
                <img src={catIcons[['quick-snacks','south-indian','north-indian','indo-chinese','biryani','desserts','beverages'][item.categoryId - 1] || 'south-indian']} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="flex-1 min-w-0 py-0.5">
                <div className="flex items-center gap-1.5">
                  {item.isVeg ? <div className="w-3 h-3 border border-green-500 rounded-[2px] flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-green-500" /></div> : <div className="w-3 h-3 border border-red-500 rounded-[2px] flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-red-500" /></div>}
                  <h3 className="text-parchment text-[13px] font-medium truncate">{item.name}</h3>
                </div>
                <p className="text-sand text-[10px] line-clamp-1 mt-0.5">{item.description || 'Authentic Indian preparation'}</p>
                {item.spiceLevel > 0 && (
                  <div className="flex gap-0.5 mt-1">
                    {[1,2,3].map(i => <Flame key={i} className={`w-2.5 h-2.5 ${i <= item.spiceLevel ? 'text-red-400' : 'text-[rgba(245,240,232,0.08)]'}`} />)}
                  </div>
                )}
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-gold text-[14px] font-display font-semibold">${item.price}</span>
                  <button onClick={() => addItem({ id: item.id, name: item.name, price: Number(item.price), isVeg: item.isVeg, image: item.image || catIcons[['quick-snacks','south-indian','north-indian','indo-chinese','biryani','desserts','beverages'][item.categoryId - 1]] })}
                    className="px-3 py-1 rounded-md text-[10px] font-semibold tracking-wider bg-gold text-dark active:scale-95 transition-transform">ADD</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reservation Banner */}
      <div className="mt-7 mx-3 p-5 rounded-2xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.12), rgba(201,168,76,0.02))', border: '1px solid rgba(201,168,76,0.18)' }}>
        <p className="eyebrow text-base mb-0.5">Book a Table</p>
        <h3 className="font-display text-parchment text-[19px] mb-1.5">Reserve Your Experience</h3>
        <p className="text-sand text-[11.5px] mb-4 leading-relaxed">Book your table for a memorable dining experience.</p>
        <a href="/#reserve" className="btn-gold inline-block rounded-lg px-6 py-2.5 text-[11px] font-semibold tracking-[0.12em]">BOOK NOW</a>
      </div>

      {/* Quick Info */}
      <div className="mt-5 mx-3 mb-4 p-3.5 rounded-xl" style={{ background: 'rgba(245,240,232,0.03)', border: '1px solid rgba(245,240,232,0.05)' }}>
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-3.5 h-3.5 text-gold" />
          <span className="text-gold text-[10px] uppercase tracking-wider">Open Now</span>
        </div>
        <p className="text-sand text-[11px]">Mon – Sun: 10:00 AM – 09:30 PM</p>
        <p className="text-sand text-[11px] mt-1">3/16 Bryants Rd, Shailer Park QLD</p>
      </div>
    </div>
  );
}
