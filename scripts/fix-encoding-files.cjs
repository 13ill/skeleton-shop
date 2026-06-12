const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, '../src/app/components');
const dataDir = path.join(__dirname, '../src/app/data');

// ใช้ Unicode escape สำหรับภาษาไทยเพื่อหลีกเลี่ยงปัญหา encoding
const productDetailContent = `import { useParams, Link } from "react-router";
import { products } from "../data/products";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <p className="text-center text-gray-500">\u0e44\u0e21\u0e1e\u0e1a\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        \u0e01\u0e25\u0e31\u0e1a\u0e44\u0e1b\u0e2b\u0e19\u0e49\u0e32\u0e2b\u0e25\u0e31\u0e01
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden bg-gray-50 aspect-[3/4]"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col justify-center space-y-6"
        >
          <div className="space-y-2">
            <p className="text-xs tracking-wider uppercase text-gray-500">
              {product.category}
            </p>
            <h1 className="text-3xl tracking-wide">
              {product.name}
            </h1>
          </div>

          {product.price && (
            <p className="text-2xl text-gray-900">
              \u0e3f{product.price.toLocaleString()}
            </p>
          )}

          <div className="border-t border-gray-200 pt-6 space-y-4">
            <div>
              <h3 className="text-sm tracking-wider uppercase text-gray-500 mb-2">
                \u0e23\u0e32\u0e22\u0e25\u0e30\u0e40\u0e2d\u0e35\u0e22\u0e14
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {product.material && (
              <div>
                <h3 className="text-sm tracking-wider uppercase text-gray-500 mb-2">
                  \u0e27\u0e31\u0e2a\u0e14\u0e38
                </h3>
                <p className="text-gray-700">
                  {product.material}
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-500 leading-relaxed">
              \u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32\u0e17\u0e38\u0e01\u0e0a\u0e34\u0e49\u0e19\u0e44\u0e14\u0e49\u0e23\u0e31\u0e1a\u0e01\u0e32\u0e23\u0e04\u0e31\u0e14\u0e2a\u0e23\u0e23\u0e2d\u0e22\u0e48\u0e32\u0e07\u0e1e\u0e34\u0e16\u0e35\u0e1e\u0e34\u0e16\u0e31\u0e19 \u0e1e\u0e23\u0e49\u0e2d\u0e21\u0e01\u0e32\u0e23\u0e13\u0e35\u0e15\u0e4c\u0e04\u0e38\u0e13\u0e20\u0e32\u0e1e
              <br />
              \u0e2a\u0e33\u0e2b\u0e23\u0e31\u0e1a\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e40\u0e1e\u0e34\u0e48\u0e21\u0e40\u0e15\u0e34\u0e21 \u0e01\u0e23\u0e38\u0e13\u0e32\u0e15\u0e34\u0e14\u0e15\u0e48\u0e2d\u0e40\u0e23\u0e32
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}`;

const homeContent = `import { useState, useEffect } from "react";
import { Link } from "react-router";
import { products } from "../data/products";
import { motion } from "motion/react";

// \u0e41\u0e1b\u0e25\u0e19 category \u0e40\u0e1b\u0e47\u0e19\u0e20\u0e32\u0e29\u0e32\u0e44\u0e17\u0e22
const categoryMap: Record<string, string> = {
  "ring": "\u0e41\u0e2b\u0e27\u0e19",
  "necklace": "\u0e2a\u0e23\u0e49\u0e2d\u0e22\u0e04\u0e2d", 
  "bracelet": "\u0e2a\u0e23\u0e49\u0e2d\u0e22\u0e02\u0e49\u0e2d\u0e21\u0e37\u0e2d",
  "all": "\u0e17\u0e31\u0e49\u0e07\u0e2b\u0e21\u0e14"
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
              to={\`/product/\${product.id}\`}
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
                    \u0e3f{product.price.toLocaleString()}
                  </p>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}`;

const headerContent = `import { useState } from "react";
import { Link } from "react-router";

const categoryMap: Record<string, string> = {
  "All": "\u0e17\u0e31\u0e49\u0e07\u0e2b\u0e21\u0e14",
  "Ring": "\u0e41\u0e2b\u0e27\u0e19",
  "Necklace": "\u0e2a\u0e23\u0e49\u0e2d\u0e22\u0e04\u0e2d", 
  "Bracelet": "\u0e2a\u0e23\u0e49\u0e2d\u0e22\u0e02\u0e49\u0e2d\u0e21\u0e37\u0e2d"
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
              className={\`uppercase transition-colors hover:text-gray-900 \$
                activeCategory === category
                  ? "text-gray-900 border-b border-gray-900 pb-1"
                  : "text-gray-500"
              }\`}
            >
              {categoryMap[category]}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}`;

const footerContent = `import { MapPin, Instagram, Facebook } from "lucide-react";

const QRCodeLine = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Outer frame top-left */}
    <rect x="10" y="10" width="70" height="70" rx="8" fill="none" stroke="currentColor" strokeWidth="8"/>
    <rect x="26" y="26" width="38" height="38" rx="3" fill="currentColor"/>
    {/* Outer frame top-right */}
    <rect x="120" y="10" width="70" height="70" rx="8" fill="none" stroke="currentColor" strokeWidth="8"/>
    <rect x="136" y="26" width="38" height="38" rx="3" fill="currentColor"/>
    {/* Outer frame bottom-left */}
    <rect x="10" y="120" width="70" height="70" rx="8" fill="none" stroke="currentColor" strokeWidth="8"/>
    <rect x="26" y="136" width="38" height="38" rx="3" fill="currentColor"/>
    {/* Data modules */}
    <rect x="110" y="110" width="14" height="14" rx="2" fill="currentColor"/>
    <rect x="128" y="110" width="14" height="14" rx="2" fill="currentColor"/>
    <rect x="146" y="110" width="14" height="14" rx="2" fill="currentColor"/>
    <rect x="164" y="110" width="14" height="14" rx="2" fill="currentColor"/>
    <rect x="110" y="128" width="14" height="14" rx="2" fill="currentColor"/>
    <rect x="146" y="128" width="14" height="14" rx="2" fill="currentColor"/>
    <rect x="164" y="128" width="14" height="14" rx="2" fill="currentColor"/>
    <rect x="110" y="146" width="14" height="14" rx="2" fill="currentColor"/>
    <rect x="128" y="146" width="14" height="14" rx="2" fill="currentColor"/>
    <rect x="164" y="146" width="14" height="14" rx="2" fill="currentColor"/>
    <rect x="110" y="164" width="14" height="14" rx="2" fill="currentColor"/>
    <rect x="146" y="164" width="14" height="14" rx="2" fill="currentColor"/>
    <rect x="128" y="164" width="14" height="14" rx="2" fill="currentColor"/>
    <rect x="164" y="164" width="14" height="14" rx="2" fill="currentColor"/>
    {/* LINE logo center */}
    <rect x="82" y="82" width="36" height="36" rx="6" fill="currentColor"/>
    <text x="100" y="104" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="sans-serif">L</text>
  </svg>
);

export function Footer() {
  return (
    <footer className="bg-[#1a1a18] text-[#c8bfb0] mt-24">
      <div className="max-w-6xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">

          {/* Brand + Address */}
          <div className="space-y-6">
            <div>
              <h2 className="text-white font-light tracking-[0.25em] uppercase text-sm mb-1">Niwelry</h2>
              <div className="w-8 h-px bg-[#c8a96e] mb-6" />
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin size={14} className="text-[#c8a96e] mt-0.5 shrink-0" />
                <address className="not-italic text-xs leading-relaxed tracking-wide">
                  123 \u0e16\u0e19\u0e19\u0e2a\u0e38\u0e02\u0e38\u0e21\u0e27\u0e34\u0e17 \u0e0b\u0e2d\u0e22 11<br />
                  \u0e41\u0e02\u0e27\u0e04\u0e25\u0e2d\u0e07\u0e15\u0e35\u0e22\u0e40\u0e2b\u0e19\u0e37\u0e2d \u0e40\u0e02\u0e15\u0e27\u0e31\u0e12\u0e13\u0e32<br />
                  \u0e01\u0e23\u0e38\u0e07\u0e40\u0e17\u0e1e\u0e21\u0e2b\u0e32\u0e19\u0e04\u0e23 10110
                </address>
              </div>
              <p className="text-xs tracking-wide pl-[22px]">\u0e08\u0e31\u0e19\u0e23\u0e4c – \u0e40\u0e2a\u0e32\u0e23\u0e4c  10:00 – 19:00 \u0e19.</p>
            </div>
          </div>

          {/* Social */}
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-light tracking-[0.2em] uppercase text-xs mb-1">\u0e15\u0e34\u0e14\u0e15\u0e32\u0e21\u0e40\u0e23\u0e32</h3>
              <div className="w-8 h-px bg-[#c8a96e] mb-6" />
            </div>
            <div className="space-y-4">
              <a
                href="https://facebook.com/niwelry"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-xs tracking-widest uppercase hover:text-white transition-colors duration-300 group"
              >
                <span className="w-7 h-7 rounded-full border border-[#c8a96e]/40 flex items-center justify-center group-hover:border-[#c8a96e] group-hover:bg-[#c8a96e]/10 transition-all duration-300">
                  <Facebook size={13} className="text-[#c8a96e]" />
                </span>
                Facebook
              </a>
              <a
                href="https://instagram.com/niwelry"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-xs tracking-widest uppercase hover:text-white transition-colors duration-300 group"
              >
                <span className="w-7 h-7 rounded-full border border-[#c8a96e]/40 flex items-center justify-center group-hover:border-[#c8a96e] group-hover:bg-[#c8a96e]/10 transition-all duration-300">
                  <Instagram size={13} className="text-[#c8a96e]" />
                </span>
                Instagram
              </a>
            </div>
          </div>

          {/* LINE QR */}
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-light tracking-[0.2em] uppercase text-xs mb-1">LINE Official</h3>
              <div className="w-8 h-px bg-[#c8a96e] mb-6" />
            </div>
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 text-white bg-white p-1.5 rounded-md shrink-0">
                <QRCodeLine />
              </div>
              <div className="space-y-1.5 pt-1">
                <p className="text-xs tracking-wide leading-relaxed">\u0e2a\u0e41\u0e01\u0e19 QR Code<br />\u0e40\u0e1e\u0e37\u0e48\u0e2d\u0e15\u0e34\u0e14\u0e15\u0e48\u0e2d\u0e40\u0e23\u0e32\u0e1c\u0e48\u0e32\u0e19 LINE</p>
                <p className="text-[#c8a96e] text-xs tracking-widest">@niwelry</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] tracking-widest uppercase text-white/30">
            ? {new Date().getFullYear()} Niwelry. All rights reserved.
          </p>
          <div className="flex gap-1 items-center">
            {[...Array(3)].map((_, i) => (
              <span key={i} className="w-1 h-1 rounded-full bg-[#c8a96e]/40" />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}`;

const productsContent = `import productsData from "./products-generated.json";

// \u0e41\u0e1b\u0e25\u0e19 category \u0e40\u0e1b\u0e47\u0e19\u0e20\u0e32\u0e29\u0e32\u0e44\u0e17\u0e22
const categoryMap: Record<string, string> = {
  "ring": "\u0e41\u0e2b\u0e27\u0e19",
  "necklace": "\u0e2a\u0e23\u0e49\u0e2d\u0e22\u0e04\u0e2d", 
  "bracelet": "\u0e2a\u0e23\u0e49\u0e2d\u0e22\u0e02\u0e49\u0e2d\u0e21\u0e37\u0e2d",
  "all": "\u0e17\u0e31\u0e49\u0e07\u0e2b\u0e21\u0e14"
};

export const products = productsData.map(product => ({
  ...product,
  categoryThai: categoryMap[product.category] || product.category
}));`;

// เขียนไฟล์ทั้งหมดด้วย UTF-8
fs.writeFileSync(path.join(componentsDir, 'ProductDetail.tsx'), productDetailContent, 'utf8');
console.log('? Fixed ProductDetail.tsx');

fs.writeFileSync(path.join(componentsDir, 'Home.tsx'), homeContent, 'utf8');
console.log('? Fixed Home.tsx');

fs.writeFileSync(path.join(componentsDir, 'Header.tsx'), headerContent, 'utf8');
console.log('? Fixed Header.tsx');

fs.writeFileSync(path.join(componentsDir, 'Footer.tsx'), footerContent, 'utf8');
console.log('? Fixed Footer.tsx');

fs.writeFileSync(path.join(dataDir, 'products.ts'), productsContent, 'utf8');
console.log('? Fixed products.ts');

console.log('\n?? All files fixed with UTF-8 encoding using Unicode escapes!');
