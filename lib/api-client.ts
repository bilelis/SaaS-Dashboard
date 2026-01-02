const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function apiCall(endpoint: string, options: RequestInit & { token?: string } = {}) {
  const { token, ...fetchOptions } = options
  const headers = {
    "Content-Type": "application/json",
    ...fetchOptions.headers,
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  return response.json()
}

export async function getProducts() {
  return apiCall("/api/products")
}

export async function getUserProfile(token: string) {
  return apiCall("/api/users/me", { token })
}

export async function createSubscription(productId: string, token: string) {
  return apiCall("/api/subscriptions", {
    method: "POST",
    body: JSON.stringify({ product_id: productId }),
    token,
  })
}

export async function getUserSubscriptions(token: string) {
  return apiCall("/api/subscriptions", { token })
}
