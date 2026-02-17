import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import { Tag } from 'lucide-react';

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoExpanded, setPromoExpanded] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const orderItems = cartItems.map(item => ({
      product_id: item.product_id,
      product_name: item.product?.name || '',
      size: item.size,
      quantity: item.quantity,
      price: item.product?.price || 0
    }));

    const { error } = await supabase.from('orders').insert({
      order_number: orderNumber,
      customer_name: formData.name,
      customer_email: formData.email,
      customer_phone: formData.phone,
      shipping_address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        country: formData.country
      },
      items: orderItems,
      total: cartTotal,
      status: 'pending'
    });

    if (!error) {
      await clearCart();
      navigate('/order-confirmation', { state: { orderNumber } });
    }

    setLoading(false);
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                <h2 className="text-xl font-bold mb-4">Contact Information</h2>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Phone</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Street Address</label>
                    <input
                      type="text"
                      required
                      value={formData.street}
                      onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">City</label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">State</label>
                      <input
                        type="text"
                        required
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">ZIP Code</label>
                      <input
                        type="text"
                        required
                        value={formData.zip}
                        onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Country</label>
                      <input
                        type="text"
                        required
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-200 lg:sticky lg:top-20">
              <h2 className="text-xl font-bold mb-6">Order summary ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</h2>

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0 relative">
                      <img
                        src={item.product?.image_url}
                        alt={item.product?.name}
                        className="w-full h-full object-contain"
                      />
                      {item.quantity > 1 && (
                        <span className="absolute -top-1 -right-1 bg-gray-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {item.quantity}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 flex justify-between">
                      <div>
                        <p className="font-semibold text-sm">{item.product?.name}</p>
                        <p className="text-xs text-gray-600">{item.size}</p>
                      </div>
                      <p className="font-semibold">
                        ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <button
                  type="button"
                  onClick={() => setPromoExpanded(!promoExpanded)}
                  className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
                >
                  <Tag className="w-4 h-4" />
                  Enter a promo code
                </button>
                {promoExpanded && (
                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Promo code"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                    <button
                      type="button"
                      className="px-4 py-2 bg-black text-white rounded text-sm font-semibold hover:bg-gray-800"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-semibold">Free</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-lg">${cartTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
