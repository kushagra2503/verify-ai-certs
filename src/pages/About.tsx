
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Shield, CheckCircle, FileText, Cpu } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-blue-50 to-white py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              About CertVerify
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Learn about our advanced certificate verification platform and how we ensure the authenticity of credentials.
            </p>
          </div>
        </section>
        
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-6">
              At CertVerify, we're committed to building trust in credentials through secure, transparent verification. Our platform helps organizations, employers, and individuals verify the authenticity of certificates, diplomas, and other credentials with ease and confidence.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              In an era where credential fraud is increasingly sophisticated, our technology provides a robust solution for maintaining the integrity of qualifications and protecting the value of legitimate achievements.
            </p>
            
            <div className="mt-12">
              <h2 className="text-3xl font-bold mb-8">Advanced Technology</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="border rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Shield className="h-6 w-6 text-verify-primary mr-3" />
                    <h3 className="text-xl font-semibold">Secure Database</h3>
                  </div>
                  <p className="text-gray-600">
                    Our tamper-proof database ensures that certificate records remain secure and unaltered, providing a reliable source of truth for verification.
                  </p>
                </div>
                
                <div className="border rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <FileText className="h-6 w-6 text-verify-primary mr-3" />
                    <h3 className="text-xl font-semibold">Detailed Records</h3>
                  </div>
                  <p className="text-gray-600">
                    Each certificate in our system contains comprehensive information, including issuance dates, expiration, and authentication details.
                  </p>
                </div>
                
                <div className="border rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <CheckCircle className="h-6 w-6 text-verify-primary mr-3" />
                    <h3 className="text-xl font-semibold">Instant Verification</h3>
                  </div>
                  <p className="text-gray-600">
                    Our efficient verification process delivers results in seconds, making credential checking seamless for recruiters and organizations.
                  </p>
                </div>
                
                <div className="border rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Cpu className="h-6 w-6 text-verify-primary mr-3" />
                    <h3 className="text-xl font-semibold">AI-Powered Analysis</h3>
                  </div>
                  <p className="text-gray-600">
                    Using advanced AI through Google Gemini 2.5 Pro, we can analyze certificate documents, extract key information, and enhance verification accuracy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;
