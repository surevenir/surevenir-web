"use server";

export async function getProducts(): Promise<any[] | null> {
  try {
    const host: string =
      process.env.NEXT_PUBLIC_HOST || "http://localhost:3000";

    const token: string = process.env.NEXT_PUBLIC_API_TOKEN || "";

    if (!token) {
      throw new Error("Authorization token is missing.");
    }

    const response = await fetch(`${host}/api/products`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorMessage = `Error fetching products: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const result = await response.json();

    if (result.success && Array.isArray(result.data)) {
      return result.data;
    } else {
      throw new Error("Invalid API response format.");
    }
  } catch (error: any) {
    console.error("Failed to fetch products:", error.message);
    return null;
  }
}

export async function postProduct(data: {
  name: string;
  description: string;
  price: number;
  merchantId: number;
  categoryIds: string;
  stock: number;
  // images: File[];
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

    // const validImages = data.images.filter(
    //   (file) => file.type.startsWith("image/") && file.size <= 3 * 1024 * 1024
    // );

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price.toString());
    formData.append("merchant_id", data.merchantId.toString());
    formData.append("category_ids", data.categoryIds);
    formData.append("stock", data.stock.toString());
    // validImages.forEach((image) => {
    //   formData.append("images", image);
    // });

    const response = await fetch(`${host}/api/products`, {
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
    console.error("Failed to post product:", error.message);
    throw error;
  }
}

export async function editProduct(data: {
  id: number;
  name: string;
  description: string;
  price: number;
  merchantId: number;
  categoryIds: number[]; // ubah menjadi array number, sesuai dengan format request JSON
  stock: number;
  // images: File[]; // gambar tidak perlu ditambahkan jika tidak ingin mengirimkan gambar
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

    // Membuat objek untuk request body
    const requestBody = {
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      merchant_id: data.merchantId,
      category_ids: data.categoryIds, // pastikan ini adalah array angka
    };

    const response = await fetch(`${host}/api/products/${data.id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Set content-type ke application/json
      },
      body: JSON.stringify(requestBody), // Mengirimkan request body dalam format JSON
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("API Error:", errorResponse);
      throw new Error(`API Error: ${errorResponse.message || "Unknown error"}`);
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Failed to update product:", error.message);
    throw error;
  }
}

export async function deleteProduct(id: number): Promise<any | null> {
  try {
    const host: string =
      process.env.NEXT_PUBLIC_HOST || "http://localhost:3000";
    const token: string = process.env.NEXT_PUBLIC_API_TOKEN || "";

    if (!token) {
      throw new Error("Authorization token is missing.");
    }

    // Request DELETE ke endpoint dengan ID
    const response = await fetch(`${host}/api/products/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorMessage = `Error deleting product: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const result = await response.json();

    if (result.success) {
      return result.data;
    } else {
      throw new Error("Invalid API response format.");
    }
  } catch (error: any) {
    console.error("Failed to delete product:", error.message);
    return null;
  }
}

export async function postProductImages(data: {
  id: number;
  images: File[];
}): Promise<any | null> {
  try {
    const host = process.env.NEXT_PUBLIC_HOST || "http://localhost:3000";
    const token = process.env.NEXT_PUBLIC_API_TOKEN || "";

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

    const response = await fetch(`${host}/api/products/${data.id}/images`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      const errorMessage = `Error posting product images: ${response.status} - ${errorText}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    const result = await response.json();

    return result.data || null;
  } catch (error: any) {
    console.error("Failed to post product images:", error.message);
    return null;
  }
}
