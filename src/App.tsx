
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Templates from "./pages/Templates";
import Favorites from "./pages/Favorites";
import Settings from "./pages/Settings";
import Builder from "./pages/Builder";
import Preview from "./pages/Preview";
import NotFound from "./pages/NotFound";
import Welcome from "./pages/Welcome";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/templates" element={<ProtectedRoute><Templates /></ProtectedRoute>} />
            <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/builder" element={<ProtectedRoute><Builder /></ProtectedRoute>} />
            <Route path="/preview" element={<ProtectedRoute><Preview /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
