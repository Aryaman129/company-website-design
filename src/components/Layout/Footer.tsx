"use client"

import { motion } from "framer-motion"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import Link from "next/link"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Products", path: "/products" },
    { name: "Contact", path: "/contact" },
  ]

  const services = [
    "Toughened Glass Works",
    "Wooden Doors",
    "Aluminum Windows",
    "PVC Panels",
    "ACP Cladding",
    "Steel Doors",
  ]



  return (
    <footer className="bg-dark-darker text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <img
              src="/Logo.png"
              alt="Shyam Trading Company"
              className="h-20 w-auto"
              onError={(e) => {
                // Fallback to original logo if Logo.png doesn't exist
                (e.target as HTMLImageElement).src = "/shyam-trading-logo.png"
              }}
            />
            <p className="text-gray-300 leading-relaxed">
              Established in 1985, Shyam Trading Company has been delivering excellence in construction materials and
              contracting services for over 35 years.
            </p>
            <div className="bg-gold/10 p-4 rounded-lg">
              <p className="text-gold font-semibold text-sm">GST: 27AGZPM2344N1ZK</p>
              <p className="text-gray-300 text-sm">Trusted since 1985</p>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold text-gold">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-gray-300 hover:text-gold transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-gold rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold text-gold">Our Services</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li
                  key={service}
                  className="text-gray-300 hover:text-gold transition-colors duration-300 cursor-pointer"
                >
                  {service}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold text-gold">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="text-gold mt-1 flex-shrink-0" size={18} />
                <div className="text-gray-300">
                  <p>Shyam Trading Co., SBI ATM juna</p>
                  <p>Bhandara Rd, Hansapuri</p>
                  <p>Nagpur, Maharashtra 440018</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="text-gold flex-shrink-0" size={18} />
                <span className="text-gray-300">+91 9422114130</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="text-gold flex-shrink-0" size={18} />
                <span className="text-gray-300">anil.shyamtrading@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="text-gold flex-shrink-0" size={18} />
                <div className="text-gray-300">
                  <p>Mon - Sat: 11:00 AM - 8:00 PM</p>
                  <p className="text-sm">Closed on Sunday</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">© {currentYear} Shyam Trading Company. All rights reserved.</p>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>GST: 27AGZPM2344N1ZK</span>
              <span>|</span>
              <span>Est. 1985</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
