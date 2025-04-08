
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UploadForm from '@/components/UploadForm';
import { Upload } from 'lucide-react';

const UploadPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-blue-50 to-white py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Upload className="h-16 w-16 mx-auto text-verify-primary" />
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900">
              Certificate Upload
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Add new certificates to the verification database.
              Our AI system will help validate and process the certificates.
            </p>
          </div>
        </section>
        
        <section className="py-12 px-4">
          <div className="max-w-3xl mx-auto">
            <UploadForm />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default UploadPage;
