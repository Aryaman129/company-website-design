"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Search, Filter, Star, ArrowRight } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const productsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (productsRef.current) {
      gsap.fromTo(
        ".product-card",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          scrollTrigger: {
            trigger: productsRef.current,
            start: "top 80%",
          },
        },
      )
    }
  }, [selectedCategory])

  const categories = [
    "All",
    "Toughened Glass",
    "Wooden Doors",
    "Aluminum Windows",
    "PVC Panels",
    "ACP Cladding",
    "Steel Doors",
    "Glazing Services",
  ]

  const products = [
    {
      id: 1,
      name: "12mm Toughened Glass Work",
      category: "Toughened Glass",
      description: "High-quality 12mm toughened glass for safety and durability",
      image: "/placeholder.svg?height=300&width=400",
      features: ["Safety Glass", "Heat Resistant", "Impact Resistant"],
      rating: 4.8,
      price: "Contact for Quote",
    },
    {
      id: 2,
      name: "Toughened Glass Door Partition",
      category: "Toughened Glass",
      description: "Modern glass partitions for office and commercial spaces",
      image: "/placeholder.svg?height=300&width=400",
      features: ["Frameless Design", "Easy Installation", "Sound Proof"],
      rating: 4.9,
      price: "Contact for Quote",
    },
    {
      id: 3,
      name: "Frameless Glass Office Partition",
      category: "Toughened Glass",
      description: "Elegant frameless glass partitions for modern offices",
      image: "/placeholder.svg?height=300&width=400",
      features: ["Modern Design", "Space Efficient", "Easy Maintenance"],
      rating: 4.7,
      price: "Contact for Quote",
    },
    {
      id: 4,
      name: "PVC False Ceiling Panel",
      category: "PVC Panels",
      description: "Decorative PVC panels for false ceiling applications",
      image: "/placeholder.svg?height=300&width=400",
      features: ["Water Resistant", "Easy Installation", "Variety of Designs"],
      rating: 4.6,
      price: "Contact for Quote",
    },
    {
      id: 5,
      name: "WPC Wall Panel",
      category: "PVC Panels",
      description: "Wood Plastic Composite panels for interior walls",
      image: "/placeholder.svg?height=300&width=400",
      features: ["Eco-Friendly", "Termite Resistant", "Low Maintenance"],
      rating: 4.8,
      price: "Contact for Quote",
    },
    {
      id: 6,
      name: "Wood Finish Wall Panels",
      category: "PVC Panels",
      description: "Premium wood finish decorative wall panels",
      image: "/placeholder.svg?height=300&width=400",
      features: ["Natural Look", "Durable Finish", "Easy to Clean"],
      rating: 4.7,
      price: "Contact for Quote",
    },
    {
      id: 7,
      name: "Laminated Flush Door",
      category: "Wooden Doors",
      description: "High-quality laminated flush doors for residential use",
      image: "/placeholder.svg?height=300&width=400",
      features: ["Smooth Finish", "Durable", "Variety of Colors"],
      rating: 4.5,
      price: "Contact for Quote",
    },
    {
      id: 8,
      name: "Pinewood Laminated Doors",
      category: "Wooden Doors",
      description: "Premium pinewood doors with laminated finish",
      image: "/placeholder.svg?height=300&width=400",
      features: ["Natural Wood", "Strong Build", "Beautiful Grain"],
      rating: 4.9,
      price: "Contact for Quote",
    },
    {
      id: 9,
      name: "Designer Chemical Doors",
      category: "Wooden Doors",
      description: "Chemically treated designer doors for enhanced durability",
      image: "/placeholder.svg?height=300&width=400",
      features: ["Chemical Treatment", "Designer Patterns", "Long Lasting"],
      rating: 4.6,
      price: "Contact for Quote",
    },
    {
      id: 10,
      name: "Aluminum Sliding Window",
      category: "Aluminum Windows",
      description: "Modern aluminum sliding windows for homes and offices",
      image: "/placeholder.svg?height=300&width=400",
      features: ["Smooth Operation", "Weather Resistant", "Energy Efficient"],
      rating: 4.8,
      price: "Contact for Quote",
    },
    {
      id: 11,
      name: "UPVC Glass Window",
      category: "Aluminum Windows",
      description: "UPVC windows with glass for better insulation",
      image: "/placeholder.svg?height=300&width=400",
      features: ["Thermal Insulation", "Sound Proof", "Low Maintenance"],
      rating: 4.7,
      price: "Contact for Quote",
    },
    {
      id: 12,
      name: "ACP Cladding Work",
      category: "ACP Cladding",
      description: "Aluminum Composite Panel cladding for building exteriors",
      image: "/placeholder.svg?height=300&width=400",
      features: ["Weather Resistant", "Fire Retardant", "Modern Look"],
      rating: 4.8,
      price: "Contact for Quote",
    },
    {
      id: 13,
      name: "HPL Exterior Wall Cladding",
      category: "ACP Cladding",
      description: "High Pressure Laminate cladding for exterior walls",
      image: "/placeholder.svg?height=300&width=400",
      features: ["UV Resistant", "Impact Resistant", "Easy Installation"],
      rating: 4.6,
      price: "Contact for Quote",
    },
    {
      id: 14,
      name: "Stainless Steel Security Door",
      category: "Steel Doors",
      description: "Heavy-duty stainless steel doors for maximum security",
      image: "/placeholder.svg?height=300&width=400",
      features: ["High Security", "Corrosion Resistant", "Strong Build"],
      rating: 4.9,
      price: "Contact for Quote",
    },
    {
      id: 15,
      name: "Glass Glazing Services",
      category: "Glazing Services",
      description: "Professional glass glazing and fabrication services",
      image: "/placeholder.svg?height=300&width=400",
      features: ["Expert Installation", "Quality Materials", "Timely Service"],
      rating: 4.7,
      price: "Contact for Quote",
    },
  ]

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="py-20 gradient-dark text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold font-serif mb-6">
              Our <span className="text-gold">Products</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Discover our comprehensive range of premium construction materials and solutions, crafted with precision
              and built to last.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-gold text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gold/10 hover:text-gold"
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section ref={productsRef} className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {selectedCategory === "All" ? "All Products" : selectedCategory}
              <span className="text-gold ml-2">({filteredProducts.length})</span>
            </h2>
            <div className="flex items-center space-x-2 text-gray-600">
              <Filter size={20} />
              <span>Showing {filteredProducts.length} products</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="product-card bg-white rounded-xl overflow-hidden shadow-lg card-hover"
                  whileHover={{ y: -8 }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                      <Star className="text-gold fill-current" size={14} />
                      <span className="text-sm font-medium">{product.rating}</span>
                    </div>
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button className="btn-primary">
                        View Details
                        <ArrowRight className="ml-2" size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-2">
                      <span className="text-xs font-medium text-gold bg-gold/10 px-2 py-1 rounded-full">
                        {product.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {product.features.slice(0, 2).map((feature, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {feature}
                          </span>
                        ))}
                        {product.features.length > 2 && (
                          <span className="text-xs text-gold">+{product.features.length - 2} more</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-gold">{product.price}</div>
                      <button className="text-gold hover:text-gold-dark font-medium text-sm">Get Quote →</button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredProducts.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <div className="text-gray-400 mb-4">
                <Filter size={64} className="mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-gold text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h2 className="text-4xl font-bold font-serif mb-6">Need Custom Solutions?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Can't find exactly what you're looking for? Our expert team can create custom solutions tailored to your
              specific requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-gold hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg transition-all duration-300"
              >
                Request Custom Quote
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white hover:bg-white hover:text-gold font-semibold py-4 px-8 rounded-lg transition-all duration-300"
              >
                Contact Our Experts
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Products
