import { useState, useEffect } from 'react';
import { X, Check, ShoppingCart, Edit2, Save, XCircle, Upload } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { uploadMultipleImages } from '../lib/storage';
import ImageUploadWithResize from './ImageUploadWithResize';
import ImagePositionControls from './ImagePositionControls';

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
  onUpdate?: () => void;
}

export default function QuickViewModal({ product, onClose, onUpdate }: QuickViewModalProps) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editedProduct, setEditedProduct] = useState({
    name: product.name,
    price: product.price,
    description: product.description || '',
    sizes: product.sizes,
    image_url: product.image_url,
    images: product.images || [],
    image_fit: product.image_fit || 'contain',
    position_x: product.position_x || 0,
    position_y: product.position_y || 0,
    zoom: product.zoom || 1
  });

  useEffect(() => {
    if (product.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product]);

  const handleAddToCart = async () => {
    if (!selectedSize) return;

    await addToCart(product, selectedSize, quantity);
    setAddedToCart(true);
    setTimeout(() => {
      setAddedToCart(false);
    }, 2000);
  };

  const handleBuyNow = async () => {
    if (!selectedSize) return;

    await addToCart(product, selectedSize, quantity);
    onClose();
    navigate('/checkout');
  };

  const handleViewDetails = () => {
    onClose();
    navigate(`/product/${product.slug}`);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: editedProduct.name,
          price: editedProduct.price,
          description: editedProduct.description,
          sizes: editedProduct.sizes,
          image_url: editedProduct.image_url,
          images: editedProduct.images,
          image_fit: editedProduct.image_fit,
          position_x: editedProduct.position_x,
          position_y: editedProduct.position_y,
          zoom: editedProduct.zoom
        })
        .eq('id', product.id);

      if (error) throw error;

      setIsEditMode(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Failed to update product:', error);
      alert('Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedProduct({
      name: product.name,
      price: product.price,
      description: product.description || '',
      sizes: product.sizes,
      image_url: product.image_url,
      images: product.images || [],
      image_fit: product.image_fit || 'contain',
      position_x: product.position_x || 0,
      position_y: product.position_y || 0,
      zoom: product.zoom || 1
    });
    setIsEditMode(false);
  };

  const handleImageUpload = async (files: FileList, shouldResize: boolean = true) => {
    try {
      const urls = await uploadMultipleImages(files, {
        resize: shouldResize,
        context: 'product'
      });
      setEditedProduct({
        ...editedProduct,
        image_url: urls[0],
        images: [...editedProduct.images, ...urls]
      });
    } catch (err) {
      console.error('Failed to upload images:', err);
      alert('Failed to upload images');
    }
  };

  const removeImage = (index: number) => {
    const newImages = editedProduct.images.filter((_, i) => i !== index);
    setEditedProduct({
      ...editedProduct,
      images: newImages,
      image_url: index === 0 && newImages.length > 0 ? newImages[0] : editedProduct.image_url
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            {user?.isAdmin && !isEditMode && (
              <button
                onClick={() => setIsEditMode(true)}
                className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                title="Edit Product"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6 p-6">
            <div>
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={isEditMode ? editedProduct.image_url : product.image_url}
                  alt={isEditMode ? editedProduct.name : product.name}
                  className={`w-full h-full object-${isEditMode ? editedProduct.image_fit : (product.image_fit || 'contain')}`}
                  style={{
                    transform: `scale(${isEditMode ? editedProduct.zoom : (product.zoom || 1)}) translate(${isEditMode ? editedProduct.position_x : (product.position_x || 0)}%, ${isEditMode ? editedProduct.position_y : (product.position_y || 0)}%)`,
                    transformOrigin: 'center center'
                  }}
                />
              </div>

              {isEditMode ? (
                <div className="mt-4 space-y-4">
                  <ImageUploadWithResize
                    onUpload={handleImageUpload}
                    maxFiles={5}
                  />

                  <ImagePositionControls
                    imageFit={editedProduct.image_fit}
                    positionX={editedProduct.position_x}
                    positionY={editedProduct.position_y}
                    zoom={editedProduct.zoom}
                    onImageFitChange={(fit) => setEditedProduct({ ...editedProduct, image_fit: fit })}
                    onPositionChange={(x, y) => setEditedProduct({ ...editedProduct, position_x: x, position_y: y })}
                    onZoomChange={(z) => setEditedProduct({ ...editedProduct, zoom: z })}
                  />

                  {editedProduct.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-2">
                      {editedProduct.images.map((img, idx) => (
                        <div key={idx} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
                          <img src={img} alt={`${editedProduct.name} ${idx + 1}`} className="w-full h-full object-contain" />
                          <button
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                product.images && product.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-4">
                    {product.images.slice(0, 4).map((img, idx) => (
                      <div key={idx} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-contain" />
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>

            <div className="flex flex-col">
              {isEditMode ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Product Name</label>
                    <input
                      type="text"
                      value={editedProduct.name}
                      onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editedProduct.price}
                      onChange={(e) => setEditedProduct({ ...editedProduct, price: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      value={editedProduct.description}
                      onChange={(e) => setEditedProduct({ ...editedProduct, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Sizes (comma-separated)</label>
                    <input
                      type="text"
                      value={editedProduct.sizes.join(', ')}
                      onChange={(e) => setEditedProduct({
                        ...editedProduct,
                        sizes: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="S, M, L, XL"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 py-3 rounded-lg font-semibold text-lg bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-300 flex items-center justify-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      className="flex-1 py-3 rounded-lg font-semibold text-lg bg-gray-600 text-white hover:bg-gray-700 disabled:bg-gray-300 flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-5 h-5" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h2>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">${product.price}</p>

                  {product.description && (
                    <p className="text-gray-700 mb-6 line-clamp-3">{product.description}</p>
                  )}

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Size</label>
                    <div className="flex gap-2 flex-wrap">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 border-2 rounded-lg font-semibold transition-colors ${
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
                    <div className="flex items-center gap-3">
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

                  <div className="space-y-3 mt-auto">
                    <button
                      onClick={handleAddToCart}
                      disabled={!selectedSize}
                      className={`w-full py-3 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-2 ${
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
                        <>
                          <ShoppingCart className="w-5 h-5" />
                          Add to Cart
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleBuyNow}
                      disabled={!selectedSize}
                      className="w-full py-3 rounded-lg font-semibold text-lg transition-colors bg-black text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Buy Now
                    </button>

                    <button
                      onClick={handleViewDetails}
                      className="w-full py-3 rounded-lg font-semibold text-lg transition-colors border-2 border-gray-300 hover:border-gray-400"
                    >
                      View Full Details
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
