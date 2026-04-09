import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from './firebase';

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user' | 'moderator';
  permissions: string[];
  avatar?: string;
  createdAt: string;
  lastLoginAt?: string;
  isActive: boolean;
  department?: string;
  phone?: string;
}

// Create admin user with full permissions
export const createAdminUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  options?: {
    department?: string;
    phone?: string;
    avatar?: string;
  }
): Promise<AdminUser> => {
  try {
    // Validate inputs
    if (!email || !password || !firstName || !lastName) {
      throw new Error('All fields are required');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    // Update profile with display name
    await updateProfile(firebaseUser, {
      displayName: `${firstName} ${lastName}`
    });
    
    // Create admin user document in Firestore
    const adminData: AdminUser = {
      id: firebaseUser.uid,
      email: firebaseUser.email!,
      firstName,
      lastName,
      role: 'admin',
      permissions: [
        'read',
        'write',
        'delete',
        'manage_users',
        'manage_schools',
        'manage_programs',
        'manage_applications',
        'manage_payments',
        'manage_settings',
        'view_reports',
        'export_data'
      ],
      avatar: options?.avatar,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      isActive: true,
      department: options?.department || 'Administration',
      phone: options?.phone
    };
    
    // Save to Firestore
    await setDoc(doc(db, 'users', firebaseUser.uid), adminData);
    
    console.log('Admin user created successfully:', adminData);
    return adminData;
    
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
};

// Create default admin user
export const createDefaultAdmin = async (): Promise<AdminUser> => {
  return await createAdminUser(
    'admin@schoolapp.com',
    'admin123456',
    'System',
    'Administrator',
    {
      department: 'System Administration',
      phone: '+1234567890'
    }
  );
};

// Create multiple admin users
export const createAdminUsers = async (admins: Array<{
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  department?: string;
  phone?: string;
}>): Promise<AdminUser[]> => {
  const results: AdminUser[] = [];
  
  for (const admin of admins) {
    try {
      const createdAdmin = await createAdminUser(
        admin.email,
        admin.password,
        admin.firstName,
        admin.lastName,
        {
          department: admin.department,
          phone: admin.phone
        }
      );
      results.push(createdAdmin);
    } catch (error) {
      console.error(`Failed to create admin ${admin.email}:`, error);
    }
  }
  
  return results;
};

// Check if user exists and is admin
export const checkAdminExists = async (_email: string): Promise<boolean> => {
  try {
    // This would typically require a custom function or cloud function
    // For now, we'll return false and let the creation handle duplicates
    return false;
  } catch (error) {
    console.error('Error checking admin existence:', error);
    return false;
  }
};

// Promote existing user to admin
export const promoteToAdmin = async (userId: string): Promise<void> => {
  try {
    await setDoc(doc(db, 'users', userId), {
      role: 'admin',
      permissions: [
        'read',
        'write',
        'delete',
        'manage_users',
        'manage_schools',
        'manage_programs',
        'manage_applications',
        'manage_payments',
        'manage_settings',
        'view_reports',
        'export_data'
      ],
      updatedAt: new Date().toISOString()
    }, { merge: true });
    
    console.log('User promoted to admin successfully');
  } catch (error) {
    console.error('Error promoting user to admin:', error);
    throw error;
  }
};
