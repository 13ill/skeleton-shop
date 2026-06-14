import { useState } from 'react';

interface ImageUploadProps {
  onImagesChange: (images: string[]) => void;
  initialImages?: string[];
}

export function ImageUpload({ onImagesChange, initialImages = [] }: ImageUploadProps) {
  const [images, setImages] = useState<string[]>(initialImages);
  const [uploading, setUploading] = useState(false);

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
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/upload`, {
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
        {uploading && (
          <p className="text-sm text-gray-500 mt-1">Uploading...</p>
        )}
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={`${import.meta.env.VITE_API_BASE_URL}${image}`}
                alt={`Product image ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="text-sm text-gray-500">
        {images.length} image{images.length !== 1 ? 's' : ''} uploaded
      </div>
    </div>
  );
}
