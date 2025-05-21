import React, { useEffect, useState } from "react";
import {
  clothingItemNameBuilder,
  EDIT_OPTIONS,
  toTitleCase,
} from "../constants/utils";
import {
  getClothingVariantId,
  saveClothingVariantId,
} from "../lib/actions/clothingItems.actions";
import { getUserByClerkId } from "../lib/actions/user.actions";
import { useAuth } from "@clerk/nextjs";
import { Edit3Icon } from "lucide-react";
import { BsInfo } from "react-icons/bs";

type Props = {
  item: {
    id: number;
    subcategory_id: number;
    image_file_name: string;
    top_sleeve_type_id: number | null;
    blouse_sleeve_type_id: number | null;
    neckline_id: number | null;
    dress_cut_id: number | null;
    bottom_cut_id: number | null;
    short_cut_id: number | null;
    skirt_cut_id: number | null;
    clothing_variant_id: number;
    colour_type_id: number;
    name: string;
  };
  category: string;
};

type ClothingItemModalProps = {
  setIsEditing: (isEditing: boolean) => void;
  item: Props["item"];
  onSaveImage: (newImage: string) => void;
  onSaveName: (newName: string) => void;
};

const ClothingItemCard = (props: Props) => {
  const { item, category } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [showEditButton, setShowEditButton] = useState(false);
  const [currentImage, setCurrentImage] = useState(item.image_file_name);
  const [currentName, setCurrentName] = useState(item.name);

  const handleEdit = () => setIsEditing(true);

  const handleSaveImage = (newImage: string) => {
    setCurrentImage(newImage);
    setIsEditing(false);
  };

  const handleSaveName = (newName: string) => {
    setCurrentName(newName);
    setIsEditing(false);
  };

  return (
    <>
      <div
        key={item.id}
        className="flex flex-col items-center justify-center hover:translate-y-[-4px] hover:shadow-lg w-[200px] h-[210px] max-sm:w-[175px] max-sm:h-[175px] transition-all duration-300 ease-in-out relative rounded-md bg-secondary py-2"
        onMouseOver={() => setShowEditButton(true)}
        onMouseLeave={() => setShowEditButton(false)}
      >
        <div
          className={`absolute top-2 right-2 flex gap-2 ${
            showEditButton ? "" : "hidden"
          } max-sm:flex`}
        >
          <div className="flex gap-2">
            <BsInfo className="inventory-item-icon w-5 h-5 rounded-full bg-[#4a342727]" />
            <Edit3Icon
              className="inventory-item-icon w-5 h-5 rounded-full bg-[#4a342727]"
              onClick={handleEdit}
            />
          </div>
        </div>

        <div className="inventory-image-wrapper ">
          <img
            src={`/assets/inverted-triangle/${currentImage}`}
            alt={currentImage}
            className="inventory-image w-[135px] h-[135px] object-contain max-sm:w-[120px] max-sm:h-[120px]"
          />
        </div>
        <p className="inventory-item-name mb-1">{currentName}</p>
      </div>
      {isEditing && (
        <ClothingItemModal
          setIsEditing={setIsEditing}
          item={item}
          onSaveImage={handleSaveImage}
          onSaveName={handleSaveName}
        />
      )}
    </>
  );
};

function ClothingItemModal({
  setIsEditing,
  item,
  onSaveImage,
  onSaveName,
}: ClothingItemModalProps) {
  const { userId: clerkId } = useAuth();

  const [options, setOptions] = useState({
    top_sleeve_type_id: item.top_sleeve_type_id,
    blouse_sleeve_type_id: item.blouse_sleeve_type_id,
    neckline_id: item.neckline_id,
    dress_cut_id: item.dress_cut_id,
    bottom_cut_id: item.bottom_cut_id,
    short_cut_id: item.short_cut_id,
    skirt_cut_id: item.skirt_cut_id,
  });

  const [image, setImage] = useState(item.image_file_name);
  const [name, setName] = useState(item.name);
  const [clothingVariantId, setClothingVariantId] = useState(
    item.clothing_variant_id
  );
  const prevClothingVariantId = item.clothing_variant_id;

  useEffect(() => {
    const fetchVariant = async () => {
      const result = await getClothingVariantId({
        ...options,
        colour_type_id: item.colour_type_id,
      });
      setImage(result.image_file_name);
      setName(result.name);
      setClothingVariantId(result.id);
    };

    fetchVariant();
  }, [options]);

  const handleSave = async () => {
    const user = await getUserByClerkId(clerkId!);
    await saveClothingVariantId(
      Number(user.id),
      clothingVariantId,
      prevClothingVariantId
    );
    onSaveImage(image); // Update the parent with new image
    onSaveName(name);
  };

  //@ts-ignore
  const editOptions = EDIT_OPTIONS[item.subcategory_id];
  const [activeClass, setActiveClass] = useState(Object.keys(editOptions)[0]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-primary w-[350px] h-[600px] rounded-lg shadow-lg relative overflow-y-auto">
        <button
          onClick={() => setIsEditing(false)}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center  text-amber-950 rounded-full  hover:scale-120 transition-transform duration-200 cursor-pointer"
        >
          ✕
        </button>

        <div className="flex flex-col items-center justify-start p-4 ">
          <div className="w-full h-40 flex justify-center items-center mt-8 mb-2">
            {/* Item Image */}
            <img
              src={`/assets/inverted-triangle/${image}`}
              alt={image}
              className="w-[135px] h-[135px] object-contain"
            />
          </div>
          <p className="text-accent text-sm font-semibold uppercase tracking-wider text-center">
            {/* Item Name */}
            {name}
          </p>
        </div>

        <div className="p-2 mt-4">
          <div className="flex items-center justify-center font-semibold text-sm gap-2">
            {Object.keys(editOptions).map((key) => (
              <div
                key={key}
                className={`px-4 py-2 cursor-pointer ${
                  activeClass === key ? "border-b-2 border-b-amber-900" : ""
                }`}
                onClick={() => setActiveClass(key)}
              >
                {toTitleCase(key)}
              </div>
            ))}
          </div>
          {
            // @ts-ignore
            Object.entries(EDIT_OPTIONS[item.subcategory_id]).map(
              ([key, value]) => (
                <div
                  key={key}
                  className={
                    activeClass === key
                      ? "flex flex-col items-start mb-4"
                      : "hidden"
                  }
                >
                  <div className="flex flex-col items-start justify-center text-sm w-fit mx-10 mt-4">
                    {/* @ts-ignore */}
                    {value.options.map(
                      (option: { id: number; name: string }) => (
                        <label
                          key={option.id}
                          className="flex items-center space-x-2 mb-2 text-[#4b3621] font-medium"
                        >
                          <input
                            type="radio"
                            // @ts-ignore
                            name={value.name}
                            value={option.id}
                            // @ts-ignore
                            checked={options[value.name] === option.id}
                            onChange={() =>
                              setOptions((prev) => ({
                                ...prev,
                                // @ts-ignore
                                [value.name]: option.id,
                              }))
                            }
                            className="appearance-none w-4 h-4 border-2 border-[#4b3621] rounded-full checked:bg-[#4b3621] checked:border-[#4b3621] transition-colors duration-200"
                          />
                          <span>{option.name}</span>
                        </label>
                      )
                    )}
                  </div>
                </div>
              )
            )
          }
        </div>

        <div className="flex justify-end mt-4 text-sm px-4 mr-4">
          <button
            onClick={handleSave}
            className="bg-accent text-white px-6 py-2 rounded-md shadow-md hover:scale-105 transition-transform duration-200"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default ClothingItemCard;
