
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, User, HelpCircle, Shield, Moon, Sun, LogOut } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState({ full_name: "User" });
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('full_name')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      
      if (data) {
        setProfile({
          full_name: data.full_name || "User"
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error logging out",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  return (
    <MainLayout>
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold text-center mb-6">Settings</h1>
        
        <div className="space-y-6">
          <Link to="/profile">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 flex items-center">
              <div className="h-12 w-12 bg-resume-primary rounded-full flex items-center justify-center text-white mr-4">
                <User size={24} />
              </div>
              <div>
                <h2 className="font-medium">{profile.full_name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">View profile</p>
              </div>
              <ChevronRight className="ml-auto text-gray-400" />
            </div>
          </Link>
          
          <div className="space-y-2">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">PREFERENCES</h2>
            
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center">
                {darkMode ? <Moon size={20} className="mr-3" /> : <Sun size={20} className="mr-3" />}
                <span>Dark Mode</span>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center">
                <Shield size={20} className="mr-3" />
                <span>Privacy</span>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center">
                <HelpCircle size={20} className="mr-3" />
                <span>Help & Support</span>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </div>
          </div>
          
          <div className="pt-4">
            <button 
              onClick={handleLogout}
              className="flex items-center text-red-500 p-2 w-full">
              <LogOut size={20} className="mr-3" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
