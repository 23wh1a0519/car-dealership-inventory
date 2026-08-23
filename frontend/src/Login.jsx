import { useState } from "react"
import { saveToken } from "./auth"

const API_URL = "https://car-dealership-inventory-production-818d.up.railway.app"

function Login({ onLogin }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || "Invalid email or password")
      }

      saveToken(data.access_token)
      onLogin()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">

      {/* Left side */}
      <section className="login-visual">
        <div className="visual-overlay"></div>

        <div className="visual-content">
          <div className="visual-logo">
            <div className="brand-icon large">V</div>
            <span>VELOCITY MOTORS</span>
          </div>

          <div className="visual-copy">
            <p className="visual-eyebrow">
              PREMIUM AUTOMOTIVE EXPERIENCE
            </p>

            <h1>
              Drive something
              <br />
              <span>extraordinary.</span>
            </h1>

            <p>
              Discover a carefully selected collection of
              premium vehicles, built for those who expect
              more from every journey.
            </p>
          </div>

          <div className="visual-footer">
            <span>01</span>
            <div className="footer-line"></div>
            <span>VELOCITY COLLECTION</span>
          </div>
        </div>

        <div className="car-glow">
          🚘
        </div>
      </section>

      {/* Right side */}
      <section className="login-panel">
        <div className="login-container">

          <div className="mobile-logo">
            <div className="brand-icon large">V</div>
            <div>
              <strong>Velocity Motors</strong>
              <span>Vehicle Inventory</span>
            </div>
          </div>

          <div className="login-heading">
            <p>WELCOME BACK</p>
            <h2>Sign in to your account</h2>
            <span>
              Access your vehicle inventory and dealership dashboard.
            </span>
          </div>

          <form onSubmit={handleLogin} className="login-form">

            <div className="form-group">
              <label htmlFor="email">Email address</label>

              <div className="input-wrapper">
                <span className="input-icon">✉</span>

                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <div className="password-label">
                <label htmlFor="password">Password</label>
              </div>

              <div className="input-wrapper">
                <span className="input-icon">●</span>

                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && (
              <div className="login-error">
                <span>!</span>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <span>→</span>
                </>
              )}
            </button>

          </form>

          <div className="security-note">
            <span>◆</span>
            <div>
              <strong>Secure access</strong>
              <p>
                Your account is protected with secure authentication.
              </p>
            </div>
          </div>

          <p className="login-copyright">
            © 2026 Velocity Motors. All rights reserved.
          </p>

        </div>
      </section>

    </div>
  )
}

export default Login