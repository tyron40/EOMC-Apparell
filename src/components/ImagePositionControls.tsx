import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ZoomIn, ZoomOut } from 'lucide-react';

interface ImagePositionControlsProps {
  imageUrl: string;
  imageFit: 'contain' | 'cover' | 'fill';
  positionX: number;
  positionY: number;
  zoom: number;
  onPositionChange: (x: number, y: number) => void;
  onZoomChange: (zoom: number) => void;
}

export default function ImagePositionControls({
  imageUrl,
  imageFit,
  positionX,
  positionY,
  zoom,
  onPositionChange,
  onZoomChange,
}: ImagePositionControlsProps) {
  const handleMove = (deltaX: number, deltaY: number) => {
    const newX = Math.max(-50, Math.min(50, positionX + deltaX));
    const newY = Math.max(-50, Math.min(50, positionY + deltaY));
    onPositionChange(newX, newY);
  };

  const handleZoom = (delta: number) => {
    const newZoom = Math.max(0.5, Math.min(3.0, zoom + delta));
    onZoomChange(newZoom);
  };

  return (
    <div className="border-t pt-4 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Image Position</label>
        <div className="flex items-center justify-center gap-2">
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => handleMove(0, -5)}
              className="p-2 border border-gray-300 rounded hover:bg-gray-50"
              title="Move Up"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleMove(-5, 0)}
                className="p-2 border border-gray-300 rounded hover:bg-gray-50"
                title="Move Left"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onPositionChange(0, 0)}
                className="p-2 border border-gray-300 rounded hover:bg-gray-50 text-xs"
                title="Reset Position"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => handleMove(5, 0)}
                className="p-2 border border-gray-300 rounded hover:bg-gray-50"
                title="Move Right"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => handleMove(0, 5)}
              className="p-2 border border-gray-300 rounded hover:bg-gray-50"
              title="Move Down"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500 text-center mt-2">X: {positionX}% Y: {positionY}%</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Zoom</label>
        <div className="flex items-center gap-3 justify-center">
          <button
            type="button"
            onClick={() => handleZoom(-0.1)}
            className="p-2 border border-gray-300 rounded hover:bg-gray-50"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium w-16 text-center">{zoom.toFixed(1)}x</span>
          <button
            type="button"
            onClick={() => handleZoom(0.1)}
            className="p-2 border border-gray-300 rounded hover:bg-gray-50"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-2">
          <input
            type="range"
            min="0.5"
            max="3.0"
            step="0.1"
            value={zoom}
            onChange={(e) => onZoomChange(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      <div className="bg-gray-100 rounded-lg p-3 h-48 relative overflow-hidden">
        <img
          src={imageUrl}
          alt="Preview"
          className={`w-full h-full object-${imageFit}`}
          style={{
            transform: `scale(${zoom}) translate(${positionX}%, ${positionY}%)`,
            transformOrigin: 'center center'
          }}
        />
      </div>
    </div>
  );
}
