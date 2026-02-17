import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Edit3, X, Upload, Trash2, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { uploadImage, uploadVideo } from '../lib/storage';
import { Product, Category } from '../types';
import ProductCard from '../components/ProductCard';
import ImagePositionControls from '../components/ImagePositionControls';
import { useAuth } from '../context/AuthContext';
import { useEditMode } from '../context/EditModeContext';

interface HeroSlide {
  id: string;
  image_url: string;
  title: string | null;
  subtitle: string | null;
  order: number;
  active: boolean;
  image_fit: 'contain' | 'cover' | 'fill';
  position_x: number;
  position_y: number;
  zoom: number;
}

interface GalleryImage {
  id: string;
  image_url: string;
  order: number;
  active: boolean;
  image_fit: 'contain' | 'cover' | 'fill';
}

export default function Home() {
  const { user } = useAuth();
  const { isEditMode } = useEditMode();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [videoUrl, setVideoUrl] = useState('');

  const [showHeroManager, setShowHeroManager] = useState(false);
  const [showGalleryManager, setShowGalleryManager] = useState(false);
  const [showVideoEdit, setShowVideoEdit] = useState(false);
  const [showCategoryEdit, setShowCategoryEdit] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const topSellersRef = useRef<HTMLDivElement>(null);
  const testimonialRef = useRef<HTMLDivElement>(null);

  const [editCategoryData, setEditCategoryData] = useState({
    name: '',
    image_url: '',
    image_fit: 'contain' as 'contain' | 'cover' | 'fill',
    position_x: 0,
    position_y: 0,
    zoom: 1.0
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadProducts();
    loadCategories();
    loadHeroSlides();
    loadGalleryImages();
    loadVideoUrl();
  }, []);

  useEffect(() => {
    if (heroSlides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [heroSlides.length]);

  const loadProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(6);

    if (data) {
      setFeaturedProducts(data);
    }
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

  const loadHeroSlides = async () => {
    const { data } = await supabase
      .from('hero_slides')
      .select('*')
      .eq('active', true)
      .order('order');

    if (data && data.length > 0) {
      setHeroSlides(data);
    }
  };

  const loadGalleryImages = async () => {
    const { data } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('active', true)
      .order('order');

    if (data) {
      setGalleryImages(data);
    }
  };

  const loadVideoUrl = async () => {
    const { data } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'video_url')
      .maybeSingle();

    if (data) {
      setVideoUrl(data.value);
    }
  };

  const handleVideoFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadVideo(file);
      const { error } = await supabase
        .from('site_settings')
        .update({ value: url, updated_at: new Date().toISOString() })
        .eq('key', 'video_url');

      if (error) throw error;

      await loadVideoUrl();
      setShowVideoEdit(false);
      alert('Video updated successfully!');
    } catch (err: any) {
      console.error('Failed to upload video:', err);
      alert(err.message || 'Failed to upload video');
    } finally {
      setUploading(false);
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setEditCategoryData({
      name: category.name,
      image_url: category.image_url || '',
      image_fit: category.image_fit || 'contain',
      position_x: category.position_x || 0,
      position_y: category.position_y || 0,
      zoom: category.zoom || 1.0
    });
    setShowCategoryEdit(true);
  };

  const handleCategoryImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setEditCategoryData({
        ...editCategoryData,
        image_url: url,
        position_x: 0,
        position_y: 0,
        zoom: 1.0
      });
    } catch (err: any) {
      console.error('Failed to upload image:', err);
      alert(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleCategorySave = async () => {
    if (!editingCategory) return;

    setUploading(true);
    try {
      const { error } = await supabase
        .from('categories')
        .update({
          name: editCategoryData.name,
          image_url: editCategoryData.image_url,
          image_fit: editCategoryData.image_fit,
          position_x: editCategoryData.position_x,
          position_y: editCategoryData.position_y,
          zoom: editCategoryData.zoom
        })
        .eq('id', editingCategory.id);

      if (error) throw error;

      await loadCategories();
      setShowCategoryEdit(false);
      setEditingCategory(null);
      alert('Collection updated successfully!');
    } catch (err: any) {
      console.error('Failed to update category:', err);
      alert(err.message || 'Failed to update category');
    } finally {
      setUploading(false);
    }
  };

  const scrollGallery = (direction: 'left' | 'right') => {
    if (topSellersRef.current) {
      const scrollAmount = 300;
      topSellersRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollTestimonial = (direction: 'left' | 'right') => {
    if (testimonialRef.current) {
      const scrollAmount = 300;
      testimonialRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const currentHeroSlide = heroSlides[currentSlide] || {
    image_url: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=1920',
    title: 'EXCLUSIVE STREETWEAR',
    subtitle: 'Limited Edition Drops'
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="relative h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px] bg-black overflow-hidden">
        <img
          key={currentSlide}
          src={currentHeroSlide.image_url}
          alt="Hero"
          className={`w-full h-full object-${currentHeroSlide.image_fit || 'contain'} opacity-80 animate-fade-in`}
          style={{
            transform: `scale(${currentHeroSlide.zoom || 1}) translate(${currentHeroSlide.position_x || 0}%, ${currentHeroSlide.position_y || 0}%)`,
            transformOrigin: 'center center'
          }}
        />
        {isEditMode && user?.isAdmin && (
          <button
            onClick={() => setShowHeroManager(true)}
            className="absolute top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-800 transition-colors shadow-lg z-10"
            title="Manage hero slideshow"
          >
            <Edit3 className="w-5 h-5" />
          </button>
        )}
        {(currentHeroSlide.title || currentHeroSlide.subtitle) && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              {currentHeroSlide.title && (
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-3 sm:mb-4 px-4">{currentHeroSlide.title}</h1>
              )}
              {currentHeroSlide.subtitle && (
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 px-4">{currentHeroSlide.subtitle}</p>
              )}
              <Link
                to="/products"
                className="bg-white text-black px-6 py-2 sm:px-8 sm:py-3 text-sm sm:text-base rounded-full font-semibold hover:bg-gray-100 transition-colors inline-block"
              >
                Shop Now
              </Link>
            </div>
          </div>
        )}
        {heroSlides.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  idx === currentSlide ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </section>

      <section className="py-8 sm:py-12 md:py-16 bg-white relative">
        {isEditMode && user?.isAdmin && (
          <button
            onClick={() => setShowGalleryManager(true)}
            className="absolute top-2 right-2 bg-black text-white p-2 rounded-full hover:bg-gray-800 transition-colors shadow-lg z-10"
            title="Manage gallery"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <button
              onClick={() => scrollGallery('left')}
              className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-base sm:text-lg md:text-xl font-bold uppercase tracking-wide text-center flex-1">Top Sellers</h2>
            <button
              onClick={() => scrollGallery('right')}
              className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div ref={topSellersRef} className="flex overflow-x-auto gap-2 sm:gap-3 pb-3 sm:pb-4 scrollbar-hide snap-x snap-mandatory">
            {galleryImages.map((img) => (
              <div key={img.id} className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden snap-start">
                <img src={img.image_url} alt="Top Seller" className={`w-full h-full object-${img.image_fit || 'cover'}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-base sm:text-lg md:text-xl font-bold mb-6 sm:mb-8 uppercase tracking-wide text-center">New Arrivals</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} onUpdate={loadProducts} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black text-white">
        <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8 uppercase tracking-wider text-center">Collections</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {categories.map(category => (
              <div key={category.id} className="relative group">
                <Link
                  to={`/products?category=${category.slug}`}
                  className="block relative aspect-square rounded-3xl overflow-hidden"
                >
                  <img
                    src={category.image_url || 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=600'}
                    alt={category.name}
                    className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300`}
                    style={{
                      transform: `scale(${category.zoom || 1}) translate(${category.position_x || 0}%, ${category.position_y || 0}%)`,
                      transformOrigin: 'center center'
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-3xl">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold uppercase text-center px-3">{category.name}</h3>
                  </div>
                </Link>
                {isEditMode && user?.isAdmin && (
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="absolute top-2 right-2 bg-black text-white p-2 rounded-full hover:bg-gray-800 transition-colors shadow-lg z-10"
                    title="Edit collection"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black">
        <div className="relative h-[600px] sm:h-[700px] md:h-[800px] lg:h-[900px] overflow-hidden">
          {videoUrl && (
            <video
              key={videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-90"
            >
              <source src={videoUrl} type="video/mp4" />
            </video>
          )}
          {isEditMode && user?.isAdmin && (
            <button
              onClick={() => setShowVideoEdit(true)}
              className="absolute top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-800 transition-colors shadow-lg z-10"
              title="Edit video"
            >
              <Edit3 className="w-5 h-5" />
            </button>
          )}
        </div>
      </section>

      <section className="py-8 sm:py-12 md:py-16 bg-white relative">
        {isEditMode && user?.isAdmin && (
          <button
            onClick={() => setShowGalleryManager(true)}
            className="absolute top-2 right-2 bg-black text-white p-2 rounded-full hover:bg-gray-800 transition-colors shadow-lg z-10"
            title="Manage testimonials"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <button
              onClick={() => scrollTestimonial('left')}
              className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 text-center flex-1">What they're saying</h2>
            <button
              onClick={() => scrollTestimonial('right')}
              className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div ref={testimonialRef} className="flex overflow-x-auto gap-2 sm:gap-3 pb-3 sm:pb-4 scrollbar-hide snap-x snap-mandatory mb-6">
            {featuredProducts.slice(0, 4).map(product => (
              <Link key={product.id} to={`/product/${product.slug}`} className="block flex-shrink-0 w-2/3 sm:w-1/2 md:w-1/3 lg:w-1/4">
                <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className={`w-full h-full object-${product.image_fit || 'cover'}`}
                    style={{
                      transform: `scale(${product.zoom || 1}) translate(${product.position_x || 0}%, ${product.position_y || 0}%)`,
                      transformOrigin: 'center center'
                    }}
                  />
                </div>
              </Link>
            ))}
          </div>
          <div className="flex justify-center">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors text-sm sm:text-base">
              Message Us
            </button>
          </div>
        </div>
      </section>

      <HeroManager
        show={showHeroManager}
        onClose={() => setShowHeroManager(false)}
        onUpdate={loadHeroSlides}
      />

      <GalleryManager
        show={showGalleryManager}
        onClose={() => setShowGalleryManager(false)}
        onUpdate={loadGalleryImages}
      />

      {showVideoEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Edit Video</h3>
              <button onClick={() => setShowVideoEdit(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Video (MP4)</label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Click to upload video</span>
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleVideoFileUpload(file);
                    }}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                {uploading && <p className="text-sm text-gray-600 mt-2">Uploading...</p>}
              </div>
              <button onClick={() => setShowVideoEdit(false)} className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showCategoryEdit && editingCategory && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
          onClick={() => setShowCategoryEdit(false)}
        >
          <div
            className="bg-white rounded-lg max-w-md w-full p-6 my-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Edit Collection</h3>
              <button onClick={() => setShowCategoryEdit(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={editCategoryData.name}
                  onChange={(e) => setEditCategoryData({ ...editCategoryData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Collection Image</label>
                {editCategoryData.image_url && (
                  <div className="mb-2 p-2 bg-gray-50 rounded border border-gray-200">
                    <img
                      src={editCategoryData.image_url}
                      alt="Current"
                      className="w-full h-32 object-contain rounded"
                    />
                  </div>
                )}
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    {uploading ? 'Uploading...' : editCategoryData.image_url ? 'Change Image' : 'Click to upload image'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleCategoryImageUpload(file);
                      e.target.value = '';
                    }}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image Fit</label>
                <select
                  value={editCategoryData.image_fit}
                  onChange={(e) => setEditCategoryData({ ...editCategoryData, image_fit: e.target.value as 'contain' | 'cover' | 'fill' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="contain">Contain (fit inside)</option>
                  <option value="cover">Cover (fill frame)</option>
                  <option value="fill">Fill (stretch)</option>
                </select>
              </div>

              {editCategoryData.image_url && (
                <ImagePositionControls
                  imageUrl={editCategoryData.image_url}
                  imageFit={editCategoryData.image_fit}
                  positionX={editCategoryData.position_x}
                  positionY={editCategoryData.position_y}
                  zoom={editCategoryData.zoom}
                  onPositionChange={(x, y) => setEditCategoryData({ ...editCategoryData, position_x: x, position_y: y })}
                  onZoomChange={(zoom) => setEditCategoryData({ ...editCategoryData, zoom })}
                />
              )}

              <div className="flex gap-3">
                <button onClick={() => setShowCategoryEdit(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button
                  onClick={handleCategorySave}
                  disabled={uploading}
                  className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                  {uploading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function HeroManager({ show, onClose, onUpdate }: { show: boolean; onClose: () => void; onUpdate: () => void }) {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [formData, setFormData] = useState({
    image_url: '',
    title: '',
    subtitle: '',
    image_fit: 'contain' as 'contain' | 'cover' | 'fill',
    position_x: 0,
    position_y: 0,
    zoom: 1.0
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (show) loadSlides();
  }, [show]);

  const loadSlides = async () => {
    const { data } = await supabase
      .from('hero_slides')
      .select('*')
      .order('order');
    if (data) setSlides(data);
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setFormData({
        ...formData,
        image_url: url,
        position_x: 0,
        position_y: 0,
        zoom: 1.0
      });
    } catch (err: any) {
      console.error('Failed to upload image:', err);
      alert(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image_url) {
      alert('Please upload an image');
      return;
    }

    setUploading(true);
    try {
      if (editingSlide) {
        const { error } = await supabase
          .from('hero_slides')
          .update(formData)
          .eq('id', editingSlide.id);

        if (error) throw error;
      } else {
        const maxOrder = Math.max(...slides.map(s => s.order), 0);
        const { error } = await supabase
          .from('hero_slides')
          .insert({ ...formData, order: maxOrder + 1, active: true });

        if (error) throw error;
      }

      await loadSlides();
      onUpdate();
      setEditingSlide(null);
      setFormData({ image_url: '', title: '', subtitle: '', image_fit: 'contain', position_x: 0, position_y: 0, zoom: 1.0 });
      alert(editingSlide ? 'Slide updated successfully!' : 'Slide added successfully!');
    } catch (err: any) {
      console.error('Failed to save slide:', err);
      alert(err.message || 'Failed to save slide');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this slide?')) return;

    try {
      const { error } = await supabase.from('hero_slides').delete().eq('id', id);
      if (error) throw error;

      await loadSlides();
      onUpdate();
      alert('Slide deleted successfully!');
    } catch (err: any) {
      console.error('Failed to delete slide:', err);
      alert(err.message || 'Failed to delete slide');
    }
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Manage Hero Slideshow</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold">{editingSlide ? 'Edit Slide' : 'Add New Slide'}</h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
              {formData.image_url ? (
                <img src={formData.image_url} alt="Preview" className="w-full h-full object-contain rounded-lg" />
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Click to upload image</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                  e.target.value = '';
                }}
                className="hidden"
                disabled={uploading}
              />
            </label>
            {uploading && <p className="text-sm text-gray-600 mt-2">Uploading...</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image Fit</label>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title (optional)</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Leave empty for no text overlay"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle (optional)</label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Leave empty for no subtitle"
            />
          </div>

          {formData.image_url && (
            <div className="border-t pt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image Position</label>
                <div className="flex items-center justify-center gap-2">
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, position_y: Math.max(-50, formData.position_y - 5) })}
                      className="p-2 border border-gray-300 rounded hover:bg-gray-50"
                      title="Move Up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, position_x: Math.max(-50, formData.position_x - 5) })}
                        className="p-2 border border-gray-300 rounded hover:bg-gray-50"
                        title="Move Left"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, position_x: 0, position_y: 0 })}
                        className="p-2 border border-gray-300 rounded hover:bg-gray-50 text-xs"
                        title="Reset Position"
                      >
                        Reset
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, position_x: Math.min(50, formData.position_x + 5) })}
                        className="p-2 border border-gray-300 rounded hover:bg-gray-50"
                        title="Move Right"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, position_y: Math.min(50, formData.position_y + 5) })}
                      className="p-2 border border-gray-300 rounded hover:bg-gray-50"
                      title="Move Down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 text-center mt-2">X: {formData.position_x}% Y: {formData.position_y}%</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Zoom</label>
                <div className="flex items-center gap-3 justify-center">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, zoom: Math.max(0.5, formData.zoom - 0.1) })}
                    className="p-2 border border-gray-300 rounded hover:bg-gray-50"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-5 h-5" />
                  </button>
                  <span className="text-sm font-medium w-16 text-center">{formData.zoom.toFixed(1)}x</span>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, zoom: Math.min(3.0, formData.zoom + 0.1) })}
                    className="p-2 border border-gray-300 rounded hover:bg-gray-50"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-2">
                  <input
                    type="range"
                    min="0.5"
                    max="3.0"
                    step="0.1"
                    value={formData.zoom}
                    onChange={(e) => setFormData({ ...formData, zoom: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="bg-gray-100 rounded-lg p-3 h-48 relative overflow-hidden">
                <img
                  src={formData.image_url}
                  alt="Preview"
                  className={`w-full h-full object-${formData.image_fit}`}
                  style={{
                    transform: `scale(${formData.zoom}) translate(${formData.position_x}%, ${formData.position_y}%)`,
                    transformOrigin: 'center center'
                  }}
                />
              </div>
            </div>
          )}

          <div className="flex gap-3">
            {editingSlide && (
              <button type="button" onClick={() => { setEditingSlide(null); setFormData({ image_url: '', title: '', subtitle: '', image_fit: 'contain', position_x: 0, position_y: 0, zoom: 1.0 }); }} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
            )}
            <button type="submit" disabled={uploading} className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50">
              {uploading ? 'Saving...' : editingSlide ? 'Update' : 'Add'}
            </button>
          </div>
        </form>

        <div className="space-y-2">
          <h4 className="font-semibold mb-2">Current Slides</h4>
          {slides.map((slide) => (
            <div key={slide.id} className="flex items-center gap-3 p-3 border rounded-lg">
              <img src={slide.image_url} alt={slide.title || 'Slide'} className={`w-20 h-12 object-${slide.image_fit || 'contain'} rounded`} />
              <div className="flex-1">
                <p className="font-medium">{slide.title || '(No title)'}</p>
                <p className="text-sm text-gray-600">{slide.subtitle || '(No subtitle)'}</p>
                <p className="text-xs text-gray-500 mt-1">Fit: {slide.image_fit || 'contain'} | Zoom: {slide.zoom || 1}x | Pos: {slide.position_x || 0}%, {slide.position_y || 0}%</p>
              </div>
              <button onClick={() => { setEditingSlide(slide); setFormData({ image_url: slide.image_url, title: slide.title || '', subtitle: slide.subtitle || '', image_fit: slide.image_fit || 'contain', position_x: slide.position_x || 0, position_y: slide.position_y || 0, zoom: slide.zoom || 1.0 }); }} className="p-2 hover:bg-gray-100 rounded">
                <Edit3 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(slide.id)} className="p-2 hover:bg-red-100 rounded text-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GalleryManager({ show, onClose, onUpdate }: { show: boolean; onClose: () => void; onUpdate: () => void }) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [imageFit, setImageFit] = useState<'contain' | 'cover' | 'fill'>('contain');
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    if (show) loadImages();
  }, [show]);

  const loadImages = async () => {
    const { data } = await supabase
      .from('gallery_images')
      .select('*')
      .order('order');
    if (data) setImages(data);
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadImage(file);
      const maxOrder = Math.max(...images.map(img => img.order), 0);
      const { error } = await supabase
        .from('gallery_images')
        .insert({ image_url: url, order: maxOrder + 1, active: true, image_fit: imageFit });

      if (error) throw error;

      await loadImages();
      onUpdate();
      setImageFit('contain');
      alert('Image added successfully!');
    } catch (err: any) {
      console.error('Failed to add image:', err);
      alert(err.message || 'Failed to add image');
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateImageFit = async (id: string, newFit: 'contain' | 'cover' | 'fill') => {
    try {
      const { error } = await supabase
        .from('gallery_images')
        .update({ image_fit: newFit })
        .eq('id', id);

      if (error) throw error;

      await loadImages();
      onUpdate();
    } catch (err: any) {
      console.error('Failed to update image fit:', err);
      alert(err.message || 'Failed to update image fit');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this image?')) return;

    try {
      const { error } = await supabase.from('gallery_images').delete().eq('id', id);
      if (error) throw error;

      await loadImages();
      onUpdate();
      alert('Image deleted successfully!');
    } catch (err: any) {
      console.error('Failed to delete image:', err);
      alert(err.message || 'Failed to delete image');
    }
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Manage Gallery</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold">Add New Image</h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image Fit</label>
            <select
              value={imageFit}
              onChange={(e) => setImageFit(e.target.value as 'contain' | 'cover' | 'fill')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent mb-3"
            >
              <option value="contain">Contain (fit inside)</option>
              <option value="cover">Cover (fill frame)</option>
              <option value="fill">Fill (stretch)</option>
            </select>
          </div>
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-600">Click to upload image</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file);
              }}
              className="hidden"
              disabled={uploading}
            />
          </label>
          {uploading && <p className="text-sm text-gray-600">Uploading...</p>}
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold mb-2">Current Images</h4>
          <div className="grid grid-cols-2 gap-3">
            {images.map((img) => (
              <div key={img.id} className="border rounded-lg p-2">
                <div className="relative group mb-2">
                  <img src={img.image_url} alt="Gallery" className={`w-full aspect-square object-${img.image_fit || 'contain'} rounded-lg bg-gray-100`} />
                  <button onClick={() => handleDelete(img.id)} className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <select
                  value={img.image_fit || 'contain'}
                  onChange={(e) => handleUpdateImageFit(img.id, e.target.value as 'contain' | 'cover' | 'fill')}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="contain">Contain</option>
                  <option value="cover">Cover</option>
                  <option value="fill">Fill</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}