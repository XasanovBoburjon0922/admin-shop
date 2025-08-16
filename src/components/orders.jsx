"use client"

import { useState, useEffect } from "https://cdn.jsdelivr.net/npm/react@18.2.0/+esm"
import { Link } from "https://cdn.jsdelivr.net/npm/react-router-dom@6.14.0/+esm"

function Orders({ token }) {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [status, setStatus] = useState("")

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch("https://shop.uzjoylar.uz/order/get", {
                    headers: { Authorization: `Bearer ${token}` },
                })
                if (!response.ok) throw new Error("Buyurtmalarni olishda xatolik")
                const data = await response.json()
                setOrders(data)
            } catch (error) {
                console.error("Buyurtmalarni olishda xatolik:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchOrders()
    }, [token])

    const updateOrderStatus = async (orderId) => {
        try {
            const response = await fetch(`https://shop.uzjoylar.uz/order/update?id=${orderId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    status: status,
                }),
            })
            if (!response.ok) throw new Error("Statusni yangilashda xatolik")
            const updatedOrder = await response.json()

            setOrders(orders.map(order =>
                order.id === updatedOrder.id ? updatedOrder : order
            ))
            setSelectedOrder(null)
            setStatus("")
        } catch (error) {
            console.error("Statusni yangilashda xatolik:", error)
        }
    }

    const statusColors = {
        "pending": "bg-yellow-100 text-yellow-800",
        "processing": "bg-blue-100 text-blue-800",
        "completed": "bg-green-100 text-green-800",
        "cancelled": "bg-red-100 text-red-800",
    }

    return (
        <div className="mx-auto p-4 sm:p-6 md:p-8 max-w-7xl container">
            <div className="mb-6">
                <h1 className="mb-2 font-bold text-slate-800 text-2xl sm:text-3xl md:text-4xl">Buyurtmalar Ro'yxati</h1>
                <p className="text-slate-600 text-sm sm:text-base md:text-lg">
                    Barcha buyurtmalarni ko'rish va boshqarish
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Mahsulotlar
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        To'lov turi
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Umumiy narx
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Holati
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Harakatlar
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {orders.length > 0 ? (
                                    orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                                                {order.id.slice(0, 6)}...
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                {order.orders.length} ta mahsulot
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                {order.payment_type}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                                                {order.total_price.toLocaleString()} so'm
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order.status] || "bg-gray-100 text-gray-800"}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="text-blue-600 hover:text-blue-900 mr-3"
                                                >
                                                    Batafsil
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedOrder(order)
                                                        setStatus(order.status)
                                                    }}
                                                    className="text-green-600 hover:text-green-900"
                                                >
                                                    Tahrirlash
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-4 text-center text-sm text-slate-500">
                                            Hech qanday buyurtma topilmadi
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-bold text-slate-800">
                                    Buyurtma #{selectedOrder.id.slice(0, 8)}...
                                </h3>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="text-slate-400 hover:text-slate-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="mb-6">
                                <h4 className="font-medium text-slate-700 mb-2">Holati:</h4>
                                <div className="flex items-center space-x-4">
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                                        style={{ minHeight: '42px' }} // Selectni balandligini oshiramiz
                                    >
                                        <option value="confirmed">Tasdiqlash</option>
                                        <option value="shipped">Jo'natilgan</option>
                                        <option value="delivered">Yetkazib berilgan</option>
                                        <option value="pending">Kutilmoqda</option>
                                        <option value="returned">Qaytarilgan buyurtma</option>
                                        <option value="cancelled">Bekor qilingan</option>
                                        <option value="completed">Yakunlangan</option>
                                    </select>
                                    <button
                                        onClick={() => updateOrderStatus(selectedOrder.id)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                                    >
                                        Saqlash
                                    </button>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h4 className="font-medium text-slate-700 mb-2">Mahsulotlar:</h4>
                                <div className="space-y-4">
                                    {selectedOrder.orders.map((item, index) => (
                                        <div key={index} className="flex items-center border-b border-slate-200 pb-4">
                                            <img
                                                src={item.img_url || "https://via.placeholder.com/50"}
                                                alt={item.product_name}
                                                className="w-16 h-16 object-cover rounded-lg mr-4"
                                            />
                                            <div className="flex-1">
                                                <h5 className="font-medium text-slate-800">{item.product_name}</h5>
                                                <p className="text-sm text-slate-600">{item.product_type} • {item.product_size}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-slate-800">{item.count} x {item.product_price.toLocaleString()} so'm</p>
                                                <p className="text-sm text-slate-600">Jami: {(item.count * item.product_price).toLocaleString()} so'm</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-medium text-slate-700 mb-2">To'lov ma'lumotlari:</h4>
                                    <p className="text-slate-600">
                                        <span className="font-medium">To'lov turi:</span> {selectedOrder.payment_type}
                                    </p>
                                    <p className="text-slate-600">
                                        <span className="font-medium">Umumiy summa:</span> {selectedOrder.total_price.toLocaleString()} so'm
                                    </p>
                                </div>

                                <div>
                                    <h4 className="font-medium text-slate-700 mb-2">Yetkazib berish manzili:</h4>
                                    <p className="text-slate-600">{selectedOrder.description || "Manzil kiritilmagan"}</p>
                                    {selectedOrder.location && (
                                        <a
                                            href={`https://www.google.com/maps?q=${selectedOrder.location.latitude},${selectedOrder.location.longitude}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline inline-flex items-center mt-2"
                                        >
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            Xaritada ko'rish
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Orders