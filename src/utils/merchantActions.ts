"use server";

export async function getMerchants(token: string): Promise<any[] | null> {
  try {
    const host: string =
      process.env.NEXT_PUBLIC_HOST || "http://localhost:3000";

    if (!token) {
      throw new Error("Authorization token is missing.");
    }

    const response = await fetch(`${host}/api/merchants`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorMessage = `Error fetching merchants: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const result = await response.json();

    if (result.success && Array.isArray(result.data)) {
      return result.data;
    } else {
      throw new Error("Invalid API response format.");
    }
  } catch (error: any) {
    console.error("Failed to fetch merchants:", error.message);
    return null;
  }
}

export async function postMerchant(
  data: {
    name: string;
    description: string;
    addresses?: string;
    userId: string;
    marketId?: string;
    longitude: string;
    latitude: string;
    image: File;
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

    if (!data.image) {
      console.error("No file selected.");
      throw new Error("No file selected.");
    }

    if (!data.image.type.startsWith("image/")) {
      console.error("Invalid file type. Only image files are allowed.");
      throw new Error("Invalid file type. Only image files are allowed.");
    }

    if (data.image.size > 3 * 1024 * 1024) {
      console.error("File size exceeds 3MB.");
      throw new Error("File size exceeds 3MB.");
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);

    if (data.addresses) {
      formData.append("addresses", data.addresses);
    }

    if (data.marketId) {
      formData.append("market_id", data.marketId);
    }

    formData.append("user_id", data.userId);
    formData.append("longitude", data.longitude);
    formData.append("latitude", data.latitude);
    formData.append("image", data.image);

    const response = await fetch(`${host}/api/merchants`, {
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
    console.error("Failed to post merchant:", error.message);
    throw error;
  }
}

export async function editMerchant(
  data: {
    id: number;
    name: string;
    description: string;
    addresses?: string | null;
    userId: string;
    marketId?: string | null;
    longitude: string;
    latitude: string;
    image?: File | null;
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

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("user_id", data.userId);
    formData.append("longitude", data.longitude);
    formData.append("latitude", data.latitude);

    if (data.addresses) {
      formData.append("addresses", data.addresses);
    }

    if (data.marketId) {
      formData.append("market_id", data.marketId);
    }

    if (data.image) {
      formData.append("image", data.image);
    }

    const response = await fetch(`${host}/api/merchants/${data.id}`, {
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
    console.error("Failed to edit merchant:", error.message);
    return null;
  }
}

export async function deleteMerchant(
  id: number,
  token: string
): Promise<any | null> {
  try {
    const host: string =
      process.env.NEXT_PUBLIC_HOST || "http://localhost:3000";

    if (!token) {
      throw new Error("Authorization token is missing.");
    }

    const response = await fetch(`${host}/api/merchants/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorMessage = `Error deleting merchant: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const result = await response.json();

    if (result.success) {
      return result.data;
    } else {
      throw new Error("Invalid API response format.");
    }
  } catch (error: any) {
    console.error("Failed to delete merchant:", error.message);
    return null;
  }
}
