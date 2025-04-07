
import { useState } from "react";
import { Heart } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  
  return (
    <MainLayout>
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold text-center mb-6">Favorites</h1>
        
        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <Heart size={48} className="text-gray-300" />
            </div>
            <h2 className="text-xl font-medium mb-2">No favorites yet</h2>
            <p className="text-gray-500">
              Save your favorite resume templates and themes here for quick access.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {/* Favorite items would go here */}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Favorites;
