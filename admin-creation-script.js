// Firebase Admin Creation Script
// Run this script in your browser console when your app is open

// Step 1: First, let's check if Firebase is properly initialized
console.log('=== Firebase Admin Creation Script ===');

// Step 2: Create admin function
async function createAdminUser() {
  try {
    // Import Firebase modules (they should be available in your app)
    const { getAuth, createUserWithEmailAndPassword, updateProfile } = firebase.auth;
    const { getFirestore, doc, setDoc } = firebase.firestore;
    
    const auth = getAuth();
    const db = getFirestore();
    
    // Admin credentials
    const adminEmail = 'superadmin@schoolapp.com';
    const adminPassword = 'SuperAdmin123!';
    const firstName = 'Super';
    const lastName = 'Admin';
    
    console.log('Creating admin user...');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
    const user = userCredential.user;
    
    console.log('Firebase Auth user created:', user.uid);
    
    // Update profile
    await updateProfile(user, {
      displayName: `${firstName} ${lastName}`
    });
    
    // Create user document in Firestore
    const userData = {
      id: user.uid,
      email: user.email,
      firstName: firstName,
      lastName: lastName,
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
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      isActive: true,
      department: 'System Administration'
    };
    
    await setDoc(doc(db, 'users', user.uid), userData);
    
    console.log('Admin user created successfully!');
    console.log('Login Credentials:');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('Role:', userData.role);
    console.log('Permissions:', userData.permissions.length, 'permissions');
    
    return userData;
    
  } catch (error) {
    console.error('Error creating admin:', error);
    
    // If user already exists, try to get the user info
    if (error.code === 'auth/email-already-in-use') {
      console.log('User already exists. You can try logging in with:');
      console.log('Email: superadmin@schoolapp.com');
      console.log('Password: SuperAdmin123!');
    }
    
    throw error;
  }
}

// Step 3: Alternative - Create multiple admin users
async function createMultipleAdmins() {
  const admins = [
    {
      email: 'admin1@schoolapp.com',
      password: 'Admin123456!',
      firstName: 'Primary',
      lastName: 'Admin'
    },
    {
      email: 'admin2@schoolapp.com', 
      password: 'Admin123456!',
      firstName: 'Secondary',
      lastName: 'Admin'
    },
    {
      email: 'support@schoolapp.com',
      password: 'Support123!',
      firstName: 'Support',
      lastName: 'Team'
    }
  ];
  
  const { getAuth, createUserWithEmailAndPassword, updateProfile } = firebase.auth;
  const { getFirestore, doc, setDoc } = firebase.firestore;
  
  const auth = getAuth();
  const db = getFirestore();
  
  for (const admin of admins) {
    try {
      console.log(`Creating admin: ${admin.email}`);
      
      const userCredential = await createUserWithEmailAndPassword(auth, admin.email, admin.password);
      const user = userCredential.user;
      
      await updateProfile(user, {
        displayName: `${admin.firstName} ${admin.lastName}`
      });
      
      const userData = {
        id: user.uid,
        email: user.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: 'admin',
        permissions: [
          'read', 'write', 'delete', 'manage_users', 'manage_schools',
          'manage_programs', 'manage_applications', 'manage_payments',
          'manage_settings', 'view_reports', 'export_data'
        ],
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        isActive: true,
        department: 'Administration'
      };
      
      await setDoc(doc(db, 'users', user.uid), userData);
      console.log(`Created admin: ${admin.email}`);
      
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`Admin ${admin.email} already exists`);
      } else {
        console.error(`Error creating admin ${admin.email}:`, error);
      }
    }
  }
  
  console.log('All admin users created!');
  console.log('Login credentials:');
  admins.forEach(admin => {
    console.log(`${admin.email} / ${admin.password}`);
  });
}

// Step 4: Quick test function
async function testAdminLogin() {
  try {
    const { getAuth, signInWithEmailAndPassword } = firebase.auth;
    const auth = getAuth();
    
    const result = await signInWithEmailAndPassword(auth, 'superadmin@schoolapp.com', 'SuperAdmin123!');
    console.log('Admin login successful:', result.user.email);
    return result.user;
  } catch (error) {
    console.error('Login failed:', error);
    return null;
  }
}

// Step 5: Run the script
console.log('Starting admin creation...');
console.log('Choose an option:');
console.log('1. createAdminUser() - Create single super admin');
console.log('2. createMultipleAdmins() - Create multiple admins');
console.log('3. testAdminLogin() - Test admin login');

// Auto-run the main admin creation
createAdminUser().then(() => {
  console.log('=== Admin Creation Complete ===');
  console.log('You can now login with:');
  console.log('Email: superadmin@schoolapp.com');
  console.log('Password: SuperAdmin123!');
}).catch(error => {
  console.log('=== Admin Creation Failed ===');
  console.log('Trying alternative method...');
  
  // Fallback: Try creating a simpler admin
  createMultipleAdmins().then(() => {
    console.log('=== Multiple Admins Created ===');
    console.log('Try any of these credentials:');
    console.log('admin1@schoolapp.com / Admin123456!');
    console.log('admin2@schoolapp.com / Admin123456!');
    console.log('support@schoolapp.com / Support123!');
  });
});

// Export functions for manual use
window.createAdminUser = createAdminUser;
window.createMultipleAdmins = createMultipleAdmins;
window.testAdminLogin = testAdminLogin;
