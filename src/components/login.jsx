"use client"

import { useState } from "https://cdn.jsdelivr.net/npm/react@18.2.0/+esm"
import { useNavigate } from "https://cdn.jsdelivr.net/npm/react-router-dom@6.14.0/+esm"

function Login({ setToken }) {
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch("https://shop.uzjoylar.uz/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      })
      const data = await response.json()
      if (response.ok && data.token) {
        const payload = JSON.parse(atob(data.token.split(".")[1]))
        if (payload.role === "admin") {
          localStorage.setItem("token", data.token)
          setToken(data.token)
          navigate("/")
        } else {
          setError("Ruxsat berilmadi: Administrator roli talab qilinadi")
        }
      } else {
        setError("Noto‘g‘ri ma’lumotlar")
      }
    } catch (err) {
      setError("Kirish amalga oshmadi")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center bg-gradient-to-br from-slate-50 to-slate-100 p-4 min-h-screen">
      <div className="bg-white shadow-2xl p-8 border border-slate-200 rounded-2xl w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex bg-gradient-to-r from-blue-600 to-purple-600 mb-4 p-3 rounded-xl">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="mb-2 font-bold text-slate-800 text-3xl">Admin Kirishi</h2>
          <p className="text-slate-600">Admin paneliga kirish uchun tizimga kiring</p>
        </div>

        {error && (
          <div className="flex items-center bg-red-50 mb-6 p-4 border border-red-200 rounded-lg">
            <svg className="mr-3 w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block mb-2 font-medium text-slate-700 text-sm">Login</label>
            <input
              type="text"
              placeholder="Loginingizni kiriting"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="px-4 py-3 border border-slate-300 focus:border-blue-500 rounded-lg outline-none focus:ring-2 focus:ring-blue-200 w-full transition-all duration-200"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-slate-700 text-sm">Parol</label>
            <input
              type="password"
              placeholder="Parolingizni kiriting"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-3 border border-slate-300 focus:border-blue-500 rounded-lg outline-none focus:ring-2 focus:ring-blue-200 w-full transition-all duration-200"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex justify-center items-center bg-gradient-to-r from-blue-600 hover:from-blue-700 to-purple-600 hover:to-purple-700 disabled:opacity-50 px-4 py-3 rounded-lg w-full font-medium text-white hover:scale-[1.02] disabled:hover:scale-100 transition-all duration-200 transform"
          >
            {loading ? (
              <>
                <svg className="mr-2 w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Kirilmoqda...
              </>
            ) : (
              "Kirish"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login