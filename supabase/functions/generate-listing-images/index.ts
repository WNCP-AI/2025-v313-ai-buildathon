import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("=== Listing Image Generation Request ===");
    
    const { count, guidance = '' } = await req.json();
    console.log(`Requested image generation count: ${count}`);

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not found');
    }

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Supabase configuration not found');
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Get listings without images
    console.log("Fetching listings without images...");
    const { data: listingsWithoutImages, error: fetchError } = await supabase
      .from('listings')
      .select('*')
      .is('image_url', null)
      .eq('is_active', true)
      .limit(count);

    if (fetchError) {
      console.error("Error fetching listings:", fetchError);
      throw fetchError;
    }

    console.log(`Found ${listingsWithoutImages?.length || 0} listings without images`);

    if (!listingsWithoutImages || listingsWithoutImages.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "No listings without images found",
          generated: 0 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const imagesToGenerate = Math.min(count, listingsWithoutImages.length);
    console.log(`Generating images for ${imagesToGenerate} listings`);

    const results = [];

    for (let i = 0; i < imagesToGenerate; i++) {
      const listing = listingsWithoutImages[i];
      console.log(`=== Generating Image ${i + 1}/${imagesToGenerate} ===`);
      console.log(`Listing: ${listing.title}`);

      try {
        // Create a detailed prompt based on the listing
        const prompt = createImagePrompt(listing, guidance);
        console.log(`Generated prompt: ${prompt}`);

        // Generate image with OpenAI
        const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-image-1',
            prompt: prompt,
            n: 1,
            size: '1792x1024',
            quality: 'high',
            output_format: 'png'
          }),
        });

        if (!imageResponse.ok) {
          const errorText = await imageResponse.text();
          console.error(`OpenAI API error for listing ${listing.id}:`, errorText);
          
          // Try fallback to DALL-E 3 if gpt-image-1 fails
          console.log('Attempting fallback to DALL-E 3...');
          const fallbackResponse = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${openAIApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'dall-e-3',
              prompt: prompt.slice(0, 4000), // DALL-E 3 has shorter prompt limit
              n: 1,
              size: '1792x1024',
              quality: 'hd',
              response_format: 'b64_json'
            }),
          });

          if (!fallbackResponse.ok) {
            const fallbackErrorText = await fallbackResponse.text();
            console.error(`Fallback DALL-E 3 also failed for listing ${listing.id}:`, fallbackErrorText);
            results.push({
              listingId: listing.id,
              listingTitle: listing.title,
              success: false,
              error: `Primary model failed, fallback also failed: ${fallbackErrorText}`,
              usedFallback: true
            });
            continue;
          }

          const fallbackImageData = await fallbackResponse.json();
          console.log("Fallback successful, using DALL-E 3 response");
          
          // Process fallback response
          if (!fallbackImageData.data || !fallbackImageData.data[0] || !fallbackImageData.data[0].b64_json) {
            results.push({
              listingId: listing.id,
              listingTitle: listing.title,
              success: false,
              error: "Invalid fallback response structure",
              usedFallback: true
            });
            continue;
          }

          // Continue with fallback image data
          const imageData = fallbackImageData;
          const base64Data = imageData.data[0].b64_json;
          
          // Convert base64 to Uint8Array
          const imageBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

          // Upload to Supabase Storage
          const fileName = `listing-${listing.id}-${Date.now()}.png`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('listing-images')
            .upload(fileName, imageBuffer, {
              contentType: 'image/png',
              upsert: false
            });

          if (uploadError) {
            console.error(`Storage upload error for listing ${listing.id}:`, uploadError);
            results.push({
              listingId: listing.id,
              listingTitle: listing.title,
              success: false,
              error: `Storage upload error: ${uploadError.message}`,
              usedFallback: true
            });
            continue;
          }

          // Get the public URL
          const { data: { publicUrl } } = supabase.storage
            .from('listing-images')
            .getPublicUrl(fileName);

          console.log(`Fallback image uploaded successfully: ${publicUrl}`);

          // Update the listing with the image URL
          const { error: updateError } = await supabase
            .from('listings')
            .update({ image_url: publicUrl })
            .eq('id', listing.id);

          if (updateError) {
            console.error(`Database update error for listing ${listing.id}:`, updateError);
            results.push({
              listingId: listing.id,
              listingTitle: listing.title,
              success: false,
              error: `Database update error: ${updateError.message}`,
              usedFallback: true
            });
            continue;
          }

          console.log(`Successfully generated and assigned fallback image for listing: ${listing.title}`);
          results.push({
            listingId: listing.id,
            listingTitle: listing.title,
            success: true,
            imageUrl: publicUrl,
            usedFallback: true
          });
          continue;
        }

        const imageData = await imageResponse.json();
        console.log("OpenAI response received");
        console.log("Response structure:", JSON.stringify(imageData, null, 2));

        // gpt-image-1 returns base64 directly in different format
        let base64Data;
        if (imageData.data && imageData.data[0] && imageData.data[0].b64_json) {
          // DALL-E 3 format
          base64Data = imageData.data[0].b64_json;
        } else if (typeof imageData === 'string') {
          // gpt-image-1 returns base64 directly as string
          base64Data = imageData;
        } else {
          console.error("Invalid OpenAI response structure:", imageData);
          results.push({
            listingId: listing.id,
            listingTitle: listing.title,
            success: false,
            error: "Invalid OpenAI response structure"
          });
          continue;
        }
        
        // Convert base64 to Uint8Array
        const imageBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

        // Upload to Supabase Storage
        const fileName = `listing-${listing.id}-${Date.now()}.png`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('listing-images')
          .upload(fileName, imageBuffer, {
            contentType: 'image/png',
            upsert: false
          });

        if (uploadError) {
          console.error(`Storage upload error for listing ${listing.id}:`, uploadError);
          results.push({
            listingId: listing.id,
            listingTitle: listing.title,
            success: false,
            error: `Storage upload error: ${uploadError.message}`
          });
          continue;
        }

        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from('listing-images')
          .getPublicUrl(fileName);

        console.log(`Image uploaded successfully: ${publicUrl}`);

        // Update the listing with the image URL
        const { error: updateError } = await supabase
          .from('listings')
          .update({ image_url: publicUrl })
          .eq('id', listing.id);

        if (updateError) {
          console.error(`Database update error for listing ${listing.id}:`, updateError);
          results.push({
            listingId: listing.id,
            listingTitle: listing.title,
            success: false,
            error: `Database update error: ${updateError.message}`
          });
          continue;
        }

        console.log(`Successfully generated and assigned image for listing: ${listing.title}`);
        results.push({
          listingId: listing.id,
          listingTitle: listing.title,
          success: true,
          imageUrl: publicUrl
        });

      } catch (error) {
        console.error(`Error processing listing ${listing.id}:`, error);
        results.push({
          listingId: listing.id,
          listingTitle: listing.title,
          success: false,
          error: error.message
        });
      }
    }

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    console.log(`=== Image Generation Complete ===`);
    console.log(`Successful: ${successful}, Failed: ${failed}`);

    return new Response(
      JSON.stringify({
        success: true,
        generated: successful,
        failed: failed,
        total: imagesToGenerate,
        results: results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-listing-images function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        generated: 0 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function createImagePrompt(listing: any, guidance: string = ''): string {
  const categoryScenes = {
    'food_delivery': [
      'modern drone delivering fresh food to urban rooftop',
      'sleek delivery drone hovering near restaurant with thermal bags',
      'contactless food delivery drone at apartment balcony',
      'high-tech drone with insulated compartments in city skyline'
    ],
    'courier_parcel': [
      'industrial drone carrying packages over Detroit business district',
      'precision delivery drone placing package at office doorstep',
      'courier drone with secure cargo bay in warehouse setting',
      'commercial delivery drone network hub with multiple drones'
    ],
    'aerial_imaging': [
      'professional photography drone capturing Detroit Renaissance Center',
      'cinematic drone shot of urban development with dramatic lighting',
      'real estate photography drone hovering over modern building',
      'aerial survey drone with advanced camera equipment in action'
    ],
    'site_mapping': [
      'mapping drone with LiDAR equipment over construction site',
      'surveying drone capturing 3D terrain data with grid overlay visualization',
      'agricultural monitoring drone over farmland with data sensors',
      'environmental research drone analyzing urban green spaces'
    ]
  };

  const visualStyles = [
    'golden hour lighting with warm amber tones',
    'crisp morning light with sharp shadows and vivid colors',
    'dramatic sunset with purple and orange sky gradients',
    'bright daylight with clear blue sky and puffy white clouds',
    'urban twilight with city lights beginning to twinkle',
    'overcast day with soft, even lighting and professional atmosphere'
  ];

  const compositions = [
    'dynamic diagonal composition with leading lines',
    'rule of thirds with drone as focal point',
    'low angle perspective showing scale and power',
    'aerial perspective showing context and environment',
    'close-up detail shot emphasizing technology and precision',
    'wide establishing shot showcasing service area and capabilities'
  ];

  const scenes = categoryScenes[listing.category] || ['modern drone service in urban environment'];
  const randomScene = scenes[Math.floor(Math.random() * scenes.length)];
  const randomStyle = visualStyles[Math.floor(Math.random() * visualStyles.length)];
  const randomComposition = compositions[Math.floor(Math.random() * compositions.length)];
  
  // Create a detailed, varied prompt
  let prompt = `Professional marketing photography: ${randomScene}. 
  ${randomComposition}, ${randomStyle}. 
  High-end commercial photography style, sharp focus, professional color grading.
  Detroit urban backdrop with recognizable landmarks. 
  Premium service aesthetic, trustworthy and innovative feel.
  No text, logos, or overlays. Photorealistic, magazine-quality image.
  Technology integration with human-centered service delivery.`;

  // Add specific details based on listing content
  if (listing.title && listing.title.toLowerCase().includes('premium')) {
    prompt += ' Luxury aesthetic with premium materials and finishes.';
  }
  if (listing.title && listing.title.toLowerCase().includes('eco')) {
    prompt += ' Sustainable, environmentally conscious visual elements.';
  }
  if (listing.title && listing.title.toLowerCase().includes('rapid') || listing.title.toLowerCase().includes('fast')) {
    prompt += ' Dynamic motion blur effects suggesting speed and efficiency.';
  }

  // Add guidance if provided
  if (guidance.trim()) {
    prompt += ` Additional style guidance: ${guidance.trim()}.`;
  }

  return prompt;
}