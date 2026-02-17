import { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Edit3, Star } from 'lucide-react';
import { useEditMode } from '../context/EditModeContext';
import { useAuth } from '../context/AuthContext';
import TestimonialsEditor from './admin/TestimonialsEditor';
import { supabase } from '../lib/supabase';

interface Testimonial {
  id: string;
  customer_name: string;
  customer_photo_url?: string;
  rating: number;
  review_text: string;
  order_index: number;
  is_active: boolean;
}

export default function Testimonials() {
  const { user } = useAuth();
  const { isEditMode } = useEditMode();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_active', true)
        .order('order_index');

      if (error) throw error;

      if (data && data.length > 0) {
        setTestimonials(data);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: 'linear',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
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
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  const handleEditTestimonials = () => {
    setShowEditor(true);
  };

  if (loading) {
    return (
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="h-8 w-64 bg-gray-200 animate-pulse mx-auto rounded" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[3/4] bg-gray-200 animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <>
      {showEditor && <TestimonialsEditor onClose={() => setShowEditor(false)} />}
      <section className="py-12 sm:py-16 md:py-20 bg-white relative">
        {isEditMode && user?.isAdmin && (
          <button
            onClick={handleEditTestimonials}
            className="absolute top-4 right-4 z-20 p-3 bg-white hover:bg-gray-50 rounded-full shadow-lg transition-all hover:scale-110 border border-gray-200 group"
            title="Edit Testimonials"
          >
            <Edit3 className="w-5 h-5 text-black" />
            <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              Edit Testimonials
            </span>
          </button>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <p className="text-gray-600 text-base sm:text-lg mb-2">Happy Customers</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black">
              What they're saying
            </h2>
          </div>

          <Slider {...settings}>
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="px-2 sm:px-3">
                <div className="relative bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 p-6">
                  <div className="flex items-start gap-4 mb-4">
                    {testimonial.customer_photo_url && (
                      <img
                        src={testimonial.customer_photo_url}
                        alt={testimonial.customer_name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-lg mb-1">{testimonial.customer_name}</p>
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < testimonial.rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{testimonial.review_text}</p>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>
    </>
  );
}
