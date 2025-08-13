"use client"

import { useState, useEffect } from "https://cdn.jsdelivr.net/npm/react@18.2.0/+esm"

function Products({ token }) {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({
    name: "",
    category_id: "",
    count: 0,
    description: "",
    img_url: "",
    price: 0,
    size: 0,
    type: "g",
  })
  const [editingId, setEditingId] = useState(null)
  const [filterCategory, setFilterCategory] = useState("")
  const [loading, setLoading] = useState(false)

  const fetchProducts = async (categoryId = "") => {
    const url = categoryId
      ? `https://shop.uzjoylar.uz/product/list?category_id=${categoryId}`
      : "https://shop.uzjoylar.uz/product/list"
    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      setProducts(data.Products || [])
    } catch (err) {
      console.error("Mahsulotlarni olishda xatolik:", err)
    }
  }

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
    fetchProducts()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleCreateOrUpdate = async () => {
    if (!form.name.trim() || !form.category_id) return

    setLoading(true)
    const url = editingId
      ? `https://shop.uzjoylar.uz/product/update?id=${editingId}`
      : "https://shop.uzjoylar.uz/product/create"
    const method = editingId ? "PUT" : "POST"
    try {
      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          count: parseInt(form.count),
          price: parseFloat(form.price),
          size: parseInt(form.size),
        }),
      })
      setForm({
        name: "",
        category_id: "",
        count: 0,
        description: "",
        img_url: "",
        price: 0,
        size: 0,
        type: "g",
      })
      setEditingId(null)
      fetchProducts(filterCategory)
    } catch (err) {
      console.error("Mahsulotni saqlashda xatolik:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (product) => {
    setForm(product)
    setEditingId(product.id)
  }

  const handleDelete = async (id) => {
    if (!confirm("Ushbu mahsulotni o‘chirishni xohlaysizmi?")) return

    try {
      await fetch(`https://shop.uzjoylar.uz/product/delete?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchProducts(filterCategory)
    } catch (err) {
      console.error("Mahsulotni o‘chirishda xatolik:", err)
    }
  }

  const handleFilter = (categoryId) => {
    setFilterCategory(categoryId)
    fetchProducts(categoryId)
  }

  const handleCancel = () => {
    setForm({
      name: "",
      category_id: "",
      count: 0,
      description: "",
      img_url: "",
      price: 0,
      size: 0,
      type: "g",
    })
    setEditingId(null)
  }

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId)
    return category ? category.name : "Noma’lum"
  }

  return (
    <div className="mx-auto p-8 container">
      <div className="mb-8">
        <h1 className="mb-2 font-bold text-slate-800 text-4xl">Mahsulotlar</h1>
        <p className="text-slate-600 text-lg">Mahsulot inventaringizni boshqaring</p>
      </div>

      {/* Product Form */}
      <div className="bg-white shadow-lg mb-8 p-6 border border-slate-200 rounded-2xl">
        <h2 className="mb-6 font-semibold text-slate-800 text-xl">
          {editingId ? "Mahsulotni Tahrirlash" : "Yangi Mahsulot Qo‘shish"}
        </h2>
        <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="block mb-2 font-medium text-slate-700 text-sm">Kategoriya</label>
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleInputChange}
              className="px-4 py-3 border border-slate-300 focus:border-blue-500 rounded-lg outline-none focus:ring-2 focus:ring-blue-200 w-full transition-all duration-200"
            >
              <option value="">Kategoriyani tanlang</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium text-slate-700 text-sm">Mahsulot Nomi</label>
            <input
              type="text"
              name="name"
              placeholder="Mahsulot nomi"
              value={form.name}
              onChange={handleInputChange}
              className="px-4 py-3 border border-slate-300 focus:border-blue-500 rounded-lg outline-none focus:ring-2 focus:ring-blue-200 w-full transition-all duration-200"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-slate-700 text-sm">Narx</label>
            <input
              type="number"
              name="price"
              placeholder="Narx"
              value={form.price}
              onChange={handleInputChange}
              className="px-4 py-3 border border-slate-300 focus:border-blue-500 rounded-lg outline-none focus:ring-2 focus:ring-blue-200 w-full transition-all duration-200"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-slate-700 text-sm">Soni</label>
            <input
              type="number"
              name="count"
              placeholder="Soni"
              value={form.count}
              onChange={handleInputChange}
              className="px-4 py-3 border border-slate-300 focus:border-blue-500 rounded-lg outline-none focus:ring-2 focus:ring-blue-200 w-full transition-all duration-200"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-slate-700 text-sm">Hajm</label>
            <input
              type="number"
              name="size"
              placeholder="Hajm"
              value={form.size}
              onChange={handleInputChange}
              className="px-4 py-3 border border-slate-300 focus:border-blue-500 rounded-lg outline-none focus:ring-2 focus:ring-blue-200 w-full transition-all duration-200"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-slate-700 text-sm">Birlik Turi</label>
            <select
              name="type"
              value={form.type}
              onChange={handleInputChange}
              className="px-4 py-3 border border-slate-300 focus:border-blue-500 rounded-lg outline-none focus:ring-2 focus:ring-blue-200 w-full transition-all duration-200"
            >
              <option value="g">g</option>
              <option value="ml">ml</option>
              <option value="dona">dona</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block mb-2 font-medium text-slate-700 text-sm">Tavsif</label>
            <input
              type="text"
              name="description"
              placeholder="Mahsulot tavsifi"
              value={form.description}
              onChange={handleInputChange}
              className="px-4 py-3 border border-slate-300 focus:border-blue-500 rounded-lg outline-none focus:ring-2 focus:ring-blue-200 w-full transition-all duration-200"
            />
          </div>

          <div className="md:col-span-1">
            <label className="block mb-2 font-medium text-slate-700 text-sm">Rasm URL</label>
            <input
              type="text"
              name="img_url"
              placeholder="Rasm URL"
              value={form.img_url}
              onChange={handleInputChange}
              className="px-4 py-3 border border-slate-300 focus:border-blue-500 rounded-lg outline-none focus:ring-2 focus:ring-blue-200 w-full transition-all duration-200"
            />
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={handleCreateOrUpdate}
            disabled={loading || !form.name.trim() || !form.category_id}
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
            {editingId ? "Mahsulotni Yangilash" : "Mahsulot Yaratish"}
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

      {/* Filter */}
      <div className="mb-6">
        <label className="block mb-2 font-medium text-slate-700 text-sm">Kategoriya bo‘yicha filtr</label>
        <select
          value={filterCategory}
          onChange={(e) => handleFilter(e.target.value)}
          className="px-4 py-3 border border-slate-300 focus:border-blue-500 rounded-lg outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
        >
          <option value="">Barcha Kategoriyalar</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white hover:shadow-xl p-6 border border-slate-200 rounded-2xl transition-all duration-300"
          >
            {product.img_url && (
              <div className="mb-4 rounded-lg overflow-hidden">
                <img
                  src={product.img_url || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.style.display = "none"
                  }}
                />
              </div>
            )}
            <div className="mb-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-800 text-lg">{product.name}</h3>
                <span className="bg-blue-100 px-2 py-1 rounded-full font-medium text-blue-700 text-xs">
                  {getCategoryName(product.category_id)}
                </span>
              </div>
              <p className="mb-3 text-slate-600 text-sm">{product.description}</p>
              <div className="gap-4 grid grid-cols-2 text-sm">
                <div>
                  <span className="text-slate-500">Narx:</span>
                  <span className="ml-1 font-semibold text-slate-800">{product.price} so'm</span>
                </div>
                <div>
                  <span className="text-slate-500">Zaxira:</span>
                  <span className="ml-1 font-semibold text-slate-800">{product.count}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500">Hajm:</span>
                  <span className="ml-1 font-semibold text-slate-800">
                    {product.size} {product.type}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-4 border-slate-200 border-t">
              <button
                onClick={() => handleEdit(product)}
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
                onClick={() => handleDelete(product.id)}
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

      {products.length === 0 && (
        <div className="py-12 text-center">
          <svg className="mx-auto mb-4 w-16 h-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <h3 className="mb-2 font-semibold text-slate-600 text-xl">Hali mahsulotlar yo‘q</h3>
          <p className="text-slate-500">Birinchi mahsulotingizni qo‘shishdan boshlang</p>
        </div>
      )}
    </div>
  )
}

export default Products