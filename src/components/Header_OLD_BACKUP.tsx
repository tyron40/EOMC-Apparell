import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Settings, Edit3, X, Plus, Trash2, Upload, Menu } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useEditMode } from '../context/EditModeContext';
import { supabase } from '../lib/supabase';
import { uploadImage } from '../lib/storage';

interface NavItem {
  id: string;
  label: string;
  url: string;
  order: number;
  active: boolean;
}

export default function Header() {
  const { cartCount } = useCart();
  const { user, signOut } = useAuth();
  const { isEditMode } = useEditMode();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [siteName, setSiteName] = useState('STORE');
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [showLogoEdit, setShowLogoEdit] = useState(false);
  const [showNavEdit, setShowNavEdit] = useState(false);
  const [editLogoUrl, setEditLogoUrl] = useState('');
  const [editSiteName, setEditSiteName] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadSiteSettings();
    loadNavItems();
  }, []);

  const loadSiteSettings = async () => {
    const { data } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['logo_url', 'site_name']);

    if (data) {
      const logo = data.find(s => s.key === 'logo_url');
      const name = data.find(s => s.key === 'site_name');
      if (logo) setLogoUrl(logo.value);
      if (name) setSiteName(name.value);
    }
  };

  const loadNavItems = async () => {
    const { data } = await supabase
      .from('navigation_items')
      .select('*')
      .eq('active', true)
      .order('order');

    if (data) setNavItems(data);
  };

  const handleLogoUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadImage(file);
      await supabase
        .from('site_settings')
        .update({ value: url, updated_at: new Date().toISOString() })
        .eq('key', 'logo_url');

      await supabase
        .from('site_settings')
        .update({ value: editSiteName, updated_at: new Date().toISOString() })
        .eq('key', 'site_name');

      setLogoUrl(url);
      setSiteName(editSiteName);
      setShowLogoEdit(false);
      loadSiteSettings();
    } catch (err) {
      console.error('Failed to update logo:', err);
      alert('Failed to update logo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center space-x-3 relative group">
              {logoUrl ? (
                <img src={logoUrl} alt={siteName} className="h-12 w-auto object-contain" />
              ) : (
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center border-4 border-black relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 bg-white rounded-full"></div>
                  </div>
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-black rounded-t-full"></div>
                </div>
              )}
              <span className="text-xl font-bold">{siteName}</span>
              {isEditMode && user?.isAdmin && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setEditLogoUrl(logoUrl);
                    setEditSiteName(siteName);
                    setShowLogoEdit(true);
                  }}
                  className="absolute -top-2 -right-2 bg-black text-white p-1.5 rounded-full hover:bg-gray-800 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                  title="Edit logo"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
              )}
            </Link>

            <nav className="hidden md:flex items-center space-x-8 relative">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.url}
                  className="text-gray-700 hover:text-gray-900 font-semibold"
                >
                  {item.label}
                </Link>
              ))}
              {isEditMode && user?.isAdmin && (
                <button
                  onClick={() => setShowNavEdit(true)}
                  className="p-1.5 bg-black text-white rounded-full hover:bg-gray-800 transition-colors shadow-lg"
                  title="Edit navigation"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
              )}
            </nav>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden w-10 h-10 flex items-center justify-center"
              >
                <Menu className="w-6 h-6" />
              </button>
              <Link to="/cart" className="relative">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center relative">
                  <ShoppingCart className="w-5 h-5 text-white" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-white text-blue-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-blue-600">
                      {cartCount}
                    </span>
                  )}
                </div>
              </Link>
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center"
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
                <Link to="/login" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {showMobileMenu && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileMenu(false)} />
          <div className="fixed top-0 right-0 bottom-0 w-64 bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-bold">Menu</h3>
              <button onClick={() => setShowMobileMenu(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="p-4 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.url}
                  className="block text-gray-700 hover:text-gray-900 font-semibold py-2"
                  onClick={() => setShowMobileMenu(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {showLogoEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Edit Logo & Site Name</h3>
              <button onClick={() => setShowLogoEdit(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Logo</label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Click to upload logo image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleLogoUpload(file);
                    }}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                {uploading && <p className="text-sm text-gray-600 mt-2">Uploading...</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                <input
                  type="text"
                  required
                  value={editSiteName}
                  onChange={(e) => setEditSiteName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <button onClick={() => setShowLogoEdit(false)} className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <NavManager
        show={showNavEdit}
        onClose={() => setShowNavEdit(false)}
        onUpdate={loadNavItems}
      />
    </>
  );
}

function NavManager({ show, onClose, onUpdate }: { show: boolean; onClose: () => void; onUpdate: () => void }) {
  const [items, setItems] = useState<NavItem[]>([]);
  const [editingItem, setEditingItem] = useState<NavItem | null>(null);
  const [formData, setFormData] = useState({ label: '', url: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (show) loadItems();
  }, [show]);

  const loadItems = async () => {
    const { data } = await supabase
      .from('navigation_items')
      .select('*')
      .order('order');
    if (data) setItems(data);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingItem) {
        await supabase
          .from('navigation_items')
          .update(formData)
          .eq('id', editingItem.id);
      } else {
        const maxOrder = Math.max(...items.map(i => i.order), 0);
        await supabase
          .from('navigation_items')
          .insert({ ...formData, order: maxOrder + 1, active: true });
      }
      loadItems();
      onUpdate();
      setEditingItem(null);
      setFormData({ label: '', url: '' });
    } catch (err) {
      console.error('Failed to save nav item:', err);
      alert('Failed to save navigation item');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this navigation item?')) return;
    await supabase.from('navigation_items').delete().eq('id', id);
    loadItems();
    onUpdate();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Manage Navigation</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold">{editingItem ? 'Edit Link' : 'Add New Link'}</h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
            <input
              type="text"
              required
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
            <input
              type="text"
              required
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="/products"
            />
          </div>
          <div className="flex gap-3">
            {editingItem && (
              <button type="button" onClick={() => { setEditingItem(null); setFormData({ label: '', url: '' }); }} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
            )}
            <button type="submit" disabled={saving} className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50">
              {saving ? 'Saving...' : editingItem ? 'Update' : 'Add'}
            </button>
          </div>
        </form>

        <div className="space-y-2">
          <h4 className="font-semibold mb-2">Current Links</h4>
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="flex-1">
                <p className="font-medium">{item.label}</p>
                <p className="text-sm text-gray-600">{item.url}</p>
              </div>
              <button onClick={() => { setEditingItem(item); setFormData({ label: item.label, url: item.url }); }} className="p-2 hover:bg-gray-100 rounded">
                <Edit3 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-red-100 rounded text-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}