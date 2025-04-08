
// Follow this setup guide to integrate the Gemini API:
// https://github.com/supabase/supabase-js/releases/tag/v2.39.7

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import { GoogleGenerativeAI } from 'https://esm.sh/@google/generative-ai@^0.2.0'

interface Certificate {
  id?: string;
  name?: string;
  issue_date?: string;
  expiry_date?: string;
}

Deno.serve(async (req) => {
  try {
    // Get file from request
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { headers: { 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY') || '';

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

    // Convert file to base64 for Gemini
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    
    // Create a prompt for Gemini to extract certificate information
    const prompt = "This is a certificate image. Extract the following information: full name of certificate holder, certificate ID or number, issue date (in YYYY-MM-DD format), and expiry date (in YYYY-MM-DD format if present).";
    
    // Call Gemini API with the image
    const imagePart = {
      inlineData: {
        data: Array.from(bytes).map(b => String.fromCharCode(b)).join(''),
        mimeType: file.type,
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = result.response;
    const text = response.text();
    
    // Parse the result
    const certificate: Certificate = {};
    
    // Simple parsing logic (in a real app this would be more robust)
    if (text.includes('name:') || text.includes('Name:')) {
      const nameMatch = text.match(/[Nn]ame:?\s*([^\n]+)/);
      certificate.name = nameMatch ? nameMatch[1].trim() : undefined;
    }
    
    if (text.includes('ID:') || text.includes('id:') || text.includes('number:') || text.includes('Number:')) {
      const idMatch = text.match(/(?:[Ii][Dd]|[Nn]umber):?\s*([^\n]+)/);
      certificate.id = idMatch ? idMatch[1].trim() : undefined;
    }
    
    if (text.includes('issue date:') || text.includes('Issue date:') || text.includes('Date:') || text.includes('date:')) {
      const dateMatch = text.match(/(?:[Ii]ssue\s*)?[Dd]ate:?\s*([^\n]+)/);
      certificate.issue_date = dateMatch ? dateMatch[1].trim() : undefined;
      
      // Try to format as YYYY-MM-DD
      if (certificate.issue_date) {
        try {
          const date = new Date(certificate.issue_date);
          if (!isNaN(date.getTime())) {
            certificate.issue_date = date.toISOString().split('T')[0];
          }
        } catch (e) {
          console.error('Error parsing date:', e);
        }
      }
    }
    
    if (text.includes('expiry date:') || text.includes('Expiry date:') || text.includes('Expiration:') || text.includes('expiration:')) {
      const expiryMatch = text.match(/(?:[Ee]xpir(?:y|ation)\s*)?[Dd]ate:?\s*([^\n]+)/);
      certificate.expiry_date = expiryMatch ? expiryMatch[1].trim() : undefined;
      
      // Try to format as YYYY-MM-DD
      if (certificate.expiry_date) {
        try {
          const date = new Date(certificate.expiry_date);
          if (!isNaN(date.getTime())) {
            certificate.expiry_date = date.toISOString().split('T')[0];
          }
        } catch (e) {
          console.error('Error parsing date:', e);
        }
      }
    }

    // Return the extracted information
    return new Response(
      JSON.stringify({
        success: true,
        certificate,
        rawText: text
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    );
  }
})
