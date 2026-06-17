-- Create Jump-1 tables in Supabase SQL Editor
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/nnhohnfjmzarkopoebqr/sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create jump1_users table
CREATE TABLE IF NOT EXISTS jump1_users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'admin',
  project TEXT DEFAULT 'jump1',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create jump1_categories table
CREATE TABLE IF NOT EXISTS jump1_categories (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  project TEXT DEFAULT 'jump1',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create jump1_products table
CREATE TABLE IF NOT EXISTS jump1_products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  category_id TEXT,
  global_order INTEGER,
  category_order INTEGER,
  price INTEGER,
  description TEXT,
  full_description TEXT,
  material TEXT,
  specifications JSONB,
  images JSONB,
  project TEXT DEFAULT 'jump1',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (category_id) REFERENCES jump1_categories(id)
);

-- Create jump1_social_links table
CREATE TABLE IF NOT EXISTS jump1_social_links (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  project TEXT DEFAULT 'jump1',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create jump1_site_settings table
CREATE TABLE IF NOT EXISTS jump1_site_settings (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_name TEXT DEFAULT 'Niwelry',
  tagline TEXT,
  address TEXT,
  opening_hours TEXT,
  phone TEXT,
  email TEXT,
  project TEXT DEFAULT 'jump1',
  
  -- Hero Section
  hero_title TEXT,
  hero_subtitle TEXT,
  hero_button_text TEXT,
  hero_background_image TEXT,
  hero_text_stroke_color TEXT,
  hero_text_stroke_width REAL DEFAULT 0.5,
  hero_border_color TEXT,
  hero_show_border BOOLEAN DEFAULT false,
  
  -- Newsletter Section
  newsletter_title TEXT,
  newsletter_description TEXT,
  newsletter_background_image TEXT,
  newsletter_text_stroke_color TEXT,
  newsletter_text_stroke_width REAL DEFAULT 0.5,
  newsletter_border_color TEXT,
  newsletter_show_border BOOLEAN DEFAULT false,
  
  -- Contact Page
  contact_page_title TEXT,
  contact_page_description TEXT,
  contact_background_image TEXT,
  contact_text_stroke_color TEXT,
  contact_text_stroke_width REAL DEFAULT 0.5,
  contact_border_color TEXT,
  contact_show_border BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_jump1_users_email ON jump1_users(email);
CREATE INDEX IF NOT EXISTS idx_jump1_users_project ON jump1_users(project);
CREATE INDEX IF NOT EXISTS idx_jump1_categories_slug ON jump1_categories(slug);
CREATE INDEX IF NOT EXISTS idx_jump1_categories_project ON jump1_categories(project);
CREATE INDEX IF NOT EXISTS idx_jump1_products_category_id ON jump1_products(category_id);
CREATE INDEX IF NOT EXISTS idx_jump1_products_project ON jump1_products(project);
CREATE INDEX IF NOT EXISTS idx_jump1_social_links_project ON jump1_social_links(project);
CREATE INDEX IF NOT EXISTS idx_jump1_site_settings_project ON jump1_site_settings(project);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_jump1_users_updated_at BEFORE UPDATE ON jump1_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jump1_categories_updated_at BEFORE UPDATE ON jump1_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jump1_products_updated_at BEFORE UPDATE ON jump1_products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jump1_social_links_updated_at BEFORE UPDATE ON jump1_social_links
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jump1_site_settings_updated_at BEFORE UPDATE ON jump1_site_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Success message
SELECT 'Jump-1 tables created successfully!' as status;
