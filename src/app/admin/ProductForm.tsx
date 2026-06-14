import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from './authContext';
import { ImageUpload } from './ImageUpload';
import type { ProductWithImages } from '../../types/product';

export function ProductForm() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: 'ring',
    price: '',
    description: '',
    fullDescription: '',
    material: '',
    specifications: '',
    images: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing && id) {
      fetchProduct();
    }
  }, [id, isEditing]);

  const fetchProduct = async () => {
    if (!token || !id) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }

      const product: ProductWithImages = await response.json();
      setFormData({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price?.toString() || '',
        description: product.description,
        fullDescription: product.fullDescription,
        material: product.material || '',
        specifications: JSON.stringify(product.specifications || {}, null, 2),
        images: JSON.stringify(product.images || []),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch product');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        id: formData.id,
        name: formData.name,
        category: formData.category,
        price: formData.price ? parseInt(formData.price) : null,
        description: formData.description,
        fullDescription: formData.fullDescription,
        material: formData.material || null,
        specifications: formData.specifications ? JSON.parse(formData.specifications) : null,
        images: formData.images ? JSON.parse(formData.images) : [],
      };

      const url = isEditing
        ? `${import.meta.env.VITE_API_BASE_URL}/products/${id}`
        : `${import.meta.env.VITE_API_BASE_URL}/products`;

      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save product');
      }

      navigate('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin')}
          className="text-gray-600 hover:text-gray-900"
        >
          ← Back to Products
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-6">
        {isEditing ? 'Edit Product' : 'Add New Product'}
      </h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow p-6">
        <div>
          <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-1">
            Product ID *
          </label>
          <input
            id="id"
            name="id"
            type="text"
            value={formData.id}
            onChange={handleChange}
            disabled={isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c8a96e] disabled:bg-gray-100"
            required
          />
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c8a96e]"
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c8a96e]"
            required
          >
            <option value="ring">Ring</option>
            <option value="necklace">Necklace</option>
            <option value="bracelet">Bracelet</option>
            <option value="earring">Earring</option>
            <option value="pendant">Pendant</option>
          </select>
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Price (฿)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c8a96e]"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Short Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c8a96e]"
            required
          />
        </div>

        <div>
          <label htmlFor="fullDescription" className="block text-sm font-medium text-gray-700 mb-1">
            Full Description
          </label>
          <textarea
            id="fullDescription"
            name="fullDescription"
            value={formData.fullDescription}
            onChange={handleChange}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c8a96e]"
          />
        </div>

        <div>
          <label htmlFor="material" className="block text-sm font-medium text-gray-700 mb-1">
            Material
          </label>
          <input
            id="material"
            name="material"
            type="text"
            value={formData.material}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c8a96e]"
          />
        </div>

        <div>
          <label htmlFor="specifications" className="block text-sm font-medium text-gray-700 mb-1">
            Specifications (JSON)
          </label>
          <textarea
            id="specifications"
            name="specifications"
            value={formData.specifications}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c8a96e] font-mono text-sm"
            placeholder='{"size": "Medium", "weight": "10g"}'
          />
        </div>

        <ImageUpload
          initialImages={formData.images ? JSON.parse(formData.images) : []}
          onImagesChange={(newImages) => {
            setFormData({
              ...formData,
              images: JSON.stringify(newImages),
            });
          }}
        />

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-[#c8a96e] text-white py-2 px-4 rounded-md hover:bg-[#b0955e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
