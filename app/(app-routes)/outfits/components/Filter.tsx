"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { OutfitItem } from "../types";
import { getClothingItems } from "../actions";
import { Category } from "@/app/constants/Category";

interface FilterProps {
  onFilterChange: (filteredItems: OutfitItem[]) => void;
}

interface ClothingItemData {
  clothing_variant_id: number;
  category_id: number;
  subcategory_id: number;
  image_file_name: string;
}

const Filter = ({ onFilterChange }: FilterProps) => {
  const [selectedItems, setSelectedItems] = useState<OutfitItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableItems, setAvailableItems] = useState<ClothingItemData[]>([]);
  const [loading, setLoading] = useState(false);

  // Load available clothing items when modal opens
  useEffect(() => {
    if (isModalOpen && availableItems.length === 0) {
      loadClothingItems();
    }
  }, [isModalOpen]);

  // Notify parent component when filter changes
  useEffect(() => {
    onFilterChange(selectedItems);
  }, [selectedItems, onFilterChange]);

  const loadClothingItems = async () => {
    setLoading(true);
    try {
      // Check if items exist in localStorage first
      const storedItems = localStorage.getItem('clothingItems');
      
      if (storedItems) {
        setAvailableItems(JSON.parse(storedItems));
      } else {
        const items = await getClothingItems();
        if (items) {
          setAvailableItems(items);
          localStorage.setItem('clothingItems', JSON.stringify(items));
        }
      }
    } catch (error) {
      console.error('Error loading clothing items:', error);
    } finally {
      setLoading(false);
    }
  };

  const addItemToFilter = (item: ClothingItemData) => {
    const outfitItem: OutfitItem = {
      clothing_variant_id: item.clothing_variant_id,
      category_id: item.category_id,
      subcategory_id: item.subcategory_id,
      image_file_name: item.image_file_name,
    };

    // Check if item is already selected
    const isAlreadySelected = selectedItems.some(
      (selected) => selected.clothing_variant_id === item.clothing_variant_id
    );

    if (!isAlreadySelected) {
      setSelectedItems([...selectedItems, outfitItem]);
    }
  };

  const removeItemFromFilter = (itemId: number) => {
    setSelectedItems(selectedItems.filter(item => item.clothing_variant_id !== itemId));
  };

  const clearAllFilters = () => {
    setSelectedItems([]);
  };

  const getCategoryName = (categoryId: number) => {
    const categoryNames: { [key: number]: string } = {
      [Category.Tops]: 'Tops',
      [Category.Bottoms]: 'Bottoms',
      [Category.Dresses]: 'Dresses',
      [Category.Layers]: 'Layers',
      [Category.Bags]: 'Bags',
      [Category.Shoes]: 'Shoes',
    };
    return categoryNames[categoryId] || 'Unknown';
  };

  const groupItemsByCategory = () => {
    const grouped: { [key: number]: ClothingItemData[] } = {};
    availableItems.forEach(item => {
      if (!grouped[item.category_id]) {
        grouped[item.category_id] = [];
      }
      grouped[item.category_id].push(item);
    });
    return grouped;
  };

  // Simple Filter Icons matching the original design
  const FilterPlusIcon = ({ size = 16, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      {/* Simple funnel shape */}
      <path
        d="M2 2h12l-4 4v6l-4-2V6L2 2z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Small plus in top right */}
      <path d="M12 1v2M11 2h2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );

  const FilterXIcon = ({ size = 16, className = "", dimmed = false }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      {/* Simple funnel shape */}
      <path
        d="M2 2h12l-4 4v6l-4-2V6L2 2z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        opacity={dimmed ? 0.3 : 1}
      />
      {/* Small X in top right */}
      <path 
        d="M11.5 0.5l1 1M12.5 0.5l-1 1" 
        stroke="currentColor" 
        strokeWidth="1" 
        strokeLinecap="round"
        opacity={dimmed ? 0.3 : 1}
      />
    </svg>
  );

  return (
    <>
      {/* Filter Bar */}
      <div className="sticky top-0 z-20 bg-primary border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3 max-w-6xl mx-auto">
          {/* Add Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          >
            <FilterPlusIcon size={16} className="text-gray-600" />
          </button>

          {/* Selected Items */}
          <div className="flex items-center gap-2 flex-1 overflow-x-auto">
            {selectedItems.map((item) => (
              <div
                key={item.clothing_variant_id}
                className="relative flex-shrink-0 w-12 h-12 bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:border-gray-300 transition-colors"
                onClick={() => removeItemFromFilter(item.clothing_variant_id)}
              >
                <img
                  src={`/assets/inverted-triangle/${item.image_file_name}`}
                  alt="Selected clothing item"
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all" />
              </div>
            ))}
          </div>

          {/* Clear All Button */}
          <button
            onClick={clearAllFilters}
            className={`flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full transition-colors ${
              selectedItems.length > 0 ? 'hover:bg-gray-200 cursor-pointer' : 'cursor-not-allowed'
            }`}
            disabled={selectedItems.length === 0}
          >
            <FilterXIcon 
              size={16} 
              className="text-gray-600" 
              dimmed={selectedItems.length === 0}
            />
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-10"
            onClick={() => setIsModalOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-lg shadow-xl max-w-4xl max-h-[80vh] w-full mx-4 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Add Clothing Items</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X size={16} className="text-gray-600" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto max-h-[calc(80vh-120px)]">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-gray-500">Loading clothing items...</div>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(groupItemsByCategory()).map(([categoryId, items]) => (
                    <div key={categoryId}>
                      <h3 className="text-md font-medium text-gray-900 mb-3">
                        {getCategoryName(Number(categoryId))}
                      </h3>
                      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3">
                        {items.map((item) => {
                          const isSelected = selectedItems.some(
                            (selected) => selected.clothing_variant_id === item.clothing_variant_id
                          );
                          return (
                            <div
                              key={item.clothing_variant_id}
                              className={`relative w-16 h-16 bg-white rounded-lg border-2 overflow-hidden cursor-pointer transition-all ${
                                isSelected
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              onClick={() => addItemToFilter(item)}
                            >
                              <img
                                src={`/assets/inverted-triangle/${item.image_file_name}`}
                                alt="Clothing item"
                                className="w-full h-full object-contain"
                              />
                              {isSelected && (
                                <div className="absolute inset-0 bg-blue-500 bg-opacity-20" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Filter;
