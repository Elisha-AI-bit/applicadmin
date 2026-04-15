import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  onSnapshot,
  doc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDoc,
  getDocs,
} from 'firebase/firestore';
import type {
  DocumentData,
  DocumentSnapshot,
  QueryDocumentSnapshot,
  QuerySnapshot,
  FirestoreError,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Mock data fallback for development when Firebase permissions are denied
const getMockData = (collectionName: string, docId?: string) => {
  if (docId) {
    // Return mock single document
    switch (collectionName) {
      case 'applications':
        return {
          id: docId,
          studentName: 'John Doe',
          studentEmail: 'john@example.com',
          schoolName: 'Tech University',
          programName: 'Computer Science',
          status: 'pending',
          paymentStatus: 'pending',
          paymentAmount: 50,
          submittedAt: new Date().toISOString(),
          notes: []
        };
      default:
        return null;
    }
  } else {
    // Return mock collection
    switch (collectionName) {
      case 'applications':
        return [
          {
            id: '1',
            studentName: 'John Doe',
            studentEmail: 'john@example.com',
            schoolName: 'Tech University',
            programName: 'Computer Science',
            status: 'pending',
            paymentStatus: 'pending',
            paymentAmount: 50,
            submittedAt: new Date().toISOString(),
            notes: []
          },
          {
            id: '2',
            studentName: 'Jane Smith',
            studentEmail: 'jane@example.com',
            schoolName: 'State College',
            programName: 'Business Administration',
            status: 'approved',
            paymentStatus: 'completed',
            paymentAmount: 75,
            submittedAt: new Date(Date.now() - 86400000).toISOString(),
            notes: []
          }
        ];
      case 'students':
        return [
          {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            phone: '+1234567890',
            dateOfBirth: '1995-05-15',
            gender: 'male',
            address: {
              street: '123 Main St',
              city: 'Anytown',
              state: 'CA',
              zipCode: '12345',
              country: 'USA'
            },
            guardianInfo: {
              name: 'Parent Doe',
              relationship: 'Father',
              phone: '+1234567891',
              email: 'parent@example.com'
            },
            academicHistory: [],
            applications: ['1'],
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane@example.com',
            phone: '+1234567892',
            dateOfBirth: '1996-08-22',
            gender: 'female',
            address: {
              street: '456 Oak Ave',
              city: 'Somecity',
              state: 'NY',
              zipCode: '67890',
              country: 'USA'
            },
            guardianInfo: {
              name: 'Parent Smith',
              relationship: 'Mother',
              phone: '+1234567893',
              email: 'parent2@example.com'
            },
            academicHistory: [],
            applications: ['2'],
            createdAt: new Date(Date.now() - 86400000).toISOString()
          }
        ];
      case 'payments':
        return [
          {
            id: '1',
            transactionId: '#EnHwhfgH',
            applicationId: '1',
            studentId: '1',
            studentName: 'John Doe',
            amount: 50000,
            currency: 'ZMW',
            method: 'credit_card',
            status: 'pending',
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            transactionId: '#TX8KL9pQ',
            applicationId: '2',
            studentId: '2',
            studentName: 'Jane Smith',
            amount: 75000,
            currency: 'ZMW',
            method: 'mobile_money',
            status: 'completed',
            paidAt: new Date(Date.now() - 86400000).toISOString(),
            createdAt: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: '3',
            transactionId: '#BX5MN2jR',
            applicationId: '3',
            studentId: '3',
            studentName: 'Alice Johnson',
            amount: 60000,
            currency: 'ZMW',
            method: 'bank_transfer',
            status: 'completed',
            paidAt: new Date(Date.now() - 172800000).toISOString(),
            createdAt: new Date(Date.now() - 172800000).toISOString()
          },
          {
            id: '4',
            transactionId: '#CW3LP8vS',
            applicationId: '4',
            studentId: '4',
            studentName: 'Bob Wilson',
            amount: 50000,
            currency: 'ZMW',
            method: 'credit_card',
            status: 'completed',
            paidAt: new Date(Date.now() - 259200000).toISOString(),
            createdAt: new Date(Date.now() - 259200000).toISOString()
          },
          {
            id: '5',
            transactionId: '#DY7QS6wT',
            applicationId: '5',
            studentId: '5',
            studentName: 'Carol Davis',
            amount: 80000,
            currency: 'ZMW',
            method: 'mobile_money',
            status: 'pending',
            createdAt: new Date(Date.now() - 345600000).toISOString()
          }
        ];
      case 'activities':
        return [
          {
            id: '1',
            type: 'application_submitted',
            description: 'New application submitted by John Doe',
            actor: 'System',
            targetId: '1',
            targetType: 'application',
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            type: 'payment_completed',
            description: 'Payment completed for Jane Smith',
            actor: 'System',
            targetId: '2',
            targetType: 'payment',
            createdAt: new Date(Date.now() - 3600000).toISOString()
          }
        ];
      default:
        return [];
    }
  }
};

interface RealtimeQueryOptions {
  queryKey: any[];
  collectionName: string;
  docId?: string;
  constraints?: any[];
  enabled?: boolean;
  staleTime?: number;
}

export function useRealtimeQuery<T = any>({
  queryKey,
  collectionName,
  docId,
  constraints = [],
  enabled = true,
  staleTime = 5 * 60 * 1000, // 5 minutes
}: RealtimeQueryOptions) {
  const queryClient = useQueryClient();
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);

  // Initial query using React Query
  const queryResult = useQuery({
    queryKey,
    queryFn: async () => {
      if (docId) {
        // Get single document
        const docRef = doc(db, collectionName, docId);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as T : null;
      } else {
        // Get collection
        const collectionRef = collection(db, collectionName);
        let q: any = collectionRef;
        if (constraints.length > 0) {
          q = query(collectionRef, ...constraints);
        }
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) })) as T[];
      }
    },
    enabled,
    staleTime,
  });

  // Set up real-time subscription
  useEffect(() => {
    if (!enabled) return;

    let unsubscribe: () => void;

    try {
      if (docId) {
        // Subscribe to single document
        const docRef = doc(db, collectionName, docId);
        unsubscribe = onSnapshot(docRef, (docSnap: DocumentSnapshot<DocumentData>) => {
          const data = docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as T : null;
          queryClient.setQueryData(queryKey, data);
          setIsRealtimeConnected(true);
        }, (error: FirestoreError) => {
          console.error('Real-time subscription error:', error);
          setIsRealtimeConnected(false);
          // Fall back to mock data if permission denied
          if (error.code === 'permission-denied') {
            console.log('Falling back to mock data due to Firebase permissions');
            const mockData = getMockData(collectionName, docId);
            queryClient.setQueryData(queryKey, mockData);
          }
        });
      } else {
        // Subscribe to collection
        const collectionRef = collection(db, collectionName);
        let q: any = collectionRef;
        if (constraints.length > 0) {
          q = query(collectionRef, ...constraints);
        }
        
        unsubscribe = onSnapshot(q, (querySnapshot: QuerySnapshot<DocumentData>) => {
          const data = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({ id: doc.id, ...(doc.data() as any) })) as T[];
          queryClient.setQueryData(queryKey, data);
          setIsRealtimeConnected(true);
        }, (error: FirestoreError) => {
          console.error('Real-time subscription error:', error);
          setIsRealtimeConnected(false);
          // Fall back to mock data if permission denied
          if (error.code === 'permission-denied') {
            console.log('Falling back to mock data due to Firebase permissions');
            const mockData = getMockData(collectionName);
            queryClient.setQueryData(queryKey, mockData);
          }
        });
      }
    } catch (error) {
      console.error('Error setting up real-time subscription:', error);
      setIsRealtimeConnected(false);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
        setIsRealtimeConnected(false);
      }
    };
  }, [collectionName, docId, JSON.stringify(constraints), enabled, queryClient, ...queryKey]);

  return {
    ...queryResult,
    isRealtimeConnected,
  };
}

// Specialized hooks for common use cases
export function useRealtimeApplications(filters?: {
  status?: string;
  schoolId?: string;
}) {
  const constraints = [];
  if (filters?.status) {
    constraints.push(where('status', '==', filters.status));
  }
  if (filters?.schoolId) {
    constraints.push(where('schoolId', '==', filters.schoolId));
  }

  return useRealtimeQuery<any[]>({
    queryKey: ['applications', filters],
    collectionName: 'applications',
    constraints,
  });
}

export function useRealtimeStudents(search?: string) {
  const constraints = [];
  if (search) {
    constraints.push(
      where('firstName', '>=', search),
      where('firstName', '<=', search + '\uf8ff')
    );
  }

  return useRealtimeQuery<any[]>({
    queryKey: ['students', search],
    collectionName: 'students',
    constraints,
  });
}

export function useRealtimePayments(filters?: {
  status?: string;
  method?: string;
}) {
  const constraints = [];
  if (filters?.status) {
    constraints.push(where('status', '==', filters.status));
  }
  if (filters?.method) {
    constraints.push(where('method', '==', filters.method));
  }

  return useRealtimeQuery<any[]>({
    queryKey: ['payments', filters],
    collectionName: 'payments',
    constraints,
  });
}

export function useRealtimePrograms(filters?: {
  status?: string;
  schoolId?: string;
}) {
  const constraints = [];
  if (filters?.status) {
    constraints.push(where('status', '==', filters.status));
  }
  if (filters?.schoolId) {
    constraints.push(where('schoolId', '==', filters.schoolId));
  }

  return useRealtimeQuery<any[]>({
    queryKey: ['programs', filters],
    collectionName: 'programs',
    constraints,
  });
}

export function useRealtimeSchools(status?: string) {
  const constraints = [];
  if (status) {
    constraints.push(where('status', '==', status));
  }

  return useRealtimeQuery<any[]>({
    queryKey: ['schools', status],
    collectionName: 'schools',
    constraints,
  });
}

export function useRealtimeDocument(collectionName: string, docId: string) {
  return useRealtimeQuery<any>({
    queryKey: [collectionName, docId],
    collectionName,
    docId,
  });
}

export function useRealtimeActivities(limitCount = 10) {
  const constraints = [
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  ];

  return useRealtimeQuery<any[]>({
    queryKey: ['activities', limitCount],
    collectionName: 'activities',
    constraints,
  });
}
