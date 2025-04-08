
import { supabase } from '../App';

// Function to verify certificate by ID
export async function verifyCertificate(certificateId: string) {
  try {
    // Search for certificate in the database
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('cert_id', certificateId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No certificate found
        return { isVerified: false };
      }
      throw error;
    }
    
    // Certificate found
    return {
      isVerified: true,
      certificate: {
        id: data.cert_id,
        name: data.name,
        issueDate: new Date(data.issue_date).toLocaleDateString(),
        expiryDate: data.expiry_date ? new Date(data.expiry_date).toLocaleDateString() : undefined
      }
    };
  } catch (error) {
    console.error('Certificate verification error:', error);
    throw error;
  }
}

// Function to upload certificate
export async function uploadCertificate({
  name,
  id,
  issueDate,
  expiryDate,
  file
}: {
  name: string;
  id: string;
  issueDate: string;
  expiryDate?: string;
  file: File;
}) {
  try {
    const user = supabase.auth.getUser();
    if (!user) {
      throw new Error('You must be logged in to upload certificates');
    }
    
    // Check if the certificate ID already exists
    const { data: existingCert, error: checkError } = await supabase
      .from('certificates')
      .select('id')
      .eq('cert_id', id)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }
    
    if (existingCert) {
      throw new Error('Certificate ID already exists in the database');
    }
    
    // We'd upload the file to Supabase here in a real implementation
    
    // For now, just add it to our database
    const { data, error } = await supabase
      .from('certificates')
      .insert([
        {
          cert_id: id,
          name,
          issue_date: issueDate,
          expiry_date: expiryDate
        }
      ]);
    
    if (error) throw error;
    
    return {
      success: true,
      message: 'Certificate uploaded successfully'
    };
  } catch (error) {
    console.error('Certificate upload error:', error);
    throw error;
  }
}

// Function to analyze certificate with Gemini
export async function analyzeWithGemini(file: File) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    // Call the Supabase Edge Function with the provided API key
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-certificate`,
      {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to analyze certificate with AI');
    }
    
    const result = await response.json();
    
    return {
      success: true,
      extractedData: {
        id: result.certificate.id || `CERT-${Math.floor(10000 + Math.random() * 90000)}`,
        name: result.certificate.name || 'Unknown',
        issueDate: result.certificate.issue_date || new Date().toISOString().split('T')[0]
      }
    };
  } catch (error) {
    console.error('AI analysis error:', error);
    return {
      success: false,
      error: error.message || 'Failed to analyze certificate'
    };
  }
}
