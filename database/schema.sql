-- OmniStage AI PostgreSQL / Supabase Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(150),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Brands Table (Brand DNA)
CREATE TABLE IF NOT EXISTS brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    brand_name VARCHAR(150) NOT NULL,
    primary_color VARCHAR(50),     -- e.g. #000000
    secondary_color VARCHAR(50),   -- e.g. #D4AF37
    aesthetic VARCHAR(100),         -- e.g. Minimalist Luxury, Streetwear, Neon Cyber
    lighting VARCHAR(100),          -- e.g. Soft Studio, Golden Hour, Hard Edge
    background_style VARCHAR(100),  -- e.g. Clean Concrete, Marble Podium, Seamless White
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    original_cloudinary_public_id VARCHAR(255) NOT NULL,
    original_url TEXT NOT NULL,
    ai_metadata JSONB DEFAULT '{}'::jsonb, -- detected colors, material, features
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Generation Jobs Table
CREATE TABLE IF NOT EXISTS generation_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'QUEUED', -- QUEUED, PROCESSING, GENERATING, TRANSFORMING, COMPLETED, FAILED
    selected_colors JSONB NOT NULL DEFAULT '[]'::jsonb,
    selected_formats JSONB NOT NULL DEFAULT '[]'::jsonb,
    progress_percent INT DEFAULT 0,
    current_step VARCHAR(255) DEFAULT 'Job initialized',
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Assets Table
CREATE TABLE IF NOT EXISTS assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    generation_job_id UUID REFERENCES generation_jobs(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    colorway VARCHAR(100) NOT NULL,
    format VARCHAR(20) NOT NULL, -- '1:1', '4:5', '9:16', '16:9'
    cloudinary_public_id VARCHAR(255) NOT NULL,
    cloudinary_url TEXT NOT NULL,
    width INT,
    height INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_jobs_product ON generation_jobs(product_id);
CREATE INDEX IF NOT EXISTS idx_assets_product ON assets(product_id);
CREATE INDEX IF NOT EXISTS idx_assets_job ON assets(generation_job_id);
