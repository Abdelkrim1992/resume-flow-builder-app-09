
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { FileText, Clock, Plus, User } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const Index = () => {
  const { toast } = useToast();
  
  const resumeData = [
    {
      id: 1,
      title: "UI/UX Designer",
      type: "Modern",
      progress: 85,
      date: "12 May 2023"
    },
    {
      id: 2,
      title: "Graphic Designer",
      type: "Professional",
      progress: 99,
      date: "14 May 2023"
    },
    {
      id: 3,
      title: "Product Designer",
      type: "Simple",
      progress: 25,
      date: "11 May 2023"
    },
    {
      id: 4,
      title: "Designer",
      type: "Modern",
      progress: 15,
      date: "10 May 2023"
    }
  ];
  
  return (
    <MainLayout>
      <div className="px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <Link to="/profile">
            <User className="h-6 w-6 cursor-pointer hover:text-resume-primary transition-colors" />
          </Link>
          <h1 className="text-2xl font-bold">Resumo</h1>
          <button 
            onClick={() => toast({
              title: "Notifications",
              description: "No new notifications"
            })}
            className="text-gray-500">
            <Clock className="h-6 w-6" />
          </button>
        </div>
        
        <div className="mb-8 resume-gradient text-white rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-2">Sign in to your free account</h2>
          <p className="text-sm mb-4">Your guest account will be deleted when time is up. Sign in to save and download your resume.</p>
          <div className="flex gap-4">
            <Link to="/login">
              <Button variant="secondary" className="bg-white text-resume-primary hover:bg-gray-100">Sign In Now</Button>
            </Link>
            <div className="bg-white/20 rounded-md px-3 py-2 text-sm font-medium">67:12:45</div>
          </div>
        </div>
        
        <div className="flex justify-between gap-4 mb-8">
          <Link to="/builder" className="flex-1">
            <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
              <FileText className="h-6 w-6 mb-1" />
              <span>New resume</span>
            </Button>
          </Link>
          <Button variant="outline" className="flex-1 h-20 flex flex-col items-center justify-center">
            <FileText className="h-6 w-6 mb-1" />
            <span>Cover letter</span>
          </Button>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">My Resumes</h2>
          <div className="space-y-4">
            {resumeData.map((resume) => (
              <div key={resume.id} className="border border-gray-200 rounded-lg p-4 flex items-center">
                <div className="bg-gray-100 w-10 h-14 flex items-center justify-center rounded mr-4">
                  <FileText className="text-gray-500" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{resume.title}</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="truncate">{resume.type}</span>
                    <span className="mx-2">•</span>
                    <span className="whitespace-nowrap">{resume.date}</span>
                  </div>
                  <Progress value={resume.progress} className="h-1.5 mt-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <Link to="/builder">
          <Button 
            className="fixed bottom-20 right-6 h-12 w-12 rounded-full resume-gradient resume-shadow flex items-center justify-center"
            variant="default"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </Link>
      </div>
    </MainLayout>
  );
};

export default Index;
