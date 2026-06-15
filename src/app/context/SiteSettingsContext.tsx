import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { env } from "../../config/env";

interface SiteSettings {
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

interface SiteSettingsContextType {
  siteSettings: SiteSettings;
  loading: boolean;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

const defaultSettings: SiteSettings = {
  brandName: 'Niwelry',
  tagline: null,
  address: null,
  openingHours: null,
  phone: null,
  email: null,
  heroTitle: null,
  heroSubtitle: null,
  heroButtonText: null,
  heroBackgroundImage: null,
  heroOverlayColor: null,
  newsletterTitle: null,
  newsletterDescription: null,
  contactPageTitle: null,
  contactPageDescription: null,
};

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      } finally {
        setLoading(false);
      }
    };
    fetchSiteSettings();
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ siteSettings, loading }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (context === undefined) {
    throw new Error("useSiteSettings must be used within a SiteSettingsProvider");
  }
  return context;
}
