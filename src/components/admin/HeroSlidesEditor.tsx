import { useState, useEffect } from 'react';
import { X, Upload, Trash2, GripVertical, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ImageUploadWithResize from '../ImageUploadWithResize';

interface HeroSlide {
  id: string;
  image_url: string;
  title?: string;
  subtitle?: string;
  order: number;
  active: boolean;
}

interface HeroSlidesEditorProps {
  onClose: () => void;
}

export default function HeroSlidesEditor({ onClose }: HeroSlidesEditorProps) {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .order('order');

      if (error) throw error;
      setSlides(data || []);
    } catch (error) {
      console.error('Error fetching slides:', error);
      alert('Failed to load hero slides');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File, index: number) => {
    setUploadingIndex(index);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `hero-${Date.now()}.${fileExt}`;
      const filePath = `hero-slides/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('site-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('site-images')
        .getPublicUrl(filePath);

      const updatedSlides = [...slides];
      updatedSlides[index] = {
        ...updatedSlides[index],
        image_url: publicUrl
      };
      setSlides(updatedSlides);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleAddSlide = () => {
    const newSlide: HeroSlide = {
      id: `temp-${Date.now()}`,
      image_url: '',
      title: '',
      subtitle: '',
      order: slides.length,
      active: true
    };
    setSlides([...slides, newSlide]);
    setEditingSlide(newSlide);
  };

  const handleDeleteSlide = async (index: number) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;

    const slide = slides[index];
    if (!slide.id.startsWith('temp-')) {
      try {
        const { error } = await supabase
          .from('hero_slides')
          .delete()
          .eq('id', slide.id);

        if (error) throw error;
      } catch (error) {
        console.error('Error deleting slide:', error);
        alert('Failed to delete slide');
        return;
      }
    }

    const updatedSlides = slides.filter((_, i) => i !== index);
    setSlides(updatedSlides);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        const slideData = {
          image_url: slide.image_url,
          title: slide.title || 'EXCLUSIVE STREETWEAR',
          subtitle: slide.subtitle || 'Limited Edition Drops',
          order: i,
          active: slide.active
        };

        if (slide.id.startsWith('temp-')) {
          const { error } = await supabase
            .from('hero_slides')
            .insert(slideData);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('hero_slides')
            .update(slideData)
            .eq('id', slide.id);
          if (error) throw error;
        }
      }

      alert('Hero slides saved successfully!');
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Error saving slides:', error);
      alert('Failed to save slides');
    } finally {
      setSaving(false);
    }
  };

  const moveSlide = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= slides.length) return;

    const updatedSlides = [...slides];
    [updatedSlides[index], updatedSlides[newIndex]] = [updatedSlides[newIndex], updatedSlides[index]];
    setSlides(updatedSlides);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">Edit Hero Slides</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-8">Loading slides...</div>
          ) : (
            <div className="space-y-4">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className="border rounded-lg p-4 bg-gray-50"
                >
                  <div className="flex items-start gap-4">
                    {/* Drag Handle */}
                    <div className="flex flex-col gap-1 pt-2">
                      <button
                        onClick={() => moveSlide(index, 'up')}
                        disabled={index === 0}
                        className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                        title="Move slide up"
                        aria-label="Move slide up"
                      >
                        <GripVertical className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveSlide(index, 'down')}
                        disabled={index === slides.length - 1}
                        className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                        title="Move slide down"
                        aria-label="Move slide down"
                      >
                        <GripVertical className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Image Preview */}
                    <div className="w-48 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {slide.image_url ? (
                        <img
                          src={slide.image_url}
                          alt={slide.title || 'Hero slide'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Slide Details */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input
                          type="text"
                          value={slide.title || ''}
                          onChange={(e) => {
                            const updated = [...slides];
                            updated[index].title = e.target.value;
                            setSlides(updated);
                          }}
                          className="w-full px-3 py-2 border rounded-lg"
                          placeholder="EXCLUSIVE STREETWEAR"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Subtitle</label>
                        <input
                          type="text"
                          value={slide.subtitle || ''}
                          onChange={(e) => {
                            const updated = [...slides];
                            updated[index].subtitle = e.target.value;
                            setSlides(updated);
                          }}
                          className="w-full px-3 py-2 border rounded-lg"
                          placeholder="Limited Edition Drops"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`active-${index}`}
                          checked={slide.active}
                          onChange={(e) => {
                            const updated = [...slides];
                            updated[index].active = e.target.checked;
                            setSlides(updated);
                          }}
                          className="w-4 h-4"
                        />
                        <label htmlFor={`active-${index}`} className="text-sm font-medium">
                          Active (show in carousel)
                        </label>
                      </div>

                      <div className="flex gap-2">
                        <div className="flex-1">
                          <ImageUploadWithResize
                            currentImageUrl={slide.image_url}
                            context="hero"
                            onFileSelect={(file: File) => handleImageUpload(file, index)}
                            uploading={uploadingIndex === index}
                          />
                        </div>
                        <button
                          onClick={() => handleDeleteSlide(index)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 self-start"
                          title="Delete slide"
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
                onClick={handleAddSlide}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-black hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Upload className="w-5 h-5" />
                Add New Slide
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
