
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Pencil } from 'lucide-react';
import { Education } from '@/types/supabase';
import { getEducations } from '@/services/resumeService';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import EducationForm from './EducationForm';

interface EducationListProps {
  resumeId: string;
}

const EducationList = ({ resumeId }: EducationListProps) => {
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const { toast } = useToast();

  const fetchEducations = async () => {
    try {
      setLoading(true);
      const data = await getEducations(resumeId);
      setEducations(data);
    } catch (error: any) {
      toast({
        title: "Error fetching educations",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (resumeId) {
      fetchEducations();
    }
  }, [resumeId]);

  const handleAddClick = () => {
    setIsAdding(true);
    setEditingEducation(null);
  };

  const handleEditClick = (education: Education) => {
    setEditingEducation(education);
    setIsAdding(false);
  };

  const handleSave = () => {
    setIsAdding(false);
    setEditingEducation(null);
    fetchEducations();
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingEducation(null);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Present';
    return format(new Date(dateString), 'MMM yyyy');
  };

  if (isAdding) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Add Education</h3>
        <EducationForm 
          resumeId={resumeId} 
          onSave={handleSave} 
          onCancel={handleCancel} 
        />
      </div>
    );
  }

  if (editingEducation) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Edit Education</h3>
        <EducationForm 
          resumeId={resumeId} 
          education={editingEducation}
          onSave={handleSave} 
          onCancel={handleCancel} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {loading ? (
        <p>Loading education...</p>
      ) : (
        <>
          {educations.length === 0 ? (
            <p className="text-muted-foreground">No education added yet.</p>
          ) : (
            <div className="space-y-4">
              {educations.map((edu) => (
                <div 
                  key={edu.id} 
                  className="p-4 border rounded-md hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => handleEditClick(edu)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{edu.degree}</h4>
                      <p className="text-sm text-muted-foreground">{edu.institution}</p>
                      {edu.field_of_study && (
                        <p className="text-sm text-muted-foreground">{edu.field_of_study}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Pencil size={16} />
                    </Button>
                  </div>
                  {edu.description && (
                    <p className="text-sm mt-2 line-clamp-2">{edu.description}</p>
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
            Add Education
          </Button>
        </>
      )}
    </div>
  );
};

export default EducationList;
