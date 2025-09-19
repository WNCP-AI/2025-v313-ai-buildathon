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
    console.log("=== Profile Image Generation Request ===");
    
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

    // Get profiles without avatar images
    console.log("Fetching profiles without avatar images...");
    const { data: profilesWithoutImages, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .is('avatar_url', null)
      .limit(count);

    if (fetchError) {
      console.error("Error fetching profiles:", fetchError);
      throw fetchError;
    }

    console.log(`Found ${profilesWithoutImages?.length || 0} profiles without avatar images`);

    if (!profilesWithoutImages || profilesWithoutImages.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "No profiles without avatar images found",
          generated: 0 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const imagesToGenerate = Math.min(count, profilesWithoutImages.length);
    console.log(`Generating images for ${imagesToGenerate} profiles`);

    const results = [];

    for (let i = 0; i < imagesToGenerate; i++) {
      const profile = profilesWithoutImages[i];
      console.log(`=== Generating Image ${i + 1}/${imagesToGenerate} ===`);
      console.log(`Profile: ${profile.full_name}`);

      try {
        // Create a detailed prompt based on the profile
        const prompt = createImagePrompt(profile, guidance);
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
            size: '1024x1024',
            quality: 'high',
            output_format: 'png'
          }),
        });

        if (!imageResponse.ok) {
          const errorText = await imageResponse.text();
          console.error(`OpenAI API error for profile ${profile.id}:`, errorText);
          
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
              size: '1024x1024',
              quality: 'hd',
              response_format: 'b64_json'
            }),
          });

          if (!fallbackResponse.ok) {
            const fallbackErrorText = await fallbackResponse.text();
            console.error(`Fallback DALL-E 3 also failed for profile ${profile.id}:`, fallbackErrorText);
            results.push({
              profileId: profile.id,
              profileName: profile.full_name,
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
              profileId: profile.id,
              profileName: profile.full_name,
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
          const fileName = `profile-${profile.id}-${Date.now()}.png`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('listing-images')
            .upload(fileName, imageBuffer, {
              contentType: 'image/png',
              upsert: false
            });

          if (uploadError) {
            console.error(`Storage upload error for profile ${profile.id}:`, uploadError);
            results.push({
              profileId: profile.id,
              profileName: profile.full_name,
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

          // Update the profile with the avatar URL
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ avatar_url: publicUrl })
            .eq('id', profile.id);

          if (updateError) {
            console.error(`Database update error for profile ${profile.id}:`, updateError);
            results.push({
              profileId: profile.id,
              profileName: profile.full_name,
              success: false,
              error: `Database update error: ${updateError.message}`,
              usedFallback: true
            });
            continue;
          }

          console.log(`Successfully generated and assigned fallback avatar for profile: ${profile.full_name}`);
          results.push({
            profileId: profile.id,
            profileName: profile.full_name,
            success: true,
            avatarUrl: publicUrl,
            usedFallback: true
          });
          continue;
        }

        const imageData = await imageResponse.json();
        console.log("OpenAI response received");

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
            profileId: profile.id,
            profileName: profile.full_name,
            success: false,
            error: "Invalid OpenAI response structure"
          });
          continue;
        }
        
        // Convert base64 to Uint8Array
        const imageBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

        // Upload to Supabase Storage (using same bucket as listing images)
        const fileName = `profile-${profile.id}-${Date.now()}.png`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('listing-images')
          .upload(fileName, imageBuffer, {
            contentType: 'image/png',
            upsert: false
          });

        if (uploadError) {
          console.error(`Storage upload error for profile ${profile.id}:`, uploadError);
          results.push({
            profileId: profile.id,
            profileName: profile.full_name,
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

        // Update the profile with the avatar URL
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ avatar_url: publicUrl })
          .eq('id', profile.id);

        if (updateError) {
          console.error(`Database update error for profile ${profile.id}:`, updateError);
          results.push({
            profileId: profile.id,
            profileName: profile.full_name,
            success: false,
            error: `Database update error: ${updateError.message}`
          });
          continue;
        }

        console.log(`Successfully generated and assigned avatar for profile: ${profile.full_name}`);
        results.push({
          profileId: profile.id,
          profileName: profile.full_name,
          success: true,
          avatarUrl: publicUrl
        });

      } catch (error) {
        console.error(`Error processing profile ${profile.id}:`, error);
        results.push({
          profileId: profile.id,
          profileName: profile.full_name,
          success: false,
          error: error.message
        });
      }
    }

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    console.log(`=== Profile Image Generation Complete ===`);
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
    console.error('Error in generate-profile-images function:', error);
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

function createImagePrompt(profile: any, guidance: string = ''): string {
  const portraitStyles = [
    'warm natural lighting with soft shadows',
    'professional studio lighting with crisp details',
    'golden hour outdoor portrait with bokeh background',
    'modern minimalist style with clean background',
    'environmental portrait with subtle workplace context',
    'confident corporate headshot with professional attire'
  ];

  const expressions = [
    'confident and approachable smile',
    'thoughtful and professional demeanor',
    'friendly and trustworthy expression',
    'innovative and forward-thinking look',
    'calm and reliable presence',
    'enthusiastic and passionate attitude'
  ];

  const backgrounds = [
    'soft gradient background in neutral tones',
    'subtle office environment with blurred details',
    'modern tech workspace with warm lighting',
    'outdoor setting with natural elements softly blurred',
    'contemporary studio setup with professional lighting',
    'urban Detroit backdrop with artistic bokeh effect'
  ];

  const demographicVariations = [
    'young professional in their 20s-30s',
    'experienced professional in their 30s-40s',
    'seasoned expert in their 40s-50s',
    'diverse ethnic background representing Detroit\'s community',
    'multicultural professional reflecting modern workforce'
  ];

  const roleSpecific = {
    operator: [
      'wearing casual professional attire suitable for fieldwork',
      'tech-savvy professional with confident stance',
      'hands-on service provider with practical expertise',
      'innovative entrepreneur with vision and determination'
    ],
    consumer: [
      'business professional with polished appearance',
      'community member with approachable demeanor',
      'tech-enthusiast with modern style',
      'local resident with friendly neighborhood vibe'
    ]
  };

  const randomStyle = portraitStyles[Math.floor(Math.random() * portraitStyles.length)];
  const randomExpression = expressions[Math.floor(Math.random() * expressions.length)];
  const randomBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)];
  const randomDemographic = demographicVariations[Math.floor(Math.random() * demographicVariations.length)];
  const roleSpecificTrait = roleSpecific[profile.role] ? 
    roleSpecific[profile.role][Math.floor(Math.random() * roleSpecific[profile.role].length)] :
    'professional with authentic presence';

  let prompt = `Professional portrait photography of ${randomDemographic}, ${roleSpecificTrait}.
  ${randomStyle}, ${randomBackground}.
  ${randomExpression}, genuine and authentic personality.
  High-resolution portrait photography, magazine quality.
  Diverse representation, realistic human features.
  Professional but approachable, trustworthy service provider aesthetic.
  Sharp focus on eyes, professional color grading.
  No text, logos, or graphic overlays.`;

  // Add name-based personality hints
  const firstName = profile.full_name.split(' ')[0].toLowerCase();
  if (['alex', 'taylor', 'jordan', 'casey', 'morgan'].includes(firstName)) {
    prompt += ' Modern, tech-forward professional style.';
  }

  // Add any bio context if available
  if (profile.bio && profile.bio.trim()) {
    prompt += ` Professional context: ${profile.bio.trim()}.`;
  }

  // Add guidance if provided
  if (guidance.trim()) {
    prompt += ` Additional style guidance: ${guidance.trim()}.`;
  }

  return prompt;
}