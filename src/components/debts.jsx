"use client"

import { useState, useEffect, useRef } from "https://cdn.jsdelivr.net/npm/react@18.2.0/+esm"

function DebtsPage({ token = "dummy-token" }) {
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
    fetchDebts()
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
    setLoading(true)
    setError("")
    try {
      let url = `https://shop.uzjoylar.uz/debt/get?status=${statusFilter}`
      if (selectedUser) {
        url = `https://shop.uzjoylar.uz/debt/get?id=${selectedUser}&status=${statusFilter}`
      }
      const response = await fetch(url, {
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

  const clearUserFilter = () => {
    setSelectedUser("")
    setSelectedUserName("")
    setSearchQuery("")
  }

  const handleSearchFocus = () => {
    setShowSearchDropdown(true)
    if (!searchQuery) {
      setSearchResults(users.slice(0, 10))
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
      fetchDebts()
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

  const getTotalAmount = () => {
    return debts.reduce((total, debt) => total + debt.amount, 0)
  }

  const getStatusText = () => {
    if (statusFilter === "took") {
      return selectedUser ? `${selectedUserName}ning to'lanmagan qarzlari` : "Barcha to'lanmagan qarzlar"
    } else {
      return selectedUser ? `${selectedUserName}ning to'langan qarzlari` : "Barcha to'langan qarzlar"
    }
  }

  return (
    <div className="mx-auto p-4 sm:p-6 md:p-8 max-w-7xl container">
      <div className="mb-8">
        <h1 className="mb-3 font-bold text-slate-900 text-3xl sm:text-4xl md:text-5xl">
          Qarzlar Boshqaruvi
        </h1>
        <p className="text-slate-600 text-base sm:text-lg md:text-xl">
          Foydalanuvchilarning qarzlari va to'lovlarini kuzatib boring
        </p>
      </div>

      {error && (
        <div className="flex items-center bg-red-50 mb-6 p-4 border border-red-200 rounded-xl">
          <svg
            className="flex-shrink-0 mr-3 w-5 h-5 text-red-500"
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
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      <div className="bg-gradient-to-br from-white to-slate-50 shadow-lg mb-8 p-6 sm:p-8 border border-slate-200 rounded-3xl">
        <div className="flex lg:flex-row flex-col gap-6">
          <div className="flex-1 relative" ref={searchRef}>
            <label className="block mb-3 font-semibold text-slate-800 text-base">
              Foydalanuvchi bo'yicha filtr
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleSearchFocus}
                placeholder="Foydalanuvchi nomini qidiring..."
                className="px-5 py-4 pr-12 border-2 border-slate-200 focus:border-blue-500 rounded-2xl focus:ring-4 focus:ring-blue-100 w-full font-medium text-slate-700 transition-all duration-200"
              />
              {selectedUser ? (
                <button
                  onClick={clearUserFilter}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 hover:bg-slate-100 p-1 rounded-full text-slate-400 hover:text-slate-600 transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ) : (
                <svg
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
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
              )}
            </div>

            {showSearchDropdown && (
              <div className="absolute z-20 bg-white mt-2 border-2 border-slate-200 rounded-2xl shadow-2xl w-full max-h-64 overflow-y-auto">
                {searchLoading ? (
                  <div className="flex justify-center items-center p-6">
                    <div className="border-blue-500 border-t-2 rounded-full w-6 h-6 animate-spin"></div>
                    <span className="ml-3 text-slate-600 font-medium">Qidirilmoqda...</span>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="p-2">
                    {searchResults.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => handleUserSelect(user)}
                        className="hover:bg-slate-50 px-4 py-3 rounded-xl w-full text-left transition-all duration-200 group"
                      >
                        <div className="font-semibold text-slate-800 group-hover:text-blue-600">{user.name}</div>
                        {user.phone && <div className="text-slate-500 text-sm">{user.phone}</div>}
                      </button>
                    ))}
                  </div>
                ) : searchQuery ? (
                  <div className="p-6 text-center text-slate-500">Hech narsa topilmadi</div>
                ) : (
                  <div className="p-6 text-center text-slate-500">Qidirish uchun nom kiriting</div>
                )}
              </div>
            )}

            {selectedUser && (
              <div className="flex items-center gap-2 mt-3">
                <span className="bg-blue-100 px-3 py-1 rounded-full font-medium text-blue-700 text-sm">
                  Tanlangan: {selectedUserName}
                </span>
              </div>
            )}
          </div>

          <div className="lg:w-64">
            <label className="block mb-3 font-semibold text-slate-800 text-base">Holat bo'yicha filtr</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-5 py-4 border-2 border-slate-200 focus:border-blue-500 rounded-2xl focus:ring-4 focus:ring-blue-100 w-full font-medium text-slate-700 transition-all duration-200"
            >
              <option value="took">To'lanmagan qarzlar</option>
              <option value="gave">To'langan qarzlar</option>
            </select>
          </div>

          <div className="lg:w-auto">
            <label className="block mb-3 font-semibold text-slate-800 text-base opacity-0">Amal</label>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-emerald-500 hover:from-emerald-600 to-teal-600 hover:to-teal-700 shadow-lg hover:shadow-xl px-8 py-4 rounded-2xl w-full lg:w-auto font-semibold text-white hover:scale-105 transition-all duration-200 transform"
            >
              <svg className="inline mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Qarz qo'shish
            </button>
          </div>
        </div>
      </div>

      <div className="gap-6 grid grid-cols-1 md:grid-cols-3 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg p-6 rounded-3xl text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="mb-2 opacity-90 text-blue-100">Jami {statusFilter === "took" ? "qarz" : "to'lov"}</p>
              <p className="font-bold text-2xl">{debts.length}</p>
            </div>
            <svg className="opacity-80 w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>

        <div className={`bg-gradient-to-br shadow-lg p-6 rounded-3xl text-white ${statusFilter === "took" ? "from-red-500 to-red-600" : "from-green-500 to-green-600"}`}>
          <div className="flex justify-between items-start">
            <div>
              <p className={`mb-2 opacity-90 ${statusFilter === "took" ? "text-red-100" : "text-green-100"}`}>
                Umumiy miqdor
              </p>
              <p className="font-bold text-2xl">{getTotalAmount().toLocaleString()} so'm</p>
            </div>
            <svg className="opacity-80 w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg p-6 rounded-3xl text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="mb-2 opacity-90 text-purple-100">Status</p>
              <p className="font-bold text-lg">{statusFilter === "took" ? "To'lanmagan" : "To'langan"}</p>
            </div>
            <svg className="opacity-80 w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-xl border border-slate-200 rounded-3xl overflow-hidden">
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-6 sm:p-8 border-slate-200 border-b">
          <h2 className="mb-2 font-bold text-slate-900 text-xl sm:text-2xl">
            {getStatusText()}
          </h2>
          <p className="text-slate-600">
            {selectedUser ? `${selectedUserName}ning ${statusFilter === "took" ? "to'lanmagan" : "to'langan"} qarzlari` : `Barcha ${statusFilter === "took" ? "to'lanmagan" : "to'langan"} qarzlar ro'yxati`}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-12 sm:p-16">
            <div className="border-blue-500 border-t-4 rounded-full w-12 h-12 animate-spin"></div>
            <span className="ml-4 font-medium text-slate-600 text-lg">Yuklanmoqda...</span>
          </div>
        ) : debts.length === 0 ? (
          <div className="p-12 sm:p-16 text-center">
            <svg
              className="mx-auto mb-6 w-16 sm:w-20 h-16 sm:h-20 text-slate-400"
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
            <h3 className="mb-2 font-semibold text-slate-700 text-xl">Hech qanday ma'lumot topilmadi</h3>
            <p className="text-slate-500">
              {statusFilter === "took" ? "To'lanmagan qarzlar" : "To'langan qarzlar"} mavjud emas
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {debts.map((debt) => (
              <div key={debt.id} className="hover:bg-slate-50 p-6 sm:p-8 transition-all duration-200 group">
                <div className="flex lg:flex-row flex-col justify-between items-start lg:items-center gap-6">
                  <div className="flex-1">
                    <div className="flex sm:flex-row flex-col sm:items-center gap-4 mb-4">
                      <span
                        className={`inline-flex px-4 py-2 rounded-full font-semibold text-sm ${
                          debt.status === "took" 
                            ? "bg-red-100 text-red-700 border border-red-200" 
                            : "bg-green-100 text-green-700 border border-green-200"
                        }`}
                      >
                        {debt.status === "took" ? "To'lanmagan" : "To'langan"}
                      </span>
                      <span className="font-bold text-slate-900 text-2xl sm:text-3xl">
                        {debt.amount.toLocaleString()} so'm
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="mb-1 font-semibold text-slate-800">Foydalanuvchi:</h4>
                      <p className="font-medium text-blue-600">{getUserName(debt.user_id)}</p>
                    </div>

                    <div className="mb-4">
                      <h4 className="mb-1 font-semibold text-slate-800">Sabab:</h4>
                      <p className="text-slate-600">{debt.reason}</p>
                    </div>
                    
                    <div className="flex sm:flex-row flex-col gap-4 text-slate-500 text-sm">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Berilgan: {new Date(debt.given_time).toLocaleDateString("uz-UZ", {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</span>
                      </div>
                      {debt.taken_time && (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>To'langan: {new Date(debt.taken_time).toLocaleDateString("uz-UZ", {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {debt.status === "took" && (
                    <button
                      onClick={() => openUpdateForm(debt)}
                      className="bg-gradient-to-r from-green-500 hover:from-green-600 to-emerald-500 hover:to-emerald-600 shadow-md hover:shadow-lg px-6 py-3 rounded-2xl w-full sm:w-auto font-semibold text-white hover:scale-105 transition-all duration-200 transform"
                    >
                      <svg className="inline mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      To'langan deb belgilash
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreateForm && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 p-4">
          <div className="bg-white mx-auto p-8 rounded-3xl shadow-2xl w-full max-w-lg">
            <h2 className="mb-8 font-bold text-slate-900 text-2xl">Yangi qarz qo'shish</h2>
            {error && (
              <div className="flex items-center bg-red-50 mb-6 p-4 border border-red-200 rounded-xl">
                <svg
                  className="flex-shrink-0 mr-3 w-5 h-5 text-red-500"
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
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}
            <form onSubmit={handleCreateDebt}>
              <div className="space-y-6">
                <div>
                  <label className="block mb-3 font-semibold text-slate-800">Foydalanuvchi</label>
                  <select
                    value={formData.user_id}
                    onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                    className="px-4 py-4 border-2 border-slate-200 focus:border-emerald-500 rounded-2xl focus:ring-4 focus:ring-emerald-100 w-full font-medium text-slate-700 transition-all duration-200"
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

                <div>
                  <label className="block mb-3 font-semibold text-slate-800">Miqdor (so'm)</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="px-4 py-4 border-2 border-slate-200 focus:border-emerald-500 rounded-2xl focus:ring-4 focus:ring-emerald-100 w-full font-medium text-slate-700 transition-all duration-200"
                    required
                    min="1"
                    placeholder="Miqdorni kiriting..."
                  />
                </div>

                <div>
                  <label className="block mb-3 font-semibold text-slate-800">Sabab</label>
                  <textarea
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    className="px-4 py-4 border-2 border-slate-200 focus:border-emerald-500 rounded-2xl focus:ring-4 focus:ring-emerald-100 w-full h-32 font-medium text-slate-700 transition-all duration-200 resize-none"
                    required
                    placeholder="Qarz sababini kiriting..."
                  />
                </div>

                <div className="flex sm:flex-row flex-col gap-4">
                  <button
                    type="submit"
                    disabled={loading || !formData.user_id || !formData.amount || !formData.reason.trim()}
                    className="flex-1 bg-gradient-to-r from-emerald-500 hover:from-emerald-600 to-teal-600 hover:to-teal-700 disabled:opacity-50 px-6 py-4 rounded-2xl font-semibold text-white transition-all duration-200"
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
                    className="bg-slate-100 hover:bg-slate-200 px-6 py-4 rounded-2xl font-semibold text-slate-700 transition-all duration-200"
                  >
                    Bekor qilish
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {showUpdateForm && selectedDebt && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 p-4">
          <div className="bg-white mx-auto p-8 rounded-3xl shadow-2xl w-full max-w-lg">
            <h2 className="mb-8 font-bold text-slate-900 text-2xl">Qarz to'lovini yangilash</h2>
            {error && (
              <div className="flex items-center bg-red-50 mb-6 p-4 border border-red-200 rounded-xl">
                <svg
                  className="flex-shrink-0 mr-3 w-5 h-5 text-red-500"
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
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}
            <form onSubmit={handleUpdateDebt}>
              <div className="space-y-6">
                <div>
                  <label className="block mb-3 font-semibold text-slate-800">To'lov miqdori (so'm)</label>
                  <input
                    type="number"
                    value={updateData.amount}
                    onChange={(e) => setUpdateData({ ...updateData, amount: e.target.value })}
                    className="px-4 py-4 border-2 border-slate-200 focus:border-green-500 rounded-2xl focus:ring-4 focus:ring-green-100 w-full font-medium text-slate-700 transition-all duration-200"
                    required
                    min="1"
                    placeholder="Miqdorni kiriting..."
                  />
                </div>

                <div>
                  <label className="block mb-3 font-semibold text-slate-800">To'lov eslatmasi</label>
                  <textarea
                    value={updateData.reason}
                    onChange={(e) => setUpdateData({ ...updateData, reason: e.target.value })}
                    className="px-4 py-4 border-2 border-slate-200 focus:border-green-500 rounded-2xl focus:ring-4 focus:ring-green-100 w-full h-32 font-medium text-slate-700 transition-all duration-200 resize-none"
                    required
                    placeholder="Eslatmani kiriting..."
                  />
                </div>

                <div className="flex sm:flex-row flex-col gap-4">
                  <button
                    type="submit"
                    disabled={loading || !updateData.amount || !updateData.reason.trim()}
                    className="flex-1 bg-gradient-to-r from-green-500 hover:from-green-600 to-emerald-500 hover:to-emerald-600 disabled:opacity-50 px-6 py-4 rounded-2xl font-semibold text-white transition-all duration-200"
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
                    className="bg-slate-100 hover:bg-slate-200 px-6 py-4 rounded-2xl font-semibold text-slate-700 transition-all duration-200"
                  >
                    Bekor qilish
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default DebtsPage