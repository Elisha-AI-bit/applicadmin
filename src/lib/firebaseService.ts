import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject, 
  listAll 
} from "firebase/storage";
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  serverTimestamp 
} from "firebase/firestore";
import { storage, db } from "./firebase";

// Storage Services
export const uploadFile = async (file: File, path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const deleteFile = async (path: string): Promise<void> => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

export const getFileURL = async (path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error("Error getting file URL:", error);
    throw error;
  }
};

export const listFiles = async (path: string) => {
  try {
    const storageRef = ref(storage, path);
    return await listAll(storageRef);
  } catch (error) {
    console.error("Error listing files:", error);
    throw error;
  }
};

// Firestore Services
export const addDocument = async (collectionName: string, data: any) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding document:", error);
    throw error;
  }
};

export const updateDocument = async (collectionName: string, docId: string, data: any) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    return docId;
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
};

export const deleteDocument = async (collectionName: string, docId: string) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    return docId;
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
};

export const getDocument = async (collectionName: string, docId: string) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    throw error;
  }
};

export const getDocuments = async (collectionName: string, constraints?: any[]) => {
  try {
    const collectionRef = collection(db, collectionName);
    
    let q = collectionRef;
    if (constraints && constraints.length > 0) {
      q = query(collectionRef, ...constraints);
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting documents:", error);
    throw error;
  }
};

export const queryDocuments = async (
  collectionName: string,
  whereClause: { field: string; operator: string; value: any },
  orderByClause?: { field: string; direction: 'asc' | 'desc' },
  limitCount?: number
) => {
  try {
    const collectionRef = collection(db, collectionName);
    let q = query(
      collectionRef,
      where(whereClause.field, whereClause.operator as any, whereClause.value)
    );
    
    if (orderByClause) {
      q = query(q, orderBy(orderByClause.field, orderByClause.direction));
    }
    
    if (limitCount) {
      q = query(q, limit(limitCount));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error querying documents:", error);
    throw error;
  }
};

// Real-time sync
export const subscribeToCollection = (
  collectionName: string,
  callback: (documents: any[]) => void,
  constraints?: any[]
) => {
  const collectionRef = collection(db, collectionName);
  
  let q = collectionRef;
  if (constraints && constraints.length > 0) {
    q = query(collectionRef, ...constraints);
  }
  
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const documents = querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
    callback(documents);
  });
  
  return unsubscribe;
};

export const subscribeToDocument = (
  collectionName: string,
  docId: string,
  callback: (document: any | null) => void
) => {
  const docRef = doc(db, collectionName, docId);
  
  const unsubscribe = onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() });
    } else {
      callback(null);
    }
  });
  
  return unsubscribe;
};
