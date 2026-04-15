import { create } from 'zustand'
import { useEffect } from 'react'
import { firebaseApi } from '../lib/firebaseApi'

interface AppNotification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: Date
  read: boolean
}

interface AppState {
  notifications: AppNotification[]
  sidebarOpen: boolean
  loading: boolean
  currentPage: string
  globalSearchQuery: string
  unreadNotifications: number
  
  // Actions
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void
  removeNotification: (id: string) => void
  markNotificationAsRead: (id: string) => void
  clearNotifications: () => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setLoading: (loading: boolean) => void
  setCurrentPage: (page: string) => void
  setGlobalSearchQuery: (query: string) => void
  syncNotifications: () => void
}

export const useAppStore = create<AppState>((set) => ({
  notifications: [],
  sidebarOpen: true,
  loading: false,
  currentPage: '',
  globalSearchQuery: '',
  unreadNotifications: 0,

  addNotification: (notification) => {
    const newNotification: AppNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    }
    
    set(state => {
      const updatedNotifications = [newNotification, ...state.notifications]
      const unreadCount = updatedNotifications.filter(n => !n.read).length
      return {
        notifications: updatedNotifications,
        unreadNotifications: unreadCount
      }
    })
  },

  removeNotification: (id) => {
    set(state => {
      const updatedNotifications = state.notifications.filter(n => n.id !== id)
      const unreadCount = updatedNotifications.filter(n => !n.read).length
      return {
        notifications: updatedNotifications,
        unreadNotifications: unreadCount
      }
    })
  },

  markNotificationAsRead: (id) => {
    set(state => {
      const updatedNotifications = state.notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      )
      const unreadCount = updatedNotifications.filter(n => !n.read).length
      return {
        notifications: updatedNotifications,
        unreadNotifications: unreadCount
      }
    })
  },

  clearNotifications: () => {
    set({ 
      notifications: [],
      unreadNotifications: 0
    })
  },

  toggleSidebar: () => {
    set(state => ({ sidebarOpen: !state.sidebarOpen }))
  },

  setSidebarOpen: (open) => {
    set({ sidebarOpen: open })
  },

  setLoading: (loading) => {
    set({ loading })
  },

  setCurrentPage: (page) => {
    set({ currentPage: page })
  },

  setGlobalSearchQuery: (query) => {
    set({ globalSearchQuery: query })
  },

  syncNotifications: () => {
    // This would sync with Firebase notifications
    // For now, we'll keep local notifications
    // In a real implementation, you'd fetch from Firebase and merge
  }
}))


// Hook to sync notifications with Firebase
export const useFirebaseNotifications = () => {
  const addNotification = useAppStore(state => state.addNotification)
  
  useEffect(() => {
    // Fetch notifications from Firebase on mount
    const fetchNotifications = async () => {
      try {
        const notifications = await firebaseApi.notifications.getNotifications()
        // Convert Firebase notifications to app notifications
        notifications.forEach(notification => {
          addNotification({
            type: 'info',
            title: notification.title,
            message: notification.message
          })
        })
      } catch (error) {
        console.error('Error fetching notifications:', error)
      }
    }
    
    fetchNotifications()
  }, [addNotification])
}
