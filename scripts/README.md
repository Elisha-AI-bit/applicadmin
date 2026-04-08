# Create Admin User Script

This script creates a development admin user that bypasses Firebase authentication for easy testing.

## Usage

Run the script using npm:
```bash
npm run create-admin
```

## What the script does

1. Creates an admin user file at `public/admin-user.json` with:
   - Email: admin@gmail.com
   - UID: JJwbaDlUsng3ssVZF3Eto7h5Nfi1
   - Role: super_admin
   - Permissions: []
   - isActive: true

2. The application automatically detects this file and allows login with:
   - Email: admin@gmail.com
   - Password: Any password (development mode only)

## How it works

The auth service checks if the login email is `admin@gmail.com` and tries to fetch the admin user data from `/admin-user.json`. If found, it authenticates the user without going through Firebase Auth.

## After running

You can now login to the application with:
- Email: admin@gmail.com
- Password: Any password

The user will have super_admin privileges in the application.

## File locations

- Script: `scripts/create-admin.js`
- Admin data: `public/admin-user.json`
- Auth logic: `src/lib/authService.ts`

## Notes

- This is for development purposes only
- The admin user file should not be committed to production
- No Firebase Admin SDK setup required
- Works with your existing Firebase configuration
