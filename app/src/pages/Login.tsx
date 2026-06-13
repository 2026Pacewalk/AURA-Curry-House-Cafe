import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Lock, ShieldCheck } from 'lucide-react';
import { trpc } from '@/providers/trpc';

export default function Login() {
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const [password, setPassword] = useState('');
  const login = trpc.auth.adminLogin.useMutation({
    onSuccess: async () => {
      await utils.auth.me.invalidate();
      navigate('/admin');
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center px-5" style={{ background: '#0a0a0a' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-7">
          <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)' }}>
            <ShieldCheck className="w-6 h-6 text-gold" strokeWidth={1.6} />
          </div>
          <span className="font-serif text-gold-gradient text-[26px] tracking-[0.16em] block">AURA</span>
          <p className="eyebrow text-lg mt-1">Admin Access</p>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); login.mutate({ password }); }}
          className="card-lux rounded-2xl p-6"
        >
          <label className="text-sand text-[10px] uppercase tracking-[0.15em] font-medium mb-1.5 block">Owner Password</label>
          <div className="relative mb-4">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sand" />
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full bg-transparent border rounded-full text-parchment text-[14px] pl-10 pr-4 py-3 outline-none focus:border-gold transition-colors placeholder:text-[rgba(168,155,140,0.4)]"
              style={{ borderColor: 'rgba(245,240,232,0.12)' }}
            />
          </div>

          {login.isError && (
            <p className="text-red-400 text-[12px] mb-3">{login.error.message}</p>
          )}

          <button
            type="submit"
            disabled={login.isPending || !password}
            className="btn-gold w-full rounded-full py-3 text-[12px] font-semibold tracking-[0.14em] disabled:opacity-50"
          >
            {login.isPending ? 'Signing in…' : 'SIGN IN'}
          </button>
        </form>
      </div>
    </div>
  );
}
