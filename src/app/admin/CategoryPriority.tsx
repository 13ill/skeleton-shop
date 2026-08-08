import { useState, useEffect, useCallback, useRef, memo } from 'react';
import { useAuth } from './authContext';
import { env } from '../../config/env';
import { fetchWithRetry, getErrorMessage } from '../../utils/api';

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
      className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-move ${isSelected
        ? 'border-[#c8a96e] bg-[#c8a96e]/10 shadow-md'
        : isDragging
          ? 'border-[#c8a96e] bg-[#c8a96e]/10 shadow-lg opacity-75 scale-105'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
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
  const [saving, setSaving] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { token } = useAuth();
  const tokenRef = useRef(token);

  // CRUD form state
  const [showForm, setShowForm] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '', isActive: true });
  const [formError, setFormError] = useState('');

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
    setSaving(true);
    setSaveSuccess(false);

    // Send only fromIndex, toIndex, and categoryId to backend
    try {
      const response = await fetchWithRetry(`${env.API_BASE_URL}/categories/reorder`, {
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
        retries: 3,
        retryDelay: 1000,
      });

      if (!response.ok) {
        throw new Error('Failed to reorder category');
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (error) {
      console.error('Error reordering category:', error);
      alert(`Failed to reorder category: ${getErrorMessage(error)}`);
      // Revert on error
      setCategories(categories);
    } finally {
      setSaving(false);
    }
  };

  // ===== CRUD handlers =====
  const resetForm = () => {
    setFormData({ name: '', slug: '', isActive: true });
    setEditingCatId(null);
    setShowForm(false);
    setFormError('');
  };

  const handleAddClick = () => {
    setFormData({ name: '', slug: '', isActive: true });
    setEditingCatId(null);
    setShowForm(true);
    setFormError('');
  };

  const handleEditClick = (cat: Category) => {
    setFormData({ name: cat.name, slug: cat.slug, isActive: cat.isActive });
    setEditingCatId(cat.id);
    setShowForm(true);
    setFormError('');
  };

  const handleDeleteClick = async (cat: Category) => {
    if (!token) return;
    if (!confirm(`ลบหมวด "${cat.name}" ใช่ไหม?`)) return;
    try {
      const res = await fetch(`${env.API_BASE_URL}/categories/${cat.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to delete');
      }
      fetchCategories();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete category');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setFormError('');

    if (!formData.name.trim() || !formData.slug.trim()) {
      setFormError('กรอก name และ slug ให้ครบ');
      return;
    }

    try {
      const url = editingCatId
        ? `${env.API_BASE_URL}/categories/${editingCatId}`
        : `${env.API_BASE_URL}/categories`;
      const method = editingCatId ? 'PUT' : 'POST';
      const body = editingCatId
        ? { name: formData.name, slug: formData.slug, isActive: formData.isActive }
        : { name: formData.name, slug: formData.slug, priority: categories.length + 1 };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to save');
      }

      resetForm();
      fetchCategories();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save category');
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
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Category Order</h3>
        {saving && (
          <div className="flex items-center gap-2 text-sm text-[#c8a96e]">
            <div className="w-4 h-4 border-2 border-[#c8a96e] border-t-transparent rounded-full animate-spin" />
            Saving...
          </div>
        )}
        {saveSuccess && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Saved!
          </div>
        )}
      </div>
      <p className="text-sm text-gray-500 mb-4">
        Drag to reorder. Priority determines display order in interleaved mode.
      </p>

      <div className="space-y-2">
        {categories.map((category, index) => (
          <div key={category.id} className="flex items-center gap-2">
            <div className="flex-1">
              <CategoryItem
                category={category}
                index={index}
                isDragging={draggedIndex === index}
                isSelected={selectedCategoryId === category.id}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onSelect={(id) => onCategorySelect?.(id)}
              />
            </div>
            <button
              type="button"
              onClick={() => handleEditClick(category)}
              className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
            >
              แก้
            </button>
            <button
              type="button"
              onClick={() => handleDeleteClick(category)}
              className="px-2 py-1 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100"
            >
              ลบ
            </button>
          </div>
        ))}
      </div>

      {/* CRUD Form */}
      {showForm ? (
        <form onSubmit={handleSubmit} className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
          <h4 className="font-medium">{editingCatId ? 'แก้ไขหมวด' : 'เพิ่มหมวดใหม่'}</h4>
          {formError && (
            <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">{formError}</div>
          )}
          <div>
            <label className="block text-xs text-gray-600 mb-1">ชื่อ (ไทย) *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="เช่น แหวน, สร้อยคอ"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c8a96e]"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Slug (อังกฤษ) *</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
              placeholder="เช่น ring, necklace"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c8a96e]"
              required
            />
          </div>
          {editingCatId && (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4"
              />
              Active
            </label>
          )}
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-[#c8a96e] text-white rounded-md hover:bg-[#b89a5e]">
              {editingCatId ? 'บันทึก' : 'เพิ่ม'}
            </button>
            <button type="button" onClick={resetForm} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">
              ยกเลิก
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={handleAddClick}
          className="mt-4 w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-[#c8a96e] hover:text-[#c8a96e] transition-colors"
        >
          + เพิ่มหมวดใหม่
        </button>
      )}

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
