-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('brand', 'creator', 'agency')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    full_name TEXT,
    company_name TEXT,
    bio TEXT,
    website TEXT,
    social_links JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create campaigns table
CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    budget DECIMAL(10,2),
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create applications table
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
    creator_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    proposal TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(campaign_id, creator_id)
);

-- Create brand profiles table
CREATE TABLE IF NOT EXISTS public.brands (
    id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    industry TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create creator profiles table
CREATE TABLE IF NOT EXISTS public.creators (
    id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    niche TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create agency profiles table
CREATE TABLE IF NOT EXISTS public.agencies (
    id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    agency_name TEXT NOT NULL,
    specialization TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create brand profiles details table
CREATE TABLE IF NOT EXISTS public.brand_profiles (
    id UUID PRIMARY KEY REFERENCES public.brands(id) ON DELETE CASCADE,
    company_description TEXT,
    website TEXT,
    logo_url TEXT,
    social_links JSONB DEFAULT '{}'::jsonb,
    contact_info JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create creator profiles details table
CREATE TABLE IF NOT EXISTS public.creator_profiles (
    id UUID PRIMARY KEY REFERENCES public.creators(id) ON DELETE CASCADE,
    bio TEXT,
    profile_picture_url TEXT,
    portfolio_url TEXT,
    skills TEXT[] DEFAULT '{}',
    social_links JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create agency profiles details table
CREATE TABLE IF NOT EXISTS public.agency_profiles (
    id UUID PRIMARY KEY REFERENCES public.agencies(id) ON DELETE CASCADE,
    agency_description TEXT,
    website TEXT,
    logo_url TEXT,
    social_links JSONB DEFAULT '{}'::jsonb,
    contact_info JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brands_updated_at
    BEFORE UPDATE ON public.brands
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creators_updated_at
    BEFORE UPDATE ON public.creators
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agencies_updated_at
    BEFORE UPDATE ON public.agencies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brand_profiles_updated_at
    BEFORE UPDATE ON public.brand_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creator_profiles_updated_at
    BEFORE UPDATE ON public.creator_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agency_profiles_updated_at
    BEFORE UPDATE ON public.agency_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Set up Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create new policies for users table
CREATE POLICY "Enable read access for authenticated users" ON public.users
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON public.users
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for users based on id" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable delete for users based on id" ON public.users
    FOR DELETE USING (auth.uid() = id);

-- Create new policies for profiles table
CREATE POLICY "Enable read access for all users" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.profiles
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for users based on id" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable delete for users based on id" ON public.profiles
    FOR DELETE USING (auth.uid() = id);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 