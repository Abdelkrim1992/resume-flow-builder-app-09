import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { FileText, Clock, Plus, User, MoreVertical, Eye, Edit, Trash, X, Loader2 } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatDate } from "@/lib/utils";
import ResumeTemplateCard from "@/components/resume/ResumeTemplateCard";
import { getTemplates, Template } from "@/services/templateService";
import { useUser } from '@/hooks/useUser';
import { getResumes, deleteResume, createResume, deleteAllResumes } from '@/services/resumeService';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface Resume {
  id: string;
  title: string;
  updated_at: string;
  template_id?: number;
}

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { user: userData } = useUser();
  const [loading, setLoading] = useState(true);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [deleteResumeId, setDeleteResumeId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [isCreatingResume, setIsCreatingResume] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
  
  useEffect(() => {
    if (user) {
      fetchResumes();
      fetchTemplates();
    } else {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (showTemplateModal) {
      fetchTemplates();
    }
  }, [showTemplateModal]);
  
  const fetchResumes = async () => {
    try {
      setLoading(true);
      const data = await getResumes(user?.id);
      setResumes(data);
    } catch (error) {
      console.error('Error fetching resumes:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch resumes',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
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
  
  const handleDeleteResume = async (id: string) => {
    try {
      await deleteResume(id);
      setResumes(resumes.filter(resume => resume.id !== id));
      toast({
        title: 'Success',
        description: 'Resume deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting resume:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete resume',
        variant: 'destructive',
      });
    }
  };
  
  // Function to determine a pseudo random progress for demo resumes
  const getResumeProgress = (resumeId: string) => {
    // Use the resume ID hash to get a consistent "random" number
    const hash = resumeId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return Math.min(100, Math.max(25, hash % 100));
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
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

      // Update the resumes list with the new resume
      setResumes(prev => [...prev, newResume]);
      
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

  const handleDeleteAllResumes = async () => {
    if (!user?.id) return;
    
    try {
      setIsDeletingAll(true);
      await deleteAllResumes(user.id);
      setResumes([]);
      setShowDeleteAllDialog(false);
      toast({
        title: 'Success',
        description: 'All resumes deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting all resumes:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete all resumes',
        variant: 'destructive',
      });
    } finally {
      setIsDeletingAll(false);
    }
  };

  return (
    <MainLayout>
      <div className="px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <Link to="/profile">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted/80">
              <User className="h-6 w-6 text-resume-primary transition-colors" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-resume-primary to-resume-secondary">Resumo</h1>
          <button 
            onClick={() => toast({
              title: "Notifications",
              description: "No new notifications"
            })}
            className="text-gray-500 dark:text-gray-400 hover:text-resume-primary transition-colors">
            <Clock className="h-6 w-6" />
          </button>
        </div>
        
        {!user && (
          <div className="mb-8 resume-gradient text-white rounded-xl p-5 shadow-lg animate-fade-in">
            <h2 className="text-lg font-semibold mb-2">Sign in to your free account</h2>
            <p className="text-sm mb-4">Your guest account will be deleted when time is up. Sign in to save and download your resume.</p>
            <div className="flex gap-4">
              <Link to="/login">
                <Button variant="secondary" className="bg-white text-resume-primary hover:bg-gray-100">Sign In Now</Button>
              </Link>
              <div className="bg-white/20 rounded-md px-3 py-2 text-sm font-medium">67:12:45</div>
            </div>
          </div>
        )}
        
        <div className="flex justify-between gap-4 mb-8">
          <Button 
            onClick={() => setShowTemplateModal(true)}
            variant="outline" 
            className="w-full h-20 flex flex-col items-center justify-center hover:border-resume-primary hover:text-resume-primary transition-all duration-200 hover:scale-[1.02] dark:border-gray-700 dark:text-gray-200"
          >
            <PlusCircle className="h-6 w-6 mb-1" />
            <span>New resume</span>
          </Button>
          <Button 
            onClick={() => setShowTemplateModal(true)}
            variant="outline" 
            className="flex-1 h-20 flex flex-col items-center justify-center hover:border-resume-primary hover:text-resume-primary transition-all duration-200 hover:scale-[1.02] dark:border-gray-700 dark:text-gray-200"
          >
            <PlusCircle className="h-6 w-6 mb-1" />
            <span>New resume</span>
          </Button>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <span className="bg-resume-accent/20 h-6 w-1 rounded mr-2"></span>
              My Resumes
            </h2>
            {resumes.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteAllDialog(true)}
                disabled={isDeletingAll}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete All
              </Button>
            )}
          </div>
          
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center">
                    <Skeleton className="h-14 w-10 rounded mr-4" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-40 mb-2" />
                      <Skeleton className="h-3 w-24 mb-2" />
                      <Skeleton className="h-2 w-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : resumes.length > 0 ? (
            <div className="space-y-4">
              {resumes.map((resume) => (
                <div 
                  key={resume.id} 
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center hover:border-resume-primary/40 hover:shadow-md transition-all duration-200 bg-card"
                >
                  <div className="bg-resume-accent/10 dark:bg-resume-accent/5 w-10 h-14 flex items-center justify-center rounded mr-4 border border-resume-accent/20">
                    <FileText className="text-resume-primary" size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{resume.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <span className="truncate">Template {resume.template_id || 1}</span>
                      <span className="mx-2">•</span>
                      <span className="whitespace-nowrap">{formatDate(resume.updated_at)}</span>
                    </div>
                    <Progress 
                      value={getResumeProgress(resume.id)} 
                      className="h-1.5 mt-2 bg-gray-100 dark:bg-gray-700" 
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem 
                        className="cursor-pointer flex items-center" 
                        onClick={() => navigate(`/preview/${resume.id}`)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Resume
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="cursor-pointer flex items-center" 
                        onClick={() => navigate(`/builder/${resume.id}`)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="cursor-pointer flex items-center text-destructive focus:text-destructive" 
                        onClick={() => setDeleteResumeId(resume.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 border border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <h3 className="text-lg font-medium mb-1">No resumes yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Create your first resume to get started</p>
              <Button 
                onClick={() => setShowTemplateModal(true)} 
                className="bg-resume-primary hover:bg-resume-primary/90"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Resume
              </Button>
            </div>
          )}
        </div>
        
        {/* Template Selection Modal */}
        {showTemplateModal && (
          <Dialog open={showTemplateModal} onOpenChange={setShowTemplateModal}>
            <DialogContent className="max-w-4xl w-[95vw] h-[90vh] p-0 flex flex-col overflow-hidden">
              <DialogHeader className="p-6 pb-2 border-b shrink-0 bg-background">
                <DialogTitle className="text-xl">Choose a Resume Template</DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Select a template to get started with your new resume
                </p>
              </DialogHeader>
              
              {templatesLoading ? (
                <div className="flex justify-center items-center p-8 flex-1">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto">
                  <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 min-h-min">
                      {templates.map((template) => (
                        <motion.div
                          key={template.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="group cursor-pointer"
                          onClick={() => handleTemplateSelect(template.id)}
                        >
                          <div className="relative aspect-[8.5/11] rounded-lg overflow-hidden border-2 border-transparent group-hover:border-resume-primary transition-all duration-300 bg-muted/30">
                            <img
                              src={template.preview_image_url || '/placeholder-template.png'}
                              alt={template.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                            <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <p className="text-white text-sm font-medium">{template.name}</p>
                              <p className="text-white/80 text-xs">{template.category}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      <AlertDialog open={!!deleteResumeId} onOpenChange={(open) => !open && setDeleteResumeId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this resume. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => handleDeleteResume(deleteResumeId as string)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <AlertDialog open={showDeleteAllDialog} onOpenChange={setShowDeleteAllDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete All Resumes?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all your resumes and their associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingAll}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteAllResumes}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeletingAll}
            >
              {isDeletingAll ? "Deleting..." : "Delete All"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default Index;
