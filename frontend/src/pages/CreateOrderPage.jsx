import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getUsers, getMenuItems, getCategories, createOrder } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function CreateOrderPage() {
  const navigate = useNavigate();

  const [users, setUsers]             = useState([]);
  const [menuItems, setMenuItems]     = useState([]);
  const [categories, setCategories]   = useState([]);
  const [loading, setLoading]         = useState(true);

  const [userId, setUserId]           = useState('');
  const [cart, setCart]               = useState({}); // { menuItemId: quantity }
  const [catFilter, setCatFilter]     = useState('all');
  const [submitting, setSubmitting]   = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [u, m, c] = await Promise.all([getUsers(), getMenuItems(), getCategories()]);
        setUsers(u.data);
        setMenuItems(m.data.filter((i) => i.available));
        setCategories(c.data);
      } catch {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredItems = catFilter === 'all'
    ? menuItems
    : menuItems.filter((i) => String(i.categoryId) === catFilter);

  function setQty(itemId, qty) {
    if (qty <= 0) {
      const next = { ...cart };
      delete next[itemId];
      setCart(next);
    } else {
      setCart({ ...cart, [itemId]: qty });
    }
  }

  const cartItems = menuItems.filter((i) => cart[i.id] > 0);
  const total = cartItems.reduce(
    (sum, i) => sum + parseFloat(i.price) * cart[i.id],
    0
  );

  async function handleSubmit(e) {
    e.preventDefault();
    if (!userId) { toast.error('Please select a customer'); return; }
    if (cartItems.length === 0) { toast.error('Add at least one item'); return; }

    setSubmitting(true);
    try {
      const items = cartItems.map((i) => ({ menuItemId: i.id, quantity: cart[i.id] }));
      const res = await createOrder({ userId: parseInt(userId), items });
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Failed to create order');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <LoadingSpinner message="Loading…" />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">➕ Create New Order</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: item picker */}
        <div className="lg:col-span-2 space-y-4">

          {/* Customer selector */}
          <div className="bg-white rounded-xl shadow border p-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer *
            </label>
            <select
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="">— Select a customer —</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCatFilter('all')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                catFilter === 'all' ? 'bg-orange-500 text-white border-orange-500' : 'border-gray-300 text-gray-600 hover:bg-gray-100'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCatFilter(String(cat.id))}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  catFilter === String(cat.id) ? 'bg-orange-500 text-white border-orange-500' : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Menu items grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredItems.map((item) => {
              const qty = cart[item.id] || 0;
              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-xl border shadow-sm p-4 flex flex-col gap-2 transition-all ${
                    qty > 0 ? 'border-orange-400 ring-1 ring-orange-300' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-800 leading-tight">{item.name}</p>
                      <p className="text-xs text-orange-600">{item.category?.name}</p>
                      {item.description && (
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{item.description}</p>
                      )}
                    </div>
                    <span className="text-sm font-bold text-gray-800 whitespace-nowrap ml-2">
                      ₦{parseFloat(item.price).toFixed(2)}
                    </span>
                  </div>
                  {/* Qty controls */}
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => setQty(item.id, qty - 1)}
                      disabled={qty === 0}
                      className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-lg leading-none disabled:opacity-30 flex items-center justify-center"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm font-medium text-gray-800">{qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty(item.id, qty + 1)}
                      className="w-7 h-7 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg leading-none flex items-center justify-center"
                    >
                      +
                    </button>
                    {qty > 0 && (
                      <span className="ml-auto text-xs text-orange-600 font-medium">
                        ₦{(parseFloat(item.price) * qty).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow border p-5 sticky top-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">🛒 Order Summary</h2>

            {cartItems.length === 0 ? (
              <p className="text-sm text-gray-400 py-6 text-center">No items selected yet.</p>
            ) : (
              <div className="space-y-2 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {item.name}
                      <span className="text-gray-400 ml-1">× {cart[item.id]}</span>
                    </span>
                    <span className="font-medium text-gray-800">
                      ₦{(parseFloat(item.price) * cart[item.id]).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t pt-3 flex justify-between font-bold text-gray-800 mb-5">
              <span>Total</span>
              <span>₦{total.toFixed(2)}</span>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting || cartItems.length === 0 || !userId}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Placing Order…' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
