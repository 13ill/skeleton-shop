import { useState, useEffect } from 'react';
import { useAuth } from './authContext';
import { env } from '../../config/env';
import { ImageUpload } from './ImageUpload';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const PLATFORMS = [
  { value: 'line', label: 'LINE', icon: '💬' },
  { value: 'facebook', label: 'Facebook', icon: '📘' },
  { value: 'instagram', label: 'Instagram', icon: '📷' },
  { value: 'phone', label: 'Phone', icon: '📞' },
  { value: 'email', label: 'Email', icon: '📧' },
  { value: 'qrcode', label: 'QR Code', icon: '📱' },
];

export function SocialLinksManager() {
  const { token } = useAuth();
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    platform: 'line',
    url: '',
    isActive: true,
  });

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const fetchSocialLinks = async () => {
    if (!token) return;

    try {
      const response = await fetch(`${env.API_BASE_URL}/social-links`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch social links');
      }

      const data = await response.json();
      setSocialLinks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch social links');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const url = editingId
        ? `${env.API_BASE_URL}/social-links/${editingId}`
        : `${env.API_BASE_URL}/social-links`;

      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save social link');
      }

      setEditingId(null);
      setFormData({ platform: 'line', url: '', isActive: true });
      fetchSocialLinks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save social link');
    }
  };

  const handleEdit = (link: SocialLink) => {
    setEditingId(link.id);
    setFormData({
      platform: link.platform,
      url: link.url,
      isActive: link.isActive,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this social link?')) return;
    if (!token) return;

    try {
      const response = await fetch(`${env.API_BASE_URL}/social-links/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete social link');
      }

      fetchSocialLinks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete social link');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ platform: 'line', url: '', isActive: true });
  };

  if (loading) {
    return <div className="text-gray-500">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold mb-4">Social Links & Contact</h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Platform *
          </label>
          <select
            value={formData.platform}
            onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c8a96e]"
            required
          >
            {PLATFORMS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.icon} {p.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {formData.platform === 'qrcode' ? 'QR Code Image' : 'URL / Contact Info'} *
          </label>
          {formData.platform === 'qrcode' ? (
            <input
              type="text"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="Enter image URL for QR code"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c8a96e]"
              required
            />
          ) : (
            <input
              type="text"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder={
                formData.platform === 'phone'
                  ? '+66xxxxxxxxx'
                  : formData.platform === 'email'
                  ? 'email@example.com'
                  : 'https://...'
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c8a96e]"
              required
            />
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="w-4 h-4 text-[#c8a96e] focus:ring-[#c8a96e]"
          />
          <label htmlFor="isActive" className="text-sm text-gray-700">
            Active
          </label>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 bg-[#c8a96e] text-white rounded-md hover:bg-[#b89a5e]"
          >
            {editingId ? 'Update' : 'Add'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* List */}
      <div className="space-y-2">
        {socialLinks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No social links added yet
          </div>
        ) : (
          socialLinks.map((link) => (
            <div
              key={link.id}
              className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                link.isActive ? 'border-gray-200' : 'border-gray-200 opacity-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {PLATFORMS.find((p) => p.value === link.platform)?.icon}
                </span>
                <div>
                  <div className="font-medium">
                    {PLATFORMS.find((p) => p.value === link.platform)?.label}
                  </div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">
                    {link.url}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(link)}
                  className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(link.id)}
                  className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
