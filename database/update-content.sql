-- Update existing database with new content structure
-- Run this if you already have a database set up

-- Update company settings with new establishment year and logo
UPDATE settings 
SET value = jsonb_set(
    jsonb_set(value, '{established}', '"1985"'),
    '{logo}', '"/Logo.png"'
)
WHERE key = 'company';

-- Add statistics content if it doesn't exist
INSERT INTO content (section, data) VALUES 
('statistics', '{
    "yearsExperience": "35+",
    "projectsCompleted": "500+",
    "happyClients": "300+",
    "rating": "4.6",
    "ratingOutOf": "5"
}'::jsonb)
ON CONFLICT (section) DO UPDATE SET
data = EXCLUDED.data;

-- Update hero section with new establishment year
UPDATE content 
SET data = jsonb_set(data, '{subtitle}', '"Your trusted partner for high-quality steel products, structural materials, and metal fabrication services since 1985."')
WHERE section = 'hero';

-- Update about section with enhanced content
UPDATE content 
SET data = '{
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
}'::jsonb
WHERE section = 'about';

-- Update CTA section with buttons
UPDATE content 
SET data = jsonb_set(data, '{buttons}', '{
    "primary": {
        "text": "Get Free Quote",
        "link": "/contact"
    }
}'::jsonb)
WHERE section = 'cta';

-- Verify the updates
SELECT section, data FROM content ORDER BY section;
