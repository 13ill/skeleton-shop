/**
 * Product type definitions
 */

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number | null;
  description: string;
  fullDescription: string;
  material: string;
  materials: string[];
  metaTitle?: string | null;
  metaDescription?: string | null;
  specifications: {
    size?: string;
    [key: string]: string | undefined;
  };
}

export interface ProductWithImages extends Product {
  images: string[];
  categoryId?: string;
  globalOrder?: number;
  categoryOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Category ตอนนี้เป็น string (dynamic) เพราะดึงจาก API
// ค่าที่ใช้บ่อยยังคงเป็น union เพื่อช่วย autocomplete ตอนเขียนโค้ด
export type Category = string;

// Fallback category map (ใช้ถ้า CategoriesContext ยังไม่พร้อม)
// ห้ามใช้โดยตรง — ใช้ useCategories().categoryMap แทน
export const fallbackCategoryMap: Record<string, string> = {
  all: 'ทั้งหมด',
  necklace: 'สร้อยคอ',
  ring: 'แหวน',
  bracelet: 'สร้อยข้อมือ',
  earring: 'ต่างหู',
  pendant: 'จี้',
};

// @deprecated ใช้ useCategories().categoryMap แทน
// (เก็บไว้ชั่วคราวเพื่อ backward compatibility — จะ remove ในอนาคต)
export const categoryMap: Record<string, string> = fallbackCategoryMap;
