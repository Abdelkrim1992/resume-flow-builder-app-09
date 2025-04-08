import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { ChevronLeft, Download, Share, Edit, Eye, MoreVertical, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "@/contexts/ThemeContext";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/utils";

interface ResumeData {
  id: string;
  user_id: string;
  title: string;
  template_id: number;
  personal_info: {
    full_name: string;
    email: string;
    phone: string;
    location: string;
    summary?: string;
  };
  experience: Array<{
    id?: string;
    company: string;
    position: string;
    start_date: string;
    end_date?: string;
    current?: boolean;
    description: string;
  }>;
  education: Array<{
    id?: string;
    institution: string;
    degree: string;
    field: string;
    start_date: string;
    end_date?: string;
    current?: boolean;
  }>;
  skills: string[];
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

  // Get resume ID from URL params using useParams
  const { id: resumeId } = useParams();
  
  useEffect(() => {
    if (resumeId) {
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
      
      // Fetch the resume basic data
      const { data: resumeBasic, error: resumeError } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', resumeId)
        .single();
        
      if (resumeError) {
        console.error('Error fetching resume:', resumeError);
        toast({
          title: "Error loading resume",
          description: "Could not load resume data.",
          variant: "destructive"
        });
        return;
      }
      
      // Fetch experiences
      const { data: experiences, error: expError } = await supabase
        .from('experiences')
        .select('*')
        .eq('resume_id', resumeId)
        .order('start_date', { ascending: false });
      
      // Fetch education
      const { data: education, error: eduError } = await supabase
        .from('educations')
        .select('*')
        .eq('resume_id', resumeId)
        .order('start_date', { ascending: false });
      
      // Fetch skills
      const { data: skills, error: skillsError } = await supabase
        .from('skills')
        .select('name')
        .eq('resume_id', resumeId);
      
      // Fetch user profile for personal info
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      
      if (expError || eduError || skillsError || profileError) {
        console.error('Error fetching resume details');
        toast({
          title: "Error loading details",
          description: "Could not load all resume details.",
          variant: "destructive"
        });
      }
      
      // Transform education data to match the expected format
      const transformedEducation = education ? education.map(edu => ({
        id: edu.id,
        institution: edu.institution,
        degree: edu.degree,
        field: edu.field_of_study || '', // Map field_of_study to field
        start_date: edu.start_date,
        end_date: edu.end_date,
        current: edu.current
      })) : [];
      
      // Construct the full resume data object
      const completeResumeData: ResumeData = {
        ...resumeBasic,
        personal_info: {
          full_name: profile?.full_name || 'No Name',
          email: profile?.email || user?.email || 'No Email',
          phone: 'No Phone', // Add this field to profiles table if needed
          location: profile?.location || 'No Location',
          summary: resumeBasic.summary || '',
        },
        experience: experiences || [],
        education: transformedEducation,
        skills: skills ? skills.map(s => s.name) : [],
        template_id: resumeBasic.template_id || 1
      };
      
      setResumeData(completeResumeData);
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

  const renderModernTemplate = () => {
    if (!resumeData) return null;
    
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md mx-auto text-left overflow-auto max-h-[70vh] animate-fade-in">
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{resumeData.personal_info.full_name}</h1>
          <div className="text-sm text-gray-600 dark:text-gray-300 flex flex-wrap gap-2 mt-1">
            <span>{resumeData.personal_info.email}</span>
            <span>•</span>
            <span>{resumeData.personal_info.phone}</span>
            <span>•</span>
            <span>{resumeData.personal_info.location}</span>
          </div>
        </div>
        
        {resumeData.personal_info.summary && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Professional Summary</h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{resumeData.personal_info.summary}</p>
          </div>
        )}
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-1 mb-3">Experience</h2>
          {resumeData.experience.length > 0 ? resumeData.experience.map((exp, index) => (
            <div key={exp.id || index} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{exp.position}</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{exp.company}</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {formatDate(exp.start_date, 'short')} - 
                  {exp.current ? ' Present' : exp.end_date ? ` ${formatDate(exp.end_date, 'short')}` : ''}
                </p>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{exp.description}</p>
            </div>
          )) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">No experience added</p>
          )}
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-1 mb-3">Education</h2>
          {resumeData.education.length > 0 ? resumeData.education.map((edu, index) => (
            <div key={edu.id || index} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{edu.institution}</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{edu.degree} in {edu.field}</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {formatDate(edu.start_date, 'short')} - 
                  {edu.current ? ' Present' : edu.end_date ? ` ${formatDate(edu.end_date, 'short')}` : ''}
                </p>
              </div>
            </div>
          )) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">No education added</p>
          )}
        </div>
        
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-1 mb-3">Skills</h2>
          {resumeData.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill, index) => (
                <span 
                  key={index} 
                  className="text-xs bg-resume-accent/20 dark:bg-resume-accent/10 text-resume-primary dark:text-resume-accent px-3 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">No skills added</p>
          )}
        </div>
      </div>
    );
  };

  const renderMinimalistTemplate = () => {
    if (!resumeData) return null;
    
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md mx-auto text-left overflow-auto max-h-[70vh] animate-fade-in">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-medium text-gray-900 dark:text-white uppercase tracking-wide">{resumeData.personal_info.full_name}</h1>
          <div className="flex flex-wrap justify-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="flex items-center"><Eye className="w-3 h-3 mr-1" /> {resumeData.personal_info.email}</span>
            <span className="flex items-center"><Trash className="w-3 h-3 mr-1" /> {resumeData.personal_info.phone}</span>
            <span className="flex items-center"><Edit className="w-3 h-3 mr-1" /> {resumeData.personal_info.location}</span>
          </div>
        </div>
        
        <hr className="border-gray-200 dark:border-gray-700 my-4" />
        
        {resumeData.personal_info.summary && (
          <>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed text-center mb-4">{resumeData.personal_info.summary}</p>
            <hr className="border-gray-200 dark:border-gray-700 my-4" />
          </>
        )}
        
        <div className="mb-6">
          <h2 className="text-base font-medium text-gray-900 dark:text-white uppercase tracking-wider mb-3">Experience</h2>
          {resumeData.experience.length > 0 ? resumeData.experience.map((exp, index) => (
            <div key={exp.id || index} className="mb-4">
              <div className="flex justify-between items-baseline">
                <h3 className="font-medium text-gray-900 dark:text-white">{exp.position} • {exp.company}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(exp.start_date, 'short')} - 
                  {exp.current ? ' Present' : exp.end_date ? ` ${formatDate(exp.end_date, 'short')}` : ''}
                </p>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{exp.description}</p>
            </div>
          )) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">No experience added</p>
          )}
        </div>
        
        <div className="mb-6">
          <h2 className="text-base font-medium text-gray-900 dark:text-white uppercase tracking-wider mb-3">Education</h2>
          {resumeData.education.length > 0 ? resumeData.education.map((edu, index) => (
            <div key={edu.id || index} className="mb-3 flex justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">{edu.institution}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{edu.degree}, {edu.field}</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {formatDate(edu.start_date, 'short')} - 
                {edu.current ? ' Present' : edu.end_date ? ` ${formatDate(edu.end_date, 'short')}` : ''}
              </p>
            </div>
          )) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">No education added</p>
          )}
        </div>
        
        <div>
          <h2 className="text-base font-medium text-gray-900 dark:text-white uppercase tracking-wider mb-3">Skills</h2>
          {resumeData.skills.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {resumeData.skills.map((skill, index) => (
                <span 
                  key={index} 
                  className="text-xs border border-gray-300 dark:border-gray-600 px-2 py-1"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">No skills added</p>
          )}
        </div>
      </div>
    );
  };

  const renderProfessionalTemplate = () => {
    if (!resumeData) return null;
    
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md mx-auto text-left overflow-auto max-h-[70vh] animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b-2 border-resume-primary pb-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-resume-primary">{resumeData.personal_info.full_name}</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{resumeData.personal_info.location}</p>
          </div>
          <div className="mt-2 md:mt-0 text-right">
            <p className="text-sm text-gray-700 dark:text-gray-300">{resumeData.personal_info.email}</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">{resumeData.personal_info.phone}</p>
          </div>
        </div>
        
        {resumeData.personal_info.summary && (
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <div className="w-1 h-5 bg-resume-primary mr-2"></div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Professional Summary</h2>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed pl-3 border-l border-gray-200 dark:border-gray-700">{resumeData.personal_info.summary}</p>
          </div>
        )}
        
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <div className="w-1 h-5 bg-resume-primary mr-2"></div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Experience</h2>
          </div>
          {resumeData.experience.length > 0 ? resumeData.experience.map((exp, index) => (
            <div key={exp.id || index} className="mb-4 pl-3 border-l border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{exp.position}</h3>
                  <p className="text-sm font-medium text-resume-primary">{exp.company}</p>
                </div>
                <p className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300">
                  {formatDate(exp.start_date, 'short')} - 
                  {exp.current ? ' Present' : exp.end_date ? ` ${formatDate(exp.end_date, 'short')}` : ''}
                </p>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{exp.description}</p>
            </div>
          )) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic pl-3">No experience added</p>
          )}
        </div>
        
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <div className="w-1 h-5 bg-resume-primary mr-2"></div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Education</h2>
          </div>
          {resumeData.education.length > 0 ? resumeData.education.map((edu, index) => (
            <div key={edu.id || index} className="mb-3 pl-3 border-l border-gray-200 dark:border-gray-700">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{edu.institution}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{edu.degree}, {edu.field}</p>
                </div>
                <p className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300">
                  {formatDate(edu.start_date, 'short')} - 
                  {edu.current ? ' Present' : edu.end_date ? ` ${formatDate(edu.end_date, 'short')}` : ''}
                </p>
              </div>
            </div>
          )) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic pl-3">No education added</p>
          )}
        </div>
        
        <div>
          <div className="flex items-center mb-2">
            <div className="w-1 h-5 bg-resume-primary mr-2"></div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Skills</h2>
          </div>
          {resumeData.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2 pl-3">
              {resumeData.skills.map((skill, index) => (
                <span 
                  key={index} 
                  className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-3 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic pl-3">No skills added</p>
          )}
        </div>
      </div>
    );
  };

  const renderCreativeTemplate = () => {
    if (!resumeData) return null;
    
    return (
      <div className="bg-white dark:bg-gray-800 p-0 rounded-lg shadow-xl max-w-md mx-auto text-left overflow-auto max-h-[70vh] animate-fade-in">
        <div className="bg-resume-primary p-6 text-white relative">
          <h1 className="text-2xl font-bold">{resumeData.personal_info.full_name}</h1>
          <div className="text-sm opacity-90 mt-1 flex flex-wrap gap-2">
            <span>{resumeData.personal_info.email}</span>
            <span>•</span>
            <span>{resumeData.personal_info.phone}</span>
            <span>•</span>
            <span>{resumeData.personal_info.location}</span>
          </div>
          {resumeData.personal_info.summary && (
            <p className="mt-4 text-sm leading-relaxed opacity-95">{resumeData.personal_info.summary}</p>
          )}
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 bg-resume-primary rounded-full"></div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-6 mt-4">
            <h2 className="text-lg font-semibold text-resume-primary mb-3 flex items-center">
              <Eye className="w-5 h-5 mr-2" /> Experience
            </h2>
            {resumeData.experience.length > 0 ? resumeData.experience.map((exp, index) => (
              <div key={exp.id || index} className="mb-4 border-l-2 border-resume-primary/30 pl-4 py-1">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{exp.position}</h3>
                  <div className="flex justify-between">
                    <p className="text-sm text-resume-primary">{exp.company}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(exp.start_date, 'short')} - 
                      {exp.current ? ' Present' : exp.end_date ? ` ${formatDate(exp.end_date, 'short')}` : ''}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{exp.description}</p>
                </div>
              </div>
            )) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">No experience added</p>
            )}
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-resume-primary mb-3 flex items-center">
              <Eye className="w-5 h-5 mr-2" /> Education
            </h2>
            {resumeData.education.length > 0 ? resumeData.education.map((edu, index) => (
              <div key={edu.id || index} className="mb-3 border-l-2 border-resume-primary/30 pl-4 py-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">{edu.institution}</h3>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-600 dark:text-gray-300">{edu.degree}, {edu.field}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(edu.start_date, 'short')} - 
                    {edu.current ? ' Present' : edu.end_date ? ` ${formatDate(edu.end_date, 'short')}` : ''}
                  </p>
                </div>
              </div>
            )) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">No education added</p>
            )}
          </div>
          
          <div>
            <h2 className="text-lg font-semibold text-resume-primary mb-3 flex items-center">
              <Eye className="w-5 h-5 mr-2" /> Skills
            </h2>
            {resumeData.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="text-xs border-2 border-resume-primary/40 text-resume-primary px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">No skills added</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderResumeByTemplateId = () => {
    if (!resumeData) return null;
    
    switch (resumeData.template_id) {
      case 1:
      case 5:
        return renderModernTemplate();
      case 2:
      case 8:
        return renderProfessionalTemplate();
      case 3:
      case 6:
        return renderMinimalistTemplate();
      case 4:
      case 7:
        return renderCreativeTemplate();
      default:
        return renderModernTemplate();
    }
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

    return renderResumeByTemplateId();
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="p-4 flex items-center justify-between border-b border-border bg-card shadow-sm">
        <button onClick={() => navigate(-1)} className="text-foreground/70 hover:text-foreground transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-medium">{resumeData?.title || "Resume Preview"}</h1>
        <div className="w-8"></div> {/* Empty div for flex spacing */}
      </header>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <TabsList className="grid grid-cols-2 mx-4 mt-4 bg-muted/60">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="download">Download</TabsTrigger>
        </TabsList>
        
        <TabsContent value="preview" className="flex-1 p-4 flex flex-col">
          <div className="bg-card border rounded-lg shadow-lg flex-1 overflow-hidden flex items-center justify-center p-4">
            {renderResumePreview()}
          </div>
          
          <div className="mt-4 grid grid-cols-3 gap-4">
            <Button 
              className="flex flex-col items-center justify-center h-16 bg-resume-primary hover:bg-resume-primary/90 text-white"
              onClick={() => navigate("/builder" + (resumeId ? `?id=${resumeId}` : ''))}
            >
              <Edit size={20} className="mb-1" />
              <span className="text-xs">Edit</span>
            </Button>
            
            <Button 
              variant="secondary"
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
          <div className="bg-card rounded-lg p-5 mb-4 shadow-sm">
            <h2 className="font-medium mb-2 text-foreground">Download Options</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Choose the format to download your resume
            </p>
            
            <div className="space-y-3">
              <Button 
                className="w-full justify-start bg-resume-primary hover:bg-resume-primary/90 text-white"
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
          
          <div className="bg-card rounded-lg p-5 shadow-sm">
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
