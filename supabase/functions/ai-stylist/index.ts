import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, searchQuery } = await req.json() as { 
      messages: Message[]; 
      searchQuery?: string;
    };

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client for product search
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Search products if query provided
    let productsContext = '';
    if (searchQuery) {
      const { data: products, error } = await supabase
        .from('products')
        .select('id, title, description, category, brand, size, color, price, condition, sustainability_score')
        .eq('is_available', true)
        .or(`title.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%,color.ilike.%${searchQuery}%`)
        .limit(10);

      if (!error && products && products.length > 0) {
        productsContext = `\n\nAvailable products matching "${searchQuery}":\n${products.map(p => 
          `- ${p.title} (${p.brand || 'No brand'}) - ${p.category}, ${p.color}, Size ${p.size}, $${p.price}, ${p.condition} condition${p.sustainability_score ? `, Sustainability: ${p.sustainability_score}/100` : ''}`
        ).join('\n')}`;
      }
    }

    const systemPrompt = `You are StyleHub's AI Fashion Stylist - a sustainable fashion expert helping users make eco-conscious clothing choices.

Your expertise includes:
- Outfit recommendations for any occasion (work, casual, formal, dates, etc.)
- Color coordination and style matching
- Estimating resale values of clothing items
- Providing sustainability tips and eco-friendly alternatives
- Analyzing wardrobe gaps and suggesting essential pieces
- Fashion trends with a sustainability focus

Guidelines:
- Always prioritize sustainable and ethical fashion choices
- Recommend buying secondhand when possible
- Explain the environmental impact of fashion choices
- Be enthusiastic and supportive
- Keep responses concise but helpful (2-3 short paragraphs max)
- Use the products database when users ask for specific items
- When discussing prices, mention that secondhand clothes save both money and the environment
- Encourage users to donate or recycle items they no longer wear${productsContext}

Remember: Every secondhand clothing purchase saves approximately 7kg of CO₂ emissions compared to buying new!`;

    console.log('Calling AI gateway with', messages.length, 'messages');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        stream: true,
        temperature: 0.8,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Too many requests. Please try again in a moment.' }), 
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service quota exceeded. Please contact support.' }), 
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'AI service error' }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Stream the response back to client
    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Error in ai-stylist function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
