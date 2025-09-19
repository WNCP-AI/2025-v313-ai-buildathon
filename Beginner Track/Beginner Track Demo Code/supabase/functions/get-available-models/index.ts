import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OpenAIModel {
  id: string;
  object: string;
  created: number;
  owned_by: string;
}

// Real popular models we want to prioritize (only actual OpenAI models)
const POPULAR_MODELS = [
  'gpt-4o',
  'gpt-4o-mini',
  'gpt-4-turbo',
  'gpt-4',
  'gpt-3.5-turbo'
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Fetch available models from OpenAI
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const models: OpenAIModel[] = data.data;

    console.log('Available models from OpenAI:', models.map(m => m.id).slice(0, 10));

    // Filter and organize models - only include actual GPT and reasoning models
    const chatModels = models
      .filter(model => 
        model.id.includes('gpt') && 
        !model.id.includes('instruct') && 
        !model.id.includes('search') &&
        !model.id.includes('embedding')
      )
      .sort((a, b) => {
        // Prioritize popular models
        const aIndex = POPULAR_MODELS.indexOf(a.id);
        const bIndex = POPULAR_MODELS.indexOf(b.id);
        
        if (aIndex !== -1 && bIndex !== -1) {
          return aIndex - bIndex;
        }
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;
        
        // Sort by creation date (newest first)
        return b.created - a.created;
      });

    const imageModels = models
      .filter(model => 
        model.id.includes('dall-e') || 
        model.id.includes('gpt-image') ||
        model.id.includes('image')
      )
      .sort((a, b) => b.created - a.created);

    console.log('Chat models found:', chatModels.map(m => m.id));
    console.log('Image models found:', imageModels.map(m => m.id));

    return new Response(JSON.stringify({
      chatModels: chatModels.map(model => ({
        value: model.id,
        label: formatModelName(model.id),
        created: model.created
      })),
      imageModels: imageModels.map(model => ({
        value: model.id,
        label: formatModelName(model.id),
        created: model.created
      }))
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching models:', error);
    
    // Return fallback models if API fails (only real models)
    return new Response(JSON.stringify({
      chatModels: [
        { value: "gpt-4o", label: "GPT-4o" },
        { value: "gpt-4o-mini", label: "GPT-4o Mini" },
        { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
        { value: "gpt-4", label: "GPT-4" },
        { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" }
      ],
      imageModels: [
        { value: "dall-e-3", label: "DALL-E 3" },
        { value: "dall-e-2", label: "DALL-E 2" }
      ],
      fallback: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function formatModelName(modelId: string): string {
  // Format model names for better readability, but mostly use raw names
  const nameMap: { [key: string]: string } = {
    'gpt-4o': 'GPT-4o',
    'gpt-4o-mini': 'GPT-4o Mini',
    'gpt-4-turbo': 'GPT-4 Turbo',
    'gpt-4': 'GPT-4',
    'gpt-3.5-turbo': 'GPT-3.5 Turbo',
    'dall-e-3': 'DALL-E 3',
    'dall-e-2': 'DALL-E 2'
  };
  
  // Return mapped name or the raw model ID for transparency
  return nameMap[modelId] || modelId;
}