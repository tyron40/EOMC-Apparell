import { Link, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function OrderConfirmation() {
  const location = useLocation();
  const orderNumber = location.state?.orderNumber || 'N/A';

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
        <p className="text-xl text-gray-600 mb-8">
          Thank you for your order. We'll send you a confirmation email shortly.
        </p>

        <div className="bg-gray-50 rounded-lg p-8 mb-8">
          <p className="text-sm text-gray-600 mb-2">Order Number</p>
          <p className="text-2xl font-bold">{orderNumber}</p>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="block bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
