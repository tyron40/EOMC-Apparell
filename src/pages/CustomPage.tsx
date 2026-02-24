import { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Edit3, Plus, X, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useEditMode } from '../context/EditModeContext';
import ProductCard from '../components/ProductCard';
import { uploadMultipleImages } from '../lib/storage';

interface CustomPageData {
  id: string;
  slug: string;
  title: string;
  content: string;
  active: boolean;
  category_id?: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  image_url: string;
  category_id?: string;
}

export default function CustomPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const { isEditMode } = useEditMode();
  const [page, setPage] = useState<CustomPageData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [shouldResizeImages, setShouldResizeImages] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    sizes: ['S', 'M', 'L', 'XL'],
    stock_quantity: '100',
    low_stock_threshold: '5',
    is_featured: false,
    is_available: true,
    image_fit: 'contain' as 'contain' | 'cover' | 'fill'
  });

  useEffect(() => {
    loadPage();
  }, [slug]);

  const loadPage = async () => {
    if (!slug) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('custom_pages')
        .select('*')
        .eq('slug', slug)
        .eq('active', true)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        setNotFound(true);
      } else {
        setPage(data);

        if (data.category_id) {
          await loadProducts(data.category_id);
        }
      }
    } catch (error) {
      console.error('Error loading page:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async (categoryId: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', categoryId)
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setProducts(data);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleImageUpload = async (files: FileList, shouldResize: boolean = true) => {
    setUploading(true);
    try {
      const urls = await uploadMultipleImages(files, {
        resize: shouldResize,
        context: 'product'
      });
      setUploadedImages([...uploadedImages, ...urls]);
      setMessage({ type: 'success', text: `${files.length} image(s) uploaded successfully!` });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error('Failed to upload images:', err);
      setMessage({ type: 'error', text: 'Failed to upload images' });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (uploadedImages.length === 0) {
      setMessage({ type: 'error', text: 'Please upload at least one image' });
      return;
    }

    if (!page?.category_id) {
      setMessage({ type: 'error', text: 'No category assigned to this page' });
      return;
    }

    const productData = {
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      price: parseFloat(formData.price),
      category_id: page.category_id,
      image_url: uploadedImages[0],
      images: uploadedImages,
      sizes: formData.sizes,
      stock_quantity: parseInt(formData.stock_quantity),
      low_stock_threshold: parseInt(formData.low_stock_threshold),
      is_featured: formData.is_featured,
      is_available: formData.is_available,
      image_fit: formData.image_fit
    };

    try {
      const { error } = await supabase.from('products').insert(productData);
      if (error) throw error;
      setMessage({ type: 'success', text: 'Product created successfully!' });
      if (page.category_id) {
        await loadProducts(page.category_id);
      }
      setTimeout(() => {
        resetForm();
      }, 1500);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to save product' });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      price: '',
      sizes: ['S', 'M', 'L', 'XL'],
      stock_quantity: '100',
      low_stock_threshold: '5',
      is_featured: false,
      is_available: true,
      image_fit: 'contain' as 'contain' | 'cover' | 'fill'
    });
    setUploadedImages([]);
    setShouldResizeImages(true);
    setShowProductModal(false);
    setMessage(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (notFound || !page) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 relative">
          {isEditMode && user?.isAdmin && (
            <Link
              to={`/admin/settings`}
              className="absolute top-4 right-4 p-3 bg-white hover:bg-gray-50 rounded-full shadow-lg transition-all hover:scale-110 border border-gray-200 group"
              title="Edit Page Settings"
            >
              <Edit3 className="w-5 h-5 text-black" />
              <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                Edit Page
              </span>
            </Link>
          )}

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">{page.title}</h1>

          {page.content && (
            <div
              className="prose prose-lg max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          )}

          {products.length > 0 && (
            <div className="mt-8 sm:mt-12">
              <div className="flex justify-between items-center mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Products</h2>
                {isEditMode && user?.isAdmin && page.category_id && (
                  <button
                    onClick={() => setShowProductModal(true)}
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="hidden sm:inline">Add Product</span>
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} onUpdate={() => page.category_id && loadProducts(page.category_id)} />
                ))}
              </div>
            </div>
          )}

          {isEditMode && user?.isAdmin && products.length === 0 && page.category_id && (
            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg text-center">
              <p className="text-sm text-blue-800 mb-4">
                <strong>No products yet.</strong> Add your first product to this collection.
              </p>
              <button
                onClick={() => setShowProductModal(true)}
                className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors mx-auto"
              >
                <Plus className="w-5 h-5" />
                Add Product
              </button>
            </div>
          )}

          {isEditMode && user?.isAdmin && products.length === 0 && !page.category_id && (
            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> To display products on this page, go to Admin Settings and assign a category to this page.
                Products from that category will automatically appear here.
              </p>
            </div>
          )}
        </div>
      </div>

      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Add New Product</h2>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            {message && (
              <div
                className={`mb-4 p-4 rounded-lg border flex items-center gap-2 ${
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      name: e.target.value,
                      slug: generateSlug(e.target.value)
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Image Fit</label>
                  <select
                    value={formData.image_fit}
                    onChange={(e) => setFormData({ ...formData, image_fit: e.target.value as 'contain' | 'cover' | 'fill' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="contain">Contain (fit inside)</option>
                    <option value="cover">Cover (fill frame)</option>
                    <option value="fill">Fill (stretch)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Product Images (Multiple)</label>

                <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shouldResizeImages}
                      onChange={(e) => setShouldResizeImages(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-blue-900">
                      Auto-resize and optimize images (Recommended: 800x800px)
                    </span>
                  </label>
                </div>

                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    {uploading ? 'Uploading...' : 'Click to upload images (can select multiple)'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleImageUpload(e.target.files, shouldResizeImages);
                        e.target.value = '';
                      }
                    }}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>

                {uploadedImages.length > 0 && (
                  <div className="mt-4 grid grid-cols-4 gap-3">
                    {uploadedImages.map((url, index) => (
                      <div key={index} className="relative group">
                        <img src={url} alt={`Product ${index + 1}`} className="w-full aspect-square object-contain rounded-lg" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-1 left-1 bg-black text-white text-xs px-2 py-1 rounded">
                            Main
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Low Stock Alert</label>
                  <input
                    type="number"
                    required
                    value={formData.low_stock_threshold}
                    onChange={(e) =>
                      setFormData({ ...formData, low_stock_threshold: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium">Featured Product</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_available}
                    onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium">Available for Purchase</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                  Create Product
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
