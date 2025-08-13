"use client"

import { useState, useEffect } from "https://cdn.jsdelivr.net/npm/react@18.2.0/+esm"

function Categories({ token }) {
  const [categories, setCategories] = useState([])
  const [name, setName] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchCategories = async () => {
    try {
      const response = await fetch("https://shop.uzjoylar.uz/category/list", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      setCategories(data.Categorys || [])
    } catch (err) {
      console.error("Kategoriyalarni olishda xatolik:", err)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleCreateOrUpdate = async () => {
    if (!name.trim()) return

    setLoading(true)
    const url = editingId
      ? `https://shop.uzjoylar.uz/category/update?id=${editingId}`
      : "https://shop.uzjoylar.uz/category/create"
    const method = editingId ? "PUT" : "POST"
    try {
      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      })
      setName("")
      setEditingId(null)
      fetchCategories()
    } catch (err) {
      console.error("Kategoriyani saqlashda xatolik:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (category) => {
    setName(category.name)
    setEditingId(category.id)
  }

  const handleDelete = async (id) => {
    if (!confirm("Ushbu kategoriyani o‘chirishni xohlaysizmi?")) return

    try {
      await fetch(`https://shop.uzjoylar.uz/category/delete?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchCategories()
    } catch (err) {
      console.error("Kategoriyani o‘chirishda xatolik:", err)
    }
  }

  const handleCancel = () => {
    setName("")
    setEditingId(null)
  }

  return (
    <div className="mx-auto p-8 container">
      <div className="mb-8">
        <h1 className="mb-2 font-bold text-slate-800 text-4xl">Kategoriyalar</h1>
        <p className="text-slate-600 text-lg">Mahsulotlaringizni kategoriyalar bilan tartibga soling</p>
      </div>

      <div className="bg-white shadow-lg mb-8 p-6 border border-slate-200 rounded-2xl">
        <h2 className="mb-4 font-semibold text-slate-800 text-xl">
          {editingId ? "Kategoriyani Tahrirlash" : "Yangi Kategoriya Qo‘shish"}
        </h2>
        <div className="flex sm:flex-row flex-col gap-4">
          <input
            type="text"
            placeholder="Kategoriya nomi"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 px-4 py-3 border border-slate-300 focus:border-blue-500 rounded-lg outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            onKeyPress={(e) => e.key === "Enter" && handleCreateOrUpdate()}
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreateOrUpdate}
              disabled={loading || !name.trim()}
              className="flex items-center bg-gradient-to-r from-blue-600 hover:from-blue-700 to-blue-700 hover:to-blue-800 disabled:opacity-50 px-6 py-3 rounded-lg font-medium text-white transition-all duration-200"
            >
              {loading ? (
                <svg className="mr-2 w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : editingId ? (
                <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              ) : (
                <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              )}
              {editingId ? "Yangilash" : "Yaratish"}
            </button>
            {editingId && (
              <button
                onClick={handleCancel}
                className="hover:bg-slate-50 px-6 py-3 border border-slate-200 rounded-lg font-medium text-slate-700 transition-all duration-200"
              >
                Bekor qilish
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white hover:shadow-lg p-6 border border-slate-200 rounded-2xl transition-all duration-200"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="mb-2 font-semibold text-slate-800 text-lg">{category.name}</h3>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleEdit(category)}
                  className="hover:bg-blue-50 p-2 rounded-lg text-blue-600 transition-all duration-200"
                  title="Kategoriyani tahrirlash"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="hover:bg-red-50 p-2 rounded-lg text-red-600 transition-all duration-200"
                  title="Kategoriyani o‘chirish"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="py-12 text-center">
          <svg className="mx-auto mb-4 w-16 h-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <h3 className="mb-2 font-semibold text-slate-600 text-xl">Hali kategoriyalar yo‘q</h3>
          <p className="text-slate-500">Birinchi kategoriyangizni yaratishdan boshlang</p>
        </div>
      )}
    </div>
  )
}

export default Categories