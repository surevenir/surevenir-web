"use server";

export async function getMarkets(token: string): Promise<any[] | null> {
  try {
    const host: string =
      process.env.NEXT_PUBLIC_HOST || "http://localhost:3000";

    if (!token) {
      throw new Error("Authorization token is missing.");
    }

    const response = await fetch(`${host}/api/markets`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorMessage = `Error fetching markets: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const result = await response.json();

    if (result.success && Array.isArray(result.data)) {
      return result.data;
    } else {
      throw new Error("Invalid API response format.");
    }
  } catch (error: any) {
    console.error("Failed to fetch markets:", error.message);
    return null;
  }
}

export async function getMerchantsInMarket(
  token: string,
  marketId: number
): Promise<any[] | null> {
  try {
    const host: string =
      process.env.NEXT_PUBLIC_HOST || "http://localhost:3000";

    if (!token) {
      throw new Error("Authorization token is missing.");
    }

    const response = await fetch(`${host}/api/markets/${marketId}/merchants`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorMessage = `Error fetching merchants in market: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const result = await response.json();

    if (result.success && Array.isArray(result.data)) {
      return result.data;
    } else {
      throw new Error("Invalid API response format.");
    }
  } catch (error: any) {
    console.error("Failed to fetch merchants in market:", error.message);
    return null;
  }
}

export async function postMarket(
  data: {
    name: string;
    description: string;
    longitude: string;
    latitude: string;
    image?: File;
  },
  token: string
): Promise<any | null> {
  try {
    const host: string =
      process.env.NEXT_PUBLIC_HOST || "http://localhost:5000";

    if (!token) {
      console.error("Authorization token is missing.");
      throw new Error("Authorization token is missing.");
    }

    // Validasi image sebelum memasukkan ke FormData
    if (!data.image) {
      console.error("No file selected.");
      throw new Error("No file selected.");
    }

    // Validasi tipe file (harus berupa image)
    if (!data.image.type.startsWith("image/")) {
      console.error("Invalid file type. Only image files are allowed.");
      throw new Error("Invalid file type. Only image files are allowed.");
    }

    // Validasi ukuran file (maksimal 3MB)
    if (data.image.size > 3 * 1024 * 1024) {
      // 3MB limit
      console.error("File size exceeds 3MB.");
      throw new Error("File size exceeds 3MB.");
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("longitude", data.longitude);
    formData.append("latitude", data.latitude);
    formData.append("image", data.image);

    const response = await fetch(`${host}/api/markets`, {
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
    return result;
  } catch (error: any) {
    console.error("Failed to post market:", error.message);
    throw error; // Re-throw error untuk handling di komponen
  }
}

export async function editMarket(
  data: {
    id: number;
    name: string;
    description: string;
    longitude: string;
    latitude: string;
    image?: File;
  },
  token: string
): Promise<any | null> {
  try {
    const host: string =
      process.env.NEXT_PUBLIC_HOST || "http://localhost:5000";

    if (!token) {
      throw new Error("Authorization token is missing.");
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("longitude", data.longitude);
    formData.append("latitude", data.latitude);

    // Jika ada gambar, validasi dan tambahkan ke FormData
    if (data.image) {
      if (!data.image.type.startsWith("image/")) {
        console.error("Invalid file type. Only image files are allowed.");
        throw new Error("Invalid file type. Only image files are allowed.");
      }

      if (data.image.size > 3 * 1024 * 1024) {
        console.error("File size exceeds 3MB.");
        throw new Error("File size exceeds 3MB.");
      }

      formData.append("image", data.image);
    }

    // Request PUT ke endpoint dengan ID (dengan FormData)
    const response = await fetch(`${host}/api/markets/${data.id}`, {
      method: "PATCH",
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
    if (result.success) {
      return result.data;
    } else {
      throw new Error("Invalid API response format.");
    }
  } catch (error: any) {
    console.error("Failed to edit market:", error.message);
    return null;
  }
}

export async function deleteMarket(
  id: number,
  token: string
): Promise<any | null> {
  try {
    const host: string =
      process.env.NEXT_PUBLIC_HOST || "http://localhost:3000";

    if (!token) {
      throw new Error("Authorization token is missing.");
    }

    // Request DELETE ke endpoint dengan ID
    const response = await fetch(`${host}/api/markets/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorMessage = `Error deleting market: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const result = await response.json();

    if (result.success) {
      return result.data;
    } else {
      throw new Error("Invalid API response format.");
    }
  } catch (error: any) {
    console.error("Failed to delete market:", error.message);
    return null;
  }
}
