import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Product } from '../../types';
import { AlertTriangle, Save, CheckCircle, AlertCircle } from 'lucide-react';

export default function InventoryManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('name');

    if (data) {
      setProducts(data);
    }
    setLoading(false);
  };

  const updateStock = async (productId: string, newStock: number, isAvailable: boolean) => {
    setUpdating(productId);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('products')
        .update({
          stock_quantity: newStock,
          is_available: isAvailable
        })
        .eq('id', productId);

      if (error) throw error;

      await loadProducts();
      setMessage({ type: 'success', text: 'Stock updated successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update stock' });
    } finally {
      setUpdating(null);
    }
  };

  const handleStockChange = (productId: string, value: string) => {
    const newStock = parseInt(value) || 0;
    setProducts(products.map(p =>
      p.id === productId ? { ...p, stock_quantity: newStock } : p
    ));
  };

  const handleAvailabilityChange = (productId: string, isAvailable: boolean) => {
    setProducts(products.map(p =>
      p.id === productId ? { ...p, is_available: isAvailable } : p
    ));
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  const lowStockProducts = products.filter(
    p => p.stock_quantity <= p.low_stock_threshold
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Inventory Management</h1>

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

      {lowStockProducts.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <h2 className="font-semibold text-orange-900">Low Stock Alert</h2>
          </div>
          <p className="text-sm text-orange-800">
            {lowStockProducts.length} product(s) are running low on stock
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Current Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Low Stock Alert
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr
                key={product.id}
                className={
                  product.stock_quantity <= product.low_stock_threshold
                    ? 'bg-orange-50'
                    : ''
                }
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-12 h-12 rounded object-contain"
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    min="0"
                    value={product.stock_quantity}
                    onChange={(e) => handleStockChange(product.id, e.target.value)}
                    className="w-24 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.low_stock_threshold}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={product.is_available ? 'available' : 'unavailable'}
                    onChange={(e) =>
                      handleAvailabilityChange(product.id, e.target.value === 'available')
                    }
                    className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() =>
                      updateStock(product.id, product.stock_quantity, product.is_available)
                    }
                    disabled={updating === product.id}
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50 text-sm"
                  >
                    <Save className="w-4 h-4" />
                    {updating === product.id ? 'Saving...' : 'Save'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
