import { useState, useEffect } from 'react';
import { X, Upload, Trash2, GripVertical, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ImageUploadWithResize from '../ImageUploadWithResize';

interface GalleryImage {
  id: string;
  image_url: string;
  order: number;
  active: boolean;
}

interface GalleryEditorProps {
  onClose: () => void;
}

export default function GalleryEditor({ onClose }: GalleryEditorProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('order');

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      alert('Failed to load gallery images');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File, index: number) => {
    setUploadingIndex(index);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `gallery-${Date.now()}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('site-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('site-images')
        .getPublicUrl(filePath);

      const updatedImages = [...images];
      updatedImages[index] = {
        ...updatedImages[index],
        image_url: publicUrl
      };
      setImages(updatedImages);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleAddImage = () => {
    const newImage: GalleryImage = {
      id: `temp-${Date.now()}`,
      image_url: '',
      order: images.length,
      active: true
    };
    setImages([...images, newImage]);
  };

  const handleDeleteImage = async (index: number) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    const image = images[index];
    if (!image.id.startsWith('temp-')) {
      try {
        const { error } = await supabase
          .from('gallery_images')
          .delete()
          .eq('id', image.id);

        if (error) throw error;
      } catch (error) {
        console.error('Error deleting image:', error);
        alert('Failed to delete image');
        return;
      }
    }

    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const imageData = {
          image_url: image.image_url,
          order: i,
          active: image.active
        };

        if (image.id.startsWith('temp-')) {
          const { error } = await supabase
            .from('gallery_images')
            .insert(imageData);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('gallery_images')
            .update(imageData)
            .eq('id', image.id);
          if (error) throw error;
        }
      }

      alert('Gallery images saved successfully!');
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Error saving images:', error);
      alert('Failed to save images');
    } finally {
      setSaving(false);
    }
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= images.length) return;

    const updatedImages = [...images];
    [updatedImages[index], updatedImages[newIndex]] = [updatedImages[newIndex], updatedImages[index]];
    setImages(updatedImages);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">Edit Photo Gallery</h2>
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
            <div className="text-center py-8">Loading gallery images...</div>
          ) : (
            <div className="space-y-4">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className="border rounded-lg p-4 bg-gray-50"
                >
                  <div className="flex items-start gap-4">
                    {/* Drag Handle */}
                    <div className="flex flex-col gap-1 pt-2">
                      <button
                        onClick={() => moveImage(index, 'up')}
                        disabled={index === 0}
                        className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                        title="Move image up"
                        aria-label="Move image up"
                      >
                        <GripVertical className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveImage(index, 'down')}
                        disabled={index === images.length - 1}
                        className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                        title="Move image down"
                        aria-label="Move image down"
                      >
                        <GripVertical className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Image Preview */}
                    <div className="w-32 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {image.image_url ? (
                        <img
                          src={image.image_url}
                          alt="Gallery image"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Image Details */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`active-${index}`}
                          checked={image.active}
                          onChange={(e) => {
                            const updated = [...images];
                            updated[index].active = e.target.checked;
                            setImages(updated);
                          }}
                          className="w-4 h-4"
                        />
                        <label htmlFor={`active-${index}`} className="text-sm font-medium">
                          Active (show in gallery)
                        </label>
                      </div>

                      <div className="flex gap-2">
                        <div className="flex-1">
                          <ImageUploadWithResize
                            currentImageUrl={image.image_url}
                            context="gallery"
                            onFileSelect={(file: File) => handleImageUpload(file, index)}
                            uploading={uploadingIndex === index}
                          />
                        </div>
                        <button
                          onClick={() => handleDeleteImage(index)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 self-start"
                          title="Delete image"
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
                onClick={handleAddImage}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-black hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Upload className="w-5 h-5" />
                Add New Image
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
