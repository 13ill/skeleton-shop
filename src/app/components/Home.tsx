import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { getAllProducts, getProductsByCategory, getProductsWithMode } from "../../services/productService";
import { categoryMap, type Category, type ProductWithImages } from "../../types/product";
import { motion } from "motion/react";
import { useSiteSettings } from "../context/SiteSettingsContext";

export function Home() {
  const [displayMode, setDisplayMode] = useState<'interleaved' | 'grouped'>('interleaved');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [products, setProducts] = useState<ProductWithImages[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const itemsPerPage = 12;
  const location = useLocation();
  const { siteSettings } = useSiteSettings();

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-swarovski-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative py-20 md:py-32"
        style={{
          backgroundImage: siteSettings.heroBackgroundImage ? `url(${siteSettings.heroBackgroundImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          border: siteSettings.heroShowBorder ? `4px solid ${siteSettings.heroBorderColor}` : 'none',
        }}
      >
        {/* Fallback gradient if no image */}
        {!siteSettings.heroBackgroundImage && (
          <div className="absolute inset-0 bg-gradient-to-br from-swarovski-gray to-white" />
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                color: siteSettings.heroBackgroundImage ? 'white' : 'inherit',
                WebkitTextStroke: siteSettings.heroBackgroundImage
                  ? `${siteSettings.heroTextStrokeWidth || 2}px ${siteSettings.heroTextStrokeColor || '#ffffff'}`
                  : 'none',
              }}
            >
              {siteSettings.heroTitle || 'เครื่องประดับที่สะท้อน'}
              <span className={`block mt-2 ${siteSettings.heroBackgroundImage ? 'text-swarovski-gold' : 'text-swarovski-purple'}`}>
                {siteSettings.heroSubtitle?.split('\n')[0] || 'ความเป็นคุณ'}
              </span>
            </h1>
            <p
              className={`text-lg sm:text-xl mb-8 max-w-2xl mx-auto ${siteSettings.heroBackgroundImage ? 'text-white/80' : 'text-gray-600'
                }`}
              style={{
                WebkitTextStroke: siteSettings.heroBackgroundImage
                  ? `${siteSettings.heroTextStrokeWidth || 2}px ${siteSettings.heroTextStrokeColor || '#ffffff'}`
                  : 'none',
              }}
            >
              {siteSettings.heroSubtitle?.split('\n')[1] || siteSettings.tagline || "เครื่องประดับเพชรพลอยคุณภาพสูง ที่คัดสรรความพิเศษให้คุณ"}
            </p>
            {siteSettings.heroButtonText && (
              <Link
                to="/"
                className="inline-block px-8 py-4 bg-swarovski-black text-white font-semibold rounded-lg hover:bg-swarovski-purple transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-glow"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {siteSettings.heroButtonText}
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-2xl font-bold mb-8 text-center"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            หมวดหมู่สินค้า
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {['all', 'ring', 'necklace', 'bracelet', 'earring'].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  const params = new URLSearchParams(location.search);
                  if (cat === 'all') {
                    params.delete('category');
                  } else {
                    params.set('category', cat);
                  }
                  window.location.href = `/?${params.toString()}`;
                }}
                className={`flex-shrink-0 px-6 py-3 rounded-full font-medium transition-all duration-300 ${selectedCategory === cat
                  ? 'bg-swarovski-purple text-white shadow-md'
                  : 'bg-swarovski-gray text-gray-700 hover:bg-swarovski-purple hover:text-white'
                  }`}
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {cat === 'all' ? 'ทั้งหมด' : categoryMap[cat as Category]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-white">
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
                  ? 'bg-swarovski-purple text-white shadow-md'
                  : 'bg-swarovski-gray text-gray-700 hover:bg-swarovski-purple hover:text-white'
                  }`}
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                สลับหมวดหมู่
              </button>
              <button
                onClick={() => setDisplayMode('grouped')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${displayMode === 'grouped'
                  ? 'bg-swarovski-purple text-white shadow-md'
                  : 'bg-swarovski-gray text-gray-700 hover:bg-swarovski-purple hover:text-white'
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
                  <div className="relative overflow-hidden bg-swarovski-gray aspect-[3/4] mb-4 rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300">
                    <img
                      src={product.images[0]?.startsWith('/uploads') || product.images[0]?.startsWith('/Product')
                        ? `${import.meta.env.VITE_API_BASE_URL}${product.images[0]}`
                        : product.images[0] || '/placeholder.svg'}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs tracking-wider uppercase text-gray-500 font-medium">
                      {categoryMap[product.category as Category] || product.category}
                    </p>
                    <h3
                      className="text-base font-semibold tracking-wide group-hover:text-swarovski-purple transition-colors"
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
                  className="px-4 py-2 rounded-lg border border-gray-200 hover:border-swarovski-purple hover:text-swarovski-purple disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
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
                      ? "border-swarovski-purple bg-swarovski-purple text-white shadow-md"
                      : "border-gray-200 hover:border-swarovski-purple hover:text-swarovski-purple"
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
                  className="px-4 py-2 rounded-lg border border-gray-200 hover:border-swarovski-purple hover:text-swarovski-purple disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
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
          backgroundColor: !siteSettings.newsletterBackgroundImage ? '#6b4c9a' : undefined,
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
                WebkitTextStroke: `${siteSettings.newsletterTextStrokeWidth || 2}px ${siteSettings.newsletterTextStrokeColor || '#ffffff'}`,
              }}
            >
              {siteSettings.newsletterTitle || 'รับข่าวสารและโปรโมชั่นพิเศษ'}
            </h2>
            <p
              className="text-white/80 mb-8 max-w-xl mx-auto"
              style={{
                WebkitTextStroke: `${siteSettings.newsletterTextStrokeWidth || 2}px ${siteSettings.newsletterTextStrokeColor || '#ffffff'}`,
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
