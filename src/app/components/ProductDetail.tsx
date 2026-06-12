import { useParams, Link } from "react-router";
import { products } from "../data/products";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <p className="text-center text-gray-500">ไมพบสินค้า</p>
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
              ฿{product.price.toLocaleString()}
            </p>
          )}

          <div className="border-t border-gray-200 pt-6 space-y-4">
            <div>
              <h3 className="text-sm tracking-wider uppercase text-gray-500 mb-2">
                รายละเอียด
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {product.material && (
              <div>
                <h3 className="text-sm tracking-wider uppercase text-gray-500 mb-2">
                  วัสดุ
                </h3>
                <p className="text-gray-700">
                  {product.material}
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-500 leading-relaxed">
              สินค้าทุกชิ้นได้รับการคัดสรรอย่างพิถีพิถัน พร้อมการณีต์คุณภาพ
              <br />
              สำหรับข้อมูลเพิ่มเติม กรุณาติดต่อเรา
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}