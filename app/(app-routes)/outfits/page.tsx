"use client";

import { useEffect, useState } from "react";
import { getOutfits } from "./actions";
import { Outfit } from "./types";
import OutfitCard from "./components/OutfitCard";

export default function OutfitsPage() {
  const [outfits, setOutfits] = useState<Outfit[]>([]);

  useEffect(() => {
    const fetchOutfits = async () => {
      const data = await getOutfits();
      if (data) {
        setOutfits(data);
      }
    };
    fetchOutfits();
  }, []);

  return (
    <div className="flex flex-col gap-4 items-center w-full max-w-6xl mx-auto mt-4 px-4 max-sm:px-2 relative">
      <div className="flex flex-col gap-8 overflow-y-scroll scrollbar-hide w-full max-sm:max-h-[calc(100vh-260px)]">
          <div className="flex flex-wrap justify-center space-x-2 space-y-4 w-full text-sm mb-8">
            {outfits.slice(0, 50).map((outfit: Outfit, outfitIndex) => (
              <OutfitCard key={outfitIndex} items={outfit.items} />
            ))}
          </div>
        <div className="h-[10rem] w-full"></div>
      </div>
    </div>
  );
}
