// Firebase data models for the application

export interface FirestoreSync {
  syncStatus: 'synced' | 'pending' | 'error';
  lastSyncedAt?: string;
}

export interface School {
  id: string;
  school_id: string;
  school_name: string;
  school_code: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  isActive: boolean;
  firestoreSync: FirestoreSync;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Program {
  id: string;
  program_id: string;
  school_id: string;
  program_name: string;
  program_code: string;
  qualification_type: 'Degree' | 'Diploma' | 'Certificate';
  duration_years: number;
  total_semesters: number;
  entry_requirements: string;
  description: string;
  status: 'draft' | 'published' | 'closed' | 'archived';
  isActive: boolean;
  firestoreSync: FirestoreSync;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface PersonalInfo {
  firstName?: string;
  lastName?: string;
  dob?: string;
  gender?: string;
  nationality?: string;
  nrcPassport?: string;
  maritalStatus?: string;
}

export interface ContactInfo {
  phoneNumber?: string;
  email?: string;
  address?: string;
  city?: string;
  province?: string;
  country?: string;
}

export interface SubjectGrade {
  subject?: string;
  grade?: string;
}

export interface AcademicInfo {
  schoolName?: string;
  examLevel?: string;
  completionYear?: string;
  certificateNumber?: string;
  grades?: SubjectGrade[];
}

export interface ProgrammeChoice {
  faculty?: string;
  programmeName?: string;
  modeOfStudy?: string;
  intake?: string;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  phone: string;
  phoneNumber?: string;
  gender: string;
  dateOfBirth: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
  };
  applications: string[];
  academicHistory: Array<{
    institution: string;
    degree: string;
    fieldOfStudy: string;
    gpa: string | number;
    graduationYear: string | number;
  }>;
  guardianInfo?: {
    name: string;
    relationship: string;
    phone: string;
    email: string;
  };
  role?: 'student';
  createdAt: string;
  lastLoginAt?: string;
}

export interface ApplicationDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  verified?: boolean;
  uploadedAt: string;
}

export interface ApplicationNote {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
}

export interface Application {
  id: string;
  userId?: string;
  applicationId?: string;
  studentName?: string;
  studentEmail?: string;
  studentPhone?: string;
  schoolName?: string;
  schoolId?: string;
  studentId?: string;
  programId?: string;
  programName?: string;
  personalInfo?: PersonalInfo;
  contactInfo?: ContactInfo;
  academicInfo?: AcademicInfo;
  programmeChoice?: ProgrammeChoice;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'waitlisted' | 'withdrawn';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentAmount: number;
  documents: ApplicationDocument[];
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes: ApplicationNote[];
  source: 'web' | 'mobile_app' | 'manual';
}

export interface Payment {
  id: string;
  applicationId: string;
  studentId: string;
  studentName: string;
  amount: number;
  currency: string;
  method: 'credit_card' | 'mobile_money' | 'bank_transfer' | 'paypal' | 'cash';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  paidAt?: string;
  refundedAt?: string;
  refundReason?: string;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'staff';
  permissions: string[];
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  type: string;
  description: string;
  actor: string;
  targetId: string;
  targetType: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'email' | 'sms' | 'push';
  recipients: string[];
  status: 'draft' | 'sent' | 'failed';
  sentAt?: string;
  createdAt: string;
  createdBy: string;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: 'email' | 'sms' | 'push';
  variables: string[];
  createdAt: string;
}

export interface DashboardStats {
  totalApplications: number;
  pendingReviews: number;
  approved: number;
  rejected: number;
  revenue: number;
  pendingPayments: number;
  applicationsTrend: Array<{ date: string; count: number }>;
  statusDistribution: Array<{ status: string; count: number }>;
  revenueTrend: Array<{ period: string; amount: number }>;
  applicationsBySchool: Array<{ school: string; count: number }>;
}

export interface BulkImportJob {
  id: string;
  type: 'schools' | 'programs' | 'students';
  status: 'processing' | 'completed' | 'failed';
  fileName: string;
  totalRows: number;
  processedRows: number;
  successfulRows: number;
  failedRows: number;
  errors: Array<{ row: number; message: string; data: any }>;
  startedAt: string;
  completedAt?: string;
  createdBy: string;
}
