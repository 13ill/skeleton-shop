import { useParams, Link } from "react-router";
import { products } from "../data/products";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";

// แปลน category เป็นภาษาไทย
const categoryMap: Record<string, string> = {
  "ring": "แหวน",
  "necklace": "สร้อยคอ",
  "bracelet": "สร้อยข้อมือ",
  "earring": "ต่างหู"
};

interface Product {
  id: string;
  name: string;
  category: string;
  price: number | null;
  description: string;
  fullDescription?: string;
  material?: string;
  materials?: string[];
  specifications?: {
    size?: string;
    weight?: string;
  };
  image: string;
  images: string[];
}

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = products.find((p) => p.id === id) as Product | undefined;
  const [currentIndex, setCurrentIndex] = useState(0);
  const thumbnailScrollRef = useRef<HTMLDivElement>(null);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <p className="text-center text-gray-500">ไมพบสินค้า</p>
      </div>
    );
  }

  const images = product.images || [product.image];
  const hasMultipleImages = images.length > 1;

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  const scrollThumbnails = (direction: 'left' | 'right') => {
    if (thumbnailScrollRef.current) {
      const scrollAmount = 200; // Adjust based on thumbnail width + gap
      thumbnailScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images.length]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        กลับไปหน้าหลัก
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          {/* Main Image */}
          <div className="relative overflow-hidden bg-gray-50 aspect-[3/4] rounded-lg">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                src={images[currentIndex]}
                alt={`${product.name} - Image ${currentIndex + 1}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>

            {/* Navigation Arrows */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Image Counter */}
            {hasMultipleImages && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                {currentIndex + 1} / {images.length}
              </div>
            )}
          </div>

          {/* Thumbnail Gallery - Horizontal Scroll with Arrow Buttons */}
          {hasMultipleImages && (
            <div className="relative group">
              {/* Left Arrow Button */}
              <button
                onClick={() => scrollThumbnails('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 opacity-0 group-hover:opacity-100"
                aria-label="Scroll thumbnails left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Thumbnail Scroll Container */}
              <div
                ref={thumbnailScrollRef}
                className="flex gap-3 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory custom-scrollbar"
              >
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 overflow-hidden rounded-lg border-2 transition-all snap-start ${index === currentIndex
                      ? "border-[#c8a96e] scale-105"
                      : "border-gray-200 hover:border-gray-300"
                      }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {index === currentIndex && (
                      <div className="absolute inset-0 bg-[#c8a96e]/20" />
                    )}
                  </button>
                ))}
              </div>

              {/* Right Arrow Button */}
              <button
                onClick={() => scrollThumbnails('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 opacity-0 group-hover:opacity-100"
                aria-label="Scroll thumbnails right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col justify-center space-y-6"
        >
          <div className="space-y-2">
            <p className="text-xs tracking-wider uppercase text-gray-500">
              {categoryMap[product.category] || product.category}
            </p>
            <h1 className="text-3xl tracking-wide">
              {product.name}
            </h1>
          </div>

          {product.price && (
            <p className="text-2xl text-gray-900">
              ฿{product.price!.toLocaleString()}
            </p>
          )}

          <div className="border-t border-gray-200 pt-6 space-y-4">
            <div>
              <h3 className="text-sm tracking-wider uppercase text-gray-500 mb-2">
                รายละเอียด
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {product.material && (
              <div>
                <h3 className="text-sm tracking-wider uppercase text-gray-500 mb-2">
                  วัสดุ
                </h3>
                <p className="text-gray-700">
                  {product.material}
                </p>
              </div>
            )}

            {product.specifications && (
              <div>
                <h3 className="text-sm tracking-wider uppercase text-gray-500 mb-2">
                  สเปค
                </h3>
                <p className="text-gray-700">
                  {product.specifications.size}
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-500 leading-relaxed">
              สินค้าทุกชิ้นได้รับการคัดสรรอย่างพิถีพิถัน พร้อมการณีต์คุณภาพ
              <br />
              สำหรับข้อมูลเพิ่มเติม กรุณาติดต่อเรา
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}