import { useState, useEffect } from 'react';
import { useAuth } from './authContext';
import { env } from '../../config/env';
import { Upload, X, Image as ImageIcon, ToggleLeft, ToggleRight } from 'lucide-react';

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
  heroTextStrokeColor: string | null;
  heroTextStrokeWidth: number | null;
  heroBorderColor: string | null;
  heroShowBorder: boolean;
  newsletterTitle: string | null;
  newsletterDescription: string | null;
  newsletterBackgroundImage: string | null;
  newsletterTextStrokeColor: string | null;
  newsletterTextStrokeWidth: number | null;
  newsletterBorderColor: string | null;
  newsletterShowBorder: boolean;
  contactPageTitle: string | null;
  contactPageDescription: string | null;
  contactBackgroundImage: string | null;
  contactTextStrokeColor: string | null;
  contactTextStrokeWidth: number | null;
  contactBorderColor: string | null;
  contactShowBorder: boolean;
  domain: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  ogImageUrl: string | null;
  seoIndexable: boolean;
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
    heroTextStrokeColor: '#ffffff',
    heroTextStrokeWidth: 0.5,
    heroBorderColor: '#d4af37',
    heroShowBorder: false,
    newsletterTitle: '',
    newsletterDescription: '',
    newsletterBackgroundImage: null,
    newsletterTextStrokeColor: '#ffffff',
    newsletterTextStrokeWidth: 0.5,
    newsletterBorderColor: '#d4af37',
    newsletterShowBorder: false,
    contactPageTitle: '',
    contactPageDescription: '',
    contactBackgroundImage: null,
    contactTextStrokeColor: '#ffffff',
    contactTextStrokeWidth: 0.5,
    contactBorderColor: '#d4af37',
    contactShowBorder: false,
    domain: null,
    seoTitle: null,
    seoDescription: null,
    seoKeywords: null,
    ogImageUrl: null,
    seoIndexable: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'brand' | 'hero' | 'newsletter' | 'contact' | 'seo'>('brand');
  const [uploading, setUploading] = useState<string | null>(null);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(field);
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
      setSettings({ ...settings, [field]: data.url });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploading(null);
    }
  };

  const handleRemoveImage = (field: string) => {
    setSettings({ ...settings, [field]: null });
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

  const ImageUploadSection = ({
    label,
    field,
    image,
    onRemove
  }: {
    label: string;
    field: string;
    image: string | null;
    onRemove: () => void;
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="space-y-4">
        {image ? (
          <div className="relative">
            <img
              src={image}
              alt={label}
              className="w-full h-48 object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
            <button
              type="button"
              onClick={onRemove}
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
        <label className="flex items-center justify-center gap-2 px-4 py-2 bg-swarovski-black text-white rounded-lg hover:bg-swarovski-gold transition-colors cursor-pointer">
          <Upload size={18} />
          {uploading === field ? 'Uploading...' : 'Upload Image'}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, field)}
            className="hidden"
            disabled={uploading === field}
          />
        </label>
      </div>
    </div>
  );

  const BorderControlSection = ({
    borderColor,
    showBorder,
    onBorderColorChange,
    onShowBorderChange
  }: {
    borderColor: string | null;
    showBorder: boolean;
    onBorderColorChange: (color: string) => void;
    onShowBorderChange: (show: boolean) => void;
  }) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Show Border
        </label>
        <button
          type="button"
          onClick={() => onShowBorderChange(!showBorder)}
          className="flex items-center gap-2"
        >
          {showBorder ? <ToggleRight size={24} className="text-swarovski-gold" /> : <ToggleLeft size={24} className="text-gray-400" />}
        </button>
      </div>

      {showBorder && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Border Color
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={borderColor || '#d4af37'}
              onChange={(e) => onBorderColorChange(e.target.value)}
              placeholder="#d4af37"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-swarovski-gold"
            />
            <input
              type="color"
              value={borderColor || '#d4af37'}
              onChange={(e) => onBorderColorChange(e.target.value)}
              className="w-12 h-10 rounded cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );

  const TextStrokeControlSection = ({
    strokeColor,
    strokeWidth,
    onStrokeColorChange,
    onStrokeWidthChange
  }: {
    strokeColor: string | null;
    strokeWidth: number | null;
    onStrokeColorChange: (color: string) => void;
    onStrokeWidthChange: (width: number) => void;
  }) => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Text Stroke Color
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={strokeColor || '#ffffff'}
            onChange={(e) => onStrokeColorChange(e.target.value)}
            placeholder="#ffffff"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-swarovski-gold"
          />
          <input
            type="color"
            value={strokeColor || '#ffffff'}
            onChange={(e) => onStrokeColorChange(e.target.value)}
            className="w-12 h-10 rounded cursor-pointer"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Text Stroke Width (px)
        </label>
        <input
          type="number"
          value={strokeWidth || 0.5}
          onChange={(e) => onStrokeWidthChange(parseFloat(e.target.value) || 0.5)}
          min="0"
          max="5"
          step="0.1"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-swarovski-gold"
        />
        <p className="text-xs text-gray-500 mt-1">Recommended: 1-3px</p>
      </div>
    </div>
  );

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
            ? 'text-swarovski-gold border-b-2 border-swarovski-gold'
            : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          Brand Info
        </button>
        <button
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-2 font-medium transition-colors ${activeTab === 'hero'
            ? 'text-swarovski-gold border-b-2 border-swarovski-gold'
            : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          Hero Section
        </button>
        <button
          onClick={() => setActiveTab('newsletter')}
          className={`px-4 py-2 font-medium transition-colors ${activeTab === 'newsletter'
            ? 'text-swarovski-gold border-b-2 border-swarovski-gold'
            : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          Newsletter
        </button>
        <button
          onClick={() => setActiveTab('contact')}
          className={`px-4 py-2 font-medium transition-colors ${activeTab === 'contact'
            ? 'text-swarovski-gold border-b-2 border-swarovski-gold'
            : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          Contact Page
        </button>
        <button
          onClick={() => setActiveTab('seo')}
          className={`px-4 py-2 font-medium transition-colors ${activeTab === 'seo'
            ? 'text-swarovski-gold border-b-2 border-swarovski-gold'
            : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          🔍 SEO
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-swarovski-gold"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-swarovski-gold"
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
                placeholder="123 ถนนสุขุมวิท ซอย 11&#10;แขวงคลองเตยเหนือ เขตวัฒนา&#10;กรุงเทพมหานคร 10110"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-swarovski-gold"
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
                placeholder="จันทร์ - เสาร์  10:00 - 19:00 น."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-swarovski-gold"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-swarovski-gold"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-swarovski-gold"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-swarovski-gold"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-swarovski-gold"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-swarovski-gold"
              />
            </div>

            <ImageUploadSection
              label="Hero Background Image"
              field="heroBackgroundImage"
              image={settings.heroBackgroundImage}
              onRemove={() => handleRemoveImage('heroBackgroundImage')}
            />

            <TextStrokeControlSection
              strokeColor={settings.heroTextStrokeColor}
              strokeWidth={settings.heroTextStrokeWidth}
              onStrokeColorChange={(color) => setSettings({ ...settings, heroTextStrokeColor: color })}
              onStrokeWidthChange={(width) => setSettings({ ...settings, heroTextStrokeWidth: width })}
            />

            <BorderControlSection
              borderColor={settings.heroBorderColor}
              showBorder={settings.heroShowBorder}
              onBorderColorChange={(color) => setSettings({ ...settings, heroBorderColor: color })}
              onShowBorderChange={(show) => setSettings({ ...settings, heroShowBorder: show })}
            />

            {/* Preview */}
            <div className="mt-6 p-4 bg-swarovski-gray rounded-lg">
              <p className="text-xs text-gray-500 mb-2">Preview:</p>
              <div
                className="text-center p-8 rounded-lg relative overflow-hidden"
                style={{
                  backgroundImage: settings.heroBackgroundImage ? `url(${settings.heroBackgroundImage})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  border: settings.heroShowBorder ? `4px solid ${settings.heroBorderColor}` : 'none',
                }}
              >
                <div className="relative z-10">
                  <h3
                    className="text-2xl font-bold mb-2"
                    style={{
                      fontFamily: 'Montserrat, sans-serif',
                      WebkitTextStroke: `${settings.heroTextStrokeWidth || 0.5}px ${settings.heroTextStrokeColor || '#ffffff'}`,
                      color: settings.heroBackgroundImage ? 'white' : 'inherit',
                    }}
                  >
                    {settings.heroTitle || 'เครื่องประดับที่สะท้อนความเป็นคุณ'}
                  </h3>
                  <p
                    className="mb-4"
                    style={{
                      WebkitTextStroke: `${settings.heroTextStrokeWidth || 0.5}px ${settings.heroTextStrokeColor || '#ffffff'}`,
                      color: settings.heroBackgroundImage ? 'white' : 'inherit',
                    }}
                  >
                    {settings.heroSubtitle || 'เครื่องประดับเพชรพลอยคุณภาพสูง ที่คัดสรรความพิเศษให้คุณ'}
                  </p>
                  {settings.heroButtonText && (
                    <button className="px-6 py-3 bg-swarovski-black text-white rounded-lg">
                      {settings.heroButtonText}
                    </button>
                  )}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-swarovski-gold"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-swarovski-gold"
              />
            </div>

            <ImageUploadSection
              label="Newsletter Background Image"
              field="newsletterBackgroundImage"
              image={settings.newsletterBackgroundImage}
              onRemove={() => handleRemoveImage('newsletterBackgroundImage')}
            />

            <TextStrokeControlSection
              strokeColor={settings.newsletterTextStrokeColor}
              strokeWidth={settings.newsletterTextStrokeWidth}
              onStrokeColorChange={(color) => setSettings({ ...settings, newsletterTextStrokeColor: color })}
              onStrokeWidthChange={(width) => setSettings({ ...settings, newsletterTextStrokeWidth: width })}
            />

            <BorderControlSection
              borderColor={settings.newsletterBorderColor}
              showBorder={settings.newsletterShowBorder}
              onBorderColorChange={(color) => setSettings({ ...settings, newsletterBorderColor: color })}
              onShowBorderChange={(show) => setSettings({ ...settings, newsletterShowBorder: show })}
            />

            {/* Preview */}
            <div className="mt-6 p-4 bg-swarovski-gray rounded-lg">
              <p className="text-xs text-gray-500 mb-2">Preview:</p>
              <div
                className="text-center p-8 rounded-lg"
                style={{
                  backgroundImage: settings.newsletterBackgroundImage ? `url(${settings.newsletterBackgroundImage})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  border: settings.newsletterShowBorder ? `4px solid ${settings.newsletterBorderColor}` : 'none',
                  backgroundColor: !settings.newsletterBackgroundImage ? '#1f1b18' : undefined,
                }}
              >
                <div className="relative z-10">
                  <h3
                    className="text-2xl font-bold mb-2 text-white"
                    style={{
                      fontFamily: 'Montserrat, sans-serif',
                      WebkitTextStroke: `${settings.newsletterTextStrokeWidth || 0.5}px ${settings.newsletterTextStrokeColor || '#ffffff'}`,
                    }}
                  >
                    {settings.newsletterTitle || 'รับข่าวสารและโปรโมชั่นพิเศษ'}
                  </h3>
                  <p
                    className="text-white/80 mb-4"
                    style={{
                      WebkitTextStroke: `${settings.newsletterTextStrokeWidth || 0.5}px ${settings.newsletterTextStrokeColor || '#ffffff'}`,
                    }}
                  >
                    {settings.newsletterDescription || 'สมัครรับจดหมายข่าวสารเพื่อไม่พลาดโปรโมชั่นและสินค้าใหม่ล่าสุด'}
                  </p>
                </div>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-swarovski-gold"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-swarovski-gold"
              />
            </div>

            <ImageUploadSection
              label="Contact Page Background Image"
              field="contactBackgroundImage"
              image={settings.contactBackgroundImage}
              onRemove={() => handleRemoveImage('contactBackgroundImage')}
            />

            <TextStrokeControlSection
              strokeColor={settings.contactTextStrokeColor}
              strokeWidth={settings.contactTextStrokeWidth}
              onStrokeColorChange={(color) => setSettings({ ...settings, contactTextStrokeColor: color })}
              onStrokeWidthChange={(width) => setSettings({ ...settings, contactTextStrokeWidth: width })}
            />

            <BorderControlSection
              borderColor={settings.contactBorderColor}
              showBorder={settings.contactShowBorder}
              onBorderColorChange={(color) => setSettings({ ...settings, contactBorderColor: color })}
              onShowBorderChange={(show) => setSettings({ ...settings, contactShowBorder: show })}
            />

            {/* Preview */}
            <div className="mt-6 p-4 bg-swarovski-gray rounded-lg">
              <p className="text-xs text-gray-500 mb-2">Preview:</p>
              <div
                className="text-center p-8 rounded-lg"
                style={{
                  backgroundImage: settings.contactBackgroundImage ? `url(${settings.contactBackgroundImage})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  border: settings.contactShowBorder ? `4px solid ${settings.contactBorderColor}` : 'none',
                  backgroundColor: !settings.contactBackgroundImage ? '#1f1b18' : undefined,
                }}
              >
                <div className="relative z-10">
                  <h3
                    className="text-2xl font-bold mb-2 text-white"
                    style={{
                      fontFamily: 'Montserrat, sans-serif',
                      WebkitTextStroke: `${settings.contactTextStrokeWidth || 2}px ${settings.contactTextStrokeColor || '#ffffff'}`,
                    }}
                  >
                    {settings.contactPageTitle || 'ติดต่อเรา'}
                  </h3>
                  <p
                    className="text-white/80"
                    style={{
                      WebkitTextStroke: `${settings.contactTextStrokeWidth || 2}px ${settings.contactTextStrokeColor || '#ffffff'}`,
                    }}
                  >
                    {settings.contactPageDescription || 'เราพร้อมให้บริการคุณตลอด 24 ชั่วโมง'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SEO Tab */}
        {activeTab === 'seo' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              ตั้งค่าให้ Google ค้นหาเว็บร้านของคุณเจอง่ายขึ้น — ใช้ข้อมูลนี้สร้าง meta tags และ sitemap อัตโนมัติ
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Domain (Custom Domain)
              </label>
              <input
                type="text"
                value={settings.domain || ''}
                onChange={(e) => setSettings({ ...settings, domain: e.target.value || null })}
                placeholder="เช่น niwelry.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-swarovski-gold"
              />
              <p className="text-xs text-gray-500 mt-1">
                กรอก domain ของร้าน (ไม่มี https://) — ใช้สำหรับสร้าง sitemap และ robots.txt
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SEO Title (ชื่อเว็บสำหรับ Google)
              </label>
              <input
                type="text"
                value={settings.seoTitle || ''}
                onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value || null })}
                maxLength={255}
                placeholder="เช่น ร้านเครื่องประดับนิวเลอรี่ — แหวน สร้อย กำไล"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-swarovski-gold"
              />
              <p className="text-xs text-gray-500 mt-1">
                ปล่อยว่าง = ใช้ Brand Name อัตโนมัติ (แนะนำ 50-60 ตัวอักษร)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SEO Description (คำอธิบายเว็บ)
              </label>
              <textarea
                value={settings.seoDescription || ''}
                onChange={(e) => setSettings({ ...settings, seoDescription: e.target.value || null })}
                rows={3}
                maxLength={500}
                placeholder="เช่น ร้านเครื่องประดับนิวเลอรี่ จำหน่ายแหวน สร้อยคอ กำไล นาฬิกา คุณภาพดี ราคาสมเหตุผล"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-swarovski-gold"
              />
              <p className="text-xs text-gray-500 mt-1">
                ปล่อยว่าง = ใช้ Tagline อัตโนมัติ (แนะนำ 150-160 ตัวอักษร)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SEO Keywords (คำค้นหา)
              </label>
              <input
                type="text"
                value={settings.seoKeywords || ''}
                onChange={(e) => setSettings({ ...settings, seoKeywords: e.target.value || null })}
                maxLength={500}
                placeholder="เช่น เครื่องประดับ, แหวน, สร้อยคอ, กำไล, นาฬิกา, ร้านเครื่องประดับ"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-swarovski-gold"
              />
              <p className="text-xs text-gray-500 mt-1">
                คั่นด้วยจุลภาค (,) — คำที่ลูกค้าค้นหาแล้วอยากให้เจอร้านคุณ
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                OG Image URL (รูปปกสำหรับแชร์)
              </label>
              <input
                type="text"
                value={settings.ogImageUrl || ''}
                onChange={(e) => setSettings({ ...settings, ogImageUrl: e.target.value || null })}
                maxLength={500}
                placeholder="https://niwelry.com/og-image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-swarovski-gold"
              />
              <p className="text-xs text-gray-500 mt-1">
                รูปที่แสดงตอนแชร์ลิงก์บน Facebook/Line (แนะนำ 1200x630px)
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  อนุญาตให้ Google เก็บเว็บนี้ไว้ในผลการค้นหา
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  ถ้าปิด Google จะไม่แสดงเว็บนี้ในผลการค้นหา (เหมาะสำหรับร้านที่ยังไม่พร้อม)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, seoIndexable: !settings.seoIndexable })}
                className="flex items-center gap-2"
              >
                {settings.seoIndexable
                  ? <ToggleRight size={24} className="text-swarovski-gold" />
                  : <ToggleLeft size={24} className="text-gray-400" />}
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-6 border-t">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-swarovski-black text-white rounded-md hover:bg-swarovski-gold disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
