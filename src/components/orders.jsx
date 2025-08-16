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
  const [selectedStatus, setSelectedStatus] = useState("") // Empty string for "All" filter
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Function to get uz status from en status
  const getUzStatus = (enStatus) => {
    const status = statusOptions.find((option) => option.en === enStatus)
    return status ? status.uz : enStatus // Fallback to enStatus if not found
  }

  // Function to get status color based on en status
  const getStatusColor = (enStatus) => {
    switch (enStatus) {
      case "confirmed":
        return "bg-blue-500 text-white"
      case "delivered":
        return "bg-green-500 text-white"
      case "pending":
        return "bg-yellow-500 text-white"
      case "shipped":
        return "bg-orange-500 text-white"
      case "completed":
        return "bg-purple-500 text-white"
      case "cancelled":
        return "bg-red-500 text-white"
      case "returned":
        return "bg-gray-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  // Fetch orders from API based on selected status
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      setError(null)
      try {
        const url = selectedStatus
          ? `https://shop.uzjoylar.uz/order/get?status=${selectedStatus}`
          : `https://shop.uzjoylar.uz/order/get`
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error("Failed to fetch orders")
        }
        const data = await response.json()
        setOrders(data || []) // Set orders from API response
      } catch (err) {
        setError("Buyurtmalarni yuklashda xatolik yuz berdi")
        setOrders([]) // Clear orders on error
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [selectedStatus])

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`https://shop.uzjoylar.uz/order/update?${orderId}`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      })
      if (!response.ok) {
        throw new Error("Failed to update status")
      }
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      )
      setExpandedOrder(null)
    } catch (err) {
      setError("Holatni yangilashda xatolik yuz berdi")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Status Filter */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Holat bo'yicha filter</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedStatus("")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === "" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Barchasi
            </button>
            {statusOptions.map((status) => (
              <button
                key={status.en}
                onClick={() => setSelectedStatus(status.en)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedStatus === status.en ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {status.uz}
              </button>
            ))}
          </div>
        </div>

        {/* Loading and Error States */}
        {loading && <p className="text-center text-gray-600">Yuklanmoqda...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && orders.length === 0 && !error && (
          <p className="text-center text-gray-600">Buyurtmalar topilmadi</p>
        )}

        {/* Orders List */}
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Order Header */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">#{order.id}</h3>
                  <p className="text-sm text-gray-600">
                    Joylashuv: {order.location.latitude}, {order.location.longitude}
                  </p>
                  <p className="text-xs text-gray-500">{order.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getUzStatus(order.status)}
                  </span>
                  <span className="text-lg font-bold text-gray-900">{order.total_price.toLocaleString()} so'm</span>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                <span>
                  <strong>To'lov turi:</strong> {order.payment_type === "cash" ? "Naqd" : "Karta"}
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
                          <div key={index} className="flex justify-between items-center py-2">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.img_url}
                                alt={item.product_name}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <span className="text-gray-700">
                                {item.product_name} ({item.product_size} {item.product_type})
                              </span>
                            </div>
                            <span className="text-gray-600">{item.count} dona x {item.product_price.toLocaleString()} so'm</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-600">Mahsulotlar yo'q</p>
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
                            order.status === status.en
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`status-${order.id}`}
                            value={status.en}
                            checked={order.status === status.en}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
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
        ))}
      </div>
    </div>
  )
}