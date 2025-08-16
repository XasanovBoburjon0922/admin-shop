"use client"

import { useState } from "https://cdn.jsdelivr.net/npm/react@18.2.0/+esm"
import { Link, useNavigate, useLocation } from "https://cdn.jsdelivr.net/npm/react-router-dom@6.14.0/+esm"

function Navbar({ setToken }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("token")
    setToken("")
    navigate("/login")
  }

  const isActive = (path) => location.pathname === path

  const navLinks = [
    { path: "/", label: "Boshqaruv Paneli" },
    { path: "/categories", label: "Kategoriyalar" },
    { path: "/products", label: "Mahsulotlar" },
    { path: "/users", label: "Foydalanuvchilar" },
    { path: "/debt", label: "Qarzlar" },
    { path: "/orders", label: "Buyurtmalar" },
  ];

  return (
    <nav className="bg-white shadow-lg border-slate-200 border-b">
      <div className="mx-auto px-4 sm:px-6 md:px-8 max-w-7xl container">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <span className="font-bold text-slate-800 text-lg sm:text-xl">Admin Paneli</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
                  isActive(link.path) ? "bg-blue-100 text-blue-700 shadow-sm" : "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="ml-4 pl-4 border-slate-200 border-l">
              <button
                onClick={handleLogout}
                className="bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg font-medium text-red-600 hover:text-red-700 text-sm sm:text-base transition-all duration-200"
              >
                Chiqish
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg focus:outline-none text-slate-600 hover:text-slate-800"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-slate-200 border-t">
            <div className="flex flex-col space-y-2 p-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
                    isActive(link.path) ? "bg-blue-100 text-blue-700 shadow-sm" : "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  handleLogout()
                  setIsMenuOpen(false)
                }}
                className="bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg font-medium text-red-600 hover:text-red-700 text-sm text-left transition-all duration-200"
              >
                Chiqish
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar