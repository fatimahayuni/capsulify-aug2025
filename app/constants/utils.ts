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
