import { SubCategory } from "@/app/constants/SubCategory";
import { Category } from "@/app/constants/Category";
import { Outfit, OutfitGroupType, OutfitItem } from "../types";
import { useEffect } from "react";

type Props = {
  outfit: Outfit;
};

const OutfitCard = (props: Props) => {
  const { outfit } = props;

  // Group type flags.
  const isTopBottomLayerBagShoes = outfit.grouptype_id === OutfitGroupType.TopBottomLayerBagShoes;
  const isDressLayerBagShoes = outfit.grouptype_id === OutfitGroupType.DressLayerBagShoes;
  const isTopBottomBagShoes = outfit.grouptype_id === OutfitGroupType.TopBottomBagShoes;
  const isDressBagShoes = outfit.grouptype_id === OutfitGroupType.DressBagShoes;
  
  // Subcategory flags.
  const isTopBottomBagShoes_WithSkirt = outfit.items.some(item => (item.subcategory_id === SubCategory.CasualSkirt || item.subcategory_id === SubCategory.TailoredSkirt)) &&
  outfit.grouptype_id === OutfitGroupType.TopBottomBagShoes;
  
  const isTopBottomBagShoes_WithShorts = outfit.items.some(item => item.subcategory_id === SubCategory.CasualShorts) &&
    outfit.grouptype_id === OutfitGroupType.TopBottomBagShoes;

  const isTopBottomLayerBagShoes_WithShorts = outfit.items.some(item => item.subcategory_id === SubCategory.CasualShorts) &&
    outfit.grouptype_id === OutfitGroupType.TopBottomLayerBagShoes;

  const isTopBottomLayerBagShoes_WithSkirt = outfit.items.some(item => (item.subcategory_id === SubCategory.CasualSkirt || item.subcategory_id === SubCategory.TailoredSkirt)) &&
    outfit.grouptype_id === OutfitGroupType.TopBottomLayerBagShoes;

  const getItemLayoutClasses = (item: OutfitItem) => {

    const defaultBags = "absolute top-1/2 left-1 w-12 h-12 z-[1] -translate-y-1/2";
    const defaultShoes = "absolute bottom-1 right-4 w-10 h-10 z-[1]";
    const defaultLayers = "absolute top-4 right-3 w-20 h-20 z-[2]";

    if (isTopBottomBagShoes) {
      if (isTopBottomBagShoes_WithShorts) {
        switch (item.category_id) {
          case Category.Tops:
            return "absolute top-1/10 left-1/2 -translate-x-[calc(50%+1px)] w-25 h-25 z-[3]";
          case Category.Bottoms:
            return "absolute top-4/10 left-1/2 -translate-x-[calc(50%+2px)] w-18 h-18 z-[4]";
          case Category.Bags:
            return defaultBags;
          case Category.Shoes:
            return defaultShoes;
        }
      }
      else if (isTopBottomBagShoes_WithSkirt) {
        switch (item.category_id) {
          case Category.Tops:
            return "absolute top-1/10 left-1/2 -translate-x-[calc(50%+1px)] w-25 h-25 z-[3]";
          case Category.Bottoms:
            return "absolute top-4/10 left-1/2 -translate-x-[calc(50%+1px)] w-22 h-22 z-[4]";
          case Category.Bags:
            return defaultBags;
          case Category.Shoes:
            return defaultShoes;
        }
      }
      else {
        // Other bottom types such as Pants, Jeans.
        switch (item.category_id) {
          case Category.Tops:
            return "absolute top-4 left-1/2 -translate-x-1/2 w-20 h-20 z-[3]";
          case Category.Bottoms:
            return "absolute top-3/10 left-1/2 -translate-x-[calc(50%+1px)] w-35 h-35 z-[4]";
          case Category.Bags:
            return defaultBags;
          case Category.Shoes:
            return defaultShoes;
        }
      }
    }

    if (isTopBottomLayerBagShoes) {
      if (isTopBottomLayerBagShoes_WithShorts) {
        switch (item.category_id) {
          case Category.Tops:
            return "absolute top-1/10 left-1/2 -translate-x-[calc(50%+1px)] w-25 h-25 z-[3]";
          case Category.Bottoms:
            return "absolute top-4/10 left-1/2 -translate-x-[calc(50%+3px)] w-18 h-18 z-[4]";
          case Category.Layers:
              return defaultLayers;
          case Category.Bags:
            return defaultBags;
          case Category.Shoes:
            return defaultShoes;
        }
      }
      else if (isTopBottomLayerBagShoes_WithSkirt) {
        switch (item.category_id) {
          case Category.Tops:
            return "absolute top-1/10 left-1/2 -translate-x-[calc(50%+1px)] w-22 h-22 z-[3]";
          case Category.Bottoms:
            return "absolute top-4/11 left-1/2 -translate-x-[calc(50%+2px)] w-26 h-26 z-[4]";
          case Category.Layers:
            return "absolute top-4 right-3 w-18 h-18 z-[2]";
          case Category.Bags:
            return defaultBags;
          case Category.Shoes:
            return defaultShoes;
        }
      }
      else {
        // Other bottom types such as Pants, Jeans.
        switch (item.category_id) {
          case Category.Tops:
            return "absolute top-4 left-1/2 -translate-x-1/2 w-20 h-20 z-[3]";
          case Category.Bottoms:
            return "absolute top-3/10 left-1/2 -translate-x-[calc(50%+1px)] w-35 h-35 z-[4]";
          case Category.Layers:
              return defaultLayers;
          case Category.Bags:
            return defaultBags;
          case Category.Shoes:
            return defaultShoes;
        }
      }
    }

    if (isDressLayerBagShoes) {
      switch (item.category_id) {
        case Category.Dresses:
          return "absolute top-0 left-0 w-full h-full z-[3]";
        case Category.Layers:
            return defaultLayers;
        case Category.Bags:
          return defaultBags;
        case Category.Shoes:
          return defaultShoes;
      }
    }

    if (isDressBagShoes) {
      switch (item.category_id) {
        case Category.Dresses:
          return "absolute top-0 left-0 w-full h-full z-[3]";
        case Category.Bags:
          return defaultBags;
        case Category.Shoes:
          return defaultShoes;
      }
    }

    console.log("No match found for item!");
    return "";
  };

  return (
    <div
      className="w-[400px] h-[300px] max-sm:w-[170px] max-sm:h-[200px] transition-all duration-300 ease-in-out relative rounded-md bg-secondary py-4 px-4"
    > 
        {outfit.items.map((item, index) => {
          const classes = getItemLayoutClasses(item);
          return (
            <div key={`${item.clothing_variant_id}-${index}`} className={classes}>
              <img
                src={`/assets/inverted-triangle/${item.image_file_name}`}
                alt={item.image_file_name}
                className='w-full h-full object-contain'
              />
            </div>
          );
        })}

    </div>
  );
};

export default OutfitCard;