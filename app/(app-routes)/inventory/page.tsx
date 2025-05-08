"use client";
import { FaEdit } from "react-icons/fa";
import { CLOTHING_ITEMS } from "../../constants";
import { useState, useEffect, useRef } from "react";

function getVisibilityPercentage(rect: DOMRect): number {
  return (
    Math.min(Math.max(0, rect.bottom), window.innerHeight) -
    Math.max(0, rect.top)
  );
}

export default function InventoryPage() {
  const [bodyType, setBodyType] = useState<string | null>(null);
  const [inventory, setInventory] = useState<any>({});
  const [selectedCategory, setSelectedCategory] = useState<string>("tops");
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  useEffect(() => {
    const storedBodyType = sessionStorage.getItem("bodyType");
    if (storedBodyType) {
      setBodyType(storedBodyType);
    }
    const storedInventory =
      CLOTHING_ITEMS[
        storedBodyType
          ?.toUpperCase()
          .split(" ")
          .join("_") as keyof typeof CLOTHING_ITEMS
      ];
    setInventory(storedInventory);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      let maxVisibility = 0;
      let mostVisibleCategory = selectedCategory;

      Object.entries(categoryRefs.current).forEach(([category, element]) => {
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const visibility = getVisibilityPercentage(rect);

        if (visibility > maxVisibility) {
          maxVisibility = visibility;
          mostVisibleCategory = category;
        }
      });

      if (mostVisibleCategory !== selectedCategory) {
        setSelectedCategory(mostVisibleCategory);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [selectedCategory]);

  const handleCategoryClick = (category: any) => {
    setSelectedCategory(category);
    categoryRefs.current[category]?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="category-container ">
      <div className="category-tabs-container">
        <div className="flex gap-2 overflow-x-auto w-fit mx-auto hide-scrollbar">
          {inventory !== undefined &&
            Object.keys(inventory).map((category) => (
              <button
                key={category}
                className={`category-tab ${
                  selectedCategory === category ? "active" : ""
                }`}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </button>
            ))}
        </div>
      </div>
      <div className="mx-auto w-[80%] max-sm:w-full">
        {inventory !== undefined &&
          Object.keys(inventory).map((category) => (
            <div
              key={category}
              className="category-section"
              ref={(el) => {
                categoryRefs.current[category] = el;
              }}
            >
              <h2 className="inventory-category-title">
                {category.toUpperCase()}
              </h2>
              <div className="inventory-grid" id={category.toLowerCase()}>
                {inventory[category as keyof typeof inventory]?.map(
                  (item: any) => (
                    <div key={item.name} className="inventory-item">
                      <div className="inventory-item-icons top">
                        {/* <FaTrash
                          className="inventory-item-icon"
                          onClick={() => {}}
                        /> */}
                      </div>

                      <div className="inventory-item-icons top-right">
                        {/* <FaInfoCircle
                          className="inventory-item-icon"
                          onClick={() => {}}
                        /> */}
                        <FaEdit
                          className="inventory-item-icon"
                          onClick={() => {}}
                        />
                      </div>

                      <div className="inventory-image-wrapper">
                        <img
                          src={item.filename}
                          alt={item.name}
                          className="inventory-image"
                        />
                      </div>
                      <p className="inventory-item-name">{item.name}</p>
                    </div>
                  )
                )}
                <div className="inventory-item add-item" onClick={() => {}}>
                  <div className="plus-sign">+</div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
