export enum OutfitGroupType {
  TopBottomLayerBagShoes = 1,
  DressLayerBagShoes = 2,
  TopBottomBagShoes = 3,
  DressBagShoes = 4
}

export interface OutfitItem {
  clothing_variant_id: number;
  category_id: number;
  subcategory_id: number;
  image_file_name: string;
}

export interface Outfit {
  // This tells us what type of outfit it is, such as
  // is it a "Top, Bottom, Layer, Bag, Shoes" outfit or a "Dress, Layer, Bag, Shoes" outfit etc.
  grouptype_id: OutfitGroupType;
  items: OutfitItem[];
}