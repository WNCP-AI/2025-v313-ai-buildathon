import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
    console.log("=== Admin Data Request ===");
    
    // Get request body
    const requestBody = await req.json();
    const { action, userId, userIds, listingId } = requestBody;
    console.log("Action requested:", action);
    if (userId) console.log("User ID:", userId);
    if (userIds) console.log("User IDs:", userIds);
    if (listingId) console.log("Listing ID:", listingId);

    // Get authorization header to verify admin user
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authorization required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create regular client to verify user
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    // Verify user is admin
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      console.error("User verification failed:", userError);
      return new Response(JSON.stringify({ error: 'Invalid authorization' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!user.email?.endsWith('@wncp.ai')) {
      console.error("Access denied for non-admin user:", user.email);
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log("Admin access verified for:", user.email);

    // Create service role client for admin operations
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    if (action === 'get-all-data') {
      console.log("Fetching all admin data...");

      // Fetch all auth users with metadata
      const { data: authUsers, error: authError } = await adminClient.auth.admin.listUsers();
      if (authError) {
        console.error("Error fetching auth users:", authError);
        throw new Error("Failed to fetch auth users");
      }

      console.log(`Found ${authUsers.users.length} auth users`);

      // Fetch all profiles
      const { data: profiles, error: profilesError } = await adminClient
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        throw new Error("Failed to fetch profiles");
      }

      console.log(`Found ${profiles?.length || 0} profiles`);

      // Merge auth users with profiles
      const adminUsers = authUsers.users.map(authUser => {
        const profile = profiles?.find(p => p.user_id === authUser.id);
        return {
          id: authUser.id,
          email: authUser.email || 'No email',
          created_at: authUser.created_at,
          last_sign_in_at: authUser.last_sign_in_at,
          email_confirmed_at: authUser.email_confirmed_at,
          user_metadata: authUser.user_metadata || {},
          profiles: profile || null
        };
      });

      // Fetch all listings with profiles
      const { data: listings, error: listingsError } = await adminClient
        .from('listings')
        .select(`
          *,
          profiles:operator_id (
            full_name,
            role,
            is_ai_generated
          )
        `)
        .order('created_at', { ascending: false });

      if (listingsError) {
        console.error("Error fetching listings:", listingsError);
        throw new Error("Failed to fetch listings");
      }

      console.log(`Found ${listings?.length || 0} listings`);

      return new Response(JSON.stringify({
        users: adminUsers,
        listings: listings || []
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'delete-user') {
      console.log("Deleting user...");
      
      if (!userId) {
        return new Response(JSON.stringify({ error: 'User ID required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log("Deleting user:", userId);
      
      // First, get all listings for this user to delete associated images
      const { data: userListings, error: listingsError } = await adminClient
        .from('listings')
        .select('image_url')
        .eq('operator_id', userId);
      
      if (listingsError) {
        console.error("Error fetching user listings:", listingsError);
      } else if (userListings && userListings.length > 0) {
        console.log(`Found ${userListings.length} listings for user, deleting images...`);
        
        // Delete images from storage
        for (const listing of userListings) {
          if (listing.image_url) {
            try {
              // Extract file path from URL
              const url = new URL(listing.image_url);
              const pathParts = url.pathname.split('/');
              const fileName = pathParts[pathParts.length - 1];
              
              if (fileName) {
                const { error: storageError } = await adminClient.storage
                  .from('listing-images')
                  .remove([fileName]);
                
                if (storageError) {
                  console.error(`Error deleting image ${fileName}:`, storageError);
                } else {
                  console.log(`Deleted image: ${fileName}`);
                }
              }
            } catch (imageError) {
              console.error("Error processing image URL:", imageError);
            }
          }
        }
        
        // Delete the listings (this will cascade due to database constraints)
        const { error: deleteListingsError } = await adminClient
          .from('listings')
          .delete()
          .eq('operator_id', userId);
        
        if (deleteListingsError) {
          console.error("Error deleting user listings:", deleteListingsError);
        } else {
          console.log(`Deleted ${userListings.length} listings for user`);
        }
      }
      
      // Delete user via admin API
      const { error } = await adminClient.auth.admin.deleteUser(userId);
      
      if (error) {
        console.error("Error deleting user:", error);
        throw new Error(`Failed to delete user: ${error.message}`);
      }

      console.log("User deleted successfully");
      
      return new Response(JSON.stringify({
        message: 'User deleted successfully'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'bulk-delete-users') {
      console.log("Bulk deleting users...");
      
      const { userIds } = requestBody;
      if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        return new Response(JSON.stringify({ error: 'User IDs array required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log("Deleting users:", userIds);
      
      let deletedCount = 0;
      let errors = [];

      // Delete users one by one via admin API
      for (const userId of userIds) {
        try {
          // First, get all listings for this user to delete associated images
          const { data: userListings, error: listingsError } = await adminClient
            .from('listings')
            .select('image_url')
            .eq('operator_id', userId);
          
          if (!listingsError && userListings && userListings.length > 0) {
            console.log(`Found ${userListings.length} listings for user ${userId}, deleting images...`);
            
            // Delete images from storage
            for (const listing of userListings) {
              if (listing.image_url) {
                try {
                  // Extract file path from URL
                  const url = new URL(listing.image_url);
                  const pathParts = url.pathname.split('/');
                  const fileName = pathParts[pathParts.length - 1];
                  
                  if (fileName) {
                    const { error: storageError } = await adminClient.storage
                      .from('listing-images')
                      .remove([fileName]);
                    
                    if (storageError) {
                      console.error(`Error deleting image ${fileName}:`, storageError);
                    }
                  }
                } catch (imageError) {
                  console.error("Error processing image URL:", imageError);
                }
              }
            }
            
            // Delete the listings
            const { error: deleteListingsError } = await adminClient
              .from('listings')
              .delete()
              .eq('operator_id', userId);
            
            if (deleteListingsError) {
              console.error(`Error deleting listings for user ${userId}:`, deleteListingsError);
            }
          }
          
          const { error } = await adminClient.auth.admin.deleteUser(userId);
          if (error) {
            console.error(`Error deleting user ${userId}:`, error);
            errors.push(`User ${userId}: ${error.message}`);
          } else {
            deletedCount++;
            console.log(`User ${userId} deleted successfully`);
          }
        } catch (error) {
          console.error(`Error deleting user ${userId}:`, error);
          errors.push(`User ${userId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      console.log(`Bulk delete completed: ${deletedCount} deleted, ${errors.length} errors`);
      
      return new Response(JSON.stringify({
        message: `Successfully deleted ${deletedCount} users`,
        deletedCount,
        errors: errors.length > 0 ? errors : undefined
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'delete-listing') {
      console.log("Deleting listing...");
      
      const { listingId } = requestBody;
      if (!listingId) {
        return new Response(JSON.stringify({ error: 'Listing ID required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log("Deleting listing:", listingId);
      
      // First, get the listing to check for image URL
      const { data: listing, error: fetchError } = await adminClient
        .from('listings')
        .select('image_url')
        .eq('id', listingId)
        .single();
      
      if (fetchError) {
        console.error("Error fetching listing:", fetchError);
        throw new Error(`Failed to fetch listing: ${fetchError.message}`);
      }
      
      // Delete associated image from storage if it exists
      if (listing && listing.image_url) {
        try {
          // Extract file path from URL
          const url = new URL(listing.image_url);
          const pathParts = url.pathname.split('/');
          const fileName = pathParts[pathParts.length - 1];
          
          if (fileName) {
            const { error: storageError } = await adminClient.storage
              .from('listing-images')
              .remove([fileName]);
            
            if (storageError) {
              console.error(`Error deleting image ${fileName}:`, storageError);
            } else {
              console.log(`Deleted image: ${fileName}`);
            }
          }
        } catch (imageError) {
          console.error("Error processing image URL:", imageError);
        }
      }
      
      // Delete listing from database
      const { error } = await adminClient
        .from('listings')
        .delete()
        .eq('id', listingId);
      
      if (error) {
        console.error("Error deleting listing:", error);
        throw new Error(`Failed to delete listing: ${error.message}`);
      }

      console.log("Listing deleted successfully");
      
      return new Response(JSON.stringify({
        message: 'Listing deleted successfully'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'get-profile') {
      console.log("Getting profile for admin...");
      
      if (!userId) {
        return new Response(JSON.stringify({ error: 'User ID required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { data, error } = await adminClient
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return new Response(JSON.stringify({ error: 'Profile not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'update-profile') {
      console.log("Updating profile for admin...");
      
      const { userId, profileData } = requestBody;
      if (!userId || !profileData) {
        return new Response(JSON.stringify({ error: 'User ID and profile data required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { error } = await adminClient
        .from('profiles')
        .update(profileData)
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating profile:', error);
        return new Response(JSON.stringify({ error: 'Failed to update profile' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ message: 'Profile updated successfully' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'get-listing') {
      console.log("Getting listing for admin...");
      
      if (!listingId) {
        return new Response(JSON.stringify({ error: 'Listing ID required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { data, error } = await adminClient
        .from('listings')
        .select('*')
        .eq('id', listingId)
        .single();

      if (error) {
        console.error('Error fetching listing:', error);
        return new Response(JSON.stringify({ error: 'Listing not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'update-listing') {
      console.log("Updating listing for admin...");
      
      const { listingId, listingData } = requestBody;
      if (!listingId || !listingData) {
        return new Response(JSON.stringify({ error: 'Listing ID and listing data required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { error } = await adminClient
        .from('listings')
        .update(listingData)
        .eq('id', listingId);

      if (error) {
        console.error('Error updating listing:', error);
        return new Response(JSON.stringify({ error: 'Failed to update listing' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ message: 'Listing updated successfully' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'database-integrity-check') {
      console.log("Running database integrity check...");
      
      // First get all valid user IDs from profiles
      const { data: validProfiles, error: profilesError } = await adminClient
        .from('profiles')
        .select('user_id');
      
      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        throw new Error(`Failed to fetch profiles: ${profilesError.message}`);
      }
      
      const validUserIds = (validProfiles || []).map(p => p.user_id);
      console.log(`Found ${validUserIds.length} valid user IDs`);
      
      // Check for orphaned listings (listings with operator_id not in valid profiles)
      const { data: allListings, error: listingsError } = await adminClient
        .from('listings')
        .select('id, operator_id');
      
      if (listingsError) {
        console.error("Error fetching listings:", listingsError);
        throw new Error(`Failed to fetch listings: ${listingsError.message}`);
      }
      
      const orphanedListings = (allListings || []).filter(listing => 
        !validUserIds.includes(listing.operator_id)
      );
      
      // Check for orphaned images in storage
      const { data: storageFiles, error: storageError } = await adminClient.storage
        .from('listing-images')
        .list();
      
      if (storageError) {
        console.error("Error listing storage files:", storageError);
        throw new Error(`Failed to list storage files: ${storageError.message}`);
      }
      
      // Get all image URLs currently in use
      const { data: usedImages, error: usedImagesError } = await adminClient
        .from('listings')
        .select('image_url')
        .not('image_url', 'is', null);
      
      if (usedImagesError) {
        console.error("Error fetching used images:", usedImagesError);
        throw new Error(`Failed to fetch used images: ${usedImagesError.message}`);
      }
      
      const { data: profileImages, error: profileImagesError } = await adminClient
        .from('profiles')
        .select('avatar_url')
        .not('avatar_url', 'is', null);
      
      if (profileImagesError) {
        console.error("Error fetching profile images:", profileImagesError);
        throw new Error(`Failed to fetch profile images: ${profileImagesError.message}`);
      }
      
      // Extract filenames from URLs
      const usedFilenames = new Set();
      
      [...(usedImages || []), ...(profileImages || [])].forEach(item => {
        const url = item.image_url || item.avatar_url;
        if (url) {
          try {
            const urlObj = new URL(url);
            const pathParts = urlObj.pathname.split('/');
            const fileName = pathParts[pathParts.length - 1];
            if (fileName) {
              usedFilenames.add(fileName);
            }
          } catch (e) {
            console.error("Error parsing URL:", e);
          }
        }
      });
      
      // Count orphaned files
      const orphanedFiles = (storageFiles || []).filter(file => 
        !usedFilenames.has(file.name)
      );
      
      console.log(`Found ${orphanedListings.length} orphaned listings`);
      console.log(`Found ${orphanedFiles.length} orphaned images`);
      
      return new Response(JSON.stringify({
        orphanedListings: orphanedListings.length,
        orphanedImages: orphanedFiles.length
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in admin-data function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});