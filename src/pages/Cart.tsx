import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2 } from 'lucide-react';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some items to get started!</p>
          <Link
            to="/"
            className="bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors inline-block"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 flex gap-3 sm:gap-4">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.product?.image_url}
                      alt={item.product?.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between mb-2">
                      <div className="flex-1 min-w-0 pr-2">
                        <h3 className="font-semibold text-sm sm:text-base truncate">{item.product?.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-600">Size: {item.size}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-700 flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 sm:w-8 sm:h-8 border border-gray-300 rounded hover:bg-gray-50 text-sm"
                        >
                          -
                        </button>
                        <span className="w-6 sm:w-8 text-center font-semibold text-sm sm:text-base">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 sm:w-8 sm:h-8 border border-gray-300 rounded hover:bg-gray-50 text-sm"
                        >
                          +
                        </button>
                      </div>
                      <p className="font-bold text-sm sm:text-base">
                        ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-200 lg:sticky lg:top-20">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">FREE</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg">
                  <span className="font-bold">Total</span>
                  <span className="font-bold">${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors mb-3"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/"
                className="block text-center text-gray-600 hover:text-gray-900"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
