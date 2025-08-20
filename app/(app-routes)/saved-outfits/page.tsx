"use client";

import React, { useEffect, useState } from "react";
import { getOutfits } from "../outfits/actions";
import { Outfit } from "../outfits/types";
import OutfitCard from "../outfits/components/OutfitCard";
import Filter from "../outfits/components/Filter";
import Pager from "../outfits/components/Pager";
import {
  getUserOutfitFavouriteKeys,
  OutfitFavourite,
} from "@/app/lib/database/outfit";

export default function SavedOutfitsPage() {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [filteredOutfits, setFilteredOutfits] = useState<Outfit[]>([]);
  const [favoriteKeys, setFavoriteKeys] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const outfitsPerPage = 20;

  useEffect(() => {
    const loadOutfits = async () => {
      setLoading(true);
      try {
        const [allOutfits, favKeys] = await Promise.all([
          getOutfits(),
          getUserOutfitFavouriteKeys(),
        ]);

        setOutfits(allOutfits || []);
        setFavoriteKeys(new Set(favKeys));

        // Filter to only show saved outfits
        const savedOutfits = (allOutfits || []).filter((outfit) => {
          const outfitKey = getOutfitKey(outfit);
          return favKeys.includes(outfitKey);
        });

        setFilteredOutfits(savedOutfits);
      } catch (error) {
        console.error("Error loading saved outfits:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOutfits();
  }, []);

  const handleFilterChange = (filteredItems: any[]) => {
    if (filteredItems.length === 0) {
      // Show all saved outfits
      const savedOutfits = outfits.filter((outfit) => {
        const outfitKey = getOutfitKey(outfit);
        return favoriteKeys.has(outfitKey);
      });
      setFilteredOutfits(savedOutfits);
    } else {
      const filteredOutfits = outfits.filter((outfit) => {
        // Must be saved AND match filter
        const outfitKey = getOutfitKey(outfit);
        const isSaved = favoriteKeys.has(outfitKey);
        const matchesFilter = filteredItems.every((filterItem) => {
          return outfit.items.some(
            (outfitItem) =>
              outfitItem.clothing_variant_id === filterItem.clothing_variant_id
          );
        });
        return isSaved && matchesFilter;
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
      // Remove from filtered list if unfavorited
      setFilteredOutfits((prev) =>
        prev.filter((outfit) => getOutfitKey(outfit) !== outfitKey)
      );
    }
    setFavoriteKeys(newFavoriteKeys);
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

  const totalPages = Math.ceil(filteredOutfits.length / outfitsPerPage);
  const startIndex = (currentPage - 1) * outfitsPerPage;
  const endIndex = startIndex + outfitsPerPage;
  const currentOutfits = filteredOutfits.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-[#4a3427]">Loading saved outfits...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filter Sidebar */}
        <div className="lg:w-80">
          <Filter onFilterChange={handleFilterChange} />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-[#4a3427] mb-2">
              Saved Preloaded Outfits
            </h1>
            <p className="text-[#4a3427] text-sm">
              Showing {filteredOutfits.length} saved outfits
            </p>
          </div>

          {/* Outfits Grid */}
          {currentOutfits.length === 0 ? (
            <div className="text-center py-12 text-[#4a3427]">
              No saved outfits found. Try saving some outfits from the main
              outfits page.
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
    </div>
  );
}
