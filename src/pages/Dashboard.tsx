
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/App';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { FileCheck, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        // Get certificates uploaded by the current user
        const { data, error } = await supabase
          .from('certificates')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;
        setCertificates(data || []);
      } catch (error: any) {
        console.error('Error fetching certificates:', error);
        toast.error('Could not load certificates');
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchCertificates();
  }, [user]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="space-x-4">
            <Button asChild>
              <Link to="/upload">
                <Upload className="mr-2 h-4 w-4" />
                Upload Certificate
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Certificates</CardTitle>
              <CardDescription>
                Manage certificates you've uploaded to the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                  <p className="mt-2 text-gray-500">Loading certificates...</p>
                </div>
              ) : certificates.length === 0 ? (
                <div className="text-center py-12">
                  <FileCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No certificates yet</h3>
                  <p className="mt-1 text-gray-500">
                    You haven't uploaded any certificates yet. Start by uploading your first certificate.
                  </p>
                  <Button className="mt-4" asChild>
                    <Link to="/upload">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Certificate
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Certificate ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Issue Date</TableHead>
                        <TableHead>Expiry Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {certificates.map((cert) => (
                        <TableRow key={cert.id}>
                          <TableCell className="font-medium">{cert.cert_id}</TableCell>
                          <TableCell>{cert.name}</TableCell>
                          <TableCell>{new Date(cert.issue_date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {cert.expiry_date ? new Date(cert.expiry_date).toLocaleDateString() : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800">
                              Active
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
