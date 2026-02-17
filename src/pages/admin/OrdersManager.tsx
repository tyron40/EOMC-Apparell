import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Order } from '../../types';
import { CheckCircle, AlertCircle, Package, X, Printer, FileText } from 'lucide-react';

export default function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showShippingModal, setShowShippingModal] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setOrders(data);
    }
    setLoading(false);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setMessage(null);

    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      await loadOrders();
      setMessage({ type: 'success', text: 'Order status updated successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update order status' });
    }
  };

  const openShippingModal = (order: Order) => {
    setSelectedOrder(order);
    setShowShippingModal(true);
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Orders Management</h1>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg border flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Order Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tracking
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No orders yet
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order.order_number}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.customer_name}</div>
                    <div className="text-sm text-gray-500">{order.customer_email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.tracking_number ? (
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{order.tracking_number}</div>
                        <div className="text-gray-500">{order.carrier}</div>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">No tracking</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => openShippingModal(order)}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-black text-white rounded hover:bg-gray-800 transition-colors"
                    >
                      <Package className="w-4 h-4" />
                      Shipping
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      {showShippingModal && selectedOrder && (
        <ShippingModal
          order={selectedOrder}
          onClose={() => {
            setShowShippingModal(false);
            setSelectedOrder(null);
          }}
          onUpdate={async () => {
            await loadOrders();
            setMessage({ type: 'success', text: 'Shipping information updated!' });
            setTimeout(() => setMessage(null), 3000);
          }}
        />
      )}
    </div>
  );
}

interface ShippingModalProps {
  order: Order;
  onClose: () => void;
  onUpdate: () => void;
}

function ShippingModal({ order, onClose, onUpdate }: ShippingModalProps) {
  const [formData, setFormData] = useState({
    tracking_number: order.tracking_number || '',
    carrier: order.carrier || '',
    weight: order.weight || '',
    dimensions: {
      length: order.dimensions?.length || '',
      width: order.dimensions?.width || '',
      height: order.dimensions?.height || ''
    },
    shipping_notes: order.shipping_notes || '',
    label_url: order.label_url || ''
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updateData: any = {
        tracking_number: formData.tracking_number || null,
        carrier: formData.carrier || null,
        weight: formData.weight ? parseFloat(formData.weight as string) : null,
        dimensions: formData.dimensions.length || formData.dimensions.width || formData.dimensions.height
          ? {
              length: formData.dimensions.length ? parseFloat(formData.dimensions.length as string) : null,
              width: formData.dimensions.width ? parseFloat(formData.dimensions.width as string) : null,
              height: formData.dimensions.height ? parseFloat(formData.dimensions.height as string) : null
            }
          : null,
        shipping_notes: formData.shipping_notes || null,
        label_url: formData.label_url || null
      };

      if (formData.tracking_number && formData.carrier) {
        updateData.shipping_date = new Date().toISOString();
        updateData.status = 'shipped';
      }

      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', order.id);

      if (error) throw error;

      onUpdate();
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to update shipping information');
    } finally {
      setSaving(false);
    }
  };

  const printLabel = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Shipping Label - ${order.order_number}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .label { border: 2px solid #000; padding: 20px; max-width: 600px; }
          .header { font-size: 24px; font-weight: bold; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px; }
          .section { margin: 15px 0; }
          .section-title { font-weight: bold; font-size: 14px; margin-bottom: 5px; }
          .barcode { font-size: 32px; font-weight: bold; letter-spacing: 2px; margin: 20px 0; padding: 10px; border: 1px solid #000; text-align: center; }
          @media print {
            body { margin: 0; padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="label">
          <div class="header">SHIPPING LABEL</div>
          <div class="section">
            <div class="section-title">Order Number:</div>
            <div>${order.order_number}</div>
          </div>
          <div class="section">
            <div class="section-title">Ship To:</div>
            <div>${order.customer_name}</div>
            <div>${order.shipping_address.street}</div>
            <div>${order.shipping_address.city}, ${order.shipping_address.state} ${order.shipping_address.zip}</div>
            <div>${order.shipping_address.country}</div>
          </div>
          ${formData.tracking_number ? `
          <div class="section">
            <div class="section-title">Tracking Number:</div>
            <div class="barcode">${formData.tracking_number}</div>
            <div>Carrier: ${formData.carrier}</div>
          </div>
          ` : ''}
          ${formData.weight ? `
          <div class="section">
            <div class="section-title">Weight:</div>
            <div>${formData.weight} lbs</div>
          </div>
          ` : ''}
        </div>
        <div class="no-print" style="margin-top: 20px;">
          <button onclick="window.print()" style="padding: 10px 20px; font-size: 16px; cursor: pointer;">Print Label</button>
          <button onclick="window.close()" style="padding: 10px 20px; font-size: 16px; margin-left: 10px; cursor: pointer;">Close</button>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-2xl w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold">Shipping Label</h3>
            <p className="text-gray-600">Order: {order.order_number}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">Shipping Address</h4>
          <p className="text-sm">{order.customer_name}</p>
          <p className="text-sm">{order.shipping_address.street}</p>
          <p className="text-sm">
            {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}
          </p>
          <p className="text-sm">{order.shipping_address.country}</p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Carrier
              </label>
              <select
                value={formData.carrier}
                onChange={(e) => setFormData({ ...formData, carrier: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="">Select Carrier</option>
                <option value="USPS">USPS</option>
                <option value="FedEx">FedEx</option>
                <option value="UPS">UPS</option>
                <option value="DHL">DHL</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tracking Number
              </label>
              <input
                type="text"
                value={formData.tracking_number}
                onChange={(e) => setFormData({ ...formData, tracking_number: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Enter tracking number"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weight (lbs)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Package weight"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dimensions (inches)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                step="0.1"
                value={formData.dimensions.length}
                onChange={(e) => setFormData({
                  ...formData,
                  dimensions: { ...formData.dimensions, length: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Length"
              />
              <input
                type="number"
                step="0.1"
                value={formData.dimensions.width}
                onChange={(e) => setFormData({
                  ...formData,
                  dimensions: { ...formData.dimensions, width: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Width"
              />
              <input
                type="number"
                step="0.1"
                value={formData.dimensions.height}
                onChange={(e) => setFormData({
                  ...formData,
                  dimensions: { ...formData.dimensions, height: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Height"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Label URL (optional)
            </label>
            <input
              type="url"
              value={formData.label_url}
              onChange={(e) => setFormData({ ...formData, label_url: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Link to shipping label PDF"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shipping Notes
            </label>
            <textarea
              value={formData.shipping_notes}
              onChange={(e) => setFormData({ ...formData, shipping_notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Internal notes about shipping"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 transition-colors font-medium"
            >
              {saving ? 'Saving...' : 'Save Shipping Info'}
            </button>
            <button
              type="button"
              onClick={printLabel}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium inline-flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print Label
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
