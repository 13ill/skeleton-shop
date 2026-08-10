import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { getCategoryCounts, getProductById } from "../../services/productService";
import { type Category } from "../../types/product";
import { useSiteSettings } from "../context/SiteSettingsContext";
import { useCategories } from "../context/CategoriesContext";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function Header() {
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({ all: 0 });
  const { siteSettings } = useSiteSettings();
  const { categories, categoryMap } = useCategories();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // รายการ categories สำหรับ nav: "all" + ทุก category ที่ active
  const navCategories: Category[] = ['all', ...categories
    .filter(c => c.slug !== 'all')
    .map(c => c.slug as Category)];

  // Scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get current category from URL or product detail
  const getCurrentCategory = async (): Promise<Category> => {
    // If on contact page, return null to indicate no category selected
    if (location.pathname === '/contact') {
      return 'none' as Category;
    }

    // If on product detail page, get category from product
    if (location.pathname.startsWith('/product/')) {
      const productId = location.pathname.split('/')[2];
      try {
        const product = await getProductById(productId);
        return product?.category as Category || 'all';
      } catch (error) {
        console.error("Failed to load product for category:", error);
        return 'all';
      }
    }

    const params = new URLSearchParams(location.search);
    return (params.get('category') as Category) || 'all';
  };

  const [activeCategory, setActiveCategory] = useState<Category>('all');

  // Update active category when URL changes
  useEffect(() => {
    const updateCategory = async () => {
      const category = await getCurrentCategory();
      setActiveCategory(category);
    };
    updateCategory();
  }, [location.pathname, location.search]);

  // Load category counts
  useEffect(() => {
    const loadCounts = async () => {
      try {
        const counts = await getCategoryCounts();
        setCategoryCounts(counts);
      } catch (error) {
        console.error("Failed to load category counts:", error);
      }
    };
    loadCounts();
  }, []);

  const handleCategoryClick = (category: Category) => {
    setActiveCategory(category);

    // Update URL
    const params = new URLSearchParams(location.search);
    if (category === 'all') {
      params.delete('category');
    } else {
      params.set('category', category);
    }

    const newUrl = `/?${params.toString()}`;
    navigate(newUrl, { replace: true });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleContactClick = () => {
    navigate('/contact');
    setIsMobileMenuOpen(false);
  };

  const isContactPage = location.pathname === '/contact';

  const handleMobileCategoryClick = (category: Category) => {
    handleCategoryClick(category);
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-all duration-300 ${isScrolled ? 'shadow-md' : 'shadow-sm'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo Section with Hamburger */}
        <div className="py-6 flex items-center justify-between">
          <Link to="/" className="inline-block">
            <h1
              className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-[0.2em] uppercase font-swarovski text-swarovski-black hover:text-swarovski-gold transition-colors duration-300"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {siteSettings.brandName}
            </h1>
          </Link>

          {/* Hamburger Menu Button - Mobile Only */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-swarovski-black hover:text-swarovski-gold transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:block pb-6">
          <div className="flex justify-center gap-8 text-sm tracking-wider font-medium">
            {navCategories
              .filter((category) => category === 'all' || (categoryCounts[category] || 0) > 0)
              .map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={`uppercase transition-all duration-300 hover:text-swarovski-gold ${!isContactPage && activeCategory === category
                    ? "text-swarovski-black border-b-2 border-swarovski-gold pb-1"
                    : "text-gray-500"
                    }`}
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {categoryMap[category] || category} ({categoryCounts[category] || 0})
                </button>
              ))}
            <button
              onClick={handleContactClick}
              className={`uppercase transition-all duration-300 hover:text-swarovski-gold ${isContactPage
                ? "text-swarovski-black border-b-2 border-swarovski-gold pb-1"
                : "text-gray-500"
                }`}
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              ติดต่อเรา
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu — Overlay (sibling ของ drawer, ไม่ใช่ลูก) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu — Drawer Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="mobile-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-80 bg-white shadow-2xl z-50 lg:hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold tracking-wider uppercase" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  เมนู
                </h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-swarovski-black hover:text-swarovski-gold transition-colors"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              <nav className="space-y-4">
                {navCategories
                  .filter((category) => category === 'all' || (categoryCounts[category] || 0) > 0)
                  .map((category) => (
                    <button
                      key={category}
                      onClick={() => handleMobileCategoryClick(category)}
                      className={`w-full text-left py-3 px-4 rounded-lg transition-all duration-300 ${!isContactPage && activeCategory === category
                        ? 'bg-swarovski-gold text-white'
                        : 'bg-swarovski-gray text-swarovski-black hover:bg-swarovski-gold hover:text-white'
                        }`}
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="uppercase tracking-wider">{categoryMap[category] || category}</span>
                        <span className="text-sm opacity-75">({categoryCounts[category] || 0})</span>
                      </div>
                    </button>
                  ))}
                <button
                  onClick={handleContactClick}
                  className={`w-full text-left py-3 px-4 rounded-lg transition-all duration-300 ${isContactPage
                    ? 'bg-swarovski-gold text-white'
                    : 'bg-swarovski-gray text-swarovski-black hover:bg-swarovski-gold hover:text-white'
                    }`}
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  <span className="uppercase tracking-wider">ติดต่อเรา</span>
                </button>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
