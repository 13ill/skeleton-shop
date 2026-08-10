import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ResponsiveImage } from './ResponsiveImage';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);
  // ตรวจว่าอุปกรณ์รองรับ hover จริงไหม (ทัชและจอแนวตั้งไม่มี hover)
  const [canHover, setCanHover] = useState(true);
  useEffect(() => {
    const mql = window.matchMedia('(hover: hover) and (pointer: fine)');
    setCanHover(mql.matches);
    const handler = (e: MediaQueryListEvent) => setCanHover(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="space-y-4">
      {/* Main Image with Zoom */}
      <div
        className={`relative aspect-[3/4] bg-swarovski-gray rounded-lg overflow-hidden ${canHover ? 'cursor-zoom-in' : 'cursor-pointer'}`}
        style={{ touchAction: 'manipulation' }}
        onMouseEnter={() => canHover && setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
        onClick={() => setIsLightboxOpen(true)}
      >
        <ResponsiveImage
          src={images[selectedIndex] || '/placeholder.svg'}
          alt={`${productName} - Image ${selectedIndex + 1}`}
          sizes="(min-width: 768px) 50vw, 100vw"
          className="w-full h-full object-cover transition-transform duration-300"
          style={
            isZoomed
              ? {
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                transform: 'scale(2)',
              }
              : {}
          }
        />
        <div className="absolute bottom-4 right-4 bg-black/50 text-white p-2 rounded-full pointer-events-none">
          <ZoomIn size={20} />
        </div>
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              style={{ touchAction: 'manipulation' }}
              className={`relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all ${selectedIndex === index
                ? 'border-swarovski-gold'
                : 'border-transparent hover:border-swarovski-gold/50'
                }`}
            >
              <ResponsiveImage
                src={image}
                alt={`${productName} - Thumbnail ${index + 1}`}
                sizes="25vw"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setIsLightboxOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-4xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="absolute -top-12 right-0 text-white hover:text-swarovski-gold transition-colors"
                aria-label="Close lightbox"
              >
                <X size={32} />
              </button>

              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-swarovski-gold transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-swarovski-gold transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              <img
                src={images[selectedIndex] || '/placeholder.svg'}
                alt={`${productName} - Full screen ${selectedIndex + 1}`}
                className="w-full h-full object-contain max-h-[80vh]"
              />

              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${selectedIndex === index ? 'bg-swarovski-gold' : 'bg-white/50'
                        }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
