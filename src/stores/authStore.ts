import { create } from 'zustand'
import { 
  login as firebaseLogin, 
  logout as firebaseLogout, 
  register as firebaseRegister,
  resetPassword,
  onAuthStateChange,
  updateUserProfile,
  ensureTestUser,
  type AuthError
} from '../lib/authService'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'admin' | 'user' | 'moderator'
  avatar?: string
  permissions?: string[]
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  userFriendlyError: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (email: string, password: string, firstName: string, lastName: string, role?: 'admin' | 'user' | 'moderator') => Promise<void>
  updateUser: (user: Partial<User>) => void
  checkAuth: () => void
  clearError: () => void
  resetUserPassword: (email: string) => Promise<void>
  createTestUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  userFriendlyError: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null, userFriendlyError: null })
    try {
      const firebaseUser = await firebaseLogin(email, password)
      set({ 
        user: firebaseUser, 
        isAuthenticated: true, 
        isLoading: false 
      })
    } catch (error) {
      const authError = error as AuthError;
      set({ 
        isLoading: false, 
        error: authError.message,
        userFriendlyError: authError.userFriendlyMessage
      })
    }
  },

  register: async (email: string, password: string, firstName: string, lastName: string, role = 'user') => {
    set({ isLoading: true, error: null, userFriendlyError: null })
    try {
      const firebaseUser = await firebaseRegister(email, password, firstName, lastName, role)
      set({ 
        user: firebaseUser, 
        isAuthenticated: true, 
        isLoading: false 
      })
    } catch (error) {
      const authError = error as AuthError;
      set({ 
        isLoading: false, 
        error: authError.message,
        userFriendlyError: authError.userFriendlyMessage
      })
    }
  },

  logout: async () => {
    try {
      await firebaseLogout()
      set({ 
        user: null, 
        isAuthenticated: false,
        error: null,
        userFriendlyError: null
      })
    } catch (error) {
      console.error('Logout error:', error)
    }
  },

  updateUser: async (userData: Partial<User>) => {
    const currentUser = get().user
    if (currentUser) {
      try {
        await updateUserProfile(currentUser.id, userData)
        set({
          user: { ...currentUser, ...userData }
        })
      } catch (error) {
        const authError = error as AuthError;
        set({ 
          error: authError.message,
          userFriendlyError: authError.userFriendlyMessage
        })
      }
    }
  },

  resetUserPassword: async (email: string) => {
    try {
      await resetPassword(email)
      // You might want to set a success message here
    } catch (error) {
      const authError = error as AuthError;
      set({ 
        error: authError.message,
        userFriendlyError: authError.userFriendlyMessage
      })
    }
  },

  createTestUser: async () => {
    set({ isLoading: true, error: null, userFriendlyError: null })
    try {
      await ensureTestUser()
      set({ isLoading: false })
    } catch (error) {
      const authError = error as AuthError;
      set({ 
        isLoading: false, 
        error: authError.message,
        userFriendlyError: authError.userFriendlyMessage
      })
    }
  },

  clearError: () => {
    set({ error: null, userFriendlyError: null })
  },

  checkAuth: () => {
    set({ isLoading: true })
    try {
      // Set up auth state listener
      const unsubscribe = onAuthStateChange((user) => {
        if (user) {
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false 
          })
        } else {
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false 
          })
        }
      })
      
      // Store unsubscribe function for cleanup
      return unsubscribe
    } catch (error) {
      set({ isLoading: false })
    }
  }
}))

// Initialize auth state listener
useAuthStore.getState().checkAuth()
