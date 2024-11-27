"use server";

export async function getStatistic(): Promise<any[] | null> {
  try {
    const host: string = process.env.HOST || "http://localhost:3000";

    const token: string = process.env.API_TOKEN || "";

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

export async function getUsers(): Promise<any[] | null> {
  try {
    const host: string = process.env.HOST || "http://localhost:3000";
    const token: string = process.env.API_TOKEN || "";

    if (!token) {
      throw new Error("Authorization token is missing.");
    }

    const response = await fetch(`${host}/api/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorMessage = `Error fetching users: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const result = await response.json();

    if (result.success && Array.isArray(result.data)) {
      return result.data;
    } else {
      throw new Error("Invalid API response format.");
    }
  } catch (error: any) {
    console.error("Failed to fetch users:", error.message);
    return null;
  }
}

export async function postUser(data: {
  id: string;
  full_name: string;
  username: string;
  email: string;
  password: string;
}): Promise<any | null> {
  try {
    const host: string = process.env.HOST || "http://localhost:3000";
    const token: string = process.env.API_TOKEN || "";

    if (!token) {
      throw new Error("Authorization token is missing.");
    }

    const response = await fetch(`${host}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorMessage = `Error posting user: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const result = await response.json();

    if (result.success && result.data) {
      return result.data;
    } else {
      throw new Error("Invalid API response format.");
    }
  } catch (error: any) {
    console.error("Failed to post user:", error.message);
    return null;
  }
}

export async function getProducts(): Promise<any[] | null> {
  try {
    const host: string = process.env.HOST || "http://localhost:3000";

    const token: string = process.env.API_TOKEN || "";

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

    const token: string = process.env.API_TOKEN || "";

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
    const token: string = process.env.API_TOKEN || "";

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
    const token: string = process.env.API_TOKEN || "";

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
    const token: string = process.env.API_TOKEN || "";

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
}): Promise<any | null> {
  try {
    const host: string = process.env.HOST || "http://localhost:3000";
    const token: string = process.env.API_TOKEN || "";

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
    const token: string = process.env.API_TOKEN || "";

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

export async function getMerchants(): Promise<any[] | null> {
  try {
    const host: string = process.env.HOST || "http://localhost:3000";
    const token: string = process.env.API_TOKEN || "";

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
      throw new Error(`Error fetching merchants: ${response.statusText}`);
    }

    const result = await response.json();

    if (result.success && Array.isArray(result.data)) {
      return result.data;
    }

    throw new Error("Invalid API response format.");
  } catch (error: any) {
    console.error("Failed to fetch merchants:", error.message);
    return null;
  }
}

interface MerchantPayload {
  name: string;
  description: string;
  longitude: string;
  latitude: string;
}

export async function postMerchant(data: MerchantPayload): Promise<any | null> {
  try {
    const host: string = process.env.HOST || "http://localhost:3000";
    const token: string = process.env.API_TOKEN || "";

    if (!token) {
      throw new Error("Authorization token is missing.");
    }

    const response = await fetch(`${host}/api/merchants`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error creating merchant: ${response.statusText}`);
    }

    const result = await response.json();

    if (result.success) {
      return result.data;
    }

    throw new Error("Invalid API response format.");
  } catch (error: any) {
    console.error("Failed to create merchant:", error.message);
    return null;
  }
}

interface MerchantUpdatePayload extends MerchantPayload {
  id: number;
}

export async function editMerchant(
  data: MerchantUpdatePayload
): Promise<any | null> {
  try {
    const host: string = process.env.HOST || "http://localhost:3000";
    const token: string = process.env.API_TOKEN || "";

    if (!token) {
      throw new Error("Authorization token is missing.");
    }

    const response = await fetch(`${host}/api/merchants/${data.id}`, {
      method: "PUT",
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
      throw new Error(`Error updating merchant: ${response.statusText}`);
    }

    const result = await response.json();

    if (result.success) {
      return result.data;
    }

    throw new Error("Invalid API response format.");
  } catch (error: any) {
    console.error("Failed to update merchant:", error.message);
    return null;
  }
}

export async function deleteMerchant(id: number): Promise<boolean> {
  try {
    const host: string = process.env.HOST || "http://localhost:3000";
    const token: string = process.env.API_TOKEN || "";

    if (!token) {
      throw new Error("Authorization token is missing.");
    }

    const response = await fetch(`${host}/api/merchants/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error deleting merchant: ${response.statusText}`);
    }

    const result = await response.json();

    if (result.success) {
      return true;
    }

    throw new Error("Invalid API response format.");
  } catch (error: any) {
    console.error("Failed to delete merchant:", error.message);
    return false;
  }
}
