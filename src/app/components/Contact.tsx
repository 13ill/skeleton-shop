import { useState, useEffect } from 'react';
import { env } from '../../config/env';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  isActive: boolean;
}

const PLATFORM_INFO: Record<string, { label: string; icon: string; color: string }> = {
  line: { label: 'LINE', icon: '💬', color: 'bg-green-500' },
  facebook: { label: 'Facebook', icon: '📘', color: 'bg-blue-600' },
  instagram: { label: 'Instagram', icon: '📷', color: 'bg-pink-600' },
  phone: { label: 'Phone', icon: '📞', color: 'bg-gray-600' },
  email: { label: 'Email', icon: '📧', color: 'bg-red-500' },
  qrcode: { label: 'QR Code', icon: '📱', color: 'bg-purple-600' },
};

export function Contact() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSocialLinks();
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
      // QR code is displayed as image, no action needed
      return;
    } else {
      window.open(url, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center text-gray-500">กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">ติดต่อเรา</h1>

      <div className="bg-white rounded-lg shadow p-8">
        <div className="mb-8 text-center">
          <h2 className="text-xl font-bold mb-2">Niwelry</h2>
          <p className="text-gray-600">เครื่องประดับเพชรพลอยคุณภาพสูง</p>
        </div>

        {socialLinks.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            ยังไม่มีข้อมูลการติดต่อ
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {socialLinks.map((link) => {
              const info = PLATFORM_INFO[link.platform];
              if (!info) return null;

              if (link.platform === 'qrcode') {
                return (
                  <div key={link.id} className="text-center p-6 bg-gray-50 rounded-lg">
                    <div className="text-4xl mb-4">{info.icon}</div>
                    <h3 className="font-bold mb-4">{info.label}</h3>
                    <div className="bg-white p-4 rounded-lg inline-block">
                      <img
                        src={link.url}
                        alt="QR Code"
                        className="w-48 h-48 object-contain"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                  </div>
                );
              }

              return (
                <button
                  key={link.id}
                  onClick={() => handleClick(link.platform, link.url)}
                  className="text-left p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${info.color} rounded-full flex items-center justify-center text-white text-2xl`}>
                      {info.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold">{info.label}</div>
                      <div className="text-sm text-gray-600 truncate">
                        {link.platform === 'phone' ? link.url : link.url}
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-8 pt-8 border-t text-center text-gray-500 text-sm">
          <p>ติดต่อเราผ่านช่องทางด้านบนเพื่อสอบถามข้อมูลเพิ่มเติม</p>
        </div>
      </div>
    </div>
  );
}
