import { useState, useEffect } from "react";
import { MapPin, X, Mail, Phone, Facebook, Instagram, MessageCircle, CreditCard, ArrowRight } from "lucide-react";
import { env } from "../../config/env";

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
  newsletterTitle: string | null;
  newsletterDescription: string | null;
}

const PLATFORM_INFO: Record<string, { label: string; icon: any; color: string }> = {
  line: { label: 'LINE', icon: MessageCircle, color: 'bg-green-500' },
  facebook: { label: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
  instagram: { label: 'Instagram', icon: Instagram, color: 'bg-pink-600' },
  phone: { label: 'Phone', icon: Phone, color: 'bg-gray-600' },
  email: { label: 'Email', icon: Mail, color: 'bg-red-500' },
  qrcode: { label: 'QR Code', icon: MessageCircle, color: 'bg-purple-600' },
};

export function Footer() {
  const [isQRCodeOpen, setIsQRCodeOpen] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    brandName: 'Niwelry',
    tagline: null,
    address: null,
    openingHours: null,
    phone: null,
    email: null,
    newsletterTitle: null,
    newsletterDescription: null,
  });
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetchSocialLinks();
    fetchSiteSettings();
  }, []);

  const fetchSocialLinks = async () => {
    try {
      const response = await fetch(`${env.API_BASE_URL}/public/social-links`);
      if (!response.ok) {
        throw new Error('Failed to fetch social links');
      }
      const data = await response.json();
      setSocialLinks(data);
    } catch (error) {
      console.error('Error fetching social links:', error);
    }
  };

  const fetchSiteSettings = async () => {
    try {
      const response = await fetch(`${env.API_BASE_URL}/public/site-settings`);
      if (!response.ok) {
        throw new Error('Failed to fetch site settings');
      }
      const data = await response.json();
      setSiteSettings(data);
    } catch (error) {
      console.error('Error fetching site settings:', error);
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isQRCodeOpen) {
        setIsQRCodeOpen(false);
      }
    };

    if (isQRCodeOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isQRCodeOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsQRCodeOpen(false);
    }
  };

  const handleSocialClick = (platform: string, url: string) => {
    if (platform === 'phone') {
      window.open(`tel:${url}`, '_blank');
    } else if (platform === 'email') {
      window.open(`mailto:${url}`, '_blank');
    } else if (platform === 'qrcode') {
      setIsQRCodeOpen(true);
    } else {
      window.open(url, '_blank');
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log('Newsletter signup:', email);
    setEmail('');
    alert('ขอบคุณที่สมัครรับข่าวสาร!');
  };

  const qrCodeLink = socialLinks.find(link => link.platform === 'qrcode');
  const otherLinks = socialLinks.filter(link => link.platform !== 'qrcode');

  return (
    <>
      <footer className="bg-gradient-to-br from-swarovski-black via-swarovski-purple to-swarovski-black text-white mt-16">
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)',
            backgroundSize: '100% 100%'
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

            {/* Brand Section */}
            <div className="space-y-6">
              <div>
                <h2
                  className="text-3xl font-bold tracking-[0.2em] uppercase mb-4"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {siteSettings.brandName}
                </h2>
                <div className="w-16 h-1 bg-swarovski-gold mb-6"></div>
              </div>
              {siteSettings.tagline && (
                <p className="text-gray-300 text-sm leading-relaxed">
                  {siteSettings.tagline}
                </p>
              )}
              {siteSettings.address && (
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-swarovski-gold mt-0.5 shrink-0" />
                    <address className="not-italic text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                      {siteSettings.address}
                    </address>
                  </div>
                  {siteSettings.openingHours && (
                    <p className="text-sm text-gray-300 pl-[22px]">
                      {siteSettings.openingHours}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <div>
                <h3
                  className="text-lg font-bold mb-4"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  เมนู
                </h3>
                <div className="w-16 h-1 bg-swarovski-gold mb-6"></div>
              </div>
              <ul className="space-y-3">
                <li>
                  <a href="/" className="text-gray-300 hover:text-swarovski-gold transition-colors duration-300 text-sm flex items-center gap-2 group">
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    หน้าแรก
                  </a>
                </li>
                <li>
                  <a href="/?category=ring" className="text-gray-300 hover:text-swarovski-gold transition-colors duration-300 text-sm flex items-center gap-2 group">
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    แหวน
                  </a>
                </li>
                <li>
                  <a href="/?category=necklace" className="text-gray-300 hover:text-swarovski-gold transition-colors duration-300 text-sm flex items-center gap-2 group">
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    สร้อยคอ
                  </a>
                </li>
                <li>
                  <a href="/?category=bracelet" className="text-gray-300 hover:text-swarovski-gold transition-colors duration-300 text-sm flex items-center gap-2 group">
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    สร้อยข้อมือ
                  </a>
                </li>
                <li>
                  <a href="/?category=earring" className="text-gray-300 hover:text-swarovski-gold transition-colors duration-300 text-sm flex items-center gap-2 group">
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    ต่างหู
                  </a>
                </li>
                <li>
                  <a href="/contact" className="text-gray-300 hover:text-swarovski-gold transition-colors duration-300 text-sm flex items-center gap-2 group">
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    ติดต่อเรา
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div>
                <h3
                  className="text-lg font-bold mb-4"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  ติดต่อเรา
                </h3>
                <div className="w-16 h-1 bg-swarovski-gold mb-6"></div>
              </div>
              {siteSettings.phone && (
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-swarovski-gold" />
                  <a
                    href={`tel:${siteSettings.phone}`}
                    className="text-gray-300 hover:text-swarovski-gold transition-colors duration-300 text-sm"
                  >
                    {siteSettings.phone}
                  </a>
                </div>
              )}
              {siteSettings.email && (
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-swarovski-gold" />
                  <a
                    href={`mailto:${siteSettings.email}`}
                    className="text-gray-300 hover:text-swarovski-gold transition-colors duration-300 text-sm"
                  >
                    {siteSettings.email}
                  </a>
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="space-y-6">
              <div>
                <h3
                  className="text-lg font-bold mb-4"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  ติดตามเรา
                </h3>
                <div className="w-16 h-1 bg-swarovski-gold mb-6"></div>
              </div>
              <div className="space-y-4">
                {otherLinks.length === 0 ? (
                  <p className="text-sm text-gray-400">ยังไม่มีข้อมูลการติดต่อ</p>
                ) : (
                  otherLinks.map((link) => {
                    const info = PLATFORM_INFO[link.platform];
                    if (!info) return null;
                    const Icon = info.icon;

                    return (
                      <button
                        key={link.id}
                        onClick={() => handleSocialClick(link.platform, link.url)}
                        className="flex items-center gap-3 text-sm text-gray-300 hover:text-swarovski-gold transition-colors duration-300 w-full text-left group"
                      >
                        <div className={`w-10 h-10 rounded-full border border-swarovski-gold/40 flex items-center justify-center group-hover:border-swarovski-gold group-hover:bg-swarovski-gold/10 transition-all duration-300`}>
                          <Icon size={18} className="text-swarovski-gold" />
                        </div>
                        {info.label}
                      </button>
                    );
                  })
                )}
              </div>

              {qrCodeLink && (
                <div className="mt-6">
                  <button
                    onClick={() => setIsQRCodeOpen(true)}
                    className="w-20 h-20 bg-white p-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <img
                      src={qrCodeLink.url}
                      alt="LINE QR Code"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  </button>
                  <p className="text-xs text-gray-400 mt-2 text-center">สแกน QR Code</p>
                </div>
              )}
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="mt-16 pt-8 border-t border-white/10">
            <div className="max-w-2xl mx-auto">
              <h3
                className="text-xl font-bold mb-2 text-center"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {siteSettings.newsletterTitle || 'รับข่าวสารและโปรโมชั่นพิเศษ'}
              </h3>
              <p className="text-gray-300 text-sm text-center mb-6">
                {siteSettings.newsletterDescription || 'สมัครรับจดหมายข่าวสารเพื่อไม่พลาดโปรโมชั่นและสินค้าใหม่ล่าสุด'}
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="อีเมลของคุณ"
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-swarovski-gold"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-swarovski-gold text-white font-semibold rounded-lg hover:bg-swarovski-gold-light transition-all duration-300 flex items-center gap-2"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  สมัคร
                  <ArrowRight size={18} />
                </button>
              </form>
            </div>
          </div>

          {/* Payment Icons */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex flex-col items-center gap-4">
              <p className="text-xs text-gray-400">วิธีชำระเงินที่รองรับ</p>
              <div className="flex gap-4">
                <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center">
                  <CreditCard size={20} className="text-gray-400" />
                </div>
                <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center">
                  <CreditCard size={20} className="text-gray-400" />
                </div>
                <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center">
                  <CreditCard size={20} className="text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} {siteSettings.brandName}. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-sm text-gray-400 hover:text-swarovski-gold transition-colors duration-300">
                นโยบายความเป็นส่วนตัว
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-swarovski-gold transition-colors duration-300">
                เงื่อนไขการใช้งาน
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* QR Code Lightbox */}
      {isQRCodeOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={handleOverlayClick}
        >
          <div className="relative bg-white rounded-2xl p-8 max-w-sm w-full">
            <button
              onClick={() => setIsQRCodeOpen(false)}
              className="absolute -top-4 -right-4 w-10 h-10 bg-swarovski-gold text-white rounded-full flex items-center justify-center hover:bg-swarovski-gold-light transition-colors shadow-lg"
            >
              <X size={20} />
            </button>
            <div className="flex flex-col items-center">
              <div className="w-64 h-64 mb-6">
                {qrCodeLink ? (
                  <img
                    src={qrCodeLink.url}
                    alt="LINE QR Code"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                    <MessageCircle size={64} className="text-gray-400" />
                  </div>
                )}
              </div>
              <h3
                className="text-xl font-bold text-gray-800 mb-2"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                LINE Official
              </h3>
              <p className="text-swarovski-purple text-lg tracking-widest font-semibold">@niwelry</p>
              <p className="text-gray-600 text-sm mt-4 text-center">สแกน QR Code เพื่อติดต่อเราผ่าน LINE</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
