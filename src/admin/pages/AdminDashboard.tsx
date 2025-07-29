"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Package,
  FileText,
  Image,
  TrendingUp,
  Users,
  Eye,
  Edit,
  Plus,
  Settings,
  Video
} from "lucide-react"
import Link from "next/link"

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalImages: 0,
    contentPages: 4,
    recentActivity: []
  })

  useEffect(() => {
    // Load dashboard stats
    loadDashboardStats()
  }, [])

  const loadDashboardStats = async () => {
    try {
      // Load products
      const productsResponse = await fetch('/data/products.json')
      const products = await productsResponse.json()
      
      setStats(prev => ({
        ...prev,
        totalProducts: products.length,
        totalImages: products.length * 2, // Estimate
        recentActivity: [
          { action: "Product updated", item: "Toughened Glass Work", time: "2 hours ago" },
          { action: "Image uploaded", item: "wooden-door-1.jpg", time: "4 hours ago" },
          { action: "Content modified", item: "Hero Section", time: "1 day ago" },
          { action: "Product added", item: "Steel Security Door", time: "2 days ago" },
        ]
      }))
    } catch (error) {
      console.error('Error loading dashboard stats:', error)
    }
  }

  const quickActions = [
    {
      title: "Add New Product",
      description: "Create a new product listing",
      icon: Plus,
      link: "/admin/products/new",
      color: "bg-blue-500"
    },
    {
      title: "Upload Images",
      description: "Add new product images",
      icon: Image,
      link: "/admin/images",
      color: "bg-green-500"
    },
    {
      title: "Edit Content",
      description: "Update page content",
      icon: Edit,
      link: "/admin/content",
      color: "bg-purple-500"
    },
    {
      title: "View Website",
      description: "Preview live website",
      icon: Eye,
      link: "/",
      color: "bg-gold",
      external: true
    },
    {
      title: "Video Test",
      description: "Debug video playback",
      icon: Video,
      link: "/admin/video-test",
      color: "bg-red-500"
    }
  ]

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Content Pages",
      value: stats.contentPages,
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Images",
      value: stats.totalImages,
      icon: Image,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Site Views",
      value: "1.2k",
      icon: TrendingUp,
      color: "text-gold",
      bgColor: "bg-yellow-100"
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your website.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <stat.icon className={stat.color} size={24} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Link
                href={action.link}
                target={action.external ? "_blank" : undefined}
                className="block bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center`}>
                    <action.icon className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {stats.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-gold rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.item}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">System Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">Website Status</span>
              <span className="text-sm text-green-600 font-medium">Online</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">Database</span>
              <span className="text-sm text-green-600 font-medium">Connected</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">Last Backup</span>
              <span className="text-sm text-blue-600 font-medium">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">Storage Used</span>
              <span className="text-sm text-yellow-600 font-medium">45% (2.1GB)</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminDashboard
