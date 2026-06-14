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
  specifications: {
    size?: string;
    [key: string]: string | undefined;
  };
}

export interface ProductWithImages extends Product {
  images: string[];
}

export type Category = 'necklace' | 'ring' | 'bracelet' | 'earring' | 'pendant' | 'all';

export const categoryMap: Record<Category, string> = {
  all: 'ทั้งหมด',
  necklace: 'สร้อยคอ',
  ring: 'แหวน',
  bracelet: 'สร้อยข้อมือ',
  earring: 'ต่างหู',
  pendant: 'จี้',
};
