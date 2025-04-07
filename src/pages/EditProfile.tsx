
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  location: string | null;
  created_at: string;
  updated_at: string;
}

const EditProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    location: "",
    avatar_url: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          toast({
            title: "Error fetching profile",
            description: error.message,
            variant: "destructive"
          });
          return;
        }

        setProfile(data as UserProfile);
        setFormData({
          full_name: data.full_name || "",
          location: data.location || "",
          avatar_url: data.avatar_url || "",
        });
      } catch (error: any) {
        console.error('Error:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from("users")
        .update({
          full_name: formData.full_name,
          location: formData.location,
          avatar_url: formData.avatar_url,
          updated_at: new Date().toISOString()
        })
        .eq("id", user.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Profile updated successfully",
      });
      
      // Navigate back to profile page
      navigate("/profile");
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-gray-50 p-4">
      <header className="py-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="text-gray-600"
        >
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-xl font-semibold">Edit Profile</h1>
        <div className="w-10"></div>
      </header>

      <div className="flex-1 flex flex-col items-center pt-8">
        <div className="w-full max-w-md">
          {loading ? (
            <>
              <Skeleton className="h-12 w-full mb-4" />
              <Skeleton className="h-12 w-full mb-4" />
              <Skeleton className="h-12 w-full mb-4" />
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Your full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location || ""}
                  onChange={handleChange}
                  placeholder="City, Country"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="avatar_url">Profile Picture URL</Label>
                <Input
                  id="avatar_url"
                  name="avatar_url"
                  value={formData.avatar_url || ""}
                  onChange={handleChange}
                  placeholder="https://example.com/avatar.jpg"
                />
                <p className="text-xs text-gray-500">Enter a URL to your profile picture</p>
              </div>
              
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={saving}
                >
                  {saving ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" /> Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
