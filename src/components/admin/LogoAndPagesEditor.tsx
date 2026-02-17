import { useState, useEffect } from 'react';
import { Image as ImageIcon, Plus, Trash2, Edit3, ExternalLink, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ImageUploadWithResize from '../ImageUploadWithResize';

interface SiteSettings {
  logo_url: string;
  site_name: string;
}

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  active: boolean;
  show_in_nav: boolean;
  nav_order: number;
}

interface LogoAndPagesEditorProps {
  onClose?: () => void;
}

export default function LogoAndPagesEditor({ onClose }: LogoAndPagesEditorProps) {
  const [logo, setLogo] = useState<SiteSettings>({ logo_url: '', site_name: 'EOMC' });
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [showPageEditor, setShowPageEditor] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch logo settings from key-value store
      const { data: settingsData } = await supabase
        .from('site_settings')
        .select('*')
        .in('key', ['logo_url', 'site_name']);

      if (settingsData) {
        const logoUrl = settingsData.find(s => s.key === 'logo_url')?.value || '';
        const siteName = settingsData.find(s => s.key === 'site_name')?.value || 'EOMC';
        setLogo({ logo_url: logoUrl, site_name: siteName });
      }

      // Fetch pages from custom_pages table
      const { data: pagesData, error: pagesError } = await supabase
        .from('custom_pages')
        .select('*')
        .order('nav_order');

      if (pagesError) throw pagesError;
      setPages(pagesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (file: File) => {
    setUploadingLogo(true);
    setUploadError('');
    
    try {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        throw new Error('Please upload a valid image file (JPG, PNG, GIF, or WebP)');
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('Image size must be less than 5MB');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      // Delete old logo if exists
      if (logo.logo_url) {
        const oldPath = logo.logo_url.split('/').slice(-2).join('/');
        await supabase.storage.from('site-images').remove([oldPath]);
      }

      const { error: uploadError } = await supabase.storage
        .from('site-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('site-images')
        .getPublicUrl(filePath);

      setLogo(prev => ({ ...prev, logo_url: publicUrl }));
      setUploadError('');
    } catch (error: any) {
      console.error('Error uploading logo:', error);
      const errorMessage = error.message || 'Failed to upload logo. Please try again.';
      setUploadError(errorMessage);
      alert(errorMessage);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSaveLogo = async () => {
    setSaving(true);
    try {
      // Update logo_url
      const { error: logoError } = await supabase
        .from('site_settings')
        .update({ value: logo.logo_url, updated_at: new Date().toISOString() })
        .eq('key', 'logo_url');

      if (logoError) throw logoError;

      // Update site_name
      const { error: nameError } = await supabase
        .from('site_settings')
        .update({ value: logo.site_name, updated_at: new Date().toISOString() })
        .eq('key', 'site_name');

      if (nameError) throw nameError;

      alert('Logo settings saved successfully!');
      if (onClose) {
        onClose();
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error saving logo:', error);
      alert('Failed to save logo settings');
    } finally {
      setSaving(false);
    }
  };

  const handleCreatePage = () => {
    const newPage: Page = {
      id: `temp-${Date.now()}`,
      title: '',
      slug: '',
      content: '',
      active: false,
      show_in_nav: true,
      nav_order: pages.length
    };
    setEditingPage(newPage);
    setShowPageEditor(true);
  };

  const handleEditPage = (page: Page) => {
    setEditingPage(page);
    setShowPageEditor(true);
  };

  const handleSavePage = async () => {
    if (!editingPage) return;

    if (!editingPage.title || !editingPage.slug) {
      alert('Please fill in title and slug');
      return;
    }

    setSaving(true);
    try {
      const pageData = {
        title: editingPage.title,
        slug: editingPage.slug,
        content: editingPage.content,
        active: editingPage.active,
        show_in_nav: editingPage.show_in_nav,
        nav_order: editingPage.nav_order
      };

      if (editingPage.id.startsWith('temp-')) {
        const { error } = await supabase
          .from('custom_pages')
          .insert(pageData);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('custom_pages')
          .update({ ...pageData, updated_at: new Date().toISOString() })
          .eq('id', editingPage.id);
        if (error) throw error;
      }

      alert('Page saved successfully!');
      setShowPageEditor(false);
      setEditingPage(null);
      fetchData();
    } catch (error) {
      console.error('Error saving page:', error);
      alert('Failed to save page');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePage = async (pageId: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;

    try {
      const { error } = await supabase
        .from('custom_pages')
        .delete()
        .eq('id', pageId);

      if (error) throw error;
      alert('Page deleted successfully!');
      fetchData();
    } catch (error) {
      console.error('Error deleting page:', error);
      alert('Failed to delete page');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Logo Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <ImageIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Site Logo</h2>
            <p className="text-sm text-gray-500">Upload and manage your site logo</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Current Logo Preview */}
          {logo.logo_url && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Current Logo:</p>
              <div className="w-32 h-32 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center p-2">
                <img
                  src={logo.logo_url}
                  alt="Site logo"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>
          )}

          {/* Site Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Name
            </label>
            <input
              type="text"
              value={logo.site_name}
              onChange={(e) => setLogo(prev => ({ ...prev, site_name: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="EOMC"
            />
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload New Logo
            </label>
            <div className="space-y-2">
              <ImageUploadWithResize
                currentImageUrl={logo.logo_url}
                context="product"
                onFileSelect={(file: File) => handleLogoUpload(file)}
                uploading={uploadingLogo}
              />
              <div className="text-xs text-gray-500 space-y-1">
                <p>• Supported formats: JPG, PNG, GIF, WebP</p>
                <p>• Maximum file size: 5MB</p>
                <p>• Recommended size: 200x200 pixels or larger</p>
                <p>• Square images work best for logos</p>
              </div>
              {uploadError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{uploadError}</p>
                </div>
              )}
              {uploadingLogo && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-600">Uploading logo... Please wait.</p>
                </div>
              )}
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveLogo}
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Logo Settings'}
          </button>
        </div>
      </div>

      {/* Pages Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Edit3 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Custom Pages</h2>
              <p className="text-sm text-gray-500">Create and manage custom pages</p>
            </div>
          </div>
          <button
            onClick={handleCreatePage}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Page
          </button>
        </div>

        {/* Pages List */}
        <div className="space-y-3">
          {pages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No custom pages yet. Click "New Page" to create one.</p>
            </div>
          ) : (
            pages.map((page) => (
              <div
                key={page.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900">{page.title}</h3>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      page.active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {page.active ? 'Published' : 'Draft'}
                    </span>
                    {page.show_in_nav && (
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                        In Nav
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">/{page.slug}</p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`/page/${page.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View page"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleEditPage(page)}
                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Edit page"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeletePage(page.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete page"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Page Editor Modal */}
      {showPageEditor && editingPage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold">
                {editingPage.id.startsWith('temp-') ? 'Create New Page' : 'Edit Page'}
              </h2>
              <button
                onClick={() => {
                  setShowPageEditor(false);
                  setEditingPage(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Page Title</label>
                <input
                  type="text"
                  value={editingPage.title}
                  onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="About Us"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">URL Slug</label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">/page/</span>
                  <input
                    type="text"
                    value={editingPage.slug}
                    onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                    className="flex-1 px-3 py-2 border rounded-lg"
                    placeholder="about-us"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea
                  value={editingPage.content}
                  onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={12}
                  placeholder="Page content (supports HTML)"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="active"
                    checked={editingPage.active}
                    onChange={(e) => setEditingPage({ ...editingPage, active: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="active" className="text-sm font-medium">
                    Publish this page (make it publicly visible)
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="show_in_nav"
                    checked={editingPage.show_in_nav}
                    onChange={(e) => setEditingPage({ ...editingPage, show_in_nav: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="show_in_nav" className="text-sm font-medium">
                    Show in navigation menu
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Navigation Order</label>
                  <input
                    type="number"
                    value={editingPage.nav_order}
                    onChange={(e) => setEditingPage({ ...editingPage, nav_order: parseInt(e.target.value) || 0 })}
                    className="w-32 px-3 py-2 border rounded-lg"
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
              <button
                onClick={() => {
                  setShowPageEditor(false);
                  setEditingPage(null);
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePage}
                disabled={saving}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Page'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
