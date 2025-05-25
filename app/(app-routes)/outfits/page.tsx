"use client";

import { useEffect, useState } from "react";
import { getOutfits } from "./actions";
import { Outfit } from "./types";
import OutfitCard from "./components/OutfitCard";

export default function OutfitsPage() {
  const [outfits, setOutfits] = useState<Outfit[]>([]);

  // Page load event.
  useEffect(() => {
    const fetchOutfits = async () => {
      // Check if outfits exist in localStorage
      const storedOutfits = localStorage.getItem('outfits');
      
      if (storedOutfits) {
        setOutfits(JSON.parse(storedOutfits));
      } else {
        const data = await getOutfits();
        if (data) {
          setOutfits(data);
          localStorage.setItem('outfits', JSON.stringify(data));
        }
      }
    };
    fetchOutfits();
  }, []);

  return (
    <div className="flex flex-col gap-4 items-center w-full max-w-6xl mx-auto mt-4 px-4 max-sm:px-2 relative">
      <div className="flex flex-col gap-8 overflow-y-scroll scrollbar-hide w-full max-sm:max-h-[calc(100vh-260px)]">
          <div className="flex flex-wrap justify-center space-x-2 space-y-2 w-full text-sm mb-8">
            {outfits.slice(0, 100).map((outfit: Outfit, outfitIndex: number) => (
              <OutfitCard key={outfitIndex} outfit={outfit} />
            ))}
          </div>
        <div className="h-[10rem] w-full"></div>
      </div>
    </div>
  );
}
