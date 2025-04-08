
import { useState } from "react";
import { Search } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ResumeTemplateCard, { ResumeTemplate } from "@/components/resume/ResumeTemplateCard";

const Templates = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const categories = [
    { id: "all", name: "All" },
    { id: "professional", name: "Professional" },
    { id: "minimalist", name: "Minimalist" },
    { id: "simple", name: "Simple" },
    { id: "creative", name: "Creative" },
    { id: "modern", name: "Modern" },
  ];
  
  const templates: ResumeTemplate[] = [
    { 
      id: 1, 
      name: "Classic Professional", 
      category: "professional", 
      color: "#003366", 
      layout: "standard",
      description: "Traditional and clean layout for corporate positions" 
    },
    { 
      id: 2, 
      name: "Modern Executive", 
      category: "professional", 
      color: "#1a4d80", 
      layout: "professional",
      description: "Contemporary design for senior leadership roles" 
    },
    { 
      id: 3, 
      name: "Minimal Elegant", 
      category: "minimalist", 
      color: "#6c757d", 
      layout: "simple",
      description: "Understated and sophisticated for all industries" 
    },
    { 
      id: 4, 
      name: "Creative Portfolio", 
      category: "creative", 
      color: "#8e44ad", 
      layout: "creative",
      description: "Showcase your creative work and skills" 
    },
    { 
      id: 5, 
      name: "Technical Specialist", 
      category: "professional", 
      color: "#2c3e50", 
      layout: "standard",
      description: "Focused on technical skills and experience" 
    },
    { 
      id: 6, 
      name: "Simple Graduate", 
      category: "simple", 
      color: "#3498db", 
      layout: "simple",
      description: "Perfect for recent graduates or entry-level positions" 
    },
    { 
      id: 7, 
      name: "Modern Digital", 
      category: "modern", 
      color: "#16a085", 
      layout: "modern",
      description: "Contemporary style for digital professionals" 
    },
    { 
      id: 8, 
      name: "Startup Innovator", 
      category: "modern", 
      color: "#e74c3c", 
      layout: "creative",
      description: "Forward-thinking design for startup environments" 
    },
  ];
  
  const filteredTemplates = templates.filter(template => {
    if (selectedCategory !== "all" && template.category !== selectedCategory) {
      return false;
    }
    if (searchQuery && !template.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });
  
  return (
    <MainLayout>
      <div className="px-4 py-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-center">Resume Templates</h1>
          
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
            <Input
              placeholder="Search templates"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className={cn(
                  "rounded-full px-4 py-1 text-sm font-medium whitespace-nowrap",
                  selectedCategory === category.id ? "bg-resume-primary text-white" : "text-gray-600 dark:text-gray-300"
                )}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </header>
        
        <div className="grid grid-cols-2 gap-4">
          {filteredTemplates.map((template) => (
            <ResumeTemplateCard key={template.id} template={template} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Templates;
