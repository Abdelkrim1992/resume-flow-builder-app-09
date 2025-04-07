import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Profile } from '@/types/supabase';

const ProfileForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Partial<Profile>>({
    full_name: '',
    email: '',
    location: '',
    birth_date: '',
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error.message);
        // If profile not found, try to get data from users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user?.id)
          .single();
          
        if (userError) {
          throw error;
        }
        
        if (userData) {
          setProfile({
            ...userData,
            email: user?.email || '',
          });
        }
      } else if (data) {
        setProfile({
          ...data,
          email: user?.email || '',
          birth_date: data.birth_date ? new Date(data.birth_date).toISOString().split('T')[0] : '',
        });
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Update profile table
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: user?.id,
        full_name: profile.full_name,
        location: profile.location,
        birth_date: profile.birth_date || null,
        updated_at: new Date().toISOString(),
      });

      if (profileError) console.error("Error updating profile:", profileError);
      
      // Also update users table to keep data in sync
      const { error: userError } = await supabase.from('users').upsert({
        id: user?.id,
        full_name: profile.full_name,
        updated_at: new Date().toISOString(),
      });

      if (userError) console.error("Error updating user:", userError);
      
      if (!profileError && !userError) {
        toast({
          title: "Profile updated successfully!",
        });
      } else {
        throw new Error("Failed to update profile");
      }
      
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="full_name">Full Name</Label>
        <Input
          id="full_name"
          name="full_name"
          value={profile.full_name || ''}
          onChange={handleChange}
          disabled={loading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={profile.email || ''}
          disabled={true}
        />
        <p className="text-sm text-muted-foreground">Email cannot be changed</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          value={profile.location || ''}
          onChange={handleChange}
          disabled={loading}
          placeholder="City, Country"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="birth_date">Date of Birth</Label>
        <Input
          id="birth_date"
          name="birth_date"
          type="date"
          value={profile.birth_date || ''}
          onChange={handleChange}
          disabled={loading}
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Profile"}
      </Button>
    </form>
  );
};

export default ProfileForm;
