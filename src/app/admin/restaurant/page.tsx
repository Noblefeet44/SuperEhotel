'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Utensils, ArrowLeft, Plus, Edit, Trash2, Save, X, Star, ToggleLeft, ToggleRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

const initialCategories = [
  { id: '1', name: 'Nigerian Dishes', itemCount: 5 },
  { id: '2', name: 'Grilled & Roasted', itemCount: 4 },
  { id: '3', name: 'Chops & Fries', itemCount: 5 },
  { id: '4', name: 'Drinks & Beverages', itemCount: 5 },
];

const initialItems = [
  { id: '1', category: 'Nigerian Dishes', name: 'Jollof Rice & Chicken', price: 3500, available: true, featured: true },
  { id: '2', category: 'Nigerian Dishes', name: 'Pounded Yam & Egusi Soup', price: 4000, available: true, featured: true },
  { id: '3', category: 'Nigerian Dishes', name: 'Pepper Soup (Goat Meat)', price: 3000, available: true, featured: false },
  { id: '4', category: 'Nigerian Dishes', name: 'Fried Rice & Grilled Fish', price: 4000, available: true, featured: false },
  { id: '5', category: 'Grilled & Roasted', name: 'Suya (Beef)', price: 2500, available: true, featured: true },
  { id: '6', category: 'Grilled & Roasted', name: 'Grilled Whole Chicken', price: 6000, available: true, featured: false },
  { id: '7', category: 'Chops & Fries', name: 'Chicken & Chips', price: 3000, available: true, featured: true },
  { id: '8', category: 'Chops & Fries', name: 'Meat Pie', price: 800, available: true, featured: false },
  { id: '9', category: 'Drinks & Beverages', name: 'Fresh Chapman', price: 1500, available: true, featured: true },
  { id: '10', category: 'Drinks & Beverages', name: 'Zobo Drink', price: 800, available: true, featured: false },
];

export default function AdminRestaurantPage() {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingItem, setEditingItem] = useState<typeof initialItems[0] | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem('admin_authenticated') !== 'true') router.push('/admin/login');
  }, [router]);

  const filteredItems = selectedCategory === 'all' ? items : items.filter(i => i.category === selectedCategory);

  const toggleAvailability = (id: string) => {
    setItems(items.map(i => i.id === id ? { ...i, available: !i.available } : i));
  };

  const toggleFeatured = (id: string) => {
    setItems(items.map(i => i.id === id ? { ...i, featured: !i.featured } : i));
  };

  const deleteItem = (id: string) => {
    if (confirm('Delete this menu item?')) setItems(items.filter(i => i.id !== id));
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header"><h2>Super E Hotel</h2><span>Admin Dashboard</span></div>
        <nav style={{ padding: 'var(--space-sm) 0' }}>
          <Link href="/admin" className="admin-nav-item"><ArrowLeft size={20} /><span>Back to Dashboard</span></Link>
          <div className="admin-nav-item active"><Utensils size={20} /><span>Restaurant</span></div>
        </nav>
      </aside>

      <main className="admin-main">
        <div className="admin-header">
          <h1>Restaurant Menu</h1>
          <button className="btn btn-primary" onClick={() => setEditingItem({ id: String(Date.now()), category: 'Nigerian Dishes', name: '', price: 0, available: true, featured: false })}>
            <Plus size={18} /> Add Item
          </button>
        </div>

        {/* Category Tabs */}
        <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-xl)', overflowX: 'auto' }}>
          <button onClick={() => setSelectedCategory('all')} className={`btn ${selectedCategory === 'all' ? 'btn-primary' : 'btn-ghost'} btn-sm`}>All Items</button>
          {initialCategories.map(cat => (
            <button key={cat.id} onClick={() => setSelectedCategory(cat.name)} className={`btn ${selectedCategory === cat.name ? 'btn-primary' : 'btn-ghost'} btn-sm`} style={{ whiteSpace: 'nowrap' }}>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Items Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Available</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => (
                <tr key={item.id}>
                  <td><strong>{item.name}</strong></td>
                  <td><span className="badge" style={{ background: 'var(--color-muted)', color: 'var(--color-text-secondary)' }}>{item.category}</span></td>
                  <td style={{ fontWeight: 600 }}>{formatPrice(item.price)}</td>
                  <td>
                    <button onClick={() => toggleAvailability(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: item.available ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
                      {item.available ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                    </button>
                  </td>
                  <td>
                    <button onClick={() => toggleFeatured(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: item.featured ? '#CA8A04' : 'var(--color-text-muted)' }}>
                      <Star size={18} fill={item.featured ? '#CA8A04' : 'none'} />
                    </button>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button onClick={() => setEditingItem(item)} className="btn btn-ghost btn-sm"><Edit size={14} /></button>
                      <button onClick={() => deleteItem(item.id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-destructive)' }}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit Modal */}
        {editingItem && (
          <>
            <div className="mobile-menu-overlay" onClick={() => setEditingItem(null)} />
            <div style={{
              position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              width: 'min(500px, 90vw)', background: 'var(--color-surface)',
              borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)', zIndex: 51, padding: 'var(--space-xl)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-xl)' }}>
                <h2 style={{ fontSize: '1.25rem' }}>{editingItem.name ? 'Edit Item' : 'Add Menu Item'}</h2>
                <button onClick={() => setEditingItem(null)} className="btn btn-ghost btn-icon"><X size={20} /></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                <div><label className="label">Item Name *</label><input className="input" value={editingItem.name} onChange={e => setEditingItem({ ...editingItem, name: e.target.value })} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
                  <div><label className="label">Price (₦) *</label><input className="input" type="number" value={editingItem.price} onChange={e => setEditingItem({ ...editingItem, price: parseInt(e.target.value) || 0 })} /></div>
                  <div><label className="label">Category</label>
                    <select className="input" value={editingItem.category} onChange={e => setEditingItem({ ...editingItem, category: e.target.value })}>
                      {initialCategories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end' }}>
                  <button onClick={() => setEditingItem(null)} className="btn btn-ghost">Cancel</button>
                  <button onClick={() => { if (editingItem.name) { setItems(prev => { const exists = prev.find(i => i.id === editingItem.id); return exists ? prev.map(i => i.id === editingItem.id ? editingItem : i) : [...prev, editingItem]; }); setEditingItem(null); } }} className="btn btn-primary"><Save size={16} /> Save</button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
