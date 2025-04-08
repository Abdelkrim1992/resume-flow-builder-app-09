
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TemplateCardProps {
  id: number;
  name: string;
  category: string;
  image: string;
  description?: string;
  compact?: boolean;
}

const TemplateCard = ({ id, name, category, image, description, compact = false }: TemplateCardProps) => {
  return (
    <div className={`border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-all hover:shadow-md ${compact ? '' : 'hover:scale-105'}`}>
      <div className={`${compact ? 'aspect-[2/3]' : 'aspect-[3/4]'} bg-gray-50 dark:bg-gray-800 flex items-center justify-center overflow-hidden`}>
        {image ? (
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <FileText size={48} />
            <span className="text-sm mt-2">No preview</span>
          </div>
        )}
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

export default TemplateCard;
