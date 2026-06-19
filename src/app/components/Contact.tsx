import { useState, useEffect } from 'react';
import { env } from '../../config/env';
import { MapPin, Mail, Phone, MessageCircle, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { useSiteSettings } from '../context/SiteSettingsContext';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  isActive: boolean;
}

interface SiteSettings {
  brandName: string;
  tagline: string | null;
  address: string | null;
  openingHours: string | null;
  phone: string | null;
  email: string | null;
  contactPageTitle: string | null;
  contactPageDescription: string | null;
  contactBackgroundImage: string | null;
  contactTextStrokeColor: string | null;
  contactTextStrokeWidth: number | null;
  contactBorderColor: string | null;
  contactShowBorder: boolean;
}

const PLATFORM_INFO: Record<string, { label: string; icon: any; color: string }> = {
  line: { label: 'LINE', icon: MessageCircle, color: 'bg-green-500' },
  facebook: { label: 'Facebook', icon: MessageCircle, color: 'bg-blue-600' },
  instagram: { label: 'Instagram', icon: MessageCircle, color: 'bg-pink-600' },
  phone: { label: 'Phone', icon: Phone, color: 'bg-gray-600' },
  email: { label: 'Email', icon: Mail, color: 'bg-red-500' },
  qrcode: { label: 'QR Code', icon: MessageCircle, color: 'bg-purple-600' },
};

export function Contact() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    brandName: 'Niwelry',
    tagline: null,
    address: null,
    openingHours: null,
    phone: null,
    email: null,
    contactPageTitle: null,
    contactPageDescription: null,
    contactBackgroundImage: null,
    contactTextStrokeColor: null,
    contactTextStrokeWidth: null,
    contactBorderColor: null,
    contactShowBorder: false,
  });
  const [loading, setLoading] = useState(true);
  const { siteSettings: globalSettings } = useSiteSettings();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [socialRes, settingsRes] = await Promise.all([
        fetch(`${env.API_BASE_URL}/public/social-links`),
        fetch(`${env.API_BASE_URL}/public/site-settings`),
      ]);

      if (!socialRes.ok || !settingsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const socialData = await socialRes.json();
      const settingsData = await settingsRes.json();

      setSocialLinks(socialData);
      setSiteSettings(settingsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (platform: string, url: string) => {
    if (platform === 'phone') {
      window.open(`tel:${url}`, '_blank');
    } else if (platform === 'email') {
      window.open(`mailto:${url}`, '_blank');
    } else if (platform === 'line') {
      window.open(url, '_blank');
    } else if (platform === 'qrcode') {
      return;
    } else {
      window.open(url, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-swarovski-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative py-20 md:py-32"
        style={{
          backgroundImage: siteSettings.contactBackgroundImage ? `url(${siteSettings.contactBackgroundImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: !siteSettings.contactBackgroundImage ? 'linear-gradient(to right, #1f1b18, #000000)' : undefined,
          border: siteSettings.contactShowBorder ? `4px solid ${siteSettings.contactBorderColor}` : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white tracking-tight"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                WebkitTextStroke: `${siteSettings.contactTextStrokeWidth || 0.5}px ${siteSettings.contactTextStrokeColor || '#ffffff'}`,
              }}
            >
              {siteSettings.contactPageTitle || 'ติดต่อเรา'}
            </h1>
            <p
              className="text-lg sm:text-xl text-white/80 mb-8 max-w-2xl mx-auto"
              style={{
                WebkitTextStroke: `${siteSettings.contactTextStrokeWidth || 0.5}px ${siteSettings.contactTextStrokeColor || '#ffffff'}`,
              }}
            >
              {siteSettings.contactPageDescription || 'เราพร้อมให้บริการคุณตลอด 24 ชั่วโมง'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {siteSettings.address && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-swarovski-gray p-8 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300"
              >
                <div className="w-12 h-12 bg-swarovski-black rounded-full flex items-center justify-center mb-4">
                  <MapPin size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>ที่อยู่</h3>
                <p className="text-gray-600 whitespace-pre-line">{siteSettings.address}</p>
              </motion.div>
            )}

            {siteSettings.phone && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-swarovski-gray p-8 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300"
              >
                <div className="w-12 h-12 bg-swarovski-black rounded-full flex items-center justify-center mb-4">
                  <Phone size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>โทรศัพท์</h3>
                <a href={`tel:${siteSettings.phone}`} className="text-gray-600 hover:text-swarovski-gold transition-colors">
                  {siteSettings.phone}
                </a>
              </motion.div>
            )}

            {siteSettings.email && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-swarovski-gray p-8 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300"
              >
                <div className="w-12 h-12 bg-swarovski-black rounded-full flex items-center justify-center mb-4">
                  <Mail size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>อีเมล</h3>
                <a href={`mailto:${siteSettings.email}`} className="text-gray-600 hover:text-swarovski-gold transition-colors">
                  {siteSettings.email}
                </a>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Social Links */}
      {socialLinks.length > 0 && (
        <section className="py-16 bg-swarovski-gray">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className="text-2xl font-bold mb-8 text-center"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              ช่องทางการติดต่อ
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {socialLinks.map((link) => {
                const info = PLATFORM_INFO[link.platform];
                if (!info) return null;
                const Icon = info.icon;

                if (link.platform === 'qrcode') {
                  return (
                    <motion.div
                      key={link.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4 }}
                      className="bg-white p-8 rounded-xl shadow-card text-center"
                    >
                      <div className="w-16 h-16 bg-swarovski-black rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon size={32} className="text-white" />
                      </div>
                      <h3 className="font-bold mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>{info.label}</h3>
                      <div className="bg-swarovski-gray p-4 rounded-lg inline-block">
                        <img
                          src={link.url}
                          alt="QR Code"
                          className="w-48 h-48 object-contain"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                      </div>
                    </motion.div>
                  );
                }

                return (
                  <motion.button
                    key={link.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    onClick={() => handleClick(link.platform, link.url)}
                    className="bg-white p-8 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 text-left group"
                  >
                    <div className={`w-16 h-16 ${info.color} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={32} className="text-white" />
                    </div>
                    <div className="font-bold mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>{info.label}</div>
                    <div className="text-sm text-gray-600 truncate">{link.url}</div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Contact Form */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-swarovski-gray p-8 rounded-xl shadow-card"
          >
            <h2
              className="text-2xl font-bold mb-6 text-center"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              ส่งข้อความถึงเรา
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-swarovski-gold"
                  placeholder="ชื่อของคุณ"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-swarovski-gold"
                  placeholder="อีเมลของคุณ"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ข้อความ</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-swarovski-gold"
                  placeholder="ข้อความของคุณ"
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-swarovski-black text-white font-semibold rounded-lg hover:bg-swarovski-gold transition-all duration-300 flex items-center justify-center gap-2"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                <Send size={20} />
                ส่งข้อความ
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
