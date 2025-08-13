"use client"

import { useState, useEffect } from "https://cdn.jsdelivr.net/npm/react@18.2.0/+esm"
import { Routes, Route, useNavigate } from "https://cdn.jsdelivr.net/npm/react-router-dom@6.14.0/+esm"
import Login from "./components/login.jsx"
import Dashboard from "./components/dashboard.jsx"
import Categories from "./components/category.jsx"
import Products from "./components/products.jsx"
import Users from "./components/users.jsx"
import Navbar from "./components/navbar.jsx"
import DebtsPage from "./components/debts.jsx"

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "")
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      navigate("/login")
    } else {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]))
        if (payload.role !== "admin") {
          localStorage.removeItem("token")
          setToken("")
          navigate("/login")
        }
      } catch (e) {
        console.error("Tokenni tahlil qilishda xatolik:", e)
        localStorage.removeItem("token")
        setToken("")
        navigate("/login")
      }
    }
  }, [token])

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {token && <Navbar setToken={setToken} />}
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/categories" element={<Categories token={token} />} />
        <Route path="/products" element={<Products token={token} />} />
        <Route path="/debt" element={<DebtsPage token={token} />} />
        <Route path="/users" element={<Users token={token} />} />
      </Routes>
    </div>
  )
}

export default App