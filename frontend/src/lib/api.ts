
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";


export const getHeaders = (role?: string, cityId?: string) => {
  const token = localStorage.getItem("user_token");
  const userRole = role || localStorage.getItem("user_role") || "READER";
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "x-user-role": userRole,
  };

  if (token && !token.startsWith("mock-")) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  if (cityId) {
    headers["x-city-id"] = cityId;
  }
  return headers;
};

// Auth
export async function login(data: { email: string; password: string }) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Login failed");
  }
  return res.json();
}

export async function signup(data: { email: string; password: string; role?: string; fullName?: string }) {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Signup failed");
  }
  return res.json();
}

export async function fetchMe() {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

// Subscriptions
export async function fetchCityPlans(cityId: string) {
  const res = await fetch(`${API_URL}/subscriptions/city/${cityId}/plans`, {
    headers: getHeaders("READER"), // Public
  });
  if (!res.ok) throw new Error("Failed to fetch plans");
  return res.json();
}

export async function createCheckoutSession(data: { planId: string; successUrl: string; cancelUrl: string }) {
  const res = await fetch(`${API_URL}/subscriptions/checkout`, {
    method: "POST",
    headers: getHeaders("READER"), // Requires Auth
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to create checkout session");
  }
  return res.json();
}

export async function fetchCities() {
  const res = await fetch(`${API_URL}/admin/cities`, {
    headers: getHeaders("SUPER_ADMIN"), // Always require admin for this call
  });

  if (!res.ok) throw new Error("Failed to fetch cities");
  return res.json();
}


export async function createCity(data: { name: string; country: string }) {
  const res = await fetch(`${API_URL}/admin/cities`, {
    method: "POST",
    headers: getHeaders("SUPER_ADMIN"),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to create city");
  }
  return res.json();
}

export async function updateCity(id: string, data: { name?: string; country?: string; status?: "active" | "inactive" }) {
  const res = await fetch(`${API_URL}/admin/cities/${id}`, {
    method: "PATCH",
    headers: getHeaders("SUPER_ADMIN"),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to update city");
  }
  return res.json();
}

export async function deleteCity(id: string) {
  const res = await fetch(`${API_URL}/admin/cities/${id}`, {
    method: "DELETE",
    headers: getHeaders("SUPER_ADMIN"),
  });
  if (!res.ok) {
    // try to parse error if json
    try {
      const error = await res.json();
      throw new Error(error.error || "Failed to delete city");
    } catch (e) {
      throw new Error("Failed to delete city");
    }
  }
  return res.json();
}

export async function fetchPublishers() {
  const res = await fetch(`${API_URL}/admin/publishers`, {
    headers: getHeaders("SUPER_ADMIN"),
  });
  if (!res.ok) throw new Error("Failed to fetch publishers");
  return res.json();
}

export async function subscribeToNotifications(subscription: PushSubscription) {
  const res = await fetch(`${API_URL}/notifications/subscribe`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(subscription),
  });
  if (!res.ok) {
    throw new Error("Failed to subscribe");
  }
  return res.json();
}

export async function getNotificationConfig() {
  const res = await fetch(`${API_URL}/notifications/config`);
  if (!res.ok) {
    throw new Error("Failed to get config");
  }
  return res.json();
}

export async function createPublisher(data: { city_id: string; name: string; license_status?: "active" | "suspended" | "expired"; email?: string; password?: string }) {
  const res = await fetch(`${API_URL}/admin/publishers`, {
    method: "POST",
    headers: getHeaders("SUPER_ADMIN"),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to create publisher");
  }
  return res.json();
}

export async function fetchEditions() {
  const res = await fetch(`${API_URL}/publisher/editions`, {
    headers: getHeaders("PUBLISHER", localStorage.getItem("city_id") || undefined),
  });
  if (!res.ok) throw new Error("Failed to fetch editions");
  return res.json();
}

export async function createEdition(data: FormData) {
  const headers = getHeaders("PUBLISHER", localStorage.getItem("city_id") || undefined) as Record<string, string>;
  // Remove Content-Type so browser sets it with boundary for FormData
  delete headers["Content-Type"];

  const res = await fetch(`${API_URL}/publisher/editions`, {
    method: "POST",
    headers: headers,
    body: data,
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to create edition");
  }
  return res.json();
}

export async function publishEdition(id: string) {
  const res = await fetch(`${API_URL}/publisher/editions/${id}/publish`, {
    method: "PATCH",
    headers: getHeaders("PUBLISHER", localStorage.getItem("city_id") || undefined),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to publish edition");
  }
  return res.json();
}


export async function deleteEdition(id: string) {
  const res = await fetch(`${API_URL}/publisher/editions/${id}`, {
    method: "DELETE",
    headers: getHeaders("PUBLISHER", localStorage.getItem("city_id") || undefined),
  });
  if (!res.ok) throw new Error("Failed to delete edition");
  return res.json();
}

export async function updateEdition(id: string, data: FormData) {
  const headers = getHeaders("PUBLISHER", localStorage.getItem("city_id") || undefined) as Record<string, string>;
  // Remove Content-Type so browser sets it with boundary for FormData
  delete headers["Content-Type"];

  const res = await fetch(`${API_URL}/publisher/editions/${id}`, {
    method: "PUT",
    headers: headers,
    body: data,
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to update edition");
  }
  return res.json();
}

// Publisher Plans
export async function fetchPublisherPlans() {
  const res = await fetch(`${API_URL}/publisher/plans`, {
    headers: getHeaders("PUBLISHER", localStorage.getItem("city_id") || undefined),
  });
  if (!res.ok) throw new Error("Failed to fetch plans");
  return res.json();
}

export async function createPlan(data: { name: string; description?: string; price_amount: number; interval: "month" | "year" }) {
  const res = await fetch(`${API_URL}/publisher/plans`, {
    method: "POST",
    headers: getHeaders("PUBLISHER", localStorage.getItem("city_id") || undefined),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to create plan");
  }
  return res.json();
}

export async function getEdition(id: string) {
  // Use publisher endpoint for now, or create a public one
  // For Phase 1, we can use the publisher endpoint if we are logged in, 
  // but Readers need a public endpoint.
  // I'll create a public endpoint in backend first.
  const res = await fetch(`${API_URL}/editions/${id}`, {
    headers: getHeaders("READER"),
  });
  if (!res.ok) throw new Error("Failed to fetch edition");
  return res.json();
}
