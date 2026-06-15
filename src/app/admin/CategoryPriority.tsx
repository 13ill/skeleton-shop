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
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
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

    // Save only the affected items to backend
    const startIndex = Math.min(draggedIndex, dropIndex);
    const endIndex = Math.max(draggedIndex, dropIndex);

    for (let i = startIndex; i <= endIndex; i++) {
      try {
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/categories/${updatedCategories[i].id}/priority`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ priority: updatedCategories[i].priority }),
        });
      } catch (error) {
        console.error('Error updating category priority:', error);
        // Revert on error
        setCategories(categories);
        break;
      }
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
          <div
            key={category.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-colors cursor-move ${selectedCategoryId === category.id
              ? 'border-[#c8a96e] bg-[#c8a96e]/10'
              : draggedIndex === index
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
          </div>
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
