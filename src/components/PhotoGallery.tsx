import { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Edit3 } from 'lucide-react';
import { useEditMode } from '../context/EditModeContext';
import { useAuth } from '../context/AuthContext';
import GalleryEditor from './admin/GalleryEditor';
import { supabase } from '../lib/supabase';

interface GalleryImage {
  id: string;
  image_url: string;
  order: number;
  active: boolean;
}

export default function PhotoGallery() {
  const { user } = useAuth();
  const { isEditMode } = useEditMode();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('active', true)
        .order('order');

      if (error) throw error;

      if (data && data.length > 0) {
        setImages(data);
      } else {
        // Fallback to default images if none in database
        setImages([
          {
            id: '1',
            image_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400&h=400&fit=crop',
            order: 1,
            active: true
          },
          {
            id: '2',
            image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop',
            order: 2,
            active: true
          },
          {
            id: '3',
            image_url: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=400&fit=crop',
            order: 3,
            active: true
          },
          {
            id: '4',
            image_url: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=400&h=400&fit=crop',
            order: 4,
            active: true
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      // Use fallback images on error
      setImages([
        {
          id: '1',
          image_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400&h=400&fit=crop',
          order: 1,
          active: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: 'linear',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: '20px',
        }
      }
    ]
  };

  const handleEditGallery = () => {
    setShowEditor(true);
  };

  if (loading) {
    return (
      <section className="py-6 sm:py-8 md:py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (images.length === 0) {
    return null;
  }

  return (
    <>
      {showEditor && <GalleryEditor onClose={() => setShowEditor(false)} />}
      <section className="py-8 sm:py-10 md:py-12 bg-white relative">
        {isEditMode && user?.isAdmin && (
          <button
            onClick={handleEditGallery}
            className="absolute top-4 right-4 z-20 p-3 bg-white hover:bg-gray-50 rounded-full shadow-lg transition-all hover:scale-110 border border-gray-200 group"
            title="Edit Photo Gallery"
          >
            <Edit3 className="w-5 h-5 text-black" />
            <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              Edit Gallery
            </span>
          </button>
        )}
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <Slider {...settings}>
            {images.map((image) => (
              <div key={image.id} className="px-1 sm:px-2">
                <div className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer">
                  <img
                    src={image.image_url}
                    alt="Gallery image"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>
    </>
  );
}
