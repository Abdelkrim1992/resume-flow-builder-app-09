
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, Download, Share, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "@/contexts/ThemeContext";

interface ResumeData {
  id: string;
  user_id: string;
  title: string;
  personal_info: {
    full_name: string;
    email: string;
    phone: string;
    location: string;
    summary?: string;
  };
  experience: Array<{
    company: string;
    position: string;
    start_date: string;
    end_date?: string;
    current?: boolean;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    start_date: string;
    end_date?: string;
    current?: boolean;
  }>;
  skills: string[];
  template_id: number;
  created_at: string;
  updated_at: string;
}

const Preview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("preview");
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const { theme } = useTheme();

  // Get resume ID from URL params
  const resumeId = new URLSearchParams(location.search).get('id');
  
  useEffect(() => {
    if (resumeId && user) {
      fetchResumeData();
    } else {
      // Use mock data for demonstration if no ID provided
      setResumeData({
        id: "demo",
        user_id: user?.id || "demo",
        title: "Sample Resume",
        personal_info: {
          full_name: "John Doe",
          email: "john.doe@example.com",
          phone: "555-123-4567",
          location: "New York, NY",
          summary: "Experienced software developer with a passion for building user-friendly applications."
        },
        experience: [
          {
            company: "Tech Company",
            position: "Senior Developer",
            start_date: "2020-01",
            description: "Led development of key product features."
          }
        ],
        education: [
          {
            institution: "University of Technology",
            degree: "Bachelor of Science",
            field: "Computer Science",
            start_date: "2014-09",
            end_date: "2018-05"
          }
        ],
        skills: ["JavaScript", "React", "Node.js", "TypeScript"],
        template_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      setLoading(false);
    }
  }, [resumeId, user]);

  const fetchResumeData = async () => {
    try {
      setLoading(true);
      
      // Attempt to fetch resume data
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', resumeId)
        .eq('user_id', user?.id)
        .single();
        
      if (error) {
        console.error('Error fetching resume:', error);
        toast({
          title: "Error loading resume",
          description: "Could not load resume data.",
          variant: "destructive"
        });
        return;
      }
      
      setResumeData(data as ResumeData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Your resume is being prepared for download.",
    });
  };
  
  const handleShare = () => {
    toast({
      title: "Share",
      description: "Share functionality coming soon!",
    });
  };

  const renderResumePreview = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <Skeleton className="h-80 w-full max-w-md" />
          <Skeleton className="h-10 w-40 mt-4" />
        </div>
      );
    }

    if (!resumeData) {
      return (
        <div className="text-center p-8">
          <p className="text-muted-foreground">No resume data available.</p>
          <Button 
            onClick={() => navigate('/builder')} 
            className="mt-4"
          >
            Create Resume
          </Button>
        </div>
      );
    }

    // Simple resume preview template
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md max-w-md mx-auto text-left overflow-auto max-h-[70vh]">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">{resumeData.personal_info.full_name}</h1>
        <div className="text-sm text-gray-600 dark:text-gray-300 flex flex-wrap gap-2 mt-1">
          <span>{resumeData.personal_info.email}</span>
          <span>•</span>
          <span>{resumeData.personal_info.phone}</span>
          <span>•</span>
          <span>{resumeData.personal_info.location}</span>
        </div>
        
        {resumeData.personal_info.summary && (
          <div className="mt-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">{resumeData.personal_info.summary}</p>
          </div>
        )}
        
        <div className="mt-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-1">Experience</h2>
          {resumeData.experience.map((exp, index) => (
            <div key={index} className="mt-3">
              <h3 className="font-medium text-gray-900 dark:text-white">{exp.position}</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">{exp.company}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(exp.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - 
                {exp.current ? ' Present' : exp.end_date ? ` ${new Date(exp.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}` : ''}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{exp.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-1">Education</h2>
          {resumeData.education.map((edu, index) => (
            <div key={index} className="mt-3">
              <h3 className="font-medium text-gray-900 dark:text-white">{edu.institution}</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">{edu.degree} in {edu.field}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(edu.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - 
                {edu.current ? ' Present' : edu.end_date ? ` ${new Date(edu.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}` : ''}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-1">Skills</h2>
          <div className="flex flex-wrap gap-2 mt-2">
            {resumeData.skills.map((skill, index) => (
              <span key={index} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded">{skill}</span>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="p-4 flex items-center justify-between border-b border-border">
        <button onClick={() => navigate(-1)} className="text-foreground/70">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-medium">Preview</h1>
        <div className="w-8"></div> {/* Empty div for flex spacing */}
      </header>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <TabsList className="grid grid-cols-2 mx-4 mt-4">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="download">Download</TabsTrigger>
        </TabsList>
        
        <TabsContent value="preview" className="flex-1 p-4 flex flex-col">
          <div className="bg-card border rounded-lg shadow-lg flex-1 overflow-hidden flex items-center justify-center">
            {renderResumePreview()}
          </div>
          
          <div className="mt-4 grid grid-cols-3 gap-4">
            <Button 
              variant="outline"
              className="flex flex-col items-center justify-center h-16"
              onClick={() => navigate("/builder" + (resumeId ? `?id=${resumeId}` : ''))}
            >
              <Edit size={20} className="mb-1" />
              <span className="text-xs">Edit</span>
            </Button>
            
            <Button 
              variant="outline"
              className="flex flex-col items-center justify-center h-16"
              onClick={handleShare}
            >
              <Share size={20} className="mb-1" />
              <span className="text-xs">Share</span>
            </Button>
            
            <Button 
              variant="outline"
              className="flex flex-col items-center justify-center h-16"
              onClick={handleDownload}
            >
              <Download size={20} className="mb-1" />
              <span className="text-xs">Download</span>
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="download" className="flex-1 p-4">
          <div className="bg-muted/50 rounded-lg p-5 mb-4">
            <h2 className="font-medium mb-2 text-foreground">Download Options</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Choose the format to download your resume
            </p>
            
            <div className="space-y-3">
              <Button 
                className="w-full justify-start"
                onClick={handleDownload}
              >
                <Download size={16} className="mr-2" />
                PDF Format
              </Button>
              
              <Button 
                variant="outline"
                className="w-full justify-start"
                onClick={handleDownload}
              >
                <Download size={16} className="mr-2" />
                Word Document
              </Button>
              
              <Button 
                variant="outline"
                className="w-full justify-start"
                onClick={handleDownload}
              >
                <Download size={16} className="mr-2" />
                Plain Text
              </Button>
            </div>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-5">
            <h2 className="font-medium mb-2 text-foreground">Export Tips</h2>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• PDF format is recommended for most job applications</li>
              <li>• Word format allows further editing</li>
              <li>• Some job portals may require plain text format</li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Preview;
