import { useParams, Link } from "react-router";
import { getProductById } from "../../services/productService";
import { categoryMap, type ProductWithImages } from "../../types/product";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { ProductImageGallery } from "./ProductImageGallery";

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductWithImages | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Load product
  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error("Failed to load product:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  // SEO: per-product <title> and meta description
  useEffect(() => {
    if (!product) return;
    const prevTitle = document.title;
    document.title = product.metaTitle || `${product.name} | Niwelry`;

    let tag = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    const created = !tag;
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('name', 'description');
      document.head.appendChild(tag);
    }
    const prevDesc = tag.getAttribute('content');
    tag.setAttribute('content', product.metaDescription || product.description || '');

    return () => {
      document.title = prevTitle;
      if (created && tag && tag.parentNode) tag.parentNode.removeChild(tag);
      else if (tag) tag.setAttribute('content', prevDesc || '');
    };
  }, [product]);

  const images = product?.images?.map(img =>
    img?.startsWith('http')
      ? img
      : img
  ) || [];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center text-gray-500">กำลังโหลด...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <p className="text-center text-gray-500">ไม่พบสินค้า</p>
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
        กลับไปหน้าหลัก
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ProductImageGallery images={images} productName={product.name} />
        </motion.div>

        {/* Product Information */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <div>
            <p className="text-sm text-swarovski-gold uppercase tracking-wider mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {categoryMap[product.category as keyof typeof categoryMap]}
            </p>
            <h1
              className="text-3xl sm:text-4xl font-bold text-swarovski-black mb-4"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {product.name}
            </h1>
            {product.price && (
              <p className="text-2xl font-semibold text-swarovski-gold">
                ฿{product.price.toLocaleString()}
              </p>
            )}
          </div>

          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          {product.fullDescription && (
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{product.fullDescription}</p>
            </div>
          )}

          {product.material && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-swarovski-black mb-2 uppercase tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                วัสดุ
              </h3>
              <p className="text-gray-700">{product.material}</p>
            </div>
          )}

          {product.specifications && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-swarovski-black mb-2 uppercase tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                สเปค
              </h3>
              <div className="text-gray-700">
                {typeof product.specifications === 'object' ? (
                  <ul className="space-y-1">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <li key={key} className="flex">
                        <span className="font-medium w-32">{key}:</span>
                        <span>{String(value)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>{String(product.specifications)}</p>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
