import React, { useState, useContext } from 'react';
import { Upload, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/App';
import { AuthContext } from '@/App';
import { v4 as uuidv4 } from 'uuid';
import { analyzeWithGemini } from '@/lib/verification';

const UploadForm = () => {
  const { user } = useContext(AuthContext);
  const [certificateName, setCertificateName] = useState('');
  const [certificateId, setCertificateId] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      if (!certificateId) {
        // If no ID is set, suggest a unique ID
        setCertificateId(`CERT-${uuidv4().substring(0, 8).toUpperCase()}`);
      }
      
      // Use the actual Gemini analysis function
      await processFileWithGemini(selectedFile);
    }
  };

  // Using the real Gemini analysis function instead of a simulation
  const processFileWithGemini = async (fileToProcess: File) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeWithGemini(fileToProcess);
      if (result.success) {
        setAiSuggestions({
          name: result.extractedData.name,
          id: result.extractedData.id,
          issueDate: result.extractedData.issueDate
        });
        toast.success("AI analysis complete! Suggestions available.");
      } else {
        toast.error(result.error || "Failed to analyze certificate with AI");
      }
    } catch (error: any) {
      console.error("Error analyzing with Gemini:", error);
      toast.error("Failed to analyze certificate with AI");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applyAiSuggestions = () => {
    if (aiSuggestions) {
      setCertificateName(aiSuggestions.name);
      setCertificateId(aiSuggestions.id);
      setIssueDate(aiSuggestions.issueDate);
      toast.success("AI suggestions applied!");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to upload certificates');
      return;
    }
    
    if (!certificateName || !certificateId || !issueDate || !file) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Check if certificate ID already exists
      const { data: existingCert, error: checkError } = await supabase
        .from('certificates')
        .select('id')
        .eq('cert_id', certificateId)
        .single();
        
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      if (existingCert) {
        toast.error('Certificate ID already exists in the database');
        setIsUploading(false);
        return;
      }
      
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${certificateId.replace(/[^a-zA-Z0-9]/g, '')}_${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      
      const { error: uploadError } = await supabase
        .storage
        .from('certificates')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: publicURL } = supabase
        .storage
        .from('certificates')
        .getPublicUrl(filePath);
        
      // Store certificate data in the database
      const { error: insertError } = await supabase
        .from('certificates')
        .insert([
          {
            cert_id: certificateId,
            name: certificateName,
            user_id: user.id,
            issue_date: issueDate,
            expiry_date: expiryDate || null,
            file_path: filePath,
            file_url: publicURL.publicUrl
          }
        ]);
        
      if (insertError) throw insertError;
      
      toast.success('Certificate uploaded successfully!');
      
      // Reset form
      setCertificateName('');
      setCertificateId('');
      setIssueDate('');
      setExpiryDate('');
      setFile(null);
      setAiSuggestions(null);
      
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
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin h-8 w-8 border-2 border-verify-primary border-t-transparent rounded-full"></div>
                        <p className="mt-2 text-sm text-gray-500">
                          Analyzing with Gemini...
                        </p>
                      </>
                    ) : (
                      <>
                        <File className="w-8 h-8 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">
                          {file ? file.name : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-xs text-gray-500">
                          PDF, PNG or JPG (max. 10MB)
                        </p>
                      </>
                    )}
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
            
            {aiSuggestions && (
              <div className="p-3 border rounded-md bg-verify-secondary/20 space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">AI-Suggested Fields</h3>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={applyAiSuggestions}
                  >
                    Apply All
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p className="text-gray-500">Name:</p>
                  <p className="font-medium">{aiSuggestions.name}</p>
                  <p className="text-gray-500">Certificate ID:</p>
                  <p className="font-medium">{aiSuggestions.id}</p>
                  <p className="text-gray-500">Issue Date:</p>
                  <p className="font-medium">{aiSuggestions.issueDate}</p>
                </div>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-verify-primary hover:bg-blue-700" 
              disabled={isUploading || !user}
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
