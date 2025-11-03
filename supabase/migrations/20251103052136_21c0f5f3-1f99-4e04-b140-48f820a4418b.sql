-- Add eco_points to sustainability_stats
ALTER TABLE public.sustainability_stats
ADD COLUMN eco_points integer NOT NULL DEFAULT 0;

-- Create badges table for achievement definitions
CREATE TABLE public.badges (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  requirement_type text NOT NULL, -- 'items_sold', 'items_donated', 'items_recycled', 'co2_offset', etc.
  requirement_value integer NOT NULL,
  eco_points_reward integer NOT NULL DEFAULT 0,
  tier text NOT NULL DEFAULT 'bronze', -- bronze, silver, gold, platinum
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create user_badges table to track earned badges
CREATE TABLE public.user_badges (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  badge_id uuid NOT NULL,
  earned_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Create rewards table for redeemable items
CREATE TABLE public.rewards (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  image_url text,
  eco_points_cost integer NOT NULL,
  reward_type text NOT NULL, -- 'discount', 'donation', 'feature_unlock', 'physical'
  reward_value jsonb NOT NULL, -- stores discount amount, feature name, etc.
  active boolean NOT NULL DEFAULT true,
  stock_quantity integer,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create reward_redemptions table to track claimed rewards
CREATE TABLE public.reward_redemptions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  reward_id uuid NOT NULL,
  eco_points_spent integer NOT NULL,
  status text NOT NULL DEFAULT 'pending', -- pending, approved, completed, cancelled
  redeemed_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone,
  redemption_code text,
  notes text
);

-- Enable RLS
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_redemptions ENABLE ROW LEVEL SECURITY;

-- Badges policies
CREATE POLICY "Badges are viewable by everyone"
ON public.badges FOR SELECT
USING (true);

-- User badges policies
CREATE POLICY "Users can view all earned badges"
ON public.user_badges FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "System can award badges"
ON public.user_badges FOR INSERT
WITH CHECK (true);

-- Rewards policies
CREATE POLICY "Active rewards are viewable by everyone"
ON public.rewards FOR SELECT
USING (active = true);

-- Reward redemptions policies
CREATE POLICY "Users can view own redemptions"
ON public.reward_redemptions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create redemptions"
ON public.reward_redemptions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own redemptions"
ON public.reward_redemptions FOR UPDATE
USING (auth.uid() = user_id);

-- Insert initial badges
INSERT INTO public.badges (name, description, icon, requirement_type, requirement_value, eco_points_reward, tier) VALUES
('First Step', 'Sell your first item', '♻️', 'items_sold', 1, 10, 'bronze'),
('Generous Heart', 'Donate your first item', '❤️', 'items_donated', 1, 15, 'bronze'),
('Eco Warrior', 'Recycle your first item', '🌱', 'items_recycled', 1, 20, 'bronze'),
('Rising Seller', 'Sell 10 items', '🌟', 'items_sold', 10, 50, 'silver'),
('Giving Back', 'Donate 10 items', '💝', 'items_donated', 10, 75, 'silver'),
('Green Champion', 'Recycle 10 items', '🏆', 'items_recycled', 10, 100, 'silver'),
('Sustainable Star', 'Sell 50 items', '⭐', 'items_sold', 50, 250, 'gold'),
('Philanthropist', 'Donate 50 items', '👑', 'items_donated', 50, 300, 'gold'),
('Planet Protector', 'Recycle 50 items', '🌍', 'items_recycled', 50, 350, 'gold'),
('Eco Legend', 'Sell 100 items', '💎', 'items_sold', 100, 500, 'platinum'),
('Ultimate Giver', 'Donate 100 items', '✨', 'items_donated', 100, 600, 'platinum'),
('Carbon Hero', 'Offset 100kg of CO2', '🌳', 'co2_offset', 100, 700, 'platinum');

-- Insert initial rewards
INSERT INTO public.rewards (title, description, image_url, eco_points_cost, reward_type, reward_value) VALUES
('10% Discount Coupon', 'Get 10% off your next purchase', null, 50, 'discount', '{"percent": 10, "max_amount": 100}'::jsonb),
('20% Discount Coupon', 'Get 20% off your next purchase', null, 100, 'discount', '{"percent": 20, "max_amount": 200}'::jsonb),
('Plant a Tree', 'We''ll plant a real tree in your name', null, 200, 'donation', '{"partner": "TreePlanting Foundation", "trees": 1}'::jsonb),
('Feature Listing', 'Feature your product on homepage for 7 days', null, 150, 'feature_unlock', '{"feature": "homepage_spotlight", "duration_days": 7}'::jsonb),
('Free Verified Badge', 'Get verified seller badge', null, 300, 'feature_unlock', '{"feature": "verified_badge"}'::jsonb),
('Eco Warrior T-Shirt', 'Limited edition sustainable cotton t-shirt', null, 500, 'physical', '{"item": "t-shirt", "size": "customizable"}'::jsonb),
('Plant 10 Trees', 'We''ll plant 10 trees in your name', null, 1500, 'donation', '{"partner": "TreePlanting Foundation", "trees": 10}'::jsonb);

-- Create trigger to update sustainability stats
CREATE OR REPLACE FUNCTION public.update_sustainability_stats_on_order()
RETURNS TRIGGER AS $$
DECLARE
  v_condition product_condition;
  v_is_donation boolean;
  v_eco_points integer;
BEGIN
  -- Get product details
  SELECT condition, is_donation INTO v_condition, v_is_donation
  FROM public.products
  WHERE id = NEW.product_id;

  -- Initialize eco points
  v_eco_points := 0;

  -- Update seller stats (only for completed orders)
  IF NEW.status = 'delivered' THEN
    IF v_is_donation THEN
      -- Donation: award more points
      v_eco_points := 15;
      UPDATE public.sustainability_stats
      SET 
        items_donated = items_donated + 1,
        co2_offset_kg = co2_offset_kg + 2.5,
        water_saved_liters = water_saved_liters + 700,
        trees_saved = trees_saved + 0.01,
        eco_points = eco_points + v_eco_points,
        total_impact_score = total_impact_score + 20,
        updated_at = now()
      WHERE user_id = NEW.seller_id;
    ELSE
      -- Regular sale: award points based on condition
      CASE v_condition
        WHEN 'new_with_tags' THEN v_eco_points := 5;
        WHEN 'like_new' THEN v_eco_points := 7;
        WHEN 'good' THEN v_eco_points := 10;
        WHEN 'fair' THEN v_eco_points := 12;
        ELSE v_eco_points := 5;
      END CASE;

      UPDATE public.sustainability_stats
      SET 
        items_sold = items_sold + 1,
        co2_offset_kg = co2_offset_kg + 3.5,
        water_saved_liters = water_saved_liters + 1000,
        trees_saved = trees_saved + 0.02,
        eco_points = eco_points + v_eco_points,
        total_impact_score = total_impact_score + 15,
        updated_at = now()
      WHERE user_id = NEW.seller_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for order completion
CREATE TRIGGER on_order_completed
AFTER UPDATE OF status ON public.orders
FOR EACH ROW
WHEN (NEW.status = 'delivered' AND OLD.status != 'delivered')
EXECUTE FUNCTION public.update_sustainability_stats_on_order();

-- Add trigger to automatically award badges
CREATE OR REPLACE FUNCTION public.check_and_award_badges()
RETURNS TRIGGER AS $$
DECLARE
  badge_record RECORD;
BEGIN
  -- Check each badge requirement
  FOR badge_record IN 
    SELECT b.id, b.requirement_type, b.requirement_value, b.eco_points_reward
    FROM public.badges b
    WHERE NOT EXISTS (
      SELECT 1 FROM public.user_badges ub
      WHERE ub.user_id = NEW.user_id AND ub.badge_id = b.id
    )
  LOOP
    -- Check if user meets the requirement
    CASE badge_record.requirement_type
      WHEN 'items_sold' THEN
        IF NEW.items_sold >= badge_record.requirement_value THEN
          INSERT INTO public.user_badges (user_id, badge_id)
          VALUES (NEW.user_id, badge_record.id);
          
          -- Award bonus eco points
          UPDATE public.sustainability_stats
          SET eco_points = eco_points + badge_record.eco_points_reward
          WHERE user_id = NEW.user_id;
        END IF;
      WHEN 'items_donated' THEN
        IF NEW.items_donated >= badge_record.requirement_value THEN
          INSERT INTO public.user_badges (user_id, badge_id)
          VALUES (NEW.user_id, badge_record.id);
          
          UPDATE public.sustainability_stats
          SET eco_points = eco_points + badge_record.eco_points_reward
          WHERE user_id = NEW.user_id;
        END IF;
      WHEN 'items_recycled' THEN
        IF NEW.items_recycled >= badge_record.requirement_value THEN
          INSERT INTO public.user_badges (user_id, badge_id)
          VALUES (NEW.user_id, badge_record.id);
          
          UPDATE public.sustainability_stats
          SET eco_points = eco_points + badge_record.eco_points_reward
          WHERE user_id = NEW.user_id;
        END IF;
      WHEN 'co2_offset' THEN
        IF NEW.co2_offset_kg >= badge_record.requirement_value THEN
          INSERT INTO public.user_badges (user_id, badge_id)
          VALUES (NEW.user_id, badge_record.id);
          
          UPDATE public.sustainability_stats
          SET eco_points = eco_points + badge_record.eco_points_reward
          WHERE user_id = NEW.user_id;
        END IF;
    END CASE;
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER check_badges_trigger
AFTER UPDATE ON public.sustainability_stats
FOR EACH ROW
EXECUTE FUNCTION public.check_and_award_badges();