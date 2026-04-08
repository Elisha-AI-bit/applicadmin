// SIMPLE ADMIN CREATION SCRIPT
// Copy and paste this into your browser console when your app is running

console.log('=== SIMPLE ADMIN CREATION ===');

// Method 1: Direct Firebase Admin Creation
async function createWorkingAdmin() {
  try {
    // Get Firebase instances (adjust if your app uses different imports)
    const auth = firebase.auth();
    const db = firebase.firestore();
    
    // Admin credentials
    const email = 'workingadmin@schoolapp.com';
    const password = 'WorkingAdmin123!';
    
    console.log('Creating admin user...');
    console.log('Email:', email);
    console.log('Password:', password);
    
    // Create user
    const result = await auth.createUserWithEmailAndPassword(email, password);
    const user = result.user;
    
    console.log('User created in Firebase Auth:', user.uid);
    
    // Create user document in Firestore
    await db.collection('users').doc(user.uid).set({
      id: user.uid,
      email: email,
      firstName: 'Working',
      lastName: 'Admin',
      role: 'admin',
      permissions: ['read', 'write', 'delete', 'manage_users', 'manage_schools', 'manage_programs', 'manage_applications', 'manage_payments'],
      createdAt: new Date().toISOString(),
      isActive: true
    });
    
    console.log('=== ADMIN CREATED SUCCESSFULLY ===');
    console.log('Login with:');
    console.log('Email:', email);
    console.log('Password:', password);
    
    return { email, password };
    
  } catch (error) {
    console.error('Error:', error.message);
    
    if (error.code === 'auth/email-already-in-use') {
      console.log('User already exists. Try logging in with:');
      console.log('Email:', email);
      console.log('Password:', password);
    }
    
    return null;
  }
}

// Method 2: Alternative Admin Creation
async function createAlternativeAdmin() {
  try {
    const auth = firebase.auth();
    const db = firebase.firestore();
    
    const email = 'myadmin@schoolapp.com';
    const password = 'MyAdmin123!';
    
    const result = await auth.createUserWithEmailAndPassword(email, password);
    const user = result.user;
    
    await db.collection('users').doc(user.uid).set({
      id: user.uid,
      email: email,
      firstName: 'My',
      lastName: 'Admin',
      role: 'admin',
      permissions: ['read', 'write', 'delete', 'manage_users'],
      createdAt: new Date().toISOString(),
      isActive: true
    });
    
    console.log('=== ALTERNATIVE ADMIN CREATED ===');
    console.log('Login with:');
    console.log('Email:', email);
    console.log('Password:', password);
    
  } catch (error) {
    console.error('Alternative admin creation failed:', error.message);
  }
}

// Method 3: Test Login
async function testLogin(email, password) {
  try {
    const auth = firebase.auth();
    const result = await auth.signInWithEmailAndPassword(email, password);
    console.log('Login successful for:', result.user.email);
    return true;
  } catch (error) {
    console.error('Login failed:', error.message);
    return false;
  }
}

// AUTO-EXECUTE
console.log('Starting admin creation...');
createWorkingAdmin().then(success => {
  if (success) {
    console.log('SUCCESS! You can now login with the credentials above.');
  } else {
    console.log('Trying alternative admin...');
    createAlternativeAdmin();
  }
});

// Manual functions available
window.createWorkingAdmin = createWorkingAdmin;
window.createAlternativeAdmin = createAlternativeAdmin;
window.testLogin = testLogin;
