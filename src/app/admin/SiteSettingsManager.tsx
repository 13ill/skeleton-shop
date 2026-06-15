import { useState, useEffect } from 'react';
import { useAuth } from './authContext';
import { env } from '../../config/env';

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
    newsletterTitle: '',
    newsletterDescription: '',
    contactPageTitle: '',
    contactPageDescription: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'brand' | 'hero' | 'newsletter' | 'contact'>('brand');

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

            {/* Preview */}
            <div className="mt-6 p-4 bg-swarovski-gray rounded-lg">
              <p className="text-xs text-gray-500 mb-2">Preview:</p>
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">{settings.heroTitle || 'เครื่องประดับที่สะท้อนความเป็นคุณ'}</h3>
                <p className="text-gray-600 mb-4">{settings.heroSubtitle || 'เครื่องประดับเพชรพลอยคุณภาพสูง ที่คัดสรรความพิเศษให้คุณ'}</p>
                <button className="px-6 py-3 bg-swarovski-black text-white rounded-lg">
                  {settings.heroButtonText || 'ดูสินค้าทั้งหมด'}
                </button>
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
