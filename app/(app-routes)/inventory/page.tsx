"use client";
import { useState, useEffect, useRef } from "react";
import { getUserWardrobe } from "@/app/lib/actions/clothingItems.actions";
import { CATEGORIES } from "@/app/constants/utils";
import ClothingItemCard from "@/app/components/ClothingItemCard";
import { useAuth } from "@clerk/nextjs";

export default function InventoryPage() {
  const [wardrobe, setWardrobe] = useState<any>({});
  const { userId: clerkId } = useAuth();

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.getAttribute("data-key"));
          }
        });
      },
      {
        root: null,
        // Offset top half of viewport so section triggers when past midpoint
        rootMargin: "-50% 0px -50% 0px",
        threshold: 0, // We don't need a percent threshold when rootMargin does the job
      }
    );

    Object.keys(CATEGORIES).forEach((key) => {
      const section = sectionRefs.current[key];
      if (section) observer.observe(section);
    });

    return () => {
      Object.keys(CATEGORIES).forEach((key) => {
        const section = sectionRefs.current[key];
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  useEffect(() => {
    const fetchWardrobe = async () => {
      if (!clerkId) return;
      const currentUsersWardrobe = await getUserWardrobe(clerkId);
      setWardrobe(currentUsersWardrobe);
    };
    fetchWardrobe();
  }, [clerkId]);

  const scrollToSection = (key: string) => {
    const section = sectionRefs.current[key];
    if (section) {
      section?.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(key);
    }
  };

  return (
    <div className="flex flex-col gap-6 items-center w-full max-w-6xl mx-auto mt-4 px-4 max-sm:px-2 relative">
      <div className="flex flex-col gap-4 items-center w-full max-w-6xl mx-auto sticky top-0 z-10 bg-primary py-4">
        {/* Search bar */}
        {/* <div className="flex bg-secondary gap-2 justify-center items-center p-2 rounded-lg w-[450px] max-sm:w-[95%] mx-auto">
          <SearchIcon className="w-4 h-4 mr-2" />
          <input
            type="text"
            className="outline-0 border-0 text-sm rounded-lg w-full"
            placeholder="Search for items..."
          />
        </div> */}

        {/* Scroll Buttons */}
        <div className="flex gap-2 justify-start sm:justify-center text-[12px] overflow-x-auto w-full scrollbar-hide px-2">
          {Object.entries(CATEGORIES).map(([key, value]) => (
            <button
              key={key}
              onClick={() => scrollToSection(key)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg transition ${
                activeSection === key
                  ? "bg-accent text-white"
                  : "bg-primary text-[#4b3621] border border-[#d3cfc9]"
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div className="flex flex-col gap-8 overflow-y-scroll scrollbar-hide w-full max-sm:max-h-[calc(100vh-260px)]">
        {Object.entries(CATEGORIES).map(([key, value]) => {
          const items = wardrobe[key] || [];
          return (
            <div
              key={key}
              ref={(el) => {
                sectionRefs.current[key] = el;
              }}
              className="w-full scroll-mt-[75px] "
              data-key={key}
            >
              {/* <h2 className="text-xl font-semibold text-[#4b3621] mb-4 text-center uppercase">
                {value}
              </h2> */}
              <div className="flex flex-wrap justify-center space-x-2 space-y-4 w-full text-sm mb-8">
                {items.map((item: any) => (
                  <ClothingItemCard key={item.id} item={item} category={key} />
                ))}
              </div>
            </div>
          );
        })}
        <div className="h-[10rem] w-full"></div>
      </div>

      {/* <button className="bg-accent text-white text-[14px] px-4 py-2 mb-2 rounded-md fixed bottom-[10%]">
        Generate Outfits
      </button> */}
    </div>
  );
}
