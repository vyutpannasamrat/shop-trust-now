-- Create agent_assignments table for agent management
CREATE TABLE public.agent_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  current_location JSONB,
  estimated_pickup_time TIMESTAMP WITH TIME ZONE,
  estimated_delivery_time TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned', 'accepted', 'en_route_pickup', 'picked_up', 'en_route_delivery', 'delivered', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.agent_assignments ENABLE ROW LEVEL SECURITY;

-- Policies for agent_assignments
CREATE POLICY "Agents can view their assignments"
ON public.agent_assignments
FOR SELECT
USING (auth.uid() = agent_id);

CREATE POLICY "Agents can update their assignments"
ON public.agent_assignments
FOR UPDATE
USING (auth.uid() = agent_id);

CREATE POLICY "Admins can manage all assignments"
ON public.agent_assignments
FOR ALL
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "System can create assignments"
ON public.agent_assignments
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'agent'));

-- Trigger for updated_at
CREATE TRIGGER update_agent_assignments_updated_at
BEFORE UPDATE ON public.agent_assignments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes
CREATE INDEX idx_agent_assignments_agent ON public.agent_assignments(agent_id);
CREATE INDEX idx_agent_assignments_order ON public.agent_assignments(order_id);
CREATE INDEX idx_agent_assignments_status ON public.agent_assignments(status);

-- Add agent role if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role' AND 'agent' = ANY(enum_range(NULL::app_role)::text[])) THEN
    ALTER TYPE app_role ADD VALUE 'agent';
  END IF;
END
$$;