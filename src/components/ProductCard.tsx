import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit3, X } from 'lucide-react';
import { Product } from '../types';
import { useAuth } from '../context/AuthContext';
import { useEditMode } from '../context/EditModeContext';
import { supabase } from '../lib/supabase';
import { uploadImage } from '../lib/storage';
import ImagePositionControls from './ImagePositionControls';
import ImageUploadWithResize from './ImageUploadWithResize';
import QuickViewModal from './QuickViewModal';

interface ProductCardProps {
  product: Product;
  onUpdate?: () => void;
}

export default function ProductCard({ product, onUpdate }: ProductCardProps) {
  const { user } = useAuth();
  const { isEditMode } = useEditMode();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [editData, setEditData] = useState({
    name: product.name,
    description: product.description || '',
    price: product.price,
    image_url: product.image_url,
    image_fit: product.image_fit || 'contain',
    position_x: product.position_x || 0,
    position_y: product.position_y || 0,
    zoom: product.zoom || 1.0,
    sizes: product.sizes || ['S', 'M', 'L', 'XL'],
    stock_quantity: product.stock_quantity || 100,
    low_stock_threshold: product.low_stock_threshold || 5,
    is_featured: product.is_featured || false,
    is_available: product.is_available !== false
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setEditData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      image_url: product.image_url,
      image_fit: product.image_fit || 'contain',
      position_x: product.position_x || 0,
      position_y: product.position_y || 0,
      zoom: product.zoom || 1.0,
      sizes: product.sizes || ['S', 'M', 'L', 'XL'],
      stock_quantity: product.stock_quantity || 100,
      low_stock_threshold: product.low_stock_threshold || 5,
      is_featured: product.is_featured || false,
      is_available: product.is_available !== false
    });
  }, [product]);

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowEditModal(true);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) {
      return;
    }
    e.preventDefault();
    setShowQuickView(true);
  };

  const handleImageUpload = async (file: File, shouldResize: boolean) => {
    setUploading(true);
    try {
      const url = await uploadImage(file, {
        resize: shouldResize,
        context: 'product'
      });
      setEditData({
        ...editData,
        image_url: url,
        position_x: 0,
        position_y: 0,
        zoom: 1.0
      });
    } catch (err) {
      console.error('Failed to upload image:', err);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: editData.name,
          description: editData.description,
          price: parseFloat(editData.price.toString()),
          image_url: editData.image_url,
          image_fit: editData.image_fit,
          position_x: editData.position_x,
          position_y: editData.position_y,
          zoom: editData.zoom,
          sizes: editData.sizes,
          stock_quantity: editData.stock_quantity,
          low_stock_threshold: editData.low_stock_threshold,
          is_featured: editData.is_featured,
          is_available: editData.is_available
        })
        .eq('id', product.id);

      if (error) throw error;

      if (onUpdate) await onUpdate();
      setShowEditModal(false);
      alert('Product updated successfully!');
    } catch (err) {
      console.error('Failed to update product:', err);
      alert('Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Link
        to={`/product/${product.slug}`}
        className="group block"
        onClick={handleCardClick}
      >
        <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <div className="aspect-square overflow-hidden bg-gray-100 relative">
            <img
              src={product.image_url}
              alt={product.name}
              className={`w-full h-full object-${product.image_fit || 'contain'} group-hover:scale-105 transition-transform duration-300`}
              style={{
                transform: `scale(${product.zoom || 1}) translate(${product.position_x || 0}%, ${product.position_y || 0}%)`,
                transformOrigin: 'center center'
              }}
            />
            {isEditMode && user?.isAdmin && (
              <button
                onClick={handleEdit}
                className="absolute top-2 right-2 bg-black text-white p-2 rounded-full hover:bg-gray-800 transition-colors shadow-lg z-10"
                title="Edit product"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="p-2 sm:p-4">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
            <p className="text-sm sm:text-base text-gray-900 font-bold">${product.price}</p>
          </div>
        </div>
      </Link>

      {showQuickView && (
        <QuickViewModal
          product={product}
          onClose={() => setShowQuickView(false)}
          onUpdate={onUpdate}
        />
      )}

      {showEditModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="bg-white rounded-lg max-w-md w-full p-6 my-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Edit Product</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
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
                  Description
                </label>
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  rows={3}
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    required
                    value={editData.stock_quantity}
                    onChange={(e) => setEditData({ ...editData, stock_quantity: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Low Stock Alert
                  </label>
                  <input
                    type="number"
                    required
                    value={editData.low_stock_threshold}
                    onChange={(e) => setEditData({ ...editData, low_stock_threshold: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editData.is_featured}
                    onChange={(e) => setEditData({ ...editData, is_featured: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-gray-700">Featured Product</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editData.is_available}
                    onChange={(e) => setEditData({ ...editData, is_available: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-gray-700">Available</span>
                </label>
              </div>

              <ImageUploadWithResize
                currentImageUrl={editData.image_url}
                context="product"
                onFileSelect={handleImageUpload}
                uploading={uploading}
              />

              {editData.image_url && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Live Preview</label>
                  <div className="aspect-square overflow-hidden bg-gray-100 rounded-lg border-2 border-gray-300 mb-4">
                    <img
                      src={editData.image_url}
                      alt="Preview"
                      className={`w-full h-full object-${editData.image_fit}`}
                      style={{
                        transform: `scale(${editData.zoom}) translate(${editData.position_x}%, ${editData.position_y}%)`,
                        transformOrigin: 'center center'
                      }}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image Fit</label>
                <select
                  value={editData.image_fit}
                  onChange={(e) => setEditData({ ...editData, image_fit: e.target.value as 'contain' | 'cover' | 'fill' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="contain">Contain (fit inside)</option>
                  <option value="cover">Cover (fill frame)</option>
                  <option value="fill">Fill (stretch)</option>
                </select>
              </div>

              {editData.image_url && (
                <ImagePositionControls
                  imageUrl={editData.image_url}
                  imageFit={editData.image_fit}
                  positionX={editData.position_x}
                  positionY={editData.position_y}
                  zoom={editData.zoom}
                  onPositionChange={(x, y) => setEditData({ ...editData, position_x: x, position_y: y })}
                  onZoomChange={(zoom) => setEditData({ ...editData, zoom })}
                />
              )}

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
    </>
  );
}
