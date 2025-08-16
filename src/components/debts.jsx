"use client"

import { useState, useEffect, useRef } from "https://cdn.jsdelivr.net/npm/react@18.2.0/+esm"


function DebtsPage({ token}) {
  const [debts, setDebts] = useState([])
  const [users, setUsers] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedUser, setSelectedUser] = useState("")
  const [selectedUserName, setSelectedUserName] = useState("")
  const [statusFilter, setStatusFilter] = useState("took")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showUpdateForm, setShowUpdateForm] = useState(false)
  const [selectedDebt, setSelectedDebt] = useState(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const searchRef = useRef(null)

  const [formData, setFormData] = useState({
    amount: "",
    reason: "",
    user_id: "",
  })
  const [updateData, setUpdateData] = useState({
    amount: "",
    reason: "",
    status: "gave",
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch("https://shop.uzjoylar.uz/users/list", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) throw new Error("Foydalanuvchilarni olishda xatolik")
      const data = await response.json()
      setUsers(data.users || [])
    } catch (error) {
      setError("Foydalanuvchilarni yuklashda xatolik: " + error.message)
    }
  }

  const searchUsers = async (query) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setSearchLoading(true)
    try {
      const response = await fetch(`https://shop.uzjoylar.uz/users/list?name=${encodeURIComponent(query)}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) throw new Error("Qidirishda xatolik")
      const data = await response.json()
      setSearchResults(data.users || [])
    } catch (error) {
      console.error("Qidirishda xatolik:", error)
      setSearchResults([])
    } finally {
      setSearchLoading(false)
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery && showSearchDropdown) {
        searchUsers(searchQuery)
      }
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [searchQuery, showSearchDropdown])

  const fetchDebts = async () => {
    if (!selectedUser) {
      setDebts([])
      return
    }
    setLoading(true)
    setError("")
    try {
      const response = await fetch(`https://shop.uzjoylar.uz/debt/get?id=${selectedUser}&status=${statusFilter}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) throw new Error("Qarzlarni olishda xatolik")
      const data = await response.json()
      setDebts(data.debt_logs || [])
    } catch (error) {
      setError("Qarzlarni yuklashda xatolik: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDebts()
  }, [selectedUser, statusFilter])

  const handleUserSelect = (user) => {
    setSelectedUser(user.id)
    setSelectedUserName(user.name)
    setSearchQuery(user.name)
    setShowSearchDropdown(false)
  }

  const handleSearchFocus = () => {
    setShowSearchDropdown(true)
    if (!searchQuery) {
      setSearchResults(users.slice(0, 10)) // Show first 10 users when focused
    }
  }

  const handleCreateDebt = async (e) => {
    e.preventDefault()
    if (!formData.user_id || !formData.amount || !formData.reason.trim()) {
      setError("Iltimos, barcha maydonlarni to'ldiring")
      return
    }
    if (Number(formData.amount) <= 0) {
      setError("Miqdor 0 dan katta bo'lishi kerak")
      return
    }
    setLoading(true)
    setError("")
    try {
      const response = await fetch("https://shop.uzjoylar.uz/debt/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: Number.parseFloat(formData.amount),
          reason: formData.reason,
          user_id: formData.user_id,
        }),
      })
      if (!response.ok) throw new Error("Qarz yaratishda xatolik")
      setFormData({ amount: "", reason: "", user_id: "" })
      setShowCreateForm(false)
      if (selectedUser === formData.user_id) {
        fetchDebts()
      }
    } catch (error) {
      setError("Qarz yaratishda xatolik: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateDebt = async (e) => {
    e.preventDefault()
    if (!updateData.amount || !updateData.reason.trim()) {
      setError("Iltimos, barcha maydonlarni to'ldiring")
      return
    }
    if (Number(updateData.amount) <= 0) {
      setError("Miqdor 0 dan katta bo'lishi kerak")
      return
    }
    setLoading(true)
    setError("")
    try {
      const response = await fetch(`https://shop.uzjoylar.uz/debt/update?id=${selectedDebt.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: Number.parseFloat(updateData.amount),
          reason: updateData.reason,
          status: updateData.status,
        }),
      })
      if (!response.ok) throw new Error("Qarzni yangilashda xatolik")
      setShowUpdateForm(false)
      setSelectedDebt(null)
      fetchDebts()
    } catch (error) {
      setError("Qarzni yangilashda xatolik: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const openUpdateForm = (debt) => {
    setSelectedDebt(debt)
    setUpdateData({
      amount: debt.amount.toString(),
      reason: debt.reason,
      status: "gave",
    })
    setShowUpdateForm(true)
  }

  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId)
    return user ? user.name : "Noma'lum"
  }

  return (
    <div className="mx-auto p-4 sm:p-6 md:p-8 max-w-7xl container">
      <div className="mb-6">
        <h1 className="mb-2 font-bold text-slate-800 text-2xl sm:text-3xl md:text-4xl">Qarzlar</h1>
        <p className="text-slate-600 text-sm sm:text-base md:text-lg">
          Foydalanuvchilarning qarzlari va to'lovlarini boshqaring
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center bg-red-50 mb-6 p-4 border border-red-200 rounded-lg">
          <svg
            className="flex-shrink-0 mr-2 w-5 h-5 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
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

      {/* Controls */}
      <div className="flex sm:flex-row flex-col flex-wrap items-start sm:items-center gap-4 bg-white shadow-sm mb-6 p-4 sm:p-6 border border-slate-200 rounded-2xl">
        <div className="flex-1 w-full sm:min-w-64 relative" ref={searchRef}>
          <label className="block mb-2 font-medium text-slate-700 text-sm">Foydalanuvchi qidirish</label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={handleSearchFocus}
              placeholder="Foydalanuvchi nomini kiriting..."
              className="px-4 py-3 pr-10 border border-slate-300 focus:border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 w-full text-sm sm:text-base"
            />
            <svg
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {showSearchDropdown && (
            <div className="absolute z-10 bg-white mt-1 border border-slate-200 rounded-lg shadow-lg w-full max-h-60 overflow-y-auto">
              {searchLoading ? (
                <div className="flex justify-center items-center p-4">
                  <div className="border-blue-500 border-t-2 rounded-full w-5 h-5 animate-spin"></div>
                  <span className="ml-2 text-slate-600 text-sm">Qidirilmoqda...</span>
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleUserSelect(user)}
                    className="hover:bg-slate-50 px-4 py-3 border-slate-200 border-b last:border-b-0 w-full text-left text-sm transition-colors duration-200"
                  >
                    <div className="font-medium text-slate-800">{user.name}</div>
                    {user.phone && <div className="text-slate-500 text-xs">{user.phone}</div>}
                  </button>
                ))
              ) : searchQuery ? (
                <div className="p-4 text-center text-slate-500 text-sm">Hech narsa topilmadi</div>
              ) : (
                <div className="p-4 text-center text-slate-500 text-sm">Qidirish uchun nom kiriting</div>
              )}
            </div>
          )}
        </div>

        <div className="w-full sm:min-w-48">
          <label className="block mb-2 font-medium text-slate-700 text-sm">Holat bo'yicha filtr</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-slate-300 focus:border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 w-full text-sm sm:text-base"
          >
            <option value="took">Qarz olganlar</option>
            <option value="gave">To'laganlar</option>
          </select>
        </div>

        <div className="w-full sm:w-auto">
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-orange-500 hover:from-orange-600 to-red-600 hover:to-red-700 px-6 py-3 rounded-lg w-full sm:w-auto font-medium text-white text-sm sm:text-base hover:scale-105 transition-all duration-200 transform"
          >
            <svg className="inline mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Qarz qo'shish
          </button>
        </div>
      </div>

      {/* Debts List */}
      {selectedUser && (
        <div className="bg-white shadow-sm border border-slate-200 rounded-2xl">
          <div className="p-4 sm:p-6 border-slate-200 border-b">
            <h2 className="font-bold text-slate-800 text-lg sm:text-xl">
              {statusFilter === "took" ? "To'lanmagan qarzlar" : "To'langan qarzlar"}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">{selectedUserName || getUserName(selectedUser)}</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center p-8 sm:p-12">
              <div className="border-orange-500 border-t-4 rounded-full w-8 h-8 animate-spin"></div>
            </div>
          ) : debts.length === 0 ? (
            <div className="p-8 sm:p-12 text-center">
              <svg
                className="mx-auto mb-4 w-12 sm:w-16 h-12 sm:h-16 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-slate-500 text-sm sm:text-lg">Hech qanday qarz topilmadi</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {debts.map((debt) => (
                <div key={debt.id} className="hover:bg-slate-50 p-4 sm:p-6 transition-colors duration-200">
                  <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                            debt.status === "took" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                          }`}
                        >
                          {debt.status === "took" ? "To'lanmagan" : "To'langan"}
                        </span>
                        <span className="font-bold text-slate-800 text-lg sm:text-2xl">
                          {debt.amount.toLocaleString()} so'm
                        </span>
                      </div>
                      <p className="mb-3 text-slate-600 text-sm sm:text-base">{debt.reason}</p>
                      <div className="flex sm:flex-row flex-col gap-2 sm:gap-4 text-slate-500 text-xs sm:text-sm">
                        <span>Berilgan: {new Date(debt.given_time).toLocaleDateString("uz-UZ")}</span>
                        {debt.taken_time && (
                          <span>To'langan: {new Date(debt.taken_time).toLocaleDateString("uz-UZ")}</span>
                        )}
                      </div>
                    </div>
                    {debt.status === "took" && (
                      <button
                        onClick={() => openUpdateForm(debt)}
                        className="bg-green-50 hover:bg-green-100 px-4 py-2 rounded-lg w-full sm:w-auto font-medium text-green-600 hover:text-green-700 text-sm sm:text-base transition-all duration-200"
                      >
                        To'langan deb belgilash
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create Debt Modal */}
      {showCreateForm && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 p-4">
          <div className="bg-white mx-auto p-6 sm:p-8 rounded-2xl w-full max-w-md">
            <h2 className="mb-6 font-bold text-slate-800 text-xl sm:text-2xl">Yangi qarz qo'shish</h2>
            {error && (
              <div className="flex items-center bg-red-50 mb-6 p-4 border border-red-200 rounded-lg">
                <svg
                  className="flex-shrink-0 mr-2 w-5 h-5 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
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
            <form onSubmit={handleCreateDebt}>
              <div className="mb-4">
                <label className="block mb-2 font-medium text-slate-700 text-sm">Foydalanuvchi</label>
                <select
                  value={formData.user_id}
                  onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                  className="px-4 py-3 border border-slate-300 focus:border-orange-500 rounded-lg focus:ring-2 focus:ring-orange-500 w-full text-sm sm:text-base"
                  required
                >
                  <option value="">Foydalanuvchi tanlang...</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium text-slate-700 text-sm">Miqdor (so'm)</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="px-4 py-3 border border-slate-300 focus:border-orange-500 rounded-lg focus:ring-2 focus:ring-orange-500 w-full text-sm sm:text-base"
                  required
                  min="1"
                />
              </div>
              <div className="mb-6">
                <label className="block mb-2 font-medium text-slate-700 text-sm">Sabab</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="px-4 py-3 border border-slate-300 focus:border-orange-500 rounded-lg focus:ring-2 focus:ring-orange-500 w-full h-24 text-sm sm:text-base resize-none"
                  required
                />
              </div>
              <div className="flex sm:flex-row flex-col gap-3">
                <button
                  type="submit"
                  disabled={loading || !formData.user_id || !formData.amount || !formData.reason.trim()}
                  className="flex-1 bg-gradient-to-r from-orange-500 hover:from-orange-600 to-red-600 hover:to-red-700 disabled:opacity-50 px-6 py-3 rounded-lg font-medium text-white text-sm sm:text-base transition-all duration-200"
                >
                  {loading ? (
                    <>
                      <svg className="inline mr-2 w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Yaratilmoqda...
                    </>
                  ) : (
                    "Qarz yaratish"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false)
                    setError("")
                    setFormData({ amount: "", reason: "", user_id: "" })
                  }}
                  className="bg-slate-100 hover:bg-slate-200 px-6 py-3 rounded-lg font-medium text-slate-700 text-sm sm:text-base transition-all duration-200"
                >
                  Bekor qilish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Debt Modal */}
      {showUpdateForm && selectedDebt && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 p-4">
          <div className="bg-white mx-auto p-6 sm:p-8 rounded-2xl w-full max-w-md">
            <h2 className="mb-6 font-bold text-slate-800 text-xl sm:text-2xl">Qarz to'lovini yangilash</h2>
            {error && (
              <div className="flex items-center bg-red-50 mb-6 p-4 border border-red-200 rounded-lg">
                <svg
                  className="flex-shrink-0 mr-2 w-5 h-5 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
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
            <form onSubmit={handleUpdateDebt}>
              <div className="mb-4">
                <label className="block mb-2 font-medium text-slate-700 text-sm">To'lov miqdori (so'm)</label>
                <input
                  type="number"
                  value={updateData.amount}
                  onChange={(e) => setUpdateData({ ...updateData, amount: e.target.value })}
                  className="px-4 py-3 border border-slate-300 focus:border-green-500 rounded-lg focus:ring-2 focus:ring-green-500 w-full text-sm sm:text-base"
                  required
                  min="1"
                />
              </div>
              <div className="mb-6">
                <label className="block mb-2 font-medium text-slate-700 text-sm">To'lov eslatmasi</label>
                <textarea
                  value={updateData.reason}
                  onChange={(e) => setUpdateData({ ...updateData, reason: e.target.value })}
                  className="px-4 py-3 border border-slate-300 focus:border-green-500 rounded-lg focus:ring-2 focus:ring-green-500 w-full h-24 text-sm sm:text-base resize-none"
                  required
                />
              </div>
              <div className="flex sm:flex-row flex-col gap-3">
                <button
                  type="submit"
                  disabled={loading || !updateData.amount || !updateData.reason.trim()}
                  className="flex-1 bg-gradient-to-r from-green-500 hover:from-green-600 to-emerald-600 hover:to-emerald-700 disabled:opacity-50 px-6 py-3 rounded-lg font-medium text-white text-sm sm:text-base transition-all duration-200"
                >
                  {loading ? (
                    <>
                      <svg className="inline mr-2 w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Yangilanmoqda...
                    </>
                  ) : (
                    "To'langan deb belgilash"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowUpdateForm(false)
                    setError("")
                    setSelectedDebt(null)
                  }}
                  className="bg-slate-100 hover:bg-slate-200 px-6 py-3 rounded-lg font-medium text-slate-700 text-sm sm:text-base transition-all duration-200"
                >
                  Bekor qilish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default DebtsPage
