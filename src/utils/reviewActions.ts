"use server";

export async function postReview(
  data: {
    rating: number;
    comment: string;
    user_id: string;
    product_id: number;
    images?: File[];
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
    formData.append("rating", data.rating.toString());
    formData.append("comment", data.comment);
    formData.append("product_id", data.product_id.toString());

    if (data.images && data.images.length > 0) {
      data.images.forEach((image, index) => {
        formData.append(`images`, image); // Gunakan nama unik untuk setiap file
      });
    }

    const response = await fetch(`${host}/api/reviews`, {
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
