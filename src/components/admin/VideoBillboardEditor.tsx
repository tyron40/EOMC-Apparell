import { useState, useEffect } from 'react';
import { X, Video } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ImageUploadWithResize from '../ImageUploadWithResize';

interface VideoBillboardData {
  id: string;
  video_url?: string;
  poster_image_url?: string;
  title?: string;
  subtitle?: string;
  button_text?: string;
  button_link?: string;
  is_active: boolean;
}

interface VideoBillboardEditorProps {
  onClose: () => void;
}

export default function VideoBillboardEditor({ onClose }: VideoBillboardEditorProps) {
  const [billboard, setBillboard] = useState<VideoBillboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  useEffect(() => {
    fetchBillboard();
  }, []);

  const fetchBillboard = async () => {
    try {
      const { data, error } = await supabase
        .from('video_billboard')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setBillboard(data);
      } else {
        // Create default if doesn't exist
        setBillboard({
          id: 'default',
          video_url: '',
          poster_image_url: '',
          title: 'EYES OPEN MOUTHS CLOSED',
          subtitle: 'Premium Streetwear Collection',
          button_text: 'Shop Now',
          button_link: '/products',
          is_active: true
        });
      }
    } catch (error) {
      console.error('Error fetching billboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `billboard-bg-${Date.now()}.${fileExt}`;
      const filePath = `billboard/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('site-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('site-images')
        .getPublicUrl(filePath);

      setBillboard(prev => prev ? { ...prev, poster_image_url: publicUrl } : null);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVideo(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `billboard-video-${Date.now()}.${fileExt}`;
      const filePath = `billboard/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('site-videos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('site-videos')
        .getPublicUrl(filePath);

      setBillboard(prev => prev ? { ...prev, video_url: publicUrl } : null);
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Failed to upload video');
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleSave = async () => {
    if (!billboard) return;

    setSaving(true);
    try {
      const billboardData = {
        video_url: billboard.video_url || null,
        poster_image_url: billboard.poster_image_url || null,
        title: billboard.title || 'EYES OPEN MOUTHS CLOSED',
        subtitle: billboard.subtitle || 'Premium Streetwear Collection',
        button_text: billboard.button_text || null,
        button_link: billboard.button_link || null,
        is_active: billboard.is_active,
        updated_at: new Date().toISOString()
      };

      if (billboard.id === 'default') {
        const { error } = await supabase
          .from('video_billboard')
          .insert(billboardData);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('video_billboard')
          .update(billboardData)
          .eq('id', billboard.id);
        if (error) throw error;
      }

      alert('Billboard saved successfully!');
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Error saving billboard:', error);
      alert('Failed to save billboard');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <p>Loading billboard data...</p>
        </div>
      </div>
    );
  }

  if (!billboard) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">Edit Video Billboard</h2>
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
          <div className="space-y-6">
            {/* Background/Poster Image */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Poster Image</h3>
              <div className="space-y-4">
                {billboard.poster_image_url && (
                  <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={billboard.poster_image_url}
                      alt="Billboard poster"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <ImageUploadWithResize
                  currentImageUrl={billboard.poster_image_url || ''}
                  context="hero"
                  onFileSelect={(file: File) => handleImageUpload(file)}
                  uploading={uploadingImage}
                />
              </div>
            </div>

            {/* Video Upload (Optional) */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Video (Optional)</h3>
              <div className="space-y-4">
                {billboard.video_url && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      <Video className="w-4 h-4 inline mr-2" />
                      Video uploaded successfully
                    </p>
                    <p className="text-xs text-green-600 mt-1 break-all">{billboard.video_url}</p>
                  </div>
                )}

                <label className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <Video className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {uploadingVideo ? 'Uploading video...' : billboard.video_url ? 'Change Video' : 'Upload Video'}
                  </span>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                    disabled={uploadingVideo}
                  />
                </label>
                <p className="text-xs text-gray-500">
                  Upload a video file (MP4, WebM, etc.). This will play when users click the play button.
                </p>
              </div>
            </div>

            {/* Text Content */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Text Content</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    value={billboard.title || ''}
                    onChange={(e) => setBillboard(prev => prev ? { ...prev, title: e.target.value } : null)}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="EYES OPEN MOUTHS CLOSED"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={billboard.subtitle || ''}
                    onChange={(e) => setBillboard(prev => prev ? { ...prev, subtitle: e.target.value } : null)}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Premium Streetwear Collection"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Button Text (Optional)</label>
                  <input
                    type="text"
                    value={billboard.button_text || ''}
                    onChange={(e) => setBillboard(prev => prev ? { ...prev, button_text: e.target.value } : null)}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Shop Now"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Button Link (Optional)</label>
                  <input
                    type="text"
                    value={billboard.button_link || ''}
                    onChange={(e) => setBillboard(prev => prev ? { ...prev, button_link: e.target.value } : null)}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="/products"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={billboard.is_active}
                    onChange={(e) => setBillboard(prev => prev ? { ...prev, is_active: e.target.checked } : null)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium">
                    Active (show on homepage)
                  </label>
                </div>
              </div>
            </div>

            {/* Preview */}
            {billboard.poster_image_url && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Preview</h3>
                <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-gray-200">
                  <img
                    src={billboard.poster_image_url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-16 h-16 mx-auto mb-3 bg-red-600 rounded-full flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-8 h-8 text-white fill-current">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                        </svg>
                      </div>
                      <h2 className="text-3xl font-bold mb-1">{billboard.title}</h2>
                      <p className="text-sm tracking-widest">{billboard.subtitle}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
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
