export const getBodyTypeDescription = (type: string) => {
  switch (type) {
    case "Inverted Triangle":
      return {
        description:
          "we'll guide you toward styles that balance your silhouette—softening your shoulders and adding volume to your lower half for a harmonious, flowing look.",
        recommendations:
          "7 Tops · 7 Bottoms · 2 Dresses · 4 Layers · 3 Bags · 6 Shoes",
        benefits:
          "each chosen to create balance, draw the eye downward, and bring effortless femininity to your wardrobe.",
      };
    case "Rectangle":
      return {
        description:
          "we'll help you bring dimension and softness to your naturally sleek silhouette—creating curves where you want them, and ease where you need it.",
        recommendations:
          "7 Tops · 7 Bottoms · 2 Dresses · 4 Layers · 3 Bags · 6 Shoes",
        benefits:
          "crafted to bring subtle structure, femininity, and versatility",
      };
    case "Apple":
      return {
        description:
          "we'll focus on styles that elongate your frame and define your shape—so you feel confident, light, and radiant in every outfit.",
        recommendations:
          "7 Tops · 7 Bottoms · 2 Dresses · 4 Layers · 3 Bags · 6 Shoes",
        benefits:
          "chosen to flatter your proportions and highlight your best features.",
      };
    case "Pear":
      return {
        description:
          "we'll show you how to balance your silhouette by drawing attention upward and enhancing your waist—while honoring your beautiful curves.",
        recommendations:
          "7 Tops · 7 Bottoms · 2 Dresses · 4 Layers · 3 Bags · 6 Shoes",
        benefits:
          "that bring harmony, confidence, and quiet magnetism to your wardrobe.",
      };
    case "Hourglass":
      return {
        description:
          "we'll help you celebrate your balanced curves with timeless pieces that define your waist and enhance your natural symmetry.",
        recommendations:
          "7 Tops · 7 Bottoms · 2 Dresses · 4 Layers · 3 Bags · 6 Shoes",
        benefits: "chosen to elevate your shape with elegance and ease.",
      };
    default:
      return {
        description: "",
        recommendations: "",
        benefits: "",
      };
  }
};

export const getOutfits = (bodyType: string) => {
  switch (bodyType.toLowerCase()) {
    case "apple":
      return [
        {
          id: 1,
          event: "Casual",
          image:
            "/assets/images/clothing-variations/apple/event-outfits/casual/applecasual.png",
        },
        {
          id: 2,
          event: "Date Night",
          image:
            "/assets/images/clothing-variations/apple/event-outfits/date-night/appledate.png",
        },
        {
          id: 3,
          event: "Formal",
          image:
            "/assets/images/clothing-variations/apple/event-outfits/formal/appleformal.png",
        },
        {
          id: 4,
          event: "Semi-Casual",
          image:
            "/assets/images/clothing-variations/apple/event-outfits/semi-casual/applesemicasual.png",
        },
      ];
    case "hourglass":
      return [
        {
          id: 1,
          event: "Casual",
          image:
            "/assets/images/clothing-variations/hourglass/event-outfits/casual/hourglasscasual.png",
        },
        {
          id: 2,
          event: "Date Night",
          image:
            "/assets/images/clothing-variations/hourglass/event-outfits/date-night/hourglassdate.png",
        },
        {
          id: 3,
          event: "Formal",
          image:
            "/assets/images/clothing-variations/hourglass/event-outfits/formal/hourglassformal.png",
        },
        {
          id: 4,
          event: "Semi-Casual",
          image:
            "/assets/images/clothing-variations/hourglass/event-outfits/semi-casual/hourglasssemicasual.png",
        },
      ];
    case "inverted triangle":
      return [
        {
          id: 1,
          event: "Casual",
          image:
            "/assets/images/clothing-variations/inverted-triangle/event-outfits/casual/invertedtrianglecasual.png",
        },
        {
          id: 2,
          event: "Date Night",
          image:
            "/assets/images/clothing-variations/inverted-triangle/event-outfits/date-night/invertedtriangledate.png",
        },
        {
          id: 3,
          event: "Formal",
          image:
            "/assets/images/clothing-variations/inverted-triangle/event-outfits/formal/invertedtriangleformal.png",
        },
        {
          id: 4,
          event: "Semi-Casual",
          image:
            "/assets/images/clothing-variations/inverted-triangle/event-outfits/semi-casual/invertedtrianglesemicasual.png",
        },
      ];
    case "pear":
      return [
        {
          id: 1,
          event: "Casual",
          image:
            "/assets/images/clothing-variations/pear/event-outfits/casual/pearcasual.png",
        },
        {
          id: 2,
          event: "Date Night",
          image:
            "/assets/images/clothing-variations/pear/event-outfits/date-night/peardate.png",
        },
        {
          id: 3,
          event: "Formal",
          image:
            "/assets/images/clothing-variations/pear/event-outfits/formal/pearformal.png",
        },
        {
          id: 4,
          event: "Semi-Casual",
          image:
            "/assets/images/clothing-variations/pear/event-outfits/semi-casual/pearsemicasual.png",
        },
      ];
    case "rectangle":
      return [
        {
          id: 1,
          event: "Casual",
          image:
            "/assets/images/clothing-variations/rectangle/event-outfits/casual/rectanglecasual.png",
        },
        {
          id: 2,
          event: "Date Night",
          image:
            "/assets/images/clothing-variations/rectangle/event-outfits/date-night/rectangledate.png",
        },
        {
          id: 3,
          event: "Formal",
          image:
            "/assets/images/clothing-variations/rectangle/event-outfits/formal/rectangleformal.png",
        },
        {
          id: 4,
          event: "Semi-Casual",
          image:
            "/assets/images/clothing-variations/rectangle/event-outfits/semi-casual/rectanglesemicasual.png",
        },
      ];
    default:
      return [];
  }
};

export const toTitleCase = (text: string) => {
  return (text.charAt(0).toUpperCase() + text.slice(1).toLowerCase())
    .trim()
    .split("_")
    .join(" ");
};

export const CATEGORIES = {
  "1": "Tops",
  "2": "Bottoms",
  "3": "Dresses",
  "4": "Layers",
  "5": "Bags",
  "6": "Shoes",
};

export const SUBCATEGORIES = {
  // Tops
  "1001": "Basics",
  "1002": "Blouse",
  // Bottoms
  "2001": "Tailored Pants",
  "2002": "Casual Pants",
  "2003": "Denim Jeans",
  "2004": "Tailored Skirt",
  "2005": "Casual Skirt",
  "2006": "Casual Shorts",
  // Dresses
  "3001": "Little Dress",
  "3002": "Casual Dress",
  // Layers
  "4001": "Blazer",
  "4002": "Cardigan",
  "4003": "Casual Jacket",
  // Shoes
  "6001": "Ballet Flats",
  "6002": "Pumps",
  "6003": "Strappy Heels",
  "6004": "Gold Strappy Sandals",
  "6005": "Wedges",
  // Bags
  "5001": "Clutch",
  "5002": "Tote",
};

export const EDIT_OPTIONS = {
  "1001": {
    neckline: {
      name: "neckline_id",
      options: [
        { id: 1, name: "V / Wrap / Surplice" },
        { id: 2, name: "Deep V" },
        { id: 3, name: "Scoop" },
        { id: 4, name: "Sweetheart" },
        { id: 5, name: "Cowl" },
        { id: 6, name: "Asymmetrical / One-Shoulder" },
      ],
    },
    sleeve_length: {
      name: "top_sleeve_type_id",
      options: [
        { id: 1, name: "Sleeveless" },
        { id: 2, name: "Normal" },
        { id: 3, name: "Elbow" },
        { id: 4, name: "Three-quarter" },
        { id: 5, name: "Full" },
      ],
    },
  },
  "1002": {
    neckline: {
      name: "neckline_id",
      options: [
        { id: 1, name: "V / Wrap / Surplice" },
        { id: 4, name: "Sweetheart" },
        { id: 5, name: "Cowl" },
        { id: 7, name: "Asymmetrical" },
      ],
    },
    sleeve_length: {
      name: "blouse_sleeve_type_id",
      options: [
        { id: 1, name: "Sleeveless" },
        { id: 2, name: "Cap" },
        { id: 3, name: "Half Sleeve" },
        { id: 4, name: "Full" },
      ],
    },
  },

  "2001": {
    bottom_cut: {
      name: "bottom_cut_id",
      options: [
        { id: 1, name: "Wide Leg" },
        { id: 2, name: "Boot cut / Flared" },
      ],
    },
  },
  "2002": {
    bottom_cut: {
      name: "bottom_cut_id",
      options: [
        { id: 1, name: "Wide Leg" },
        { id: 2, name: "Boot cut / Flared" },
      ],
    },
  },
  "2003": {
    bottom_cut: {
      name: "bottom_cut_id",
      options: [
        { id: 1, name: "Wide Leg" },
        { id: 2, name: "Boot cut / Flared" },
      ],
    },
  },
  "2004": {
    skirt_cut: {
      name: "skirt_cut_id",
      options: [
        { id: 1, name: "A-Line" },
        { id: 2, name: "Mermaid" },
      ],
    },
  },
  "2005": {
    skirt_cut: {
      name: "skirt_cut_id",
      options: [
        { id: 1, name: "A-Line" },
        { id: 2, name: "Mermaid" },
        { id: 3, name: "Pleated" },
      ],
    },
  },
  "2006": {
    short_cut: {
      name: "short_cut_id",
      options: [
        { id: 1, name: "Short" },
        { id: 2, name: "Bermuda" },
      ],
    },
  },
  "3001": {
    dress_cut: {
      name: "dress_cut_id",
      options: [
        { id: 1, name: "Fit-and-flare" },
        { id: 2, name: "Mermaid" },
      ],
    },
    neckline: {
      name: "neckline_id",
      options: [
        { id: 1, name: "V" },
        { id: 7, name: "Asymmetrical" },
      ],
    },
  },
  "3002": {
    dress_cut: {
      name: "dress_cut_id",
      options: [
        { id: 1, name: "Fit-and-flare" },
        { id: 2, name: "Mermaid" },
      ],
    },
    neckline: {
      name: "neckline_id",
      options: [
        { id: 1, name: "V" },
        { id: 7, name: "Asymmetrical" },
      ],
    },
  },
};

export const clothingItemNameBuilder = (item: any) => {
  const {
    category_id,
    subcategory_id,
    top_sleeve_type_id,
    blouse_sleeve_type_id,
    neckline_id,
    bottom_cut_id,
    skirt_cut_id,
    short_cut_id,
    dress_cut_id,
    colour_type_id,
    clothing_variant_id,
  } = item;

  const category = CATEGORIES[category_id as keyof typeof CATEGORIES];
  const subcategory =
    SUBCATEGORIES[subcategory_id as keyof typeof SUBCATEGORIES];
};
