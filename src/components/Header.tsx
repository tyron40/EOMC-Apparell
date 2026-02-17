import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Settings, Menu, X, Edit2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useEditMode } from '../context/EditModeContext';
import { supabase } from '../lib/supabase';
import LogoAndPagesEditor from './admin/LogoAndPagesEditor';

interface CustomPage {
  id: string;
  slug: string;
  title: string;
  nav_order: number;
}

export default function Header() {
  const { cartCount } = useCart();
  const { user, signOut } = useAuth();
  const { isEditMode, toggleEditMode } = useEditMode();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showLogoEditor, setShowLogoEditor] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [siteName, setSiteName] = useState('EYES OPEN MOUTHS CLOSED');
  const [customPages, setCustomPages] = useState<CustomPage[]>([]);

  useEffect(() => {
    loadHeaderData();
  }, []);

  const loadHeaderData = async () => {
    try {
      // Load logo and site name
      const { data: settingsData } = await supabase
        .from('site_settings')
        .select('*')
        .in('key', ['logo_url', 'site_name']);

      if (settingsData) {
        const logo = settingsData.find(s => s.key === 'logo_url')?.value;
        const name = settingsData.find(s => s.key === 'site_name')?.value;
        if (logo) setLogoUrl(logo);
        if (name) setSiteName(name);
      }

      // Load custom pages for navigation
      const { data: pagesData } = await supabase
        .from('custom_pages')
        .select('id, slug, title, nav_order')
        .eq('active', true)
        .eq('show_in_nav', true)
        .order('nav_order');

      if (pagesData) {
        setCustomPages(pagesData);
      }
    } catch (error) {
      console.error('Error loading header data:', error);
    }
  };

  const handleCloseEditor = () => {
    setShowLogoEditor(false);
    loadHeaderData();
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo with Edit Button */}
            <div className="relative flex items-center">
              <Link to="/" className="flex items-center space-x-3">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="w-12 h-12 object-contain" />
                ) : (
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center border-4 border-black relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 bg-white rounded-full"></div>
                    </div>
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-black rounded-t-full"></div>
                  </div>
                )}
                <span className="text-xl font-bold hidden sm:block">{siteName}</span>
                <span className="text-xl font-bold sm:hidden">{siteName.split(' ').map(w => w[0]).join('')}</span>
              </Link>
              
              {/* Edit Button for Logo & Pages */}
              {isEditMode && user?.isAdmin && (
                <button
                  onClick={() => setShowLogoEditor(true)}
                  className="ml-3 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors border-2 border-purple-500"
                  title="Edit Logo & Pages"
                >
                  <Edit2 className="w-4 h-4 text-purple-600" />
                </button>
              )}
            </div>

            {/* Desktop Navigation with Edit Indicator */}
            <div className="relative flex items-center">
              <nav className="hidden md:flex items-center space-x-8">
                <Link to="/" className="text-gray-700 hover:text-black font-semibold transition-colors">
                  Home
                </Link>
                <Link to="/products" className="text-gray-700 hover:text-black font-semibold transition-colors">
                  Products
                </Link>
                {customPages.map((page) => (
                  <Link
                    key={page.id}
                    to={`/page/${page.slug}`}
                    className="text-gray-700 hover:text-black font-semibold transition-colors"
                  >
                    {page.title}
                  </Link>
                ))}
              </nav>
              
              {/* Edit Indicator for Navigation */}
              {isEditMode && user?.isAdmin && (
                <div className="hidden md:block ml-3 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full border border-purple-300">
                  Click logo edit to manage pages
                </div>
              )}
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              {/* Edit Mode Toggle (Admin Only) */}
              {user?.isAdmin && (
                <button
                  onClick={toggleEditMode}
                  className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                    isEditMode
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  title={isEditMode ? 'Exit Edit Mode' : 'Enter Edit Mode'}
                >
                  <Edit2 className="w-4 h-4" />
                  {isEditMode ? 'ON' : 'OFF'}
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden w-10 h-10 flex items-center justify-center"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Cart */}
              <Link to="/cart" className="relative">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center relative hover:bg-gray-800 transition-colors">
                  <ShoppingCart className="w-5 h-5 text-white" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-white text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-black">
                      {cartCount}
                    </span>
                  )}
                </div>
              </Link>

              {/* User Menu */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="w-10 h-10 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
                    aria-label="User menu"
                  >
                    <User className="w-5 h-5 text-white" />
                  </button>
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm text-gray-600 truncate">{user.email}</p>
                      </div>
                      {user.isAdmin && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          onClick={() => setShowDropdown(false)}
                        >
                          <Settings className="w-4 h-4" />
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          signOut();
                          setShowDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="w-10 h-10 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
                  <User className="w-5 h-5 text-white" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Logo & Pages Editor Modal */}
      {showLogoEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Edit Logo & Pages</h2>
              <button
                onClick={handleCloseEditor}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <LogoAndPagesEditor onClose={handleCloseEditor} />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileMenu(false)} />
          <div className="fixed top-0 right-0 bottom-0 w-64 bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-bold">Menu</h3>
              <button onClick={() => setShowMobileMenu(false)} aria-label="Close menu">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="p-4 space-y-4">
              <Link
                to="/"
                className="block text-gray-700 hover:text-black font-semibold py-2"
                onClick={() => setShowMobileMenu(false)}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="block text-gray-700 hover:text-black font-semibold py-2"
                onClick={() => setShowMobileMenu(false)}
              >
                Products
              </Link>
              {customPages.map((page) => (
                <Link
                  key={page.id}
                  to={`/page/${page.slug}`}
                  className="block text-gray-700 hover:text-black font-semibold py-2"
                  onClick={() => setShowMobileMenu(false)}
                >
                  {page.title}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
