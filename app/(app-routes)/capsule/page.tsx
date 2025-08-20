"use client";
import React, { useState, useRef, useEffect } from "react";
import { SignedOut, SignInButton, useAuth } from "@clerk/nextjs";
import { Category } from "@/app/constants/Category";

interface UserImage {
  id: number;
  image_name: string;
  image_url: string;
  category_id: number;
}

const CapsulePage = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingCategory, setUploadingCategory] = useState<number | null>(
    null
  );
  const [uploadProgress, setUploadProgress] = useState<{
    current: number;
    total: number;
  } | null>(null);
  const [userImages, setUserImages] = useState<UserImage[]>([]);
  const [fetchingImages, setFetchingImages] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isSignedIn } = useAuth();

  // Fetch user images on component mount
  useEffect(() => {
    console.log("inside fetch user images effect");
    if (isSignedIn) {
      fetchUserImages();
    } else {
      setFetchingImages(false);
    }
  }, [isSignedIn]);

  const fetchUserImages = async () => {
    console.log("inside fetch images function");
    try {
      setFetchingImages(true);
      const response = await fetch("/api/user-images");
      if (response.ok) {
        const data = await response.json();
        console.log(
          "what is the data im getting from user-images api route",
          data
        );
        setUserImages(data.images || []);
      } else if (response.status === 401) {
        setError("Please log in to view and upload your images");
      } else {
        console.error("Failed to fetch user images");
      }
    } catch (error) {
      console.error("Error fetching user images:", error);
    } finally {
      setFetchingImages(false);
    }
  };

  // Helper function to get category ID from category name
  const getCategoryId = (categoryName: string): number => {
    switch (categoryName) {
      case "Tops":
        return Category.Tops;
      case "Bottoms":
        return Category.Bottoms;
      case "Dresses":
        return Category.Dresses;
      case "Layers":
        return Category.Layers;
      case "Bags":
        return Category.Bags;
      case "Shoes":
        return Category.Shoes;
      default:
        return Category.Tops;
    }
  };

  // Get images for a specific category
  const getImagesForCategory = (categoryId: number): UserImage[] => {
    return userImages.filter((image) => image.category_id === categoryId);
  };

  // Extract filename from image URL
  const getFileNameFromUrl = (imageUrl: string): string => {
    try {
      const url = new URL(imageUrl);
      const pathParts = url.pathname.split("/");
      return pathParts[pathParts.length - 1];
    } catch {
      return "";
    }
  };

  // Handle image deletion
  const handleDeleteImage = async (imageId: number, imageUrl: string) => {
    if (!confirm("Are you sure you want to delete this image?")) {
      return;
    }

    try {
      const fileName = getFileNameFromUrl(imageUrl);
      if (!fileName) {
        setError("Could not determine filename");
        return;
      }

      const response = await fetch("/api/delete-image", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageId,
          imageUrl,
          fileName,
        }),
      });

      if (response.ok) {
        // Remove from local state
        setUserImages((prev) => prev.filter((img) => img.id !== imageId));
      } else {
        const data = await response.json();
        setError(data.error || "Failed to delete image");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      setError("Failed to delete image");
    }
  };

  // Handle multiple file uploads
  const handleMultipleFileUpload = async (
    files: FileList,
    categoryId: number
  ) => {
    if (files.length > 5) {
      setError("You can only upload up to 5 images at once");
      return;
    }

    setLoading(true);
    setUploadingCategory(categoryId);
    setError(null);
    setUploadProgress({ current: 0, total: files.length });

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/avif",
    ];

    const uploadPromises = Array.from(files).map(async (file) => {
      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`Invalid file type: ${file.name}`);
      }

      try {
        // Step 1: Upload original image to get a URL for processing
        const formData = new FormData();
        formData.append("file", file);
        formData.append("categoryId", categoryId.toString());

        const uploadRes = await fetch("/api/upload-original", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          const data = await uploadRes.json();
          throw new Error(data.error || `Failed to upload ${file.name}`);
        }

        const uploadData = await uploadRes.json();
        const originalImageUrl = uploadData.imageUrl;

        // Step 2: Extract clothing using OpenAI gpt-image-1 (edits)
        const extractRes = await fetch("/api/extract-clothing-openai", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageUrl: originalImageUrl,
            categoryId: categoryId,
          }),
        });

        if (!extractRes.ok) {
          const data = await extractRes.json();
          throw new Error(
            data.error || `Failed to extract clothing from ${file.name}`
          );
        }

        return { success: true, fileName: file.name };
      } catch (error) {
        return {
          success: false,
          fileName: file.name,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    });

    try {
      // Track progress as each file completes
      const results: any[] = [];
      for (let i = 0; i < uploadPromises.length; i++) {
        const result = await uploadPromises[i];
        results.push(result);
        setUploadProgress((prev) =>
          prev ? { ...prev, current: i + 1 } : null
        );
      }

      const successful = results.filter((r) => r.success);
      const failed = results.filter((r) => !r.success);

      if (successful.length > 0) {
        await fetchUserImages();
      }

      if (failed.length > 0) {
        const errorMessages = failed
          .map((f) => `${f.fileName}: ${f.error}`)
          .join(", ");
        setError(`Some uploads failed: ${errorMessages}`);
      }

      if (successful.length === files.length) {
        setError(null);
      }
    } catch (error) {
      setError("Upload failed");
    } finally {
      setLoading(false);
      setUploadingCategory(null);
      setUploadProgress(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = e.target.files;
      setError(null);
      if (uploadingCategory) {
        await handleMultipleFileUpload(selectedFiles, uploadingCategory);
      }
    }
  };

  const handleAddButtonClick = (categoryId: number) => {
    console.log(`Adding item for category ID: ${categoryId}`);
    setUploadingCategory(categoryId);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/jpg,image/png,image/webp,image/avif"
        onChange={handleFileChange}
        // Use visually-hidden instead of display:none to allow iOS/Safari to open the picker
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      />

      {/* Error display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Category Sections */}
      <div className="mt-16 px-4 max-w-4xl mx-auto space-y-12">
        {/* Loading state */}
        {fetchingImages && (
          <div className="text-center py-8">
            <div className="text-lg text-gray-600">Loading your images...</div>
          </div>
        )}

        {!fetchingImages && !isSignedIn && (
          <div className="text-center py-8">
            <p className="text-[#4a3427] mb-4">
              Please log in to add and view your images.
            </p>
            <SignInButton>
              <button className="bg-[#4a3427] text-white px-4 py-2 rounded">
                Log in
              </button>
            </SignInButton>
          </div>
        )}

        {Object.values(Category)
          .filter((value) => typeof value === "string")
          .map((category) => {
            const categoryId = getCategoryId(category);
            const categoryImages = getImagesForCategory(categoryId);

            return (
              <div key={category} className="space-y-4 ">
                <h3 className="text-2xl font-semibold text-[#4a3427]">
                  {category}
                </h3>

                {/* Display images for this category */}
                {categoryImages.length > 0 && (
                  <div className="w-full h-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6 ">
                    {categoryImages.map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.image_url}
                          alt={image.image_name}
                          className="w-[90%] h-full object-contain rounded-lg shadow-md"
                        />
                        <div className="absolute inset-0 object-contain group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                          <button
                            onClick={() =>
                              handleDeleteImage(image.id, image.image_url)
                            }
                            className="opacity-0 group-hover:opacity-100 bg-red-500 text-white px-2 py-1 rounded text-sm transition-opacity duration-200"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add button at the end of each category section */}
                <div className="flex justify-center">
                  <button
                    onClick={() => handleAddButtonClick(categoryId)}
                    disabled={loading || !isSignedIn}
                    className="bg-[#eee7e1] border-none rounded-xl p-8 cursor-pointer flex flex-col items-center justify-center min-w-[200px] min-h-[120px] shadow-md hover:scale-105 hover:shadow-lg transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="text-4xl text-[#4a3427] mb-3 font-bold">
                      {loading && uploadingCategory === categoryId
                        ? uploadProgress
                          ? `${uploadProgress.current}/${uploadProgress.total}`
                          : "..."
                        : "+"}
                    </div>
                    <div className="text-[#4a3427] text-sm font-medium text-center leading-tight">
                      {loading && uploadingCategory === categoryId
                        ? uploadProgress
                          ? `Processing ${uploadProgress.current} of ${uploadProgress.total}...`
                          : "Processing..."
                        : "click here to ADD and extract clothing items (up to 5 images)"}
                    </div>
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CapsulePage;
