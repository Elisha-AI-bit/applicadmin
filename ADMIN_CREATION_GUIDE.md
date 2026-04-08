# Firebase Admin User Creation Guide

## Quick Admin Creation Options

### Option 1: Use the AdminManager Component
The easiest way is to use the AdminManager component in your app:

1. Navigate to your app
2. Scroll to the "Admin User Management" section
3. Click "Create Default Admin" for instant admin
4. Or fill out the custom form for specific admin users

### Option 2: Default Admin User
**Email**: `admin@schoolapp.com`  
**Password**: `admin123456`  
**Role**: Administrator  
**Permissions**: Full system access

### Option 3: Sample Admin Users
Click "Create Sample Admins" to create:
- `john.admin@schoolapp.com` (Academic Affairs)
- `sarah.admin@schoolapp.com` (Student Services)  
- `mike.admin@schoolapp.com` (Finance)

All with password: `admin123456`

### Option 4: Manual Creation in Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/project/school-app-faaa3)
2. Navigate to Authentication > Users
3. Click "Add user"
4. Enter email and password
5. After creation, go to Firestore Database
6. Go to the `users` collection
7. Find the user by their UID
8. Update their document with admin role:

```json
{
  "role": "admin",
  "permissions": [
    "read",
    "write", 
    "delete",
    "manage_users",
    "manage_schools",
    "manage_programs",
    "manage_applications",
    "manage_payments",
    "manage_settings",
    "view_reports",
    "export_data"
  ],
  "isActive": true
}
```

### Option 5: Programmatic Creation
Use the admin service directly:

```javascript
import { createDefaultAdmin } from './src/lib/adminService';

// Create default admin
const admin = await createDefaultAdmin();
console.log('Admin created:', admin);
```

### Option 6: Browser Console
Run this in your browser console on the app:

```javascript
// Import and create admin (if modules are available)
window.createDefaultAdmin().then(admin => {
  console.log('Admin created:', admin);
});
```

## Admin Permissions

Admin users get these permissions:
- **read** - View all data
- **write** - Modify data
- **delete** - Remove data
- **manage_users** - Manage user accounts
- **manage_schools** - Manage schools/programs
- **manage_applications** - Process applications
- **manage_payments** - Handle payments
- **manage_settings** - System settings
- **view_reports** - Access reports
- **export_data** - Export functionality

## Testing Admin Access

1. **Login with Admin Credentials**:
   - Use any of the admin emails above
   - Enter the corresponding password
   - Verify you have admin access

2. **Check Permissions**:
   - Navigate to different sections
   - Verify admin-level access
   - Test admin-only features

3. **Create More Admins**:
   - Use the AdminManager component
   - Or manually in Firebase Console

## Security Notes

- Change default passwords in production
- Use strong passwords for real admin accounts
- Consider implementing 2FA for admin accounts
- Regularly review admin user list
- Remove inactive admin accounts

## Troubleshooting

### "User already exists" error
- The admin user already exists
- Try logging in with existing credentials
- Or create a new admin with different email

### Permission issues
- Verify the user document in Firestore has admin role
- Check permissions array includes all required permissions
- Ensure isActive field is set to true

### Login issues
- Check email/password combination
- Verify Firebase Auth email/password is enabled
- Check if user account is disabled

## Next Steps

1. Create your admin users using one of the methods above
2. Test admin login and permissions
3. Create additional admin users as needed
4. Set up proper admin workflows
5. Configure admin notification preferences

The AdminManager component provides the most user-friendly way to create and manage admin users with full permissions.
