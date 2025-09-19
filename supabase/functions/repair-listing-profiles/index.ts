import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    console.log('Starting repair of listing profiles...')

    // Find listings without valid profiles
    const { data: orphanedListings, error: fetchError } = await supabaseClient
      .from('listings')
      .select(`
        id,
        operator_id,
        title,
        profiles!listings_operator_id_fkey (
          user_id,
          full_name
        )
      `)

    if (fetchError) {
      console.error('Error fetching orphaned listings:', fetchError)
      throw fetchError
    }

    console.log(`Found ${orphanedListings?.length || 0} listings to check`)

    // Filter listings that don't have valid profiles
    const listingsWithoutProfiles = orphanedListings?.filter(listing => !listing.profiles) || []
    
    console.log(`Found ${listingsWithoutProfiles.length} listings without profiles`)

    if (listingsWithoutProfiles.length === 0) {
      return new Response(
        JSON.stringify({ 
          message: 'No orphaned listings found',
          repaired: 0,
          total: orphanedListings?.length || 0
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get all operator profiles to randomly assign
    const { data: operatorProfiles, error: profilesError } = await supabaseClient
      .from('profiles')
      .select('user_id, full_name')
      .eq('role', 'operator')
      .eq('is_ai_generated', true)

    if (profilesError) {
      console.error('Error fetching operator profiles:', profilesError)
      throw profilesError
    }

    if (!operatorProfiles || operatorProfiles.length === 0) {
      return new Response(
        JSON.stringify({ 
          error: 'No operator profiles available for assignment',
          orphaned_count: listingsWithoutProfiles.length
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`Found ${operatorProfiles.length} operator profiles for assignment`)

    // Repair orphaned listings by randomly assigning them to existing operators
    let repairedCount = 0
    
    for (const listing of listingsWithoutProfiles) {
      // Randomly select an operator
      const randomOperator = operatorProfiles[Math.floor(Math.random() * operatorProfiles.length)]
      
      console.log(`Assigning listing "${listing.title}" to operator ${randomOperator.full_name}`)
      
      const { error: updateError } = await supabaseClient
        .from('listings')
        .update({ operator_id: randomOperator.user_id })
        .eq('id', listing.id)

      if (updateError) {
        console.error(`Error updating listing ${listing.id}:`, updateError)
        continue
      }

      repairedCount++
      
      // Small delay to avoid overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    console.log(`Successfully repaired ${repairedCount} listings`)

    return new Response(
      JSON.stringify({ 
        message: `Successfully repaired ${repairedCount} orphaned listings`,
        repaired: repairedCount,
        total: listingsWithoutProfiles.length,
        available_operators: operatorProfiles.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in repair-listing-profiles function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'An unexpected error occurred',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})