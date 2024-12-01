"use server";

export async function getCategories(): Promise<any[] | null> {
  try {
    const host: string =
      process.env.NEXT_PUBLIC_HOST || "http://localhost:3000";
    const token: string = process.env.NEXT_PUBLIC_API_TOKEN || "";

    if (!token) {
      throw new Error("Authorization token is missing.");
    }

    const response = await fetch(`${host}/api/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorMessage = `Error fetching categories: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const result = await response.json();

    if (result.success && Array.isArray(result.data)) {
      return result.data;
    } else {
      throw new Error("Invalid API response format.");
    }
  } catch (error: any) {
    console.error("Failed to fetch categories:", error.message);
    return null;
  }
}

export async function postCategory(data: {
  name: string;
  description: string;
  rangePrice: string;
  image: File;
}): Promise<any | null> {
  console.log(data);

  try {
    const host: string =
      process.env.NEXT_PUBLIC_HOST || "http://localhost:5000";
    const token: string = process.env.NEXT_PUBLIC_API_TOKEN || "12345";

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
    formData.append("range_price", data.rangePrice);
    formData.append("image", data.image);

    const response = await fetch(`${host}/api/categories`, {
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
    console.error("Failed to post category:", error.message);
    throw error; // Re-throw error untuk handling di komponen
  }
}

export async function editCategory(data: {
  id: number;
  name: string;
  description: string;
  rangePrice: string;
  image?: File;
}): Promise<any | null> {
  console.log(data);

  try {
    const host: string =
      process.env.NEXT_PUBLIC_HOST || "http://localhost:5000";
    const token: string = process.env.NEXT_PUBLIC_API_TOKEN || "12345";

    if (!token) {
      console.error("Authorization token is missing.");
      throw new Error("Authorization token is missing.");
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("range_price", data.rangePrice);

    if (data.image) {
      formData.append("image", data.image);
    }

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
    const response = await fetch(`${host}/api/categories/${data.id}`, {
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
    console.error("Failed to edit category:", error.message);
    return null;
  }
}

export async function deleteCategory(id: number): Promise<any | null> {
  try {
    const host: string =
      process.env.NEXT_PUBLIC_HOST || "http://localhost:3000";
    const token: string = process.env.NEXT_PUBLIC_API_TOKEN || "";

    if (!token) {
      throw new Error("Authorization token is missing.");
    }

    // Request DELETE ke endpoint dengan ID
    const response = await fetch(`${host}/api/categories/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorMessage = `Error deleting category: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const result = await response.json();

    if (result.success) {
      return result.data;
    } else {
      throw new Error("Invalid API response format.");
    }
  } catch (error: any) {
    console.error("Failed to delete category:", error.message);
    return null;
  }
}
