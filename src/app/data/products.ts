import productsData from "./products-generated.json";

// แปลน category เป็นภาษาไทย
const categoryMap: Record<string, string> = {
  "ring": "แหวน",
  "necklace": "สร้อยคอ", 
  "bracelet": "สร้อยข้อมือ",
  "all": "ทั้งหมด"
};

export const products = productsData.map(product => ({
  ...product,
  categoryThai: categoryMap[product.category] || product.category
}));