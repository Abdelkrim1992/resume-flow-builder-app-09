
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, X } from 'lucide-react';
import { Skill } from '@/types/supabase';
import { getSkills, deleteSkill } from '@/services/resumeService';
import { useToast } from '@/hooks/use-toast';
import SkillForm from './SkillForm';
import {
  Badge
} from "@/components/ui/badge";

interface SkillListProps {
  resumeId: string;
}

const SkillList = ({ resumeId }: SkillListProps) => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const { toast } = useToast();

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const data = await getSkills(resumeId);
      setSkills(data);
    } catch (error: any) {
      toast({
        title: "Error fetching skills",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (resumeId) {
      fetchSkills();
    }
  }, [resumeId]);

  const handleAddClick = () => {
    setIsAdding(true);
    setEditingSkill(null);
  };

  const handleEditClick = (skill: Skill) => {
    setEditingSkill(skill);
    setIsAdding(false);
  };

  const handleSave = () => {
    setIsAdding(false);
    setEditingSkill(null);
    fetchSkills();
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingSkill(null);
  };

  const handleDelete = async (skillId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm("Are you sure you want to delete this skill?")) {
      return;
    }
    
    try {
      await deleteSkill(skillId);
      toast({ title: "Skill deleted!" });
      fetchSkills();
    } catch (error: any) {
      toast({
        title: "Error deleting skill",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getLevelColor = (level: string | null) => {
    switch (level) {
      case 'beginner':
        return 'bg-blue-100 text-blue-800';
      case 'intermediate':
        return 'bg-green-100 text-green-800';
      case 'advanced':
        return 'bg-purple-100 text-purple-800';
      case 'expert':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isAdding) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Add Skill</h3>
        <SkillForm 
          resumeId={resumeId} 
          onSave={handleSave} 
          onCancel={handleCancel} 
        />
      </div>
    );
  }

  if (editingSkill) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Edit Skill</h3>
        <SkillForm 
          resumeId={resumeId} 
          skill={editingSkill}
          onSave={handleSave} 
          onCancel={handleCancel} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {loading ? (
        <p>Loading skills...</p>
      ) : (
        <>
          {skills.length === 0 ? (
            <p className="text-muted-foreground">No skills added yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge
                  key={skill.id}
                  className={`px-3 py-1 cursor-pointer ${getLevelColor(skill.level)}`}
                  onClick={() => handleEditClick(skill)}
                >
                  {skill.name}
                  <button
                    className="ml-2 hover:text-red-500"
                    onClick={(e) => handleDelete(skill.id, e)}
                  >
                    <X size={14} />
                  </button>
                </Badge>
              ))}
            </div>
          )}
          
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleAddClick}
          >
            <Plus size={16} className="mr-2" />
            Add Skill
          </Button>
        </>
      )}
    </div>
  );
};

export default SkillList;
