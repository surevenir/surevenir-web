"use server";

import { MediaType } from "@/app/types/types";

export async function postImages(
  data: {
    id: number;
    images: File[];
  },
  type: MediaType,
  token: string
): Promise<any | null> {
  try {
    if (!token) {
      throw new Error("Authorization token is missing.");
    }

    const host = process.env.NEXT_PUBLIC_HOST || "http://localhost:3000";

    // Validasi lebih ketat untuk file
    const validImages = data.images.filter(
      (file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024 // max 5MB
    );

    if (validImages.length === 0) {
      throw new Error("No valid images provided. Check file types and sizes.");
    }

    const formData = new FormData();
    validImages.forEach((image) => {
      formData.append("images", image);
    });

    const response = await fetch(`${host}/api/${type}s/${data.id}/images`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      const errorMessage = `Error posting ${type} images: ${response.status} - ${errorText}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    const result = await response.json();

    return result.data || null;
  } catch (error: any) {
    console.error(`Failed to post ${type} images:`, error.message);
    return null;
  }
}

export async function deleteImage(
  url: string,
  token: string
): Promise<any | null> {
  try {
    if (!token) {
      throw new Error("Authorization token is missing.");
    }

    const host: string = process.env.NEXT_PUBLIC_HOST || "";

    if (!token) {
      throw new Error("Authorization token is missing.");
    }

    const response = await fetch(`${host}/api/images?url=${url}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorMessage = `Error deleting image: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const result = await response.json();

    if (result.success) {
      return result.data;
    } else {
      throw new Error("Invalid API response format.");
    }
  } catch (error: any) {
    console.error("Failed to delete image:", error.message);
    return null;
  }
}
