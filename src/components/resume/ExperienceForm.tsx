
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { addExperience, updateExperience, deleteExperience } from '@/services/resumeService';
import { Experience } from '@/types/supabase';
import { Trash2 } from 'lucide-react';

interface ExperienceFormProps {
  resumeId: string;
  experience?: Experience;
  onSave: () => void;
  onCancel: () => void;
}

const ExperienceForm = ({ resumeId, experience, onSave, onCancel }: ExperienceFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isCurrent, setIsCurrent] = useState(experience?.current || false);
  const [formData, setFormData] = useState({
    company: experience?.company || '',
    position: experience?.position || '',
    start_date: experience?.start_date ? new Date(experience.start_date).toISOString().split('T')[0] : '',
    end_date: experience?.end_date ? new Date(experience.end_date).toISOString().split('T')[0] : '',
    description: experience?.description || '',
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
    
    if (!formData.company || !formData.position || !formData.start_date) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      
      const experienceData = {
        resume_id: resumeId,
        company: formData.company,
        position: formData.position,
        start_date: formData.start_date,
        end_date: isCurrent ? null : formData.end_date || null,
        current: isCurrent,
        description: formData.description || null,
      };
      
      if (experience?.id) {
        await updateExperience(experience.id, experienceData);
        toast({ title: "Experience updated!" });
      } else {
        await addExperience(experienceData);
        toast({ title: "Experience added!" });
      }
      
      onSave();
    } catch (error: any) {
      toast({
        title: "Error saving experience",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!experience?.id) return;
    
    if (!confirm("Are you sure you want to delete this experience?")) {
      return;
    }
    
    try {
      setLoading(true);
      await deleteExperience(experience.id);
      toast({ title: "Experience deleted!" });
      onSave();
    } catch (error: any) {
      toast({
        title: "Error deleting experience",
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
        <Label htmlFor="company">Company Name*</Label>
        <Input
          id="company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          required
          disabled={loading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="position">Position*</Label>
        <Input
          id="position"
          name="position"
          value={formData.position}
          onChange={handleChange}
          required
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
          id="current-job" 
          checked={isCurrent}
          onCheckedChange={handleCheckboxChange}
          disabled={loading}
        />
        <Label htmlFor="current-job" className="text-sm font-normal">
          I am currently working here
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
          placeholder="Describe your responsibilities and achievements..."
          disabled={loading}
        />
      </div>
      
      <div className="flex justify-between pt-4">
        {experience?.id && (
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

export default ExperienceForm;
