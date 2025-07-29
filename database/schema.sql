-- Shyam Trading Company Database Schema
-- Run this SQL in your Supabase SQL editor to create the database structure

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    image TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    price VARCHAR(50),
    specifications JSONB DEFAULT '{}'::jsonb,
    in_stock BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content table (for hero, about, CTA sections)
CREATE TABLE IF NOT EXISTS content (
    id SERIAL PRIMARY KEY,
    section VARCHAR(50) NOT NULL UNIQUE,
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settings table (for company info, theme, etc.)
CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) NOT NULL UNIQUE,
    value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Media table
CREATE TABLE IF NOT EXISTS media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('image', 'video')),
    category VARCHAR(50) DEFAULT 'general',
    alt TEXT,
    size INTEGER,
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    text TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);
CREATE INDEX IF NOT EXISTS idx_content_section ON content(section);
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);
CREATE INDEX IF NOT EXISTS idx_media_category ON media(category);
CREATE INDEX IF NOT EXISTS idx_media_type ON media(type);
CREATE INDEX IF NOT EXISTS idx_testimonials_rating ON testimonials(rating);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_updated_at BEFORE UPDATE ON content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_media_updated_at BEFORE UPDATE ON media
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default content data
INSERT INTO content (section, data) VALUES 
('hero', '{
    "title": "Premium Steel & Metal Solutions",
    "subtitle": "Your trusted partner for high-quality steel products, structural materials, and metal fabrication services since 1985.",
    "buttons": {
        "primary": {
            "text": "View Products",
            "link": "/products"
        },
        "secondary": {
            "text": "Get Quote",
            "link": "/contact"
        }
    }
}'::jsonb),
('about', '{
    "title": "Building Excellence Since 1985",
    "description": "Established in Nagpur, Maharashtra, Shyam Trading Company has been a leading contractor specializing in diverse interior and exterior building projects. With over three decades of experience, we have consistently delivered excellence in both commercial and residential refurbishments.",
    "features": [
        "Premium Quality Materials",
        "Timely Project Delivery",
        "Expert Craftsmanship",
        "Competitive Pricing",
        "Custom Solutions",
        "ISO Certified Quality Standards"
    ],
    "image": "/placeholder.svg?height=500&width=600",
    "yearsBadge": {
        "number": "35+",
        "text": "Years of Trust"
    }
}'::jsonb),
('cta', '{
    "title": "Ready to Get Started?",
    "description": "Contact us today for competitive quotes and expert advice on your steel and metal requirements.",
    "buttons": {
        "primary": {
            "text": "Get Free Quote",
            "link": "/contact"
        }
    }
}'::jsonb),
('statistics', '{
    "yearsExperience": "35+",
    "projectsCompleted": "500+",
    "happyClients": "300+",
    "rating": "4.6",
    "ratingOutOf": "5"
}'::jsonb)
ON CONFLICT (section) DO NOTHING;

-- Insert default settings
INSERT INTO settings (key, value) VALUES 
('company', '{
    "name": "Shyam Trading Company",
    "tagline": "Premium Steel & Metal Solutions",
    "established": "1985",
    "gst": "27AGZPM2344N1ZK",
    "logo": "/Logo.png",
    "logoLarge": "/Logo.png"
}'::jsonb),
('contact', '{
    "phone": "+91 9422114130",
    "email": "anil.shyamtrading@gmail.com",
    "address": {
        "street": "Shyam Trading Co., SBI ATM juna, Bhandara Rd",
        "city": "Hansapuri, Nagpur",
        "state": "Maharashtra",
        "pincode": "440018",
        "country": "India"
    },
    "workingHours": {
        "weekdays": "11:00 AM - 8:00 PM",
        "saturday": "11:00 AM - 8:00 PM",
        "sunday": "Closed"
    },
    "mapUrl": "https://maps.app.goo.gl/VeWo5nGMF1XrtXmK6?g_st=aw"
}'::jsonb),
('social', '{}'::jsonb),
('seo', '{
    "title": "Shyam Trading Company - Premium Steel & Metal Solutions",
    "description": "Leading supplier of high-quality steel products, structural materials, and metal fabrication services in India. Trusted since 1995.",
    "keywords": ["steel", "metal", "trading", "construction", "fabrication", "industrial"],
    "author": "Shyam Trading Company"
}'::jsonb),
('categories', '[
    "Steel Pipes",
    "Steel Bars",
    "Steel Sheets",
    "Stainless Steel",
    "Aluminum",
    "Structural Steel",
    "GI Sheets",
    "Copper"
]'::jsonb),
('navigation', '[
    {"name": "Home", "path": "/", "order": 1},
    {"name": "Products", "path": "/products", "order": 2},
    {"name": "About", "path": "/about", "order": 3},
    {"name": "Contact", "path": "/contact", "order": 4}
]'::jsonb),
('theme', '{
    "primaryColor": "#D4AF37",
    "secondaryColor": "#2D2D2D",
    "accentColor": "#F5F5F5",
    "fontFamily": "Inter",
    "backgroundImage": ""
}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, category, description, image, features, price, specifications, in_stock, featured) VALUES 
('MS Round Bars', 'Steel Bars', 'High-quality mild steel round bars suitable for construction and manufacturing applications.', '/images/products/ms-round-bars.jpg', '["High tensile strength", "Corrosion resistant coating", "Available in various sizes", "IS 2062 Grade A certified"]'::jsonb, '₹65/kg', '{"material": "Mild Steel", "grade": "IS 2062 Grade A", "sizes": "6mm to 50mm", "length": "6m to 12m"}'::jsonb, true, true),
('SS 304 Sheets', 'Stainless Steel', 'Premium stainless steel 304 sheets with excellent corrosion resistance and durability.', '/images/products/ss-304-sheets.jpg', '["Food grade quality", "Corrosion resistant", "Easy to clean", "Hygienic surface"]'::jsonb, '₹180/kg', '{"material": "Stainless Steel 304", "thickness": "0.5mm to 6mm", "finish": "2B, BA, No.4", "width": "1000mm to 2000mm"}'::jsonb, true, true),
('GI Pipes', 'Steel Pipes', 'Galvanized iron pipes with superior corrosion resistance for plumbing and structural applications.', '/images/products/gi-pipes.jpg', '["Zinc coated", "Corrosion resistant", "Long lasting", "Easy installation"]'::jsonb, '₹85/kg', '{"material": "Galvanized Iron", "sizes": "15mm to 150mm", "thickness": "2mm to 6mm", "standard": "IS 1239"}'::jsonb, true, false),
('Aluminum Sheets', 'Aluminum', 'Lightweight aluminum sheets perfect for automotive, aerospace, and construction industries.', '/images/products/aluminum-sheets.jpg', '["Lightweight", "Corrosion resistant", "Good conductivity", "Recyclable"]'::jsonb, '₹220/kg', '{"material": "Aluminum 1100", "thickness": "0.5mm to 10mm", "temper": "O, H14, H18", "width": "1000mm to 2000mm"}'::jsonb, true, false)
ON CONFLICT DO NOTHING;

-- Insert sample testimonials
INSERT INTO testimonials (name, company, text, rating, image) VALUES 
('Rajesh Kumar', 'Kumar Construction', 'Excellent quality steel products and timely delivery. Shyam Trading has been our trusted partner for over 5 years.', 5, '/images/testimonials/rajesh-kumar.jpg'),
('Priya Sharma', 'Sharma Industries', 'Outstanding customer service and competitive pricing. Highly recommend for all steel requirements.', 5, '/images/testimonials/priya-sharma.jpg'),
('Amit Patel', 'Patel Fabricators', 'Top-notch quality and professional service. They understand our business needs perfectly.', 4, '/images/testimonials/amit-patel.jpg')
ON CONFLICT DO NOTHING;

-- Enable Row Level Security (RLS) for production security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (website visitors)
CREATE POLICY "Public read access for products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read access for content" ON content FOR SELECT USING (true);
CREATE POLICY "Public read access for settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Public read access for media" ON media FOR SELECT USING (true);
CREATE POLICY "Public read access for testimonials" ON testimonials FOR SELECT USING (true);

-- Create policies for admin access (allow all operations for now, can be restricted later)
-- For development/demo purposes, we'll allow all operations
-- In production, you should implement proper authentication
CREATE POLICY "Admin full access for products" ON products FOR ALL USING (true);
CREATE POLICY "Admin full access for content" ON content FOR ALL USING (true);
CREATE POLICY "Admin full access for settings" ON settings FOR ALL USING (true);
CREATE POLICY "Admin full access for media" ON media FOR ALL USING (true);
CREATE POLICY "Admin full access for testimonials" ON testimonials FOR ALL USING (true);

-- Storage Setup Instructions
-- ===========================
-- Storage buckets and policies cannot be created via SQL in the same way as tables.
-- You need to set up storage through the Supabase dashboard or API.

-- STEP 1: Create Storage Bucket (via Supabase Dashboard)
-- 1. Go to your Supabase dashboard
-- 2. Navigate to Storage
-- 3. Click "Create Bucket"
-- 4. Name: "website-images"
-- 5. Make it PUBLIC (very important!)
-- 6. Set allowed MIME types: image/jpeg, image/png, image/gif, image/webp
-- 7. Set file size limit: 5242880 (5MB)

-- STEP 2: Set Storage Policies (via Supabase Dashboard)
-- After creating the bucket, go to Storage > Policies and create these policies:

-- Policy 1: "Allow public uploads"
-- Operation: INSERT
-- Target roles: public
-- Policy definition: true

-- Policy 2: "Allow public downloads"
-- Operation: SELECT
-- Target roles: public
-- Policy definition: true

-- Policy 3: "Allow public updates"
-- Operation: UPDATE
-- Target roles: public
-- Policy definition: true

-- Policy 4: "Allow public deletes"
-- Operation: DELETE
-- Target roles: public
-- Policy definition: true

-- ALTERNATIVE: If you have the Supabase CLI or API access, you can run:
-- supabase storage create-bucket website-images --public
-- But for most users, the dashboard method above is easier.
