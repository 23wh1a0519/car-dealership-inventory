import { getToken } from "./auth"

const API_URL = "http://localhost:8000"

export async function getVehicles() {
  const token = getToken()

  console.log("Token exists:", !!token)

  const response = await fetch(`${API_URL}/api/vehicles`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  console.log("Vehicles response:", response.status)

  if (!response.ok) {
    throw new Error("Failed to fetch vehicles")
  }

  return response.json()
}
export async function searchVehicles(params) {
  const query = new URLSearchParams();

  if (params.make) query.append("make", params.make);
  if (params.model) query.append("model", params.model);
  if (params.category) query.append("category", params.category);
  if (params.min_price) query.append("min_price", params.min_price);
  if (params.max_price) query.append("max_price", params.max_price);

  const response = await fetch(
    `${API_URL}/api/vehicles/search?${query.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to search vehicles");
  }

  return response.json();
}

export async function updateVehicle(id, vehicleData) {
  const response = await fetch(`${API_URL}/api/vehicles/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(vehicleData),
  });

  if (!response.ok) {
    throw new Error("Failed to update vehicle");
  }

  return response.json();
}