import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

const DEV_ADMIN_SESSION_KEY = 'dev_admin_session';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user' | 'moderator';
  avatar?: string;
  permissions?: string[];
  createdAt?: string;
  lastLoginAt?: string;
}

export interface AuthError {
  code: string;
  message: string;
  userFriendlyMessage: string;
}

// Error mapping for better user experience
const getAuthError = (error: any): AuthError => {
  const errorCode = error.code;
  
  switch (errorCode) {
    case 'auth/user-deleted':
      return {
        code: errorCode,
        message: error.message,
        userFriendlyMessage: 'This account has been deleted. Please contact support.'
      };
    case 'auth/invalid-email':
      return {
        code: errorCode,
        message: error.message,
        userFriendlyMessage: 'Invalid email address. Please check and try again.'
      };
    case 'auth/invalid-password':
    case 'auth/wrong-password':
      return {
        code: errorCode,
        message: error.message,
        userFriendlyMessage: 'Incorrect password. Please try again.'
      };
    case 'auth/user-not-found':
      return {
        code: errorCode,
        message: error.message,
        userFriendlyMessage: 'No account found with this email. Please sign up first.'
      };
    case 'auth/email-already-in-use':
    case 'auth/email-exists':
      return {
        code: errorCode,
        message: error.message,
        userFriendlyMessage: 'An account with this email already exists. Please sign in.'
      };
    case 'auth/weak-password':
      return {
        code: errorCode,
        message: error.message,
        userFriendlyMessage: 'Password is too weak. Please choose a stronger password.'
      };
    case 'auth/too-many-requests':
      return {
        code: errorCode,
        message: error.message,
        userFriendlyMessage: 'Too many failed attempts. Please try again later.'
      };
    default:
      return {
        code: errorCode || 'UNKNOWN',
        message: error.message,
        userFriendlyMessage: 'An error occurred. Please try again.'
      };
  }
};

// Enhanced login with better error handling
export const login = async (email: string, password: string): Promise<User> => {
  try {
    // Validate inputs
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Check for development admin user
    if (email === 'admin@gmail.com') {
      try {
        // Dynamic import for admin user data
        const adminData = await fetch('/admin-user.json').then(r => r.json()).catch(() => null);
        
        if (adminData && adminData.email === email) {
          console.log('Development admin login detected');

          const devUser: User = {
            id: adminData.id,
            email: adminData.email,
            firstName: adminData.name.split(' ')[0] || 'Admin',
            lastName: adminData.name.split(' ')[1] || 'User',
            role: adminData.role,
            permissions: adminData.permissions || [],
            createdAt: adminData.createdAt,
            lastLoginAt: new Date().toISOString()
          };

          localStorage.setItem(DEV_ADMIN_SESSION_KEY, JSON.stringify(devUser));
          return devUser;
        }
      } catch (error) {
        console.log('Admin user file not found, proceeding with normal auth');
      }
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data() as User;
      
      // Update last login
      await updateDoc(doc(db, 'users', firebaseUser.uid), {
        lastLoginAt: new Date().toISOString()
      });
      
      return {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        ...userData
      };
    } else {
      // Create user profile if it doesn't exist
      const newUserData: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        firstName: firebaseUser.displayName?.split(' ')[0] || 'User',
        lastName: firebaseUser.displayName?.split(' ')[1] || '',
        role: 'user',
        permissions: ['read'],
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, 'users', firebaseUser.uid), newUserData);
      return newUserData;
    }
  } catch (error) {
    console.error('Login error:', error);
    const authError = getAuthError(error);
    throw authError;
  }
};

export const register = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  role: 'admin' | 'user' | 'moderator' = 'user'
): Promise<User> => {
  try {
    // Validate inputs
    if (!email || !password || !firstName || !lastName) {
      throw new Error('All fields are required');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Create Firebase user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    // Update profile
    await updateProfile(firebaseUser, {
      displayName: `${firstName} ${lastName}`
    });
    
    // Create user document in Firestore
    const userData: User = {
      id: firebaseUser.uid,
      email: firebaseUser.email!,
      firstName,
      lastName,
      role,
      permissions: role === 'admin' ? ['read', 'write', 'delete'] : 
                  role === 'moderator' ? ['read', 'write'] : ['read'],
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };
    
    await setDoc(doc(db, 'users', firebaseUser.uid), userData);
    
    return userData;
  } catch (error) {
    console.error('Registration error:', error);
    const authError = getAuthError(error);
    throw authError;
  }
};

export const logout = async (): Promise<void> => {
  try {
    localStorage.removeItem(DEV_ADMIN_SESSION_KEY);
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  try {
    if (!email) {
      throw new Error('Email is required');
    }
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Password reset error:', error);
    const authError = getAuthError(error);
    throw authError;
  }
};

export const updateUserProfile = async (userId: string, data: Partial<User>): Promise<void> => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      ...data,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Profile update error:', error);
    throw error;
  }
};

// Auth state listener
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          callback({
            id: firebaseUser.uid,
            email: firebaseUser.email!,
            ...userData
          });
        } else {
          callback(null);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        callback(null);
      }
    } else {
      const devSession = localStorage.getItem(DEV_ADMIN_SESSION_KEY);
      if (devSession) {
        try {
          callback(JSON.parse(devSession) as User);
          return;
        } catch {
          localStorage.removeItem(DEV_ADMIN_SESSION_KEY);
        }
      }
      callback(null);
    }
  });
};

// Get current user
export const getCurrentUser = (): User | null => {
  const firebaseUser = auth.currentUser;
  if (firebaseUser) {
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email!,
      firstName: firebaseUser.displayName?.split(' ')[0] || '',
      lastName: firebaseUser.displayName?.split(' ')[1] || '',
      role: 'user',
      avatar: firebaseUser.photoURL || undefined
    };
  }
  return null;
};

// Create test user for development
export const createTestUser = async (): Promise<User> => {
  const testEmail = 'test@example.com';
  const testPassword = 'test123456';
  const testFirstName = 'Test';
  const testLastName = 'User';
  
  try {
    // Try to create the test user
    return await register(testEmail, testPassword, testFirstName, testLastName, 'admin');
  } catch (error) {
    // If user already exists, try to login
    if (error.code === 'auth/email-already-in-use' || error.code === 'auth/email-exists') {
      return await login(testEmail, testPassword);
    }
    throw error;
  }
};

// Check if test user exists and create if needed
export const ensureTestUser = async (): Promise<void> => {
  try {
    await createTestUser();
    console.log('Test user created/verified successfully');
  } catch (error) {
    console.error('Error creating test user:', error);
  }
};
