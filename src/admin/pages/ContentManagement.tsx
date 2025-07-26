"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Save, RefreshCw, Eye, FileText } from "lucide-react"
import toast from "react-hot-toast"

interface ContentData {
  hero: {
    title: string
    subtitle: string
    videoUrl: string
    videoPoster: string
    logo: string
    buttons: {
      primary: { text: string; link: string }
      secondary: { text: string; link: string }
    }
  }
  about: {
    title: string
    description: string
    image: string
    features: string[]
    yearsBadge: { number: string; text: string }
  }
  cta: {
    title: string
    description: string
    buttons: {
      primary: { text: string; link: string }
      secondary: { text: string; link: string }
    }
  }
}

const ContentManagement = () => {
  const [content, setContent] = useState<ContentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("hero")

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      const response = await fetch('/data/content.json')
      const data = await response.json()
      setContent(data)
    } catch (error) {
      console.error('Error loading content:', error)
      toast.error('Failed to load content')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!content) return

    setSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // In a real app, this would save to the server
      console.log('Saving content:', content)
      
      toast.success('Content saved successfully!')
    } catch (error) {
      toast.error('Failed to save content')
    } finally {
      setSaving(false)
    }
  }

  const updateContent = (section: keyof ContentData, field: string, value: any) => {
    if (!content) return

    setContent(prev => ({
      ...prev!,
      [section]: {
        ...prev![section],
        [field]: value
      }
    }))
  }

  const updateNestedContent = (section: keyof ContentData, path: string[], value: any) => {
    if (!content) return

    setContent(prev => {
      const newContent = { ...prev! }
      let current: any = newContent[section]
      
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]]
      }
      
      current[path[path.length - 1]] = value
      return newContent
    })
  }

  const tabs = [
    { id: "hero", name: "Hero Section", icon: FileText },
    { id: "about", name: "About Section", icon: FileText },
    { id: "cta", name: "Call to Action", icon: FileText }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Failed to load content</p>
        <button onClick={loadContent} className="btn-primary mt-4">
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
          <p className="text-gray-600 mt-2">Edit your website content and copy</p>
        </div>
        <div className="flex space-x-3">
          <motion.button
            onClick={() => window.open('/', '_blank')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-300"
          >
            <Eye size={16} />
            <span>Preview</span>
          </motion.button>
          <motion.button
            onClick={handleSave}
            disabled={saving}
            whileHover={{ scale: saving ? 1 : 1.05 }}
            whileTap={{ scale: saving ? 1 : 0.95 }}
            className="flex items-center space-x-2 bg-gold hover:bg-gold-dark text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <RefreshCw className="animate-spin" size={16} />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Save Changes</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-gold text-gold'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon size={16} />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Hero Section */}
          {activeTab === "hero" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hero Title
                </label>
                <input
                  type="text"
                  value={content.hero.title}
                  onChange={(e) => updateContent('hero', 'title', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hero Subtitle
                </label>
                <textarea
                  value={content.hero.subtitle}
                  onChange={(e) => updateContent('hero', 'subtitle', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Button Text
                  </label>
                  <input
                    type="text"
                    value={content.hero.buttons.primary.text}
                    onChange={(e) => updateNestedContent('hero', ['buttons', 'primary', 'text'], e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Button Link
                  </label>
                  <input
                    type="text"
                    value={content.hero.buttons.primary.link}
                    onChange={(e) => updateNestedContent('hero', ['buttons', 'primary', 'link'], e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secondary Button Text
                  </label>
                  <input
                    type="text"
                    value={content.hero.buttons.secondary.text}
                    onChange={(e) => updateNestedContent('hero', ['buttons', 'secondary', 'text'], e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secondary Button Link
                  </label>
                  <input
                    type="text"
                    value={content.hero.buttons.secondary.link}
                    onChange={(e) => updateNestedContent('hero', ['buttons', 'secondary', 'link'], e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* About Section */}
          {activeTab === "about" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  About Title
                </label>
                <input
                  type="text"
                  value={content.about.title}
                  onChange={(e) => updateContent('about', 'title', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  About Description
                </label>
                <textarea
                  value={content.about.description}
                  onChange={(e) => updateContent('about', 'description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Features (one per line)
                </label>
                <textarea
                  value={content.about.features.join('\n')}
                  onChange={(e) => updateContent('about', 'features', e.target.value.split('\n').filter(f => f.trim()))}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent resize-none"
                />
              </div>
            </motion.div>
          )}

          {/* CTA Section */}
          {activeTab === "cta" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CTA Title
                </label>
                <input
                  type="text"
                  value={content.cta.title}
                  onChange={(e) => updateContent('cta', 'title', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CTA Description
                </label>
                <textarea
                  value={content.cta.description}
                  onChange={(e) => updateContent('cta', 'description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent resize-none"
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ContentManagement
