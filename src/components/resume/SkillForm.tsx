
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { addSkill, updateSkill, deleteSkill } from '@/services/resumeService';
import { Skill } from '@/types/supabase';
import { Trash2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SkillFormProps {
  resumeId: string;
  skill?: Skill;
  onSave: () => void;
  onCancel: () => void;
}

const skillLevels = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' },
];

const SkillForm = ({ resumeId, skill, onSave, onCancel }: SkillFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: skill?.name || '',
    level: skill?.level || 'intermediate',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLevelChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      level: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast({
        title: "Skill name is required",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      
      const skillData = {
        resume_id: resumeId,
        name: formData.name,
        level: formData.level,
      };
      
      if (skill?.id) {
        await updateSkill(skill.id, skillData);
        toast({ title: "Skill updated!" });
      } else {
        await addSkill(skillData);
        toast({ title: "Skill added!" });
      }
      
      onSave();
    } catch (error: any) {
      toast({
        title: "Error saving skill",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!skill?.id) return;
    
    if (!confirm("Are you sure you want to delete this skill?")) {
      return;
    }
    
    try {
      setLoading(true);
      await deleteSkill(skill.id);
      toast({ title: "Skill deleted!" });
      onSave();
    } catch (error: any) {
      toast({
        title: "Error deleting skill",
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
        <Label htmlFor="name">Skill Name*</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={loading}
          placeholder="e.g., JavaScript, Project Management, Photoshop"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="level">Proficiency Level</Label>
        <Select
          value={formData.level}
          onValueChange={handleLevelChange}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select level" />
          </SelectTrigger>
          <SelectContent>
            {skillLevels.map((level) => (
              <SelectItem key={level.value} value={level.value}>
                {level.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex justify-between pt-4">
        {skill?.id && (
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

export default SkillForm;
