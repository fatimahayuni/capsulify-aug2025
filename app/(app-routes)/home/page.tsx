"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Navbar from "@/app/components/Navbar";
import { FaHeart } from "react-icons/fa";
import CacheManager from "@/app/lib/CacheManager";
import {
  getUserOutfitFavouriteKeys,
  OutfitFavourite,
} from "@/app/lib/database/outfit";
import OutfitCard from "../outfits/components/OutfitCard";
import { Outfit } from "../outfits/types";
import { Category } from "@/app/constants/Category";
import { FaRegHeart } from "react-icons/fa";

type UploadedOutfit = {
  grouptype_id: number;
  items: Array<{ id: number; category_id: number; image_url: string }>;
};

export default function HomePage() {
  // get username from clerk
  const { user } = useUser();
  const [username, setUsername] = useState<string | null>(null);
  const [favoriteKeys, setFavoriteKeys] = useState<Set<string>>(new Set());
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [favoriteOutfits, setFavoriteOutfits] = useState<Outfit[]>([]);
  const [savedUploadedOutfits, setSavedUploadedOutfits] = useState<
    UploadedOutfit[]
  >([]);
  const [savedUploadedKeys, setSavedUploadedKeys] = useState<Set<string>>(
    new Set()
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      setIsLoading(true);
      try {
        const [
          allOutfits,
          favKeys,
          uploadedOutfitsData,
          savedUploadedKeysData,
        ] = await Promise.all([
          CacheManager.getUserOutfits(),
          getUserOutfitFavouriteKeys(),
          fetch("/api/uploaded-outfits").then((res) =>
            res.ok ? res.json() : { outfits: [] }
          ),
          fetch("/api/save-uploaded-outfit").then((res) =>
            res.ok ? res.json() : { outfitKeys: [] }
          ),
        ]);

        setOutfits(allOutfits || []);
        const favKeySet = new Set(favKeys);
        setFavoriteKeys(favKeySet);

        // Set uploaded outfits data
        const uploadedOutfits = uploadedOutfitsData.outfits || [];
        const savedUploadedKeySet = new Set(
          savedUploadedKeysData.outfitKeys || []
        );
        setSavedUploadedKeys(savedUploadedKeySet);

        if (allOutfits && favKeys) {
          const favs = allOutfits.filter((outfit: Outfit) => {
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
            const key = [
              outfitFav.top_variant_id ?? 0,
              outfitFav.bottom_variant_id ?? 0,
              outfitFav.dress_variant_id ?? 0,
              outfitFav.layer_variant_id ?? 0,
              outfitFav.bag_variant_id ?? 0,
              outfitFav.shoe_variant_id ?? 0,
            ].join("-");
            return favKeySet.has(key);
          });
          setFavoriteOutfits(favs);
        }

        // Filter saved uploaded outfits
        const savedUploaded = uploadedOutfits.filter(
          (outfit: UploadedOutfit) => {
            const outfitKey = outfit.items.map((item) => item.id).join("-");
            return savedUploadedKeySet.has(outfitKey);
          }
        );
        setSavedUploadedOutfits(savedUploaded);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFavorites();
  }, []);

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
    const newSavedKeys = new Set(savedUploadedKeys);
    if (isFavorite) {
      newSavedKeys.add(outfitKey);
    } else {
      newSavedKeys.delete(outfitKey);
    }
    setSavedUploadedKeys(newSavedKeys);

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

  const renderUploadedCard = (o: UploadedOutfit, idx: number) => {
    const outfitKey = o.items.map((item) => item.id).join("-");
    const isFavorite = savedUploadedKeys.has(outfitKey);

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

  return (
    <div className="bg-primary flex flex-col relative">
      <Navbar />
      <main className="flex-1 flex flex-col items-center px-4 pt-4 pb-32">
        <div className="w-full max-w-xs mx-auto text-center mt-2">
          <p className="text-[1rem] text-accent font-normal mb-1 text-left">
            Hi,{" "}
            <span className="font-bold capitalize">
              {username ? username : "---"}
            </span>
            <span>👋</span>{" "}
            <span className="text-[1.1rem] text-accent font-medium mb-4 text-left block leading-12">
              Welcome Back!
            </span>
          </p>

          <p className="text-[0.9rem] text-accent font-semibold mb-6 mt-6 text-left flex items-center gap-2">
            <FaHeart />
            Your Latest Favorites
          </p>
        </div>

        {/* Favorite Preloaded Outfits Section */}
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            Loading favorites...
          </div>
        ) : (
          <div className="w-full max-w-[1600px] mx-auto space-y-8">
            {/* Preloaded Outfits */}
            {favoriteOutfits.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-[#4a3427] text-center">
                  Saved Preloaded Outfits
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full">
                  {favoriteOutfits.map((outfit, idx) => (
                    <div key={idx} className="flex justify-center">
                      <OutfitCard
                        outfit={outfit}
                        favoriteKeys={favoriteKeys}
                        onFavoriteChange={handleFavoriteChange}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Uploaded Outfits */}
            {savedUploadedOutfits.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-[#4a3427] text-center">
                  Saved Uploaded Outfits
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
                  {savedUploadedOutfits.map((outfit, idx) => (
                    <div key={idx} className="flex justify-center">
                      {renderUploadedCard(outfit, idx)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No favorites message */}
            {favoriteOutfits.length === 0 &&
              savedUploadedOutfits.length === 0 && (
                <div className="text-accent text-center py-8">
                  No favorite outfits yet. Start saving outfits from the outfits
                  page!
                </div>
              )}
          </div>
        )}
      </main>
    </div>
  );
}
