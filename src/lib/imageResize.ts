export type ImageContext = 'hero' | 'product' | 'category' | 'gallery';

interface ImageDimensions {
  width: number;
  height: number;
  quality: number;
}

const DIMENSION_PRESETS: Record<ImageContext, ImageDimensions> = {
  hero: { width: 1920, height: 1080, quality: 0.85 },
  product: { width: 800, height: 800, quality: 0.85 },
  category: { width: 600, height: 600, quality: 0.85 },
  gallery: { width: 400, height: 600, quality: 0.85 }
};

export async function resizeImage(
  file: File,
  context: ImageContext,
  customDimensions?: Partial<ImageDimensions>
): Promise<File> {
  const dimensions = { ...DIMENSION_PRESETS[context], ...customDimensions };

  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    img.onload = () => {
      const { width: targetWidth, height: targetHeight, quality } = dimensions;

      let width = img.width;
      let height = img.height;

      const aspectRatio = width / height;
      const targetAspectRatio = targetWidth / targetHeight;

      if (context === 'product' || context === 'category') {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
      } else if (context === 'hero') {
        if (aspectRatio > targetAspectRatio) {
          width = targetWidth;
          height = targetWidth / aspectRatio;
        } else {
          height = targetHeight;
          width = targetHeight * aspectRatio;
        }
        canvas.width = width;
        canvas.height = height;
      } else if (context === 'gallery') {
        if (aspectRatio > targetAspectRatio) {
          height = targetHeight;
          width = targetHeight * aspectRatio;
        } else {
          width = targetWidth;
          height = targetWidth / aspectRatio;
        }
        canvas.width = Math.min(width, targetWidth);
        canvas.height = Math.min(height, targetHeight);
      }

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const offsetX = (canvas.width - width) / 2;
      const offsetY = (canvas.height - height) / 2;

      ctx.drawImage(img, offsetX, offsetY, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to create blob'));
            return;
          }

          const resizedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now()
          });

          resolve(resizedFile);
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = URL.createObjectURL(file);
  });
}

export function getImageInfo(file: File): Promise<{ width: number; height: number; size: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
        size: file.size
      });
      URL.revokeObjectURL(img.src);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
      URL.revokeObjectURL(img.src);
    };

    img.src = URL.createObjectURL(file);
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
