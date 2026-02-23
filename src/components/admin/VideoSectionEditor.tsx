import { useState, useEffect } from 'react';
import { X, Save, Upload, Video } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface VideoSectionData {
  id: string;
  video_url: string;
  poster_url: string | null;
  title: string | null;
  subtitle: string | null;
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
  is_active: boolean;
}

interface VideoSectionEditorProps {
  onClose: () => void;
}

export default function VideoSectionEditor({ onClose }: VideoSectionEditorProps) {
  const [videoData, setVideoData] = useState<VideoSectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchVideoData();
  }, []);

  const fetchVideoData = async () => {
    try {
      const { data, error } = await supabase
        .from('video_sections')
        .select('*')
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setVideoData(data);
      } else {
        setVideoData({
          id: '',
          video_url: '',
          poster_url: null,
          title: 'EOMC',
          subtitle: 'EYES OPEN MOUTHS CLOSED',
          autoplay: true,
          loop: true,
          muted: true,
          is_active: true,
        });
      }
    } catch (err) {
      console.error('Error fetching video data:', err);
      setError('Failed to load video data');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    // Validate file type
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo'];
    if (!file.type.startsWith('video/') && !validVideoTypes.includes(file.type)) {
      setError('Please upload a valid video file (MP4, WebM, OGG, MOV, or AVI)');
      return;
    }

    // Check file size (limit to 500MB)
    const maxSize = 500 * 1024 * 1024; // 500MB in bytes
    if (file.size > maxSize) {
      setError('Video file is too large. Maximum size is 500MB. Please compress your video or use a smaller file.');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError(null);
    setSuccessMessage(null);

    try {
      // Get file extension, default to mp4 if not found
      const fileExt = file.name.split('.').pop() || 'mp4';
      const fileName = `video-${Date.now()}.${fileExt}`;
      const filePath = `videos/${fileName}`;

      console.log('Starting video upload:', { fileName, fileSize: file.size, fileType: file.type });

      // Upload with progress tracking simulation
      const uploadInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(uploadInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('site-assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      clearInterval(uploadInterval);
      setUploadProgress(100);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(uploadError.message || 'Failed to upload video');
      }

      console.log('Upload successful:', uploadData);

      const { data: { publicUrl } } = supabase.storage
        .from('site-assets')
        .getPublicUrl(filePath);

      console.log('Public URL:', publicUrl);

      setVideoData(prev => prev ? { ...prev, video_url: publicUrl } : null);
      setSuccessMessage('Video uploaded successfully! You can now preview it below.');
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      console.error('Error uploading video:', err);
      setError(err.message || 'Failed to upload video. Please check your internet connection and try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
      // Reset the file input
      e.target.value = '';
    }
  };

  const handleSave = async () => {
    if (!videoData) return;

    if (!videoData.video_url) {
      setError('Please provide a video URL or upload a video');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (videoData.id) {
        const { error } = await supabase
          .from('video_sections')
          .update({
            video_url: videoData.video_url,
            poster_url: videoData.poster_url,
            title: videoData.title,
            subtitle: videoData.subtitle,
            autoplay: videoData.autoplay,
            loop: videoData.loop,
            muted: videoData.muted,
            updated_at: new Date().toISOString(),
          })
          .eq('id', videoData.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('video_sections')
          .insert([{
            video_url: videoData.video_url,
            poster_url: videoData.poster_url,
            title: videoData.title,
            subtitle: videoData.subtitle,
            autoplay: videoData.autoplay,
            loop: videoData.loop,
            muted: videoData.muted,
            is_active: true,
          }]);

        if (error) throw error;
      }

      setSuccessMessage('Video section saved successfully');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      console.error('Error saving video section:', err);
      setError(err.message || 'Failed to save video section');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-2xl w-full my-8">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">Edit Video Section</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {successMessage}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Video URL</label>
            <input
              type="text"
              value={videoData?.video_url || ''}
              onChange={(e) => setVideoData(prev => prev ? { ...prev, video_url: e.target.value } : null)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="https://example.com/video.mp4"
            />
            <p className="text-sm text-gray-500 mt-1">Or upload a video file below</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Upload Video File</label>
            <label className={`flex items-center justify-center w-full px-4 py-8 border-2 border-dashed rounded-lg transition-all ${
              uploading ? 'border-blue-500 bg-blue-50 cursor-not-allowed' : 'border-gray-300 cursor-pointer hover:border-black hover:bg-gray-50'
            }`}>
              <div className="text-center w-full">
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <span className="text-sm font-medium text-blue-600">
                      Uploading... {uploadProgress}%
                    </span>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-3 max-w-xs mx-auto">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Please wait, this may take a moment...</p>
                  </>
                ) : (
                  <>
                    <Video className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <span className="text-sm text-gray-600 font-medium">
                      Click or tap to select video
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      MP4, WebM, MOV, or OGG (max 500MB)
                    </p>
                    <p className="text-xs text-blue-600 mt-2 font-medium">
                      Select from gallery or record new video
                    </p>
                  </>
                )}
              </div>
              <input
                type="file"
                accept="video/mp4,video/webm,video/ogg,video/quicktime,video/x-msvideo,video/*"
                capture="environment"
                onChange={handleVideoUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>

          {videoData?.video_url && (
            <div>
              <label className="block text-sm font-medium mb-2">Video Preview</label>
              <video
                src={videoData.video_url}
                controls
                className="w-full rounded-lg"
              />
              <p className="text-sm text-gray-500 mt-2">
                Preview how your video will look. The video will autoplay on the live site.
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={videoData?.title || ''}
                onChange={(e) => setVideoData(prev => prev ? { ...prev, title: e.target.value } : null)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="EOMC"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Subtitle</label>
              <input
                type="text"
                value={videoData?.subtitle || ''}
                onChange={(e) => setVideoData(prev => prev ? { ...prev, subtitle: e.target.value } : null)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="EYES OPEN MOUTHS CLOSED"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={videoData?.autoplay || false}
                onChange={(e) => setVideoData(prev => prev ? { ...prev, autoplay: e.target.checked } : null)}
                className="w-5 h-5 rounded border-gray-300"
              />
              <span className="text-sm font-medium">Autoplay</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={videoData?.loop || false}
                onChange={(e) => setVideoData(prev => prev ? { ...prev, loop: e.target.checked } : null)}
                className="w-5 h-5 rounded border-gray-300"
              />
              <span className="text-sm font-medium">Loop video</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={videoData?.muted || false}
                onChange={(e) => setVideoData(prev => prev ? { ...prev, muted: e.target.checked } : null)}
                className="w-5 h-5 rounded border-gray-300"
              />
              <span className="text-sm font-medium">Muted</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || uploading}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
