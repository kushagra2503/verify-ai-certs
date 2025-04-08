
import React from 'react';
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Shield className="h-8 w-8 text-verify-primary" />
              <span className="ml-2 text-xl font-semibold text-verify-primary">CertVerify</span>
            </Link>
          </div>
          <nav className="flex space-x-6">
            <Link to="/" className="text-gray-600 hover:text-verify-primary px-3 py-2 rounded-md text-sm font-medium">
              Verify
            </Link>
            <Link to="/upload" className="text-gray-600 hover:text-verify-primary px-3 py-2 rounded-md text-sm font-medium">
              Upload
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-verify-primary px-3 py-2 rounded-md text-sm font-medium">
              About
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
