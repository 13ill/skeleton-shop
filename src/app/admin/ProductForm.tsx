import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from './authContext';
import { ImageUpload } from './ImageUpload';
import { env } from '../../config/env';
import type { ProductWithImages } from '../../types/product';
import { useCategories } from '../context/CategoriesContext';

// Import SpecificationsEditor
import { SpecificationsEditor } from './SpecificationsEditor';

// Helper function to generate product ID from name
const generateProductId = (name: string): string => {
  // Convert to slug (lowercase, replace spaces with hyphens, remove special chars)
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  // Add timestamp to ensure uniqueness
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);

  return `${slug}-${timestamp}-${random}`;
};

export function ProductForm() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { categories } = useCategories();
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
    metaTitle: '',
    metaDescription: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [parsedImages, setParsedImages] = useState<string[]>([]);

  useEffect(() => {
    try {
      setParsedImages(formData.images ? JSON.parse(formData.images) : []);
    } catch {
      setParsedImages([]);
    }
  }, [formData.images]);

  useEffect(() => {
    if (isEditing && id) {
      fetchProduct();
    }
  }, [id, isEditing]);

  const fetchProduct = async () => {
    if (!token || !id) return;

    try {
      const response = await fetch(`${env.API_BASE_URL}/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }

      const data = await response.json();
      setFormData({
        id: data.id,
        name: data.name,
        category: data.category,
        price: data.price?.toString() || '',
        description: data.description || '',
        fullDescription: data.fullDescription || '',
        material: data.material || '',
        specifications: data.specifications ? JSON.stringify(data.specifications, null, 2) : '',
        images: data.images ? JSON.stringify(data.images) : '',
        metaTitle: data.metaTitle || '',
        metaDescription: data.metaDescription || '',
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
      // Auto-generate ID for new products
      const productId = isEditing ? id : generateProductId(formData.name);

      const categoryResponse = await fetch(`${env.API_BASE_URL}/categories`);
      const categories = await categoryResponse.json();
      const category = categories.find((c: any) => c.slug === formData.category);
      const categoryId = category?.id;

      const payload = {
        id: productId,
        name: formData.name,
        category: formData.category,
        categoryId,
        price: formData.price ? parseInt(formData.price) : null,
        description: formData.description,
        fullDescription: formData.fullDescription,
        material: formData.material || null,
        specifications: formData.specifications ? JSON.parse(formData.specifications) : null,
        images: formData.images ? JSON.parse(formData.images) : [],
        metaTitle: formData.metaTitle || null,
        metaDescription: formData.metaDescription || null,
      };

      const url = isEditing
        ? `${env.API_BASE_URL}/products/${id}`
        : `${env.API_BASE_URL}/products`;

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

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/admin');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <button
          onClick={handleCancel}
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
        {/* Product ID - Hidden and auto-generated */}
        <input
          type="hidden"
          name="id"
          value={formData.id}
          onChange={handleChange}
        />

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
          {!isEditing && (
            <p className="text-xs text-gray-500 mt-1">
              Product ID will be auto-generated from name
            </p>
          )}
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
            {categories
              .filter(c => c.slug !== 'all')
              .map(c => (
                <option key={c.id} value={c.slug}>{c.name} ({c.slug})</option>
              ))}
          </select>
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Price
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
            Short Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c8a96e]"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Specifications
          </label>
          <SpecificationsEditor
            value={formData.specifications}
            onChange={(value) => setFormData({ ...formData, specifications: value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Images
          </label>
          <ImageUpload
            initialImages={parsedImages}
            onImagesChange={(images) => setFormData({ ...formData, images: JSON.stringify(images) })}
          />
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">SEO (สำหรับ Google)</h2>
          <p className="text-xs text-gray-500 mb-4">เว้นว่างได้ ระบบจะใช้ชื่อ/คำอธิบายสินค้าโดยอัตโนมัติ</p>

          <div className="mb-4">
            <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 mb-1">
              Meta Title
            </label>
            <input
              id="metaTitle"
              name="metaTitle"
              type="text"
              maxLength={60}
              value={formData.metaTitle}
              onChange={handleChange}
              placeholder="ชื่อที่จะแสดงบนผลการค้นหา Google"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c8a96e]"
            />
            <p className="text-xs text-gray-400 mt-1">{(formData.metaTitle || '').length}/60</p>
          </div>

          <div>
            <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Meta Description
            </label>
            <textarea
              id="metaDescription"
              name="metaDescription"
              rows={2}
              maxLength={160}
              value={formData.metaDescription}
              onChange={handleChange}
              placeholder="คำอธิบายสั้น ๆ ที่จะแสดงใต้ชื่อบน Google"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c8a96e]"
            />
            <p className="text-xs text-gray-400 mt-1">{(formData.metaDescription || '').length}/160</p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-[#c8a96e] text-white rounded-md hover:bg-[#b89a5e] disabled:opacity-50"
          >
            {loading ? 'Saving...' : isEditing ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
