import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import credits from '@/data/imageCredits.json';

export default function CreditsPage() {
  return (
    <div className="max-w-[800px] mx-auto px-4 md:px-8 py-12 md:py-16">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sand text-[12px] hover:text-gold transition-colors mb-6">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
      </Link>
      <span className="block eyebrow text-xl mb-1">Attribution</span>
      <h1 className="font-display text-parchment text-3xl md:text-[2.4rem] tracking-wide mb-3 leading-tight">Photo Credits</h1>
      <p className="text-sand text-[13px] leading-relaxed mb-8 max-w-[560px]">
        Dish photography is sourced from Wikimedia Commons under Creative Commons / public-domain
        licenses. We gratefully credit the photographers below.
      </p>

      <ul className="divide-y" style={{ borderColor: 'rgba(245,240,232,0.06)' }}>
        {credits.map((c) => (
          <li key={c.dish} className="flex items-center gap-4 py-3">
            <img src={`/images/dishes/${c.dish}.jpg`} alt={c.title}
              className="w-14 h-14 rounded-lg object-cover shrink-0" loading="lazy" />
            <div className="min-w-0 flex-1">
              <p className="text-parchment text-[13px] font-medium capitalize">{c.dish.replace(/-/g, ' ')}</p>
              <p className="text-sand text-[11px] truncate">
                {c.author} · {c.license}
              </p>
            </div>
            {c.source && (
              <a href={c.source} target="_blank" rel="noopener noreferrer"
                className="text-gold text-[11px] hover:underline shrink-0">Source</a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
