import { useState, useEffect } from 'react';
import { useAuth } from './authContext';
import { env } from '../../config/env';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface SiteSettings {
  id: string;
  brandName: string;
  tagline: string | null;
  address: string | null;
  openingHours: string | null;
  phone: string | null;
  email: string | null;
  heroTitle: string | null;
  heroSubtitle: string | null;
  heroButtonText: string | null;
  heroBackgroundImage: string | null;
  heroOverlayColor: string | null;
  newsletterTitle: string | null;
  newsletterDescription: string | null;
  contactPageTitle: string | null;
  contactPageDescription: string | null;
}

export function SiteSettingsManager() {
  const { token } = useAuth();
  const [settings, setSettings] = useState<SiteSettings>({
    id: '',
    brandName: 'Niwelry',
    tagline: '',
    address: '',
    openingHours: '',
    phone: '',
    email: '',
    heroTitle: '',
    heroSubtitle: '',
    heroButtonText: '',
    heroBackgroundImage: null,
    heroOverlayColor: 'rgba(0, 0, 0, 0.4)',
    newsletterTitle: '',
    newsletterDescription: '',
    contactPageTitle: '',
    contactPageDescription: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'brand' | 'hero' | 'newsletter' | 'contact'>('brand');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    if (!token) return;

    try {
      const response = await fetch(`${env.API_BASE_URL}/site-settings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch site settings');
      }

      const data = await response.json();
      setSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch site settings');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${env.API_BASE_URL}/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      setSettings({ ...settings, heroBackgroundImage: data.url });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setSettings({ ...settings, heroBackgroundImage: null });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setSaving(true);
    setError('');

    try {
      const response = await fetch(`${env.API_BASE_URL}/site-settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error('Failed to save site settings');
      }

      const data = await response.json();
      setSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save site settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-gray-500">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold mb-6">Site Settings</h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b mb-6">
        <button
          onClick={() => setActiveTab('brand')}
          className={`px-4 py-2 font-medium transition-colors ${activeTab === 'brand'
              ? 'text-swarovski-purple border-b-2 border-swarovski-purple'
              : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          Brand Info
        </button>
        <button
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-2 font-medium transition-colors ${activeTab === 'hero'
              ? 'text-swarovski-purple border-b-2 border-swarovski-purple'
              : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          Hero Section
        </button>
        <button
          onClick={() => setActiveTab('newsletter')}
          className={`px-4 py-2 font-medium transition-colors ${activeTab === 'newsletter'
              ? 'text-swarovski-purple border-b-2 border-swarovski-purple'
              : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          Newsletter
        </button>
        <button
          onClick={() => setActiveTab('contact')}
          className={`px-4 py-2 font-medium transition-colors ${activeTab === 'contact'
              ? 'text-swarovski-purple border-b-2 border-swarovski-purple'
              : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          Contact Page
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Brand Info Tab */}
        {activeTab === 'brand' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brand Name *
              </label>
              <input
                type="text"
                value={settings.brandName}
                onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-swarovski-purple"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tagline
              </label>
              <input
                type="text"
                value={settings.tagline || ''}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                placeholder="เครื่องประดับเพชรพลอยคุณภาพสูง"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-swarovski-purple"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                value={settings.address || ''}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                rows={4}
                placeholder="123 ถนนสุขุมวิท ซอย 11&#10;แขวคลองตียเหนือ เขตวัฒณา&#10;กรุงเทพมหานคร 10110"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-swarovski-purple"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opening Hours
              </label>
              <input
                type="text"
                value={settings.openingHours || ''}
                onChange={(e) => setSettings({ ...settings, openingHours: e.target.value })}
                placeholder="จันร์ - เสาร์  10:00 - 19:00 น."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-swarovski-purple"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="text"
                value={settings.phone || ''}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                placeholder="+66xxxxxxxxx"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-swarovski-purple"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={settings.email || ''}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                placeholder="contact@niwelry.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-swarovski-purple"
              />
            </div>
          </div>
        )}

        {/* Hero Section Tab */}
        {activeTab === 'hero' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hero Title
              </label>
              <input
                type="text"
                value={settings.heroTitle || ''}
                onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                placeholder="เครื่องประดับที่สะท้อนความเป็นคุณ"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-swarovski-purple"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hero Subtitle
              </label>
              <textarea
                value={settings.heroSubtitle || ''}
                onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                rows={3}
                placeholder="เครื่องประดับเพชรพลอยคุณภาพสูง ที่คัดสรรความพิเศษให้คุณ"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-swarovski-purple"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hero Button Text
              </label>
              <input
                type="text"
                value={settings.heroButtonText || ''}
                onChange={(e) => setSettings({ ...settings, heroButtonText: e.target.value })}
                placeholder="ดูสินค้าทั้งหมด"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-swarovski-purple"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hero Background Image
              </label>
              <div className="space-y-4">
                {settings.heroBackgroundImage ? (
                  <div className="relative">
                    <img
                      src={settings.heroBackgroundImage}
                      alt="Hero Background"
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-sm text-gray-500 mb-4">No image uploaded</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-swarovski-purple text-white rounded-lg hover:bg-swarovski-purple-light transition-colors cursor-pointer">
                    <Upload size={18} />
                    {uploading ? 'Uploading...' : 'Upload Image'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hero Overlay Color (RGBA)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={settings.heroOverlayColor || 'rgba(0, 0, 0, 0.4)'}
                  onChange={(e) => setSettings({ ...settings, heroOverlayColor: e.target.value })}
                  placeholder="rgba(0, 0, 0, 0.4)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-swarovski-purple"
                />
                <input
                  type="color"
                  value={settings.heroOverlayColor?.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)?.slice(1).join(',') || '000000'}
                  onChange={(e) => {
                    const hex = e.target.value;
                    const r = parseInt(hex.slice(1, 3), 16);
                    const g = parseInt(hex.slice(3, 5), 16);
                    const b = parseInt(hex.slice(5, 7), 16);
                    setSettings({ ...settings, heroOverlayColor: `rgba(${r}, ${g}, ${b}, 0.4)` });
                  }}
                  className="w-12 h-10 rounded cursor-pointer"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Format: rgba(r, g, b, a) e.g., rgba(0, 0, 0, 0.4)</p>
            </div>

            {/* Preview */}
            <div className="mt-6 p-4 bg-swarovski-gray rounded-lg">
              <p className="text-xs text-gray-500 mb-2">Preview:</p>
              <div
                className="text-center p-8 rounded-lg relative overflow-hidden"
                style={{
                  backgroundImage: settings.heroBackgroundImage ? `url(${settings.heroBackgroundImage})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{ backgroundColor: settings.heroOverlayColor || 'rgba(0, 0, 0, 0.4)' }}
                />
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-2 text-white">{settings.heroTitle || 'เครื่องประดับที่สะท้อนความเป็นคุณ'}</h3>
                  <p className="text-white/80 mb-4">{settings.heroSubtitle || 'เครื่องประดับเพชรพลอยคุณภาพสูง ที่คัดสรรความพิเศษให้คุณ'}</p>
                  <button className="px-6 py-3 bg-swarovski-black text-white rounded-lg">
                    {settings.heroButtonText || 'ดูสินค้าทั้งหมด'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Newsletter Tab */}
        {activeTab === 'newsletter' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Newsletter Title
              </label>
              <input
                type="text"
                value={settings.newsletterTitle || ''}
                onChange={(e) => setSettings({ ...settings, newsletterTitle: e.target.value })}
                placeholder="รับข่าวสารและโปรโมชั่นพิเศษ"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-swarovski-purple"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Newsletter Description
              </label>
              <textarea
                value={settings.newsletterDescription || ''}
                onChange={(e) => setSettings({ ...settings, newsletterDescription: e.target.value })}
                rows={3}
                placeholder="สมัครรับจดหมายข่าวสารเพื่อไม่พลาดโปรโมชั่นและสินค้าใหม่ล่าสุด"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-swarovski-purple"
              />
            </div>

            {/* Preview */}
            <div className="mt-6 p-4 bg-swarovski-purple rounded-lg">
              <p className="text-xs text-white/80 mb-2">Preview:</p>
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2 text-white">{settings.newsletterTitle || 'รับข่าวสารและโปรโมชั่นพิเศษ'}</h3>
                <p className="text-white/80 mb-4">{settings.newsletterDescription || 'สมัครรับจดหมายข่าวสารเพื่อไม่พลาดโปรโมชั่นและสินค้าใหม่ล่าสุด'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Contact Page Tab */}
        {activeTab === 'contact' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Page Title
              </label>
              <input
                type="text"
                value={settings.contactPageTitle || ''}
                onChange={(e) => setSettings({ ...settings, contactPageTitle: e.target.value })}
                placeholder="ติดต่อเรา"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-swarovski-purple"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Page Description
              </label>
              <textarea
                value={settings.contactPageDescription || ''}
                onChange={(e) => setSettings({ ...settings, contactPageDescription: e.target.value })}
                rows={3}
                placeholder="เราพร้อมให้บริการคุณตลอด 24 ชั่วโมง"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-swarovski-purple"
              />
            </div>

            {/* Preview */}
            <div className="mt-6 p-4 bg-swarovski-gray rounded-lg">
              <p className="text-xs text-gray-500 mb-2">Preview:</p>
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">{settings.contactPageTitle || 'ติดต่อเรา'}</h3>
                <p className="text-gray-600">{settings.contactPageDescription || 'เราพร้อมให้บริการคุณตลอด 24 ชั่วโมง'}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-6 border-t">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-swarovski-purple text-white rounded-md hover:bg-swarovski-purple-light disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
