"use server";

import { MediaType } from "@/app/types/types";

export async function getStatistic(token: string): Promise<any[] | null> {
  try {
    const host: string =
      process.env.NEXT_PUBLIC_HOST || "http://localhost:3000";

    if (!token) {
      throw new Error("Authorization token is missing.");
    }

    const response = await fetch(`${host}/api/count`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorMessage = `Error fetching statistic: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const result = await response.json();

    if (result.success && Array.isArray(result.data)) {
      return result.data;
    } else {
      throw new Error("Invalid API response format.");
    }
  } catch (error: any) {
    console.error("Failed to fetch statistic:", error.message);
    return null;
  }
}

export async function getDataBySlug(
  slug: string,
  token: string,
  type: MediaType
): Promise<any[] | null> {
  try {
    const host: string =
      process.env.NEXT_PUBLIC_HOST || "http://localhost:3000";

    if (!token) {
      throw new Error("Authorization token is missing.");
    }

    const response = await fetch(`${host}/api/${type}s/slug/${slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorMessage = `Error fetching ${type}: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const result = await response.json();

    if (result.success && result.data) {
      return result.data;
    } else {
      throw new Error("Invalid API response format.");
    }
  } catch (error: any) {
    console.error(`Failed to fetch ${type}:`, error.message);
    return null;
  }
}
