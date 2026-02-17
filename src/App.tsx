import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { EditModeProvider } from './context/EditModeContext';
import { supabaseConfigured } from './lib/supabase';
import Header from './components/Header';
import Footer from './components/Footer';
import ConfigurationNotice from './components/ConfigurationNotice';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/Dashboard';
import AdminSetup from './pages/admin/Setup';
import CustomPage from './pages/CustomPage';

function App() {
  // Show configuration notice if Supabase is not configured
  if (!supabaseConfigured) {
    return <ConfigurationNotice />;
  }

  return (
    <Router>
      <AuthProvider>
        <EditModeProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/product/:slug" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-confirmation" element={<OrderConfirmation />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/admin/setup" element={<AdminSetup />} />
                  <Route path="/admin/*" element={<AdminDashboard />} />
                  <Route path="/page/:slug" element={<CustomPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </CartProvider>
        </EditModeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
