import { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ChevronLeft, ChevronRight, Edit3 } from 'lucide-react';
import { useEditMode } from '../context/EditModeContext';
import { useAuth } from '../context/AuthContext';
import HeroSlidesEditor from './admin/HeroSlidesEditor';
import { supabase } from '../lib/supabase';

interface HeroImage {
  id: string;
  image_url: string;
  title?: string;
  subtitle?: string;
  order: number;
  active: boolean;
}

function NextArrow(props: any) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
      aria-label="Next slide"
    >
      <ChevronRight className="w-6 h-6 text-black" />
    </button>
  );
}

function PrevArrow(props: any) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
      aria-label="Previous slide"
    >
      <ChevronLeft className="w-6 h-6 text-black" />
    </button>
  );
}

export default function HeroCarousel() {
  const { user } = useAuth();
  const { isEditMode } = useEditMode();
  const [images, setImages] = useState<HeroImage[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_slides')
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
            image_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1920&h=1080&fit=crop',
            title: 'EXCLUSIVE STREETWEAR',
            subtitle: 'Limited Edition Drops',
            order: 1,
            active: true
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching hero slides:', error);
      // Use fallback images on error
      setImages([
        {
          id: '1',
          image_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1920&h=1080&fit=crop',
          title: 'EXCLUSIVE STREETWEAR',
          subtitle: 'Limited Edition Drops',
          order: 1,
          active: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    cssEase: 'cubic-bezier(0.4, 0, 0.2, 1)',
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    pauseOnHover: true,
    swipe: true,
    touchThreshold: 10,
    dotsClass: 'slick-dots !bottom-8',
  };

  if (loading || images.length === 0) {
    return (
      <div className="w-full h-[600px] bg-gray-200 animate-pulse" />
    );
  }

  const handleEditHero = () => {
    setShowEditor(true);
  };

  return (
    <>
      {showEditor && <HeroSlidesEditor onClose={() => setShowEditor(false)} />}
      <div className="relative w-full hero-carousel">
        {isEditMode && user?.isAdmin && (
        <button
          onClick={handleEditHero}
          className="absolute top-4 right-4 z-30 p-3 bg-white/95 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110 group"
          title="Edit Hero Images"
        >
          <Edit3 className="w-5 h-5 text-black" />
          <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Edit Hero Carousel
          </span>
        </button>
      )}
      <style>{`
        .hero-carousel .slick-dots li button:before {
          font-size: 12px;
          color: white;
          opacity: 0.5;
        }
        .hero-carousel .slick-dots li.slick-active button:before {
          opacity: 1;
          color: white;
        }
        .hero-carousel .slick-slide > div {
          height: 600px;
        }
      `}</style>
      <Slider {...settings}>
        {images.map((image) => (
          <div key={image.id} className="relative">
            <div className="w-full h-[600px] relative overflow-hidden">
              <img
                src={image.image_url}
                alt={image.title || 'Hero slide'}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30" />
              {(image.title || image.subtitle) && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white px-4">
                    {image.title && (
                      <h2 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                        {image.title}
                      </h2>
                    )}
                    {image.subtitle && (
                      <p className="text-xl md:text-2xl drop-shadow-lg">
                        {image.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </Slider>
      </div>
    </>
  );
}
