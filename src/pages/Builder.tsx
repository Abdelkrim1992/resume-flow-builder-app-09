
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  MoreVertical, 
  ChevronDown, 
  X,
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

interface FormSection {
  id: string;
  title: string;
  subtitle: string;
  expanded: boolean;
  completed: boolean;
}

const Builder = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: "Harry Maguire Johnson",
    email: "Harrymaguire@gmail.com",
    location: "Jakarta, Indonesia",
    birthDay: "24",
    birthMonth: "05",
    birthYear: "1999",
    summary: "",
    experience: []
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
      subtitle: "Enter a brief description of your professional background, you can choose specific skills",
      expanded: false,
      completed: false
    },
    {
      id: "experience",
      title: "Experience",
      subtitle: "Enter details about what you did in your previous jobs. Start with your responsibilities",
      expanded: false,
      completed: false
    },
    {
      id: "education",
      title: "Education",
      subtitle: "Enter your educational background, starting with the most recent",
      expanded: false,
      completed: false
    }
  ]);
  
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
  
  const markSectionCompleted = (sectionId: string) => {
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
  };
  
  return (
    <div className="min-h-screen pb-20">
      <header className="p-4 flex items-center justify-between border-b">
        <button onClick={() => navigate(-1)} className="text-gray-600">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-medium">Fill in your data</h1>
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
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="border-purple-300"
                      />
                    </div>
                    
                    <div>
                      <Label>Date of Birth</Label>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="birthDay" className="text-xs">Day</Label>
                          <Input
                            id="birthDay"
                            name="birthDay"
                            value={formData.birthDay}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="birthMonth" className="text-xs">Month</Label>
                          <Input
                            id="birthMonth"
                            name="birthMonth"
                            value={formData.birthMonth}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="birthYear" className="text-xs">Year</Label>
                          <Input
                            id="birthYear"
                            name="birthYear"
                            value={formData.birthYear}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      className="w-full"
                      onClick={() => markSectionCompleted("personal")}
                    >
                      Save & Continue
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
                    >
                      Save & Continue
                    </Button>
                  </div>
                )}
                
                {section.id === "experience" && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500">Add your work experience</p>
                    
                    <Button
                      variant="outline"
                      className="w-full"
                    >
                      + Add Experience
                    </Button>
                    
                    <Button
                      className="w-full"
                      onClick={() => markSectionCompleted("experience")}
                    >
                      Save & Continue
                    </Button>
                  </div>
                )}
                
                {section.id === "education" && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500">Add your educational background</p>
                    
                    <Button
                      variant="outline"
                      className="w-full"
                    >
                      + Add Education
                    </Button>
                    
                    <Button
                      className="w-full"
                      onClick={() => markSectionCompleted("education")}
                    >
                      Save & Continue
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
