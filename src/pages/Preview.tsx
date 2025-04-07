
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Download, Share, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const Preview = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("preview");
  
  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Your resume is being prepared for download.",
    });
  };
  
  const handleShare = () => {
    toast({
      title: "Share",
      description: "Share functionality coming soon!",
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 flex items-center justify-between border-b">
        <button onClick={() => navigate(-1)} className="text-gray-600">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-medium">Preview</h1>
        <div className="w-8"></div> {/* Empty div for flex spacing */}
      </header>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <TabsList className="grid grid-cols-2 mx-4 mt-4">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="download">Download</TabsTrigger>
        </TabsList>
        
        <TabsContent value="preview" className="flex-1 p-4 flex flex-col">
          <div className="bg-white border rounded-lg shadow-lg flex-1 overflow-hidden flex items-center justify-center">
            <div className="w-full max-w-md mx-auto p-6 text-center">
              <img 
                src="/lovable-uploads/4e3c26f4-a07f-4e34-9b35-262f7ec97f9e.png"
                alt="Resume Preview" 
                className="max-h-[70vh] mx-auto object-contain"
              />
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-3 gap-4">
            <Button 
              variant="outline"
              className="flex flex-col items-center justify-center h-16"
              onClick={() => navigate("/builder")}
            >
              <Edit size={20} className="mb-1" />
              <span className="text-xs">Edit</span>
            </Button>
            
            <Button 
              variant="outline"
              className="flex flex-col items-center justify-center h-16"
              onClick={handleShare}
            >
              <Share size={20} className="mb-1" />
              <span className="text-xs">Share</span>
            </Button>
            
            <Button 
              variant="outline"
              className="flex flex-col items-center justify-center h-16"
              onClick={handleDownload}
            >
              <Download size={20} className="mb-1" />
              <span className="text-xs">Download</span>
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="download" className="flex-1 p-4">
          <div className="bg-gray-50 rounded-lg p-5 mb-4">
            <h2 className="font-medium mb-2">Download Options</h2>
            <p className="text-sm text-gray-600 mb-4">
              Choose the format to download your resume
            </p>
            
            <div className="space-y-3">
              <Button 
                className="w-full justify-start"
                onClick={handleDownload}
              >
                <Download size={16} className="mr-2" />
                PDF Format
              </Button>
              
              <Button 
                variant="outline"
                className="w-full justify-start"
                onClick={handleDownload}
              >
                <Download size={16} className="mr-2" />
                Word Document
              </Button>
              
              <Button 
                variant="outline"
                className="w-full justify-start"
                onClick={handleDownload}
              >
                <Download size={16} className="mr-2" />
                Plain Text
              </Button>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-5">
            <h2 className="font-medium mb-2">Export Tips</h2>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• PDF format is recommended for most job applications</li>
              <li>• Word format allows further editing</li>
              <li>• Some job portals may require plain text format</li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Preview;
