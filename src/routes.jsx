import React, { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { tokenStorage } from './utils/api';
import LoginPage from './components/LoginPage';
import LCAForm from './components/LCAForm';
import { Loader } from 'lucide-react';

// Lazy-load the dashboard component for better performance
const Dashboard = lazy(() => import('./components/Dashboard'));

// Protected route wrapper component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!tokenStorage.getToken();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center">
      <Loader className="h-8 w-8 text-blue-500 animate-spin" />
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

const AppRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(!!tokenStorage.getToken());
  
  const handleLogin = (userData) => {
    setIsAuthenticated(true);
  };
  
  const handleLogout = () => {
    tokenStorage.clearToken();
    setIsAuthenticated(false);
  };
  
  return (
    <Routes>
      {/* Root route - shows login if not authenticated, otherwise redirects to dashboard */}
      <Route 
        path="/" 
        element={
          isAuthenticated ? 
            <Navigate to="/dashboard" replace /> : 
            <LoginPage onLogin={handleLogin} />
        } 
      />
      
      {/* Dashboard route - protected by authentication */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Suspense fallback={<LoadingFallback />}>
              <Dashboard onLogout={handleLogout} />
            </Suspense>
          </ProtectedRoute>
        } 
      />
      
      {/* LCA Form route - protected by authentication */}
      <Route 
        path="/lca-form" 
        element={
          <ProtectedRoute>
            <LCAForm 
              onComplete={() => <Navigate to="/dashboard" replace />}
              onCancel={() => <Navigate to="/dashboard" replace />}
            />
          </ProtectedRoute>
        } 
      />
      
      {/* Catch-all route for any undefined paths */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
