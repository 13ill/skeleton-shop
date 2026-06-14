import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { products } from "../data/products";

const categoryMap: Record<string, string> = {
  "All": "ทั้งหมด",
  "Ring": "แหวน",
  "Necklace": "สร้อยคอ",
  "Bracelet": "สร้อยข้อมือ",
  "Earring": "ต่างหู"
};

const categories = ["All", "Ring", "Necklace", "Bracelet", "Earring"];

export function Header() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const navigate = useNavigate();
  const location = useLocation();

  // Count products per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      "All": products.length,
      "Ring": 0,
      "Necklace": 0,
      "Bracelet": 0,
      "Earring": 0
    };

    products.forEach((product) => {
      const category = product.category;
      if (category === "ring") counts.Ring++;
      else if (category === "necklace") counts.Necklace++;
      else if (category === "bracelet") counts.Bracelet++;
      else if (category === "earring") counts.Earring++;
    });

    return counts;
  }, [products]);

  // Update active category from navigation state
  useEffect(() => {
    if (location.state?.category) {
      setActiveCategory(location.state.category);
    }
  }, [location.state]);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);

    // Navigate to home with category state
    navigate("/", { state: { category } });
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Dispatch custom event for category change
    window.dispatchEvent(new CustomEvent("categoryChange", { detail: category }));
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
              {categoryMap[category]} ({categoryCounts[category]})
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}