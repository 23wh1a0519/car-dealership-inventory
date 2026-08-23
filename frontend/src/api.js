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