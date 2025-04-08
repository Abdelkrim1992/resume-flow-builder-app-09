
import { useLocation, Link } from "react-router-dom";
import { Home, FileText, Heart, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-white dark:bg-gray-900 dark:text-white">
      <main className="flex-1 pb-16">
        {children}
      </main>
      
      <nav className="fixed bottom-0 left-0 right-0 z-10 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-md mx-auto">
          <div className="flex justify-around items-center h-16">
            <Link to="/home" className={cn(
              "flex flex-col items-center justify-center w-full h-full text-xs",
              isActive("/home") ? "text-resume-primary" : "text-gray-500 dark:text-gray-400"
            )}>
              <Home size={20} />
              <span className="mt-1">Home</span>
            </Link>
            
            <Link to="/templates" className={cn(
              "flex flex-col items-center justify-center w-full h-full text-xs",
              isActive("/templates") ? "text-resume-primary" : "text-gray-500 dark:text-gray-400"
            )}>
              <FileText size={20} />
              <span className="mt-1">Templates</span>
            </Link>
            
            <Link to="/favorites" className={cn(
              "flex flex-col items-center justify-center w-full h-full text-xs",
              isActive("/favorites") ? "text-resume-primary" : "text-gray-500 dark:text-gray-400"
            )}>
              <Heart size={20} />
              <span className="mt-1">Favorites</span>
            </Link>
            
            <Link to="/settings" className={cn(
              "flex flex-col items-center justify-center w-full h-full text-xs",
              isActive("/settings") ? "text-resume-primary" : "text-gray-500 dark:text-gray-400"
            )}>
              <Settings size={20} />
              <span className="mt-1">Settings</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default MainLayout;
