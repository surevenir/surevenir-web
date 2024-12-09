"use server";

import { Predict } from "@/app/types/types";

export async function postPredict(
  image: File,
  token: string
): Promise<Predict | null> {
  try {
    const host: string =
      process.env.NEXT_PUBLIC_HOST || "http://localhost:5000";

    if (!token) {
      console.error("Authorization token is missing.");
      throw new Error("Authorization token is missing.");
    }

    if (!image) {
      console.error("No file selected.");
      throw new Error("No file selected.");
    }

    if (!image.type.startsWith("image/")) {
      console.error("Invalid file type. Only image files are allowed.");
      throw new Error("Invalid file type. Only image files are allowed.");
    }

    if (image.size > 3 * 1024 * 1024) {
      console.error("File size exceeds 3MB.");
      throw new Error("File size exceeds 3MB.");
    }

    const formData = new FormData();
    formData.append("image", image);

    const response = await fetch(`${host}/api/predict`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("API Error:", errorResponse);
      throw new Error(`API Error: ${errorResponse.message || "Unknown error"}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error: any) {
    console.error("Failed to post category:", error.message);
    throw error;
  }
}
