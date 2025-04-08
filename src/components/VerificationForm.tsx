
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Certificate {
  id: string;
  cert_id: string;
  name: string;
  issue_date: string;
  expiry_date?: string;
  file_url?: string;
}

const VerificationForm = () => {
  const [certificateId, setCertificateId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<{
    isVerified: boolean;
    certificate?: Certificate;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!certificateId.trim()) {
      toast.error('Please enter a certificate ID');
      return;
    }
    
    setIsVerifying(true);
    setResult(null);
    
    try {
      // Query the database for the certificate
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('cert_id', certificateId.trim())
        .single();
        
      if (error) {
        if (error.code === 'PGRST116') {
          // No certificate found
          setResult({
            isVerified: false
          });
          toast.error('Certificate verification failed');
        } else {
          throw error;
        }
      } else if (data) {
        // Certificate found
        setResult({
          isVerified: true,
          certificate: {
            id: data.id,
            cert_id: data.cert_id,
            name: data.name,
            issue_date: data.issue_date,
            expiry_date: data.expiry_date,
            file_url: data.file_url
          }
        });
        toast.success('Certificate verified successfully!');
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('An error occurred during verification');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex w-full items-center space-x-2">
          <Input
            type="text"
            placeholder="Enter certificate ID"
            value={certificateId}
            onChange={(e) => setCertificateId(e.target.value)}
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={isVerifying}
            className="bg-verify-primary hover:bg-blue-700"
          >
            {isVerifying ? (
              <div className="flex items-center">
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></div>
                Verifying
              </div>
            ) : (
              <div className="flex items-center">
                <Search className="mr-2 h-4 w-4" />
                Verify
              </div>
            )}
          </Button>
        </div>
      </form>

      {result && (
        <Card className={`mt-6 border-l-4 ${
          result.isVerified 
            ? 'border-l-verify-success bg-green-50' 
            : 'border-l-verify-error bg-red-50'
        }`}>
          <CardContent className="pt-6">
            {result.isVerified ? (
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-verify-success">Certificate Verified!</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p className="text-gray-500">Name:</p>
                  <p className="font-medium">{result.certificate?.name}</p>
                  <p className="text-gray-500">Certificate ID:</p>
                  <p className="font-medium">{result.certificate?.cert_id}</p>
                  <p className="text-gray-500">Issue Date:</p>
                  <p className="font-medium">{new Date(result.certificate?.issue_date || '').toLocaleDateString()}</p>
                  {result.certificate?.expiry_date && (
                    <>
                      <p className="text-gray-500">Expiry Date:</p>
                      <p className="font-medium">{new Date(result.certificate?.expiry_date).toLocaleDateString()}</p>
                    </>
                  )}
                </div>
                {result.certificate?.file_url && (
                  <div className="mt-4">
                    <Button variant="outline" asChild>
                      <a href={result.certificate.file_url} target="_blank" rel="noopener noreferrer">
                        View Certificate
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-2">
                <h3 className="text-lg font-medium text-verify-error">Invalid Certificate</h3>
                <p className="text-sm text-gray-500 mt-1">
                  The certificate ID you provided does not match any records in our database.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VerificationForm;
