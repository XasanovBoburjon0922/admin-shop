"use client"

import { useState, useEffect } from "https://cdn.jsdelivr.net/npm/react@18.2.0/+esm"

function Users({ token }) {
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({ name: "", phone_number: "", password: "" })
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("") // New state for search query

  const fetchUsers = async () => {
    try {
      const url = searchQuery
        ? `https://shop.uzjoylar.uz/users/list?name=${encodeURIComponent(searchQuery)}`
        : "https://shop.uzjoylar.uz/users/list"
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      setUsers(data.users || [])
    } catch (err) {
      console.error("Foydalanuvchilarni olishda xatolik:", err)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [searchQuery]) // Re-fetch users when searchQuery changes

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value) // Update search query state
  }

  const handleCreateOrUpdate = async () => {
    if (!form.name.trim() || !form.phone_number.trim()) return
    if (!editingId && !form.password.trim()) return

    setLoading(true)
    const url = editingId
      ? `https://shop.uzjoylar.uz/users/update?id=${editingId}`
      : "https://shop.uzjoylar.uz/users/create"
    const method = editingId ? "PUT" : "POST"
    try {
      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })
      setForm({ name: "", phone_number: "", password: "" })
      setEditingId(null)
      fetchUsers()
    } catch (err) {
      console.error("Foydalanuvchini saqlashda xatolik:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (user) => {
    setForm({ name: user.name, phone_number: user.phone_number, password: "" })
    setEditingId(user.id)
  }

  const handleDelete = async (id) => {
    if (!confirm("Ushbu foydalanuvchini o‘chirishni xohlaysizmi?")) return

    try {
      await fetch(`https://shop.uzjoylar.uz/users/delete?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchUsers()
    } catch (err) {
      console.error("Foydalanuvchini o‘chirishda xatolik:", err)
    }
  }

  const handleCancel = () => {
    setForm({ name: "", phone_number: "", password: "" })
    setEditingId(null)
  }

  return (
    <div className="mx-auto p-8 container">
      <div className="mb-8">
        <h1 className="mb-2 font-bold text-slate-800 text-4xl">Foydalanuvchilar</h1>
        <p className="text-slate-600 text-lg">Foydalanuvchi hisoblarini va ma’lumotlarini boshqaring</p>
      </div>

    

      {/* User Form */}
      <div className="bg-white shadow-lg mb-8 p-6 border border-slate-200 rounded-2xl">
        <h2 className="mb-6 font-semibold text-slate-800 text-xl">
          {editingId ? "Foydalanuvchini Tahrirlash" : "Yangi Foydalanuvchi Qo‘shish"}
        </h2>
        <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="block mb-2 font-medium text-slate-700 text-sm">To‘liq Ism</label>
            <input
              type="text"
              name="name"
              placeholder="To‘liq ismni kiriting"
              value={form.name}
              onChange={handleInputChange}
              className="px-4 py-3 border border-slate-300 focus:border-blue-500 rounded-lg outline-none focus:ring-2 focus:ring-blue-200 w-full transition-all duration-200"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-slate-700 text-sm">Telefon Raqami</label>
            <input
              type="text"
              name="phone_number"
              placeholder="Telefon raqamini kiriting"
              value={form.phone_number}
              onChange={handleInputChange}
              className="px-4 py-3 border border-slate-300 focus:border-blue-500 rounded-lg outline-none focus:ring-2 focus:ring-blue-200 w-full transition-all duration-200"
            />
          </div>

          {!editingId && (
            <div>
              <label className="block mb-2 font-medium text-slate-700 text-sm">Parol</label>
              <input
                type="password"
                name="password"
                placeholder="Parolni kiriting"
                value={form.password}
                onChange={handleInputChange}
                className="px-4 py-3 border border-slate-300 focus:border-blue-500 rounded-lg outline-none focus:ring-2 focus:ring-blue-200 w-full transition-all duration-200"
              />
            </div>
          )}
        </div>
        

        <div className="flex gap-4 mt-6">
          <button
            onClick={handleCreateOrUpdate}
            disabled={
              loading || !form.name.trim() || !form.phone_number.trim() || (!editingId && !form.password.trim())
            }
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
            {editingId ? "Foydalanuvchini Yangilash" : "Foydalanuvchi Yaratish"}
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
  {/* Search Input */}
  <div className="mb-6">
        <label className="block mb-2 font-medium text-slate-700 text-sm">Ism bo‘yicha qidirish</label>
        <input
          type="text"
          placeholder="Foydalanuvchi ismini kiriting"
          value={searchQuery}
          onChange={handleSearchChange}
          className="px-4 py-3 border border-slate-300 focus:border-blue-500 rounded-lg outline-none focus:ring-2 focus:ring-blue-200 w-full md:w-1/2 lg:w-1/3 transition-all duration-200"
        />
      </div>
      {/* Users Grid */}
      <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white hover:shadow-xl p-6 border border-slate-200 rounded-2xl transition-all duration-300"
          >
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 mr-4 p-3 rounded-full">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">{user.name}</h3>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center">
                <svg className="mr-3 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span className="text-slate-600 text-sm">{user.phone_number}</span>
              </div>

              <div className="flex items-center">
                <svg className="mr-3 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
                <span className="text-slate-600 text-sm">
                  Qarz:{" "}
                  <span className={user.debt > 0 ? "text-red-600 font-semibold" : "text-green-600"}>{user.debt} so'm</span>
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-slate-200 border-t">
              <button
                onClick={() => handleEdit(user)}
                className="flex flex-1 justify-center items-center hover:bg-blue-50 p-2 rounded-lg text-blue-600 transition-all duration-200"
              >
                <svg className="mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Tahrirlash
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                className="flex flex-1 justify-center items-center hover:bg-red-50 p-2 rounded-lg text-red-600 transition-all duration-200"
              >
                <svg className="mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                O‘chirish
              </button>
            </div>
          </div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="py-12 text-center">
          <svg className="mx-auto mb-4 w-16 h-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
            />
          </svg>
          <h3 className="mb-2 font-semibold text-slate-600 text-xl">Hali foydalanuvchilar yo‘q</h3>
          <p className="text-slate-500">Birinchi foydalanuvchingizni qo‘shishdan boshlang</p>
        </div>
      )}
    </div>
  )
}

export default Users