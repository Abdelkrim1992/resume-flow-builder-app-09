import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  MoreVertical,
  Check
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

interface FormSection {
  id: string;
  title: string;
  subtitle: string;
  expanded: boolean;
  completed: boolean;
}

const Builder = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [activeResumeId, setActiveResumeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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
    if (user) {
      initializeResume();
    }
  }, [user]);
  
  const initializeResume = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // For simplicity, we're creating a new resume each time.
      // In a real app, you'd fetch existing resumes and let the user select one.
      const resumeData = await createResume("My Resume", user.id);
      setActiveResumeId(resumeData.id);
      
      // Load user profile data
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
      
    } catch (error: any) {
      console.error("Error initializing resume:", error);
      toast({
        title: "Error creating resume",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const toggleSection = (sectionId: string) => {
    setSections(prev => 
      prev.map(section => ({
        ...section,
        expanded: section.id === sectionId ? !section.expanded : section.expanded
      }))
    );
  };
  
  const markSectionCompleted = async (sectionId: string) => {
    if (!activeResumeId || !user) return;
    
    try {
      setSaving(true);
      
      // For personal and summary sections, save data to resume
      if (sectionId === 'personal' || sectionId === 'summary') {
        await updateResume(activeResumeId, {
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
        title: `${sections.find(s => s.id === sectionId)?.title} completed!`,
      });
      
    } catch (error: any) {
      console.error("Error saving section:", error);
      toast({
        title: "Error saving data",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading resume builder...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pb-20">
      <header className="p-4 flex items-center justify-between border-b">
        <button onClick={() => navigate(-1)} className="text-gray-600">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-medium">Build Your Resume</h1>
        <button className="text-gray-600">
          <MoreVertical size={24} />
        </button>
      </header>
      
      <div className="p-4">
        {sections.map((section) => (
          <Accordion
            key={section.id}
            type="single"
            collapsible
            className="mb-4 border rounded-lg overflow-hidden"
            value={section.expanded ? section.id : ""}
          >
            <AccordionItem value={section.id} className="border-0">
              <AccordionTrigger 
                onClick={() => toggleSection(section.id)}
                className={cn(
                  "px-4 py-3 flex items-center hover:no-underline",
                  section.completed ? "bg-gray-50" : ""
                )}
              >
                <div className="flex-1 text-left flex items-center">
                  <div>
                    <h3 className="font-medium flex items-center">
                      {section.title}
                      {section.completed && (
                        <Check size={16} className="ml-2 text-green-500" />
                      )}
                    </h3>
                    <p className="text-sm text-gray-500">{section.subtitle}</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-2">
                {section.id === "personal" && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Resume Title</Label>
                      <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
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
                        placeholder="City, Country"
                      />
                    </div>
                    
                    <Button
                      className="w-full"
                      onClick={() => markSectionCompleted("personal")}
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
                        placeholder="Write a brief summary of your professional background..."
                        value={formData.summary}
                        onChange={handleInputChange}
                        rows={6}
                      />
                    </div>
                    
                    <Button
                      className="w-full"
                      onClick={() => markSectionCompleted("summary")}
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save & Continue"}
                    </Button>
                  </div>
                )}
                
                {section.id === "experience" && activeResumeId && (
                  <div className="space-y-4">
                    <ExperienceList resumeId={activeResumeId} />
                    
                    <Button
                      className="w-full"
                      onClick={() => markSectionCompleted("experience")}
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save & Continue"}
                    </Button>
                  </div>
                )}
                
                {section.id === "education" && activeResumeId && (
                  <div className="space-y-4">
                    <EducationList resumeId={activeResumeId} />
                    
                    <Button
                      className="w-full"
                      onClick={() => markSectionCompleted("education")}
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save & Continue"}
                    </Button>
                  </div>
                )}
                
                {section.id === "skills" && activeResumeId && (
                  <div className="space-y-4">
                    <SkillList resumeId={activeResumeId} />
                    
                    <Button
                      className="w-full"
                      onClick={() => markSectionCompleted("skills")}
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
          className="w-full resume-gradient"
          onClick={() => navigate("/preview")}
        >
          Preview & Export
        </Button>
      </div>
    </div>
  );
};

export default Builder;
