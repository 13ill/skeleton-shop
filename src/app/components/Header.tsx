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
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Link to="/" className="block text-center mb-8">
          <h1 className="text-2xl tracking-[0.3em] uppercase">{siteSettings.brandName}</h1>
        </Link>

        <nav className="flex justify-center gap-8 text-sm tracking-wider">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`uppercase transition-colors hover:text-gray-900 ${!isContactPage && activeCategory === category
                ? "text-gray-900 border-b border-gray-900 pb-1"
                : "text-gray-500"
                }`}
            >
              {categoryMap[category]} ({categoryCounts[category] || 0})
            </button>
          ))}
          <button
            onClick={handleContactClick}
            className={`uppercase transition-colors hover:text-gray-900 ${isContactPage
              ? "text-gray-900 border-b border-gray-900 pb-1"
              : "text-gray-500"
              }`}
          >
            ติดต่อเรา
          </button>
        </nav>
      </div>
    </header>
  );
}
