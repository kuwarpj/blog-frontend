import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiClient(path, method = "GET", body = null) {
  const token = Cookies.get("authToken");

  const headers = {};
  if (body && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
    credentials: "include",
  };

  if (body) {
    options.body = body instanceof FormData ? body : JSON.stringify(body);
  }

  const fullUrl = `${BASE_URL}${path}`;
  const response = await fetch(fullUrl, options);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || "API request failed");
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  try {
    return await response.json();
  } catch {
    return await response.text();
  }
}
