import Cookies from "js-cookie";

export async function apiClient(url, method = "GET", body = null) {
  const token = Cookies.get("jwtToken");
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

  const response = await fetch(url, options);

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
