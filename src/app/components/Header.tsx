import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { getCategoryCounts, getProductById } from "../../services/productService";
import { categoryMap, type Category } from "../../types/product";
import { useSiteSettings } from "../context/SiteSettingsContext";

const categories: Category[] = ["all", "ring", "necklace", "bracelet", "earring"];

export function Header() {
  const [categoryCounts, setCategoryCounts] = useState<Record<Category, number>>({
    all: 0,
    ring: 0,
    necklace: 0,
    bracelet: 0,
    earring: 0,
    pendant: 0,
  });
  const { siteSettings } = useSiteSettings();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

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
  };

  const isContactPage = location.pathname === '/contact';

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-all duration-300 ${isScrolled ? 'shadow-md' : 'shadow-sm'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo Section */}
        <div className="py-6 text-center">
          <Link to="/" className="inline-block">
            <h1
              className="text-3xl sm:text-4xl font-bold tracking-[0.2em] uppercase font-swarovski text-swarovski-black hover:text-swarovski-gold transition-colors duration-300"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {siteSettings.brandName}
            </h1>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="pb-6">
          <div className="flex justify-center gap-4 sm:gap-8 text-xs sm:text-sm tracking-wider font-medium">
            {categories
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
                  {categoryMap[category]} ({categoryCounts[category] || 0})
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
    </header>
  );
}
