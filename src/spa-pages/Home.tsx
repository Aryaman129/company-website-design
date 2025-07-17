"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ChevronDown, Award, Users, Calendar, Star, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

gsap.registerPlugin(ScrollTrigger)

const Home = () => {
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

  const stats = [
    { number: 35, suffix: "+", label: "Years Experience", icon: Calendar },
    { number: 500, suffix: "+", label: "Projects Completed", icon: Award },
    { number: 300, suffix: "+", label: "Happy Clients", icon: Users },
    { number: 4.8, suffix: "/5", label: "Client Rating", icon: Star },
  ]

  const products = [
    {
      title: "Toughened Glass Works",
      description: "Premium glass partitions, facades, and safety glass solutions",
      image: "/placeholder.svg?height=300&width=400",
      features: ["Safety Glass", "Partitions", "Facades"],
    },
    {
      title: "Wooden Doors",
      description: "High-quality wooden doors and frames for residential and commercial use",
      image: "/placeholder.svg?height=300&width=400",
      features: ["Premium Wood", "Custom Design", "Durable Finish"],
    },
    {
      title: "Aluminum Windows",
      description: "Modern aluminum sliding windows and door systems",
      image: "/placeholder.svg?height=300&width=400",
      features: ["Sliding Systems", "Weather Resistant", "Energy Efficient"],
    },
    {
      title: "PVC Panels",
      description: "Decorative WPC & PVC panels for interior and exterior applications",
      image: "/placeholder.svg?height=300&width=400",
      features: ["Water Resistant", "Easy Installation", "Low Maintenance"],
    },
    {
      title: "ACP Cladding",
      description: "Aluminum composite panel cladding for modern building exteriors",
      image: "/placeholder.svg?height=300&width=400",
      features: ["Fire Resistant", "Weather Proof", "Modern Design"],
    },
    {
      title: "Steel Doors",
      description: "Heavy-duty stainless steel security and safety doors",
      image: "/placeholder.svg?height=300&width=400",
      features: ["High Security", "Corrosion Resistant", "Long Lasting"],
    },
  ]

  const testimonials = [
    {
      name: "Rajesh Kumar",
      company: "Kumar Industries",
      text: "Exceptional quality and timely delivery. Shyam Trading Company has been our trusted partner for over 10 years.",
      rating: 5,
    },
    {
      name: "Priya Sharma",
      company: "Sharma Constructions",
      text: "Professional team with excellent craftsmanship. Their attention to detail is remarkable.",
      rating: 5,
    },
    {
      name: "Amit Patel",
      company: "Patel Developers",
      text: "Highly recommended for any construction project. Quality products at competitive prices.",
      rating: 5,
    },
  ]

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
            poster="/placeholder.svg?height=1080&width=1920"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 video-overlay"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.img
            className="hero-logo mx-auto mb-8 h-24 w-auto"
            src="/placeholder.svg?height=96&width=384"
            alt="Shyam Trading Company"
          />

          <h1 className="hero-title text-4xl md:text-6xl lg:text-7xl font-bold font-serif mb-6">
            <span className="text-gradient">35+ Years</span> of Excellence
          </h1>

          <p className="hero-subtitle text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
            Premium construction materials and contracting services across Maharashtra. Building trust since 1985.
          </p>

          <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products" className="btn-primary text-lg px-8 py-4">
              Explore Products
              <ArrowRight className="ml-2 inline" size={20} />
            </Link>
            <Link to="/contact" className="btn-secondary text-lg px-8 py-4">
              Get Quote
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
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 bg-white rounded-xl shadow-lg"
              >
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="text-gold" size={32} />
                </div>
                <div className="text-4xl font-bold text-dark mb-2">
                  <span className="stat-number" data-value={stat.number}>
                    0
                  </span>
                  <span className="text-gold">{stat.suffix}</span>
                </div>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </motion.div>
            ))}
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
                Building Excellence Since <span className="text-gold">1985</span>
              </h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Established in Nagpur, Maharashtra, Shyam Trading Company has been a leading contractor specializing in
                diverse interior and exterior building projects. With over three decades of experience, we have
                consistently delivered excellence in both commercial and residential refurbishments.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gold rounded-full"></div>
                  <span className="text-gray-700">Premium Quality Materials</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gold rounded-full"></div>
                  <span className="text-gray-700">Timely Project Delivery</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gold rounded-full"></div>
                  <span className="text-gray-700">Expert Craftsmanship</span>
                </div>
              </div>
              <Link to="/about" className="btn-primary">
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
                src="/placeholder.svg?height=500&width=600"
                alt="Shyam Trading Company Office"
                className="rounded-xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-gold text-white p-6 rounded-xl">
                <div className="text-2xl font-bold">35+</div>
                <div className="text-sm">Years of Trust</div>
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
            {products.map((product, index) => (
              <motion.div
                key={index}
                className="product-card bg-white rounded-xl overflow-hidden shadow-lg card-hover"
                whileHover={{ y: -8 }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.title}
                    className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="btn-primary">View Details</button>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3">{product.title}</h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {product.features.map((feature, idx) => (
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
            <Link to="/products" className="btn-primary text-lg px-8 py-4">
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
            <h2 className="text-4xl font-bold font-serif mb-6">Ready to Start Your Project?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Get in touch with our expert team for a free consultation and quote. Let's bring your vision to life with
              our premium materials and services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-white text-gold hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Get Free Quote
              </Link>
              <Link
                to="/products"
                className="border-2 border-white text-white hover:bg-white hover:text-gold font-semibold py-4 px-8 rounded-lg transition-all duration-300"
              >
                View Products
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
