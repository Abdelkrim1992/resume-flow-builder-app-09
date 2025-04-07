
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

// Define our own UserProfile interface instead of extending Tables
interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
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
      } catch (error: any) {
        console.error('Error:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user, toast]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
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
        <h1 className="text-xl font-semibold">My Profile</h1>
        <div className="w-10"></div>
      </header>

      <div className="flex-1 flex flex-col items-center pt-8">
        {loading ? (
          <>
            <Skeleton className="w-24 h-24 rounded-full" />
            <Skeleton className="h-8 w-48 mt-4" />
            <Skeleton className="h-5 w-64 mt-2" />
          </>
        ) : (
          <>
            <Avatar className="w-24 h-24 text-lg border-2 border-white shadow-lg">
              <AvatarImage src={profile?.avatar_url || ''} />
              <AvatarFallback>{getInitials(profile?.full_name)}</AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold mt-4">{profile?.full_name || 'User'}</h2>
            <p className="text-gray-500 mt-1">{profile?.email}</p>
          </>
        )}

        <div className="w-full max-w-md mt-12 space-y-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-medium mb-4">Account Information</h3>
            {loading ? (
              <>
                <Skeleton className="h-5 w-full mt-2" />
                <Skeleton className="h-5 w-full mt-2" />
              </>
            ) : (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Email</span>
                  <span>{profile?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Full Name</span>
                  <span>{profile?.full_name || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Joined</span>
                  <span>{profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}</span>
                </div>
              </div>
            )}
          </div>

          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 border-dashed border-gray-300"
            onClick={() => navigate('/edit-profile')}
          >
            <User size={16} />
            <span>Edit Profile</span>
          </Button>

          <Button
            variant="destructive"
            className="w-full mt-8"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
