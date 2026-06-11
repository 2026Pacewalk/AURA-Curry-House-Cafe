import { useState } from 'react';
import { Link } from 'react-router';
import { LayoutDashboard, UtensilsCrossed, ClipboardList, CalendarCheck, Settings, Plus, Pencil, Trash2, X, Filter } from 'lucide-react';
import { trpc } from '@/providers/trpc';

type Tab = 'dashboard' | 'categories' | 'items' | 'orders' | 'reservations' | 'settings';

const ORDER_STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-500/20 text-blue-400',
  accepted: 'bg-yellow-500/20 text-yellow-400',
  preparing: 'bg-orange-500/20 text-orange-400',
  ready: 'bg-green-500/20 text-green-400',
  completed: 'bg-[rgba(201,168,76,0.2)] text-gold',
  cancelled: 'bg-red-500/20 text-red-400',
};

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  const tabs: { key: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'categories', label: 'Categories', icon: Filter },
    { key: 'items', label: 'Menu Items', icon: UtensilsCrossed },
    { key: 'orders', label: 'Orders', icon: ClipboardList },
    { key: 'reservations', label: 'Reservations', icon: CalendarCheck },
    { key: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen pt-2">
      {/* Mobile overlay */}
      {mobileOpen && <div className="fixed inset-0 bg-black/50 z-[998] lg:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen z-[999] lg:z-auto w-60 flex flex-col shrink-0 transition-transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`} style={{ background: '#0c0c0c', borderRight: '1px solid rgba(245,240,232,0.06)' }}>
        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'rgba(245,240,232,0.06)' }}>
          <Link to="/" className="font-serif text-gold text-lg tracking-wider">AURA</Link>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden text-sand"><X className="w-5 h-5" /></button>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {tabs.map(t => (
            <button key={t.key} onClick={() => { setTab(t.key); setMobileOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-[12px] font-medium tracking-wider transition-colors ${tab === t.key ? 'bg-gold/10 text-gold' : 'text-sand hover:text-parchment hover:bg-[rgba(245,240,232,0.03)]'}`}>
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t" style={{ borderColor: 'rgba(245,240,232,0.06)' }}>
          <Link to="/" className="block text-center text-sand text-[11px] hover:text-gold transition-colors py-2">Back to Website</Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="flex items-center gap-3 p-4 border-b lg:hidden" style={{ borderColor: 'rgba(245,240,232,0.06)' }}>
          <button onClick={() => setMobileOpen(true)} className="p-1"><Settings className="w-5 h-5 text-sand" /></button>
          <span className="font-serif text-gold text-lg">AURA Admin</span>
        </div>
        <div className="p-4 md:p-6">
          {tab === 'dashboard' && <DashboardTab />}
          {tab === 'categories' && <CategoriesTab />}
          {tab === 'items' && <ItemsTab />}
          {tab === 'orders' && <OrdersTab />}
          {tab === 'reservations' && <ReservationsTab />}
          {tab === 'settings' && <SettingsTab />}
        </div>
      </main>
    </div>
  );
}

/* ═══ Dashboard ═══ */
function DashboardTab() {
  const { data: orders } = trpc.order.list.useQuery();
  const { data: reservations } = trpc.reservation.list.useQuery();
  const { data: menuItems } = trpc.menu.list.useQuery();
  const { data: categories } = trpc.category.list.useQuery();

  const stats = [
    { label: 'Total Orders', value: orders?.length || 0, color: 'text-gold' },
    { label: 'New Orders', value: orders?.filter(o => o.status === 'new').length || 0, color: 'text-blue-400' },
    { label: 'Reservations', value: reservations?.length || 0, color: 'text-green-400' },
    { label: 'Menu Items', value: menuItems?.length || 0, color: 'text-parchment' },
    { label: 'Categories', value: categories?.length || 0, color: 'text-sand' },
  ];

  return (
    <div>
      <h1 className="font-display text-parchment text-xl mb-5">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        {stats.map(s => (
          <div key={s.label} className="p-4 rounded-lg" style={{ background: '#111', border: '1px solid rgba(245,240,232,0.06)' }}>
            <div className={`text-2xl font-display font-semibold ${s.color}`}>{s.value}</div>
            <div className="text-sand text-[11px] mt-1 tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <h2 className="font-semibold text-parchment text-[13px] tracking-wider mb-3">Recent Orders</h2>
      <div className="rounded-lg overflow-hidden" style={{ background: '#111', border: '1px solid rgba(245,240,232,0.06)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead><tr className="text-sand text-[10px] uppercase tracking-wider" style={{ borderBottom: '1px solid rgba(245,240,232,0.06)' }}>
              <th className="text-left p-3">#</th><th className="text-left p-3">Customer</th><th className="text-left p-3">Type</th><th className="text-left p-3">Total</th><th className="text-left p-3">Status</th><th className="text-left p-3">Date</th>
            </tr></thead>
            <tbody>
              {(orders || []).slice(0, 5).map(o => (
                <tr key={o.id} className="text-parchment hover:bg-[rgba(245,240,232,0.02)] transition-colors" style={{ borderBottom: '1px solid rgba(245,240,232,0.04)' }}>
                  <td className="p-3">#{o.id}</td><td className="p-3">{o.customerName}</td>
                  <td className="p-3"><span className="capitalize">{o.deliveryType}</span></td>
                  <td className="p-3 text-gold">${Number(o.total).toFixed(2)}</td>
                  <td className="p-3"><span className={`px-2 py-0.5 rounded-sm text-[10px] font-medium capitalize ${ORDER_STATUS_COLORS[o.status]}`}>{o.status}</span></td>
                  <td className="p-3 text-sand">{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ═══ Categories ═══ */
function CategoriesTab() {
  const utils = trpc.useUtils();
  const { data: cats } = trpc.category.list.useQuery();
  const create = trpc.category.create.useMutation({ onSuccess: () => utils.category.list.invalidate() });
  const update = trpc.category.update.useMutation({ onSuccess: () => utils.category.list.invalidate() });
  const del = trpc.category.delete.useMutation({ onSuccess: () => utils.category.list.invalidate() });
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', slug: '', description: '', image: '', sortOrder: 0, active: true });

  const openNew = () => { setEditId(null); setForm({ name: '', slug: '', description: '', image: '', sortOrder: 0, active: true }); setShowForm(true); };
  const openEdit = (c: NonNullable<typeof cats>[0]) => { setEditId(c.id); setForm({ name: c.name, slug: c.slug, description: c.description || '', image: c.image || '', sortOrder: c.sortOrder, active: c.active }); setShowForm(true); };

  const handleSubmit = () => {
    if (editId) update.mutate({ id: editId, ...form });
    else create.mutate(form);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-display text-parchment text-xl">Categories</h1>
        <button onClick={openNew} className="flex items-center gap-1.5 bg-gold text-dark rounded-md px-3 py-2 text-[11px] font-semibold hover:bg-[#e0c86b] transition-colors"><Plus className="w-3.5 h-3.5" /> Add Category</button>
      </div>
      <div className="rounded-lg overflow-hidden" style={{ background: '#111', border: '1px solid rgba(245,240,232,0.06)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead><tr className="text-sand text-[10px] uppercase tracking-wider" style={{ borderBottom: '1px solid rgba(245,240,232,0.06)' }}>
              <th className="text-left p-3">Name</th><th className="text-left p-3">Slug</th><th className="text-left p-3">Order</th><th className="text-left p-3">Status</th><th className="text-left p-3">Actions</th>
            </tr></thead>
            <tbody>
              {(cats || []).map(c => (
                <tr key={c.id} className="text-parchment hover:bg-[rgba(245,240,232,0.02)]" style={{ borderBottom: '1px solid rgba(245,240,232,0.04)' }}>
                  <td className="p-3">{c.name}</td><td className="p-3 text-sand">{c.slug}</td><td className="p-3">{c.sortOrder}</td>
                  <td className="p-3"><span className={`px-2 py-0.5 rounded-sm text-[10px] ${c.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{c.active ? 'Active' : 'Inactive'}</span></td>
                  <td className="p-3"><div className="flex gap-1">
                    <button onClick={() => openEdit(c)} className="p-1.5 text-sand hover:text-gold transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => del.mutate({ id: c.id })} className="p-1.5 text-sand hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showForm && <FormModal title={editId ? 'Edit Category' : 'New Category'} onClose={() => setShowForm(false)} onSubmit={handleSubmit}>
        <div className="space-y-3">
          <div><label className="text-sand text-[10px] uppercase tracking-wider mb-1 block">Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-transparent border rounded-md text-parchment text-[13px] px-3 py-2 outline-none focus:border-gold transition-colors" style={{ borderColor: 'rgba(245,240,232,0.1)' }} /></div>
          <div><label className="text-sand text-[10px] uppercase tracking-wider mb-1 block">Slug</label><input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="w-full bg-transparent border rounded-md text-parchment text-[13px] px-3 py-2 outline-none focus:border-gold transition-colors" style={{ borderColor: 'rgba(245,240,232,0.1)' }} /></div>
          <div><label className="text-sand text-[10px] uppercase tracking-wider mb-1 block">Description</label><input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full bg-transparent border rounded-md text-parchment text-[13px] px-3 py-2 outline-none focus:border-gold transition-colors" style={{ borderColor: 'rgba(245,240,232,0.1)' }} /></div>
          <div><label className="text-sand text-[10px] uppercase tracking-wider mb-1 block">Image URL</label><input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="w-full bg-transparent border rounded-md text-parchment text-[13px] px-3 py-2 outline-none focus:border-gold transition-colors" style={{ borderColor: 'rgba(245,240,232,0.1)' }} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-sand text-[10px] uppercase tracking-wider mb-1 block">Sort Order</label><input type="number" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: Number(e.target.value) })} className="w-full bg-transparent border rounded-md text-parchment text-[13px] px-3 py-2 outline-none focus:border-gold transition-colors" style={{ borderColor: 'rgba(245,240,232,0.1)' }} /></div>
            <div className="flex items-end"><label className="flex items-center gap-2 text-parchment text-[12px] cursor-pointer"><input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} className="accent-gold" /> Active</label></div>
          </div>
        </div>
      </FormModal>}
    </div>
  );
}

/* ═══ Menu Items ═══ */
function ItemsTab() {
  const utils = trpc.useUtils();
  const { data: items } = trpc.menu.list.useQuery();
  const { data: cats } = trpc.category.list.useQuery();
  const create = trpc.menu.create.useMutation({ onSuccess: () => utils.menu.list.invalidate() });
  const update = trpc.menu.update.useMutation({ onSuccess: () => utils.menu.list.invalidate() });
  const del = trpc.menu.delete.useMutation({ onSuccess: () => utils.menu.list.invalidate() });
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', categoryId: 1, description: '', price: '0', image: '', isVeg: true, spiceLevel: 0, isAvailable: true, isFeatured: false, isBestSeller: false, sortOrder: 0 });

  const openNew = () => { setEditId(null); setForm({ name: '', categoryId: cats?.[0]?.id || 1, description: '', price: '0', image: '', isVeg: true, spiceLevel: 0, isAvailable: true, isFeatured: false, isBestSeller: false, sortOrder: 0 }); setShowForm(true); };
  const openEdit = (item: NonNullable<typeof items>[0]) => { setEditId(item.id); setForm({ name: item.name, categoryId: item.categoryId, description: item.description || '', price: item.price, image: item.image || '', isVeg: item.isVeg, spiceLevel: item.spiceLevel, isAvailable: item.isAvailable, isFeatured: item.isFeatured, isBestSeller: item.isBestSeller, sortOrder: item.sortOrder }); setShowForm(true); };
  const handleSubmit = () => { if (editId) update.mutate({ id: editId, ...form }); else create.mutate(form); setShowForm(false); };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-display text-parchment text-xl">Menu Items</h1>
        <button onClick={openNew} className="flex items-center gap-1.5 bg-gold text-dark rounded-md px-3 py-2 text-[11px] font-semibold hover:bg-[#e0c86b] transition-colors"><Plus className="w-3.5 h-3.5" /> Add Item</button>
      </div>
      <div className="rounded-lg overflow-hidden" style={{ background: '#111', border: '1px solid rgba(245,240,232,0.06)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead><tr className="text-sand text-[9px] uppercase tracking-wider" style={{ borderBottom: '1px solid rgba(245,240,232,0.06)' }}>
              <th className="text-left p-2.5">Name</th><th className="text-left p-2.5">Category</th><th className="text-left p-2.5">Price</th><th className="text-left p-2.5">Veg</th><th className="text-left p-2.5">Available</th><th className="text-left p-2.5">Featured</th><th className="text-left p-2.5">Actions</th>
            </tr></thead>
            <tbody>
              {(items || []).map(item => (
                <tr key={item.id} className="text-parchment hover:bg-[rgba(245,240,232,0.02)]" style={{ borderBottom: '1px solid rgba(245,240,232,0.04)' }}>
                  <td className="p-2.5 font-medium">{item.name}</td>
                  <td className="p-2.5 text-sand">{cats?.find(c => c.id === item.categoryId)?.name || '-'}</td>
                  <td className="p-2.5 text-gold">${item.price}</td>
                  <td className="p-2.5"><span className={`text-[9px] px-1.5 py-0.5 rounded ${item.isVeg ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{item.isVeg ? 'Veg' : 'Non-Veg'}</span></td>
                  <td className="p-2.5"><span className={`text-[9px] px-1.5 py-0.5 rounded ${item.isAvailable ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{item.isAvailable ? 'Yes' : 'No'}</span></td>
                  <td className="p-2.5"><span className={`text-[9px] px-1.5 py-0.5 rounded ${item.isFeatured ? 'bg-gold/20 text-gold' : 'bg-[rgba(245,240,232,0.05)] text-sand'}`}>{item.isFeatured ? 'Yes' : 'No'}</span></td>
                  <td className="p-2.5"><div className="flex gap-1"><button onClick={() => openEdit(item)} className="p-1 text-sand hover:text-gold"><Pencil className="w-3 h-3" /></button><button onClick={() => del.mutate({ id: item.id })} className="p-1 text-sand hover:text-red-400"><Trash2 className="w-3 h-3" /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showForm && <FormModal title={editId ? 'Edit Menu Item' : 'New Menu Item'} onClose={() => setShowForm(false)} onSubmit={handleSubmit}>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          <div><label className="text-sand text-[10px] uppercase tracking-wider mb-1 block">Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-transparent border rounded-md text-parchment text-[13px] px-3 py-2 outline-none focus:border-gold" style={{ borderColor: 'rgba(245,240,232,0.1)' }} /></div>
          <div><label className="text-sand text-[10px] uppercase tracking-wider mb-1 block">Category</label>
            <select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: Number(e.target.value) })} className="w-full bg-transparent border rounded-md text-parchment text-[13px] px-3 py-2 outline-none focus:border-gold appearance-none" style={{ borderColor: 'rgba(245,240,232,0.1)' }}>
              {(cats || []).map(c => <option key={c.id} value={c.id} className="bg-[#111]">{c.name}</option>)}
            </select>
          </div>
          <div><label className="text-sand text-[10px] uppercase tracking-wider mb-1 block">Description</label><input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full bg-transparent border rounded-md text-parchment text-[13px] px-3 py-2 outline-none focus:border-gold" style={{ borderColor: 'rgba(245,240,232,0.1)' }} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-sand text-[10px] uppercase tracking-wider mb-1 block">Price</label><input value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="w-full bg-transparent border rounded-md text-parchment text-[13px] px-3 py-2 outline-none focus:border-gold" style={{ borderColor: 'rgba(245,240,232,0.1)' }} /></div>
            <div><label className="text-sand text-[10px] uppercase tracking-wider mb-1 block">Spice Level (0-3)</label><input type="number" min={0} max={3} value={form.spiceLevel} onChange={e => setForm({ ...form, spiceLevel: Number(e.target.value) })} className="w-full bg-transparent border rounded-md text-parchment text-[13px] px-3 py-2 outline-none focus:border-gold" style={{ borderColor: 'rgba(245,240,232,0.1)' }} /></div>
          </div>
          <div><label className="text-sand text-[10px] uppercase tracking-wider mb-1 block">Image URL</label><input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="w-full bg-transparent border rounded-md text-parchment text-[13px] px-3 py-2 outline-none focus:border-gold" style={{ borderColor: 'rgba(245,240,232,0.1)' }} /></div>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2 text-parchment text-[12px] cursor-pointer"><input type="checkbox" checked={form.isVeg} onChange={e => setForm({ ...form, isVeg: e.target.checked })} className="accent-gold" /> Vegetarian</label>
            <label className="flex items-center gap-2 text-parchment text-[12px] cursor-pointer"><input type="checkbox" checked={form.isAvailable} onChange={e => setForm({ ...form, isAvailable: e.target.checked })} className="accent-gold" /> Available</label>
            <label className="flex items-center gap-2 text-parchment text-[12px] cursor-pointer"><input type="checkbox" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} className="accent-gold" /> Featured</label>
            <label className="flex items-center gap-2 text-parchment text-[12px] cursor-pointer"><input type="checkbox" checked={form.isBestSeller} onChange={e => setForm({ ...form, isBestSeller: e.target.checked })} className="accent-gold" /> Best Seller</label>
          </div>
        </div>
      </FormModal>}
    </div>
  );
}

/* ═══ Orders ═══ */
function OrdersTab() {
  const utils = trpc.useUtils();
  const { data: orders } = trpc.order.list.useQuery();
  const updateStatus = trpc.order.updateStatus.useMutation({ onSuccess: () => utils.order.list.invalidate() });
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = statusFilter === 'all' ? (orders || []) : (orders || []).filter(o => o.status === statusFilter);

  return (
    <div>
      <h1 className="font-display text-parchment text-xl mb-4">Orders</h1>
      <div className="flex gap-1.5 mb-4 flex-wrap">
        {['all', 'new', 'accepted', 'preparing', 'ready', 'completed', 'cancelled'].map((s: string) => (
          <button key={s} onClick={() => setStatusFilter(s)} className={`px-2.5 py-1 rounded-md text-[10px] font-medium tracking-wider capitalize transition-colors ${statusFilter === s ? 'bg-gold text-dark' : 'text-sand border hover:text-parchment'}`} style={statusFilter !== s ? { borderColor: 'rgba(245,240,232,0.1)' } : {}}>
            {s} {s !== 'all' && `(${(orders || []).filter(o => o.status === s).length})`}
          </button>
        ))}
      </div>
      <div className="rounded-lg overflow-hidden" style={{ background: '#111', border: '1px solid rgba(245,240,232,0.06)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead><tr className="text-sand text-[9px] uppercase tracking-wider" style={{ borderBottom: '1px solid rgba(245,240,232,0.06)' }}>
              <th className="text-left p-2.5">#</th><th className="text-left p-2.5">Customer</th><th className="text-left p-2.5">Mobile</th><th className="text-left p-2.5">Type</th><th className="text-left p-2.5">Total</th><th className="text-left p-2.5">Status</th><th className="text-left p-2.5">Date</th><th className="text-left p-2.5">Action</th>
            </tr></thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} className="text-parchment hover:bg-[rgba(245,240,232,0.02)]" style={{ borderBottom: '1px solid rgba(245,240,232,0.04)' }}>
                  <td className="p-2.5">#{o.id}</td><td className="p-2.5">{o.customerName}</td><td className="p-2.5 text-sand">{o.customerMobile}</td>
                  <td className="p-2.5"><span className="capitalize">{o.deliveryType === 'dineIn' ? 'Dine-In' : o.deliveryType}</span></td>
                  <td className="p-2.5 text-gold">${Number(o.total).toFixed(2)}</td>
                  <td className="p-2.5"><span className={`px-1.5 py-0.5 rounded-sm text-[9px] font-medium capitalize ${ORDER_STATUS_COLORS[o.status]}`}>{o.status}</span></td>
                  <td className="p-2.5 text-sand">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="p-2.5"><select value={o.status} onChange={e => updateStatus.mutate({ id: o.id, status: e.target.value as 'new' | 'accepted' | 'preparing' | 'ready' | 'completed' | 'cancelled' })}
                    className="bg-transparent border rounded text-[10px] px-1.5 py-1 text-parchment outline-none" style={{ borderColor: 'rgba(245,240,232,0.1)' }}>
                    {['new', 'accepted', 'preparing', 'ready', 'completed', 'cancelled'].map(s => <option key={s} value={s} className="bg-[#111]">{s}</option>)}
                  </select></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ═══ Reservations ═══ */
function ReservationsTab() {
  const utils = trpc.useUtils();
  const { data: res } = trpc.reservation.list.useQuery();
  const updateStatus = trpc.reservation.updateStatus.useMutation({ onSuccess: () => utils.reservation.list.invalidate() });
  const del = trpc.reservation.delete.useMutation({ onSuccess: () => utils.reservation.list.invalidate() });
  const [statusFilter, setStatusFilter] = useState('all');
  const filtered = statusFilter === 'all' ? (res || []) : (res || []).filter(r => r.status === statusFilter);

  return (
    <div>
      <h1 className="font-display text-parchment text-xl mb-4">Reservations</h1>
      <div className="flex gap-1.5 mb-4 flex-wrap">
        {['all', 'pending', 'confirmed', 'cancelled', 'completed'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} className={`px-2.5 py-1 rounded-md text-[10px] font-medium tracking-wider capitalize transition-colors ${statusFilter === s ? 'bg-gold text-dark' : 'text-sand border hover:text-parchment'}`} style={statusFilter !== s ? { borderColor: 'rgba(245,240,232,0.1)' } : {}}>{s}</button>
        ))}
      </div>
      <div className="rounded-lg overflow-hidden" style={{ background: '#111', border: '1px solid rgba(245,240,232,0.06)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead><tr className="text-sand text-[9px] uppercase tracking-wider" style={{ borderBottom: '1px solid rgba(245,240,232,0.06)' }}>
              <th className="text-left p-2.5">Name</th><th className="text-left p-2.5">Phone</th><th className="text-left p-2.5">Date</th><th className="text-left p-2.5">Time</th><th className="text-left p-2.5">Guests</th><th className="text-left p-2.5">Status</th><th className="text-left p-2.5">Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="text-parchment hover:bg-[rgba(245,240,232,0.02)]" style={{ borderBottom: '1px solid rgba(245,240,232,0.04)' }}>
                  <td className="p-2.5">{r.name}</td><td className="p-2.5 text-sand">{r.phone}</td><td className="p-2.5">{r.date}</td><td className="p-2.5">{r.time}</td><td className="p-2.5">{r.guests}</td>
                  <td className="p-2.5"><span className={`px-1.5 py-0.5 rounded-sm text-[9px] capitalize ${r.status === 'confirmed' ? 'bg-green-500/20 text-green-400' : r.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : r.status === 'cancelled' ? 'bg-red-500/20 text-red-400' : 'bg-gold/20 text-gold'}`}>{r.status}</span></td>
                  <td className="p-2.5"><div className="flex gap-1">
                    {r.status === 'pending' && <button onClick={() => updateStatus.mutate({ id: r.id, status: 'confirmed' })} className="px-2 py-0.5 text-[9px] bg-green-500/20 text-green-400 rounded hover:bg-green-500/30">Confirm</button>}
                    <button onClick={() => del.mutate({ id: r.id })} className="p-1 text-sand hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ═══ Settings ═══ */
function SettingsTab() {
  const utils = trpc.useUtils();
  const { data: settings } = trpc.setting.getAll.useQuery();
  const bulkSet = trpc.setting.bulkSet.useMutation({ onSuccess: () => utils.setting.getAll.invalidate() });
  const [form, setForm] = useState<Record<string, string>>({});

  const fields = [
    { key: 'phone', label: 'Phone Number' },
    { key: 'whatsapp', label: 'WhatsApp Number' },
    { key: 'email', label: 'Email' },
    { key: 'address', label: 'Address' },
    { key: 'hours', label: 'Opening Hours' },
    { key: 'facebook', label: 'Facebook URL' },
    { key: 'instagram', label: 'Instagram URL' },
    { key: 'tiktok', label: 'TikTok URL' },
    { key: 'taxRate', label: 'Tax Rate (%)' },
  ];

  const getValue = (key: string) => {
    if (form[key] !== undefined) return form[key];
    return settings?.find(s => s.key === key)?.value || '';
  };

  const handleSave = () => {
    bulkSet.mutate(form);
  };

  return (
    <div>
      <h1 className="font-display text-parchment text-xl mb-5">Website Settings</h1>
      <div className="max-w-lg space-y-3">
        {fields.map(f => (
          <div key={f.key}>
            <label className="text-sand text-[10px] uppercase tracking-wider mb-1 block">{f.label}</label>
            <input value={getValue(f.key)} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
              className="w-full bg-transparent border rounded-md text-parchment text-[13px] px-3 py-2.5 outline-none focus:border-gold transition-colors"
              style={{ borderColor: 'rgba(245,240,232,0.1)' }} />
          </div>
        ))}
        <button onClick={handleSave} className="bg-gold text-dark rounded-md px-5 py-2.5 text-[12px] font-semibold tracking-wider hover:bg-[#e0c86b] transition-colors mt-2">
          SAVE SETTINGS
        </button>
      </div>
    </div>
  );
}

/* ═══ Form Modal ═══ */
function FormModal({ title, onClose, onSubmit, children }: { title: string; onClose: () => void; onSubmit: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-lg p-5" style={{ background: '#111', border: '1px solid rgba(245,240,232,0.08)' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-parchment text-lg">{title}</h3>
          <button onClick={onClose} className="text-sand hover:text-parchment"><X className="w-4 h-4" /></button>
        </div>
        {children}
        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="flex-1 border rounded-md py-2 text-[11px] font-medium text-sand hover:border-gold transition-colors" style={{ borderColor: 'rgba(245,240,232,0.15)' }}>Cancel</button>
          <button onClick={onSubmit} className="flex-1 bg-gold text-dark rounded-md py-2 text-[11px] font-semibold hover:bg-[#e0c86b] transition-colors">Save</button>
        </div>
      </div>
    </div>
  );
}
