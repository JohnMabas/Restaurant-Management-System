import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getOrders, updateOrder, deleteOrder } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import Badge from '../components/Badge';

const STATUSES = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];

export default function OrdersPage() {
  const [orders, setOrders]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [selected, setSelected]   = useState(null); // order for details modal
  const [statusModal, setStatusModal] = useState(null); // order for status update
  const [newStatus, setNewStatus] = useState('');
  const [saving, setSaving]       = useState(false);

  async function load() {
    try {
      const res = await getOrders();
      setOrders(res.data);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openStatus(order) {
    setNewStatus(order.status);
    setStatusModal(order);
  }

  async function handleStatusSave() {
    setSaving(true);
    try {
      await updateOrder(statusModal.id, { status: newStatus });
      toast.success('Status updated');
      setStatusModal(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Failed to update');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(order) {
    if (!confirm(`Delete Order #${order.id}?`)) return;
    try {
      await deleteOrder(order.id);
      toast.success('Order deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Failed to delete');
    }
  }

  if (loading) return <LoadingSpinner message="Loading orders…" />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">📋 Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-400 py-16">No orders yet. Create one!</p>
      ) : (
        <div className="bg-white rounded-xl shadow border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Order #</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Customer</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Items</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Total</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Date</th>
                <th className="px-5 py-3 font-medium text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => (
                <tr key={order.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-5 py-3 font-semibold text-orange-600">#{order.id}</td>
                  <td className="px-5 py-3 text-gray-700">
                    <div>{order.user?.name ?? '—'}</div>
                    <div className="text-xs text-gray-400">{order.user?.email}</div>
                  </td>
                  <td className="px-5 py-3 text-gray-600">{order.items?.length ?? 0} item(s)</td>
                  <td className="px-5 py-3 font-medium text-gray-800">
                    ₦{parseFloat(order.totalAmount).toFixed(2)}
                  </td>
                  <td className="px-5 py-3">
                    <Badge status={order.status} />
                  </td>
                  <td className="px-5 py-3 text-gray-500 text-xs">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setSelected(order)}
                        className="text-blue-600 hover:underline text-xs font-medium"
                      >
                        View
                      </button>
                      <button
                        onClick={() => openStatus(order)}
                        className="text-purple-600 hover:underline text-xs font-medium"
                      >
                        Status
                      </button>
                      <button
                        onClick={() => handleDelete(order)}
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

      {/* Order Details Modal */}
      {selected && (
        <Modal title={`Order #${selected.id} — Details`} onClose={() => setSelected(null)}>
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-600">
              <div>
                <span className="font-medium">Customer:</span>{' '}
                {selected.user?.name} ({selected.user?.email})
              </div>
              <Badge status={selected.status} />
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Order Items</p>
              <div className="divide-y border rounded-lg overflow-hidden">
                {selected.items?.map((item) => (
                  <div key={item.id} className="flex items-center justify-between px-4 py-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-800">{item.menuItem?.name ?? `Item #${item.menuItemId}`}</span>
                      <span className="text-gray-400 ml-2">× {item.quantity}</span>
                    </div>
                    <span className="text-gray-700 font-medium">
                      ₦{(parseFloat(item.unitPrice) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between pt-2 border-t font-semibold text-gray-800">
              <span>Total</span>
              <span>₦{parseFloat(selected.totalAmount).toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-400">
              Placed: {new Date(selected.created_at).toLocaleString()}
            </p>
          </div>
        </Modal>
      )}

      {/* Status Update Modal */}
      {statusModal && (
        <Modal title={`Update Status — Order #${statusModal.id}`} onClose={() => setStatusModal(null)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStatusModal(null)}
                className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusSave}
                disabled={saving}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Update'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
