import { useState, useEffect } from 'react';
import { env } from '../../config/env';
import { ResponsiveImage } from '../components/ResponsiveImage';

interface ImageUploadProps {
  onImagesChange: (images: string[]) => void;
  initialImages?: string[];
}

export function ImageUpload({ onImagesChange, initialImages = [] }: ImageUploadProps) {
  const [images, setImages] = useState<string[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Sync images when initialImages changes
  useEffect(() => {
    setImages(initialImages);
  }, [initialImages]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const newImages: string[] = [...images];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Convert to base64
        const reader = new FileReader();
        await new Promise<void>((resolve) => {
          reader.onload = () => resolve();
          reader.readAsDataURL(file);
        });

        const base64 = reader.result as string;
        const dataUrl = base64.split(',')[1]; // Remove data URL prefix

        // Upload to server
        const response = await fetch(`${env.API_BASE_URL}/upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            filename: file.name,
            data: dataUrl,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to upload image');
        }

        const result = await response.json();
        newImages.push(result.url);
      }

      setImages(newImages);
      onImagesChange(newImages);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onImagesChange(newImages);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(dropIndex, 0, draggedImage);

    setImages(newImages);
    onImagesChange(newImages);
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Images
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c8a96e] disabled:opacity-50"
        />
        <p className="text-xs text-gray-500 mt-1">
          แนะนำรูปสัดส่วน 3:4 (เช่น 1200×1600px) เพื่อให้พอดีกับการ์ดสินค้า — ระบบจะย่อเป็นหลายขนาด (WebP) ให้อัตโนมัติเพื่อลดการโหลดและค่าใช้จ่าย
        </p>
        {uploading && (
          <p className="text-sm text-gray-500 mt-1">Uploading...</p>
        )}
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              className={`relative group ${draggedIndex === index ? 'opacity-50' : ''
                }`}
            >
              <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded z-10">
                {index + 1}
              </div>
              <ResponsiveImage
                src={image}
                alt={`Product image ${index + 1}`}
                sizes="160px"
                className="w-full h-32 object-cover rounded-lg border border-gray-200 cursor-move"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-10"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="text-sm text-gray-500">
        {images.length} image{images.length !== 1 ? 's' : ''} uploaded
        {images.length > 1 && ' (Drag to reorder)'}
      </div>
    </div>
  );
}
