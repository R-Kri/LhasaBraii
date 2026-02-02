-- Fix RLS policy on user_profiles to allow order participants to view each other's profiles
-- This is necessary for the buying flow where buyers need to see seller info and vice versa

-- Allow users to view profiles of people they have orders with (as buyer or seller)
CREATE POLICY "Users can view profiles of order participants"
ON "public"."user_profiles"
AS permissive
FOR SELECT
TO public
USING (
  -- Can view if you have an order with this person (as buyer seeing seller, or seller seeing buyer)
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE (
      (orders.buyer_id = auth.uid() AND orders.seller_id = user_profiles.id)
      OR
      (orders.seller_id = auth.uid() AND orders.buyer_id = user_profiles.id)
    )
  )
);

-- Also allow viewing basic profile info for book sellers (so buyers can see seller info on book pages)
CREATE POLICY "Users can view seller profiles for approved books"
ON "public"."user_profiles"
AS permissive
FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM public.books
    WHERE books.seller_id = user_profiles.id
    AND books.status = 'approved'
  )
);
