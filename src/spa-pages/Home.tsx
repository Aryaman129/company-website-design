"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ChevronDown, Award, Users, Calendar, Star, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useWebsiteData } from "../hooks/useWebsiteData"

gsap.registerPlugin(ScrollTrigger)

const Home = () => {
  const { products, content, settings, loading } = useWebsiteData()
  const heroRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const productsRef = useRef<HTMLDivElement>(null)
  const testimonialsRef = useRef<HTMLDivElement>(null)

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

  // Use dynamic data or fallback to defaults
  const stats = content?.stats || [
    { number: 35, suffix: "+", label: "Years Experience", icon: "Calendar" },
    { number: 500, suffix: "+", label: "Projects Completed", icon: "Award" },
    { number: 300, suffix: "+", label: "Happy Clients", icon: "Users" },
    { number: 4.8, suffix: "/5", label: "Client Rating", icon: "Star" },
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
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            poster={content?.hero?.videoPoster || "/placeholder.svg?height=1080&width=1920"}
          >
            <source src={content?.hero?.videoUrl || "/hero-video.mp4"} type="video/mp4" />
          </video>
          <div className="absolute inset-0 video-overlay"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.img
            className="hero-logo mx-auto mb-8 h-24 w-auto"
            src={content?.hero?.logo || settings?.company?.logoLarge || "/placeholder.svg?height=96&width=384"}
            alt={settings?.company?.name || "Company Logo"}
          />

          <h1 className="hero-title text-4xl md:text-6xl lg:text-7xl font-bold font-serif mb-6">
            {content?.hero?.title || "35+ Years of Excellence"}
          </h1>

          <p className="hero-subtitle text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
            {content?.hero?.subtitle || "Premium construction materials and contracting services across Maharashtra. Building trust since 1985."}
          </p>

          <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={content?.hero?.buttons?.primary?.link || "/products"}
              className="btn-primary text-lg px-8 py-4"
            >
              {content?.hero?.buttons?.primary?.text || "Explore Products"}
              <ArrowRight className="ml-2 inline" size={20} />
            </Link>
            <Link
              href={content?.hero?.buttons?.secondary?.link || "/contact"}
              className="btn-secondary text-lg px-8 py-4"
            >
              {content?.hero?.buttons?.secondary?.text || "Get Quote"}
            </Link>
          </div>
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
      <section ref={statsRef} className="py-20 bg-gray-50">
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
                    <span className="stat-number" data-value={stat.number}>
                      0
                    </span>
                    <span className="text-gold">{stat.suffix}</span>
                  </div>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
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
              <img
                src={content?.about?.image || "/placeholder.svg?height=500&width=600"}
                alt={settings?.company?.name + " Office" || "Company Office"}
                className="rounded-xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-gold text-white p-6 rounded-xl">
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
                    <Link href="/products" className="btn-primary">View Details</Link>
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
    </div>
  )
}

export default Home
