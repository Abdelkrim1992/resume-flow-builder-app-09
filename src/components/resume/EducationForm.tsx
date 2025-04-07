
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { addEducation, updateEducation, deleteEducation } from '@/services/resumeService';
import { Education } from '@/types/supabase';
import { Trash2 } from 'lucide-react';

interface EducationFormProps {
  resumeId: string;
  education?: Education;
  onSave: () => void;
  onCancel: () => void;
}

const EducationForm = ({ resumeId, education, onSave, onCancel }: EducationFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isCurrent, setIsCurrent] = useState(education?.current || false);
  const [formData, setFormData] = useState({
    institution: education?.institution || '',
    degree: education?.degree || '',
    field_of_study: education?.field_of_study || '',
    start_date: education?.start_date ? new Date(education.start_date).toISOString().split('T')[0] : '',
    end_date: education?.end_date ? new Date(education.end_date).toISOString().split('T')[0] : '',
    description: education?.description || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setIsCurrent(checked);
    if (checked) {
      setFormData(prev => ({
        ...prev,
        end_date: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.institution || !formData.degree || !formData.start_date) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      
      const educationData = {
        resume_id: resumeId,
        institution: formData.institution,
        degree: formData.degree,
        field_of_study: formData.field_of_study || null,
        start_date: formData.start_date,
        end_date: isCurrent ? null : formData.end_date || null,
        current: isCurrent,
        description: formData.description || null,
      };
      
      if (education?.id) {
        await updateEducation(education.id, educationData);
        toast({ title: "Education updated!" });
      } else {
        await addEducation(educationData);
        toast({ title: "Education added!" });
      }
      
      onSave();
    } catch (error: any) {
      toast({
        title: "Error saving education",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!education?.id) return;
    
    if (!confirm("Are you sure you want to delete this education?")) {
      return;
    }
    
    try {
      setLoading(true);
      await deleteEducation(education.id);
      toast({ title: "Education deleted!" });
      onSave();
    } catch (error: any) {
      toast({
        title: "Error deleting education",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="institution">Institution*</Label>
        <Input
          id="institution"
          name="institution"
          value={formData.institution}
          onChange={handleChange}
          required
          disabled={loading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="degree">Degree*</Label>
        <Input
          id="degree"
          name="degree"
          value={formData.degree}
          onChange={handleChange}
          required
          disabled={loading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="field_of_study">Field of Study</Label>
        <Input
          id="field_of_study"
          name="field_of_study"
          value={formData.field_of_study}
          onChange={handleChange}
          disabled={loading}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_date">Start Date*</Label>
          <Input
            id="start_date"
            name="start_date"
            type="date"
            value={formData.start_date}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="end_date">End Date {isCurrent && '(Current)'}</Label>
          <Input
            id="end_date"
            name="end_date"
            type="date"
            value={formData.end_date}
            onChange={handleChange}
            disabled={isCurrent || loading}
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="current-education" 
          checked={isCurrent}
          onCheckedChange={handleCheckboxChange}
          disabled={loading}
        />
        <Label htmlFor="current-education" className="text-sm font-normal">
          I am currently studying here
        </Label>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          placeholder="Describe your studies, projects, achievements..."
          disabled={loading}
        />
      </div>
      
      <div className="flex justify-between pt-4">
        {education?.id && (
          <Button 
            type="button" 
            variant="destructive"
            size="icon"
            onClick={handleDelete}
            disabled={loading}
          >
            <Trash2 size={18} />
          </Button>
        )}
        
        <div className="flex space-x-2 ml-auto">
          <Button 
            type="button" 
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          
          <Button 
            type="submit" 
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default EducationForm;
