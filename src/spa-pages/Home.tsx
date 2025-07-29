"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ChevronDown, Award, Users, Calendar, Star, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useWebsiteData } from "../hooks/useWebsiteData"
import IntroVideo from "../components/IntroVideo"
import ProductDetailsModal from "../components/ProductDetailsModal"

import { Product } from "../lib/databaseManager"

gsap.registerPlugin(ScrollTrigger)

const Home = () => {
  const { products, content, settings, loading } = useWebsiteData()
  const heroRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const productsRef = useRef<HTMLDivElement>(null)
  const testimonialsRef = useRef<HTMLDivElement>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openProductModal = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const closeProductModal = () => {
    setSelectedProduct(null)
    setIsModalOpen(false)
  }

  useEffect(() => {
    // Hero animations
    const tl = gsap.timeline()
    tl.from(".hero-logo", { scale: 0, duration: 1, ease: "back.out(1.7)" })
      .from(".hero-title", { y: 50, opacity: 0, duration: 0.8 }, "-=0.5")
      .from(".hero-subtitle", { y: 30, opacity: 0, duration: 0.8 }, "-=0.6")
      .from(".hero-buttons", { y: 30, opacity: 0, duration: 0.8 }, "-=0.4")

    // Stats counter animation
    if (statsRef.current) {
      gsap.fromTo(
        ".stat-number",
        { textContent: 0 },
        {
          textContent: (i, target) => target.getAttribute("data-value"),
          duration: 2,
          ease: "power2.out",
          snap: { textContent: 1 },
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
          },
        },
      )
    }

    // Products stagger animation
    if (productsRef.current) {
      gsap.fromTo(
        ".product-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.2,
          scrollTrigger: {
            trigger: productsRef.current,
            start: "top 80%",
          },
        },
      )
    }

    // Testimonials animation
    if (testimonialsRef.current) {
      gsap.fromTo(
        ".testimonial-card",
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.3,
          scrollTrigger: {
            trigger: testimonialsRef.current,
            start: "top 80%",
          },
        },
      )
    }
  }, [])

  // Use dynamic data from database or fallback to defaults
  const statisticsData = content?.statistics || {
    yearsExperience: "35+",
    projectsCompleted: "500+",
    happyClients: "300+",
    rating: "4.6",
    ratingOutOf: "5"
  }

  const stats = [
    { number: statisticsData.yearsExperience, suffix: "", label: "Years Experience", icon: "Calendar" },
    { number: statisticsData.projectsCompleted, suffix: "", label: "Projects Completed", icon: "Award" },
    { number: statisticsData.happyClients, suffix: "", label: "Happy Clients", icon: "Users" },
    { number: statisticsData.rating, suffix: `/${statisticsData.ratingOutOf}`, label: "Client Rating", icon: "Star" },
  ]

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Calendar': return Calendar
      case 'Award': return Award
      case 'Users': return Users
      case 'Star': return Star
      default: return Award
    }
  }

  // Use dynamic products data, show only featured products or first 6
  const featuredProducts = products?.filter(p => p.featured).slice(0, 6) ||
    products?.slice(0, 6) || []

  // Use dynamic testimonials data
  const testimonials = content?.testimonials || []

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center bg-black">
        {/* Matte Black Background with Subtle Pattern */}
        <div className="absolute inset-0 z-0 bg-black">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.1)_0%,transparent_50%)]"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-12"
          >
            <img
              className="hero-logo mx-auto h-40 md:h-48 lg:h-56 w-auto drop-shadow-2xl"
              src="/Logo.png"
              alt="Shyam Trading Company"
              onError={(e) => {
                // Fallback to original logo if Logo.png doesn't exist
                (e.target as HTMLImageElement).src = "/shyam-trading-logo.png"
              }}
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="hero-title text-4xl md:text-6xl lg:text-7xl font-bold font-serif mb-8 text-gold drop-shadow-lg"
          >
            {content?.hero?.title || "Premium Steel & Metal Solutions"}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="hero-subtitle text-xl md:text-2xl lg:text-3xl mb-12 text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            {content?.hero?.subtitle || "Your trusted partner for high-quality steel products, structural materials, and metal fabrication services since 1995."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="hero-buttons flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Link
              href={content?.hero?.buttons?.primary?.link || "/products"}
              className="group relative overflow-hidden bg-gold hover:bg-gold-dark text-black font-semibold text-lg px-10 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span className="relative z-10 flex items-center justify-center">
                {content?.hero?.buttons?.primary?.text || "View Products"}
                <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" size={20} />
              </span>
            </Link>
            <Link
              href={content?.hero?.buttons?.secondary?.link || "/contact"}
              className="group relative overflow-hidden border-2 border-gold text-gold hover:bg-gold hover:text-black font-semibold text-lg px-10 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span className="relative z-10">
                {content?.hero?.buttons?.secondary?.text || "Get Quote"}
              </span>
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
        >
          <ChevronDown size={32} />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="stats-section py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = getIconComponent(stat.icon)
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-6 bg-white rounded-xl shadow-lg"
                >
                  <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="text-gold" size={32} />
                  </div>
                  <div className="text-4xl font-bold text-dark mb-2">
                    <span className="stat-number">
                      {stat.number}
                    </span>
                    <span className="text-gold">{stat.suffix}</span>
                  </div>
                  <p className="stat-label text-gray-600 font-medium">{stat.label}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold font-serif mb-6">
                {content?.about?.title || "Building Excellence Since 1985"}
              </h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                {content?.about?.description || "Established in Nagpur, Maharashtra, Shyam Trading Company has been a leading contractor specializing in diverse interior and exterior building projects. With over three decades of experience, we have consistently delivered excellence in both commercial and residential refurbishments."}
              </p>
              <div className="space-y-4 mb-8">
                {(content?.about?.features || ["Premium Quality Materials", "Timely Project Delivery", "Expert Craftsmanship"]).map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gold rounded-full"></div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              <Link href="/about" className="btn-primary">
                Learn More About Us
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <IntroVideo
                className="w-full h-80 rounded-xl shadow-2xl"
                autoplay={true}
                muted={true}
                loop={true}
                controls={false}
              />
              <div className="absolute -bottom-6 -left-6 bg-gold text-white p-6 rounded-xl shadow-lg z-20 border-4 border-white">
                <div className="text-2xl font-bold">{content?.about?.yearsBadge?.number || "35+"}</div>
                <div className="text-sm">{content?.about?.yearsBadge?.text || "Years of Trust"}</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Products Showcase */}
      <section ref={productsRef} className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-serif mb-4">
              Our <span className="text-gold">Premium</span> Products
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover our comprehensive range of high-quality construction materials and solutions for all your
              building needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                className="product-card bg-white rounded-xl overflow-hidden shadow-lg card-hover"
                whileHover={{ y: -8 }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button
                      className="btn-primary"
                      onClick={() => openProductModal(product)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3">{product.name}</h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {product.features.slice(0, 3).map((feature, idx) => (
                      <span key={idx} className="px-3 py-1 bg-gold/10 text-gold text-sm rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/products" className="btn-primary text-lg px-8 py-4">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section ref={testimonialsRef} className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-serif mb-4">
              What Our <span className="text-gold">Clients</span> Say
            </h2>
            <p className="text-gray-600 text-lg">Don't just take our word for it - hear from our satisfied clients</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card bg-gray-50 p-8 rounded-xl relative">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-gold fill-current" size={20} />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                <div>
                  <div className="font-semibold text-dark">{testimonial.name}</div>
                  <div className="text-gold text-sm">{testimonial.company}</div>
                </div>
                <div className="absolute top-6 right-6 text-gold/20 text-6xl font-serif">"</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-gold text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h2 className="text-4xl font-bold font-serif mb-6">
              {content?.cta?.title || "Ready to Start Your Project?"}
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              {content?.cta?.description || "Get in touch with our expert team for a free consultation and quote. Let's bring your vision to life with our premium materials and services."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={content?.cta?.buttons?.primary?.link || "/contact"}
                className="bg-white text-gold hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                {content?.cta?.buttons?.primary?.text || "Get Free Quote"}
              </Link>
              <Link
                href={content?.cta?.buttons?.secondary?.link || "/products"}
                className="border-2 border-white text-white hover:bg-white hover:text-gold font-semibold py-4 px-8 rounded-lg transition-all duration-300"
              >
                {content?.cta?.buttons?.secondary?.text || "View Products"}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Product Details Modal */}
      <ProductDetailsModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeProductModal}
      />
    </div>
  )
}

export default Home
