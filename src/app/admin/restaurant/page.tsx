'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Utensils, ArrowLeft, Plus, Edit, Trash2, Save, X, Star,
  ToggleLeft, ToggleRight, CheckCircle2, Sparkles
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { AdminMobileNav } from '@/components/admin/AdminMobileNav';

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

  const filteredItems = selectedCategory === 'all' ? items : items.filter((i) => i.category === selectedCategory);

  const toggleAvailability = (id: string) => {
    setItems(items.map((i) => (i.id === id ? { ...i, available: !i.available } : i)));
  };

  const toggleFeatured = (id: string) => {
    setItems(items.map((i) => (i.id === id ? { ...i, featured: !i.featured } : i)));
  };

  const deleteItem = (id: string) => {
    if (confirm('Delete this menu item?')) setItems(items.filter((i) => i.id !== id));
  };

  return (
    <div className="admin-layout" style={{ maxWidth: '100vw', overflowX: 'hidden', width: '100%', boxSizing: 'border-box' }}>
      {/* Mobile Top Navigation */}
      <AdminMobileNav
        title="Restaurant Menu"
        subtitle={`${items.length} dishes & drinks`}
        backHref="/admin"
      />

      {/* Desktop Sidebar (Preserved for desktop view) */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Super E Hotel</h2>
          <span>Admin Dashboard</span>
        </div>
        <nav style={{ padding: 'var(--space-sm) 0' }}>
          <Link href="/admin" className="admin-nav-item">
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </Link>
          <div className="admin-nav-item active">
            <Utensils size={20} />
            <span>Restaurant</span>
          </div>
          <Link href="/admin/bookings" className="admin-nav-item">
            <span>Bookings</span>
          </Link>
          <Link href="/admin/rooms" className="admin-nav-item">
            <span>Rooms &amp; Inventory</span>
          </Link>
        </nav>
      </aside>

      <main className="admin-main" style={{ minWidth: 0, width: '100%', maxWidth: '100vw', overflowX: 'hidden', boxSizing: 'border-box' }}>
        {/* Header */}
        <div className="admin-header" style={{ marginBottom: '1rem' }}>
          <div>
            <h1 style={{ margin: 0 }}>Restaurant &amp; Bar Menu</h1>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: '#64748B' }}>
              Manage menu dishes, update prices, and 1-tap toggle sold-out availability.
            </p>
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={() =>
              setEditingItem({
                id: String(Date.now()),
                category: 'Nigerian Dishes',
                name: '',
                price: 0,
                available: true,
                featured: false,
              })
            }
          >
            <Plus size={16} /> Add Item
          </button>
        </div>

        {/* Category Tabs */}
        <div className="admin-mobile-filter-strip" style={{ marginBottom: '1rem' }}>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`filter-pill-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          >
            All Items
          </button>
          {initialCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`filter-pill-btn ${selectedCategory === cat.name ? 'active' : ''}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* =========================================================
            MOBILE MENU ITEM CARDS (App Experience)
            ========================================================= */}
        <div className="admin-mobile-restaurant-list">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid #E2E8F0',
                padding: '0.85rem',
                marginBottom: '0.65rem',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 800, color: '#0F172A' }}>
                    {item.name}
                  </h4>
                  <span style={{ fontSize: '0.7rem', color: '#64748B' }}>{item.category}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: '#16A34A', display: 'block' }}>
                    {formatPrice(item.price)}
                  </span>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '0.5rem',
                  borderTop: '1px solid #F1F5F9',
                }}
              >
                {/* 1-Tap In-Stock Toggle */}
                <button
                  type="button"
                  onClick={() => toggleAvailability(item.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '0.35rem 0.65rem',
                    borderRadius: '8px',
                    backgroundColor: item.available ? '#DCFCE7' : '#FEE2E2',
                    color: item.available ? '#166534' : '#991B1B',
                    border: item.available ? '1px solid #BBF7D0' : '1px solid #FECACA',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {item.available ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                  <span>{item.available ? 'Available / In Stock' : 'Sold Out / Unavailable'}</span>
                </button>

                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <button
                    onClick={() => toggleFeatured(item.id)}
                    className="btn btn-ghost btn-sm"
                    style={{ color: item.featured ? '#D97706' : '#94A3B8', padding: '0.35rem' }}
                    title="Featured Dish"
                  >
                    <Star size={16} fill={item.featured ? '#D97706' : 'none'} />
                  </button>

                  <button
                    onClick={() => setEditingItem(item)}
                    className="btn btn-outline btn-sm"
                    style={{ padding: '0.35rem 0.6rem', fontSize: '0.74rem', fontWeight: 700 }}
                  >
                    <Edit size={13} /> Edit
                  </button>

                  <button
                    onClick={() => deleteItem(item.id)}
                    className="btn btn-ghost btn-sm"
                    style={{ color: 'var(--color-destructive)', padding: '0.35rem' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* =========================================================
            DESKTOP RESTAURANT TABLE (Preserved for Desktop >= 1024px)
            ========================================================= */}
        <div className="admin-desktop-view-only" style={{ overflowX: 'auto' }}>
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
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.name}</strong>
                  </td>
                  <td>
                    <span className="badge" style={{ background: 'var(--color-muted)', color: 'var(--color-text-secondary)' }}>
                      {item.category}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{formatPrice(item.price)}</td>
                  <td>
                    <button
                      onClick={() => toggleAvailability(item.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: item.available ? 'var(--color-success)' : 'var(--color-text-muted)',
                      }}
                    >
                      {item.available ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => toggleFeatured(item.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: item.featured ? '#CA8A04' : 'var(--color-text-muted)',
                      }}
                    >
                      <Star size={18} fill={item.featured ? '#CA8A04' : 'none'} />
                    </button>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button onClick={() => setEditingItem(item)} className="btn btn-ghost btn-sm">
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="btn btn-ghost btn-sm"
                        style={{ color: 'var(--color-destructive)' }}
                      >
                        <Trash2 size={14} />
                      </button>
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
            <div
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 'min(500px, 92vw)',
                background: '#FFFFFF',
                borderRadius: '16px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
                zIndex: 9999,
                padding: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 800 }}>
                  {editingItem.name ? 'Edit Item' : 'Add Menu Item'}
                </h3>
                <button
                  onClick={() => setEditingItem(null)}
                  className="btn btn-ghost btn-icon"
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label className="label" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                    Item Name *
                  </label>
                  <input
                    className="input"
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    placeholder="e.g. Asun Fried Rice"
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                  <div>
                    <label className="label" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                      Price (₦) *
                    </label>
                    <input
                      className="input"
                      type="number"
                      value={editingItem.price}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, price: parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div>
                    <label className="label" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                      Category
                    </label>
                    <select
                      className="input"
                      value={editingItem.category}
                      onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    >
                      {initialCategories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <button onClick={() => setEditingItem(null)} className="btn btn-ghost">
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (editingItem.name) {
                        setItems((prev) => {
                          const exists = prev.find((i) => i.id === editingItem.id);
                          return exists
                            ? prev.map((i) => (i.id === editingItem.id ? editingItem : i))
                            : [...prev, editingItem];
                        });
                        setEditingItem(null);
                      }
                    }}
                    className="btn btn-primary"
                  >
                    <Save size={16} /> Save
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
