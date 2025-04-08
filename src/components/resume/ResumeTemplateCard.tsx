import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FileText, Briefcase, GraduationCap, Award, User, Phone, Mail, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Template } from "@/services/templateService";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { getResumeById } from "@/services/resumeService";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

interface ResumeTemplateCardProps {
  template: Template;
  onSelect?: () => void;
  disabled?: boolean;
}

const ResumeTemplateCard = ({ template, onSelect, disabled }: ResumeTemplateCardProps) => {
  const { user } = useAuth();
  const [previewData, setPreviewData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPreviewData = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        // First try to find the user's resume that uses this template
        const { data: resumes, error: resumeError } = await supabase
          .from('resumes')
          .select('id')
          .eq('template_id', template.id)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (resumeError) {
          throw resumeError;
        }

        if (resumes && resumes.length > 0) {
          // If we found the user's resume using this template, fetch its full data
          const fullResume = await getResumeById(resumes[0].id);
          setPreviewData(fullResume);
        } else {
          // If no resume exists with this template, create a preview with sample data
          setPreviewData({
            personal_data: {
              first_name: "John",
              last_name: "Doe",
              email: "john.doe@example.com",
              phone: "+1 (555) 123-4567",
              address: "123 Main St",
              city: "New York",
              country: "USA",
              postal_code: "10001"
            },
            summary: "Experienced professional with a strong background in software development and project management. Skilled in creating efficient solutions and leading teams to success.",
            experiences: [
              {
                company: "Tech Solutions Inc",
                position: "Senior Software Engineer",
                start_date: "2020-01",
                end_date: "2023-12",
                current: true,
                description: "Led development of enterprise applications\nManaged team of 5 developers\nImplemented CI/CD pipelines",
                location: "New York, NY"
              }
            ],
            education: [
              {
                school: "University of Technology",
                degree: "Master of Science",
                field_of_study: "Computer Science",
                start_date: "2015-09",
                end_date: "2017-05",
                description: "Specialized in Artificial Intelligence\nGraduated with honors",
                location: "Boston, MA"
              }
            ],
            skills: [
              {
                category: "Technical Skills",
                skills: ["JavaScript", "React", "Node.js", "Python", "SQL"]
              },
              {
                category: "Soft Skills",
                skills: ["Leadership", "Communication", "Problem Solving"]
              }
            ]
          });
        }
      } catch (err) {
        console.error('Error fetching preview data:', err);
        setError('Failed to load preview data');
      } finally {
        setLoading(false);
      }
    };

    fetchPreviewData();
  }, [template.id, user?.id]);

  const renderPreviewContent = () => {
    if (loading) {
        return (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-6 w-6 animate-spin text-resume-primary" />
            </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-full text-red-500">
          {error}
          </div>
        );
    }

    if (!previewData) return null;

        return (
      <div className="p-4 space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold">{previewData.personal_data.first_name} {previewData.personal_data.last_name}</h3>
          <p className="text-sm text-gray-600">{previewData.personal_data.email}</p>
              </div>
              
        <div>
          <h4 className="text-sm font-medium mb-2">Summary</h4>
          <p className="text-xs text-gray-600 line-clamp-3">{previewData.summary}</p>
              </div>
              
        <div>
          <h4 className="text-sm font-medium mb-2">Experience</h4>
          {previewData.experiences?.slice(0, 1).map((exp: any, index: number) => (
            <div key={index} className="mb-2">
              <p className="text-xs font-medium">{exp.position}</p>
              <p className="text-xs text-gray-600">{exp.company}</p>
            </div>
          ))}
          </div>

              <div>
          <h4 className="text-sm font-medium mb-2">Education</h4>
          {previewData.education?.slice(0, 1).map((edu: any, index: number) => (
            <div key={index} className="mb-2">
              <p className="text-xs font-medium">{edu.degree}</p>
              <p className="text-xs text-gray-600">{edu.school}</p>
            </div>
          ))}
              </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Skills</h4>
          <div className="flex flex-wrap gap-1">
            {previewData.skills?.[0]?.skills?.slice(0, 3).map((skill: string, index: number) => (
              <span key={index} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                {skill}
              </span>
            ))}
              </div>
            </div>
          </div>
        );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-lg",
        "border-2 border-transparent hover:border-resume-primary",
        "bg-white dark:bg-gray-800"
      )}>
        <CardHeader className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">{template.name}</h3>
            <span className={cn(
              "px-2 py-1 text-xs rounded-full",
              template.category === "professional" && "bg-blue-100 text-blue-800",
              template.category === "minimalist" && "bg-gray-100 text-gray-800",
              template.category === "simple" && "bg-green-100 text-green-800",
              template.category === "creative" && "bg-purple-100 text-purple-800",
              template.category === "modern" && "bg-pink-100 text-pink-800"
            )}>
              {template.category}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">{template.description}</p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="aspect-[8.5/11] relative">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
              {renderPreviewContent()}
      </div>
    </div>
        </CardContent>
        <CardFooter className="p-4">
          <Button
            onClick={onSelect}
            disabled={disabled}
            className={cn(
              "w-full transition-all duration-300",
              "bg-resume-primary hover:bg-resume-primary/90",
              "text-white font-medium",
              "rounded-lg",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {disabled ? "Creating..." : "Use Template"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ResumeTemplateCard;
export type { ResumeTemplateCardProps };
