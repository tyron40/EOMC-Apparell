import { useState, useEffect } from 'react';
import { X, Upload, Trash2, GripVertical, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ImageUploadWithResize from '../ImageUploadWithResize';

interface Testimonial {
  id: string;
  customer_name: string;
  customer_photo_url?: string;
  rating: number;
  review_text: string;
  order_index: number;
  is_active: boolean;
}

interface TestimonialsEditorProps {
  onClose: () => void;
}

export default function TestimonialsEditor({ onClose }: TestimonialsEditorProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('order_index');

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      alert('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File, index: number) => {
    setUploadingIndex(index);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `testimonial-${Date.now()}.${fileExt}`;
      const filePath = `testimonials/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('site-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('site-images')
        .getPublicUrl(filePath);

      const updatedTestimonials = [...testimonials];
      updatedTestimonials[index] = {
        ...updatedTestimonials[index],
        customer_photo_url: publicUrl
      };
      setTestimonials(updatedTestimonials);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleAddTestimonial = () => {
    const newTestimonial: Testimonial = {
      id: `temp-${Date.now()}`,
      customer_name: '',
      customer_photo_url: '',
      rating: 5,
      review_text: '',
      order_index: testimonials.length,
      is_active: true
    };
    setTestimonials([...testimonials, newTestimonial]);
  };

  const handleDeleteTestimonial = async (index: number) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    const testimonial = testimonials[index];
    if (!testimonial.id.startsWith('temp-')) {
      try {
        const { error } = await supabase
          .from('testimonials')
          .delete()
          .eq('id', testimonial.id);

        if (error) throw error;
      } catch (error) {
        console.error('Error deleting testimonial:', error);
        alert('Failed to delete testimonial');
        return;
      }
    }

    const updatedTestimonials = testimonials.filter((_, i) => i !== index);
    setTestimonials(updatedTestimonials);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (let i = 0; i < testimonials.length; i++) {
        const testimonial = testimonials[i];
        const testimonialData = {
          customer_name: testimonial.customer_name,
          customer_photo_url: testimonial.customer_photo_url || null,
          rating: testimonial.rating,
          review_text: testimonial.review_text,
          order_index: i,
          is_active: testimonial.is_active
        };

        if (testimonial.id.startsWith('temp-')) {
          const { error } = await supabase
            .from('testimonials')
            .insert(testimonialData);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('testimonials')
            .update(testimonialData)
            .eq('id', testimonial.id);
          if (error) throw error;
        }
      }

      alert('Testimonials saved successfully!');
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Error saving testimonials:', error);
      alert('Failed to save testimonials');
    } finally {
      setSaving(false);
    }
  };

  const moveTestimonial = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= testimonials.length) return;

    const updatedTestimonials = [...testimonials];
    [updatedTestimonials[index], updatedTestimonials[newIndex]] = [updatedTestimonials[newIndex], updatedTestimonials[index]];
    setTestimonials(updatedTestimonials);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">Edit Testimonials</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-8">Loading testimonials...</div>
          ) : (
            <div className="space-y-4">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className="border rounded-lg p-4 bg-gray-50"
                >
                  <div className="flex items-start gap-4">
                    {/* Drag Handle */}
                    <div className="flex flex-col gap-1 pt-2">
                      <button
                        onClick={() => moveTestimonial(index, 'up')}
                        disabled={index === 0}
                        className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                        title="Move testimonial up"
                        aria-label="Move testimonial up"
                      >
                        <GripVertical className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveTestimonial(index, 'down')}
                        disabled={index === testimonials.length - 1}
                        className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                        title="Move testimonial down"
                        aria-label="Move testimonial down"
                      >
                        <GripVertical className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Image Preview */}
                    <div className="w-32 h-40 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {testimonial.customer_photo_url ? (
                        <img
                          src={testimonial.customer_photo_url}
                          alt={testimonial.customer_name || 'Testimonial'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Testimonial Details */}
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">Customer Name</label>
                          <input
                            type="text"
                            value={testimonial.customer_name || ''}
                            onChange={(e) => {
                              const updated = [...testimonials];
                              updated[index].customer_name = e.target.value;
                              setTestimonials(updated);
                            }}
                            className="w-full px-3 py-2 border rounded-lg"
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Rating (1-5)</label>
                          <input
                            type="number"
                            min="1"
                            max="5"
                            value={testimonial.rating}
                            onChange={(e) => {
                              const updated = [...testimonials];
                              updated[index].rating = Math.min(5, Math.max(1, parseInt(e.target.value) || 5));
                              setTestimonials(updated);
                            }}
                            className="w-full px-3 py-2 border rounded-lg"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Review Text</label>
                        <textarea
                          value={testimonial.review_text || ''}
                          onChange={(e) => {
                            const updated = [...testimonials];
                            updated[index].review_text = e.target.value;
                            setTestimonials(updated);
                          }}
                          className="w-full px-3 py-2 border rounded-lg"
                          placeholder="Customer review..."
                          rows={3}
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`active-${index}`}
                          checked={testimonial.is_active}
                          onChange={(e) => {
                            const updated = [...testimonials];
                            updated[index].is_active = e.target.checked;
                            setTestimonials(updated);
                          }}
                          className="w-4 h-4"
                        />
                        <label htmlFor={`active-${index}`} className="text-sm font-medium">
                          Active (show on homepage)
                        </label>
                      </div>

                      <div className="flex gap-2">
                        <div className="flex-1">
                          <ImageUploadWithResize
                            currentImageUrl={testimonial.customer_photo_url || ''}
                            context="gallery"
                            onFileSelect={(file: File) => handleImageUpload(file, index)}
                            uploading={uploadingIndex === index}
                          />
                        </div>
                        <button
                          onClick={() => handleDeleteTestimonial(index)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 self-start"
                          title="Delete testimonial"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={handleAddTestimonial}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-black hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Upload className="w-5 h-5" />
                Add New Testimonial
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
