import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Pencil } from 'lucide-react';
import { Experience } from '@/types/supabase';
import { getExperiences } from '@/services/resumeService';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import ExperienceForm from './ExperienceForm';
import { supabase } from '@/integrations/supabase/client';

interface ExperienceListProps {
  resumeId: string;
}

const ExperienceList = ({ resumeId }: ExperienceListProps) => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const { toast } = useToast();

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const data = await getExperiences(resumeId);
      setExperiences(data);
    } catch (error: any) {
      toast({
        title: "Error fetching experiences",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (resumeId) {
      fetchExperiences();
    }
  }, [resumeId]);

  const handleAddClick = () => {
    setIsAdding(true);
    setEditingExperience(null);
  };

  const handleEditClick = (experience: Experience) => {
    setEditingExperience(experience);
    setIsAdding(false);
  };

  const handleSave = () => {
    setIsAdding(false);
    setEditingExperience(null);
    fetchExperiences();
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingExperience(null);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Present';
    return format(new Date(dateString), 'MMM yyyy');
  };

  if (isAdding) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Add Experience</h3>
        <ExperienceForm 
          resumeId={resumeId} 
          onSave={handleSave} 
          onCancel={handleCancel} 
        />
      </div>
    );
  }

  if (editingExperience) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Edit Experience</h3>
        <ExperienceForm 
          resumeId={resumeId} 
          experience={editingExperience}
          onSave={handleSave} 
          onCancel={handleCancel} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {loading ? (
        <p>Loading experiences...</p>
      ) : (
        <>
          {experiences.length === 0 ? (
            <p className="text-muted-foreground">No experiences added yet.</p>
          ) : (
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div 
                  key={exp.id} 
                  className="p-4 border rounded-md hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => handleEditClick(exp)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{exp.position}</h4>
                      <p className="text-sm text-muted-foreground">{exp.company}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(exp.start_date)} - {formatDate(exp.end_date)}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Pencil size={16} />
                    </Button>
                  </div>
                  {exp.description && (
                    <p className="text-sm mt-2 line-clamp-2">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
          
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleAddClick}
          >
            <Plus size={16} className="mr-2" />
            Add Experience
          </Button>
        </>
      )}
    </div>
  );
};

export default ExperienceList;
