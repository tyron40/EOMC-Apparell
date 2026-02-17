import { Edit3 } from 'lucide-react';
import { useEditMode } from '../context/EditModeContext';
import { useAuth } from '../context/AuthContext';

export default function VideoSection() {
  const { user } = useAuth();
  const { isEditMode } = useEditMode();

  const handleEditVideo = () => {
    alert('Video Section editing will be implemented. You can:\n- Change video URL\n- Edit overlay text\n- Adjust video settings (autoplay, loop, etc.)\n- Change poster image');
  };

  return (
    <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden bg-black">
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
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover"
        poster="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&h=1080&fit=crop"
      >
        <source src="https://assets.mixkit.co/videos/preview/mixkit-clothing-store-interior-27611-large.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Overlay with EOMC branding */}
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 tracking-wider">EOMC</h2>
          <p className="text-lg md:text-xl tracking-widest">EYES OPEN MOUTHS CLOSED</p>
        </div>
      </div>
    </section>
  );
}
