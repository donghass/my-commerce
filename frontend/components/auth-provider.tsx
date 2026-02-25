"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { authApi } from "@/lib/api/auth"

type User = {
  id: number
  name: string
  email: string
  phone?: string
  avatar?: string
  role: "USER" | "ADMIN"
} | null

type AuthContextType = {
  user: User
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, phone: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user")
        const accessToken = localStorage.getItem("accessToken")

        if (storedUser && accessToken) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Authentication error:", error)
        setUser(null)
        localStorage.removeItem("user")
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await authApi.login({ email, password })

      const userData = {
        id: response.userId,
        name: response.name,
        email: response.email,
        role: response.role as "USER" | "ADMIN",
      }

      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
      localStorage.setItem("accessToken", response.accessToken)
      localStorage.setItem("refreshToken", response.refreshToken)
    } catch (error: any) {
      console.error("Login error:", error)
      throw new Error(error.response?.data?.message || "로그인에 실패했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string, phone: string) => {
    setIsLoading(true)
    try {
      const response = await authApi.signup({ name, email, password, phone })

      const userData = {
        id: response.userId,
        name: response.name,
        email: response.email,
        role: response.role as "USER" | "ADMIN",
      }

      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
      localStorage.setItem("accessToken", response.accessToken)
      localStorage.setItem("refreshToken", response.refreshToken)
    } catch (error: any) {
      console.error("Registration error:", error)
      throw new Error(error.response?.data?.message || "회원가입에 실패했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setUser(null)
      localStorage.removeItem("user")
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
    }
  }

  const refreshUser = async () => {
    try {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        const userData = JSON.parse(storedUser)
        setUser(userData)
      }
    } catch (error) {
      console.error("Refresh user error:", error)
    }
  }

  return <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshUser }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
