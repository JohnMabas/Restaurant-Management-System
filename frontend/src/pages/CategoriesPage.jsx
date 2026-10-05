import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [modal, setModal]           = useState(false);
  const [editing, setEditing]       = useState(null);
  const [form, setForm]             = useState({ name: '', description: '' });
  const [saving, setSaving]         = useState(false);

  async function load() {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openAdd() {
    setForm({ name: '', description: '' });
    setEditing(null);
    setModal(true);
  }

  function openEdit(cat) {
    setForm({ name: cat.name, description: cat.description ?? '' });
    setEditing(cat);
    setModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Name is required');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await updateCategory(editing.id, form);
        toast.success('Category updated');
      } else {
        await createCategory(form);
        toast.success('Category created');
      }
      setModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(cat) {
    if (!confirm(`Delete category "${cat.name}"? This will fail if menu items still reference it.`)) return;
    try {
      await deleteCategory(cat.id);
      toast.success('Deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Failed to delete');
    }
  }

  if (loading) return <LoadingSpinner message="Loading categories…" />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">📂 Categories</h1>
        <button
          onClick={openAdd}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          + Add Category
        </button>
      </div>

      {categories.length === 0 ? (
        <p className="text-center text-gray-400 py-16">No categories yet.</p>
      ) : (
        <div className="bg-white rounded-xl shadow border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-5 py-3 font-medium text-gray-600">#</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Name</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Description</th>
                <th className="px-5 py-3 font-medium text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, idx) => (
                <tr key={cat.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-5 py-3 text-gray-400">{cat.id}</td>
                  <td className="px-5 py-3 font-medium text-gray-800">{cat.name}</td>
                  <td className="px-5 py-3 text-gray-500">{cat.description ?? '—'}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => openEdit(cat)}
                        className="text-blue-600 hover:underline text-xs font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cat)}
                        className="text-red-500 hover:underline text-xs font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <Modal
          title={editing ? 'Edit Category' : 'Add Category'}
          onClose={() => setModal(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="e.g. Starters"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Optional description…"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setModal(false)}
                className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-50"
              >
                {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
