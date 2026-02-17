import { useEffect, useState } from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Package, ShoppingBag, AlertCircle, LayoutDashboard, Settings } from 'lucide-react';
import ProductManager from './ProductManager';
import InventoryManager from './InventoryManager';
import OrdersManager from './OrdersManager';
import AdminSettings from './Settings';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    totalOrders: 0
  });

  useEffect(() => {
    if (user?.isAdmin) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    setStats({
      totalProducts: 12,
      lowStockItems: 3,
      totalOrders: 45
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user?.isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { path: '/admin/products', label: 'Products', icon: Package },
    { path: '/admin/inventory', label: 'Inventory', icon: AlertCircle },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { path: '/admin/settings', label: 'Settings', icon: Settings }
  ];

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row">
        {/* Mobile-friendly sidebar */}
        <aside className="w-full md:w-64 bg-white shadow-lg md:min-h-screen">
          <div className="p-4 md:p-6 border-b">
            <h2 className="text-lg md:text-xl font-bold">Admin Panel</h2>
            <p className="text-xs md:text-sm text-gray-600 mt-1 truncate">{user.email}</p>
          </div>
          <nav className="p-2 md:p-4">
            <ul className="space-y-1 md:space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path, item.exact);
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg transition-colors text-sm md:text-base ${
                        active
                          ? 'bg-black text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Routes>
            <Route
              path="/"
              element={
                <div className="max-w-7xl mx-auto">
                  <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8">Dashboard Overview</h1>
                  
                  {/* Stats Grid - 2 columns on mobile, 3 on desktop */}
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6 mb-4 md:mb-8">
                    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-600 text-xs md:text-sm font-medium">Total Products</p>
                          <p className="text-2xl md:text-3xl font-bold mt-1 truncate">{stats.totalProducts}</p>
                        </div>
                        <Package className="w-10 h-10 md:w-12 md:h-12 text-blue-600 flex-shrink-0" />
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-600 text-xs md:text-sm font-medium">Low Stock Items</p>
                          <p className="text-2xl md:text-3xl font-bold mt-1 text-orange-600 truncate">
                            {stats.lowStockItems}
                          </p>
                        </div>
                        <AlertCircle className="w-10 h-10 md:w-12 md:h-12 text-orange-600 flex-shrink-0" />
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow col-span-2 lg:col-span-1">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-600 text-xs md:text-sm font-medium">Total Orders</p>
                          <p className="text-2xl md:text-3xl font-bold mt-1 truncate">{stats.totalOrders}</p>
                        </div>
                        <ShoppingBag className="w-10 h-10 md:w-12 md:h-12 text-green-600 flex-shrink-0" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                    <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                      <Link
                        to="/admin/products"
                        className="p-4 md:p-5 border-2 border-gray-200 rounded-lg hover:border-black hover:shadow-md transition-all group"
                      >
                        <Package className="w-7 h-7 md:w-8 md:h-8 mb-2 group-hover:scale-110 transition-transform" />
                        <h3 className="font-semibold text-sm md:text-base">Manage Products</h3>
                        <p className="text-xs md:text-sm text-gray-600 mt-1">
                          Add, edit, or remove products
                        </p>
                      </Link>
                      <Link
                        to="/admin/inventory"
                        className="p-4 md:p-5 border-2 border-gray-200 rounded-lg hover:border-black hover:shadow-md transition-all group"
                      >
                        <AlertCircle className="w-7 h-7 md:w-8 md:h-8 mb-2 group-hover:scale-110 transition-transform" />
                        <h3 className="font-semibold text-sm md:text-base">Update Inventory</h3>
                        <p className="text-xs md:text-sm text-gray-600 mt-1">
                          Manage stock levels and availability
                        </p>
                      </Link>
                    </div>
                  </div>
                </div>
              }
            />
            <Route path="/products" element={<ProductManager />} />
            <Route path="/inventory" element={<InventoryManager />} />
            <Route path="/orders" element={<OrdersManager />} />
            <Route path="/settings" element={<AdminSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
