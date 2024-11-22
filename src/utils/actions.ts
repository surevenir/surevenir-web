"use server";

export async function getProducts(): Promise<any[] | null> {
  try {
    const host: string = process.env.HOST || "http://localhost:3000";

    // Ambil token dari environment variable atau sumber lain
    const token: string = process.env.API_TOKEN || "user1";

    if (!token) {
      throw new Error("Authorization token is missing.");
    }

    const response = await fetch(`${host}/api/products`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Sertakan token di header
      },
    });

    if (!response.ok) {
      const errorMessage = `Error fetching products: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const result = await response.json();

    // Validasi format respons
    if (result.success && Array.isArray(result.data)) {
      return result.data; // Mengembalikan array produk
    } else {
      throw new Error("Invalid API response format.");
    }
  } catch (error: any) {
    console.error("Failed to fetch products:", error.message);
    return null;
  }
}
