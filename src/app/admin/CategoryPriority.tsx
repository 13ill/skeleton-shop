import { useState, useEffect, useCallback, useRef, memo } from 'react';
import { useAuth } from './authContext';
import { env } from '../../config/env';

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

// Category item component with memo to prevent unnecessary re-renders
const CategoryItem = memo(({
  category,
  index,
  isDragging,
  isSelected,
  onDragStart,
  onDragOver,
  onDrop,
  onSelect
}: {
  category: Category;
  index: number;
  isDragging: boolean;
  isSelected: boolean;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onSelect: (categoryId: string) => void;
}) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, index)}
      onClick={() => onSelect(category.id)}
      className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-colors cursor-move ${isSelected
        ? 'border-[#c8a96e] bg-[#c8a96e]/10'
        : isDragging
          ? 'border-[#c8a96e] bg-[#c8a96e]/10'
          : 'border-gray-200 hover:border-gray-300'
        }`}
    >
      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-[#c8a96e] text-white rounded-full font-bold">
        {category.priority}
      </div>

      <div className="flex-1 cursor-pointer">
        <div className="font-medium">{category.name}</div>
        <div className="text-sm text-gray-500">{category.slug}</div>
      </div>
    </div>
  );
});

CategoryItem.displayName = 'CategoryItem';

export function CategoryPriority({ onCategorySelect, selectedCategoryId }: CategoryPriorityProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const { token } = useAuth();
  const tokenRef = useRef(token);

  // Update token ref when token changes
  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  const fetchCategories = useCallback(async () => {
    if (!tokenRef.current) return;

    setLoading(true);
    try {
      const response = await fetch(`${env.API_BASE_URL}/categories`, {
        headers: {
          Authorization: `Bearer ${tokenRef.current}`,
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
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newCategories = [...categories];
    const draggedItem = newCategories[draggedIndex];
    newCategories.splice(draggedIndex, 1);
    newCategories.splice(dropIndex, 0, draggedItem);

    // Update priorities based on new order
    const updatedCategories = newCategories.map((cat, index) => ({
      ...cat,
      priority: index + 1,
    }));

    setCategories(updatedCategories);
    setDraggedIndex(null);

    // Send only fromIndex, toIndex, and categoryId to backend
    try {
      const response = await fetch(`${env.API_BASE_URL}/categories/reorder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fromIndex: draggedIndex,
          toIndex: dropIndex,
          categoryId: draggedItem.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to reorder category');
      }
    } catch (error) {
      console.error('Error reordering category:', error);
      // Revert on error
      setCategories(categories);
    }
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
        Drag to reorder. Priority determines display order in interleaved mode.
      </p>

      <div className="space-y-2">
        {categories.map((category, index) => (
          <CategoryItem
            key={category.id}
            category={category}
            index={index}
            isDragging={draggedIndex === index}
            isSelected={selectedCategoryId === category.id}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onSelect={(id) => onCategorySelect?.(id)}
          />
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={() => onCategorySelect?.('')}
          className={`w-full py-2 px-4 rounded-md transition-colors ${!selectedCategoryId
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
