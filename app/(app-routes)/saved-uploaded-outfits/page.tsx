"use client";

import React, { useEffect, useState } from "react";
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

export default function SavedUploadedOutfitsPage() {
  const [uploadedOutfits, setUploadedOutfits] = useState<UploadedOutfit[]>([]);
  const [savedOutfits, setSavedOutfits] = useState<UploadedOutfit[]>([]);
  const [savedKeys, setSavedKeys] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSavedOutfits = async () => {
      setLoading(true);
      try {
        // Load all uploaded outfits
        const outfitsRes = await fetch("/api/uploaded-outfits");
        if (!outfitsRes.ok) {
          console.error("failed to fetch uploaded outfits");
          setUploadedOutfits([]);
          return;
        }
        const outfitsData = await outfitsRes.json();
        const allOutfits = outfitsData.outfits || [];

        // Load saved outfit keys
        const savedRes = await fetch("/api/save-uploaded-outfit");
        if (!savedRes.ok) {
          console.error("failed to fetch saved outfits");
          setSavedKeys(new Set());
        } else {
          const savedData = await savedRes.json();
          setSavedKeys(new Set(savedData.outfitKeys || []));
        }

        setUploadedOutfits(allOutfits);

        // Filter to only show saved outfits
        const saved = allOutfits.filter((outfit: UploadedOutfit) => {
          const outfitKey = getUploadedOutfitKey(outfit);
          return savedKeys.has(outfitKey);
        });
        setSavedOutfits(saved);
      } finally {
        setLoading(false);
      }
    };

    loadSavedOutfits();
  }, []);

  const handleFavoriteChange = async (
    outfitKey: string,
    isFavorite: boolean
  ) => {
    const newSavedKeys = new Set(savedKeys);
    if (isFavorite) {
      newSavedKeys.add(outfitKey);
    } else {
      newSavedKeys.delete(outfitKey);
      // Remove from saved list if unfavorited
      setSavedOutfits((prev) =>
        prev.filter((outfit) => getUploadedOutfitKey(outfit) !== outfitKey)
      );
    }
    setSavedKeys(newSavedKeys);

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

  const getUploadedOutfitKey = (outfit: UploadedOutfit): string => {
    return outfit.items.map((item) => item.id).join("-");
  };

  const renderCard = (o: UploadedOutfit, idx: number) => {
    const outfitKey = getUploadedOutfitKey(o);
    const isFavorite = savedKeys.has(outfitKey);

    return (
      <div
        key={idx}
        className="w-[360px] h-[270px] relative rounded-md bg-[#eee7e1] p-3 shadow mx-auto"
      >
        {/* Favorite Heart Icon */}
        <button
          aria-label="Favorite outfit"
          className="absolute top-2 right-2 text-[#4a3427] hover:scale-110 transition-all text-md rounded-full p-1 cursor-pointer z-[10]"
          onClick={() => handleFavoriteChange(outfitKey, !isFavorite)}
        >
          {isFavorite ? <FaHeart /> : <FaRegHeart />}
        </button>

        {o.items.map((it, j) => (
          <img
            key={j}
            src={it.image_url}
            alt={String(it.id)}
            className={getLayout(it.category_id)}
          />
        ))}
      </div>
    );
  };

  const getLayout = (cat: number) => {
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

  if (loading) {
    return (
      <div className="text-center py-10 text-[#4a3427]">
        Loading saved uploaded outfits...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#4a3427] mb-2">
          Saved Uploaded Outfits
        </h1>
        <p className="text-[#4a3427] text-sm">
          Your favorite outfits from your uploaded capsule wardrobe
        </p>
      </div>

      {savedOutfits.length === 0 ? (
        <div className="text-center py-12 text-[#4a3427]">
          No saved uploaded outfits found. Try saving some outfits from the
          uploaded outfits tab.
        </div>
      ) : (
        ([1, 2, 3, 4] as number[]).map((g) => {
          const group = savedOutfits.filter((o) => o.grouptype_id === g);
          if (group.length === 0) return null;
          return (
            <div key={g} className="space-y-3">
              <h2 className="text-lg font-medium text-[#4a3427]">
                {groupTitles[g]}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {group.map(renderCard)}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
