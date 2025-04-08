
import React, { useState } from 'react';
import { Upload, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { uploadCertificate } from '@/lib/verification';

const UploadForm = () => {
  const [certificateName, setCertificateName] = useState('');
  const [certificateId, setCertificateId] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!certificateName || !certificateId || !issueDate || !file) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsUploading(true);
    
    try {
      await uploadCertificate({
        name: certificateName,
        id: certificateId,
        issueDate,
        expiryDate: expiryDate || undefined,
        file
      });
      
      toast.success('Certificate uploaded successfully!');
      
      // Reset form
      setCertificateName('');
      setCertificateId('');
      setIssueDate('');
      setExpiryDate('');
      setFile(null);
      
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'An error occurred during upload');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Certificate Holder Name *</Label>
              <Input
                id="name"
                type="text"
                required
                value={certificateName}
                onChange={(e) => setCertificateName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="id">Certificate ID *</Label>
              <Input
                id="id"
                type="text"
                required
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="issueDate">Issue Date *</Label>
                <Input
                  id="issueDate"
                  type="date"
                  required
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="certificate">Upload Certificate File *</Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="certificate"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <File className="w-8 h-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      {file ? file.name : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF, PNG or JPG (max. 10MB)
                    </p>
                  </div>
                  <Input
                    id="certificate"
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-verify-primary hover:bg-blue-700" 
              disabled={isUploading}
            >
              {isUploading ? (
                <div className="flex items-center">
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></div>
                  Uploading...
                </div>
              ) : (
                <div className="flex items-center">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Certificate
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadForm;
