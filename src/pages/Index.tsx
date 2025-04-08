
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VerificationForm from '@/components/VerificationForm';
import { Shield, CheckCircle, Search } from 'lucide-react';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-blue-50 to-white py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Shield className="h-16 w-16 mx-auto text-verify-primary" />
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900">
              Certificate Verification Portal
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Verify the authenticity of certificates instantly. 
              Enter the certificate ID to validate its legitimacy.
            </p>
          </div>
        </section>
        
        <section className="py-12 px-4">
          <div className="max-w-3xl mx-auto">
            <VerificationForm />
          </div>
        </section>
        
        <section className="py-16 bg-gray-50 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-verify-secondary p-4 inline-block rounded-full mb-4">
                  <Search className="h-8 w-8 text-verify-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Enter Certificate ID</h3>
                <p className="text-gray-600">Enter the unique certificate ID found on your certificate</p>
              </div>
              
              <div className="text-center">
                <div className="bg-verify-secondary p-4 inline-block rounded-full mb-4">
                  <Shield className="h-8 w-8 text-verify-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Instant Verification</h3>
                <p className="text-gray-600">Our system verifies the certificate against our secure database</p>
              </div>
              
              <div className="text-center">
                <div className="bg-verify-secondary p-4 inline-block rounded-full mb-4">
                  <CheckCircle className="h-8 w-8 text-verify-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">View Results</h3>
                <p className="text-gray-600">Instantly see verification results and certificate details</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
