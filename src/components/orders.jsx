"use client"

import { useState, useEffect } from "https://cdn.jsdelivr.net/npm/react@18.2.0/+esm"

const statusOptions = [
  { uz: "Kutilmoqda", en: "pending" },
  { uz: "Tasdiqlandi", en: "confirmed" },
  { uz: "Tayyorlanmoqda", en: "shipped" },
  { uz: "Tayyor", en: "completed" },
  { uz: "Yetkazildi", en: "delivered" },
  { uz: "Bekor qilindi", en: "cancelled" },
  { uz: "Qaytarilgan", en: "returned" },
]

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState("")
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState("")

  // Fetch userID from localStorage
  const userID = typeof window !== "undefined" ? localStorage.getItem("user_id") : null

  const getStatusColor = (status) => {
    switch (status) {
      case "Tasdiqlandi":
        return "bg-blue-500 text-white"
      case "Yetkazildi":
        return "bg-green-500 text-white"
      case "Kutilmoqda":
        return "bg-yellow-500 text-white"
      case "Tayyorlanmoqda":
        return "bg-orange-500 text-white"
      case "Tayyor":
        return "bg-purple-500 text-white"
      case "Bekor qilindi":
      case "Qaytarilgan":
        return "bg-red-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    const englishStatus = statusOptions.find((opt) => opt.uz === newStatus)?.en || newStatus
    try {
      const response = await fetch(`https://shop.uzjoylar.uz/order/update?id=${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: englishStatus,
        }),
      })
      if (!response.ok) throw new Error("Statusni yangilashda xatolik")
      const updatedOrder = await response.json()

      setOrders(
        orders.map((order) =>
          order.id === updatedOrder.id
            ? { ...updatedOrder, status: statusOptions.find((opt) => opt.en === updatedOrder.status)?.uz || updatedOrder.status }
            : order
        )
      )
      setExpandedOrder(null)
    } catch (error) {
      console.error("Statusni yangilashda xatolik:", error)
    }
  }

  const fetchOrders = async (statusFilter = "") => {
    setLoading(true)
    try {
      let url = `https://shop.uzjoylar.uz/order/get`

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) throw new Error("Buyurtmalarni olishda xatolik")
      const data = await response.json()
      // Map English status to Uzbek for display
      const mappedData = data.map((order) => ({
        ...order,
        status: statusOptions.find((opt) => opt.en === order.status)?.uz || order.status,
      }))
      setOrders(mappedData)
    } catch (error) {
      console.error("Buyurtmalarni olishda xatolik:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Assume token is retrieved from localStorage or another source
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null
    setToken(storedToken || "")
    if (storedToken) {
      fetchOrders(selectedStatus)
    }
  }, [token, selectedStatus])

  const handleStatusFilterChange = (e) => {
    setSelectedStatus(e.target.value)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Status Filter */}
        <div className="mb-4">
          <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-2">
            Holat bo'yicha filter
          </label>
          <select
            id="statusFilter"
            value={selectedStatus}
            onChange={handleStatusFilterChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Barchasi</option>
            {statusOptions.map((status) => (
              <option key={status.en} value={status.uz}>
                {status.uz}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Yuklanmoqda...</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Order Header */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">#{order.id}</h3>
                    <p className="text-sm text-gray-600">
                      Joylashuv: {order.location.latitude.toFixed(6)}, {order.location.longitude.toFixed(6)}
                    </p>
                    <p className="text-xs text-gray-500">{order.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <span className="text-lg font-bold text-gray-900">{order.total_price.toLocaleString()} so'm</span>
                  </div>
                </div>

                {/* Order Info */}
                <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                  <span>
                    <strong>To'lov:</strong> {order.payment_type === "cash" ? "Naqd" : "Karta"}
                  </span>
                  <button
                    onClick={() => toggleExpand(order.id)}
                    className="ml-auto text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                  >
                    {expandedOrder === order.id ? "Yashirish" : "Batafsil"}
                    <svg
                      className={`w-4 h-4 transition-transform ${expandedOrder === order.id ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Expanded Content */}
                {expandedOrder === order.id && (
                  <div className="border-t border-gray-200 pt-4">
                    {/* Order Items */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Buyurtma tarkibi:</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        {order.orders.length > 0 ? (
                          order.orders.map((item, index) => (
                            <div key={item.id} className="flex justify-between items-center py-2">
                              <div className="flex items-center gap-4">
                                <img
                                  src={item.img_url}
                                  alt={item.product_name}
                                  className="w-12 h-12 object-cover rounded"
                                />
                                <div>
                                  <span className="text-gray-700">{item.product_name}</span>
                                  <p className="text-sm text-gray-500">
                                    {item.product_size} {item.product_type} - {item.product_price.toLocaleString()} so'm
                                  </p>
                                </div>
                              </div>
                              <span className="text-gray-600">{item.count} dona</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-600">Buyurtma bo'sh</p>
                        )}
                      </div>
                    </div>

                    {/* Status Selection */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Yangi holat:</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {statusOptions.map((status) => (
                          <label
                            key={status.en}
                            className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                              order.status === status.uz
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`status-${order.id}`}
                              value={status.uz}
                              checked={order.status === status.uz}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="ml-3 text-sm font-medium text-gray-700">{status.uz}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}