import { useState, useEffect } from "react";
import { Link } from "react-router";
import { products } from "../data/products";
import { motion } from "motion/react";

// แปลน category เป็นภาษาไทย
const categoryMap: Record<string, string> = {
  "ring": "แหวน",
  "necklace": "สร้อยคอ", 
  "bracelet": "สร้อยข้อมือ",
  "all": "ทั้งหมด"
};

const categories = ["All", "Ring", "Necklace", "Bracelet"];

export function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    const handleCategoryChange = (event: CustomEvent) => {
      setSelectedCategory(event.detail);
    };

    window.addEventListener("categoryChange", handleCategoryChange as EventListener);
    
    return () => {
      window.removeEventListener("categoryChange", handleCategoryChange as EventListener);
    };
  }, []);

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory.toLowerCase());

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product, index) => (
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
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              
              <div className="space-y-2">
                <p className="text-xs tracking-wider uppercase text-gray-500">
                  {categoryMap[product.category] || product.category}
                </p>
                <h3 className="text-base tracking-wide group-hover:text-gray-600 transition-colors">
                  {product.name}
                </h3>
                {product.price && product.price > 0 && (
                  <p className="text-sm text-gray-900">
                    ฿{product.price.toLocaleString()}
                  </p>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}