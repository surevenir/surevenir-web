"use server";

export async function getProducts(): Promise<any[] | null> {
  try {
    const host: string = process.env.HOST || "http://localhost:3000";

    const token: string = process.env.API_TOKEN || "user1";

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

export async function getCategories(): Promise<any[] | null> {
  try {
    const host: string = process.env.HOST || "http://localhost:3000";

    const token: string = process.env.API_TOKEN || "user1";

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

export async function postCategories(data: {
  name: string;
}): Promise<any | null> {
  try {
    const host: string = process.env.HOST || "http://localhost:3000";
    const token: string = process.env.API_TOKEN || "user1";

    if (!token) {
      throw new Error("Authorization token is missing.");
    }

    const response = await fetch(`${host}/api/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorMessage = `Error posting category: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const result = await response.json();

    if (result.success && result.data) {
      return result.data;
    } else {
      throw new Error("Invalid API response format.");
    }
  } catch (error: any) {
    console.error("Failed to post category:", error.message);
    return null;
  }
}

export async function editCategories(data: {
  id: number;
  name: string;
}): Promise<any | null> {
  try {
    const host: string = process.env.HOST || "http://localhost:3000";
    const token: string = process.env.API_TOKEN || "user1";

    if (!token) {
      throw new Error("Authorization token is missing.");
    }

    // Request PUT ke endpoint dengan ID
    const response = await fetch(`${host}/api/categories/${data.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: data.name }), // Mengirimkan body dengan nama baru
    });

    if (!response.ok) {
      const errorMessage = `Error editing category: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const result = await response.json();

    if (result.success) {
      return result.data; // Data kategori yang berhasil diubah
    } else {
      throw new Error("Invalid API response format.");
    }
  } catch (error: any) {
    console.error("Failed to edit category:", error.message);
    return null;
  }
}

export async function deleteCategories(id: number): Promise<any | null> {
  try {
    const host: string = process.env.HOST || "http://localhost:3000";
    const token: string = process.env.API_TOKEN || "user1";

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
      return result.data; // Data yang berhasil dihapus (opsional)
    } else {
      throw new Error("Invalid API response format.");
    }
  } catch (error: any) {
    console.error("Failed to delete category:", error.message);
    return null;
  }
}

export async function getMarkets(): Promise<any[] | null> {
  try {
    const host: string = process.env.HOST || "http://localhost:3000";
    const token: string = process.env.API_TOKEN || "user1";

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
}): Promise<any | null> {
  try {
    const host: string = process.env.HOST || "http://localhost:3000";
    const token: string = process.env.API_TOKEN || "user1";

    if (!token) {
      throw new Error("Authorization token is missing.");
    }

    const response = await fetch(`${host}/api/markets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorMessage = `Error posting market: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const result = await response.json();

    if (result.success && result.data) {
      return result.data;
    } else {
      throw new Error("Invalid API response format.");
    }
  } catch (error: any) {
    console.error("Failed to post market:", error.message);
    return null;
  }
}

export async function editMarket(data: {
  id: number;
  name: string;
  description: string;
  longitude: string;
  latitude: string;
}): Promise<any | null> {
  try {
    const host: string = process.env.HOST || "http://localhost:3000";
    const token: string = process.env.API_TOKEN || "user1";

    if (!token) {
      throw new Error("Authorization token is missing.");
    }

    // Request PUT ke endpoint dengan ID
    const response = await fetch(`${host}/api/markets/${data.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: data.name,
        description: data.description,
        longitude: data.longitude,
        latitude: data.latitude,
      }),
    });

    if (!response.ok) {
      const errorMessage = `Error editing market: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
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
    const host: string = process.env.HOST || "http://localhost:3000";
    const token: string = process.env.API_TOKEN || "user1";

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
