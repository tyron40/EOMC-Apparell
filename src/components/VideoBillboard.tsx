import { useState } from 'react';
import { Edit3 } from 'lucide-react';
import { useEditMode } from '../context/EditModeContext';
import { useAuth } from '../context/AuthContext';
import VideoBillboardEditor from './admin/VideoBillboardEditor';

export default function VideoBillboard() {
  const { user } = useAuth();
  const { isEditMode } = useEditMode();
  const [showEditor, setShowEditor] = useState(false);

  const handleEditBillboard = () => {
    setShowEditor(true);
  };

  return (
    <>
      {showEditor && <VideoBillboardEditor onClose={() => setShowEditor(false)} />}
      <section className="relative w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px] xl:h-[900px] overflow-hidden">
        {isEditMode && user?.isAdmin && (
          <button
            onClick={handleEditBillboard}
            className="absolute top-4 right-4 z-30 p-3 bg-white/95 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110 group"
            title="Edit Billboard"
          >
            <Edit3 className="w-5 h-5 text-black" />
            <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              Edit Billboard
            </span>
          </button>
        )}
        <img
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&h=1080&fit=crop"
          alt="EOMC Store"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-3 sm:mb-4 bg-red-600 rounded-full flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white fill-current">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
              </svg>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-2">EOMC</h2>
            <p className="text-sm sm:text-lg md:text-xl lg:text-2xl tracking-widest">EYES OPEN MOUTHS CLOSED</p>
          </div>
        </div>
      </section>
    </>
  );
}
