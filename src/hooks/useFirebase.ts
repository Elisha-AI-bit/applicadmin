import { useState, useEffect, useCallback } from 'react';
import { 
  uploadFile, 
  addDocument, 
  updateDocument, 
  deleteDocument, 
  getDocument, 
  getDocuments,
  queryDocuments,
  subscribeToCollection,
  subscribeToDocument
} from '../lib/firebaseService';

// File upload hook
export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(async (file: File, path: string) => {
    setUploading(true);
    setError(null);
    try {
      const url = await uploadFile(file, path);
      return url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  return { upload, uploading, error };
};

// Document CRUD hook
export const useDocument = (collectionName: string, docId?: string) => {
  const [document, setDocument] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get single document
  const fetchDocument = useCallback(async () => {
    if (!docId) return;
    
    setLoading(true);
    setError(null);
    try {
      const doc = await getDocument(collectionName, docId);
      setDocument(doc);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch document');
    } finally {
      setLoading(false);
    }
  }, [collectionName, docId]);

  // Create document
  const create = useCallback(async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const id = await addDocument(collectionName, data);
      return id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create document');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  // Update document
  const update = useCallback(async (data: any) => {
    if (!docId) throw new Error('Document ID is required for updates');
    
    setLoading(true);
    setError(null);
    try {
      await updateDocument(collectionName, docId, data);
      await fetchDocument(); // Refresh the document
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update document');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [collectionName, docId, fetchDocument]);

  // Delete document
  const remove = useCallback(async () => {
    if (!docId) throw new Error('Document ID is required for deletion');
    
    setLoading(true);
    setError(null);
    try {
      await deleteDocument(collectionName, docId);
      setDocument(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete document');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [collectionName, docId]);

  // Real-time subscription
  useEffect(() => {
    if (!docId) return;

    const unsubscribe = subscribeToDocument(collectionName, docId, (doc) => {
      setDocument(doc);
    });

    return () => unsubscribe();
  }, [collectionName, docId]);

  return {
    document,
    loading,
    error,
    create,
    update,
    remove,
    refresh: fetchDocument
  };
};

// Collection hook
export const useCollection = (
  collectionName: string, 
  constraints?: any[],
  realTime: boolean = true
) => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch collection
  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const docs = await getDocuments(collectionName, constraints);
      setDocuments(docs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  }, [collectionName, constraints]);

  // Add document to collection
  const add = useCallback(async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const id = await addDocument(collectionName, data);
      if (!realTime) {
        await fetchDocuments();
      }
      return id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add document');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [collectionName, realTime, fetchDocuments]);

  // Query documents
  const query = useCallback(async (whereClause: { field: string; operator: string; value: any }) => {
    setLoading(true);
    setError(null);
    try {
      const docs = await queryDocuments(collectionName, whereClause);
      setDocuments(docs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to query documents');
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  // Real-time subscription
  useEffect(() => {
    if (!realTime) {
      fetchDocuments();
      return;
    }

    const unsubscribe = subscribeToCollection(collectionName, (docs) => {
      setDocuments(docs);
    }, constraints);

    return () => unsubscribe();
  }, [collectionName, constraints, realTime, fetchDocuments]);

  return {
    documents,
    loading,
    error,
    add,
    query,
    refresh: fetchDocuments
  };
};
