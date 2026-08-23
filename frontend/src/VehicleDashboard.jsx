import { useEffect, useState } from "react"
import {
  getVehicles,
  searchVehicles,
  updateVehicle,
} from "./api"
import { getToken, removeToken } from "./auth"

const API_URL = "https://car-dealership-inventory-production-818d.up.railway.app"

const carImages = {
  "Audi A4":
    "https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&w=900&q=85",

  "Toyota Camry":
    "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=900&q=85",

  "Honda Civic":
    "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=900&q=85",

  "BMW X5":
    "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=85",

  "Ford Mustang":
    "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=900&q=85",
}

// =========================
// ADMIN STATUS
// =========================

function getAdminStatus() {
  const token = getToken()

  if (!token) {
    return false
  }

  try {
    const payload = JSON.parse(
      atob(token.split(".")[1])
    )

    return payload.is_admin === true
  } catch (error) {
    return false
  }
}

function VehicleDashboard({ onLogout }) {
  const [vehicles, setVehicles] = useState([])
  const [error, setError] = useState("")

  // =========================
  // SEARCH
  // =========================

  const [makeSearch, setMakeSearch] = useState("")
  const [modelSearch, setModelSearch] = useState("")
  const [categorySearch, setCategorySearch] =
    useState("All")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [searching, setSearching] =
    useState(false)

  // =========================
  // PURCHASE
  // =========================

  const [purchasing, setPurchasing] =
    useState(null)

  // =========================
  // RESTOCK
  // =========================

  const [restocking, setRestocking] =
    useState(null)

  // =========================
  // ADMIN
  // =========================

  const [isAdmin, setIsAdmin] =
    useState(false)

  // =========================
  // ADD VEHICLE
  // =========================

  const [showAddForm, setShowAddForm] =
    useState(false)

  const [newVehicle, setNewVehicle] =
    useState({
      make: "",
      model: "",
      category: "",
      price: "",
      quantity: "",
    })

  // =========================
  // EDIT VEHICLE
  // =========================

  const [editingVehicle, setEditingVehicle] =
    useState(null)

  // =========================
  // LOAD VEHICLES
  // =========================

  useEffect(() => {
    setIsAdmin(getAdminStatus())

    async function loadVehicles() {
      try {
        const data = await getVehicles()
        setVehicles(data)
      } catch (err) {
        setError(
          "Unable to load vehicle inventory."
        )
      }
    }

    loadVehicles()
  }, [])

  // =========================
  // SEARCH VEHICLES
  // =========================

  async function handleSearch() {
    try {
      setSearching(true)
      setError("")

      if (
        minPrice !== "" &&
        maxPrice !== "" &&
        Number(minPrice) > Number(maxPrice)
      ) {
        setError(
          "Minimum price cannot be greater than maximum price."
        )
        return
      }

      const data = await searchVehicles({
        make: makeSearch,
        model: modelSearch,
        category:
          categorySearch === "All"
            ? ""
            : categorySearch,
        min_price: minPrice,
        max_price: maxPrice,
      })

      setVehicles(data)
    } catch (err) {
      setError(
        "Unable to search vehicles."
      )
    } finally {
      setSearching(false)
    }
  }

  // =========================
  // CLEAR SEARCH
  // =========================

  async function handleClearSearch() {
    setMakeSearch("")
    setModelSearch("")
    setCategorySearch("All")
    setMinPrice("")
    setMaxPrice("")
    setError("")

    try {
      const data = await getVehicles()
      setVehicles(data)
    } catch (err) {
      setError(
        "Unable to load vehicles."
      )
    }
  }

  // =========================
  // PURCHASE
  // =========================

  async function handlePurchase(vehicleId) {
    const token = getToken()

    try {
      setPurchasing(vehicleId)

      const response = await fetch(
        `${API_URL}/api/vehicles/${vehicleId}/purchase`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        const data =
          await response.json()

        throw new Error(
          data.detail ||
            "Purchase failed"
        )
      }

      const updatedVehicle =
        await response.json()

      setVehicles((current) =>
        current.map((vehicle) =>
          vehicle.id ===
          updatedVehicle.id
            ? updatedVehicle
            : vehicle
        )
      )
    } catch (err) {
      alert(err.message)
    } finally {
      setPurchasing(null)
    }
  }

  // =========================
  // ADD VEHICLE
  // =========================

  async function handleAddVehicle(e) {
    e.preventDefault()

    // Extra frontend protection
    if (!isAdmin) {
      alert(
        "Only admin users can add vehicles."
      )
      return
    }

    const token = getToken()

    try {
      const response = await fetch(
        `${API_URL}/api/vehicles`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            make: newVehicle.make,
            model: newVehicle.model,
            category:
              newVehicle.category,
            price: Number(
              newVehicle.price
            ),
            quantity: Number(
              newVehicle.quantity
            ),
          }),
        }
      )

      if (!response.ok) {
        const data =
          await response.json()

        throw new Error(
          data.detail ||
            "Failed to add vehicle"
        )
      }

      const createdVehicle =
        await response.json()

      setVehicles((current) => [
        ...current,
        createdVehicle,
      ])

      setNewVehicle({
        make: "",
        model: "",
        category: "",
        price: "",
        quantity: "",
      })

      setShowAddForm(false)

      alert(
        "Vehicle added successfully!"
      )
    } catch (err) {
      alert(err.message)
    }
  }

  // =========================
  // UPDATE VEHICLE
  // =========================

  async function handleUpdateVehicle(e) {
    e.preventDefault()

    try {
      const updatedVehicle =
        await updateVehicle(
          editingVehicle.id,
          {
            make: editingVehicle.make,
            model: editingVehicle.model,
            category:
              editingVehicle.category,
            price: Number(
              editingVehicle.price
            ),
            quantity: Number(
              editingVehicle.quantity
            ),
          }
        )

      setVehicles((current) =>
        current.map((vehicle) =>
          vehicle.id ===
          updatedVehicle.id
            ? updatedVehicle
            : vehicle
        )
      )

      setEditingVehicle(null)

      alert(
        "Vehicle updated successfully!"
      )
    } catch (err) {
      alert(err.message)
    }
  }

  // =========================
  // RESTOCK
  // =========================

  async function handleRestock(vehicleId) {
    const quantity = prompt(
      "Enter quantity to restock:"
    )

    if (quantity === null) {
      return
    }

    const amount = Number(quantity)

    if (
      !Number.isInteger(amount) ||
      amount <= 0
    ) {
      alert(
        "Please enter a valid positive quantity."
      )

      return
    }

    const token = getToken()

    try {
      setRestocking(vehicleId)

      const response = await fetch(
        `${API_URL}/api/vehicles/${vehicleId}/restock`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            quantity: amount,
          }),
        }
      )

      if (!response.ok) {
        const data =
          await response.json()

        throw new Error(
          data.detail ||
            "Restock failed"
        )
      }

      const updatedVehicle =
        await response.json()

      setVehicles((current) =>
        current.map((vehicle) =>
          vehicle.id ===
          updatedVehicle.id
            ? updatedVehicle
            : vehicle
        )
      )

      alert(
        `Vehicle restocked by ${amount} units!`
      )
    } catch (err) {
      alert(err.message)
    } finally {
      setRestocking(null)
    }
  }

  // =========================
  // DELETE
  // =========================

  async function handleDelete(vehicleId) {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this vehicle?"
      )

    if (!confirmed) {
      return
    }

    const token = getToken()

    try {
      const response = await fetch(
        `${API_URL}/api/vehicles/${vehicleId}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        const data =
          await response.json()

        throw new Error(
          data.detail ||
            "Delete failed"
        )
      }

      setVehicles((current) =>
        current.filter(
          (vehicle) =>
            vehicle.id !== vehicleId
        )
      )

      alert(
        "Vehicle deleted successfully!"
      )
    } catch (err) {
      alert(err.message)
    }
  }

  // =========================
  // LOGOUT
  // =========================

  function handleLogout() {
    removeToken()
    onLogout()
  }

  // =========================
  // CATEGORIES
  // =========================

  const categories = [
    "All",
    ...new Set(
      vehicles.map(
        (vehicle) =>
          vehicle.category
      )
    ),
  ]

  // =========================
  // STATS
  // =========================

  const totalStock =
    vehicles.reduce(
      (sum, vehicle) =>
        sum + vehicle.quantity,
      0
    )

  // =========================
  // UI
  // =========================

  return (
    <div className="dashboard">

      {/* NAVBAR */}

      <nav className="navbar">

        <div className="brand">

          <div className="brand-icon">
            V
          </div>

          <div>
            <h2>
              Velocity Motors
            </h2>

            <span>
              Vehicle Inventory
            </span>
          </div>

        </div>

        <div>

          {isAdmin && (
            <span
              style={{
                marginRight: "15px",
                fontWeight: "bold",
              }}
            >
              👑 Admin
            </span>
          )}

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </nav>

      <main className="dashboard-content">

        {/* HERO */}

        <section className="hero">

          <div>

            <p className="eyebrow">
              PREMIUM VEHICLE COLLECTION
            </p>

            <h1>
              Find your next
              <br />
              <span>
                dream car.
              </span>
            </h1>

            <p className="hero-text">
              Explore our curated
              collection of premium
              vehicles. Every model
              is selected for quality,
              performance and
              exceptional driving
              experience.
            </p>

          </div>

          <div className="hero-stat">

            <strong>
              {vehicles.length}
            </strong>

            <span>
              Models available
            </span>

          </div>

        </section>

        {/* STATS */}

        <section className="stats">

          <div className="stat-card">

            <span>
              Total Models
            </span>

            <strong>
              {vehicles.length}
            </strong>

            <small>
              Vehicles in inventory
            </small>

          </div>

          <div className="stat-card">

            <span>
              Available Stock
            </span>

            <strong>
              {totalStock}
            </strong>

            <small>
              Units ready for purchase
            </small>

          </div>

          <div className="stat-card">

            <span>
              Categories
            </span>

            <strong>
              {categories.length - 1}
            </strong>

            <small>
              Vehicle categories
            </small>

          </div>

        </section>

        {/* INVENTORY */}

        <section className="inventory-section">

          <div className="inventory-header">

            <div>

              <p className="eyebrow">
                OUR COLLECTION
              </p>

              <h2>
                Vehicle Inventory
              </h2>

              {/* ADMIN ONLY */}

              {isAdmin && (
                <button
                  className="add-vehicle-button"
                  onClick={() =>
                    setShowAddForm(
                      !showAddForm
                    )
                  }
                >
                  {showAddForm
                    ? "✕ Cancel"
                    : "+ Add Vehicle"}
                </button>
              )}

            </div>

            {/* SEARCH */}

            <div className="filters">

              <input
                type="text"
                placeholder="Make"
                value={makeSearch}
                onChange={(e) =>
                  setMakeSearch(
                    e.target.value
                  )
                }
              />

              <input
                type="text"
                placeholder="Model"
                value={modelSearch}
                onChange={(e) =>
                  setModelSearch(
                    e.target.value
                  )
                }
              />

              <select
                value={categorySearch}
                onChange={(e) =>
                  setCategorySearch(
                    e.target.value
                  )
                }
              >

                {categories.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  )
                )}

              </select>

              <input
                type="number"
                placeholder="Min Price"
                value={minPrice}
                onChange={(e) =>
                  setMinPrice(
                    e.target.value
                  )
                }
                min="0"
              />

              <input
                type="number"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) =>
                  setMaxPrice(
                    e.target.value
                  )
                }
                min="0"
              />

              <button
                type="button"
                onClick={
                  handleSearch
                }
                disabled={searching}
              >
                {searching
                  ? "Searching..."
                  : "Search"}
              </button>

              <button
                type="button"
                onClick={
                  handleClearSearch
                }
              >
                Clear
              </button>

            </div>

          </div>

          {/* ADD VEHICLE FORM — ADMIN ONLY */}

          {isAdmin && showAddForm && (
            <form
              className="add-vehicle-form"
              onSubmit={
                handleAddVehicle
              }
            >

              <h3>
                Add New Vehicle
              </h3>

              <input
                type="text"
                placeholder="Make"
                value={
                  newVehicle.make
                }
                onChange={(e) =>
                  setNewVehicle({
                    ...newVehicle,
                    make:
                      e.target.value,
                  })
                }
                required
              />

              <input
                type="text"
                placeholder="Model"
                value={
                  newVehicle.model
                }
                onChange={(e) =>
                  setNewVehicle({
                    ...newVehicle,
                    model:
                      e.target.value,
                  })
                }
                required
              />

              <input
                type="text"
                placeholder="Category"
                value={
                  newVehicle.category
                }
                onChange={(e) =>
                  setNewVehicle({
                    ...newVehicle,
                    category:
                      e.target.value,
                  })
                }
                required
              />

              <input
                type="number"
                placeholder="Price"
                value={
                  newVehicle.price
                }
                onChange={(e) =>
                  setNewVehicle({
                    ...newVehicle,
                    price:
                      e.target.value,
                  })
                }
                min="0"
                required
              />

              <input
                type="number"
                placeholder="Quantity"
                value={
                  newVehicle.quantity
                }
                onChange={(e) =>
                  setNewVehicle({
                    ...newVehicle,
                    quantity:
                      e.target.value,
                  })
                }
                min="0"
                required
              />

              <button
                type="submit"
                className="submit-vehicle-button"
              >
                Add Vehicle
              </button>

            </form>
          )}

          {/* EDIT VEHICLE FORM */}

          {editingVehicle && (
            <form
              className="add-vehicle-form edit-vehicle-form"
              onSubmit={
                handleUpdateVehicle
              }
            >

              <h3>
                Edit Vehicle
              </h3>

              <input
                type="text"
                placeholder="Make"
                value={
                  editingVehicle.make
                }
                onChange={(e) =>
                  setEditingVehicle({
                    ...editingVehicle,
                    make:
                      e.target.value,
                  })
                }
                required
              />

              <input
                type="text"
                placeholder="Model"
                value={
                  editingVehicle.model
                }
                onChange={(e) =>
                  setEditingVehicle({
                    ...editingVehicle,
                    model:
                      e.target.value,
                  })
                }
                required
              />

              <input
                type="text"
                placeholder="Category"
                value={
                  editingVehicle.category
                }
                onChange={(e) =>
                  setEditingVehicle({
                    ...editingVehicle,
                    category:
                      e.target.value,
                  })
                }
                required
              />

              <input
                type="number"
                placeholder="Price"
                value={
                  editingVehicle.price
                }
                onChange={(e) =>
                  setEditingVehicle({
                    ...editingVehicle,
                    price:
                      e.target.value,
                  })
                }
                min="0"
                required
              />

              <input
                type="number"
                placeholder="Quantity"
                value={
                  editingVehicle.quantity
                }
                onChange={(e) =>
                  setEditingVehicle({
                    ...editingVehicle,
                    quantity:
                      e.target.value,
                  })
                }
                min="0"
                required
              />

              <button
                type="submit"
                className="submit-vehicle-button"
              >
                Save Changes
              </button>

              <button
                type="button"
                onClick={() =>
                  setEditingVehicle(null)
                }
              >
                Cancel
              </button>

            </form>
          )}

          {/* ERROR */}

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          {/* EMPTY */}

          {vehicles.length === 0 &&
            !error && (
              <div className="empty-state">

                <div>
                  🚘
                </div>

                <h3>
                  No vehicles found
                </h3>

                <p>
                  Try changing your
                  search or filters.
                </p>

              </div>
            )}

          {/* VEHICLE GRID */}

          <div className="vehicle-grid">

            {vehicles.map(
              (vehicle) => {

                const vehicleName =
                  `${vehicle.make} ${vehicle.model}`

                const image =
                  carImages[
                    vehicleName
                  ]

                return (
                  <article
                    className="vehicle-card"
                    key={vehicle.id}
                  >

                    {/* IMAGE */}

                    <div className="vehicle-image">

                      {image ? (

                        <img
                          src={image}
                          alt={
                            vehicleName
                          }
                        />

                      ) : (

                        <div className="car-placeholder">
                          🚘
                        </div>

                      )}

                      <span className="category-badge">
                        {
                          vehicle.category
                        }
                      </span>

                    </div>

                    {/* INFO */}

                    <div className="vehicle-info">

                      <div className="vehicle-title">

                        <div>

                          <span className="make">
                            {
                              vehicle.make
                            }
                          </span>

                          <h3>
                            {
                              vehicle.model
                            }
                          </h3>

                        </div>

                        <span
                          className={
                            vehicle.quantity >
                            0
                              ? "stock-badge"
                              : "stock-badge out"
                          }
                        >
                          {
                            vehicle.quantity >
                            0
                              ? "In Stock"
                              : "Sold Out"
                          }
                        </span>

                      </div>

                      <div className="vehicle-details">

                        <div>

                          <span>
                            Category
                          </span>

                          <strong>
                            {
                              vehicle.category
                            }
                          </strong>

                        </div>

                        <div>

                          <span>
                            Available
                          </span>

                          <strong>
                            {
                              vehicle.quantity
                            }{" "}
                            units
                          </strong>

                        </div>

                      </div>

                      <div className="vehicle-footer">

                        <div>

                          <span>
                            Price
                          </span>

                          <strong>
                            ₹
                            {Number(
                              vehicle.price
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </strong>

                        </div>

                        <div>

                          {/* ADMIN ACTIONS */}

                          {isAdmin && (
                            <div
                              style={{
                                display:
                                  "flex",
                                gap: "8px",
                                marginBottom:
                                  "8px",
                              }}
                            >

                              <button
                                type="button"
                                onClick={() =>
                                  setEditingVehicle(
                                    {
                                      ...vehicle,
                                    }
                                  )
                                }
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleRestock(
                                    vehicle.id
                                  )
                                }
                                disabled={
                                  restocking ===
                                  vehicle.id
                                }
                              >
                                {restocking ===
                                vehicle.id
                                  ? "Restocking..."
                                  : "Restock"}
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(
                                    vehicle.id
                                  )
                                }
                              >
                                Delete
                              </button>

                            </div>
                          )}

                          {/* PURCHASE */}

                          <button
                            className="purchase-button"
                            disabled={
                              vehicle.quantity ===
                                0 ||
                              purchasing ===
                                vehicle.id
                            }
                            onClick={() =>
                              handlePurchase(
                                vehicle.id
                              )
                            }
                          >
                            {
                              purchasing ===
                              vehicle.id
                                ? "Processing..."
                                : vehicle.quantity ===
                                  0
                                ? "Unavailable"
                                : "Purchase →"
                            }
                          </button>

                        </div>

                      </div>

                    </div>

                  </article>
                )
              }
            )}

          </div>

        </section>

      </main>

    </div>
  )
}

export default VehicleDashboard