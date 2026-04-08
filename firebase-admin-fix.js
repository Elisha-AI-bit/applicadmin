// FIREBASE ADMIN CREATION - FOR YOUR APP
// This script works with your app's Firebase setup

console.log('=== FIREBASE ADMIN CREATION ===');

// Method 1: Use your app's Firebase imports
async function createAdminWithAppFirebase() {
  try {
    // Try to access Firebase through your app's modules
    const { auth, db } = await import('./src/lib/firebase.js');
    const { createUserWithEmailAndPassword } = await import('firebase/auth');
    const { doc, setDoc } = await import('firebase/firestore');
    
    const email = 'myadmin@schoolapp.com';
    const password = 'MyAdmin123!';
    
    console.log('Creating admin with app Firebase...');
    
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    await setDoc(doc(db, 'users', user.uid), {
      id: user.uid,
      email: email,
      firstName: 'My',
      lastName: 'Admin',
      role: 'admin',
      permissions: ['read', 'write', 'delete', 'manage_users'],
      createdAt: new Date().toISOString(),
      isActive: true
    });
    
    console.log('=== ADMIN CREATED ===');
    console.log('Email:', email);
    console.log('Password:', password);
    
    return { email, password };
    
  } catch (error) {
    console.error('Method 1 failed:', error.message);
    return null;
  }
}

// Method 2: Use window.firebase if available
async function createAdminWithWindowFirebase() {
  try {
    if (!window.firebase) {
      throw new Error('window.firebase not available');
    }
    
    const auth = window.firebase.auth();
    const db = window.firebase.firestore();
    
    const email = 'windowadmin@schoolapp.com';
    const password = 'WindowAdmin123!';
    
    console.log('Creating admin with window.firebase...');
    
    const result = await auth.createUserWithEmailAndPassword(email, password);
    const user = result.user;
    
    await db.collection('users').doc(user.uid).set({
      id: user.uid,
      email: email,
      firstName: 'Window',
      lastName: 'Admin',
      role: 'admin',
      permissions: ['read', 'write', 'delete', 'manage_users'],
      createdAt: new Date().toISOString(),
      isActive: true
    });
    
    console.log('=== ADMIN CREATED ===');
    console.log('Email:', email);
    console.log('Password:', password);
    
    return { email, password };
    
  } catch (error) {
    console.error('Method 2 failed:', error.message);
    return null;
  }
}

// Method 3: Manual Firebase Console Instructions
function showManualInstructions() {
  console.log('=== MANUAL ADMIN CREATION ===');
  console.log('1. Go to: https://console.firebase.google.com/project/school-app-faaa3');
  console.log('2. Click Authentication > Users > Add User');
  console.log('3. Enter:');
  console.log('   Email: manual@schoolapp.com');
  console.log('   Password: Manual123!');
  console.log('4. Click Add User');
  console.log('5. Go to Firestore Database');
  console.log('6. Find the user in the "users" collection');
  console.log('7. Add these fields to the user document:');
  console.log('   role: "admin"');
  console.log('   permissions: ["read", "write", "delete", "manage_users"]');
  console.log('   isActive: true');
  console.log('   firstName: "Manual"');
  console.log('   lastName: "Admin"');
  console.log('8. Save the document');
  console.log('9. Login with: manual@schoolapp.com / Manual123!');
}

// Method 4: Check if React DevTools can help
function checkReactDevTools() {
  console.log('=== REACT DEVTOOLS METHOD ===');
  console.log('1. Open React DevTools in your browser');
  console.log('2. Find your Auth component');
  console.log('3. Look for the createTestUser function');
  console.log('4. Execute it from the console');
  console.log('Or try: window.__REACT_DEVTOOLS_GLOBAL_HOOK__.store');
}

// Try all methods
async function createAdmin() {
  console.log('Trying automatic admin creation...');
  
  let success = false;
  
  // Try Method 1
  const result1 = await createAdminWithAppFirebase();
  if (result1) {
    success = true;
  }
  
  // Try Method 2
  if (!success) {
    const result2 = await createAdminWithWindowFirebase();
    if (result2) {
      success = true;
    }
  }
  
  if (success) {
    console.log('=== SUCCESS! ===');
    console.log('Admin created successfully!');
    console.log('Check above for login credentials');
  } else {
    console.log('=== AUTOMATIC CREATION FAILED ===');
    console.log('Try one of these manual methods:');
    showManualInstructions();
    checkReactDevTools();
  }
}

// Alternative: Try to access Firebase through React components
function tryReactComponentAccess() {
  console.log('=== REACT COMPONENT ACCESS ===');
  
  // Try to find React components that might have Firebase
  const roots = document.querySelectorAll('[data-reactroot]');
  console.log('React roots found:', roots.length);
  
  // Try to access global state
  if (window.useAuthStore) {
    console.log('Found useAuthStore - you can try:');
    console.log('window.useAuthStore.getState().createTestUser()');
  }
  
  if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    console.log('React DevTools available - you can inspect components');
  }
}

// Execute
createAdmin();
tryReactComponentAccess();

// Export functions for manual use
window.createAdminWithAppFirebase = createAdminWithAppFirebase;
window.createAdminWithWindowFirebase = createAdminWithWindowFirebase;
window.showManualInstructions = showManualInstructions;
