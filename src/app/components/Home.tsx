import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { getAllProducts, getProductsByCategory, getProductsWithMode } from "../../services/productService";
import { categoryMap, type Category, type ProductWithImages } from "../../types/product";
import { motion, AnimatePresence } from "motion/react";
import { useSiteSettings } from "../context/SiteSettingsContext";
import { ResponsiveImage } from "./ResponsiveImage";
import { Heart, Eye } from "lucide-react";

export function Home() {
  const [displayMode, setDisplayMode] = useState<'interleaved' | 'grouped'>('interleaved');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [products, setProducts] = useState<ProductWithImages[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [scrollY, setScrollY] = useState(0);
  const itemsPerPage = 12;
  const location = useLocation();
  const { siteSettings } = useSiteSettings();

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get current category from URL
  const getCurrentCategory = (): Category => {
    const params = new URLSearchParams(location.search);
    return (params.get('category') as Category) || 'all';
  };

  const [selectedCategory, setSelectedCategory] = useState<Category>(getCurrentCategory());

  // Update selected category when URL changes
  useEffect(() => {
    setSelectedCategory(getCurrentCategory());
  }, [location.search]);

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        // Always use display mode
        const data = await getProductsWithMode(displayMode);

        // Filter by category if not 'all'
        const filteredData = selectedCategory === 'all'
          ? data
          : data.filter(p => p.category === selectedCategory);

        setProducts(filteredData);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [selectedCategory, displayMode]);

  // Reset page when category or display mode changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, displayMode]);

  // Pagination logic
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = products.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-swarovski-gray to-white">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-16 h-16 border-4 border-swarovski-gold border-t-transparent rounded-full animate-spin mx-auto mb-6"
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-600 tracking-wider uppercase text-sm"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            กำลังโหลด...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative py-20 md:py-32 overflow-hidden"
        style={{
          backgroundImage: siteSettings.heroBackgroundImage ? `url(${siteSettings.heroBackgroundImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          border: siteSettings.heroShowBorder ? `4px solid ${siteSettings.heroBorderColor}` : 'none',
        }}
      >
        {/* Fallback gradient if no image */}
        {!siteSettings.heroBackgroundImage && (
          <div className="absolute inset-0 bg-gradient-to-br from-swarovski-gray via-white to-swarovski-gray" />
        )}

        {/* Decorative overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center"
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-[1.2]"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                color: siteSettings.heroBackgroundImage ? 'white' : 'inherit',
                WebkitTextStroke: siteSettings.heroBackgroundImage
                  ? `${siteSettings.heroTextStrokeWidth || 0.5}px ${siteSettings.heroTextStrokeColor || '#ffffff'}`
                  : 'none',
              }}
            >
              {siteSettings.heroTitle || 'เครื่องประดับที่สะท้อน'}
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className={`block mt-3 ${siteSettings.heroBackgroundImage ? 'text-swarovski-gold' : 'text-swarovski-gold'}`}
              >
                {siteSettings.heroSubtitle?.split('\n')[0] || 'ความเป็นคุณ'}
              </motion.span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className={`text-lg sm:text-xl mb-8 max-w-2xl mx-auto ${siteSettings.heroBackgroundImage ? 'text-white/90' : 'text-gray-700'
                }`}
              style={{
                WebkitTextStroke: siteSettings.heroBackgroundImage
                  ? `${siteSettings.heroTextStrokeWidth || 0.5}px ${siteSettings.heroTextStrokeColor || '#ffffff'}`
                  : 'none',
              }}
            >
              {siteSettings.heroSubtitle?.split('\n')[1] || siteSettings.tagline || "เครื่องประดับเพชรพลอยคุณภาพสูง ที่คัดสรรความพิเศษให้คุณ"}
            </motion.p>
            {siteSettings.heroButtonText && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <Link
                  to="/"
                  className="inline-block px-8 py-4 bg-swarovski-black text-white font-semibold rounded-lg hover:bg-swarovski-gold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-glow"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {siteSettings.heroButtonText}
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2"
          >
            <motion.div
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-3 bg-white/70 rounded-full"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Products Section */}
      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2
              className="text-2xl font-bold"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {selectedCategory === 'all' ? 'สินค้าทั้งหมด' : categoryMap[selectedCategory]}
            </h2>

            {/* Display Mode Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setDisplayMode('interleaved')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${displayMode === 'interleaved'
                  ? 'bg-swarovski-black text-white shadow-md'
                  : 'bg-swarovski-gray text-gray-700 hover:bg-swarovski-black hover:text-white'
                  }`}
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                สลับหมวดหมู่
              </button>
              <button
                onClick={() => setDisplayMode('grouped')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${displayMode === 'grouped'
                  ? 'bg-swarovski-black text-white shadow-md'
                  : 'bg-swarovski-gray text-gray-700 hover:bg-swarovski-black hover:text-white'
                  }`}
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                แยกหมวดหมู่
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link
                  to={`/product/${product.id}`}
                  className="group block"
                >
                  <div className="relative overflow-hidden bg-swarovski-gray aspect-[3/4] mb-4 rounded-lg border border-gray-100 shadow-card hover:shadow-card-hover transition-all duration-300">
                    <ResponsiveImage
                      src={product.images[0] || '/placeholder.svg'}
                      alt={product.name}
                      sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />

                    {/* Quick Actions Overlay */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                      <button
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-swarovski-gold hover:text-white transition-all duration-300"
                        aria-label="Add to wishlist"
                      >
                        <Heart size={18} className="fill-transparent" />
                      </button>
                      <button
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-swarovski-gold hover:text-white transition-all duration-300"
                        aria-label="Quick view"
                      >
                        <Eye size={18} />
                      </button>
                    </div>

                    {/* New Badge */}
                    {index < 3 && (
                      <div className="absolute top-3 left-3 bg-swarovski-gold text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        New
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs tracking-wider uppercase text-gray-500 font-medium">
                      {categoryMap[product.category as Category] || product.category}
                    </p>
                    <h3
                      className="text-base font-semibold tracking-wide group-hover:text-swarovski-gold transition-colors"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {product.name}
                    </h3>
                    {product.price && product.price > 0 && (
                      <p className="text-sm font-bold text-swarovski-black">
                        ฿{product.price!.toLocaleString()}
                      </p>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex flex-col items-center gap-4">
              <p className="text-sm text-gray-500">
                แสดง {startIndex + 1}-{Math.min(endIndex, products.length)} จาก {products.length} รายการ
              </p>

              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-gray-200 hover:border-swarovski-gold hover:text-swarovski-gold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  ก่อนหน้า
                </button>

                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg border transition-all duration-300 ${currentPage === page
                      ? "border-swarovski-black bg-swarovski-black text-white shadow-md"
                      : "border-gray-200 hover:border-swarovski-gold hover:text-swarovski-gold"
                      }`}
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {page}
                  </button>
                ))}

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-200 hover:border-swarovski-gold hover:text-swarovski-gold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  ถัดไป
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section
        className="py-16 relative"
        style={{
          backgroundImage: siteSettings.newsletterBackgroundImage ? `url(${siteSettings.newsletterBackgroundImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: !siteSettings.newsletterBackgroundImage ? '#1f1b18' : undefined,
          border: siteSettings.newsletterShowBorder ? `4px solid ${siteSettings.newsletterBorderColor}` : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2
              className="text-3xl font-bold mb-4 text-white"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                WebkitTextStroke: `${siteSettings.newsletterTextStrokeWidth || 1}px ${siteSettings.newsletterTextStrokeColor || '#ffffff'}`,
              }}
            >
              {siteSettings.newsletterTitle || 'รับข่าวสารและโปรโมชั่นพิเศษ'}
            </h2>
            <p
              className="text-white/80 mb-8 max-w-xl mx-auto"
              style={{
                WebkitTextStroke: `${siteSettings.newsletterTextStrokeWidth || 1}px ${siteSettings.newsletterTextStrokeColor || '#ffffff'}`,
              }}
            >
              {siteSettings.newsletterDescription || 'สมัครรับจดหมายข่าวสารเพื่อไม่พลาดโปรโมชั่นและสินค้าใหม่ล่าสุด'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="อีเมลของคุณ"
                className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-swarovski-gold"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              />
              <button
                className="px-6 py-3 bg-swarovski-gold text-white font-semibold rounded-lg hover:bg-swarovski-gold-light transition-all duration-300"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                สมัคร
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
