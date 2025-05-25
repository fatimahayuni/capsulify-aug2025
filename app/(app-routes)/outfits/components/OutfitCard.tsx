type Props = {
  items: {
    //id: number;
    clothing_variant_id: number;
    category_id: number;
    subcategory_id: number;
    image_file_name: string;
  }[];
};

const OutfitCard = (props: Props) => {
  const { items } = props;

  return (
    <>
      <div
        className="flex flex-col items-center justify-center hover:translate-y-[-4px] hover:shadow-lg w-[400px] h-[300px] max-sm:w-[350px] max-sm:h-[280px] transition-all duration-300 ease-in-out relative rounded-md bg-secondary py-4 px-4"
      > 
        <div className="grid grid-cols-3 gap-2 w-full h-full">
          {items.map((item, index) => (
            <div key={`${item.clothing_variant_id}-${index}`} className="flex items-center justify-center">
              <img
                src={`/assets/inverted-triangle/${item.image_file_name}`}
                alt={item.image_file_name}
                className="inventory-image w-[80px] h-[80px] object-contain max-sm:w-[70px] max-sm:h-[70px]"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default OutfitCard;