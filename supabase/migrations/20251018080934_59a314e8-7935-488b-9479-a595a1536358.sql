-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'agent', 'user');

-- Create enum for product condition
CREATE TYPE public.product_condition AS ENUM ('new', 'like_new', 'good', 'fair', 'damaged');

-- Create enum for order status
CREATE TYPE public.order_status AS ENUM ('pending', 'picked_up', 'in_transit', 'delivered', 'completed', 'cancelled');

-- Create enum for event types
CREATE TYPE public.event_type AS ENUM ('swap_meet', 'eco_challenge', 'workshop', 'donation_drive');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  city TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create user_measurements table for AI Size & Fit Scanner
CREATE TABLE public.user_measurements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chest NUMERIC(5,2),
  waist NUMERIC(5,2),
  hips NUMERIC(5,2),
  inseam NUMERIC(5,2),
  shoulder_width NUMERIC(5,2),
  height NUMERIC(5,2),
  weight NUMERIC(5,2),
  preferred_fit TEXT CHECK (preferred_fit IN ('slim', 'regular', 'relaxed')),
  unit_system TEXT CHECK (unit_system IN ('metric', 'imperial')) DEFAULT 'metric',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create products table with size specifications
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  brand TEXT,
  size TEXT,
  color TEXT,
  gender TEXT CHECK (gender IN ('men', 'women', 'unisex', 'kids')),
  condition product_condition NOT NULL DEFAULT 'good',
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  original_price NUMERIC(10,2) CHECK (original_price >= price),
  images TEXT[] NOT NULL DEFAULT '{}',
  is_donation BOOLEAN NOT NULL DEFAULT false,
  is_available BOOLEAN NOT NULL DEFAULT true,
  verified BOOLEAN NOT NULL DEFAULT false,
  -- Size specifications for AI matching
  chest_min NUMERIC(5,2),
  chest_max NUMERIC(5,2),
  waist_min NUMERIC(5,2),
  waist_max NUMERIC(5,2),
  hips_min NUMERIC(5,2),
  hips_max NUMERIC(5,2),
  length NUMERIC(5,2),
  -- Material and sustainability
  material TEXT,
  care_instructions TEXT,
  sustainability_score INTEGER CHECK (sustainability_score BETWEEN 0 AND 100),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sustainability_stats table
CREATE TABLE public.sustainability_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  items_sold INTEGER NOT NULL DEFAULT 0,
  items_donated INTEGER NOT NULL DEFAULT 0,
  items_recycled INTEGER NOT NULL DEFAULT 0,
  co2_offset_kg NUMERIC(10,2) NOT NULL DEFAULT 0,
  water_saved_liters NUMERIC(10,2) NOT NULL DEFAULT 0,
  trees_saved NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_impact_score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create blockchain_certificates table
CREATE TABLE public.blockchain_certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  transaction_hash TEXT NOT NULL UNIQUE,
  certificate_data JSONB NOT NULL,
  authenticity_proof TEXT NOT NULL,
  issued_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  verified BOOLEAN NOT NULL DEFAULT true
);

-- Create recycling_partners table
CREATE TABLE public.recycling_partners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  accepted_materials TEXT[] NOT NULL DEFAULT '{}',
  contact_info JSONB,
  latitude NUMERIC(10,8),
  longitude NUMERIC(11,8),
  rating NUMERIC(3,2) CHECK (rating >= 0 AND rating <= 5),
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create community_events table
CREATE TABLE public.community_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organizer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  event_type event_type NOT NULL,
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  latitude NUMERIC(10,8),
  longitude NUMERIC(11,8),
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  max_participants INTEGER,
  current_participants INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create event_participants table
CREATE TABLE public.event_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.community_events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  checked_in BOOLEAN NOT NULL DEFAULT false,
  checked_in_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Create user_styles table for AI Stylist
CREATE TABLE public.user_styles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  color_preferences TEXT[] DEFAULT '{}',
  style_preferences TEXT[] DEFAULT '{}',
  occasion_tags TEXT[] DEFAULT '{}',
  favorite_brands TEXT[] DEFAULT '{}',
  avoid_materials TEXT[] DEFAULT '{}',
  budget_range JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status order_status NOT NULL DEFAULT 'pending',
  pickup_address TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  pickup_verification_photos TEXT[] DEFAULT '{}',
  delivery_verification_photos TEXT[] DEFAULT '{}',
  tracking_updates JSONB[] DEFAULT '{}',
  amount NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sustainability_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blockchain_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recycling_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_measurements_updated_at BEFORE UPDATE ON public.user_measurements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sustainability_stats_updated_at BEFORE UPDATE ON public.sustainability_stats
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_recycling_partners_updated_at BEFORE UPDATE ON public.recycling_partners
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_community_events_updated_at BEFORE UPDATE ON public.community_events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_styles_updated_at BEFORE UPDATE ON public.user_styles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  INSERT INTO public.sustainability_stats (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_measurements
CREATE POLICY "Users can view own measurements"
  ON public.user_measurements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own measurements"
  ON public.user_measurements FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for products
CREATE POLICY "Products are viewable by everyone"
  ON public.products FOR SELECT
  USING (true);

CREATE POLICY "Sellers can insert own products"
  ON public.products FOR INSERT
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update own products"
  ON public.products FOR UPDATE
  USING (auth.uid() = seller_id);

CREATE POLICY "Sellers can delete own products"
  ON public.products FOR DELETE
  USING (auth.uid() = seller_id);

-- RLS Policies for sustainability_stats
CREATE POLICY "Users can view own sustainability stats"
  ON public.sustainability_stats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Public can view top performers"
  ON public.sustainability_stats FOR SELECT
  USING (true);

CREATE POLICY "Users can update own sustainability stats"
  ON public.sustainability_stats FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for blockchain_certificates
CREATE POLICY "Certificates are viewable by everyone"
  ON public.blockchain_certificates FOR SELECT
  USING (true);

CREATE POLICY "System can create certificates"
  ON public.blockchain_certificates FOR INSERT
  WITH CHECK (true);

-- RLS Policies for recycling_partners
CREATE POLICY "Active partners are viewable by everyone"
  ON public.recycling_partners FOR SELECT
  USING (active = true);

CREATE POLICY "Admins can manage partners"
  ON public.recycling_partners FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for community_events
CREATE POLICY "Events are viewable by everyone"
  ON public.community_events FOR SELECT
  USING (true);

CREATE POLICY "Users can create events"
  ON public.community_events FOR INSERT
  WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers can update own events"
  ON public.community_events FOR UPDATE
  USING (auth.uid() = organizer_id);

CREATE POLICY "Organizers can delete own events"
  ON public.community_events FOR DELETE
  USING (auth.uid() = organizer_id);

-- RLS Policies for event_participants
CREATE POLICY "Participants viewable by everyone"
  ON public.event_participants FOR SELECT
  USING (true);

CREATE POLICY "Users can join events"
  ON public.event_participants FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave events"
  ON public.event_participants FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for user_styles
CREATE POLICY "Users can view own styles"
  ON public.user_styles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own styles"
  ON public.user_styles FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for orders
CREATE POLICY "Buyers can view own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = buyer_id);

CREATE POLICY "Sellers can view their sales"
  ON public.orders FOR SELECT
  USING (auth.uid() = seller_id);

CREATE POLICY "Agents can view assigned orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = agent_id);

CREATE POLICY "Buyers can create orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Agents can update assigned orders"
  ON public.orders FOR UPDATE
  USING (auth.uid() = agent_id OR public.has_role(auth.uid(), 'admin'));

-- Create indexes for performance
CREATE INDEX idx_products_seller_id ON public.products(seller_id);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_is_available ON public.products(is_available);
CREATE INDEX idx_orders_buyer_id ON public.orders(buyer_id);
CREATE INDEX idx_orders_seller_id ON public.orders(seller_id);
CREATE INDEX idx_orders_agent_id ON public.orders(agent_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_community_events_city ON public.community_events(city);
CREATE INDEX idx_community_events_event_date ON public.community_events(event_date);
CREATE INDEX idx_recycling_partners_city ON public.recycling_partners(city);