
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import EvaluatorDashboard from "./pages/EvaluatorDashboard";
import EvaluatedList from "./pages/EvaluatedList";
import AssistantDashboard from "./pages/AssistantDashboard";
import AnthropometryForm from "./pages/AnthropometryForm";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import PublicForm from "./pages/PublicForm";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/public-form/:formId" element={<PublicForm />} />
            
            {/* Protected Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/evaluator" 
              element={
                <ProtectedRoute requiredRole="evaluator">
                  <EvaluatorDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/evaluator/evaluated" 
              element={
                <ProtectedRoute requiredRole="evaluator">
                  <EvaluatedList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/assistant" 
              element={
                <ProtectedRoute requiredRole="assistant">
                  <AssistantDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/assistant/anthropometry/:patientId" 
              element={
                <ProtectedRoute requiredRole="assistant">
                  <AnthropometryForm />
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
