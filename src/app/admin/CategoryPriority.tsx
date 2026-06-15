import { useState, useEffect } from 'react';
import { useAuth } from './authContext';

interface Category {
  id: string;
  name: string;
  slug: string;
  priority: number;
  isActive: boolean;
}

interface CategoryPriorityProps {
  onCategorySelect?: (categoryId: string) => void;
  selectedCategoryId?: string;
}

export function CategoryPriority({ onCategorySelect, selectedCategoryId }: CategoryPriorityProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    fetchCategories();
  }, [token]);

  const fetchCategories = async () => {
    if (!token) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePriorityChange = async (categoryId: string, newPriority: number) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/categories/${categoryId}/priority`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ priority: newPriority }),
      });

      if (!response.ok) {
        throw new Error('Failed to update priority');
      }

      // Refresh categories
      fetchCategories();
    } catch (error) {
      console.error('Error updating priority:', error);
      alert('Failed to update priority');
    }
  };

  const handleMoveUp = (category: Category) => {
    if (category.priority <= 1) return;
    handlePriorityChange(category.id, category.priority - 1);
  };

  const handleMoveDown = (category: Category) => {
    handlePriorityChange(category.id, category.priority + 1);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-4">Category Order</h3>
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold mb-4">Category Order</h3>
      <p className="text-sm text-gray-500 mb-4">
        Drag or use arrows to reorder. Priority determines display order in interleaved mode.
      </p>

      <div className="space-y-2">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-colors ${
              selectedCategoryId === category.id
                ? 'border-[#c8a96e] bg-[#c8a96e]/10'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-[#c8a96e] text-white rounded-full font-bold">
              {category.priority}
            </div>

            <div
              className="flex-1 cursor-pointer"
              onClick={() => onCategorySelect?.(category.id)}
            >
              <div className="font-medium">{category.name}</div>
              <div className="text-sm text-gray-500">{category.slug}</div>
            </div>

            <div className="flex flex-col gap-1">
              <button
                onClick={() => handleMoveUp(category)}
                disabled={category.priority <= 1}
                className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ↑
              </button>
              <button
                onClick={() => handleMoveDown(category)}
                className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
              >
                ↓
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={() => onCategorySelect?.('')}
          className={`w-full py-2 px-4 rounded-md transition-colors ${
            !selectedCategoryId
              ? 'bg-[#c8a96e] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Show All Products
        </button>
      </div>
    </div>
  );
}
