"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

interface FormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
  inquiryType: string
}

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>()

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Our Office",
      details: ["Ground Floor, 64, Old Bhandara Road", "Near Hansapuri, Nagpur - 440018", "Maharashtra, India"],
    },
    {
      icon: Phone,
      title: "Call Us",
      details: ["+91 9876543210", "+91 7123456789", "Toll Free: 1800-123-4567"],
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["info@shyamtradingco.in", "sales@shyamtradingco.in", "support@shyamtradingco.in"],
    },
    {
      icon: Clock,
      title: "Working Hours",
      details: ["Monday - Saturday: 9:00 AM - 6:00 PM", "Sunday: 10:00 AM - 4:00 PM", "Emergency: 24/7 Available"],
    },
  ]

  const inquiryTypes = [
    "General Inquiry",
    "Product Information",
    "Quote Request",
    "Technical Support",
    "Partnership",
    "Complaint/Feedback",
  ]

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("Form submitted:", data)
    toast.success("Thank you! Your message has been sent successfully. We will get back to you soon.")
    reset()
    setIsSubmitting(false)
  }

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
              Get In <span className="text-gold">Touch</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Ready to start your project? Have questions about our products? We're here to help and would love to hear
              from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg text-center card-hover"
              >
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <info.icon className="text-gold" size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-4">{info.title}</h3>
                <div className="space-y-2">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-600 text-sm">
                      {detail}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold font-serif mb-6">
                Send Us a <span className="text-gold">Message</span>
              </h2>
              <p className="text-gray-600 mb-8">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      {...register("name", { required: "Name is required" })}
                      className="form-input"
                      placeholder="Your full name"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: "Invalid email address",
                        },
                      })}
                      className="form-input"
                      placeholder="your.email@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input {...register("phone")} className="form-input" placeholder="+91 9876543210" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Inquiry Type</label>
                    <select
                      {...register("inquiryType", { required: "Please select inquiry type" })}
                      className="form-input"
                    >
                      <option value="">Select inquiry type</option>
                      {inquiryTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {errors.inquiryType && <p className="text-red-500 text-sm mt-1">{errors.inquiryType.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                  <input
                    {...register("subject", { required: "Subject is required" })}
                    className="form-input"
                    placeholder="Brief subject of your inquiry"
                  />
                  {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                  <textarea
                    {...register("message", { required: "Message is required" })}
                    rows={6}
                    className="form-textarea"
                    placeholder="Please provide details about your inquiry..."
                  />
                  {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner w-5 h-5"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      <span>Send Message</span>
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* Map & Additional Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Google Maps */}
              <div className="bg-gray-200 rounded-xl overflow-hidden shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.2!2d79.0882!3d21.1458!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDA4JzQ0LjkiTiA3OcKwMDUnMTcuNSJF!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Shyam Trading Company Location"
                ></iframe>
              </div>

              {/* Why Contact Us */}
              <div className="bg-gold/5 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4">Why Contact Us?</h3>
                <div className="space-y-3">
                  {[
                    "Free consultation and project assessment",
                    "Competitive pricing and transparent quotes",
                    "Expert advice from experienced professionals",
                    "Quick response time within 24 hours",
                    "Customized solutions for your needs",
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="text-gold flex-shrink-0 mt-0.5" size={18} />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-red-50 border border-red-200 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-red-800 mb-2">Emergency Contact</h3>
                <p className="text-red-700 mb-3">For urgent matters or emergency services, call us directly:</p>
                <div className="flex items-center space-x-2 text-red-800 font-semibold">
                  <Phone size={18} />
                  <span>+91 9876543210</span>
                </div>
                <p className="text-red-600 text-sm mt-2">Available 24/7 for emergencies</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-serif mb-4">
              Frequently Asked <span className="text-gold">Questions</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Quick answers to common questions about our products and services.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                question: "What is your typical project timeline?",
                answer:
                  "Project timelines vary based on scope and complexity. Small projects typically take 1-2 weeks, while larger commercial projects may take 4-8 weeks. We provide detailed timelines during consultation.",
              },
              {
                question: "Do you provide installation services?",
                answer:
                  "Yes, we provide complete installation services with our expert team. All installations come with warranty and post-installation support.",
              },
              {
                question: "What areas do you serve?",
                answer:
                  "We primarily serve Nagpur and surrounding areas in Maharashtra. For projects outside this region, please contact us to discuss feasibility.",
              },
              {
                question: "Do you offer warranties on your products?",
                answer:
                  "Yes, all our products come with manufacturer warranties. Installation work is covered by our service warranty. Specific terms vary by product type.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg"
              >
                <h3 className="text-lg font-semibold mb-3 text-gold">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
