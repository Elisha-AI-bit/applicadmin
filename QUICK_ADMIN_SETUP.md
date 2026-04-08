# QUICK ADMIN SETUP - Step by Step

## Method 1: Browser Console Script (Easiest)

1. **Open your app in the browser**
2. **Open Developer Tools** (F12 or right-click > Inspect)
3. **Go to Console tab**
4. **Copy and paste this entire script**:

```javascript
// QUICK ADMIN CREATION
const auth = firebase.auth();
const db = firebase.firestore();

async function createAdmin() {
  try {
    const email = 'quickadmin@schoolapp.com';
    const password = 'QuickAdmin123!';
    
    const result = await auth.createUserWithEmailAndPassword(email, password);
    const user = result.user;
    
    await db.collection('users').doc(user.uid).set({
      id: user.uid,
      email: email,
      firstName: 'Quick',
      lastName: 'Admin',
      role: 'admin',
      permissions: ['read', 'write', 'delete', 'manage_users'],
      createdAt: new Date().toISOString(),
      isActive: true
    });
    
    console.log('ADMIN CREATED!');
    console.log('Email:', email);
    console.log('Password:', password);
    
  } catch (error) {
    console.log('Error:', error.message);
    if (error.code === 'auth/email-already-in-use') {
      console.log('User already exists - try logging in with the credentials above');
    }
  }
}

createAdmin();
```

5. **Press Enter**
6. **Check the console output** for your login credentials

## Method 2: Manual Firebase Console

1. **Go to Firebase Console**: https://console.firebase.google.com/project/school-app-faaa3
2. **Authentication** > **Users** > **Add User**
3. **Enter**:
   - Email: `manualadmin@schoolapp.com`
   - Password: `ManualAdmin123!`
4. **Click Add User**
5. **Go to Firestore Database**
6. **Find the user** in the `users` collection (search by email)
7. **Update the document** to add:
   ```json
   {
     "role": "admin",
     "permissions": ["read", "write", "delete", "manage_users"],
     "isActive": true
   }
   ```

## Method 3: Test Different Credentials

Try these working admin credentials:

### Option A
- **Email**: `quickadmin@schoolapp.com`
- **Password**: `QuickAdmin123!`

### Option B  
- **Email**: `manualadmin@schoolapp.com`
- **Password**: `ManualAdmin123!`

### Option C
- **Email**: `testadmin@schoolapp.com`
- **Password**: `TestAdmin123!`

## Method 4: Emergency Admin Script

If nothing else works, try this ultra-simple script:

```javascript
// EMERGENCY ADMIN
firebase.auth().createUserWithEmailAndPassword('emergency@schoolapp.com', 'Emergency123!')
  .then(result => {
    firebase.firestore().collection('users').doc(result.user.uid).set({
      id: result.user.uid,
      email: 'emergency@schoolapp.com',
      firstName: 'Emergency',
      lastName: 'Admin',
      role: 'admin',
      permissions: ['read', 'write', 'delete'],
      createdAt: new Date().toISOString(),
      isActive: true
    });
    console.log('EMERGENCY ADMIN CREATED!');
    console.log('Email: emergency@schoolapp.com');
    console.log('Password: Emergency123!');
  })
  .catch(error => console.log('Error:', error.message));
```

## Troubleshooting

### If you get "auth/email-already-in-use":
- The user already exists
- Try logging in with the credentials
- Or use a different email

### If you get "auth/configuration-not-found":
- Make sure Email/Password authentication is enabled
- Go to Firebase Console > Authentication > Sign-in method
- Enable Email/Password provider

### If you get "auth/invalid-email":
- Check the email format
- Make sure there are no typos

### If nothing works:
1. Check Firebase project settings
2. Verify your domain is authorized
3. Make sure you're on the correct Firebase project

## Quick Test

After creating an admin, test login immediately:

```javascript
// Test login
firebase.auth().signInWithEmailAndPassword('quickadmin@schoolapp.com', 'QuickAdmin123!')
  .then(result => console.log('Login successful!', result.user.email))
  .catch(error => console.log('Login failed:', error.message));
```

## Next Steps

1. **Run one of the scripts above**
2. **Note your admin credentials**
3. **Test login in your app**
4. **Verify admin access and permissions**

The first method (browser console script) is usually the fastest and most reliable approach.
