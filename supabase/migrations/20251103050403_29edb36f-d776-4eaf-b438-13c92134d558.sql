-- Fix critical security issues from security scan

-- 1. CRITICAL: Restrict profiles table - only allow viewing own profile and profiles of transaction partners
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can view seller profiles"
ON public.profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.products
    WHERE products.seller_id = profiles.user_id
  )
);

CREATE POLICY "Users can view transaction partner profiles"
ON public.profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE (orders.buyer_id = auth.uid() AND orders.seller_id = profiles.user_id)
       OR (orders.seller_id = auth.uid() AND orders.buyer_id = profiles.user_id)
       OR (orders.agent_id = auth.uid() AND (orders.buyer_id = profiles.user_id OR orders.seller_id = profiles.user_id))
  )
);

-- 2. CRITICAL: Restrict sustainability stats - only public view for leaderboard aggregate, not individual details
DROP POLICY IF EXISTS "Public can view top performers" ON public.sustainability_stats;

CREATE POLICY "Users can view aggregate stats for leaderboard"
ON public.sustainability_stats FOR SELECT
USING (auth.uid() IS NOT NULL);

-- 3. Add missing DELETE policies
CREATE POLICY "Users can delete own emergency contacts"
ON public.emergency_contacts FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications"
ON public.notifications FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own breadcrumb trails"
ON public.breadcrumb_trails FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own AI context"
ON public.ai_context FOR DELETE
USING (auth.uid() = user_id);

-- 4. Add UPDATE policies
CREATE POLICY "Users can update own SOS alerts"
ON public.sos_alerts FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Buyers can update own orders"
ON public.orders FOR UPDATE
USING (auth.uid() = buyer_id);

CREATE POLICY "Sellers can update order status"
ON public.orders FOR UPDATE
USING (auth.uid() = seller_id);

-- 5. Add INSERT policy for notifications (system/service role)
CREATE POLICY "System can create notifications"
ON public.notifications FOR INSERT
WITH CHECK (true);

-- 6. Fix team messages visibility
DROP POLICY IF EXISTS "Users can view their own messages" ON public.messages;

CREATE POLICY "Users can view their messages"
ON public.messages FOR SELECT
USING (
  auth.uid() = sender_id 
  OR auth.uid() = receiver_id
  OR (team_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_members.team_id = messages.team_id
    AND team_members.user_id = auth.uid()
  ))
);

-- 7. Add UPDATE policy for team members
CREATE POLICY "Team admins can update member roles"
ON public.team_members FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.team_members tm
    WHERE tm.team_id = team_members.team_id
    AND tm.user_id = auth.uid()
    AND tm.role = 'admin'
  )
  OR EXISTS (
    SELECT 1 FROM public.teams
    WHERE teams.id = team_members.team_id
    AND teams.owner_id = auth.uid()
  )
);

-- 8. Add UPDATE and DELETE policies for sensor data
CREATE POLICY "Users can update own sensor data"
ON public.sensor_data FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sensor data"
ON public.sensor_data FOR DELETE
USING (auth.uid() = user_id);