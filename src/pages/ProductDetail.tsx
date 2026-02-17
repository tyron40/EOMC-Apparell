import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useEditMode } from '../context/EditModeContext';
import { Check, Share2, Facebook, Twitter, MessageCircle, Edit3, X } from 'lucide-react';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { isEditMode } = useEditMode();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    price: 0,
    description: '',
    image_url: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [slug]);

  const loadProduct = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (data) {
      setProduct(data);
      if (data.sizes && data.sizes.length > 0) {
        setSelectedSize(data.sizes[0]);
      }
      loadRelatedProducts(data.category_id);
    }
    setLoading(false);
  };

  const loadRelatedProducts = async (categoryId: string) => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', categoryId)
      .neq('slug', slug)
      .limit(3);

    if (data) {
      setRelatedProducts(data);
    }
  };

  const handleAddToCart = async () => {
    if (!product || !selectedSize) return;

    await addToCart(product, selectedSize, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = async () => {
    if (!product || !selectedSize) return;

    await addToCart(product, selectedSize, quantity);
    navigate('/checkout');
  };

  const handleEditClick = () => {
    if (!product) return;
    setEditData({
      name: product.name,
      price: product.price,
      description: product.description || '',
      image_url: product.image_url
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: editData.name,
          price: parseFloat(editData.price.toString()),
          description: editData.description,
          image_url: editData.image_url
        })
        .eq('id', product.id);

      if (error) throw error;

      setShowEditModal(false);
      loadProduct();
    } catch (err) {
      console.error('Failed to update product:', err);
      alert('Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-700"
          >
            Return to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 relative">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-contain"
              />
              {isEditMode && user?.isAdmin && (
                <button
                  onClick={handleEditClick}
                  className="absolute top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-800 transition-colors shadow-lg z-10"
                  title="Edit product"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
              )}
            </div>
            {product.images && product.images.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, idx) => (
                  <div key={idx} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-contain" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <p className="text-3xl font-bold mb-6">${product.price}</p>

            {product.description && (
              <p className="text-gray-700 mb-6">{product.description}</p>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Size</label>
              <div className="flex gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-3 border-2 rounded-lg font-semibold transition-colors ${
                      selectedSize === size
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border-2 border-gray-300 rounded-lg font-bold hover:border-gray-400"
                >
                  -
                </button>
                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border-2 border-gray-300 rounded-lg font-bold hover:border-gray-400"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!selectedSize}
              className={`w-full py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-2 mb-3 ${
                addedToCart
                  ? 'bg-green-600 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } disabled:bg-gray-300 disabled:cursor-not-allowed`}
            >
              {addedToCart ? (
                <>
                  <Check className="w-5 h-5" />
                  Added to Cart
                </>
              ) : (
                'Add to Cart'
              )}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={!selectedSize}
              className="w-full py-4 rounded-lg font-semibold text-lg transition-colors bg-black text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed mb-6"
            >
              Buy Now
            </button>

            <div className="flex items-center gap-3 justify-center mb-6">
              <button className="p-2 border border-gray-300 rounded-full hover:bg-gray-50">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 border border-gray-300 rounded-full hover:bg-gray-50">
                <Facebook className="w-5 h-5" />
              </button>
              <button className="p-2 border border-gray-300 rounded-full hover:bg-gray-50">
                <MessageCircle className="w-5 h-5" />
              </button>
              <button className="p-2 border border-gray-300 rounded-full hover:bg-gray-50">
                <Twitter className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-8 border-t pt-8">
              <h3 className="font-semibold mb-4">Product Details</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Premium quality materials</li>
                <li>• Limited edition design</li>
                <li>• Comfortable fit</li>
                <li>• Machine washable</li>
              </ul>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-8">Usually Bought Together</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/product/${relatedProduct.slug}`}
                  className="group"
                >
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square bg-gray-100 overflow-hidden">
                      <img
                        src={relatedProduct.image_url}
                        alt={relatedProduct.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1">{relatedProduct.name}</h3>
                      <p className="text-gray-900 font-bold">${relatedProduct.price}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Edit Product</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={editData.price}
                  onChange={(e) => setEditData({ ...editData, price: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  required
                  value={editData.image_url}
                  onChange={(e) => setEditData({ ...editData, image_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
