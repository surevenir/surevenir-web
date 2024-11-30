"use server";

export async function getMarkets(): Promise<any[] | null> {
  try {
    const host: string =
      process.env.NEXT_PUBLIC_HOST || "http://localhost:3000";
    const token: string = process.env.API_TOKEN || "";

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

export async function postMarket(data: {
  name: string;
  description: string;
  longitude: string;
  latitude: string;
  image: File;
}): Promise<any | null> {
  console.log(data);

  try {
    const host: string =
      process.env.NEXT_PUBLIC_HOST || "http://localhost:5000";
    const token: string = process.env.API_TOKEN || "12345";

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

export async function postMarketImages(data: {
  id: number;
  images: File[];
}): Promise<any | null> {
  try {
    const host = process.env.NEXT_PUBLIC_HOST || "http://localhost:3000";
    const token = process.env.API_TOKEN || "";

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

    const response = await fetch(`${host}/api/markets/${data.id}/images`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      const errorMessage = `Error posting market images: ${response.status} - ${errorText}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    const result = await response.json();

    return result.data || null;
  } catch (error: any) {
    console.error("Failed to post market images:", error.message);
    return null;
  }
}

export async function editMarket(data: {
  id: number;
  name: string;
  description: string;
  longitude: string;
  latitude: string;
  image?: File;
}): Promise<any | null> {
  console.log(data);

  try {
    const host: string =
      process.env.NEXT_PUBLIC_HOST || "http://localhost:5000";
    const token: string = process.env.API_TOKEN || "12345";

    if (!token) {
      console.error("Authorization token is missing.");
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

export async function deleteMarket(id: number): Promise<any | null> {
  try {
    const host: string =
      process.env.NEXT_PUBLIC_HOST || "http://localhost:3000";
    const token: string = process.env.API_TOKEN || "";

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
