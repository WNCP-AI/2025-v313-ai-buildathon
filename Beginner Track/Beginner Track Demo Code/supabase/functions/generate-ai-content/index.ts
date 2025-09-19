import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

console.log('=== Edge Function Initialization ===');
console.log('Supabase URL available:', !!Deno.env.get('SUPABASE_URL'));
console.log('Service role key available:', !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'));

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== AI Content Generation Request ===');
    const { type, prompt = '', count = 1, guidance = '' } = await req.json();
    console.log('Request params:', { type, prompt, count });
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    console.log('OpenAI API key available:', !!openAIApiKey);

    if (!openAIApiKey) {
      console.error('OpenAI API key not found in environment');
      throw new Error('OpenAI API key not configured');
    }

    if (type === 'users') {
      console.log('Generating users...');
      return await generateUsers(openAIApiKey, count, guidance);
    } else if (type === 'listing') {
      console.log('Generating listing...');
      return await generateListing(openAIApiKey, guidance, count);
    } else {
      console.error('Invalid type:', type);
      throw new Error('Invalid type. Use "users" or "listing"');
    }
  } catch (error) {
    console.error('=== Edge Function Error ===');
    console.error('Error details:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function generateUsers(apiKey: string, count: number, guidance: string = '') {
  console.log('=== Generating Users (Simplified) ===');
  console.log('Count requested:', count);
  
  const createdUsers = [];
  
  // Generate users one at a time to avoid complex JSON parsing issues
  for (let i = 0; i < count; i++) {
    console.log(`=== Generating User ${i + 1}/${count} ===`);
    
    const guidanceText = guidance ? ` Additional guidance: ${guidance}.` : '';
    
    // Create varied user personas for more diversity
    const personas = [
      'tech-savvy entrepreneur', 'busy working parent', 'small business owner', 'creative professional',
      'real estate agent', 'construction manager', 'event planner', 'logistics coordinator',
      'photographer', 'architect', 'farming specialist', 'emergency responder',
      'college student', 'retiree exploring new tech', 'freelance consultant', 'startup founder'
    ];
    
    const interests = [
      'sustainability and eco-friendly solutions', 'cutting-edge technology', 'efficiency and time-saving',
      'cost-effective business solutions', 'creative applications', 'safety and reliability',
      'community service', 'innovation in urban planning', 'outdoor activities', 'data analytics'
    ];
    
    const backgrounds = [
      'engineering', 'business', 'arts', 'healthcare', 'education', 'retail',
      'manufacturing', 'non-profit', 'government', 'agriculture', 'media', 'finance'
    ];
    
    const randomPersona = personas[Math.floor(Math.random() * personas.length)];
    const randomInterest = interests[Math.floor(Math.random() * interests.length)];
    const randomBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    const roleChoice = Math.random() > 0.5 ? 'operator' : 'consumer';
    
    const userPrompt = `Generate 1 realistic user profile for a drone marketplace in Detroit. Create a ${randomPersona} with background in ${randomBackground} who is interested in ${randomInterest}.${guidanceText} 

Return ONLY valid JSON with this exact structure:
{
  "full_name": "First Last",
  "email": "unique.email@domain.com",
  "phone": "+1-555-000-0000", 
  "role": "${roleChoice}"
}

Make the name and email reflect their personality and background. Use realistic Detroit-area details. No extra text, just the JSON object.`;

    try {
      console.log('Calling OpenAI for single user...');
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: userPrompt }],
          max_tokens: 200,
          temperature: 0.7
        }),
      });

      if (!response.ok) {
        console.error('OpenAI API error:', response.status);
        continue;
      }

      const data = await response.json();
      let content = data.choices[0].message.content.trim();
      
      // Clean up the response to ensure it's valid JSON
      if (content.startsWith('```json')) {
        content = content.replace(/```json\n?/g, '').replace(/```/g, '');
      }
      
      console.log('Raw OpenAI response:', content);
      
      let userData;
      try {
        userData = JSON.parse(content);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Content was:', content);
        continue;
      }

      // Check if user already exists
      const { data: existingUser } = await supabase.auth.admin.listUsers();
      const emailExists = existingUser?.users?.some(u => u.email === userData.email);
      
      if (emailExists) {
        console.log('User already exists, skipping:', userData.email);
        continue;
      }

      console.log('Creating auth user for:', userData.email);
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: 'TempPassword123!',
        email_confirm: true,
        user_metadata: {
          full_name: userData.full_name,
          phone: userData.phone,
          role: userData.role,
          is_ai_generated: true
        }
      });

      if (authError) {
        console.error('Auth user creation error:', authError);
        continue;
      }
      
      console.log('User created successfully:', userData.email, 'ID:', authUser.user?.id);
      
      // Verify profile was created by the trigger
      let profileCreated = false;
      let attempts = 0;
      const maxAttempts = 5;
      
      while (!profileCreated && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms
        
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('user_id')
          .eq('user_id', authUser.user?.id)
          .single();
          
        if (profile) {
          profileCreated = true;
          console.log(`Profile automatically created for user ${userData.email}`);
        } else {
          attempts++;
          console.log(`Profile not yet created for ${userData.email}, attempt ${attempts}/${maxAttempts}`);
        }
      }
      
      // If trigger failed, create profile manually
      if (!profileCreated && authUser.user) {
        console.log(`Creating profile manually for user ${userData.email}`);
        const { error: manualProfileError } = await supabase
          .from('profiles')
          .insert({
            user_id: authUser.user.id,
            full_name: userData.full_name,
            phone: userData.phone,
            role: userData.role,
            is_ai_generated: true
          });
          
        if (manualProfileError) {
          console.error(`Failed to create profile manually for ${userData.email}:`, manualProfileError);
          continue; // Skip adding this user if profile creation fails
        } else {
          console.log(`Successfully created profile manually for ${userData.email}`);
        }
      }
      
      createdUsers.push({
        ...userData,
        id: authUser.user?.id
      });
      
      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error('Error in user generation loop:', error);
      continue;
    }
  }

  console.log('=== User Generation Complete ===');
  console.log('Total users created:', createdUsers.length);
  
  return new Response(
    JSON.stringify({ 
      success: true, 
      message: `Generated ${createdUsers.length} users`,
      users: createdUsers 
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function generateListing(apiKey: string, guidance: string, count: number) {
  console.log('=== Generating Listings (Simplified) ===');
  console.log('Guidance:', guidance, 'Count:', count);

  // Category mapping from human-readable to database values
  const categoryMapping = {
    'Food Delivery': 'food_delivery',
    'Courier/Parcel': 'courier_parcel',
    'Aerial Imaging': 'aerial_imaging',
    'Site Mapping': 'site_mapping'
  };

  // Get random operators using service role client (only AI-generated operators to avoid using real user accounts)
  console.log('Fetching AI-generated operators...');
  const { data: operators, error: operatorError } = await supabase
    .from('profiles')
    .select('user_id, full_name, role')
    .eq('role', 'operator')
    .eq('is_ai_generated', true)
    .limit(50); // Increased limit for better randomization

  console.log('AI operators found:', operators?.length || 0);
  if (operatorError) {
    console.error('Error fetching operators:', operatorError);
    throw new Error(`Failed to fetch operators: ${operatorError.message}`);
  }

  if (!operators || operators.length === 0) {
    throw new Error('No AI-generated operators found. Please generate some operator users first using the user generator.');
  }

  // Verify each operator has a valid auth user
  const validatedOperators = [];
  for (const operator of operators) {
    try {
      const { data: authUser } = await supabase.auth.admin.getUserById(operator.user_id);
      if (authUser.user) {
        validatedOperators.push(operator);
      } else {
        console.log(`Operator ${operator.full_name} has invalid auth user, skipping`);
      }
    } catch (error) {
      console.log(`Error validating operator ${operator.full_name}:`, error);
    }
  }

  console.log('Validated operators:', validatedOperators.length);
  if (validatedOperators.length === 0) {
    throw new Error('No valid operators found with working auth accounts.');
  }

  const createdListings = [];

  // Generate listings one at a time to avoid complex batch failures
  for (let i = 0; i < count; i++) {
    console.log(`=== Generating Listing ${i + 1}/${count} ===`);
    
    const randomOperator = validatedOperators[Math.floor(Math.random() * validatedOperators.length)];
    console.log('Selected operator:', randomOperator.full_name);
    
    // Create more varied and interesting listing prompts
    const serviceStyles = [
      'premium boutique', 'affordable community-focused', 'high-tech specialized', 'eco-friendly sustainable',
      'rapid response emergency', 'artistic creative', 'data-driven analytical', 'family-owned local'
    ];
    
    const specialties = {
      'Food Delivery': ['hot food preservation', 'contactless delivery', 'multi-restaurant routes', 'cold chain logistics', 'rooftop delivery access'],
      'Courier/Parcel': ['same-day urgent delivery', 'fragile item handling', 'document security', 'bulk commercial delivery', 'medical supply transport'],
      'Aerial Imaging': ['real estate showcases', 'construction progress monitoring', 'event photography', 'infrastructure inspection', 'artistic cinematography'],
      'Site Mapping': ['3D terrain modeling', 'agricultural crop analysis', 'urban planning surveys', 'environmental monitoring', 'archaeological documentation']
    };
    
    const detroitAreas = [
      'Downtown Detroit', 'Midtown Detroit', 'Corktown', 'Eastern Market', 'Belle Isle area',
      'Royal Oak', 'Birmingham', 'Troy', 'Ferndale', 'Hamtramck', 'Dearborn', 'Southfield'
    ];
    
    const categories = ['Food Delivery', 'Courier/Parcel', 'Aerial Imaging', 'Site Mapping'];
    const selectedCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomStyle = serviceStyles[Math.floor(Math.random() * serviceStyles.length)];
    const randomSpecialty = specialties[selectedCategory][Math.floor(Math.random() * specialties[selectedCategory].length)];
    const randomArea = detroitAreas[Math.floor(Math.random() * detroitAreas.length)];
    
    const listingPrompt = `Generate 1 realistic ${randomStyle} service listing for a drone marketplace in Detroit. Focus on ${randomSpecialty} in the ${randomArea} area. Guidance: "${guidance}"

Create a compelling, unique service that stands out from competitors. Be specific about value proposition and service details.

Valid categories (choose exactly one): "Food Delivery", "Courier/Parcel", "Aerial Imaging", "Site Mapping"

Return ONLY valid JSON with this exact structure:
{
  "title": "Catchy service title (max 50 chars)",
  "description": "Detailed description highlighting unique value, specialization, and benefits (150-250 words)",
  "category": "${selectedCategory}",
  "price": 45,
  "service_area_text": "${randomArea} and surrounding Metro Detroit areas"
}

Make the price realistic for the service type and specialization level. No extra text, just the JSON object.`;

    try {
      const textResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: listingPrompt }],
          max_tokens: 300,
          temperature: 0.7
        }),
      });

      if (!textResponse.ok) {
        console.error('OpenAI API error for listing:', textResponse.status);
        continue;
      }

      const textData = await textResponse.json();
      let content = textData.choices[0].message.content.trim();
      
      // Clean up the response
      if (content.startsWith('```json')) {
        content = content.replace(/```json\n?/g, '').replace(/```/g, '');
      }
      
      console.log('Raw listing response:', content);

      let listingData;
      try {
        listingData = JSON.parse(content);
      } catch (parseError) {
        console.error('JSON parse error for listing:', parseError);
        console.error('Content that failed to parse:', content);
        continue;
      }

      console.log('Parsed listing data:', listingData);

      // Validate and map category
      const mappedCategory = categoryMapping[listingData.category];
      if (!mappedCategory) {
        console.error('Invalid category:', listingData.category);
        console.error('Valid categories:', Object.keys(categoryMapping));
        continue;
      }

      console.log('Category mapped:', listingData.category, '->', mappedCategory);

      // Validate required fields
      if (!listingData.title || !listingData.description || !listingData.price) {
        console.error('Missing required fields:', listingData);
        continue;
      }

      // Create listing in database with mapped category
      console.log('Inserting listing into database...');
      const { data: listing, error: listingError } = await supabase
        .from('listings')
        .insert({
          operator_id: randomOperator.user_id,
          title: listingData.title,
          description: listingData.description,
          category: mappedCategory,
          price: listingData.price,
          service_area_text: listingData.service_area_text,
          is_active: true
        })
        .select()
        .single();

      if (listingError) {
        console.error(`Failed to create listing:`, listingError);
        console.error('Data that failed to insert:', {
          operator_id: randomOperator.user_id,
          title: listingData.title,
          category: mappedCategory,
          price: listingData.price
        });
        continue;
      }

      console.log('Listing created successfully:', listing.title);
      createdListings.push({
        ...listing,
        operator_name: randomOperator.full_name
      });
      
      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error('Error in listing generation loop:', error);
      continue;
    }
  }

  console.log('=== Listing Generation Complete ===');
  console.log('Total listings created:', createdListings.length);

  return new Response(
    JSON.stringify({ 
      success: true, 
      message: `Generated ${createdListings.length} listing${createdListings.length !== 1 ? 's' : ''} successfully`,
      listings: createdListings
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}