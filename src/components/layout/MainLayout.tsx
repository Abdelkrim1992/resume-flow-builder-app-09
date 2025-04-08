import { useLocation, Link } from "react-router-dom";
import { Home, FileText, Heart, Settings, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ResumeTemplateCard from "@/components/resume/ResumeTemplateCard";
import { getTemplates, Template } from "@/services/templateService";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { createResume } from "@/services/resumeService";
import { supabase } from "@/integrations/supabase/client";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [isCreatingResume, setIsCreatingResume] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const fetchTemplates = async () => {
    try {
      setTemplatesLoading(true);
      const data = await getTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch templates',
        variant: 'destructive',
      });
    } finally {
      setTemplatesLoading(false);
    }
  };

  const handleTemplateSelect = async (templateId: number) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to create a resume",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsCreatingResume(true);

      // Get user profile data first
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
      }

      // Create initial sections with sample data that can be modified later
      const newResume = await createResume({
        user_id: user.id,
        template_id: templateId,
        title: "Untitled Resume",
        personal_data: {
          first_name: profileData?.first_name || "",
          last_name: profileData?.last_name || "",
          email: user.email || "",
          phone: profileData?.phone || "",
          address: profileData?.address || "",
          city: profileData?.city || "",
          country: profileData?.country || "",
          postal_code: profileData?.postal_code || "",
        },
        summary: profileData?.summary || "A dedicated professional with experience in...",
        experiences: [
          {
            company: "Company Name",
            position: "Position Title",
            start_date: "",
            end_date: "",
            current: false,
            description: "• Key achievements and responsibilities\n• Projects and initiatives\n• Skills and technologies used",
            location: ""
          }
        ],
        education: [
          {
            school: "University/Institution Name",
            degree: "Degree/Certificate",
            field_of_study: "Field of Study",
            start_date: "",
            end_date: "",
            description: "• Relevant coursework\n• Academic achievements\n• Projects and research",
            location: ""
          }
        ],
        skills: [
          {
            category: "Technical Skills",
            skills: ["Skill 1", "Skill 2", "Skill 3"]
          },
          {
            category: "Soft Skills",
            skills: ["Communication", "Leadership", "Problem Solving"]
          }
        ]
      });

      setShowTemplateModal(false);
      navigate(`/builder/${newResume.id}`);
      toast({
        title: "Success",
        description: "Resume created successfully. You can now customize it in the builder.",
      });
    } catch (error) {
      console.error("Error creating resume:", error);
      toast({
        title: "Error",
        description: "Failed to create resume",
        variant: "destructive",
      });
    } finally {
      setIsCreatingResume(false);
    }
  };

  useEffect(() => {
    if (showTemplateModal) {
      fetchTemplates();
    }
  }, [showTemplateModal]);
  
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

      {/* Floating Plus Button */}
      <Button
        className="fixed bottom-20 right-4 z-20 rounded-full w-14 h-14 shadow-lg resume-gradient"
        onClick={() => setShowTemplateModal(true)}
      >
        <Plus size={24} className="text-white" />
      </Button>

      {/* Template Selection Modal */}
      <Dialog open={showTemplateModal} onOpenChange={setShowTemplateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Choose a Template</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {templatesLoading ? (
              <div className="col-span-2 text-center">Loading templates...</div>
            ) : (
              templates.map((template) => (
                <ResumeTemplateCard
                  key={template.id}
                  template={template}
                  onSelect={() => handleTemplateSelect(template.id)}
                  disabled={isCreatingResume}
                />
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MainLayout;
