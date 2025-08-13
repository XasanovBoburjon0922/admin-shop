"use client"

import { useState, useEffect } from "https://cdn.jsdelivr.net/npm/react@18.2.0/+esm"
import { Link } from "https://cdn.jsdelivr.net/npm/react-router-dom@6.14.0/+esm"

function Dashboard() {
  const [stats, setStats] = useState({
    categories: 3,
    products: 2,
    users: 3,
    totalDebt: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token")
        // Replace with actual API endpoint
        const response = await fetch("https://shop.uzjoylar.uz/stats", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!response.ok) throw new Error("Statistikalarni olishda xatolik")
        const data = await response.json()
        setStats({
          categories: data.categories || 3,
          products: data.products || 2,
          users: data.users || 3,
          totalDebt: data.totalDebt || 0,
        })
      } catch (error) {
        console.error("Statistikalarni olishda xatolik:", error)
      }
    }
    fetchStats()
  }, [])

  const cards = [
    {
      title: "Kategoriyalar",
      description: "Mahsulot kategoriyalarini boshqarish",
      icon: (
        <svg className="w-6 sm:w-8 h-6 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
      link: "/categories",
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    {
      title: "Mahsulotlar",
      description: "Mahsulotlarni boshqarish",
      icon: (
        <svg className="w-6 sm:w-8 h-6 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      ),
      link: "/products",
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Foydalanuvchilar",
      description: "Foydalanuvchilarni boshqarish",
      icon: (
        <svg className="w-6 sm:w-8 h-6 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      ),
      link: "/users",
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      title: "Qarzlar",
      description: "Foydalanuvchilarning qarzlari va to‘lovlarini boshqarish",
      icon: (
        <svg className="w-6 sm:w-8 h-6 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      link: "/debt",
      color: "from-orange-500 to-red-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
  ]

  return (
    <div className="mx-auto p-4 sm:p-6 md:p-8 max-w-7xl container">
      <div className="mb-6">
        <h1 className="mb-2 font-bold text-slate-800 text-2xl sm:text-3xl md:text-4xl">Boshqaruv Paneli</h1>
        <p className="text-slate-600 text-sm sm:text-base md:text-lg">Xush kelibsiz! Do‘koningizni bu yerdan boshqaring.</p>
      </div>

      <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => (
          <Link key={index} to={card.link} className="group block">
            <div className="bg-white hover:shadow-xl p-4 sm:p-6 md:p-8 border border-slate-200 rounded-2xl transition-all hover:-translate-y-1 duration-300 transform">
              <div
                className={`inline-flex p-3 sm:p-4 ${card.bgColor} rounded-xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <div className={card.textColor}>{card.icon}</div>
              </div>
              <h2 className="mb-2 sm:mb-3 font-bold text-slate-800 group-hover:text-slate-900 text-lg sm:text-xl">{card.title}</h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{card.description}</p>
              <div className="flex items-center mt-4 sm:mt-6 font-medium text-slate-500 group-hover:text-slate-700 text-sm">
                <span>Boshqarish</span>
                <svg
                  className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1 duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-gradient-to-r from-slate-800 to-slate-900 mt-6 sm:mt-8 md:mt-12 p-4 sm:p-6 md:p-8 rounded-2xl text-white">
        <h3 className="mb-2 font-bold text-lg sm:text-xl md:text-2xl">Tez Statistikalar</h3>
        <p className="mb-4 sm:mb-6 text-slate-300 text-sm sm:text-base">Do‘koningiz faoliyatiga umumiy ko‘rinish</p>
        <div className="gap-4 sm:gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div className="text-center">
            <div className="mb-2 font-bold text-emerald-400 text-2xl sm:text-3xl">{stats.categories}</div>
            <div className="text-slate-300 text-sm sm:text-base">Jami Kategoriyalar</div>
          </div>
          <div className="text-center">
            <div className="mb-2 font-bold text-blue-400 text-2xl sm:text-3xl">{stats.products}</div>
            <div className="text-slate-300 text-sm sm:text-base">Jami Mahsulotlar</div>
          </div>
          <div className="text-center">
            <div className="mb-2 font-bold text-purple-400 text-2xl sm:text-3xl">{stats.users}</div>
            <div className="text-slate-300 text-sm sm:text-base">Faol Foydalanuvchilar</div>
          </div>
          <div className="text-center">
            <div className="mb-2 font-bold text-orange-400 text-2xl sm:text-3xl">{stats.totalDebt.toLocaleString()} so‘m</div>
            <div className="text-slate-300 text-sm sm:text-base">Jami Qarz</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard