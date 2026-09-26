'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Utensils, ArrowLeft, Plus, Edit, Trash2, Save, X, Star,
  ToggleLeft, ToggleRight, CheckCircle2, Sparkles, Wine,
  Search, Filter
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { AdminMobileNav } from '@/components/admin/AdminMobileNav';
import {
  DrinkItem, DRINK_CATEGORIES, getStoredDrinksMenu,
  saveStoredDrinksMenu, DrinkCategoryKey
} from '@/lib/drinks-data';

const initialFoodCategories = [
  { id: '1', name: 'Nigerian Dishes', itemCount: 5 },
  { id: '2', name: 'Grilled & Roasted', itemCount: 4 },
  { id: '3', name: 'Chops & Fries', itemCount: 4 },
  { id: '4', name: 'Soups & Specials', itemCount: 3 },
];

const initialFoodItems = [
  { id: '1', category: 'Nigerian Dishes', name: 'Jollof Rice & Chicken', price: 3500, available: true, featured: true },
  { id: '2', category: 'Nigerian Dishes', name: 'Pounded Yam & Egusi Soup', price: 4000, available: true, featured: true },
  { id: '3', category: 'Nigerian Dishes', name: 'Pepper Soup (Goat Meat)', price: 3000, available: true, featured: false },
  { id: '4', category: 'Nigerian Dishes', name: 'Fried Rice & Grilled Fish', price: 4000, available: true, featured: false },
  { id: '5', category: 'Grilled & Roasted', name: 'Suya (Beef)', price: 2500, available: true, featured: true },
  { id: '6', category: 'Grilled & Roasted', name: 'Grilled Whole Chicken', price: 6000, available: true, featured: false },
  { id: '7', category: 'Chops & Fries', name: 'Chicken & Chips', price: 3000, available: true, featured: true },
  { id: '8', category: 'Chops & Fries', name: 'Meat Pie (Premium)', price: 800, available: true, featured: false },
  { id: '9', category: 'Chops & Fries', name: 'Sausage Roll', price: 600, available: true, featured: false },
  { id: '10', category: 'Chops & Fries', name: 'Spring Rolls & Samosa (Platter)', price: 2000, available: true, featured: false },
  { id: '11', category: 'Nigerian Dishes', name: 'Amala & Ewedu with Gbegiri', price: 3500, available: true, featured: false },
];

export default function AdminRestaurantPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'food' | 'drinks'>('food');

  // Food state
  const [foodItems, setFoodItems] = useState(initialFoodItems);
  const [selectedFoodCategory, setSelectedFoodCategory] = useState('all');
  const [editingFoodItem, setEditingFoodItem] = useState<typeof initialFoodItems[0] | null>(null);

  // Drinks state (from official price boards)
  const [drinks, setDrinks] = useState<DrinkItem[]>([]);
  const [selectedDrinkCategory, setSelectedDrinkCategory] = useState<string>('all');
  const [drinkSearchQuery, setDrinkSearchQuery] = useState('');
  const [editingDrink, setEditingDrink] = useState<DrinkItem | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem('admin_authenticated') !== 'true') {
      router.push('/admin/login');
      return;
    }

    try {
      const storedFood = localStorage.getItem('super_e_restaurant_items');
      if (storedFood) {
        const parsed = JSON.parse(storedFood);
        if (Array.isArray(parsed) && parsed.length > 0) setFoodItems(parsed);
      }

      setDrinks(getStoredDrinksMenu());
    } catch {}
  }, [router]);

  // Food methods
  const saveFoodItemsList = (newList: typeof initialFoodItems) => {
    setFoodItems(newList);
    try {
      localStorage.setItem('super_e_restaurant_items', JSON.stringify(newList));
    } catch {}
  };

  const toggleFoodAvailability = (id: string) => {
    const updated = foodItems.map((i) => (i.id === id ? { ...i, available: !i.available } : i));
    saveFoodItemsList(updated);
  };

  const toggleFoodFeatured = (id: string) => {
    const updated = foodItems.map((i) => (i.id === id ? { ...i, featured: !i.featured } : i));
    saveFoodItemsList(updated);
  };

  const deleteFoodItem = (id: string) => {
    if (confirm('Delete this menu item?')) {
      const updated = foodItems.filter((i) => i.id !== id);
      saveFoodItemsList(updated);
    }
  };

  const handleSaveFoodModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFoodItem) return;
    const exists = foodItems.some((i) => i.id === editingFoodItem.id);
    if (exists) {
      const updated = foodItems.map((i) => (i.id === editingFoodItem.id ? editingFoodItem : i));
      saveFoodItemsList(updated);
    } else {
      saveFoodItemsList([editingFoodItem, ...foodItems]);
    }
    setEditingFoodItem(null);
  };

  // Drinks methods
  const saveDrinksList = (newList: DrinkItem[]) => {
    setDrinks(newList);
    saveStoredDrinksMenu(newList);
  };

  const toggleDrinkAvailability = (id: string) => {
    const updated = drinks.map((d) => (d.id === id ? { ...d, popular: !d.popular } : d));
    saveDrinksList(updated);
  };

  const deleteDrinkItem = (id: string) => {
    if (confirm('Remove this beverage from the drinks catalog?')) {
      const updated = drinks.filter((d) => d.id !== id);
      saveDrinksList(updated);
    }
  };

  const handleSaveDrinkModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDrink) return;
    const exists = drinks.some((d) => d.id === editingDrink.id);
    if (exists) {
      const updated = drinks.map((d) => (d.id === editingDrink.id ? editingDrink : d));
      saveDrinksList(updated);
    } else {
      saveDrinksList([editingDrink, ...drinks]);
    }
    setEditingDrink(null);
  };

  // Filters
  const filteredFood = selectedFoodCategory === 'all'
    ? foodItems
    : foodItems.filter((i) => i.category === selectedFoodCategory);

  const filteredDrinks = useMemo(() => {
    return drinks.filter((d) => {
      const matchCat = selectedDrinkCategory === 'all' || d.category === selectedDrinkCategory;
      const matchSearch =
        d.name.toLowerCase().includes(drinkSearchQuery.toLowerCase()) ||
        (d.description && d.description.toLowerCase().includes(drinkSearchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [drinks, selectedDrinkCategory, drinkSearchQuery]);

  return (
    <div className="admin-layout" style={{ maxWidth: '100vw', overflowX: 'hidden', width: '100%', boxSizing: 'border-box' }}>
      {/* Mobile Top Navigation */}
      <AdminMobileNav
        title="Restaurant & Bar Menu"
        subtitle={`${foodItems.length} dishes • ${drinks.length} drinks`}
        backHref="/admin"
        actionButton={
          <button
            onClick={() => {
              if (activeTab === 'food') {
                setEditingFoodItem({
                  id: String(Date.now()),
                  category: 'Nigerian Dishes',
                  name: '',
                  price: 3500,
                  available: true,
                  featured: false,
                });
              } else {
                setEditingDrink({
                  id: `drink_${Date.now()}`,
                  name: '',
                  category: 'beer',
                  price: 1500,
                  volumeOrServing: 'Bottle',
                  description: '',
                  popular: false,
                  featured: false,
                });
              }
            }}
            className="btn btn-primary btn-sm"
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
          >
            <Plus size={14} /> Add
          </button>
        }
      />

      {/* Desktop Sidebar */}
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
            <span>Restaurant &amp; Bar</span>
          </div>
          <Link href="/admin/hall" className="admin-nav-item">
            <span>Hall Bookings</span>
          </Link>
          <Link href="/admin/rooms" className="admin-nav-item">
            <span>Rooms &amp; Inventory</span>
          </Link>
          <Link href="/admin/bookings" className="admin-nav-item">
            <span>Guest Bookings</span>
          </Link>
        </nav>
      </aside>

      <main className="admin-main" style={{ minWidth: 0, width: '100%', maxWidth: '100vw', overflowX: 'hidden', boxSizing: 'border-box' }}>
        {/* Header */}
        <div className="admin-header" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>Restaurant &amp; Bar Menu Manager</h1>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: '#64748B' }}>
              Manage kitchen food dishes, toggle sold-out status, and manage the full 80+ drinks inventory at official hotel rates.
            </p>
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              if (activeTab === 'food') {
                setEditingFoodItem({
                  id: String(Date.now()),
                  category: 'Nigerian Dishes',
                  name: '',
                  price: 3500,
                  available: true,
                  featured: false,
                });
              } else {
                setEditingDrink({
                  id: `drink_${Date.now()}`,
                  name: '',
                  category: 'beer',
                  price: 1500,
                  volumeOrServing: 'Bottle',
                  description: '',
                  popular: false,
                  featured: false,
                });
              }
            }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
          >
            <Plus size={16} /> {activeTab === 'food' ? 'Add Dish' : 'Add Beverage'}
          </button>
        </div>

        {/* Tab Switcher: Food vs Drinks */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            borderBottom: '1px solid #E2E8F0',
            marginBottom: '1.25rem',
            paddingBottom: '0.25rem',
          }}
        >
          <button
            onClick={() => setActiveTab('food')}
            style={{
              padding: '0.6rem 1.15rem',
              fontWeight: 700,
              fontSize: '0.9rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'food' ? '#1E3A8A' : 'transparent',
              color: activeTab === 'food' ? '#FFFFFF' : '#64748B',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Utensils size={16} /> Kitchen Food Dishes ({foodItems.length})
          </button>

          <button
            onClick={() => setActiveTab('drinks')}
            style={{
              padding: '0.6rem 1.15rem',
              fontWeight: 700,
              fontSize: '0.9rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'drinks' ? '#1E3A8A' : 'transparent',
              color: activeTab === 'drinks' ? '#FFFFFF' : '#64748B',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Wine size={16} /> Official Drinks Catalog ({drinks.length})
          </button>
        </div>

        {/* ═══════════════════════════════════════════
            TAB 1: KITCHEN FOOD DISHES
            ═══════════════════════════════════════════ */}
        {activeTab === 'food' && (
          <div>
            {/* Category Filter Strip */}
            <div className="admin-mobile-filter-strip" style={{ marginBottom: '1rem' }}>
              <button
                onClick={() => setSelectedFoodCategory('all')}
                className={`filter-pill-btn ${selectedFoodCategory === 'all' ? 'active' : ''}`}
              >
                All Dishes
              </button>
              {initialFoodCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedFoodCategory(cat.name)}
                  className={`filter-pill-btn ${selectedFoodCategory === cat.name ? 'active' : ''}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Mobile Cards */}
            <div className="admin-mobile-restaurant-list">
              {filteredFood.map((item) => (
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

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid #F1F5F9' }}>
                    <button
                      type="button"
                      onClick={() => toggleFoodAvailability(item.id)}
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
                      <span>{item.available ? 'In Stock' : 'Sold Out'}</span>
                    </button>

                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button
                        onClick={() => toggleFoodFeatured(item.id)}
                        className="btn btn-ghost btn-sm"
                        style={{ color: item.featured ? '#D97706' : '#94A3B8', padding: '0.35rem' }}
                        title="Featured Dish"
                      >
                        <Star size={16} fill={item.featured ? '#D97706' : 'none'} />
                      </button>

                      <button
                        onClick={() => setEditingFoodItem(item)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '0.35rem 0.6rem', fontSize: '0.74rem', fontWeight: 700 }}
                      >
                        <Edit size={13} /> Edit
                      </button>

                      <button
                        onClick={() => deleteFoodItem(item.id)}
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

            {/* Desktop Table */}
            <div className="admin-desktop-view-only" style={{ overflowX: 'auto', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
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
                  {filteredFood.map((item) => (
                    <tr key={item.id}>
                      <td><strong>{item.name}</strong></td>
                      <td><span className="badge" style={{ background: '#F1F5F9', color: '#475569' }}>{item.category}</span></td>
                      <td style={{ fontWeight: 700, color: '#1E3A8A' }}>{formatPrice(item.price)}</td>
                      <td>
                        <button
                          onClick={() => toggleFoodAvailability(item.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: item.available ? '#16A34A' : '#94A3B8' }}
                        >
                          {item.available ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={() => toggleFoodFeatured(item.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: item.featured ? '#D97706' : '#CBD5E1' }}
                        >
                          <Star size={18} fill={item.featured ? '#D97706' : 'none'} />
                        </button>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button onClick={() => setEditingFoodItem(item)} className="btn btn-secondary btn-sm">
                            <Edit size={13} /> Edit
                          </button>
                          <button onClick={() => deleteFoodItem(item.id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-destructive)' }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════
            TAB 2: FULL DRINKS CATALOG (80+ ITEMS)
            ═══════════════════════════════════════════ */}
        {activeTab === 'drinks' && (
          <div>
            {/* Search and Category Filter Toolbar */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                padding: '0.85rem 1rem',
                marginBottom: '1rem',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.75rem',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ position: 'relative', flex: '1 1 260px' }}>
                <Search
                  size={16}
                  style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}
                />
                <input
                  type="text"
                  className="input"
                  placeholder="Search drinks by name or type..."
                  value={drinkSearchQuery}
                  onChange={(e) => setDrinkSearchQuery(e.target.value)}
                  style={{ paddingLeft: '2.2rem', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Filter size={16} style={{ color: '#64748B' }} />
                <select
                  className="input"
                  value={selectedDrinkCategory}
                  onChange={(e) => setSelectedDrinkCategory(e.target.value)}
                  style={{ width: 'auto', fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
                >
                  <option value="all">All Drinks ({drinks.length})</option>
                  {DRINK_CATEGORIES.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="admin-mobile-restaurant-list">
              {filteredDrinks.map((item) => (
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
                      <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                        {item.volumeOrServing || item.category}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '1rem', fontWeight: 800, color: '#1E3A8A', display: 'block' }}>
                        {formatPrice(item.price)}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid #F1F5F9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.75rem', color: '#16A34A', fontWeight: 700, backgroundColor: '#DCFCE7', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        In Stock
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button
                        onClick={() => setEditingDrink(item)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '0.35rem 0.6rem', fontSize: '0.74rem', fontWeight: 700 }}
                      >
                        <Edit size={13} /> Edit Rate
                      </button>

                      <button
                        onClick={() => deleteDrinkItem(item.id)}
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

            {/* Desktop Table */}
            <div className="admin-desktop-view-only" style={{ overflowX: 'auto', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Beverage / Brand</th>
                    <th>Category</th>
                    <th>Volume / Serving</th>
                    <th>Price (₦)</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDrinks.map((item) => (
                    <tr key={item.id}>
                      <td><strong>{item.name}</strong></td>
                      <td>
                        <span className="badge" style={{ background: '#F1F5F9', color: '#475569' }}>
                          {item.category}
                        </span>
                      </td>
                      <td style={{ color: '#64748B', fontSize: '0.85rem' }}>{item.volumeOrServing || 'Standard'}</td>
                      <td style={{ fontWeight: 800, color: '#1E3A8A', fontSize: '0.95rem' }}>
                        {formatPrice(item.price)}
                      </td>
                      <td>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: '9999px', backgroundColor: '#DCFCE7', color: '#166534' }}>
                          Active
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button onClick={() => setEditingDrink(item)} className="btn btn-secondary btn-sm">
                            <Edit size={13} /> Edit Price
                          </button>
                          <button onClick={() => deleteDrinkItem(item.id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-destructive)' }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: EDIT FOOD ITEM */}
      {editingFoodItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setEditingFoodItem(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '460px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>
                {editingFoodItem.name ? 'Edit Menu Dish' : 'Add New Dish'}
              </h3>
              <button onClick={() => setEditingFoodItem(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveFoodModal} style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label className="label" style={{ fontWeight: 700, marginBottom: '0.25rem', display: 'block' }}>Dish Name *</label>
                  <input
                    type="text"
                    className="input"
                    value={editingFoodItem.name}
                    onChange={(e) => setEditingFoodItem({ ...editingFoodItem, name: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label className="label" style={{ fontWeight: 700, marginBottom: '0.25rem', display: 'block' }}>Category</label>
                    <select
                      className="input"
                      value={editingFoodItem.category}
                      onChange={(e) => setEditingFoodItem({ ...editingFoodItem, category: e.target.value })}
                    >
                      {initialFoodCategories.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label" style={{ fontWeight: 700, marginBottom: '0.25rem', display: 'block' }}>Price (₦) *</label>
                    <input
                      type="number"
                      className="input"
                      value={editingFoodItem.price}
                      onChange={(e) => setEditingFoodItem({ ...editingFoodItem, price: Number(e.target.value) || 0 })}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.25rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={editingFoodItem.available}
                      onChange={(e) => setEditingFoodItem({ ...editingFoodItem, available: e.target.checked })}
                    />
                    <span>Available / In Stock</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={editingFoodItem.featured}
                      onChange={(e) => setEditingFoodItem({ ...editingFoodItem, featured: e.target.checked })}
                    />
                    <span>Chef Special / Featured</span>
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid #E2E8F0' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setEditingFoodItem(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Save size={16} /> Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT DRINK ITEM */}
      {editingDrink && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setEditingDrink(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '460px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>
                {editingDrink.name ? 'Edit Beverage / Drink' : 'Add New Drink'}
              </h3>
              <button onClick={() => setEditingDrink(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveDrinkModal} style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label className="label" style={{ fontWeight: 700, marginBottom: '0.25rem', display: 'block' }}>Drink / Brand Name *</label>
                  <input
                    type="text"
                    className="input"
                    value={editingDrink.name}
                    onChange={(e) => setEditingDrink({ ...editingDrink, name: e.target.value })}
                    placeholder="e.g. Hennessy VS, Heineken, Agor Red"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label className="label" style={{ fontWeight: 700, marginBottom: '0.25rem', display: 'block' }}>Category</label>
                    <select
                      className="input"
                      value={editingDrink.category}
                      onChange={(e) => setEditingDrink({ ...editingDrink, category: e.target.value as DrinkCategoryKey })}
                    >
                      {DRINK_CATEGORIES.map((c) => (
                        <option key={c.key} value={c.key}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label" style={{ fontWeight: 700, marginBottom: '0.25rem', display: 'block' }}>Price (₦) *</label>
                    <input
                      type="number"
                      className="input"
                      value={editingDrink.price}
                      onChange={(e) => setEditingDrink({ ...editingDrink, price: Number(e.target.value) || 0 })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="label" style={{ fontWeight: 700, marginBottom: '0.25rem', display: 'block' }}>Volume / Serving</label>
                  <input
                    type="text"
                    className="input"
                    value={editingDrink.volumeOrServing || ''}
                    onChange={(e) => setEditingDrink({ ...editingDrink, volumeOrServing: e.target.value })}
                    placeholder="e.g. 75cl Bottle, 60cl Bottle, 33cl Can"
                  />
                </div>

                <div>
                  <label className="label" style={{ fontWeight: 700, marginBottom: '0.25rem', display: 'block' }}>Description (Optional)</label>
                  <input
                    type="text"
                    className="input"
                    value={editingDrink.description || ''}
                    onChange={(e) => setEditingDrink({ ...editingDrink, description: e.target.value })}
                    placeholder="e.g. Pure malt lager served ice cold"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid #E2E8F0' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setEditingDrink(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Save size={16} /> Save Beverage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
