import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { env } from "../../config/env";

export interface CategoryInfo {
  id: string;
  name: string;        // label ภาษาไทย เช่น "แหวน"
  slug: string;        // identifier อังกฤษ เช่น "ring"
  priority: number;
  isActive: boolean;
}

interface CategoriesContextType {
  categories: CategoryInfo[];
  // map slug -> name (label ภาษาไทย) เพื่อใช้แทน categoryMap เดิม
  categoryMap: Record<string, string>;
  loading: boolean;
  refresh: () => Promise<void>;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

// Fallback hardcode (ใช้ถ้า API ล่ม) — สอดคล้องกับ category เดิมใน DB
const FALLBACK_CATEGORIES: CategoryInfo[] = [
  { id: 'fallback-all', name: 'ทั้งหมด', slug: 'all', priority: 0, isActive: true },
  { id: 'fallback-ring', name: 'แหวน', slug: 'ring', priority: 1, isActive: true },
  { id: 'fallback-necklace', name: 'สร้อยคอ', slug: 'necklace', priority: 2, isActive: true },
  { id: 'fallback-bracelet', name: 'สร้อยข้อมือ', slug: 'bracelet', priority: 3, isActive: true },
  { id: 'fallback-earring', name: 'ต่างหู', slug: 'earring', priority: 4, isActive: true },
  { id: 'fallback-pendant', name: 'จี้', slug: 'pendant', priority: 5, isActive: true },
];

function buildCategoryMap(categories: CategoryInfo[]): Record<string, string> {
  const map: Record<string, string> = { all: 'ทั้งหมด' };
  for (const cat of categories) {
    if (cat.isActive && cat.slug !== 'all') {
      map[cat.slug] = cat.name;
    }
  }
  return map;
}

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<CategoryInfo[]>(FALLBACK_CATEGORIES);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!env.API_BASE_URL) {
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`${env.API_BASE_URL}/categories`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data: CategoryInfo[] = await response.json();
      // กรองเฉพาะ active + เติม "all" ไว้หน้าสุด
      const active = data.filter(c => c.isActive);
      setCategories(active);
    } catch (error) {
      console.error('Error fetching categories, using fallback:', error);
      // คง fallback ไว้
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const categoryMap = buildCategoryMap(categories);

  return (
    <CategoriesContext.Provider value={{ categories, categoryMap, loading, refresh }}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const ctx = useContext(CategoriesContext);
  if (!ctx) {
    throw new Error('useCategories must be used within CategoriesProvider');
  }
  return ctx;
}
