"use client";

import React, { useEffect, useState } from "react";
import { getOutfits } from "./actions";
import { Outfit } from "./types";
import OutfitCard from "./components/OutfitCard";
import Filter from "./components/Filter";
import Pager from "./components/Pager";
import {
  getUserOutfitFavouriteKeys,
  OutfitFavourite,
} from "@/app/lib/database/outfit";
import { Category } from "@/app/constants/Category";
import { FaHeart, FaRegHeart } from "react-icons/fa";

type UploadedOutfit = {
  grouptype_id: number;
  items: Array<{ id: number; category_id: number; image_url: string }>;
};

const groupTitles: Record<number, string> = {
  1: "Top + Bottom + Layer + Bag + Shoes",
  2: "Dress + Layer + Bag + Shoes",
  3: "Top + Bottom + Bag + Shoes",
  4: "Dress + Bag + Shoes",
};

type TabType = "preloaded" | "uploaded";

export default function OutfitsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("preloaded");

  // Preloaded outfits state
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [filteredOutfits, setFilteredOutfits] = useState<Outfit[]>([]);
  const [favoriteKeys, setFavoriteKeys] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const outfitsPerPage = 20;

  // Uploaded outfits state
  const [uploadedOutfits, setUploadedOutfits] = useState<UploadedOutfit[]>([]);
  const [uploadedLoading, setUploadedLoading] = useState(true);
  const [uploadedFavoriteKeys, setUploadedFavoriteKeys] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const loadOutfits = async () => {
      setLoading(true);
      try {
        const [allOutfits, favKeys] = await Promise.all([
          getOutfits(),
          getUserOutfitFavouriteKeys(),
        ]);

        setOutfits(allOutfits || []);
        setFilteredOutfits(allOutfits || []);
        setFavoriteKeys(new Set(favKeys));
      } catch (error) {
        console.error("Error loading outfits:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOutfits();
  }, []);

  useEffect(() => {
    const loadUploadedOutfits = async () => {
      setUploadedLoading(true);
      try {
        const [outfitsRes, savedRes] = await Promise.all([
          fetch("/api/uploaded-outfits"),
          fetch("/api/save-uploaded-outfit"),
        ]);

        if (!outfitsRes.ok) {
          console.error("failed to fetch uploaded outfits");
          setUploadedOutfits([]);
          return;
        }
        const outfitsData = await outfitsRes.json();
        setUploadedOutfits(outfitsData.outfits || []);

        if (savedRes.ok) {
          const savedData = await savedRes.json();
          setUploadedFavoriteKeys(new Set(savedData.outfitKeys || []));
        }
      } finally {
        setUploadedLoading(false);
      }
    };

    loadUploadedOutfits();
  }, []);

  const handleFilterChange = (filteredItems: any[]) => {
    if (filteredItems.length === 0) {
      setFilteredOutfits(outfits);
    } else {
      const filteredOutfits = outfits.filter((outfit) => {
        return filteredItems.every((filterItem) => {
          return outfit.items.some(
            (outfitItem) =>
              outfitItem.clothing_variant_id === filterItem.clothing_variant_id
          );
        });
      });
      setFilteredOutfits(filteredOutfits);
    }
    setCurrentPage(1);
  };

  const handleFavoriteChange = (outfitKey: string, isFavorite: boolean) => {
    const newFavoriteKeys = new Set(favoriteKeys);
    if (isFavorite) {
      newFavoriteKeys.add(outfitKey);
    } else {
      newFavoriteKeys.delete(outfitKey);
    }
    setFavoriteKeys(newFavoriteKeys);
  };

  const handleUploadedFavoriteChange = async (
    outfitKey: string,
    isFavorite: boolean
  ) => {
    const newFavoriteKeys = new Set(uploadedFavoriteKeys);
    if (isFavorite) {
      newFavoriteKeys.add(outfitKey);
    } else {
      newFavoriteKeys.delete(outfitKey);
    }
    setUploadedFavoriteKeys(newFavoriteKeys);

    // Save to database
    try {
      await fetch("/api/save-uploaded-outfit", {
        method: isFavorite ? "POST" : "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ outfitKey }),
      });
    } catch (error) {
      console.error("Error saving uploaded outfit:", error);
    }
  };

  const getOutfitKey = (outfit: Outfit): string => {
    const outfitFav: OutfitFavourite = {
      top_variant_id: null,
      bottom_variant_id: null,
      dress_variant_id: null,
      layer_variant_id: null,
      bag_variant_id: null,
      shoe_variant_id: null,
    };

    outfit.items.forEach((item) => {
      switch (item.category_id) {
        case 1:
          outfitFav.top_variant_id = item.clothing_variant_id;
          break;
        case 2:
          outfitFav.bottom_variant_id = item.clothing_variant_id;
          break;
        case 3:
          outfitFav.dress_variant_id = item.clothing_variant_id;
          break;
        case 4:
          outfitFav.layer_variant_id = item.clothing_variant_id;
          break;
        case 5:
          outfitFav.bag_variant_id = item.clothing_variant_id;
          break;
        case 6:
          outfitFav.shoe_variant_id = item.clothing_variant_id;
          break;
      }
    });

    return [
      outfitFav.top_variant_id ?? 0,
      outfitFav.bottom_variant_id ?? 0,
      outfitFav.dress_variant_id ?? 0,
      outfitFav.layer_variant_id ?? 0,
      outfitFav.bag_variant_id ?? 0,
      outfitFav.shoe_variant_id ?? 0,
    ].join("-");
  };

  const getUploadedOutfitKey = (outfit: UploadedOutfit): string => {
    return outfit.items.map((item) => item.id).join("-");
  };

  const renderUploadedCard = (o: UploadedOutfit, idx: number) => {
    const outfitKey = getUploadedOutfitKey(o);
    const isFavorite = uploadedFavoriteKeys.has(outfitKey);

    return (
      <div
        key={idx}
        className="w-[360px] h-[270px] relative rounded-md bg-[#eee7e1] p-3 shadow mx-auto"
      >
        {/* Favorite Heart Icon */}
        <button
          aria-label="Favorite outfit"
          className="absolute top-2 right-2 text-[#4a3427] hover:scale-110 transition-all text-md rounded-full p-1 cursor-pointer z-[10]"
          onClick={() => handleUploadedFavoriteChange(outfitKey, !isFavorite)}
        >
          {isFavorite ? <FaHeart /> : <FaRegHeart />}
        </button>

        {o.items.map((it, j) => (
          <img
            key={j}
            src={it.image_url}
            alt={String(it.id)}
            className={getUploadedLayout(it.category_id)}
          />
        ))}
      </div>
    );
  };

  const getUploadedLayout = (cat: number) => {
    switch (cat) {
      case Category.Tops:
        return "absolute top-3 left-1/2 -translate-x-1/2 w-24 h-24 object-contain";
      case Category.Bottoms:
        return "absolute top-24 left-1/2 -translate-x-1/2 w-28 h-28 object-contain";
      case Category.Dresses:
        return "absolute top-0 left-0 w-full h-full object-contain";
      case Category.Layers:
        return "absolute top-2 right-3 w-20 h-20 object-contain";
      case Category.Bags:
        return "absolute top-1/2 left-2 -translate-y-1/2 w-12 h-12 object-contain";
      case Category.Shoes:
        return "absolute bottom-2 right-3 w-14 h-14 object-contain";
      default:
        return "absolute";
    }
  };

  const totalPages = Math.ceil(filteredOutfits.length / outfitsPerPage);
  const startIndex = (currentPage - 1) * outfitsPerPage;
  const endIndex = startIndex + outfitsPerPage;
  const currentOutfits = filteredOutfits.slice(startIndex, endIndex);

  if (loading && activeTab === "preloaded") {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-[#4a3427]">Loading outfits...</div>
      </div>
    );
  }

  if (uploadedLoading && activeTab === "uploaded") {
    return (
      <div className="text-center py-10 text-[#4a3427]">
        Loading uploaded outfits...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="flex bg-[#eee7e1] rounded-lg p-1">
          <button
            onClick={() => setActiveTab("preloaded")}
            className={`px-6 py-2 rounded-md transition-all ${
              activeTab === "preloaded"
                ? "bg-[#4a3427] text-white"
                : "text-[#4a3427] hover:bg-[#e6dbd0]"
            }`}
          >
            Preloaded Outfits
          </button>
          <button
            onClick={() => setActiveTab("uploaded")}
            className={`px-6 py-2 rounded-md transition-all ${
              activeTab === "uploaded"
                ? "bg-[#4a3427] text-white"
                : "text-[#4a3427] hover:bg-[#e6dbd0]"
            }`}
          >
            Uploaded Outfits
          </button>
        </div>
      </div>

      {activeTab === "preloaded" ? (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <div className="lg:w-80">
            <Filter onFilterChange={handleFilterChange} />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-[#4a3427] mb-2">
                Preloaded Outfits
              </h1>
              <p className="text-[#4a3427] text-sm">
                Showing {filteredOutfits.length} outfits
              </p>
            </div>

            {/* Outfits Grid */}
            {currentOutfits.length === 0 ? (
              <div className="text-center py-12 text-[#4a3427]">
                No outfits found. Try adjusting your filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {currentOutfits.map((outfit, index) => (
                  <div key={index} className="flex justify-center">
                    <OutfitCard
                      outfit={outfit}
                      favoriteKeys={favoriteKeys}
                      onFavoriteChange={handleFavoriteChange}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Pager
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-[#4a3427] mb-2">
              Uploaded Outfits
            </h1>
            <p className="text-[#4a3427] text-sm">
              Outfits generated from your uploaded capsule wardrobe
            </p>
          </div>

          {([1, 2, 3, 4] as number[]).map((g) => {
            const group = uploadedOutfits.filter((o) => o.grouptype_id === g);
            if (group.length === 0) return null;
            return (
              <div key={g} className="space-y-3">
                <h2 className="text-lg font-medium text-[#4a3427]">
                  {groupTitles[g]}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {group.map(renderUploadedCard)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
