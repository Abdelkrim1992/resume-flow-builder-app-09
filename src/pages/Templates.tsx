import { useState, useEffect } from "react";
import { Search, Filter, Loader2 } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ResumeTemplateCard from "@/components/resume/ResumeTemplateCard";
import { getTemplates, Template } from "@/services/templateService";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { createResume } from "@/services/resumeService";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

const Templates = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreatingResume, setIsCreatingResume] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const categories = [
    { id: "all", name: "All", icon: "📄" },
    { id: "professional", name: "Professional", icon: "👔" },
    { id: "minimalist", name: "Minimalist", icon: "✨" },
    { id: "simple", name: "Simple", icon: "📝" },
    { id: "creative", name: "Creative", icon: "🎨" },
    { id: "modern", name: "Modern", icon: "🚀" },
  ];
  
  useEffect(() => {
    fetchTemplates();
  }, []);
  
  const fetchTemplates = async () => {
    try {
      setLoading(true);
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
      setLoading(false);
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
          first_name: profileData?.full_name?.split(' ')[0] || "",
          last_name: profileData?.full_name?.split(' ').slice(1).join(' ') || "",
          email: user.email || "",
          phone: "",
          address: "",
          city: "",
          country: "",
          postal_code: "",
        },
        summary: "A dedicated professional with experience in...",
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
      <div className="px-4 py-6 max-w-7xl mx-auto">
        <motion.header 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-center mb-2">Choose Your Resume Template</h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
            Select from our professionally designed templates to create your perfect resume
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-6">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
              <Input
                placeholder="Search templates by name or category..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} />
              Filters
            </Button>
          </div>
          
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="flex gap-2 mt-4 overflow-x-auto pb-2 no-scrollbar"
              >
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap",
                      "flex items-center gap-2",
                      selectedCategory === category.id ? "bg-resume-primary text-white" : "text-gray-600 dark:text-gray-300"
                    )}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <span>{category.icon}</span>
                    {category.name}
                  </Button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 border rounded-lg">
                <div className="aspect-[8.5/11] bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />
                <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {filteredTemplates.map((template) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ResumeTemplateCard
                    template={template}
                    onSelect={() => handleTemplateSelect(template.id)}
                    disabled={isCreatingResume}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && filteredTemplates.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-semibold mb-2">No templates found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
};

export default Templates;
