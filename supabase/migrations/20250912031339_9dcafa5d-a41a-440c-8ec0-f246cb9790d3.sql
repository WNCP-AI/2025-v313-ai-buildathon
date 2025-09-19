-- Add policy to allow consumers to view basic operator info for bookings they made
CREATE POLICY "Consumers can view operator info for their bookings" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM booking_requests br
    JOIN listings l ON l.id = br.listing_id
    WHERE l.operator_id = profiles.user_id 
    AND br.consumer_id = auth.uid()
  )
);