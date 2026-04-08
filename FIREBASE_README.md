# Firebase Storage & Data Sync Implementation

This project now includes Firebase Storage and Firestore for data synchronization capabilities.

## Setup

### 1. Firebase Configuration
The Firebase configuration is already set up in `src/lib/firebase.ts` with your provided credentials:

```typescript
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

### 2. Services Available

#### Firebase Storage (`src/lib/firebaseService.ts`)
- **uploadFile**: Upload files to Firebase Storage
- **deleteFile**: Delete files from Firebase Storage
- **getFileURL**: Get download URL for files
- **listFiles**: List all files in a directory

#### Firestore Database (`src/lib/firebaseService.ts`)
- **addDocument**: Add new documents to collections
- **updateDocument**: Update existing documents
- **deleteDocument**: Delete documents
- **getDocument**: Get a single document by ID
- **getDocuments**: Get all documents from a collection
- **queryDocuments**: Query documents with conditions
- **subscribeToCollection**: Real-time updates for collections
- **subscribeToDocument**: Real-time updates for single documents

#### React Hooks (`src/hooks/useFirebase.ts`)
- **useFileUpload**: Hook for file upload operations
- **useDocument**: Hook for single document CRUD operations
- **useCollection**: Hook for collection operations with real-time sync

## Usage Examples

### File Upload
```typescript
import { useFileUpload } from '../hooks/useFirebase';

const MyComponent = () => {
  const { upload, uploading, error } = useFileUpload();
  
  const handleUpload = async (file: File) => {
    try {
      const url = await upload(file, 'uploads/my-file.jpg');
      console.log('File uploaded:', url);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };
  
  return (
    <input 
      type="file" 
      onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
      disabled={uploading}
    />
  );
};
```

### Database Operations
```typescript
import { useCollection } from '../hooks/useFirebase';

const MyComponent = () => {
  const { documents, add, loading, error } = useCollection('users');
  
  const addUser = async () => {
    try {
      await add({ name: 'John Doe', email: 'john@example.com' });
    } catch (err) {
      console.error('Failed to add user:', err);
    }
  };
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <button onClick={addUser}>Add User</button>
      {documents.map(doc => (
        <div key={doc.id}>{doc.name}</div>
      ))}
    </div>
  );
};
```

### Real-time Data Sync
```typescript
import { useCollection } from '../hooks/useFirebase';

const RealTimeComponent = () => {
  // The useCollection hook automatically sets up real-time listeners
  const { documents } = useCollection('messages', [], true);
  
  return (
    <div>
      {documents.map(msg => (
        <div key={msg.id}>{msg.text}</div>
      ))}
    </div>
  );
};
```

## Security Rules

Make sure to configure your Firebase Security Rules properly:

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Example Component

Check out `src/components/FirebaseExample.tsx` for a complete working example that demonstrates:
- File upload to Firebase Storage
- CRUD operations with Firestore
- Real-time data synchronization
- Error handling and loading states

## Next Steps

1. **Authentication**: Implement Firebase Authentication to secure your data
2. **Security Rules**: Configure proper security rules for your use case
3. **Error Handling**: Add comprehensive error handling throughout your app
4. **Optimization**: Implement caching and optimization strategies for large datasets
5. **Testing**: Add unit tests for your Firebase operations

## Dependencies

The following Firebase packages are installed:
- `firebase` - Core Firebase SDK
- Additional services are imported as needed from the main package

## Troubleshooting

1. **Permission Errors**: Check your Firebase Security Rules
2. **Quota Issues**: Monitor your Firebase usage in the console
3. **Network Errors**: Ensure proper internet connectivity
4. **TypeScript Errors**: Make sure all Firebase types are properly imported

For more information, visit the [Firebase Documentation](https://firebase.google.com/docs).
