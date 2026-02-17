import { useState, useEffect } from 'react';
import { ShoppingBag, Edit3, X, Trash2, Star } from 'lucide-react';
import { useEditMode } from '../context/EditModeContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import ImageUploadWithResize from './ImageUploadWithResize';

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url: string;
  price: number;
  is_featured: boolean;
}

export default function ProductShowcase() {
  const { user } = useAuth();
  const { isEditMode } = useEditMode();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .limit(6);

      if (error) throw error;

      if (data && data.length > 0) {
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnfeature = async (productId: string) => {
    if (!confirm('Remove this product from featured items?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .update({ is_featured: false })
        .eq('id', productId);

      if (error) throw error;

      setProducts(products.filter(p => p.id !== productId));
    } catch (error) {
      console.error('Error unfeaturing product:', error);
      alert('Failed to update product');
    }
  };

  const handleSaveProduct = async () => {
    if (!editingProduct) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: editingProduct.name,
          description: editingProduct.description,
          price: editingProduct.price,
          image_url: editingProduct.image_url,
        })
        .eq('id', editingProduct.id);

      if (error) throw error;

      setProducts(products.map(p =>
        p.id === editingProduct.id ? editingProduct : p
      ));
      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-12 w-64 bg-gray-200 animate-pulse mx-auto rounded mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    if (isEditMode && user?.isAdmin) {
      return (
        <section className="py-8 sm:py-12 md:py-16 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center p-12 border-2 border-dashed border-gray-300 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">No Featured Products</h2>
              <p className="text-gray-600 mb-6">
                Mark products as "Featured" in the Product Manager to display them here.
              </p>
              <Link
                to="/admin/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Edit3 className="w-5 h-5" />
                Manage Products
              </Link>
            </div>
          </div>
        </section>
      );
    }
    return null;
  }

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-white relative">
      {isEditMode && user?.isAdmin && (
        <Link
          to="/admin/products"
          className="absolute top-4 right-4 z-20 p-3 bg-white hover:bg-gray-50 rounded-full shadow-lg transition-all hover:scale-110 border border-gray-200 group"
          title="Manage Featured Products"
        >
          <Edit3 className="w-5 h-5 text-black" />
          <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Manage Products
          </span>
        </Link>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-10 md:mb-12 tracking-wider">
          NEW ARRIVALS
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {products.map((product) => (
            <div key={product.id} className="relative">
              <Link
                to={`/products/${product.slug}`}
                className="group cursor-pointer block"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-100 mb-3 sm:mb-4 rounded-lg">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                    className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-white p-2 sm:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
                    aria-label={`Add ${product.name} to cart`}
                    title="Add to cart"
                  >
                    <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
                <div className="text-center">
                  <h3 className="text-sm sm:text-base md:text-lg font-bold uppercase tracking-wide">{product.name}</h3>
                  {product.description && (
                    <p className="text-gray-600 text-xs sm:text-sm line-clamp-1">{product.description}</p>
                  )}
                  <p className="text-base sm:text-lg font-semibold mt-1">${product.price.toFixed(2)}</p>
                </div>
              </Link>

              {isEditMode && user?.isAdmin && (
                <div className="absolute top-2 right-2 flex gap-2 z-10">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="p-2 bg-white hover:bg-gray-100 rounded-full shadow-lg transition-all"
                    title="Edit product"
                  >
                    <Edit3 className="w-4 h-4 text-black" />
                  </button>
                  <button
                    onClick={() => handleUnfeature(product.id)}
                    className="p-2 bg-white hover:bg-red-50 rounded-full shadow-lg transition-all"
                    title="Remove from featured"
                  >
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">Edit Product</h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Product Image</label>
                <ImageUploadWithResize
                  currentImageUrl={editingProduct.image_url}
                  onImageUploaded={(url) =>
                    setEditingProduct({ ...editingProduct, image_url: url })
                  }
                  bucketName="products"
                  maxWidth={1200}
                  maxHeight={1200}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Product Name</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={editingProduct.description || ''}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingProduct.price}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex gap-3 justify-end">
              <button
                onClick={() => setEditingProduct(null)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProduct}
                disabled={saving}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
