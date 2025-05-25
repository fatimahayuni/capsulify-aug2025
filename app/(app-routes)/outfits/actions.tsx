"use server";

import { Category } from "@/app/constants/Category";
import { getUserClothingItems } from "@/app/lib/database/outfits";
import { OutfitGroupType, OutfitItem, Outfit } from "./types";

// getOutfits returns all unique outfits for a user.
export async function getOutfits() {

  // Load clothing items from db.
  const clothingItems = await getUserClothingItems();
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
  
  // Shuffle the outfits array randomly
  for (let i = outfits.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [outfits[i], outfits[j]] = [outfits[j], outfits[i]];
  }
  
  return outfits;
}
