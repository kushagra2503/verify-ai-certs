
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { verifyCertificate } from '@/lib/verification';

const VerificationForm = () => {
  const [certificateId, setCertificateId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<{
    isVerified: boolean;
    certificate?: {
      id: string;
      name: string;
      issueDate: string;
      expiryDate?: string;
    };
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
      const verificationResult = await verifyCertificate(certificateId);
      setResult(verificationResult);
      
      if (verificationResult.isVerified) {
        toast.success('Certificate verified successfully!');
      } else {
        toast.error('Certificate verification failed');
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
                  <p className="font-medium">{result.certificate?.id}</p>
                  <p className="text-gray-500">Issue Date:</p>
                  <p className="font-medium">{result.certificate?.issueDate}</p>
                  {result.certificate?.expiryDate && (
                    <>
                      <p className="text-gray-500">Expiry Date:</p>
                      <p className="font-medium">{result.certificate?.expiryDate}</p>
                    </>
                  )}
                </div>
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
