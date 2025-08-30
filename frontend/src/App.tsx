import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/layout/Navigation";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Alerts from "./pages/Alerts";
import Predictions from "./pages/Predictions";
import Reports from "./pages/Reports";
import Resources from "./pages/Resources";
import Education from "./pages/Education";
import EarthdataExplorer from "./pages/EarthdataExplorer";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <Navigation />
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Landing />} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/alerts" element={
                <ProtectedRoute requiredPermissions={['canCreateAlerts']}>
                  <Alerts />
                </ProtectedRoute>
              } />
              <Route path="/predictions" element={
                <ProtectedRoute requiredPermissions={['canViewPredictions']}>
                  <Predictions />
                </ProtectedRoute>
              } />
              <Route path="/reports" element={
                <ProtectedRoute requiredPermissions={['canCreateAlerts']}>
                  <Reports />
                </ProtectedRoute>
              } />
              <Route path="/resources" element={
                <ProtectedRoute requiredPermissions={['canViewAllData']}>
                  <Resources />
                </ProtectedRoute>
              } />
              <Route path="/education" element={
                <ProtectedRoute requiredPermissions={['canViewAllData']}>
                  <Education />
                </ProtectedRoute>
              } />
              <Route path="/earthdata" element={
                <ProtectedRoute requiredPermissions={['canViewAllData']}>
                  <EarthdataExplorer />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
