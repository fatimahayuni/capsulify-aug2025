"use client";

import { useEffect, useState, useRef } from "react";
import { getOutfits } from "./actions";
import { Outfit } from "./types";
import OutfitCard from "./components/OutfitCard";
import Pager from "./components/Pager";

export default function OutfitsPage() {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 18;
  const contentRef = useRef<HTMLDivElement>(null);

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

  // Calculate pagination
  const totalPages = Math.ceil(outfits.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOutfits = outfits.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of content area
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto relative">
      {/* Static Pager at the top */}
      {totalPages > 1 && (
        <div className="sticky top-0 z-10 w-full bg-primary border-b border-gray-200">
          <Pager
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
      
      {/* Content area */}
      <div ref={contentRef} className="flex flex-col gap-8 overflow-y-scroll scrollbar-hide w-full max-sm:max-h-[calc(100vh-260px)] px-4 max-sm:px-2 mt-4">
          <div className="flex flex-wrap justify-center space-x-2 space-y-2 w-full text-sm mb-8">
            {currentOutfits.map((outfit: Outfit, outfitIndex: number) => (
              <OutfitCard key={startIndex + outfitIndex} outfit={outfit} />
            ))}
          </div>
        <div className="h-[10rem] w-full"></div>
      </div>
    </div>
  );
}
