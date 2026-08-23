import { useEffect, useMemo, useState } from "react"
import { getVehicles } from "./api"
import { removeToken } from "./auth"

function VehicleDashboard({ onLogout }) {
  const [vehicles, setVehicles] = useState([])
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")

  useEffect(() => {
    async function loadVehicles() {
      try {
        const data = await getVehicles()
        setVehicles(data)
      } catch (err) {
        setError("Failed to load vehicles")
      }
    }

    loadVehicles()
  }, [])

  const categories = [
    "All",
    ...new Set(vehicles.map((vehicle) => vehicle.category)),
  ]

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      const matchesSearch =
        `${vehicle.make} ${vehicle.model}`
          .toLowerCase()
          .includes(search.toLowerCase())

      const matchesCategory =
        category === "All" || vehicle.category === category

      return matchesSearch && matchesCategory
    })
  }, [vehicles, search, category])

  const totalStock = vehicles.reduce(
    (total, vehicle) => total + vehicle.quantity,
    0
  )

  const availableVehicles = vehicles.filter(
    (vehicle) => vehicle.quantity > 0
  ).length

  function handleLogout() {
    removeToken()
    onLogout()
  }

  return (
    <div className="dashboard">
      <header className="navbar">
        <div className="brand">
          <div className="brand-icon">V</div>

          <div>
            <h2>Velocity Motors</h2>
            <span>Vehicle Inventory</span>
          </div>
        </div>

        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="dashboard-content">
        <section className="hero">
          <div>
            <p className="eyebrow">DEALERSHIP INVENTORY</p>

            <h1>
              Find your next
              <span> perfect drive.</span>
            </h1>

            <p className="hero-text">
              Browse our curated collection of premium vehicles.
              Find the right car at the right price.
            </p>
          </div>

          <div className="hero-stat">
            <strong>{vehicles.length}</strong>
            <span>Models available</span>
          </div>
        </section>

        <section className="stats">
          <div className="stat-card">
            <span>Total Models</span>
            <strong>{vehicles.length}</strong>
            <small>Vehicles in inventory</small>
          </div>

          <div className="stat-card">
            <span>Total Stock</span>
            <strong>{totalStock}</strong>
            <small>Units available</small>
          </div>

          <div className="stat-card">
            <span>Available</span>
            <strong>{availableVehicles}</strong>
            <small>Models in stock</small>
          </div>
        </section>

        <section className="inventory-section">
          <div className="inventory-header">
            <div>
              <p className="eyebrow">OUR COLLECTION</p>
              <h2>Explore vehicles</h2>
            </div>

            <div className="filters">
              <input
                type="text"
                placeholder="Search vehicles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && <div className="error">{error}</div>}

          <div className="vehicle-grid">
            {filteredVehicles.map((vehicle) => (
              <article className="vehicle-card" key={vehicle.id}>
                <div className="vehicle-image">
                  <span className="category-badge">
                    {vehicle.category}
                  </span>

                  <div className="car-placeholder">
                    🚘
                  </div>
                </div>

                <div className="vehicle-info">
                  <div className="vehicle-title">
                    <div>
                      <span className="make">{vehicle.make}</span>
                      <h3>{vehicle.model}</h3>
                    </div>

                    <span className="stock-badge">
                      {vehicle.quantity > 0
                        ? `${vehicle.quantity} left`
                        : "Sold out"}
                    </span>
                  </div>

                  <div className="vehicle-details">
                    <div>
                      <span>Category</span>
                      <strong>{vehicle.category}</strong>
                    </div>

                    <div>
                      <span>Availability</span>
                      <strong>
                        {vehicle.quantity > 0
                          ? "In Stock"
                          : "Unavailable"}
                      </strong>
                    </div>
                  </div>

                  <div className="vehicle-footer">
                    <div>
                      <span>Starting from</span>
                      <strong>
                        ₹{Number(vehicle.price).toLocaleString("en-IN")}
                      </strong>
                    </div>

                    <button
                      className="purchase-button"
                      disabled={vehicle.quantity === 0}
                    >
                      {vehicle.quantity === 0
                        ? "Unavailable"
                        : "Purchase →"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredVehicles.length === 0 && !error && (
            <div className="empty-state">
              <div>🔎</div>
              <h3>No vehicles found</h3>
              <p>Try another search or category.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default VehicleDashboard