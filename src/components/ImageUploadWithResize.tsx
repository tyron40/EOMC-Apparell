import { useState } from 'react';
import { Upload, Info } from 'lucide-react';
import { getImageInfo, formatFileSize, ImageContext } from '../lib/imageResize';

interface ImageUploadWithResizeProps {
  currentImageUrl?: string;
  context: ImageContext;
  onFileSelect: (file: File, shouldResize: boolean) => void | Promise<void>;
  uploading?: boolean;
}

export default function ImageUploadWithResize({
  currentImageUrl,
  context,
  onFileSelect,
  uploading = false
}: ImageUploadWithResizeProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageInfo, setImageInfo] = useState<{ width: number; height: number; size: number } | null>(null);
  const [shouldResize, setShouldResize] = useState(true);

  const contextLabels: Record<ImageContext, string> = {
    hero: 'Hero Slider (1920x1080)',
    product: 'Product (800x800)',
    category: 'Category (600x600)',
    gallery: 'Gallery (400x600)'
  };

  const handleFileChange = async (file: File) => {
    setSelectedFile(file);

    try {
      const info = await getImageInfo(file);
      setImageInfo(info);
    } catch (error) {
      console.error('Failed to get image info:', error);
      setImageInfo(null);
    }
  };

  const handleUpload = () => {
    if (selectedFile && onFileSelect) {
      onFileSelect(selectedFile, shouldResize);
      setSelectedFile(null);
      setImageInfo(null);
    } else if (!onFileSelect) {
      console.error('onFileSelect is not defined');
      alert('Upload handler is not properly configured');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Image Upload
          <span className="text-gray-500 text-xs ml-2">
            (Recommended: {contextLabels[context]})
          </span>
        </label>

        {currentImageUrl && !selectedFile && (
          <div className="mb-2 p-2 bg-gray-50 rounded border border-gray-200">
            <img
              src={currentImageUrl}
              alt="Current"
              className="w-full h-32 object-contain rounded"
            />
          </div>
        )}

        <label className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
          <Upload className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-600">
            {uploading ? 'Uploading...' : selectedFile ? 'Change Image' : currentImageUrl ? 'Change Image' : 'Upload Image'}
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileChange(file);
              e.target.value = '';
            }}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {selectedFile && imageInfo && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-sm">
              <p className="font-semibold text-blue-900 mb-2">Selected Image Info</p>
              <div className="space-y-1 text-blue-800">
                <p>Dimensions: {imageInfo.width} x {imageInfo.height}px</p>
                <p>File Size: {formatFileSize(imageInfo.size)}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-blue-200">
            <input
              type="checkbox"
              id="resize-toggle"
              checked={shouldResize}
              onChange={(e) => setShouldResize(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="resize-toggle" className="text-sm text-blue-900 cursor-pointer select-none">
              Auto-resize and optimize image for {context} ({contextLabels[context]})
            </label>
          </div>

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm font-medium"
          >
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </div>
      )}
    </div>
  );
}
