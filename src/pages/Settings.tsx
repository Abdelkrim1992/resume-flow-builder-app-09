
import { Link } from "react-router-dom";
import { ChevronRight, User, HelpCircle, Shield, Moon, Sun, LogOut } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  
  return (
    <MainLayout>
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold text-center mb-6">Settings</h1>
        
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-xl p-4 flex items-center">
            <div className="h-12 w-12 bg-resume-primary rounded-full flex items-center justify-center text-white mr-4">
              <User size={24} />
            </div>
            <div>
              <h2 className="font-medium">Guest User</h2>
              <p className="text-sm text-gray-500">Sign in to unlock all features</p>
            </div>
            <ChevronRight className="ml-auto text-gray-400" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-sm font-medium text-gray-500 mb-2">PREFERENCES</h2>
            
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
            <Link to="/" className="flex items-center text-red-500 p-2">
              <LogOut size={20} className="mr-3" />
              <span>Log Out</span>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
