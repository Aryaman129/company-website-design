import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import Layout from "./components/Layout/Layout"
import Home from "./spa-pages/Home"
import About from "./spa-pages/About"
import Products from "./spa-pages/Products"
import Contact from "./spa-pages/Contact"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import AdminLogin from "./admin/components/AdminLogin"
import AdminLayout from "./admin/components/AdminLayout"
import AdminDashboard from "./admin/pages/AdminDashboard"
import ProductManagement from "./admin/pages/ProductManagement"
import ImageManagement from "./admin/pages/ImageManagement"
import ContentManagement from "./admin/pages/ContentManagement"
import SettingsManagement from "./admin/pages/SettingsManagement"
import TestimonialsManagement from "./admin/pages/TestimonialsManagement"
import "./index.css"

// Protected Admin Route Component
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return isAuthenticated ? <>{children}</> : <AdminLogin />
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <Layout>
                <Home />
              </Layout>
            } />
            <Route path="/about" element={
              <Layout>
                <About />
              </Layout>
            } />
            <Route path="/products" element={
              <Layout>
                <Products />
              </Layout>
            } />
            <Route path="/contact" element={
              <Layout>
                <Contact />
              </Layout>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedAdminRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedAdminRoute>
            } />
            <Route path="/admin/products" element={
              <ProtectedAdminRoute>
                <AdminLayout>
                  <ProductManagement />
                </AdminLayout>
              </ProtectedAdminRoute>
            } />
            <Route path="/admin/images" element={
              <ProtectedAdminRoute>
                <AdminLayout>
                  <ImageManagement />
                </AdminLayout>
              </ProtectedAdminRoute>
            } />
            <Route path="/admin/content" element={
              <ProtectedAdminRoute>
                <AdminLayout>
                  <ContentManagement />
                </AdminLayout>
              </ProtectedAdminRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedAdminRoute>
                <AdminLayout>
                  <SettingsManagement />
                </AdminLayout>
              </ProtectedAdminRoute>
            } />
            <Route path="/admin/testimonials" element={
              <ProtectedAdminRoute>
                <AdminLayout>
                  <TestimonialsManagement />
                </AdminLayout>
              </ProtectedAdminRoute>
            } />
          </Routes>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#1f2937",
                color: "#fff",
                border: "1px solid #D4AF37",
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
