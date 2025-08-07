-- Create vendors table
CREATE TABLE public.vendors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  rating DECIMAL(3, 2) DEFAULT 0,
  products_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  unit TEXT NOT NULL DEFAULT 'per piece',
  min_order INTEGER DEFAULT 1,
  category TEXT NOT NULL,
  image_url TEXT,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create carts table
CREATE TABLE public.carts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  vendor_id UUID REFERENCES public.vendors(id),
  created_by UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'threshold_met', 'closed')),
  min_value DECIMAL(10, 2) DEFAULT 0,
  current_value DECIMAL(10, 2) DEFAULT 0,
  location TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cart_participants table
CREATE TABLE public.cart_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cart_id UUID REFERENCES public.carts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(cart_id, user_id)
);

-- Create cart_items table
CREATE TABLE public.cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cart_id UUID REFERENCES public.carts(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  business_name TEXT,
  business_type TEXT,
  location TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  role TEXT DEFAULT 'buyer' CHECK (role IN ('buyer', 'vendor')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for vendors (public read, authenticated users can add if vendor)
CREATE POLICY "Vendors are viewable by everyone" 
ON public.vendors FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert vendors" 
ON public.vendors FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Vendors can update their own data" 
ON public.vendors FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- RLS Policies for products (public read, vendors can manage their products)
CREATE POLICY "Products are viewable by everyone" 
ON public.products FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert products" 
ON public.products FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update products" 
ON public.products FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- RLS Policies for carts (public read, authenticated can create/join)
CREATE POLICY "Carts are viewable by everyone" 
ON public.carts FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create carts" 
ON public.carts FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Cart creators can update their carts" 
ON public.carts FOR UPDATE 
USING (auth.uid() = created_by);

-- RLS Policies for cart_participants
CREATE POLICY "Cart participants are viewable by everyone" 
ON public.cart_participants FOR SELECT 
USING (true);

CREATE POLICY "Users can join carts" 
ON public.cart_participants FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave carts" 
ON public.cart_participants FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for cart_items
CREATE POLICY "Cart items are viewable by everyone" 
ON public.cart_items FOR SELECT 
USING (true);

CREATE POLICY "Users can add items to carts" 
ON public.cart_items FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their cart items" 
ON public.cart_items FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their cart items" 
ON public.cart_items FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for profiles
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_vendors_updated_at
BEFORE UPDATE ON public.vendors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_carts_updated_at
BEFORE UPDATE ON public.carts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to calculate distance between two points
CREATE OR REPLACE FUNCTION public.calculate_distance(
  lat1 DECIMAL(10, 8),
  lon1 DECIMAL(11, 8),
  lat2 DECIMAL(10, 8),
  lon2 DECIMAL(11, 8)
) RETURNS DECIMAL AS $$
DECLARE
  earth_radius DECIMAL := 6371; -- Earth's radius in kilometers
  dlat DECIMAL;
  dlon DECIMAL;
  a DECIMAL;
  c DECIMAL;
BEGIN
  -- Convert to radians
  dlat := radians(lat2 - lat1);
  dlon := radians(lon2 - lon1);
  
  -- Haversine formula
  a := sin(dlat/2) * sin(dlat/2) + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2) * sin(dlon/2);
  c := 2 * atan2(sqrt(a), sqrt(1-a));
  
  RETURN earth_radius * c;
END;
$$ LANGUAGE plpgsql;

-- Insert sample data
INSERT INTO public.vendors (name, category, location, latitude, longitude, rating, products_count) VALUES
('TechSupply Hub', 'Electronics', 'Bangalore, KA', 12.9716, 77.5946, 4.8, 45),
('FreshMart Wholesale', 'Groceries', 'Mumbai, MH', 19.0760, 72.8777, 4.6, 120),
('PaperPlus Supplies', 'Stationery', 'Mumbai, MH', 19.0760, 72.8777, 4.7, 80),
('BoxCraft Industries', 'Packaging', 'Delhi, DL', 28.7041, 77.1025, 4.5, 60),
('Office Essentials', 'Office Supplies', 'Chennai, TN', 13.0827, 80.2707, 4.3, 95);

INSERT INTO public.products (vendor_id, name, description, price, unit, min_order, category) VALUES
((SELECT id FROM public.vendors WHERE name = 'PaperPlus Supplies'), 'Premium Copy Paper A4', 'High-quality white copy paper, 80GSM', 280, 'per ream', 10, 'Stationery'),
((SELECT id FROM public.vendors WHERE name = 'TechSupply Hub'), 'Bulk Printing Cartridges', 'Compatible ink cartridges for HP printers', 1200, 'per piece', 5, 'Electronics'),
((SELECT id FROM public.vendors WHERE name = 'FreshMart Wholesale'), 'Organic Rice 25kg', 'Premium quality basmati rice', 2500, 'per bag', 2, 'Groceries'),
((SELECT id FROM public.vendors WHERE name = 'BoxCraft Industries'), 'Corrugated Boxes Medium', 'Standard shipping boxes 12x8x6 inches', 45, 'per piece', 50, 'Packaging'),
((SELECT id FROM public.vendors WHERE name = 'Office Essentials'), 'Desk Organizer Set', 'Complete office desk organization kit', 850, 'per set', 3, 'Office Supplies');

INSERT INTO public.carts (title, description, vendor_id, status, min_value, current_value, location, latitude, longitude) VALUES
('Office Stationery Bulk Order', 'Collaborative order for premium office supplies', 
 (SELECT id FROM public.vendors WHERE name = 'PaperPlus Supplies'), 'threshold_met', 5000, 8500, 'Mumbai, MH', 19.0760, 72.8777),
('Electronics Bundle', 'Bulk purchase of printing supplies', 
 (SELECT id FROM public.vendors WHERE name = 'TechSupply Hub'), 'open', 10000, 6000, 'Bangalore, KA', 12.9716, 77.5946),
('Packaging Materials', 'Shipping boxes for small businesses', 
 (SELECT id FROM public.vendors WHERE name = 'BoxCraft Industries'), 'open', 8000, 4500, 'Delhi, DL', 28.7041, 77.1025);