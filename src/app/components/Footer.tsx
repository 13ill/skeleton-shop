import { useState, useEffect } from "react";
import { MapPin, X } from "lucide-react";
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
}

const PLATFORM_INFO: Record<string, { label: string; icon: string; color: string }> = {
  line: { label: 'LINE', icon: '💬', color: 'bg-green-500' },
  facebook: { label: 'Facebook', icon: '📘', color: 'bg-blue-600' },
  instagram: { label: 'Instagram', icon: '📷', color: 'bg-pink-600' },
  phone: { label: 'Phone', icon: '📞', color: 'bg-gray-600' },
  email: { label: 'Email', icon: '📧', color: 'bg-red-500' },
  qrcode: { label: 'QR Code', icon: '📱', color: 'bg-purple-600' },
};

const QRCodeLine = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Outer frame top-left */}
    <rect x="10" y="10" width="70" height="70" rx="8" fill="none" stroke="currentColor" strokeWidth="8" />
    <rect x="26" y="26" width="38" height="38" rx="3" fill="currentColor" />
    {/* Outer frame top-right */}
    <rect x="120" y="10" width="70" height="70" rx="8" fill="none" stroke="currentColor" strokeWidth="8" />
    <rect x="136" y="26" width="38" height="38" rx="3" fill="currentColor" />
    {/* Outer frame bottom-left */}
    <rect x="10" y="120" width="70" height="70" rx="8" fill="none" stroke="currentColor" strokeWidth="8" />
    <rect x="26" y="136" width="38" height="38" rx="3" fill="currentColor" />
    {/* Data modules */}
    <rect x="110" y="110" width="14" height="14" rx="2" fill="currentColor" />
    <rect x="128" y="110" width="14" height="14" rx="2" fill="currentColor" />
    <rect x="146" y="110" width="14" height="14" rx="2" fill="currentColor" />
    <rect x="164" y="110" width="14" height="14" rx="2" fill="currentColor" />
    <rect x="110" y="128" width="14" height="14" rx="2" fill="currentColor" />
    <rect x="146" y="128" width="14" height="14" rx="2" fill="currentColor" />
    <rect x="164" y="128" width="14" height="14" rx="2" fill="currentColor" />
    <rect x="110" y="146" width="14" height="14" rx="2" fill="currentColor" />
    <rect x="128" y="146" width="14" height="14" rx="2" fill="currentColor" />
    <rect x="164" y="146" width="14" height="14" rx="2" fill="currentColor" />
    <rect x="110" y="164" width="14" height="14" rx="2" fill="currentColor" />
    <rect x="146" y="164" width="14" height="14" rx="2" fill="currentColor" />
    <rect x="128" y="164" width="14" height="14" rx="2" fill="currentColor" />
    <rect x="164" y="164" width="14" height="14" rx="2" fill="currentColor" />
    {/* LINE logo center */}
    <rect x="82" y="82" width="36" height="36" rx="6" fill="currentColor" />
    <text x="100" y="104" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="sans-serif">L</text>
  </svg>
);

export function Footer() {
  const [isQRCodeOpen, setIsQRCodeOpen] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    brandName: 'Niwelry',
    tagline: null,
    address: null,
    openingHours: null,
  });

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

  const qrCodeLink = socialLinks.find(link => link.platform === 'qrcode');
  const otherLinks = socialLinks.filter(link => link.platform !== 'qrcode');

  return (
    <>
      <footer className="bg-[#1a1a18] text-[#c8bfb0] mt-24">
        <div className="max-w-6xl mx-auto px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">

            {/* Brand + Address */}
            <div className="space-y-6">
              <div>
                <h2 className="text-white font-light tracking-[0.25em] uppercase text-sm mb-1">{siteSettings.brandName}</h2>
                <div className="w-8 h-px bg-[#c8a96e] mb-6" />
              </div>
              {siteSettings.tagline && (
                <p className="text-xs text-gray-400 mb-4">{siteSettings.tagline}</p>
              )}
              <div className="space-y-3">
                {siteSettings.address && (
                  <div className="flex items-start gap-3">
                    <MapPin size={14} className="text-[#c8a96e] mt-0.5 shrink-0" />
                    <address className="not-italic text-xs leading-relaxed tracking-wide whitespace-pre-line">
                      {siteSettings.address}
                    </address>
                  </div>
                )}
                {siteSettings.openingHours && (
                  <p className="text-xs tracking-wide pl-[22px]">{siteSettings.openingHours}</p>
                )}
              </div>
            </div>

            {/* Social */}
            <div className="space-y-6">
              <div>
                <h3 className="text-white font-light tracking-[0.2em] uppercase text-xs mb-1">ติดตามเรา</h3>
                <div className="w-8 h-px bg-[#c8a96e] mb-6" />
              </div>
              <div className="space-y-4">
                {otherLinks.length === 0 ? (
                  <p className="text-xs text-gray-500">ยังไม่มีข้อมูลการติดต่อ</p>
                ) : (
                  otherLinks.map((link) => {
                    const info = PLATFORM_INFO[link.platform];
                    if (!info) return null;

                    return (
                      <button
                        key={link.id}
                        onClick={() => handleSocialClick(link.platform, link.url)}
                        className="flex items-center gap-3 text-xs tracking-widest uppercase hover:text-white transition-colors duration-300 group w-full text-left"
                      >
                        <span className="w-7 h-7 rounded-full border border-[#c8a96e]/40 flex items-center justify-center group-hover:border-[#c8a96e] group-hover:bg-[#c8a96e]/10 transition-all duration-300">
                          <span className="text-sm">{info.icon}</span>
                        </span>
                        {info.label}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* LINE QR */}
            <div className="space-y-6">
              <div>
                <h3 className="text-white font-light tracking-[0.2em] uppercase text-xs mb-1">LINE Official</h3>
                <div className="w-8 h-px bg-[#c8a96e] mb-6" />
              </div>
              {qrCodeLink ? (
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => setIsQRCodeOpen(true)}
                    className="w-20 h-20 text-white bg-white p-1.5 rounded-md shrink-0 cursor-pointer hover:scale-105 transition-transform duration-200"
                  >
                    <img
                      src={qrCodeLink.url}
                      alt="LINE QR Code"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.innerHTML = '';
                        e.currentTarget.appendChild(QRCodeLine({}) as any);
                      }}
                    />
                  </button>
                  <div className="space-y-1.5 pt-1">
                    <p className="text-xs tracking-wide leading-relaxed">สแกน QR Code<br />เพื่อติดต่อเราผ่าน LINE</p>
                    <p className="text-[#c8a96e] text-xs tracking-widest">@niwelry</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => setIsQRCodeOpen(true)}
                    className="w-20 h-20 text-white bg-white p-1.5 rounded-md shrink-0 cursor-pointer hover:scale-105 transition-transform duration-200"
                  >
                    <QRCodeLine />
                  </button>
                  <div className="space-y-1.5 pt-1">
                    <p className="text-xs tracking-wide leading-relaxed">สแกน QR Code<br />เพื่อติดต่อเราผ่าน LINE</p>
                    <p className="text-[#c8a96e] text-xs tracking-widest">@niwelry</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[10px] tracking-widest uppercase text-white/30">
              © {new Date().getFullYear()} {siteSettings.brandName}. All rights reserved.
            </p>
            <div className="flex gap-1 items-center">
              {[...Array(3)].map((_, i) => (
                <span key={i} className="w-1 h-1 rounded-full bg-[#c8a96e]/40" />
              ))}
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
          <div className="relative bg-white rounded-lg p-8 max-w-sm w-full">
            <button
              onClick={() => setIsQRCodeOpen(false)}
              className="absolute -top-3 -right-3 w-8 h-8 bg-[#c8a96e] text-white rounded-full flex items-center justify-center hover:bg-[#b8a060] transition-colors"
            >
              <X size={16} />
            </button>
            <div className="flex flex-col items-center">
              <div className="w-64 h-64 text-[#1a1a18] mb-6">
                {qrCodeLink ? (
                  <img
                    src={qrCodeLink.url}
                    alt="LINE QR Code"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.innerHTML = '';
                      e.currentTarget.appendChild(QRCodeLine({}) as any);
                    }}
                  />
                ) : (
                  <QRCodeLine />
                )}
              </div>
              <p className="text-gray-800 text-sm font-medium mb-2">LINE Official</p>
              <p className="text-[#c8a96e] text-lg tracking-widest font-semibold">@niwelry</p>
              <p className="text-gray-600 text-xs mt-4 text-center">สแกน QR Code เพื่อติดต่อเราผ่าน LINE</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
