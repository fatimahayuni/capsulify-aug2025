import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";

type Props = {
  item: {
    id: number;
    image_file_name: string;
  };
  category: string;
};

type ClothingItemModalProps = {
  setIsEditing: (isEditing: boolean) => void;
};

const ClothingItemCard = (props: Props) => {
  const { item, category } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [showEditButton, setShowEditButton] = useState(false);

  function handleEdit() {
    setIsEditing(true);
  }

  return (
    <div
      key={item.id}
      className="flex flex-col items-center justify-center hover:translate-y-[-4px] hover:border-2 hover:border-black hover:shadow-lg w-[200px] transition-all duration-300 ease-in-out relative rounded-md bg-secondary "
      onMouseOver={() => setShowEditButton(true)}
      onMouseLeave={() => setShowEditButton(false)}
    >
      <div
        className={`absolute top-2 right-2 flex gap-2 ${
          showEditButton ? "" : "hidden"
        }`}
      >
        <FaEdit
          className="inventory-item-icon"
          onClick={() => {
            handleEdit();
          }}
        />
      </div>

      <div className="inventory-image-wrapper">
        <img
          src={`/assets/inverted-triangle/${item.image_file_name}`}
          alt={item.image_file_name}
          width={160}
          height={160}
          className="inventory-image"
        />
      </div>
      <p className="inventory-item-name">{item.id}</p>
      {isEditing && <ClothingItemModal setIsEditing={setIsEditing} />}
    </div>
  );
};

function ClothingItemModal({ setIsEditing }: ClothingItemModalProps) {
  return (
    <div className="w-full bg-gray-500 h-full top-0 left-0 fixed z-50">
      <div
        className={`max-w-md max-h-72 bg-primary top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] `}
      >
        ClothingItemModal
      </div>
    </div>
  );
}

export default ClothingItemCard;
