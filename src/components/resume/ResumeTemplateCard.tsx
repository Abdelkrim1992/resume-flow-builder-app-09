
import React from "react";
import { Link } from "react-router-dom";
import { FileText, Briefcase, GraduationCap, Award, User, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ResumeTemplate {
  id: number;
  name: string;
  category: string;
  description?: string;
  color: string;
  layout: "standard" | "modern" | "creative" | "simple" | "professional";
}

interface ResumeTemplateCardProps {
  template: ResumeTemplate;
  compact?: boolean;
}

const ResumeTemplateCard: React.FC<ResumeTemplateCardProps> = ({ template, compact = false }) => {
  const { id, name, category, description, color, layout } = template;
  
  // Generate dynamic content based on template layout
  const renderTemplatePreview = () => {
    switch (layout) {
      case "modern":
        return (
          <div className="w-full h-full flex flex-col" style={{ backgroundColor: color }}>
            <div className="bg-white dark:bg-gray-800 p-2 w-1/3 h-full">
              <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 mb-2"></div>
              <div className="h-2 w-16 bg-gray-300 dark:bg-gray-600 mb-1"></div>
              <div className="h-2 w-12 bg-gray-300 dark:bg-gray-600 mb-2"></div>
              <div className="h-2 w-14 bg-gray-300 dark:bg-gray-600 mb-1"></div>
              <div className="h-2 w-10 bg-gray-300 dark:bg-gray-600 mb-3"></div>
              <div className="h-4 w-16 bg-gray-400 dark:bg-gray-500 mb-2"></div>
              <div className="h-2 w-full bg-gray-300 dark:bg-gray-600 mb-1"></div>
              <div className="h-2 w-full bg-gray-300 dark:bg-gray-600 mb-1"></div>
            </div>
            <div className="flex-1 p-2">
              <div className="h-4 w-24 bg-white dark:bg-gray-300 mb-2"></div>
              <div className="h-2 w-full bg-white/70 dark:bg-gray-400 mb-1"></div>
              <div className="h-2 w-full bg-white/70 dark:bg-gray-400 mb-1"></div>
              <div className="h-2 w-3/4 bg-white/70 dark:bg-gray-400 mb-2"></div>
              <div className="h-4 w-24 bg-white dark:bg-gray-300 mb-2"></div>
              <div className="h-2 w-full bg-white/70 dark:bg-gray-400 mb-1"></div>
              <div className="h-2 w-full bg-white/70 dark:bg-gray-400 mb-1"></div>
            </div>
          </div>
        );
      case "creative":
        return (
          <div className="w-full h-full flex flex-col">
            <div className="h-1/4 w-full" style={{ backgroundColor: color }}>
              <div className="flex items-center justify-between p-2">
                <div>
                  <div className="h-4 w-24 bg-white mb-1"></div>
                  <div className="h-2 w-16 bg-white/80 mb-1"></div>
                </div>
                <div className="h-8 w-8 rounded-full bg-white"></div>
              </div>
            </div>
            <div className="flex-1 p-2 bg-white dark:bg-gray-800">
              <div className="h-3 w-20 bg-gray-400 dark:bg-gray-500 mb-2"></div>
              <div className="h-2 w-full bg-gray-300 dark:bg-gray-600 mb-1"></div>
              <div className="h-2 w-full bg-gray-300 dark:bg-gray-600 mb-1"></div>
              <div className="h-3 w-20 bg-gray-400 dark:bg-gray-500 mb-2 mt-2"></div>
              <div className="h-2 w-full bg-gray-300 dark:bg-gray-600 mb-1"></div>
              <div className="h-2 w-full bg-gray-300 dark:bg-gray-600 mb-1"></div>
              <div className="flex mt-2 justify-between">
                <div className="h-8 w-8 rounded-full" style={{ backgroundColor: color }}></div>
                <div className="h-8 w-8 rounded-full" style={{ backgroundColor: color }}></div>
                <div className="h-8 w-8 rounded-full" style={{ backgroundColor: color }}></div>
              </div>
            </div>
          </div>
        );
      case "professional":
        return (
          <div className="w-full h-full flex flex-col">
            <div className="p-2 border-b-2 flex justify-between items-center" style={{ borderColor: color }}>
              <div>
                <div className="h-4 w-24 bg-gray-400 dark:bg-gray-500 mb-1"></div>
                <div className="h-2 w-16 bg-gray-300 dark:bg-gray-600"></div>
              </div>
              <div className="flex space-x-1">
                <div className="h-2 w-6 bg-gray-300 dark:bg-gray-600"></div>
                <div className="h-2 w-6 bg-gray-300 dark:bg-gray-600"></div>
                <div className="h-2 w-6 bg-gray-300 dark:bg-gray-600"></div>
              </div>
            </div>
            <div className="flex-1 p-2 bg-white dark:bg-gray-800">
              <div className="h-3 w-full" style={{ backgroundColor: color, opacity: 0.2 }}></div>
              <div className="h-3 w-20" style={{ backgroundColor: color, marginTop: -3 }}></div>
              <div className="mt-2">
                <div className="h-2 w-full bg-gray-300 dark:bg-gray-600 mb-1"></div>
                <div className="h-2 w-full bg-gray-300 dark:bg-gray-600 mb-1"></div>
                <div className="h-2 w-3/4 bg-gray-300 dark:bg-gray-600 mb-2"></div>
              </div>
              <div className="mt-2">
                <div className="h-3 w-full" style={{ backgroundColor: color, opacity: 0.2 }}></div>
                <div className="h-3 w-20" style={{ backgroundColor: color, marginTop: -3 }}></div>
                <div className="h-2 w-full bg-gray-300 dark:bg-gray-600 mt-1 mb-1"></div>
                <div className="h-2 w-full bg-gray-300 dark:bg-gray-600 mb-1"></div>
              </div>
            </div>
          </div>
        );
      case "simple":
        return (
          <div className="w-full h-full flex flex-col">
            <div className="p-2 bg-white dark:bg-gray-800 text-center">
              <div className="h-4 w-32 bg-gray-400 dark:bg-gray-500 mb-1 mx-auto"></div>
              <div className="h-2 w-24 bg-gray-300 dark:bg-gray-600 mb-2 mx-auto"></div>
              <div className="flex justify-center space-x-2 mt-1">
                <div className="h-2 w-6 bg-gray-300 dark:bg-gray-600"></div>
                <div className="h-2 w-10 bg-gray-300 dark:bg-gray-600"></div>
                <div className="h-2 w-8 bg-gray-300 dark:bg-gray-600"></div>
              </div>
            </div>
            <div className="flex-1 p-2 bg-white dark:bg-gray-800 border-t-2" style={{ borderColor: color }}>
              <div className="h-3 w-20 font-bold mb-1" style={{ backgroundColor: color }}></div>
              <div className="h-2 w-full bg-gray-300 dark:bg-gray-600 mb-1"></div>
              <div className="h-2 w-full bg-gray-300 dark:bg-gray-600 mb-1"></div>
              <div className="h-2 w-3/4 bg-gray-300 dark:bg-gray-600 mb-2"></div>
              <div className="h-3 w-20 font-bold mb-1" style={{ backgroundColor: color }}></div>
              <div className="h-2 w-full bg-gray-300 dark:bg-gray-600 mb-1"></div>
              <div className="h-2 w-full bg-gray-300 dark:bg-gray-600 mb-1"></div>
            </div>
          </div>
        );
      default: // standard layout
        return (
          <div className="w-full h-full flex">
            <div className="w-1/3 h-full p-2" style={{ backgroundColor: color }}>
              <div className="h-6 w-6 bg-white/80 rounded-full mb-2 mx-auto"></div>
              <div className="h-2 w-full bg-white/80 mb-1"></div>
              <div className="h-2 w-full bg-white/80 mb-3"></div>
              <div className="h-3 w-12 bg-white mb-1"></div>
              <div className="h-2 w-full bg-white/80 mb-1"></div>
              <div className="h-2 w-full bg-white/80 mb-1"></div>
              <div className="h-3 w-12 bg-white mt-2 mb-1"></div>
              <div className="h-2 w-full bg-white/80 mb-1"></div>
            </div>
            <div className="w-2/3 h-full p-2 bg-white dark:bg-gray-800">
              <div className="h-3 w-20 bg-gray-400 dark:bg-gray-500 mb-1"></div>
              <div className="h-2 w-full bg-gray-300 dark:bg-gray-600 mb-1"></div>
              <div className="h-2 w-full bg-gray-300 dark:bg-gray-600 mb-1"></div>
              <div className="h-2 w-4/5 bg-gray-300 dark:bg-gray-600 mb-2"></div>
              <div className="h-3 w-20 bg-gray-400 dark:bg-gray-500 mb-1"></div>
              <div className="h-2 w-full bg-gray-300 dark:bg-gray-600 mb-1"></div>
              <div className="h-2 w-full bg-gray-300 dark:bg-gray-600 mb-1"></div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-all hover:shadow-md ${compact ? '' : 'hover:scale-105'}`}>
      <div className={`${compact ? 'aspect-[2/3]' : 'aspect-[3/4]'} bg-gray-50 dark:bg-gray-800 flex items-center justify-center overflow-hidden`}>
        {renderTemplatePreview()}
      </div>
      <div className={`p-3 ${compact ? 'pb-4' : ''}`}>
        <h3 className="font-medium text-resume-primary text-center">{name}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize text-center">{category}</p>
        {description && !compact && (
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 text-center">{description}</p>
        )}
        {!compact && (
          <div className="mt-3 flex justify-center">
            <Link to={`/builder?template=${id}`}>
              <Button size="sm" className="w-full">Use this template</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeTemplateCard;
