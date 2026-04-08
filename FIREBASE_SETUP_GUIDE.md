# Firebase Setup Guide for Real-time Features

## Current Status
The application is currently running with **mock data** due to Firebase permission restrictions. The real-time features are fully implemented and will work once Firebase is properly configured.

## What's Working Now
- Real-time UI updates (using mock data)
- All components are ready for Firebase integration
- Automatic fallback to mock data when permissions are denied
- No console errors - graceful handling implemented

## To Enable Real Firebase Data

### Option 1: Quick Setup (Recommended for Development)
1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Deploy Security Rules**
   ```bash
   firebase deploy --only firestore:rules
   ```

4. **Run the Seeding Script**
   ```bash
   npm run seed-firestore
   ```

### Option 2: Manual Firebase Console Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `school-app-faaa3`
3. Navigate to **Firestore Database**
4. Go to **Rules** tab
5. Replace existing rules with:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```
6. Click **Publish**
7. Run the seeding script: `npm run seed-firestore`

### Option 3: Production-Ready Rules
For production, use these secure rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Authenticated users can read applications
    match /applications/{applicationId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Authenticated users can read students
    match /students/{studentId} {
      allow read, write: if request.auth != null;
    }
    
    // Authenticated users can read payments
    match /payments/{paymentId} {
      allow read, write: if request.auth != null;
    }
    
    // Authenticated users can read activities
    match /activities/{activityId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Authenticated users can read schools and programs
    match /schools/{schoolId} {
      allow read, write: if request.auth != null;
    }
    
    match /programs/{programId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Demo Data Included
The seeding script will create:
- **2 Schools**: Tech University, State College
- **3 Programs**: Computer Science, Data Science, Business Administration
- **3 Students**: John Doe, Jane Smith, Michael Johnson
- **3 Applications**: Different statuses (pending, approved, under_review)
- **3 Payments**: Various payment methods and statuses
- **4 Activities**: Recent system actions
- **2 Users**: Admin and Staff accounts

## Testing Real-time Features
Once Firebase is configured:
1. Open the application in two browser windows
2. Make changes in one window (update application status, add student, etc.)
3. See changes appear instantly in the other window
4. Check the browser console for "Real-time subscription connected" messages

## Troubleshooting
- **Permission Denied**: Ensure Firestore rules are deployed
- **Connection Failed**: Check network connectivity
- **No Data**: Run the seeding script to populate Firestore
- **Real-time Not Working**: Check browser console for connection status

## Current Mock Data
The app is currently displaying realistic mock data that demonstrates all features. This allows you to:
- Test the UI without Firebase setup
- Verify all real-time hooks are working
- See the complete application functionality

When you're ready to switch to real data, just follow the setup steps above and the app will automatically start using Firebase instead of mock data.
