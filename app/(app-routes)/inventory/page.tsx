"use client";
import { useState, useEffect, useRef } from "react";
import { getUserWardrobe } from "@/app/lib/actions/clothingItems.actions";
import { CATEGORIES } from "@/app/constants/utils";
import ClothingItemCard from "@/app/components/ClothingItemCard";
import { useAuth } from "@clerk/nextjs";
import { SearchIcon } from "lucide-react";

export default function InventoryPage() {
  const [wardrobe, setWardrobe] = useState<any>({});
  const { userId: clerkId } = useAuth();

  useEffect(() => {
    const fetchWardrobe = async () => {
      if (!clerkId) return;
      const currentUsersWardrobe = await getUserWardrobe(clerkId);
      setWardrobe(currentUsersWardrobe);
      console.log("Wardrobe fetched successfully:", currentUsersWardrobe);
    };
    fetchWardrobe();
  }, [clerkId]);
  const allClothes = Object.values(wardrobe).flat();
  const filtersArray = ["All Items", ...Object.values(CATEGORIES)];
  const [currentFilter, setCurrentFilter] = useState("All Items");

  const getKeyForFilter = (filter: string) => {
    // get the key that corresponds to the value of the filter
    const key = Object.keys(CATEGORIES).find(
      (key) => CATEGORIES[key as keyof typeof CATEGORIES] === filter
    );
    return key;
  };

  return (
    <div className="flex flex-col gap-6 items-center w-full max-w-6xl mx-auto mt-6 px-4 max-sm:px-2">
      {/* Filter Bar */}
      <div className="flex bg-secondary  gap-2 justify-center items-center p-2 rounded-lg w-[450px] max-sm:w-[95%] mx-auto">
        {/* Search bar */}
        <SearchIcon className="w-4 h-4 mr-2" />
        <input
          type="text"
          className="outline-0 border-0 text-sm rounded-lg w-full"
          placeholder="Search for items..."
        />
      </div>
      <div className="flex gap-2 justify-start sm:justify-center text-[12px] overflow-x-auto w-full scrollbar-hide px-2">
        {filtersArray.map((filter) => (
          <button
            key={filter}
            className={`flex-shrink-0 px-4 py-2 rounded-xl transition ${
              currentFilter === filter
                ? "bg-accent text-white"
                : "bg-primary text-[#4b3621] border border-[#d3cfc9]"
            }`}
            onClick={() => setCurrentFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Inventory Grid */}
      <div className="flex flex-wrap justify-center gap-4 w-full text-sm max-sm:max-h-[calc(100dvh-360px)] overflow-y-auto scrollbar-hide max-sm:gap-2">
        {(currentFilter === "All Items"
          ? allClothes
          : wardrobe[getKeyForFilter(currentFilter) as keyof typeof wardrobe]
        )?.map((item: any) => (
          <ClothingItemCard
            key={item.id}
            item={item}
            category={getKeyForFilter(currentFilter)!}
          />
        ))}
      </div>

      <button className="bg-accent text-white text-[14px] px-4 py-2 mb-2 rounded-md">
        Generate Outfits
      </button>
    </div>

    // <div className="flex flex-col gap-4 items-center w-[80%] mx-auto mt-6 max-sm:w-full max-sm:px-4">
    //   <div className="flex gap-2 justify-center mt-4 text-sm overflow-scroll">
    //     {filtersArray.map((filter) => (
    //       <button
    //         key={filter}
    //         className={`px-4 py-2 rounded-lg cursor-pointer ${
    //           currentFilter === filter
    //             ? "bg-accent text-white"
    //             : "bg-secondary text-gray-700"
    //         }`}
    //         onClick={() => setCurrentFilter(filter)}
    //       >
    //         {filter}
    //       </button>
    //     ))}
    //   </div>

    //   <div className="inventory-grid mb-6 mx-auto">
    //     {(currentFilter === "All Items"
    //       ? allClothes
    //       : wardrobe[getKeyForFilter(currentFilter) as keyof typeof wardrobe]
    //     )?.map((item: any) => (
    //       <ClothingItemCard
    //         key={item.id}
    //         item={item}
    //         category={getKeyForFilter(currentFilter)!}
    //       />
    //     ))}
    //   </div>
    // </div>
  );
}
