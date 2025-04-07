
import { useState } from "react";
import { Search, Check } from "lucide-react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Templates = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const categories = [
    { id: "all", name: "All" },
    { id: "professional", name: "Professional" },
    { id: "minimalist", name: "Minimalist" },
    { id: "simple", name: "Simple" },
  ];
  
  const templates = [
    { id: 1, name: "Celeste", category: "professional", image: "/lovable-uploads/4e3c26f4-a07f-4e34-9b35-262f7ec97f9e.png" },
    { id: 2, name: "Aurora", category: "professional", image: "/lovable-uploads/4e3c26f4-a07f-4e34-9b35-262f7ec97f9e.png" },
    { id: 3, name: "Blanca", category: "modern", image: "/lovable-uploads/4e3c26f4-a07f-4e34-9b35-262f7ec97f9e.png" },
    { id: 4, name: "Estella", category: "simple", image: "/lovable-uploads/4e3c26f4-a07f-4e34-9b35-262f7ec97f9e.png" },
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
          <h1 className="text-2xl font-bold text-center">Template</h1>
          
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search your template"
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
                  selectedCategory === category.id ? "bg-resume-primary text-white" : "text-gray-600"
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
            <Link 
              to={`/builder?template=${template.id}`} 
              key={template.id}
              className="block"
            >
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="aspect-[3/4] bg-gray-50 flex items-center justify-center overflow-hidden">
                  <img 
                    src={template.image} 
                    alt={template.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-2 text-center">
                  <h3 className="font-medium text-resume-primary">{template.name}</h3>
                  <p className="text-xs text-gray-500 capitalize">{template.category}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Templates;
