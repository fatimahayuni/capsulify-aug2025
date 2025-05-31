"use server";

import { Category } from "@/app/constants/Category";
import { getUserClothingVariants } from "@/app/lib/database/userdata";
import { OutfitGroupType, Outfit } from "./types";

// getUserClotheItems returns all clothing items for a user.
export async function getUserClotheItems() {
  const clothingItems = await getUserClothingVariants();
  return clothingItems;
}

// getOutfits returns all unique outfits for a user.
export async function getOutfits() {

  // Load clothing items from db.
  const clothingItems = await getUserClothingVariants();
  if (!clothingItems) {
    console.log("No clothing items found");
    return null;
  }

  // Generate outfits.
  const outfits: Outfit[] = [];

  // Helper function to get items by category.
  const getItemsByCategory = (categoryId: number) => {
    return clothingItems.filter(item => item.category_id === categoryId);
  };

  // Get all items by category.
  const tops = getItemsByCategory(Category.Tops);
  const bottoms = getItemsByCategory(Category.Bottoms);
  const dresses = getItemsByCategory(Category.Dresses);
  const layers = getItemsByCategory(Category.Layers);
  const bags = getItemsByCategory(Category.Bags);
  const shoes = getItemsByCategory(Category.Shoes);

  // Generate combinations for Top, Bottom, Layer, Bag, Shoes
  for (const top of tops) {
    for (const bottom of bottoms) {
      for (const layer of layers) {
        for (const bag of bags) {
          for (const shoe of shoes) {
            outfits.push({
              items: [top, bottom, layer, bag, shoe],
              grouptype_id: OutfitGroupType.TopBottomLayerBagShoes
            });
          }
        }
      }
    }
  }

  // Generate combinations for Dress, Layer, Bag, Shoes
  for (const dress of dresses) {
    for (const layer of layers) {
      for (const bag of bags) {
        for (const shoe of shoes) {
          outfits.push({
            items: [dress, layer, bag, shoe],
            grouptype_id: OutfitGroupType.DressLayerBagShoes
          });
        }
      }
    }
  }

  // Generate combinations for Top, Bottom, Bag, Shoes
  for (const top of tops) {
    for (const bottom of bottoms) {
      for (const bag of bags) {
        for (const shoe of shoes) {
          outfits.push({
            items: [top, bottom, bag, shoe],
            grouptype_id: OutfitGroupType.TopBottomBagShoes
          });
        }
      }
    }
  }

  // Generate combinations for Dress, Bag, Shoes
  for (const dress of dresses) {
    for (const bag of bags) {
      for (const shoe of shoes) {
        outfits.push({
          items: [dress, bag, shoe],
          grouptype_id: OutfitGroupType.DressBagShoes
        });
      }
    }
  }

  console.log("Outfits generated: ", outfits.length);
  
  // Group outfits by their group type
  const outfitGroups: { [key: number]: Outfit[] } = {};
  for (const outfit of outfits) {
    if (!outfitGroups[outfit.grouptype_id]) {
      outfitGroups[outfit.grouptype_id] = [];
    }
    outfitGroups[outfit.grouptype_id].push(outfit);
  }

  // Shuffle each group separately with a fixed seed
  const seed = 1;
  const random = createSeededRandom(seed);
  
  for (const groupTypeId in outfitGroups) {
    const group = outfitGroups[groupTypeId];
    // Reset random state for consistent shuffling across groups
    const groupRandom = createSeededRandom(seed + parseInt(groupTypeId));
    for (let i = group.length - 1; i > 0; i--) {
      const j = Math.floor(groupRandom() * (i + 1));
      [group[i], group[j]] = [group[j], group[i]];
    }
  }

  // Interleave the groups in order: A, B, C, D, A, B, C, D, etc.
  const interleavedOutfits: Outfit[] = [];
  const groupTypes = Object.keys(outfitGroups).map(Number).sort();
  const maxGroupSize = Math.max(...Object.values(outfitGroups).map(group => group.length));
  
  for (let i = 0; i < maxGroupSize; i++) {
    for (const groupTypeId of groupTypes) {
      const group = outfitGroups[groupTypeId];
      if (i < group.length) {
        interleavedOutfits.push(group[i]);
      }
    }
  }

  // TODO: If user changes clothes, remove from local storage and trigger regenerate using user flag.
  
  return interleavedOutfits;
}

// Simple seeded random number generator (Linear Congruential Generator)
function createSeededRandom(seed: number) {
  let state = seed;
  return function() {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}


