"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Award, Users, Target, Eye, CheckCircle, Building, Handshake, Shield, Clock } from "lucide-react"
import IntroVideo from "../components/IntroVideo"

gsap.registerPlugin(ScrollTrigger)

const About = () => {
  const timelineRef = useRef<HTMLDivElement>(null)
  const valuesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Timeline animation
    if (timelineRef.current) {
      gsap.fromTo(
        ".timeline-item",
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.3,
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 80%",
          },
        },
      )
    }

    // Values animation
    if (valuesRef.current) {
      gsap.fromTo(
        ".value-card",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.2,
          scrollTrigger: {
            trigger: valuesRef.current,
            start: "top 80%",
          },
        },
      )
    }
  }, [])

  const milestones = [
    {
      year: "1985",
      title: "Company Founded",
      description: "Shyam Trading Company established in Nagpur, Maharashtra",
    },
    {
      year: "1990",
      title: "First Major Project",
      description: "Completed our first large-scale commercial building project",
    },
    {
      year: "1995",
      title: "Product Diversification",
      description: "Expanded into aluminum windows and steel door manufacturing",
    },
    {
      year: "2000",
      title: "Technology Upgrade",
      description: "Invested in modern machinery and production techniques",
    },
    {
      year: "2005",
      title: "Quality Certification",
      description: "Achieved ISO quality standards and certifications",
    },
    {
      year: "2010",
      title: "Market Expansion",
      description: "Extended services across Maharashtra and neighboring states",
    },
    {
      year: "2015",
      title: "Digital Transformation",
      description: "Implemented modern project management and customer service systems",
    },
    {
      year: "2020",
      title: "Sustainable Practices",
      description: "Adopted eco-friendly materials and sustainable construction practices",
    },
  ]

  const whyChooseUs = [
    {
      icon: Award,
      title: "Premium Quality",
      description: "We use only the finest materials and maintain strict quality control standards",
    },
    {
      icon: Clock,
      title: "Timely Delivery",
      description: "Committed to delivering projects on time, every time",
    },
    {
      icon: Users,
      title: "Expert Team",
      description: "Skilled professionals with decades of industry experience",
    },
    {
      icon: Handshake,
      title: "Customer Focus",
      description: "Dedicated to understanding and exceeding customer expectations",
    },
    {
      icon: Shield,
      title: "Reliability",
      description: "Trusted partner for over 35 years with proven track record",
    },
    {
      icon: Building,
      title: "Comprehensive Solutions",
      description: "One-stop solution for all construction material needs",
    },
  ]

  const values = [
    {
      title: "Quality Excellence",
      description: "We never compromise on quality and strive for perfection in every project",
    },
    {
      title: "Customer Satisfaction",
      description: "Our success is measured by the satisfaction and trust of our clients",
    },
    {
      title: "Innovation",
      description: "Continuously adopting new technologies and methods to serve better",
    },
    {
      title: "Integrity",
      description: "Honest, transparent, and ethical business practices in all our dealings",
    },
    {
      title: "Sustainability",
      description: "Committed to environmentally responsible construction practices",
    },
    {
      title: "Team Work",
      description: "Collaborative approach with clients, partners, and team members",
    },
  ]

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
              About <span className="text-gold">Shyam Trading</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Building excellence since 1985. We are a leading contractor specializing in diverse interior and exterior
              building projects, with over three decades of experience in delivering premium construction materials and
              services.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold font-serif mb-6">
                Our <span className="text-gold">Journey</span>
              </h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Established in 1985 in Nagpur, Maharashtra, Shyam Trading Company began as a small trading business with
                a vision to provide premium construction materials to the growing construction industry in the region.
              </p>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Over the years, we have evolved into a comprehensive solution provider, offering everything from
                toughened glass works to wooden doors, aluminum windows, and steel fabrication. Our commitment to
                quality and customer satisfaction has been the cornerstone of our success.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Today, we proudly serve clients across Maharashtra and beyond, having completed over 500 projects and
                earned the trust of more than 300 satisfied customers.
              </p>
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
              <div className="absolute -top-6 -right-6 bg-gold text-white p-6 rounded-xl text-center">
                <div className="text-3xl font-bold">1985</div>
                <div className="text-sm">Founded</div>
              </div>
            </motion.div>
          </div>

          {/* Timeline */}
          <div ref={timelineRef} className="relative">
            <h3 className="text-3xl font-bold text-center mb-16">
              Our <span className="text-gold">Milestones</span>
            </h3>
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full timeline-line"></div>
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`timeline-item flex items-center mb-12 ${
                    index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                  }`}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8"}`}>
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                      <div className="text-gold font-bold text-xl mb-2">{milestone.year}</div>
                      <h4 className="font-semibold text-lg mb-2">{milestone.title}</h4>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 timeline-dot rounded-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white p-8 rounded-xl shadow-lg"
            >
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mb-6">
                <Eye className="text-gold" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To be the most trusted and preferred partner in the construction industry, known for delivering
                exceptional quality materials and services that exceed customer expectations while contributing to the
                development of sustainable and beautiful built environments.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white p-8 rounded-xl shadow-lg"
            >
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mb-6">
                <Target className="text-gold" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To provide premium quality construction materials and contracting services through innovative solutions,
                expert craftsmanship, and unwavering commitment to customer satisfaction, while maintaining the highest
                standards of integrity and professionalism in all our business dealings.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-serif mb-4">
              Why Choose <span className="text-gold">Shyam Trading</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover what sets us apart and makes us the preferred choice for construction materials and contracting
              services.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="text-gold" size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section ref={valuesRef} className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-serif mb-4">
              Our <span className="text-gold">Values</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              The core principles that guide our business and define our commitment to excellence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="value-card bg-white p-6 rounded-xl shadow-lg border-t-4 border-gold">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="text-gold flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-gold text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h2 className="text-4xl font-bold font-serif mb-6">Partner With Us Today</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Experience the difference that 35+ years of expertise can make in your next project. Let's build something
              extraordinary together.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-gold hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg transition-all duration-300"
            >
              Start Your Project
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default About
