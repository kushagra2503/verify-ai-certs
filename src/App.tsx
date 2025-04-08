
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { createClient } from '@supabase/supabase-js';
import { useState, useEffect, createContext } from "react";
import Index from "./pages/Index";
import Upload from "./pages/Upload";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

const queryClient = new QueryClient();

// Initialize Supabase client with fallback values to prevent crashes
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder';
export const supabase = createClient(supabaseUrl, supabaseKey);

// Create auth context
export const AuthContext = createContext<{
  user: any;
  session: any;
  signOut: () => Promise<void>;
}>({
  user: null,
  session: null,
  signOut: async () => {},
});

const App = () => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [envError, setEnvError] = useState<string | null>(null);

  useEffect(() => {
    // Check if environment variables are properly set
    if (supabaseUrl === 'https://your-project.supabase.co' || supabaseKey === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder') {
      console.error('Supabase environment variables are not properly configured');
      setEnvError('Supabase configuration is missing. Please connect your project to Supabase.');
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Protected route component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (loading) return <div className="p-12 text-center">Loading...</div>;
    if (!user) return <Navigate to="/login" replace />;
    return <>{children}</>;
  };

  // If we have an environment error, display a helpful message
  if (envError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full space-y-8 p-6 bg-white rounded-lg shadow-md">
          <div>
            <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">Configuration Error</h2>
            <p className="mt-2 text-center text-sm text-gray-600">{envError}</p>
          </div>
          <div className="mt-8 space-y-6">
            <p className="text-sm text-gray-500">
              To fix this issue:
              <ol className="list-decimal pl-5 mt-2 space-y-2">
                <li>Click on the green Supabase button in the top right corner</li>
                <li>Connect your project to Supabase</li>
                <li>Refresh this page after connecting</li>
              </ol>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ user, session, signOut }}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/upload" element={
                <ProtectedRoute>
                  <Upload />
                </ProtectedRoute>
              } />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
