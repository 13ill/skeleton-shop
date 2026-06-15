import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { getCategoryCounts } from "../../services/productService";
import { categoryMap, type Category } from "../../types/product";

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
  const location = useLocation();
  const navigate = useNavigate();

  // Get current category from URL
  const getCurrentCategory = (): Category => {
    const params = new URLSearchParams(location.search);
    return (params.get('category') as Category) || 'all';
  };

  const [activeCategory, setActiveCategory] = useState<Category>(getCurrentCategory());

  // Update active category when URL changes
  useEffect(() => {
    setActiveCategory(getCurrentCategory());
  }, [location.search]);

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

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Link to="/" className="block text-center mb-8">
          <h1 className="text-2xl tracking-[0.3em] uppercase">Niwelry</h1>
        </Link>

        <nav className="flex justify-center gap-8 text-sm tracking-wider">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`uppercase transition-colors hover:text-gray-900 ${activeCategory === category
                ? "text-gray-900 border-b border-gray-900 pb-1"
                : "text-gray-500"
                }`}
            >
              {categoryMap[category]} ({categoryCounts[category] || 0})
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
