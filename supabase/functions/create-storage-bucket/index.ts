
// This function creates a storage bucket for certificates if it doesn't exist
// It will be executed when the Supabase server starts

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

// Note: This is intended to be run once during setup,
// but including it here to ensure the bucket exists

Deno.serve(async (req) => {
  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

    // Initialize Supabase client with admin rights
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if certificates bucket exists, create if it doesn't
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();
    
    if (bucketsError) {
      throw bucketsError;
    }

    // Check if 'certificates' bucket exists
    const bucketExists = buckets.some(bucket => bucket.name === 'certificates');
    
    if (!bucketExists) {
      // Create the certificates bucket
      const { error: createError } = await supabase
        .storage
        .createBucket('certificates', {
          public: false, // Not public by default
          fileSizeLimit: 10485760 // 10MB limit
        });
      
      if (createError) {
        throw createError;
      }

      // Set public access policy
      const { error: policyError } = await supabase
        .storage
        .from('certificates')
        .createSignedUrl('dummy.txt', 60);
      
      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'Certificates bucket created successfully'
        }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Certificates bucket already exists'
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    );
  }
})
