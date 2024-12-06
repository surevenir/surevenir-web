"use server";

export async function addProductToCart(
  productId: number,
  quantity: number,
  token: string
): Promise<any | null> {
  try {
    const host: string =
      process.env.NEXT_PUBLIC_HOST || "http://localhost:3000";

    if (!token) {
      throw new Error("Authorization token is missing.");
    }

    // Request POST ke endpoint dengan ID
    const response = await fetch(`${host}/api/carts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ product_id: productId, quantity: quantity }),
    });

    if (!response.ok) {
      const errorMessage = `Error add product to cart: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const result = await response.json();

    if (result.success) {
      return result.data;
    } else {
      throw new Error("Invalid API response format.");
    }
  } catch (error: any) {
    console.error("Failed to add product to cart:", error.message);
    return null;
  }
}
