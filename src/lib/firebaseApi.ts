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
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import type {
  School,
  Program,
  Student,
  Application,
  Payment,
  AdminUser,
  DashboardStats,
  Activity,
  Notification,
  NotificationTemplate,
  BulkImportJob
} from '../types';

// Helper function to convert Firestore timestamps to strings
const convertTimestamps = (obj: any): any => {
  if (obj instanceof Timestamp) {
    return obj.toDate().toISOString();
  }
  if (Array.isArray(obj)) {
    return obj.map(convertTimestamps);
  }
  if (obj && typeof obj === 'object') {
    const converted: any = {};
    for (const key in obj) {
      converted[key] = convertTimestamps(obj[key]);
    }
    return converted;
  }
  return obj;
};

// Schools API
export const schoolsApi = {
  getSchools: async (status?: string): Promise<School[]> => {
    const schoolsRef = collection(db, 'schools');
    let q: any = schoolsRef;
    
    if (status) {
      q = query(q, where('status', '==', status));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestamps(doc.data())
    })) as School[];
  },

  getSchool: async (id: string): Promise<School | null> => {
    const docRef = doc(db, 'schools', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...convertTimestamps(docSnap.data())
      } as School;
    }
    return null;
  },

  createSchool: async (data: Omit<School, 'id' | 'createdAt' | 'updatedAt'>): Promise<School> => {
    const schoolsRef = collection(db, 'schools');
    const docRef = await addDoc(schoolsRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    const newDoc = await getDoc(docRef);
    return {
      id: docRef.id,
      ...convertTimestamps(newDoc.data())
    } as School;
  },

  updateSchool: async (id: string, data: Partial<School>): Promise<void> => {
    const docRef = doc(db, 'schools', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  },

  deleteSchool: async (id: string): Promise<void> => {
    const docRef = doc(db, 'schools', id);
    await deleteDoc(docRef);
  },

  subscribeToSchools: (callback: (schools: School[]) => void, status?: string) => {
    const schoolsRef = collection(db, 'schools');
    let q: any = schoolsRef;
    
    if (status) {
      q = query(q, where('status', '==', status));
    }
    
    return onSnapshot(q, (querySnapshot) => {
      const schools = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestamps(doc.data())
      })) as School[];
      callback(schools);
    });
  }
};

// Programs API
export const programsApi = {
  getPrograms: async (schoolId?: string): Promise<Program[]> => {
    const programsRef = collection(db, 'programs');
    let q: any = programsRef;
    
    if (schoolId) {
      q = query(q, where('school_id', '==', schoolId));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestamps(doc.data())
    })) as Program[];
  },

  getProgram: async (id: string): Promise<Program | null> => {
    const docRef = doc(db, 'programs', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...convertTimestamps(docSnap.data())
      } as Program;
    }
    return null;
  },

  createProgram: async (data: Omit<Program, 'id' | 'createdAt' | 'updatedAt'>): Promise<Program> => {
    const programsRef = collection(db, 'programs');
    const docRef = await addDoc(programsRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    const newDoc = await getDoc(docRef);
    return {
      id: docRef.id,
      ...convertTimestamps(newDoc.data())
    } as Program;
  },

  updateProgram: async (id: string, data: Partial<Program>): Promise<void> => {
    const docRef = doc(db, 'programs', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  },

  deleteProgram: async (id: string): Promise<void> => {
    const docRef = doc(db, 'programs', id);
    await deleteDoc(docRef);
  }
};

// Students API
export const studentsApi = {
  getStudents: async (search?: string): Promise<Student[]> => {
    const studentsRef = collection(db, 'students');
    let q: any = studentsRef;
    
    if (search) {
      q = query(q, 
        where('firstName', '>=', search),
        where('firstName', '<=', search + '\uf8ff')
      );
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestamps(doc.data())
    })) as Student[];
  },

  subscribeToStudents: (callback: (students: Student[]) => void, search?: string) => {
    const studentsRef = collection(db, 'students');
    let q: any = studentsRef;
    
    if (search) {
      q = query(q, 
        where('firstName', '>=', search),
        where('firstName', '<=', search + '\uf8ff')
      );
    }
    
    return onSnapshot(q, (querySnapshot) => {
      const students = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestamps(doc.data())
      })) as Student[];
      callback(students);
    });
  },

  getStudent: async (id: string): Promise<Student | null> => {
    const docRef = doc(db, 'students', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...convertTimestamps(docSnap.data())
      } as Student;
    }
    return null;
  },

  createStudent: async (data: Omit<Student, 'id' | 'createdAt'>): Promise<Student> => {
    const studentsRef = collection(db, 'students');
    const docRef = await addDoc(studentsRef, {
      ...data,
      createdAt: serverTimestamp()
    });
    
    const newDoc = await getDoc(docRef);
    return {
      id: docRef.id,
      ...convertTimestamps(newDoc.data())
    } as Student;
  },

  updateStudent: async (id: string, data: Partial<Student>): Promise<void> => {
    const docRef = doc(db, 'students', id);
    await updateDoc(docRef, data);
  }
};

// Helper to map snake_case Firestore data (from Flutter) to camelCase React models
const mapApplicationData = (id: string, rawData: any): Application => {
  const data = convertTimestamps(rawData);
  return {
    id,
    userId: data.user_id || data.userId,
    applicationId: data.application_id || data.applicationId,
    studentName: data.studentName,
    studentEmail: data.studentEmail,
    studentPhone: data.studentPhone,
    schoolName: data.schoolName,
    schoolId: data.schoolId,
    studentId: data.studentId,
    programId: data.programId,
    programName: data.programName,
    status: data.status || 'pending',
    paymentStatus: data.payment_status || data.paymentStatus || 'pending',
    paymentAmount: data.paymentAmount || 0,
    documents: (data.documents || []).map((d: any) => ({
      id: d.id || Math.random().toString(36).substr(2, 9),
      name: d.file_name || d.name,
      type: d.type,
      url: d.download_url || d.url,
      verified: d.verified,
      uploadedAt: d.upload_date || d.uploadedAt
    })),
    submittedAt: data.created_at || data.submittedAt || data.createdAt || new Date().toISOString(),
    reviewedAt: data.reviewedAt,
    reviewedBy: data.reviewedBy,
    notes: data.notes || [],
    source: data.source || 'mobile_app',
    
    personalInfo: {
      firstName: data.personal_info?.first_name || data.personalInfo?.firstName,
      lastName: data.personal_info?.last_name || data.personalInfo?.lastName,
      dob: data.personal_info?.dob || data.personalInfo?.dob,
      gender: data.personal_info?.gender || data.personalInfo?.gender,
      nationality: data.personal_info?.nationality || data.personalInfo?.nationality,
      nrcPassport: data.personal_info?.nrc_passport || data.personalInfo?.nrcPassport,
      maritalStatus: data.personal_info?.marital_status || data.personalInfo?.maritalStatus,
    },
    contactInfo: {
      phoneNumber: data.contact_info?.phone_number || data.contactInfo?.phoneNumber,
      email: data.contact_info?.email || data.contactInfo?.email,
      address: data.contact_info?.address || data.contactInfo?.address,
      city: data.contact_info?.city || data.contactInfo?.city,
      province: data.contact_info?.province || data.contactInfo?.province,
      country: data.contact_info?.country || data.contactInfo?.country,
    },
    academicInfo: {
      schoolName: data.academic_info?.school_name || data.academicInfo?.schoolName,
      examLevel: data.academic_info?.exam_level || data.academicInfo?.examLevel,
      completionYear: data.academic_info?.completion_year || data.academicInfo?.completionYear,
      certificateNumber: data.academic_info?.certificate_number || data.academicInfo?.certificateNumber,
      grades: data.academic_info?.grades || data.academicInfo?.grades || [],
    },
    programmeChoice: {
      faculty: data.programme_choice?.school_name || data.programmeChoice?.faculty,
      programmeName: data.programme_choice?.programme_name || data.programmeChoice?.programmeName,
      modeOfStudy: data.programme_choice?.mode_of_study || data.programmeChoice?.modeOfStudy,
      intake: data.programme_choice?.intake || data.programmeChoice?.intake,
    },
  } as Application;
};

// Applications API
export const applicationsApi = {
  getApplications: async (filters?: {
    status?: string;
    schoolId?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<Application[]> => {
    const applicationsRef = collection(db, 'applications');
    let q: any = applicationsRef;
    
    if (filters?.status) {
      q = query(q, where('status', '==', filters.status));
    }
    if (filters?.schoolId) {
      q = query(q, where('schoolId', '==', filters.schoolId));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => mapApplicationData(doc.id, doc.data()));
  },

  subscribeToApplications: (callback: (applications: Application[]) => void, filters?: {
    status?: string;
    schoolId?: string;
  }) => {
    const applicationsRef = collection(db, 'applications');
    let q: any = applicationsRef;
    
    if (filters?.status) {
      q = query(q, where('status', '==', filters.status));
    }
    if (filters?.schoolId) {
      q = query(q, where('schoolId', '==', filters.schoolId));
    }
    
    return onSnapshot(q, (querySnapshot) => {
      const applications = querySnapshot.docs.map(doc => mapApplicationData(doc.id, doc.data()));
      callback(applications);
    });
  },

  getApplication: async (id: string): Promise<Application | null> => {
    const docRef = doc(db, 'applications', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return mapApplicationData(docSnap.id, docSnap.data());
    }
    return null;
  },

  updateApplicationStatus: async (id: string, status: Application['status'], note?: string): Promise<void> => {
    const docRef = doc(db, 'applications', id);
    const applicationData = await applicationsApi.getApplication(id);
    
    const updateData: any = {
      status,
      reviewedAt: serverTimestamp(),
      reviewedBy: 'Admin Assistant' // In production, get from auth
    };
    
    if (note) {
      const newNote = {
        id: Date.now().toString(),
        content: note,
        authorId: 'admin-id',
        authorName: 'Admin Assistant',
        createdAt: new Date().toISOString()
      };
      updateData.notes = applicationData ? [...(applicationData.notes || []), newNote] : [newNote];
    }
    
    await updateDoc(docRef, updateData);
  },

  addApplicationNote: async (id: string, content: string): Promise<void> => {
    const docRef = doc(db, 'applications', id);
    const applicationData = await applicationsApi.getApplication(id);
    
    if (applicationData) {
      const newNote = {
        id: Date.now().toString(),
        content,
        authorId: 'admin-id',
        authorName: 'Admin Assistant',
        createdAt: new Date().toISOString()
      };
      
      await updateDoc(docRef, {
        notes: [...(applicationData.notes || []), newNote]
      });
    }
  },

  verifyDocument: async (id: string, docId: string, verified: boolean): Promise<void> => {
    const docRef = doc(db, 'applications', id);
    const applicationData = await applicationsApi.getApplication(id);
    
    if (applicationData && applicationData.documents) {
      const updatedDocs = applicationData.documents.map(d => 
        d.id === docId ? { ...d, verified } : d
      );
      
      await updateDoc(docRef, {
        documents: updatedDocs
      });
    }
  }
};

// Payments API
export const paymentsApi = {
  getPayments: async (filters?: { status?: string; method?: string }): Promise<Payment[]> => {
    const paymentsRef = collection(db, 'payments');
    let q: any = paymentsRef;
    
    if (filters?.status) {
      q = query(q, where('status', '==', filters.status));
    }
    if (filters?.method) {
      q = query(q, where('method', '==', filters.method));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestamps(doc.data())
    })) as Payment[];
  },

  subscribeToPayments: (callback: (payments: Payment[]) => void, filters?: { status?: string; method?: string }) => {
    const paymentsRef = collection(db, 'payments');
    let q: any = paymentsRef;
    
    if (filters?.status) {
      q = query(q, where('status', '==', filters.status));
    }
    if (filters?.method) {
      q = query(q, where('method', '==', filters.method));
    }
    
    return onSnapshot(q, (querySnapshot) => {
      const payments = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestamps(doc.data())
      })) as Payment[];
      callback(payments);
    });
  },

  getPayment: async (id: string): Promise<Payment | null> => {
    const docRef = doc(db, 'payments', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...convertTimestamps(docSnap.data())
      } as Payment;
    }
    return null;
  },

  processRefund: async (id: string, reason: string): Promise<void> => {
    const docRef = doc(db, 'payments', id);
    await updateDoc(docRef, {
      status: 'refunded',
      refundReason: reason,
      refundedAt: serverTimestamp()
    });
  }
};

// Users API
export const usersApi = {
  getUsers: async (): Promise<AdminUser[]> => {
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestamps(doc.data())
    })) as AdminUser[];
  },

  getUser: async (id: string): Promise<AdminUser | null> => {
    const docRef = doc(db, 'users', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...convertTimestamps(docSnap.data())
      } as AdminUser;
    }
    return null;
  },

  createUser: async (data: Omit<AdminUser, 'id' | 'createdAt'>): Promise<AdminUser> => {
    const usersRef = collection(db, 'users');
    const docRef = await addDoc(usersRef, {
      ...data,
      createdAt: serverTimestamp()
    });
    
    const newDoc = await getDoc(docRef);
    return {
      id: docRef.id,
      ...convertTimestamps(newDoc.data())
    } as AdminUser;
  },

  updateUser: async (id: string, data: Partial<AdminUser>): Promise<void> => {
    const docRef = doc(db, 'users', id);
    await updateDoc(docRef, data);
  },

  deleteUser: async (id: string): Promise<void> => {
    const docRef = doc(db, 'users', id);
    await deleteDoc(docRef);
  }
};

// Dashboard API
export const dashboardApi = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    // This would typically use aggregation queries or cloud functions
    // For now, we'll fetch and aggregate the data client-side
    
    const [applications, payments] = await Promise.all([
      applicationsApi.getApplications(),
      paymentsApi.getPayments()
    ]);

    const totalApplications = applications.length;
    const pendingReviews = applications.filter(a => a.status === 'pending' || a.status === 'under_review').length;
    const approved = applications.filter(a => a.status === 'approved').length;
    const rejected = applications.filter(a => a.status === 'rejected').length;
    const revenue = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
    const pendingPayments = payments.filter(p => p.status === 'pending').length;

    // Aggregate by Status
    const statusCounts: Record<string, number> = {
      pending: 0,
      under_review: 0,
      approved: 0,
      rejected: 0,
      waitlisted: 0,
    };
    applications.forEach(a => {
      if (statusCounts[a.status] !== undefined) statusCounts[a.status]++;
    });

    // Aggregate by Faculty/School
    const schoolCounts: Record<string, number> = {};
    applications.forEach(a => {
      const school = a.programmeChoice?.faculty || 'Unspecified';
      schoolCounts[school] = (schoolCounts[school] || 0) + 1;
    });

    // Simple trend aggregation (last 7 days based on submittedAt)
    const trend: Record<string, number> = {};
    applications.forEach(a => {
      if (a.submittedAt) {
        const date = a.submittedAt.split('T')[0];
        trend[date] = (trend[date] || 0) + 1;
      }
    });

    return {
      totalApplications,
      pendingReviews,
      approved,
      rejected,
      revenue,
      pendingPayments,
      applicationsTrend: Object.entries(trend)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-10),
      statusDistribution: Object.entries(statusCounts).map(([status, count]) => ({ status, count })),
      revenueTrend: [], // Simplified for now
      applicationsBySchool: Object.entries(schoolCounts)
        .map(([school, count]) => ({ school, count }))
        .sort((a, b) => b.count - a.count)
    };
  },

  getActivities: async (limitCount = 10): Promise<Activity[]> => {
    const activitiesRef = collection(db, 'activities');
    const q = query(activitiesRef, orderBy('createdAt', 'desc'), limit(limitCount));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestamps(doc.data())
    })) as Activity[];
  }
};

// Notifications API
export const notificationsApi = {
  getNotifications: async (): Promise<Notification[]> => {
    const notificationsRef = collection(db, 'notifications');
    const querySnapshot = await getDocs(notificationsRef);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestamps(doc.data())
    })) as Notification[];
  },

  sendNotification: async (notification: Omit<Notification, 'id' | 'createdAt' | 'sentAt'>): Promise<Notification> => {
    const notificationsRef = collection(db, 'notifications');
    const docRef = await addDoc(notificationsRef, {
      ...notification,
      createdAt: serverTimestamp(),
      sentAt: serverTimestamp()
    });
    
    const newDoc = await getDoc(docRef);
    return {
      id: docRef.id,
      ...convertTimestamps(newDoc.data())
    } as Notification;
  },

  getTemplates: async (): Promise<NotificationTemplate[]> => {
    const templatesRef = collection(db, 'notificationTemplates');
    const querySnapshot = await getDocs(templatesRef);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestamps(doc.data())
    })) as NotificationTemplate[];
  }
};

// Bulk Import API
export const bulkImportApi = {
  startImportJob: async (type: 'schools' | 'programs' | 'students', file: File): Promise<BulkImportJob> => {
    const jobsRef = collection(db, 'bulkImportJobs');
    const docRef = await addDoc(jobsRef, {
      type,
      status: 'processing',
      fileName: file.name,
      totalRows: 0,
      processedRows: 0,
      successfulRows: 0,
      failedRows: 0,
      errors: [],
      startedAt: serverTimestamp(),
      createdBy: 'current-user'
    });
    
    const newDoc = await getDoc(docRef);
    return {
      id: docRef.id,
      ...convertTimestamps(newDoc.data())
    } as BulkImportJob;
  },

  getImportJob: async (jobId: string): Promise<BulkImportJob | null> => {
    const docRef = doc(db, 'bulkImportJobs', jobId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...convertTimestamps(docSnap.data())
      } as BulkImportJob;
    }
    return null;
  }
};

// Export all APIs
export const firebaseApi = {
  schools: schoolsApi,
  programs: programsApi,
  students: studentsApi,
  applications: applicationsApi,
  payments: paymentsApi,
  users: usersApi,
  dashboard: dashboardApi,
  notifications: notificationsApi,
  bulkImport: bulkImportApi
};
