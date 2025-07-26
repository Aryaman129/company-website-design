"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  login: (password: string) => boolean
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const ADMIN_PASSWORD = "admin123" // In production, this should be properly secured

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = localStorage.getItem("admin_authenticated")
    if (authStatus === "true") {
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      localStorage.setItem("admin_authenticated", "true")
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("admin_authenticated")
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
