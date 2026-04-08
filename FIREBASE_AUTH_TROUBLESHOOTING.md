# Firebase Authentication Troubleshooting Guide

## Error: `auth/invalid-credential`

This error occurs when Firebase Authentication cannot validate the provided credentials. Here are the most common causes and solutions:

### Common Causes

1. **Incorrect Email or Password**
   - The email doesn't exist in Firebase Auth
   - The password is incorrect
   - Case sensitivity issues

2. **Firebase Project Configuration**
   - Wrong Firebase project configuration
   - Authentication methods not enabled
   - API key issues

3. **User Account Issues**
   - User account disabled
   - Email not verified (if email verification is required)
   - User deleted

### Solutions

#### 1. Enable Email/Password Authentication

Go to your Firebase Console:
1. Open your project: https://console.firebase.google.com/project/school-app-faaa3
2. Go to Authentication > Sign-in method
3. Enable "Email/Password" provider
4. Save settings

#### 2. Create a Test User

Use the built-in test user creation:
```javascript
import { createTestUser } from './src/lib/authService';

// This creates a test user with:
// Email: test@example.com
// Password: test123456
// Role: admin
await createTestUser();
```

Or use the AuthTest component in your app:
```jsx
import { AuthTest } from './src/components/AuthTest';

// Add to your app
<AuthTest />
```

#### 3. Check Firebase Configuration

Verify your Firebase configuration in `src/lib/firebase.ts`:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBr1ac-YprCM5ci4dKKDuXNRYnmWWg21Ec",
  authDomain: "school-app-faaa3.firebaseapp.com",
  projectId: "school-app-faaa3",
  storageBucket: "school-app-faaa3.firebasestorage.app",
  messagingSenderId: "587478154868",
  appId: "1:587478154868:web:87896bf22ed5cf13969b21",
  measurementId: "G-3J3MJVL8MK"
};
```

#### 4. Manual User Creation in Firebase Console

1. Go to Firebase Console > Authentication > Users
2. Click "Add user"
3. Enter email: `test@example.com`
4. Enter password: `test123456`
5. Click "Add user"

#### 5. Test Login

Use these credentials to test:
- **Email**: test@example.com
- **Password**: test123456

### Debugging Steps

#### 1. Check Firebase Connection
```javascript
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './src/lib/firebase';

// Test basic auth connection
try {
  const authInstance = getAuth();
  console.log('Auth instance created:', authInstance);
  console.log('Current app:', authInstance.app.name);
} catch (error) {
  console.error('Firebase auth error:', error);
}
```

#### 2. Test with Simple Login
```javascript
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './src/lib/firebase';

const testLogin = async () => {
  try {
    const result = await signInWithEmailAndPassword(auth, 'test@example.com', 'test123456');
    console.log('Login successful:', result.user);
  } catch (error) {
    console.error('Login failed:', error.code, error.message);
  }
};
```

#### 3. Check User Existence
```javascript
import { getAuth, fetchSignInMethodsForEmail } from 'firebase/auth';
import { auth } from './src/lib/firebase';

const checkUserExists = async (email) => {
  try {
    const methods = await fetchSignInMethodsForEmail(auth, email);
    console.log('Sign-in methods for', email, ':', methods);
    return methods.length > 0;
  } catch (error) {
    console.error('Error checking user:', error);
    return false;
  }
};
```

### Common Error Codes and Solutions

| Error Code | Cause | Solution |
|------------|-------|----------|
| `auth/invalid-email` | Email format is invalid | Check email format |
| `auth/user-not-found` | Email doesn't exist | Create user or check email |
| `auth/wrong-password` | Incorrect password | Reset password or check credentials |
| `auth/user-disabled` | User account disabled | Re-enable user in Firebase Console |
| `auth/too-many-requests` | Too many failed attempts | Wait and try again later |
| `auth/invalid-credential` | General credential error | Check all above causes |

### Firebase Console Checklist

1. **Authentication Settings**:
   - [ ] Email/Password provider enabled
   - [ ] User creation allowed
   - [ ] No blocking rules

2. **Project Settings**:
   - [ ] Correct project ID: `school-app-faaa3`
   - [ ] Web app added with correct domain
   - [ ] API key not restricted

3. **User Management**:
   - [ ] Test user exists: `test@example.com`
   - [ ] User is enabled
   - [ ] Email verified (if required)

### Quick Fix Script

Run this in your browser console to test authentication:

```javascript
// Test Firebase connection
firebase.auth().onAuthStateChanged((user) => {
  console.log('Auth state changed:', user);
});

// Test login
firebase.auth().signInWithEmailAndPassword('test@example.com', 'test123456')
  .then((result) => console.log('Login success:', result))
  .catch((error) => console.error('Login error:', error));
```

### Next Steps

1. **Enable Authentication**: Make sure Email/Password is enabled in Firebase Console
2. **Create Test User**: Use the test user creation function or create manually
3. **Test Login**: Try logging in with the test credentials
4. **Check Configuration**: Verify Firebase config is correct
5. **Debug**: Use the debugging steps if issues persist

### Support

If you're still having issues:

1. Check the browser console for detailed error messages
2. Verify your Firebase project settings
3. Ensure your domain is added to authorized domains
4. Check if there are any Firebase service outages

The enhanced error handling in the updated auth service will provide more user-friendly error messages to help identify the specific issue.
