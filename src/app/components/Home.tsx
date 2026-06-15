import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { getAllProducts, getProductsByCategory, getProductsWithMode } from "../../services/productService";
import { categoryMap, type Category, type ProductWithImages } from "../../types/product";
import { motion } from "motion/react";

export function Home() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [displayMode, setDisplayMode] = useState<'interleaved' | 'grouped'>('interleaved');
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [products, setProducts] = useState<ProductWithImages[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const itemsPerPage = 10;

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        // Use display mode when showing all products
        if (selectedCategory === 'all') {
          const data = await getProductsWithMode(displayMode);
          setProducts(data);
        } else {
          const data = await getProductsByCategory(selectedCategory);
          setProducts(data);
        }
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [selectedCategory, displayMode]);

  // Load products by category when category changes
  useEffect(() => {
    const loadProductsByCategory = async () => {
      setLoading(true);
      try {
        const data = await getProductsByCategory(selectedCategory);
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products by category:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProductsByCategory();
  }, [selectedCategory]);

  useEffect(() => {
    const handleCategoryChange = (event: CustomEvent) => {
      setSelectedCategory(event.detail);
    };

    window.addEventListener("categoryChange", handleCategoryChange as EventListener);

    return () => {
      window.removeEventListener("categoryChange", handleCategoryChange as EventListener);
    };
  }, []);

  // Check for category from navigation state
  useEffect(() => {
    if (location.state?.category) {
      setSelectedCategory(location.state.category);
    }
  }, [location.state]);

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
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center text-gray-500">กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Display Mode Toggle */}
      <div className="mb-6 flex justify-end gap-2">
        <button
          onClick={() => setDisplayMode('interleaved')}
          className={`px-4 py-2 rounded-md transition-colors ${displayMode === 'interleaved'
              ? 'bg-[#c8a96e] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          สลับหมวดหมู่
        </button>
        <button
          onClick={() => setDisplayMode('grouped')}
          className={`px-4 py-2 rounded-md transition-colors ${displayMode === 'grouped'
              ? 'bg-[#c8a96e] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          แยกหมวดหมู่
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {paginatedProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Link
              to={`/product/${product.id}`}
              className="group block"
            >
              <div className="relative overflow-hidden bg-gray-50 aspect-[3/4] mb-4">
                <img
                  src={product.images[0] || '/placeholder.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="space-y-2">
                <p className="text-xs tracking-wider uppercase text-gray-500">
                  {categoryMap[product.category as Category] || product.category}
                </p>
                <h3 className="text-base tracking-wide group-hover:text-gray-600 transition-colors">
                  {product.name}
                </h3>
                {product.price && product.price > 0 && (
                  <p className="text-sm text-gray-900">
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
              className="px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ก่อนหน้า
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-lg border transition-colors ${currentPage === page
                  ? "border-[#c8a96e] bg-[#c8a96e] text-white"
                  : "border-gray-200 hover:border-gray-300"
                  }`}
              >
                {page}
              </button>
            ))}

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ถัดไป
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
