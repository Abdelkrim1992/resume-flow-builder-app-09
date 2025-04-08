
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { FileText, Clock, Plus, User, MoreVertical, Eye, Edit, Trash } from "lucide-react";
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
  const [loading, setLoading] = useState(true);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [deleteResumeId, setDeleteResumeId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    if (user) {
      fetchResumes();
    } else {
      setLoading(false);
    }
  }, [user]);
  
  const fetchResumes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user?.id)
        .order('updated_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching resumes:', error);
        toast({
          title: "Error",
          description: "Failed to load your resumes",
          variant: "destructive"
        });
      } else {
        setResumes(data || []);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteResume = async () => {
    if (!deleteResumeId) return;
    
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', deleteResumeId)
        .eq('user_id', user?.id);
        
      if (error) {
        console.error('Error deleting resume:', error);
        toast({
          title: "Error",
          description: "Failed to delete resume",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Resume deleted successfully"
        });
        // Remove the deleted resume from the state
        setResumes(resumes.filter(resume => resume.id !== deleteResumeId));
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsDeleting(false);
      setDeleteResumeId(null);
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
          <Link to="/templates" className="flex-1">
            <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center hover:border-resume-primary hover:text-resume-primary transition-all duration-200 hover:scale-[1.02] dark:border-gray-700 dark:text-gray-200">
              <FileText className="h-6 w-6 mb-1" />
              <span>New resume</span>
            </Button>
          </Link>
          <Button variant="outline" className="flex-1 h-20 flex flex-col items-center justify-center hover:border-resume-primary hover:text-resume-primary transition-all duration-200 hover:scale-[1.02] dark:border-gray-700 dark:text-gray-200">
            <FileText className="h-6 w-6 mb-1" />
            <span>Cover letter</span>
          </Button>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="bg-resume-accent/20 h-6 w-1 rounded mr-2"></span>
            My Resumes
          </h2>
          
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
                        onClick={() => navigate(`/preview?id=${resume.id}`)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="cursor-pointer flex items-center" 
                        onClick={() => navigate(`/builder?id=${resume.id}`)}
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
              <Link to="/templates">
                <Button className="bg-resume-primary hover:bg-resume-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Resume
                </Button>
              </Link>
            </div>
          )}
        </div>
        
        <Link to="/templates">
          <Button 
            className="fixed bottom-20 right-6 h-14 w-14 rounded-full resume-gradient resume-shadow flex items-center justify-center hover:scale-105 transition-transform"
            variant="default"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </Link>
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
              onClick={handleDeleteResume}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default Index;
