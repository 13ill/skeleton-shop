import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from './authContext';
import type { ProductWithImages } from '../../types/product';

interface GlobalProductOrderProps {
  categoryId?: string;
  displayMode: 'interleaved' | 'grouped';
}

export function GlobalProductOrder({ categoryId, displayMode }: GlobalProductOrderProps) {
  const [products, setProducts] = useState<ProductWithImages[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  // Track previous values to prevent unnecessary fetches
  const prevCategoryIdRef = useRef<string | undefined>(undefined);
  const prevDisplayModeRef = useRef<'interleaved' | 'grouped' | undefined>(undefined);
  const categoryIdRef = useRef(categoryId);
  const displayModeRef = useRef(displayMode);
  const isInitialMountRef = useRef(true);

  // Update refs when props change
  useEffect(() => {
    categoryIdRef.current = categoryId;
    displayModeRef.current = displayMode;
  }, [categoryId, displayMode]);

  const fetchProducts = useCallback(async () => {
    if (!token) return;

    console.log('[GlobalProductOrder] Fetching products...', { categoryId: categoryIdRef.current, displayMode: displayModeRef.current });
    setLoading(true);
    try {
      const mode = displayModeRef.current === 'interleaved' ? 'interleaved' : 'grouped';
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products?mode=${mode}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      console.log('[GlobalProductOrder] Fetched products:', data.length);

      // Filter by category if selected
      const filteredProducts = categoryIdRef.current
        ? data.filter((p: ProductWithImages) => p.categoryId === categoryIdRef.current)
        : data;

      console.log('[GlobalProductOrder] Filtered products:', filteredProducts.length);
      setProducts(filteredProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    // Always fetch on initial mount
    if (isInitialMountRef.current) {
      console.log('[GlobalProductOrder] Initial mount, fetching products');
      fetchProducts();
      isInitialMountRef.current = false;
      prevCategoryIdRef.current = categoryId;
      prevDisplayModeRef.current = displayMode;
      return;
    }

    // Only fetch if categoryId or displayMode actually changed
    if (prevCategoryIdRef.current !== categoryId || prevDisplayModeRef.current !== displayMode) {
      console.log('[GlobalProductOrder] Props changed, fetching products', {
        prevCategoryId: prevCategoryIdRef.current,
        newCategoryId: categoryId,
        prevDisplayMode: prevDisplayModeRef.current,
        newDisplayMode: displayMode
      });
      fetchProducts();
      prevCategoryIdRef.current = categoryId;
      prevDisplayModeRef.current = displayMode;
    }
  }, [fetchProducts, categoryId, displayMode]);

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

    console.log('[GlobalProductOrder] Drag and drop:', { from: draggedIndex, to: dropIndex });

    const newProducts = [...products];
    const draggedItem = newProducts[draggedIndex];
    newProducts.splice(draggedIndex, 1);
    newProducts.splice(dropIndex, 0, draggedItem);

    setProducts(newProducts);
    setDraggedIndex(null);

    // Bulk update all orders in one API call
    console.log('[GlobalProductOrder] Bulk updating all orders');
    setSaving(true);
    try {
      const orders = newProducts.map((product, index) => ({
        id: product.id,
        order: index + 1,
      }));

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products/bulk-order`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mode: displayMode,
          orders,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to bulk update orders');
      }

      console.log('[GlobalProductOrder] Bulk order update completed');
    } catch (error) {
      console.error('Error bulk updating order:', error);
      alert('Failed to update order');
      // Revert on error
      setProducts(products);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-4">Product Order</h3>
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Product Order</h3>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/admin/products/new')}
            className="bg-[#c8a96e] text-white px-4 py-2 rounded-md hover:bg-[#b0955e] transition-colors"
          >
            Add Product
          </button>
          {saving && (
            <span className="text-sm text-gray-500 self-center">Saving...</span>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        {displayMode === 'interleaved'
          ? 'Interleaved mode: ring1, necklace1, earring1, ring2, necklace2...'
          : 'Grouped mode: ring1, ring2, ring3..., necklace1, necklace2...'}
      </p>

      {products.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No products found. Click "Add Product" to create one.
        </div>
      ) : (
        <div className="space-y-2">
          {products.map((product, index) => (
            <div
              key={product.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-colors cursor-move ${draggedIndex === index
                ? 'border-[#c8a96e] bg-[#c8a96e]/10'
                : 'border-gray-200 hover:border-gray-300'
                }`}
            >
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full font-bold text-gray-600">
                {index + 1}
              </div>

              <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0].startsWith('http')
                      ? product.images[0]
                      : product.images[0].startsWith('/uploads')
                        ? `${import.meta.env.VITE_API_BASE_URL}${product.images[0]}`
                        : product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    No image
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{product.name}</div>
                <div className="text-sm text-gray-500">
                  {product.price ? `฿${product.price.toLocaleString()}` : '-'}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                  className="px-3 py-1 text-sm text-[#c8a96e] hover:text-[#b0955e]"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="px-3 py-1 text-sm text-red-600 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
