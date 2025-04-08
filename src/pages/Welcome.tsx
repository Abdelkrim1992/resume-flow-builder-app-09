import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";

const Welcome = () => {
  const [isHovering, setIsHovering] = useState(false);
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [user, navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full mx-auto text-center dark:text-white"
      >
        <div className="mb-8">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="h-24 w-24 resume-gradient rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-6"
          >
            <FileText size={48} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-3xl font-bold mb-2"
          >
            Welcome to Resumo
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-gray-600 dark:text-gray-300 mb-8"
          >
            Create professional resumes in minutes with our intuitive builder
          </motion.p>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="space-y-6"
        >
          <Link to="/register">
            <Button 
              className="resume-gradient resume-shadow w-full text-lg py-6 group"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              Get Started
              <ArrowRight 
                className={`ml-2 transition-transform duration-300 ${isHovering ? 'transform translate-x-1' : ''}`} 
                size={20} 
              />
            </Button>
          </Link>
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-resume-primary font-medium hover:underline">
              Log in
            </Link>
          </div>
          
          <div className="pt-8 text-gray-400 dark:text-gray-500 text-xs">
            <p>By continuing, you agree to our</p>
            <p>
              <a href="#" className="underline">Terms of Service</a> & <a href="#" className="underline">Privacy Policy</a>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Welcome;
