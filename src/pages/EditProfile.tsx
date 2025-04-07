
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Upload, Camera } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  location?: string | null;
  created_at: string;
  updated_at: string;
}

const EditProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    location: "",
  });
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        // First try to get from the users table
        let { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        if (userError) {
          console.error('Error fetching user data:', userError);
          toast({
            title: "Error fetching profile",
            description: userError.message,
            variant: "destructive"
          });
          return;
        }

        // Set initial data from users table
        setProfile(userData as UserProfile);
        setImageUrl(userData.avatar_url);
        
        setFormData({
          full_name: userData.full_name || "",
          location: "", // Will be populated from profiles table if available
        });
        
        // Try to get location from profiles table
        try {
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("location")
            .eq("id", user.id)
            .single();
            
          if (!profileError && profileData) {
            // Update form data with location from profiles
            setFormData(prev => ({
              ...prev,
              location: profileData.location || ""
            }));
            
            // Update profile with location
            setProfile(prev => prev ? {
              ...prev,
              location: profileData.location
            } : null);
          }
        } catch (error) {
          console.log("Could not fetch location from profile, ignoring:", error);
        }
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Check file size (limit to 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 2MB",
        variant: "destructive"
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }

    try {
      setUploading(true);
      setImageDialogOpen(false);

      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // First, check if storage bucket exists, if not add toast message
      const { data: bucketData, error: bucketError } = await supabase.storage.getBucket('avatars');
      
      if (bucketError && bucketError.message.includes('The resource was not found')) {
        toast({
          title: "Storage bucket not found",
          description: "Please contact an administrator to set up the avatars storage bucket",
          variant: "destructive"
        });
        setUploading(false);
        return;
      }

      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data: publicURL } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (publicURL) {
        setImageUrl(publicURL.publicUrl);
        
        toast({
          title: "Image uploaded successfully",
        });
      }
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error uploading image",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      setSaving(true);
      
      // Try to update the profiles table first
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          full_name: formData.full_name,
          email: user.email || '',
          location: formData.location,
          updated_at: new Date().toISOString()
        });
      
      if (profileError) {
        console.error('Error updating profile:', profileError);
      }

      // Also update the users table
      const { error: userError } = await supabase
        .from("users")
        .upsert({
          id: user.id,
          email: user.email || '',
          full_name: formData.full_name,
          avatar_url: imageUrl,
          updated_at: new Date().toISOString()
        });
      
      if (userError) {
        throw userError;
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

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
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
              <div className="flex justify-center mb-8">
                <Skeleton className="h-24 w-24 rounded-full" />
              </div>
              <Skeleton className="h-12 w-full mb-4" />
              <Skeleton className="h-12 w-full mb-4" />
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <Avatar className="w-24 h-24 text-lg border-2 border-white shadow-lg">
                    <AvatarImage src={imageUrl || ''} />
                    <AvatarFallback>{getInitials(formData.full_name)}</AvatarFallback>
                  </Avatar>
                  <Button 
                    type="button"
                    size="icon"
                    className="absolute bottom-0 right-0 rounded-full bg-primary text-white shadow-md"
                    onClick={() => setImageDialogOpen(true)}
                    disabled={uploading}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
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

      {/* Image Upload Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Profile Picture</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-center flex-col gap-4">
              <Label 
                htmlFor="picture" 
                className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-8 w-full flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
              >
                <Upload className="h-8 w-8 text-gray-500" />
                <span className="text-sm text-gray-500">Click to select an image</span>
                <span className="text-xs text-gray-400">JPG, PNG, GIF up to 2MB</span>
              </Label>
              <Input
                id="picture"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setImageDialogOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditProfile;
