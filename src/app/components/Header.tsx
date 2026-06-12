import { useState } from "react";
import { Link } from "react-router";

const categoryMap: Record<string, string> = {
  "All": "ทั้งหมด",
  "Ring": "แหวน",
  "Necklace": "สร้อยคอ", 
  "Bracelet": "สร้อยข้อมือ"
};

const categories = ["All", "Ring", "Necklace", "Bracelet"];

export function Header() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
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
              className={`uppercase transition-colors hover:text-gray-900 $
                activeCategory === category
                  ? "text-gray-900 border-b border-gray-900 pb-1"
                  : "text-gray-500"
              }`}
            >
              {categoryMap[category]}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}