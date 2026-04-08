import type {
  Application,
  Student,
  Payment,
  School,
  Program,
  AdminUser,
  DashboardStats,
  Activity,
  Notification,
  NotificationTemplate,
  BulkImportJob,
} from '@/types';

// Mock Data
const mockStudents: Student[] = [
  {
    id: '1',
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice@example.com',
    phone: '+1 234-567-8901',
    dateOfBirth: '2000-03-15',
    gender: 'female',
    address: { street: '123 Main St', city: 'New York', state: 'NY', zipCode: '10001', country: 'USA' },
    guardianInfo: { name: 'Robert Johnson', relationship: 'Father', phone: '+1 234-567-8902', email: 'robert@example.com' },
    academicHistory: [{ institution: 'Central High School', degree: 'High School Diploma', fieldOfStudy: 'General', graduationYear: 2018, gpa: 3.8 }],
    applications: ['1', '2'],
    createdAt: '2024-01-15T10:00:00Z',
    lastLoginAt: '2024-03-10T14:30:00Z',
  },
  {
    id: '2',
    firstName: 'Bob',
    lastName: 'Smith',
    email: 'bob@example.com',
    phone: '+1 234-567-8903',
    dateOfBirth: '1999-07-22',
    gender: 'male',
    address: { street: '456 Oak Ave', city: 'Los Angeles', state: 'CA', zipCode: '90001', country: 'USA' },
    guardianInfo: { name: 'Maria Smith', relationship: 'Mother', phone: '+1 234-567-8913', email: 'maria.smith@example.com' },
    academicHistory: [{ institution: 'West High School', degree: 'High School Diploma', fieldOfStudy: 'Science', graduationYear: 2017, gpa: 3.5 }],
    applications: ['3'],
    createdAt: '2024-02-01T09:00:00Z',
  },
  {
    id: '3',
    firstName: 'Carol',
    lastName: 'Williams',
    email: 'carol@example.com',
    phone: '+1 234-567-8904',
    dateOfBirth: '2001-11-08',
    gender: 'female',
    address: { street: '789 Pine Rd', city: 'Chicago', state: 'IL', zipCode: '60601', country: 'USA' },
    guardianInfo: { name: 'Daniel Williams', relationship: 'Father', phone: '+1 234-567-8914', email: 'daniel.williams@example.com' },
    academicHistory: [{ institution: 'North High School', degree: 'High School Diploma', fieldOfStudy: 'Arts', graduationYear: 2019, gpa: 3.9 }],
    applications: ['4', '5'],
    createdAt: '2024-02-20T11:00:00Z',
    lastLoginAt: '2024-03-12T09:15:00Z',
  },
  {
    id: '4',
    firstName: 'David',
    lastName: 'Brown',
    email: 'david@example.com',
    phone: '+1 234-567-8905',
    dateOfBirth: '1998-05-30',
    gender: 'male',
    address: { street: '321 Elm St', city: 'Houston', state: 'TX', zipCode: '77001', country: 'USA' },
    guardianInfo: { name: 'Susan Brown', relationship: 'Mother', phone: '+1 234-567-8915', email: 'susan.brown@example.com' },
    academicHistory: [{ institution: 'South High School', degree: 'High School Diploma', fieldOfStudy: 'Mathematics', graduationYear: 2016, gpa: 3.7 }],
    applications: ['6'],
    createdAt: '2024-03-01T13:00:00Z',
  },
  {
    id: '5',
    firstName: 'Emma',
    lastName: 'Davis',
    email: 'emma@example.com',
    phone: '+1 234-567-8906',
    dateOfBirth: '2002-09-12',
    gender: 'female',
    address: { street: '654 Maple Dr', city: 'Miami', state: 'FL', zipCode: '33101', country: 'USA' },
    guardianInfo: { name: 'Michael Davis', relationship: 'Father', phone: '+1 234-567-8916', email: 'michael.davis@example.com' },
    academicHistory: [{ institution: 'East High School', degree: 'High School Diploma', fieldOfStudy: 'Literature', graduationYear: 2020, gpa: 3.6 }],
    applications: ['7'],
    createdAt: '2024-03-05T08:00:00Z',
    lastLoginAt: '2024-03-11T16:45:00Z',
  },
];

const mockSchools: School[] = [
  {
    id: '1',
    school_id: '1',
    school_name: 'School of Engineering',
    school_code: 'ENG',
    description: 'Groups engineering-related programs and departments.',
    status: 'published',
    isActive: true,
    firestoreSync: { syncStatus: 'synced', lastSyncedAt: '2024-03-10T10:00:00Z' },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-03-10T10:00:00Z',
    createdBy: 'admin1',
  },
  {
    id: '2',
    school_id: '2',
    school_name: 'School of Business',
    school_code: 'BUS',
    description: 'Groups business and management programs.',
    status: 'published',
    isActive: true,
    firestoreSync: { syncStatus: 'synced', lastSyncedAt: '2024-03-09T15:00:00Z' },
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2024-03-09T15:00:00Z',
    createdBy: 'admin1',
  },
  {
    id: '3',
    school_id: '3',
    school_name: 'School of Education',
    school_code: 'EDU',
    description: 'Groups teacher training and education programs.',
    status: 'draft',
    isActive: true,
    firestoreSync: { syncStatus: 'pending' },
    createdAt: '2023-02-01T00:00:00Z',
    updatedAt: '2024-03-08T12:00:00Z',
    createdBy: 'admin2',
  },
  {
    id: '4',
    school_id: '4',
    school_name: 'School of Medicine',
    school_code: 'MED',
    description: 'Groups medical and health science programs.',
    status: 'published',
    isActive: true,
    firestoreSync: { syncStatus: 'synced', lastSyncedAt: '2024-03-07T09:00:00Z' },
    createdAt: '2023-02-15T00:00:00Z',
    updatedAt: '2024-03-07T09:00:00Z',
    createdBy: 'admin1',
  },
];

const mockPrograms: Program[] = [
  { id: '1', program_id: '1', school_id: '1', program_name: 'Bachelor of Computer Science', program_code: 'BCS', qualification_type: 'Degree', duration_years: 4, total_semesters: 8, entry_requirements: 'High school certificate with strong mathematics background.', description: 'Core computer science program covering software, systems, and data.', status: 'published', isActive: true, firestoreSync: { syncStatus: 'synced', lastSyncedAt: '2024-03-10T10:00:00Z' }, createdAt: '2023-01-01T00:00:00Z', updatedAt: '2024-03-10T10:00:00Z', createdBy: 'admin1' },
  { id: '2', program_id: '2', school_id: '1', program_name: 'Bachelor of Civil Engineering', program_code: 'BENG', qualification_type: 'Degree', duration_years: 4, total_semesters: 8, entry_requirements: 'High school certificate with mathematics and physics.', description: 'Engineering program focused on infrastructure and construction systems.', status: 'published', isActive: true, firestoreSync: { syncStatus: 'synced', lastSyncedAt: '2024-03-10T10:00:00Z' }, createdAt: '2023-01-01T00:00:00Z', updatedAt: '2024-03-10T10:00:00Z', createdBy: 'admin1' },
  { id: '3', program_id: '3', school_id: '2', program_name: 'Bachelor of Accounting', program_code: 'BACC', qualification_type: 'Degree', duration_years: 4, total_semesters: 8, entry_requirements: 'High school certificate and basic business studies.', description: 'Accounting and financial reporting program for business practice.', status: 'published', isActive: true, firestoreSync: { syncStatus: 'synced', lastSyncedAt: '2024-03-09T15:00:00Z' }, createdAt: '2023-01-15T00:00:00Z', updatedAt: '2024-03-09T15:00:00Z', createdBy: 'admin1' },
  { id: '4', program_id: '4', school_id: '3', program_name: 'Diploma in Primary Education', program_code: 'DPE', qualification_type: 'Diploma', duration_years: 3, total_semesters: 6, entry_requirements: 'Senior secondary certificate and teaching aptitude.', description: 'Teacher preparation program for foundational and primary education.', status: 'draft', isActive: true, firestoreSync: { syncStatus: 'pending' }, createdAt: '2023-02-01T00:00:00Z', updatedAt: '2024-03-08T12:00:00Z', createdBy: 'admin2' },
];

const mockApplications: Application[] = [
  { id: '1', studentId: '1', studentName: 'Alice Johnson', studentEmail: 'alice@example.com', studentPhone: '+1 234-567-8901', schoolId: '1', schoolName: 'Harvard University', programId: '1', programName: 'Computer Science', status: 'approved', paymentStatus: 'completed', paymentAmount: 75, documents: [{ id: '1', name: 'Transcript.pdf', type: 'application/pdf', url: '#', uploadedAt: '2024-01-15T10:00:00Z' }], submittedAt: '2024-01-15T10:00:00Z', reviewedAt: '2024-01-20T14:00:00Z', reviewedBy: 'admin1', notes: [], source: 'mobile_app' },
  { id: '2', studentId: '1', studentName: 'Alice Johnson', studentEmail: 'alice@example.com', studentPhone: '+1 234-567-8901', schoolId: '2', schoolName: 'Stanford University', programId: '4', programName: 'Computer Science', status: 'under_review', paymentStatus: 'completed', paymentAmount: 90, documents: [], submittedAt: '2024-02-01T09:00:00Z', notes: [{ id: '1', content: 'Strong academic record, waiting for recommendation letter', authorId: 'admin1', authorName: 'Admin User', createdAt: '2024-02-05T10:00:00Z' }], source: 'web' },
  { id: '3', studentId: '2', studentName: 'Bob Smith', studentEmail: 'bob@example.com', studentPhone: '+1 234-567-8903', schoolId: '1', schoolName: 'Harvard University', programId: '2', programName: 'MBA', status: 'pending', paymentStatus: 'pending', paymentAmount: 250, documents: [], submittedAt: '2024-03-01T13:00:00Z', notes: [], source: 'mobile_app' },
  { id: '4', studentId: '3', studentName: 'Carol Williams', studentEmail: 'carol@example.com', studentPhone: '+1 234-567-8904', schoolId: '2', schoolName: 'Stanford University', programId: '5', programName: 'Electrical Engineering', status: 'rejected', paymentStatus: 'refunded', paymentAmount: 125, documents: [], submittedAt: '2024-02-20T11:00:00Z', reviewedAt: '2024-03-05T09:00:00Z', reviewedBy: 'admin2', notes: [{ id: '2', content: 'GPA requirement not met', authorId: 'admin2', authorName: 'Jane Smith', createdAt: '2024-03-05T09:00:00Z' }], source: 'web' },
  { id: '5', studentId: '3', studentName: 'Carol Williams', studentEmail: 'carol@example.com', studentPhone: '+1 234-567-8904', schoolId: '4', schoolName: 'Yale University', programId: '8', programName: 'Economics', status: 'waitlisted', paymentStatus: 'completed', paymentAmount: 80, documents: [], submittedAt: '2024-03-05T08:00:00Z', notes: [{ id: '3', content: 'Waitlisted due to capacity constraints', authorId: 'admin1', authorName: 'Admin User', createdAt: '2024-03-10T10:00:00Z' }], source: 'mobile_app' },
  { id: '6', studentId: '4', studentName: 'David Brown', studentEmail: 'david@example.com', studentPhone: '+1 234-567-8905', schoolId: '1', schoolName: 'Harvard University', programId: '3', programName: 'Law', status: 'under_review', paymentStatus: 'completed', paymentAmount: 85, documents: [], submittedAt: '2024-03-10T15:00:00Z', notes: [], source: 'manual' },
  { id: '7', studentId: '5', studentName: 'Emma Davis', studentEmail: 'emma@example.com', studentPhone: '+1 234-567-8906', schoolId: '4', schoolName: 'Yale University', programId: '9', programName: 'Medicine', status: 'pending', paymentStatus: 'failed', paymentAmount: 100, documents: [], submittedAt: '2024-03-12T16:00:00Z', notes: [{ id: '4', content: 'Payment failed - retry required', authorId: 'system', authorName: 'System', createdAt: '2024-03-12T16:05:00Z' }], source: 'web' },
];

const mockPayments: Payment[] = [
  { id: '1', applicationId: '1', studentId: '1', studentName: 'Alice Johnson', amount: 75, currency: 'ZMW', method: 'credit_card', status: 'completed', transactionId: 'txn_123456', paidAt: '2024-01-15T10:05:00Z', createdAt: '2024-01-15T10:00:00Z' },
  { id: '2', applicationId: '2', studentId: '1', studentName: 'Alice Johnson', amount: 90, currency: 'ZMW', method: 'mobile_money', status: 'completed', transactionId: 'txn_123457', paidAt: '2024-02-01T09:10:00Z', createdAt: '2024-02-01T09:00:00Z' },
  { id: '3', applicationId: '3', studentId: '2', studentName: 'Bob Smith', amount: 250, currency: 'ZMW', method: 'credit_card', status: 'pending', createdAt: '2024-03-01T13:00:00Z' },
  { id: '4', applicationId: '4', studentId: '3', studentName: 'Carol Williams', amount: 125, currency: 'ZMW', method: 'bank_transfer', status: 'refunded', transactionId: 'txn_123458', paidAt: '2024-02-20T11:05:00Z', refundedAt: '2024-03-06T10:00:00Z', refundReason: 'Application rejected', createdAt: '2024-02-20T11:00:00Z' },
  { id: '5', applicationId: '5', studentId: '3', studentName: 'Carol Williams', amount: 80, currency: 'ZMW', method: 'mobile_money', status: 'completed', transactionId: 'txn_123459', paidAt: '2024-03-05T08:05:00Z', createdAt: '2024-03-05T08:00:00Z' },
  { id: '6', applicationId: '6', studentId: '4', studentName: 'David Brown', amount: 85, currency: 'ZMW', method: 'credit_card', status: 'completed', transactionId: 'txn_123460', paidAt: '2024-03-10T15:05:00Z', createdAt: '2024-03-10T15:00:00Z' },
  { id: '7', applicationId: '7', studentId: '5', studentName: 'Emma Davis', amount: 100, currency: 'ZMW', method: 'credit_card', status: 'failed', createdAt: '2024-03-12T16:00:00Z' },
];

const mockUsers: AdminUser[] = [
  { id: '1', name: 'John Admin', email: 'admin@example.com', role: 'super_admin', permissions: [], isActive: true, lastLoginAt: '2024-03-12T10:00:00Z', createdAt: '2023-01-01T00:00:00Z' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'admin', permissions: [], isActive: true, lastLoginAt: '2024-03-11T15:00:00Z', createdAt: '2023-02-01T00:00:00Z' },
  { id: '3', name: 'Bob Staff', email: 'bob.staff@example.com', role: 'staff', permissions: [], isActive: true, lastLoginAt: '2024-03-10T09:00:00Z', createdAt: '2023-03-01T00:00:00Z' },
  { id: '4', name: 'Alice Staff', email: 'alice.staff@example.com', role: 'staff', permissions: [], isActive: false, createdAt: '2023-04-01T00:00:00Z' },
];

const mockActivities: Activity[] = [
  { id: '1', type: 'application_submitted', description: 'New application submitted by Alice Johnson', actor: 'Alice Johnson', targetId: '1', targetType: 'application', createdAt: '2024-01-15T10:00:00Z' },
  { id: '2', type: 'application_approved', description: 'Application approved for Harvard University - Computer Science', actor: 'John Admin', targetId: '1', targetType: 'application', createdAt: '2024-01-20T14:00:00Z' },
  { id: '3', type: 'payment_received', description: 'Payment received: K90 from Alice Johnson', actor: 'System', targetId: '2', targetType: 'payment', createdAt: '2024-02-01T09:10:00Z' },
  { id: '4', type: 'application_rejected', description: 'Application rejected for Stanford University - GPA requirement not met', actor: 'Jane Smith', targetId: '4', targetType: 'application', createdAt: '2024-03-05T09:00:00Z' },
  { id: '5', type: 'student_registered', description: 'New student registered: Emma Davis', actor: 'Emma Davis', targetId: '5', targetType: 'student', createdAt: '2024-03-05T08:00:00Z' },
  { id: '6', type: 'note_added', description: 'Note added to application #4', actor: 'Jane Smith', targetId: '4', targetType: 'note', createdAt: '2024-03-05T09:00:00Z' },
];

const mockNotifications: Notification[] = [
  { id: '1', title: 'Welcome', message: 'Welcome to the admin dashboard', type: 'email', recipients: ['admin@example.com'], status: 'sent', sentAt: '2024-01-01T00:00:00Z', createdAt: '2024-01-01T00:00:00Z', createdBy: 'system' },
];

const mockTemplates: NotificationTemplate[] = [
  { id: '1', name: 'Application Approved', subject: 'Your Application Has Been Approved', body: 'Dear {{studentName}},\n\nWe are pleased to inform you that your application to {{programName}} at {{schoolName}} has been approved.\n\nBest regards,\nAdmissions Team', type: 'email', variables: ['studentName', 'programName', 'schoolName'], createdAt: '2024-01-01T00:00:00Z' },
  { id: '2', name: 'Application Rejected', subject: 'Application Status Update', body: 'Dear {{studentName}},\n\nWe regret to inform you that your application to {{programName}} at {{schoolName}} was not successful.\n\nBest regards,\nAdmissions Team', type: 'email', variables: ['studentName', 'programName', 'schoolName'], createdAt: '2024-01-01T00:00:00Z' },
  { id: '3', name: 'Payment Received', subject: 'Payment Confirmation', body: 'Dear {{studentName}},\n\nWe have received your payment of {{amount}} for {{programName}}.\n\nThank you,\nFinance Team', type: 'email', variables: ['studentName', 'amount', 'programName'], createdAt: '2024-01-01T00:00:00Z' },
  { id: '4', name: 'Document Request', subject: 'Additional Documents Required', body: 'Dear {{studentName}},\n\nPlease submit the following documents: {{documents}}\n\nBest regards,\nAdmissions Team', type: 'email', variables: ['studentName', 'documents'], createdAt: '2024-01-01T00:00:00Z' },
];

// Mock API functions
export const mockApi = {
  // Auth
  login: async (email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const user = mockUsers.find((u) => u.email === email);
    if (!user || password !== 'password') {
      throw new Error('Invalid credentials');
    }
    return { user, token: 'mock-token-' + Date.now() };
  },

  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      totalApplications: mockApplications.length,
      pendingReviews: mockApplications.filter((a) => a.status === 'pending').length,
      approved: mockApplications.filter((a) => a.status === 'approved').length,
      rejected: mockApplications.filter((a) => a.status === 'rejected').length,
      revenue: mockPayments.filter((p) => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
      pendingPayments: mockPayments.filter((p) => p.status === 'pending').length,
      applicationsTrend: [
        { date: '2024-01', count: 2 },
        { date: '2024-02', count: 3 },
        { date: '2024-03', count: 2 },
      ],
      statusDistribution: [
        { status: 'pending', count: mockApplications.filter((a) => a.status === 'pending').length },
        { status: 'under_review', count: mockApplications.filter((a) => a.status === 'under_review').length },
        { status: 'approved', count: mockApplications.filter((a) => a.status === 'approved').length },
        { status: 'rejected', count: mockApplications.filter((a) => a.status === 'rejected').length },
        { status: 'waitlisted', count: mockApplications.filter((a) => a.status === 'waitlisted').length },
      ],
      revenueTrend: [
        { period: 'Jan 2024', amount: 165 },
        { period: 'Feb 2024', amount: 215 },
        { period: 'Mar 2024', amount: 265 },
      ],
      applicationsBySchool: [
        { school: 'Harvard', count: 3 },
        { school: 'Stanford', count: 2 },
        { school: 'Yale', count: 2 },
      ],
    };
  },

  getActivities: async (limit = 10): Promise<Activity[]> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockActivities.slice(0, limit);
  },

  // Applications
  getApplications: async (filters?: {
    status?: string;
    schoolId?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<Application[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let filtered = [...mockApplications];
    if (filters?.status) {
      filtered = filtered.filter((a) => a.status === filters.status);
    }
    if (filters?.schoolId) {
      filtered = filtered.filter((a) => a.schoolId === filters.schoolId);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.studentName.toLowerCase().includes(search) ||
          a.studentEmail.toLowerCase().includes(search) ||
          a.schoolName.toLowerCase().includes(search)
      );
    }
    return filtered;
  },

  getApplication: async (id: string): Promise<Application | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockApplications.find((a) => a.id === id);
  },

  updateApplicationStatus: async (id: string, status: Application['status'], note?: string): Promise<Application> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const app = mockApplications.find((a) => a.id === id);
    if (!app) throw new Error('Application not found');
    app.status = status;
    app.reviewedAt = new Date().toISOString();
    app.reviewedBy = 'admin1';
    if (note) {
      app.notes.push({
        id: String(Date.now()),
        content: note,
        authorId: 'admin1',
        authorName: 'Admin User',
        createdAt: new Date().toISOString(),
      });
    }
    return app;
  },

  addApplicationNote: async (id: string, content: string): Promise<Application> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const app = mockApplications.find((a) => a.id === id);
    if (!app) throw new Error('Application not found');
    app.notes.push({
      id: String(Date.now()),
      content,
      authorId: 'admin1',
      authorName: 'Admin User',
      createdAt: new Date().toISOString(),
    });
    return app;
  },

  // Students
  getStudents: async (search?: string): Promise<Student[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    if (!search) return mockStudents;
    const query = search.toLowerCase();
    return mockStudents.filter(
      (s) =>
        s.firstName.toLowerCase().includes(query) ||
        s.lastName.toLowerCase().includes(query) ||
        s.email.toLowerCase().includes(query)
    );
  },

  getStudent: async (id: string): Promise<Student | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockStudents.find((s) => s.id === id);
  },

  createStudent: async (data: Omit<Student, 'id' | 'createdAt'>): Promise<Student> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const newStudent: Student = {
      ...data,
      id: String(mockStudents.length + 1),
      createdAt: new Date().toISOString(),
    };
    mockStudents.push(newStudent);
    return newStudent;
  },

  // Payments
  getPayments: async (filters?: { status?: string; method?: string }): Promise<Payment[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let filtered = [...mockPayments];
    if (filters?.status) {
      filtered = filtered.filter((p) => p.status === filters.status);
    }
    if (filters?.method) {
      filtered = filtered.filter((p) => p.method === filters.method);
    }
    return filtered;
  },

  getPayment: async (id: string): Promise<Payment | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockPayments.find((p) => p.id === id);
  },

  processRefund: async (id: string, reason: string): Promise<Payment> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const payment = mockPayments.find((p) => p.id === id);
    if (!payment) throw new Error('Payment not found');
    payment.status = 'refunded';
    payment.refundReason = reason;
    payment.refundedAt = new Date().toISOString();
    return payment;
  },

  // Schools
  getSchools: async (status?: string): Promise<School[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    if (status) {
      return mockSchools.filter((s) => s.status === status);
    }
    return mockSchools;
  },

  getSchool: async (id: string): Promise<School | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockSchools.find((s) => s.id === id);
  },

  createSchool: async (data: Omit<School, 'id' | 'createdAt' | 'updatedAt'>): Promise<School> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const newSchool: School = {
      ...data,
      id: String(mockSchools.length + 1),
      school_id: data.school_id || String(mockSchools.length + 1),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockSchools.push(newSchool);
    return newSchool;
  },

  updateSchool: async (id: string, data: Partial<School>): Promise<School> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const school = mockSchools.find((s) => s.id === id);
    if (!school) throw new Error('School not found');
    Object.assign(school, data, { updatedAt: new Date().toISOString() });
    return school;
  },

  deleteSchool: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = mockSchools.findIndex((s) => s.id === id);
    if (index === -1) throw new Error('School not found');
    mockSchools.splice(index, 1);
  },

  // Programs
  getPrograms: async (schoolId?: string): Promise<Program[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    if (schoolId) {
      return mockPrograms.filter((p) => p.school_id === schoolId);
    }
    return mockPrograms;
  },

  getProgram: async (id: string): Promise<Program | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockPrograms.find((p) => p.id === id);
  },

  createProgram: async (data: Omit<Program, 'id' | 'createdAt' | 'updatedAt'>): Promise<Program> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const newProgram: Program = {
      ...data,
      id: String(mockPrograms.length + 1),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockPrograms.push(newProgram);
    return newProgram;
  },

  updateProgram: async (id: string, data: Partial<Program>): Promise<Program> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const program = mockPrograms.find((p) => p.id === id);
    if (!program) throw new Error('Program not found');
    Object.assign(program, data, { updatedAt: new Date().toISOString() });
    return program;
  },

  deleteProgram: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = mockPrograms.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Program not found');
    mockPrograms.splice(index, 1);
  },

  // Users
  getUsers: async (): Promise<AdminUser[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockUsers;
  },

  getUser: async (id: string): Promise<AdminUser | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockUsers.find((u) => u.id === id);
  },

  createUser: async (data: Omit<AdminUser, 'id' | 'createdAt'>): Promise<AdminUser> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const newUser: AdminUser = {
      ...data,
      id: String(mockUsers.length + 1),
      createdAt: new Date().toISOString(),
    };
    mockUsers.push(newUser);
    return newUser;
  },

  updateUser: async (id: string, data: Partial<AdminUser>): Promise<AdminUser> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const user = mockUsers.find((u) => u.id === id);
    if (!user) throw new Error('User not found');
    Object.assign(user, data);
    return user;
  },

  deleteUser: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = mockUsers.findIndex((u) => u.id === id);
    if (index === -1) throw new Error('User not found');
    mockUsers.splice(index, 1);
  },

  // Templates
  getTemplates: async (): Promise<NotificationTemplate[]> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockTemplates;
  },

  // Notifications
  getNotifications: async (): Promise<Notification[]> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockNotifications;
  },

  sendNotification: async (notification: Omit<Notification, 'id' | 'createdAt' | 'sentAt'>): Promise<Notification> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newNotification: Notification = {
      ...notification,
      id: String(mockNotifications.length + 1),
      sentAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    mockNotifications.push(newNotification);
    return newNotification;
  },

  // Bulk Import
  startImportJob: async (type: 'schools' | 'programs' | 'students', file: File): Promise<BulkImportJob> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const job: BulkImportJob = {
      id: String(Date.now()),
      type,
      status: 'processing',
      fileName: file.name,
      totalRows: 0,
      processedRows: 0,
      successfulRows: 0,
      failedRows: 0,
      errors: [],
      startedAt: new Date().toISOString(),
      createdBy: 'admin1',
    };
    return job;
  },

  getImportJob: async (jobId: string): Promise<BulkImportJob | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return {
      id: jobId,
      type: 'schools',
      status: 'completed',
      fileName: 'schools.csv',
      totalRows: 10,
      processedRows: 10,
      successfulRows: 8,
      failedRows: 2,
      errors: [
        { row: 3, message: 'Invalid email format', data: {} },
        { row: 7, message: 'Missing required field: name', data: {} },
      ],
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      createdBy: 'admin1',
    };
  },
};
