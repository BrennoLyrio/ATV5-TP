// src/services/api.ts

const API_BASE_URL = "http://localhost:5000";

export const apiFetch = async (
  endpoint: string,
  method: string = "GET",
  body: any = null
) => {
  const headers: HeadersInit = { "Content-Type": "application/json" };

  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, options);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erro desconhecido.");
    }

    return await response.json();
  } catch (error) {
    console.error(`Erro na API (${method} ${endpoint}):`, error);
    throw error;
  }
};
