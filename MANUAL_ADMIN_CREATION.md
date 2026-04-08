# MANUAL ADMIN CREATION - Guaranteed to Work

## Step-by-Step Firebase Console Method

### 1. Go to Firebase Console
**URL**: https://console.firebase.google.com/project/school-app-faaa3

### 2. Create Authentication User
1. Click **Authentication** in the left sidebar
2. Click **Users** tab
3. Click **Add User** button
4. Enter:
   - **Email**: `admin@schoolapp.com`
   - **Password**: `Admin123456!`
5. Click **Add User**

### 3. Add Admin Role in Firestore
1. Click **Firestore Database** in the left sidebar
2. Click **Start collection** (if it's your first time)
3. Enter collection name: **users**
4. Click **Next**
5. Enter **Document ID**: (leave blank for auto-ID)
6. Add these fields:

```json
{
  "email": "admin@schoolapp.com",
  "firstName": "System",
  "lastName": "Administrator",
  "role": "admin",
  "permissions": [
    "read",
    "write", 
    "delete",
    "manage_users",
    "manage_schools",
    "manage_programs",
    "manage_applications",
    "manage_payments"
  ],
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### 4. Alternative: Find Existing User
If the user already exists in Authentication:
1. In Firestore, click the **users** collection
2. Look for the user document (search by email or check all documents)
3. Click the document to edit it
4. Add/Update these fields:
   - `role`: "admin"
   - `permissions`: ["read", "write", "delete", "manage_users"]
   - `isActive`: true

### 5. Test Login
Use these credentials in your app:
- **Email**: `admin@schoolapp.com`
- **Password**: `Admin123456!`

## Quick Copy-Paste Fields

### For Authentication:
- Email: `admin@schoolapp.com`
- Password: `Admin123456!`

### For Firestore Document:
```json
{
  "email": "admin@schoolapp.com",
  "firstName": "System",
  "lastName": "Administrator", 
  "role": "admin",
  "permissions": ["read", "write", "delete", "manage_users"],
  "isActive": true
}
```

## Alternative Admin Users

If the above doesn't work, try these:

### Option 2:
- **Email**: `superadmin@schoolapp.com`
- **Password**: `SuperAdmin123!`

### Option 3:
- **Email**: `testadmin@schoolapp.com`
- **Password**: `TestAdmin123!`

## Troubleshooting

### "User already exists" in Authentication
- Skip step 2 and go directly to step 3
- Find the existing user in Firestore and update their role

### Can't find user in Firestore
- The user might be in Authentication but not in Firestore
- Create a new document in the users collection with the same email
- Use the Authentication user's UID as the document ID (find it in Authentication > Users)

### Login still fails
- Check that Email/Password authentication is enabled
- Go to Authentication > Sign-in method > Enable Email/Password
- Verify the user is enabled (not disabled)

### Permissions not working
- Make sure the permissions array includes the required permissions
- Check that `isActive` is set to `true`
- Verify the role is exactly "admin" (lowercase)

## Verification

After setup, verify by:
1. Logging in with the admin credentials
2. Checking that you have admin access
3. Testing admin-only features

This manual method guarantees admin creation since it uses the Firebase Console directly, bypassing any code issues.
