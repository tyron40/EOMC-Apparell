import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { uploadMultipleImages } from '../../lib/storage';
import { Product, Category } from '../../types';
import { Plus, Edit, Trash2, X, Upload, CheckCircle, AlertCircle } from 'lucide-react';

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [shouldResizeImages, setShouldResizeImages] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    category_id: '',
    sizes: ['S', 'M', 'L', 'XL'],
    stock_quantity: '100',
    low_stock_threshold: '5',
    is_featured: false,
    is_available: true,
    image_fit: 'contain' as 'contain' | 'cover' | 'fill'
  });

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setProducts(data);
    }
    setLoading(false);
  };

  const loadCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (data) {
      setCategories(data);
    }
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

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (uploadedImages.length === 0) {
      setMessage({ type: 'error', text: 'Please upload at least one image' });
      return;
    }

    const productData = {
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      price: parseFloat(formData.price),
      category_id: formData.category_id,
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
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;
        setMessage({ type: 'success', text: 'Product updated successfully!' });
      } else {
        const { error } = await supabase.from('products').insert(productData);
        if (error) throw error;
        setMessage({ type: 'success', text: 'Product created successfully!' });
      }

      await loadProducts();
      setTimeout(() => {
        resetForm();
      }, 1500);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to save product' });
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setUploadedImages(product.images || [product.image_url]);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price.toString(),
      category_id: product.category_id,
      sizes: product.sizes,
      stock_quantity: product.stock_quantity.toString(),
      low_stock_threshold: product.low_stock_threshold.toString(),
      is_featured: product.is_featured,
      is_available: product.is_available,
      image_fit: product.image_fit || 'contain'
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        await loadProducts();
        setMessage({ type: 'success', text: 'Product deleted successfully!' });
        setTimeout(() => setMessage(null), 3000);
      } catch (err: any) {
        setMessage({ type: 'error', text: err.message || 'Failed to delete product' });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      price: '',
      category_id: '',
      sizes: ['S', 'M', 'L', 'XL'],
      stock_quantity: '100',
      low_stock_threshold: '5',
      is_featured: false,
      is_available: true,
      image_fit: 'contain' as 'contain' | 'cover' | 'fill'
    });
    setUploadedImages([]);
    setShouldResizeImages(true);
    setEditingProduct(null);
    setShowModal(false);
    setMessage(null);
  };

  if (loading) {
    return <div className="text-center py-12">Loading products...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {message && !showModal && (
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

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-12 h-12 rounded object-contain"
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${product.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`text-sm font-semibold ${
                      product.stock_quantity <= product.low_stock_threshold
                        ? 'text-red-600'
                        : 'text-gray-900'
                    }`}
                  >
                    {product.stock_quantity}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.is_available
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {product.is_available ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
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
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    required
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
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
                  {editingProduct ? 'Update Product' : 'Create Product'}
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