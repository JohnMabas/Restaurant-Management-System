import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  getMenuItems,
  getCategories,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';

const EMPTY_FORM = { name: '', description: '', price: '', categoryId: '', available: true };

export default function MenuPage() {
  const [items, setItems]         = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState('all');
  const [modal, setModal]         = useState(null); // null | 'add' | 'edit'
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [saving, setSaving]       = useState(false);

  async function load() {
    try {
      const [itemsRes, catsRes] = await Promise.all([getMenuItems(), getCategories()]);
      setItems(itemsRes.data);
      setCategories(catsRes.data);
    } catch {
      toast.error('Failed to load menu');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = filter === 'all'
    ? items
    : items.filter((i) => String(i.categoryId) === filter);

  function openAdd() {
    setForm(EMPTY_FORM);
    setEditing(null);
    setModal('form');
  }

  function openEdit(item) {
    setForm({
      name: item.name,
      description: item.description ?? '',
      price: item.price,
      categoryId: String(item.categoryId),
      available: item.available,
    });
    setEditing(item);
    setModal('form');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.price || !form.categoryId) {
      toast.error('Name, price and category are required');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, price: parseFloat(form.price), categoryId: parseInt(form.categoryId) };
      if (editing) {
        await updateMenuItem(editing.id, payload);
        toast.success('Menu item updated');
      } else {
        await createMenuItem(payload);
        toast.success('Menu item created');
      }
      setModal(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Failed to save item');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item) {
    if (!confirm(`Delete "${item.name}"?`)) return;
    try {
      await deleteMenuItem(item.id);
      toast.success('Deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Failed to delete');
    }
  }

  if (loading) return <LoadingSpinner message="Loading menu…" />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">🍽️ Menu Items</h1>
        <button
          onClick={openAdd}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          + Add Item
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
            filter === 'all' ? 'bg-teal-600 text-white border-teal-600' : 'border-gray-300 text-gray-600 hover:bg-gray-100'
          }`}
        >
          All ({items.length})
        </button>
        {categories.map((cat) => {
          const count = items.filter((i) => i.categoryId === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setFilter(String(cat.id))}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                filter === String(cat.id)
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-400 py-16">No items in this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-xl shadow border flex flex-col ${!item.available ? 'opacity-60' : ''}`}
            >
              <div className="p-4 flex-1">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 leading-tight">{item.name}</h3>
                  {!item.available && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full whitespace-nowrap">
                      Unavailable
                    </span>
                  )}
                </div>
                {item.category && (
                  <span className="text-xs text-teal-600 font-medium">{item.category.name}</span>
                )}
                {item.description && (
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">{item.description}</p>
                )}
                <p className="text-lg font-bold text-gray-800 mt-3">
                  ₦{parseFloat(item.price).toFixed(2)}
                </p>
              </div>
              <div className="px-4 pb-4 flex gap-2">
                <button
                  onClick={() => openEdit(item)}
                  className="flex-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 py-1.5 rounded-lg"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  className="flex-1 text-sm bg-red-50 hover:bg-red-100 text-red-600 py-1.5 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modal === 'form' && (
        <Modal
          title={editing ? 'Edit Menu Item' : 'Add Menu Item'}
          onClose={() => setModal(null)}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                placeholder="e.g. Margherita Pizza"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                rows={3}
                placeholder="Optional description…"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₦) *</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                >
                  <option value="">Select…</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.available}
                onChange={(e) => setForm({ ...form, available: e.target.checked })}
                className="w-4 h-4 accent-teal-600"
              />
              Available
            </label>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setModal(null)}
                className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-50"
              >
                {saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Item'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
