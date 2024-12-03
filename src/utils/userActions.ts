"use server";

export async function getUsers(token: string): Promise<any[] | null> {
  try {
    const host: string =
      process.env.NEXT_PUBLIC_HOST || "http://localhost:3000";

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
    return null;
  }
}

export async function getUserById(
  id: string,
  token: string
): Promise<any | null> {
  try {
    const host: string =
      process.env.NEXT_PUBLIC_HOST || "http://localhost:3000";

    if (!token) {
      throw new Error("Authorization token is missing.");
    }

    const response = await fetch(`${host}/api/users/${id}`, {
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

    if (result.success && result.data) {
      return result.data;
    } else {
      throw new Error("Invalid API response format.");
    }
  } catch (error: any) {
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
    const host: string =
      process.env.NEXT_PUBLIC_HOST || "http://localhost:3000";

    const response = await fetch(`${host}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
    return null;
  }
}

export async function updateUser(
  data: {
    id: string;
    full_name?: string;
    username?: string;
    role?: string;
    phone?: string;
    address?: string;
    longitude?: string;
    latitude?: string;
  },
  token: string,
  image?: File | undefined
): Promise<any | null> {
  try {
    const host: string =
      process.env.NEXT_PUBLIC_HOST || "http://localhost:3000";

    const formData = new FormData();
    if (data.full_name) formData.append("full_name", data.full_name);
    if (data.username) formData.append("username", data.username);
    if (data.role) formData.append("role", data.role);
    if (data.address) formData.append("address", data.address);
    if (data.phone) formData.append("phone", data.phone);
    if (data.longitude) formData.append("longitude", data.longitude.toString());
    if (data.latitude) formData.append("latitude", data.latitude.toString());
    if (image) formData.append("image", image);

    const response = await fetch(`${host}/api/users/${data.id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorMessage = `Error update user: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const result = await response.json();

    if (result.success && result.data) {
      return result.data;
    } else {
      throw new Error("Invalid API response format.");
    }
  } catch (error: any) {
    return null;
  }
}
