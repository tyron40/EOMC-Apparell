import { useState, useEffect } from 'react';
import { Edit3 } from 'lucide-react';
import { useEditMode } from '../context/EditModeContext';
import { useAuth } from '../context/AuthContext';
import VideoSectionEditor from './admin/VideoSectionEditor';
import { supabase } from '../lib/supabase';

interface VideoSectionData {
  id: string;
  video_url: string;
  poster_url: string | null;
  title: string | null;
  subtitle: string | null;
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
}

export default function VideoSection() {
  const { user } = useAuth();
  const { isEditMode } = useEditMode();
  const [showEditor, setShowEditor] = useState(false);
  const [videoData, setVideoData] = useState<VideoSectionData | null>(null);
  const [loading, setLoading] = useState(true);

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
          video_url: 'https://assets.mixkit.co/videos/preview/mixkit-clothing-store-interior-27611-large.mp4',
          poster_url: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&h=1080&fit=crop',
          title: 'EOMC',
          subtitle: 'EYES OPEN MOUTHS CLOSED',
          autoplay: true,
          loop: true,
          muted: true,
        });
      }
    } catch (err) {
      console.error('Error fetching video data:', err);
      setVideoData({
        id: '',
        video_url: 'https://assets.mixkit.co/videos/preview/mixkit-clothing-store-interior-27611-large.mp4',
        poster_url: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&h=1080&fit=crop',
        title: 'EOMC',
        subtitle: 'EYES OPEN MOUTHS CLOSED',
        autoplay: true,
        loop: true,
        muted: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditVideo = () => {
    setShowEditor(true);
  };

  if (loading || !videoData) {
    return (
      <section className="relative w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px] xl:h-[900px] overflow-hidden bg-gray-200 animate-pulse" />
    );
  }

  return (
    <>
      {showEditor && <VideoSectionEditor onClose={() => setShowEditor(false)} />}
      <section className="relative w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px] xl:h-[900px] overflow-hidden bg-black">
        {isEditMode && user?.isAdmin && (
          <button
            onClick={handleEditVideo}
            className="absolute top-4 right-4 z-30 p-3 bg-white/95 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110 group"
            title="Edit Video Section"
          >
            <Edit3 className="w-5 h-5 text-black" />
            <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              Edit Video
            </span>
          </button>
        )}
        {/* Video Background */}
        <video
          autoPlay={videoData.autoplay}
          muted={videoData.muted}
          loop={videoData.loop}
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={videoData.video_url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Overlay with text */}
        {(videoData.title || videoData.subtitle) && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="text-center text-white px-4">
              {videoData.title && (
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 tracking-wider">
                  {videoData.title}
                </h2>
              )}
              {videoData.subtitle && (
                <p className="text-sm sm:text-base md:text-lg lg:text-xl tracking-widest">
                  {videoData.subtitle}
                </p>
              )}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
