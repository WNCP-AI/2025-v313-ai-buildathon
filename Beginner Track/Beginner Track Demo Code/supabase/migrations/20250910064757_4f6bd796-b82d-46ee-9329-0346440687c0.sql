-- Add bio field to existing profiles table
ALTER TABLE public.profiles ADD COLUMN bio TEXT;

-- Create service categories enum
CREATE TYPE public.service_category AS ENUM ('food_delivery', 'courier_parcel', 'aerial_imaging', 'site_mapping');

-- Create booking status enum  
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- Create listings table for operator services
CREATE TABLE public.listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  operator_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (length(title) <= 255),
  description TEXT,
  category service_category NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  service_area_text TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create booking_requests table
CREATE TABLE public.booking_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  consumer_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  requirements TEXT,
  preferred_date DATE,
  preferred_time TIME,
  status booking_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for listings
CREATE POLICY "Anyone can view active listings" 
ON public.listings 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Operators can view all their own listings" 
ON public.listings 
FOR SELECT 
USING (operator_id = auth.uid());

CREATE POLICY "Operators can create their own listings" 
ON public.listings 
FOR INSERT 
WITH CHECK (operator_id = auth.uid());

CREATE POLICY "Operators can update their own listings" 
ON public.listings 
FOR UPDATE 
USING (operator_id = auth.uid());

CREATE POLICY "Operators can delete their own listings" 
ON public.listings 
FOR DELETE 
USING (operator_id = auth.uid());

-- RLS Policies for booking_requests
CREATE POLICY "Users can view their own bookings as consumer" 
ON public.booking_requests 
FOR SELECT 
USING (consumer_id = auth.uid());

CREATE POLICY "Operators can view bookings for their listings" 
ON public.booking_requests 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.listings 
    WHERE listings.id = booking_requests.listing_id 
    AND listings.operator_id = auth.uid()
  )
);

CREATE POLICY "Consumers can create booking requests" 
ON public.booking_requests 
FOR INSERT 
WITH CHECK (consumer_id = auth.uid());

CREATE POLICY "Consumers can update their own booking requests" 
ON public.booking_requests 
FOR UPDATE 
USING (consumer_id = auth.uid());

CREATE POLICY "Operators can update booking requests for their listings" 
ON public.booking_requests 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.listings 
    WHERE listings.id = booking_requests.listing_id 
    AND listings.operator_id = auth.uid()
  )
);

-- Add update triggers for new tables
CREATE TRIGGER update_listings_updated_at
  BEFORE UPDATE ON public.listings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_booking_requests_updated_at
  BEFORE UPDATE ON public.booking_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_listings_operator_id ON public.listings(operator_id);
CREATE INDEX idx_listings_category ON public.listings(category);
CREATE INDEX idx_listings_is_active ON public.listings(is_active);
CREATE INDEX idx_booking_requests_consumer_id ON public.booking_requests(consumer_id);
CREATE INDEX idx_booking_requests_listing_id ON public.booking_requests(listing_id);
CREATE INDEX idx_booking_requests_status ON public.booking_requests(status);