import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { 
  ChevronLeft, 
  MoreVertical,
  Check,
  Eye
} from "lucide-react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { createResume, getResumeById, updateResume } from "@/services/resumeService";
import ExperienceList from "@/components/resume/ExperienceList";
import EducationList from "@/components/resume/EducationList";
import SkillList from "@/components/resume/SkillList";
import { supabase } from '@/integrations/supabase/client';
import { getTemplateById } from '@/services/templateService';
import { useUser } from '@/hooks/useUser';
import type { Resume } from '@/services/resumeService';
import type { Template } from '@/services/templateService';

interface FormSection {
  id: string;
  title: string;
  subtitle: string;
  expanded: boolean;
  completed: boolean;
}

const Builder = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const { user } = useUser();
  const [resume, setResume] = useState<Resume | null>(null);
  const [template, setTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "My Resume",
    fullName: "",
    email: "",
    location: "",
    summary: "",
  });
  
  const [sections, setSections] = useState<FormSection[]>([
    {
      id: "personal",
      title: "Personal Data",
      subtitle: "Complete your personal data to make your resume even better",
      expanded: true,
      completed: false
    },
    {
      id: "summary",
      title: "Summary",
      subtitle: "Enter a brief description of your professional background",
      expanded: false,
      completed: false
    },
    {
      id: "experience",
      title: "Experience",
      subtitle: "Enter details about what you did in your previous jobs",
      expanded: false,
      completed: false
    },
    {
      id: "education",
      title: "Education",
      subtitle: "Enter your educational background, starting with the most recent",
      expanded: false,
      completed: false
    },
    {
      id: "skills",
      title: "Skills",
      subtitle: "Add relevant skills that showcase your abilities",
      expanded: false,
      completed: false
    }
  ]);

  useEffect(() => {
    if (user && id) {
      fetchResume(id);
    }
  }, [user, id]);
  
  const fetchResume = async (resumeId: string) => {
    try {
      setIsLoading(true);
      const resumeData = await getResumeById(resumeId);
      if (!resumeData) {
        toast({
          title: 'Error',
          description: 'Resume not found',
          variant: 'destructive',
        });
        navigate('/');
        return;
      }

      // Fetch the template data
      if (resumeData.template_id) {
        const templateData = await getTemplateById(resumeData.template_id);
        if (templateData) {
          setTemplate(templateData);
        }
      }

      // Set resume data
      setResume(resumeData);
      setFormData(prev => ({
        ...prev,
        title: resumeData.title || "My Resume",
        summary: resumeData.summary || ""
      }));

      // Fetch user profile data
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileData) {
          setFormData(prev => ({
            ...prev,
            fullName: profileData.full_name || '',
            email: user.email || '',
            location: profileData.location || '',
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching resume:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch resume',
        variant: 'destructive',
      });
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveSection = async (sectionId: string) => {
    if (!resume?.id || !user) return;
    
    try {
      setSaving(true);
      
      // Save resume data
      if (sectionId === 'personal' || sectionId === 'summary') {
        await updateResume(resume.id, {
          title: formData.title,
          summary: formData.summary,
        });
        
        // Update user profile for personal data
        if (sectionId === 'personal') {
          await supabase.from('profiles').upsert({
            id: user.id,
            full_name: formData.fullName,
            location: formData.location,
            updated_at: new Date().toISOString(),
          });
        }
      }
      
      // Mark section as completed
      setSections(prev => 
        prev.map(section => ({
          ...section,
          completed: section.id === sectionId ? true : section.completed,
          expanded: section.id === sectionId ? false : section.expanded
        }))
      );
      
      // Expand next incomplete section
      const currentIndex = sections.findIndex(s => s.id === sectionId);
      if (currentIndex < sections.length - 1) {
        setSections(prev => 
          prev.map((section, index) => ({
            ...section,
            expanded: index === currentIndex + 1 ? true : section.expanded
          }))
        );
      }
      
      toast({
        title: 'Success',
        description: `${sections.find(s => s.id === sectionId)?.title} saved successfully`,
      });
      
    } catch (error) {
      console.error("Error saving section:", error);
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-resume-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading resume builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="p-4 flex items-center justify-between border-b bg-white sticky top-0 z-50">
        <button onClick={() => navigate('/')} className="text-gray-600 hover:text-gray-900">
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center">
          {template && (
            <div className="mr-4 text-sm text-gray-600">
              Template: {template.name}
            </div>
          )}
          <h1 className="text-lg font-medium">{formData.title || 'Untitled Resume'}</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/preview/${id}`)}
        >
          <Eye className="h-5 w-5" />
        </Button>
      </header>

      <div className="max-w-3xl mx-auto p-4">
        {sections.map((section) => (
          <Accordion
            key={section.id}
            type="single"
            collapsible
            className="mb-4 border rounded-lg overflow-hidden bg-white"
            value={section.expanded ? section.id : ""}
          >
            <AccordionItem value={section.id} className="border-0">
              <AccordionTrigger 
                className={cn(
                  "px-4 py-3 hover:no-underline",
                  section.completed && "bg-gray-50"
                )}
              >
                <div className="flex-1">
                  <h3 className="font-medium flex items-center">
                    {section.title}
                    {section.completed && (
                      <Check size={16} className="ml-2 text-green-500" />
                    )}
                  </h3>
                  <p className="text-sm text-gray-500">{section.subtitle}</p>
                </div>
              </AccordionTrigger>
              
              <AccordionContent className="p-4">
                {section.id === "personal" && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Resume Title</Label>
                      <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="e.g., Software Developer Resume"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="e.g., John Doe"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        disabled
                      />
                      <p className="text-xs text-gray-500 mt-1">Email is synced with your account</p>
                    </div>
                    
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="e.g., New York, NY"
                      />
                    </div>
                    
                    <Button
                      className="w-full"
                      onClick={() => saveSection("personal")}
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save & Continue"}
                    </Button>
                  </div>
                )}
                
                {section.id === "summary" && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="summary">Professional Summary</Label>
                      <Textarea
                        id="summary"
                        name="summary"
                        value={formData.summary}
                        onChange={handleInputChange}
                        placeholder="Write a brief summary of your professional background..."
                        rows={6}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Write 3-4 sentences highlighting your key achievements and skills
                      </p>
                    </div>
                    
                    <Button
                      className="w-full"
                      onClick={() => saveSection("summary")}
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save & Continue"}
                    </Button>
                  </div>
                )}
                
                {section.id === "experience" && resume?.id && (
                  <div className="space-y-4">
                    <ExperienceList resumeId={resume.id} />
                    <Button
                      className="w-full"
                      onClick={() => saveSection("experience")}
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save & Continue"}
                    </Button>
                  </div>
                )}
                
                {section.id === "education" && resume?.id && (
                  <div className="space-y-4">
                    <EducationList resumeId={resume.id} />
                    <Button
                      className="w-full"
                      onClick={() => saveSection("education")}
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save & Continue"}
                    </Button>
                  </div>
                )}
                
                {section.id === "skills" && resume?.id && (
                  <div className="space-y-4">
                    <SkillList resumeId={resume.id} />
                    <Button
                      className="w-full"
                      onClick={() => saveSection("skills")}
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save & Continue"}
                    </Button>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <Button 
          className="w-full bg-resume-primary hover:bg-resume-primary/90 text-white"
          onClick={() => navigate(`/preview/${id}`)}
        >
          Preview Resume
        </Button>
      </div>
    </div>
  );
};

export default Builder;
