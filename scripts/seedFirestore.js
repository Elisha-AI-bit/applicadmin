// Firestore seeding script for demo data
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, serverTimestamp, getDocs, writeBatch } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBr1ac-YprCM5ci4dKKDuXNRYnmWWg21Ec",
  authDomain: "school-app-faaa3.firebaseapp.com",
  projectId: "school-app-faaa3",
  storageBucket: "school-app-faaa3.firebasestorage.app",
  messagingSenderId: "587478154868",
  appId: "1:587478154868:web:87896bf22ed5cf13969b21",
  measurementId: "G-3J3MJVL8MK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Demo data
const demoSchools = [
  {
    name: "Tech University",
    description: "Leading institution in technology and innovation",
    location: {
      street: "123 Innovation Drive",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      country: "USA"
    },
    contact: {
      email: "admissions@techuniversity.edu",
      phone: "+1-555-0123",
      website: "https://techuniversity.edu"
    },
    status: "published",
    isActive: true,
    programs: [],
    settings: {
      allowMultipleApplications: true,
      requirePayment: true,
      applicationFee: 50
    },
    firestoreSync: {
      syncStatus: "synced",
      lastSyncedAt: new Date().toISOString()
    },
    createdBy: "admin"
  },
  {
    name: "State College",
    description: "Comprehensive public institution with diverse programs",
    location: {
      street: "456 College Avenue",
      city: "Boston",
      state: "MA",
      zipCode: "02115",
      country: "USA"
    },
    contact: {
      email: "info@statecollege.edu",
      phone: "+1-555-0456",
      website: "https://statecollege.edu"
    },
    status: "published",
    isActive: true,
    programs: [],
    settings: {
      allowMultipleApplications: true,
      requirePayment: true,
      applicationFee: 75
    },
    firestoreSync: {
      syncStatus: "synced",
      lastSyncedAt: new Date().toISOString()
    },
    createdBy: "admin"
  }
];

const demoPrograms = [
  {
    schoolId: "",
    schoolName: "Tech University",
    name: "Computer Science",
    description: "Comprehensive program in software development and AI",
    level: "undergraduate",
    duration: "4 years",
    requirements: {
      minimumGpa: 3.0,
      requiredDocuments: ["transcript", "recommendation_letters", "personal_statement"],
      prerequisites: ["math_calculus", "programming_basics"]
    },
    capacity: {
      total: 200,
      filled: 145,
      waitlist: 25
    },
    deadlines: {
      applicationOpen: "2024-01-15",
      applicationClose: "2024-03-15",
      decisionDate: "2024-04-01"
    },
    fees: {
      applicationFee: 50,
      tuitionFee: 15000,
      currency: "USD"
    },
    status: "published",
    isActive: true,
    firestoreSync: {
      syncStatus: "synced",
      lastSyncedAt: new Date().toISOString()
    },
    createdBy: "admin"
  },
  {
    schoolId: "",
    schoolName: "Tech University",
    name: "Data Science",
    description: "Advanced program in data analytics and machine learning",
    level: "graduate",
    duration: "2 years",
    requirements: {
      minimumGpa: 3.5,
      requiredDocuments: ["transcript", "gre_scores", "research_proposal"],
      prerequisites: ["statistics", "programming", "linear_algebra"]
    },
    capacity: {
      total: 50,
      filled: 38,
      waitlist: 12
    },
    deadlines: {
      applicationOpen: "2024-01-01",
      applicationClose: "2024-02-28",
      decisionDate: "2024-03-15"
    },
    fees: {
      applicationFee: 75,
      tuitionFee: 25000,
      currency: "USD"
    },
    status: "published",
    isActive: true,
    firestoreSync: {
      syncStatus: "synced",
      lastSyncedAt: new Date().toISOString()
    },
    createdBy: "admin"
  },
  {
    schoolId: "",
    schoolName: "State College",
    name: "Business Administration",
    description: "Comprehensive business management program",
    level: "undergraduate",
    duration: "4 years",
    requirements: {
      minimumGpa: 2.8,
      requiredDocuments: ["transcript", "essay", "recommendation_letters"],
      prerequisites: []
    },
    capacity: {
      total: 300,
      filled: 267,
      waitlist: 18
    },
    deadlines: {
      applicationOpen: "2024-02-01",
      applicationClose: "2024-04-01",
      decisionDate: "2024-05-01"
    },
    fees: {
      applicationFee: 75,
      tuitionFee: 12000,
      currency: "USD"
    },
    status: "published",
    isActive: true,
    firestoreSync: {
      syncStatus: "synced",
      lastSyncedAt: new Date().toISOString()
    },
    createdBy: "admin"
  }
];

const demoStudents = [
  {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@email.com",
    phone: "+1-555-0101",
    dateOfBirth: "1998-05-15",
    gender: "male",
    address: {
      street: "123 Main Street",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      country: "USA"
    },
    guardianInfo: {
      name: "Robert Doe",
      relationship: "Father",
      phone: "+1-555-0102",
      email: "robert.doe@email.com"
    },
    academicHistory: [
      {
        institution: "Lincoln High School",
        degree: "High School Diploma",
        fieldOfStudy: "General Studies",
        graduationYear: 2016,
        gpa: 3.8
      }
    ],
    applications: [],
    createdAt: new Date().toISOString()
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@email.com",
    phone: "+1-555-0202",
    dateOfBirth: "1999-08-22",
    gender: "female",
    address: {
      street: "456 Oak Avenue",
      city: "Boston",
      state: "MA",
      zipCode: "02115",
      country: "USA"
    },
    guardianInfo: {
      name: "Mary Smith",
      relationship: "Mother",
      phone: "+1-555-0203",
      email: "mary.smith@email.com"
    },
    academicHistory: [
      {
        institution: "Boston Latin School",
        degree: "High School Diploma",
        fieldOfStudy: "STEM Focus",
        graduationYear: 2017,
        gpa: 4.0
      }
    ],
    applications: [],
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    firstName: "Michael",
    lastName: "Johnson",
    email: "michael.johnson@email.com",
    phone: "+1-555-0303",
    dateOfBirth: "1997-12-10",
    gender: "male",
    address: {
      street: "789 Pine Road",
      city: "Seattle",
      state: "WA",
      zipCode: "98101",
      country: "USA"
    },
    guardianInfo: {
      name: "James Johnson",
      relationship: "Father",
      phone: "+1-555-0304",
      email: "james.johnson@email.com"
    },
    academicHistory: [
      {
        institution: "Seattle Academy",
        degree: "High School Diploma",
        fieldOfStudy: "Science",
        graduationYear: 2015,
        gpa: 3.6
      }
    ],
    applications: [],
    createdAt: new Date(Date.now() - 172800000).toISOString()
  }
];

const demoApplications = [
  {
    studentId: "",
    studentName: "John Doe",
    studentEmail: "john.doe@email.com",
    studentPhone: "+1-555-0101",
    schoolId: "",
    schoolName: "Tech University",
    programId: "",
    programName: "Computer Science",
    status: "pending",
    paymentStatus: "pending",
    paymentAmount: 50,
    documents: [
      {
        id: "doc1",
        name: "transcript.pdf",
        type: "transcript",
        url: "https://example.com/transcript.pdf",
        uploadedAt: new Date().toISOString()
      }
    ],
    submittedAt: new Date().toISOString(),
    notes: [],
    source: "web"
  },
  {
    studentId: "",
    studentName: "Jane Smith",
    studentEmail: "jane.smith@email.com",
    studentPhone: "+1-555-0202",
    schoolId: "",
    schoolName: "State College",
    programId: "",
    programName: "Business Administration",
    status: "approved",
    paymentStatus: "completed",
    paymentAmount: 75,
    documents: [
      {
        id: "doc2",
        name: "transcript.pdf",
        type: "transcript",
        url: "https://example.com/transcript2.pdf",
        uploadedAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: "doc3",
        name: "essay.pdf",
        type: "essay",
        url: "https://example.com/essay.pdf",
        uploadedAt: new Date(Date.now() - 86400000).toISOString()
      }
    ],
    submittedAt: new Date(Date.now() - 86400000).toISOString(),
    reviewedAt: new Date(Date.now() - 43200000).toISOString(),
    reviewedBy: "admin",
    notes: [
      {
        id: "note1",
        content: "Excellent academic record. Strong candidate.",
        authorId: "admin",
        authorName: "Administrator",
        createdAt: new Date(Date.now() - 43200000).toISOString()
      }
    ],
    source: "web"
  },
  {
    studentId: "",
    studentName: "Michael Johnson",
    studentEmail: "michael.johnson@email.com",
    studentPhone: "+1-555-0303",
    schoolId: "",
    schoolName: "Tech University",
    programId: "",
    programName: "Data Science",
    status: "under_review",
    paymentStatus: "completed",
    paymentAmount: 75,
    documents: [
      {
        id: "doc4",
        name: "transcript.pdf",
        type: "transcript",
        url: "https://example.com/transcript3.pdf",
        uploadedAt: new Date(Date.now() - 172800000).toISOString()
      },
      {
        id: "doc5",
        name: "gre_scores.pdf",
        type: "gre_scores",
        url: "https://example.com/gre.pdf",
        uploadedAt: new Date(Date.now() - 172800000).toISOString()
      }
    ],
    submittedAt: new Date(Date.now() - 172800000).toISOString(),
    notes: [],
    source: "web"
  }
];

const demoPayments = [
  {
    applicationId: "",
    studentId: "",
    studentName: "John Doe",
    amount: 50,
    currency: "USD",
    method: "credit_card",
    status: "pending",
    createdAt: new Date().toISOString()
  },
  {
    applicationId: "",
    studentId: "",
    studentName: "Jane Smith",
    amount: 75,
    currency: "USD",
    method: "paypal",
    status: "completed",
    transactionId: "txn_1234567890",
    paidAt: new Date(Date.now() - 43200000).toISOString(),
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    applicationId: "",
    studentId: "",
    studentName: "Michael Johnson",
    amount: 75,
    currency: "USD",
    method: "bank_transfer",
    status: "completed",
    transactionId: "txn_0987654321",
    paidAt: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 172800000).toISOString()
  }
];

const demoActivities = [
  {
    type: "application_submitted",
    description: "New application submitted by John Doe for Computer Science",
    actor: "System",
    targetId: "",
    targetType: "application",
    createdAt: new Date().toISOString()
  },
  {
    type: "payment_completed",
    description: "Payment completed for Jane Smith's application",
    actor: "System",
    targetId: "",
    targetType: "payment",
    createdAt: new Date(Date.now() - 43200000).toISOString()
  },
  {
    type: "application_approved",
    description: "Application approved for Jane Smith - Business Administration",
    actor: "admin",
    targetId: "",
    targetType: "application",
    createdAt: new Date(Date.now() - 43200000).toISOString()
  },
  {
    type: "application_submitted",
    description: "New application submitted by Michael Johnson for Data Science",
    actor: "System",
    targetId: "",
    targetType: "application",
    createdAt: new Date(Date.now() - 172800000).toISOString()
  }
];

const demoUsers = [
  {
    name: "Administrator",
    email: "admin@applicadmin.com",
    role: "super_admin",
    permissions: ["read", "write", "delete", "manage_users"],
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    name: "Staff User",
    email: "staff@applicadmin.com",
    role: "staff",
    permissions: ["read", "write"],
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

// Seeding function
async function seedFirestore() {
  try {
    console.log("Starting Firestore seeding...");

    // Clear existing data (optional - uncomment if you want to start fresh)
    // console.log("Clearing existing collections...");
    // await clearCollection('schools');
    // await clearCollection('programs');
    // await clearCollection('students');
    // await clearCollection('applications');
    // await clearCollection('payments');
    // await clearCollection('activities');
    // await clearCollection('users');

    // Seed schools
    console.log("Seeding schools...");
    const schoolIds = [];
    for (const school of demoSchools) {
      const docRef = doc(collection(db, 'schools'));
      await setDoc(docRef, {
        ...school,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      schoolIds.push(docRef.id);
      console.log(`Created school: ${school.name}`);
    }

    // Seed programs
    console.log("Seeding programs...");
    const programIds = [];
    for (let i = 0; i < demoPrograms.length; i++) {
      const program = demoPrograms[i];
      const docRef = doc(collection(db, 'programs'));
      await setDoc(docRef, {
        ...program,
        schoolId: schoolIds[i < 2 ? 0 : 1], // Assign to appropriate school
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      programIds.push(docRef.id);
      console.log(`Created program: ${program.name}`);
    }

    // Update schools with program IDs
    for (let i = 0; i < schoolIds.length; i++) {
      const schoolRef = doc(db, 'schools', schoolIds[i]);
      const programsForSchool = i === 0 ? programIds.slice(0, 2) : [programIds[2]];
      await setDoc(schoolRef, {
        programs: programsForSchool,
        updatedAt: serverTimestamp()
      }, { merge: true });
    }

    // Seed students
    console.log("Seeding students...");
    const studentIds = [];
    for (const student of demoStudents) {
      const docRef = doc(collection(db, 'students'));
      await setDoc(docRef, {
        ...student,
        createdAt: serverTimestamp()
      });
      studentIds.push(docRef.id);
      console.log(`Created student: ${student.firstName} ${student.lastName}`);
    }

    // Seed applications
    console.log("Seeding applications...");
    const applicationIds = [];
    for (let i = 0; i < demoApplications.length; i++) {
      const application = demoApplications[i];
      const docRef = doc(collection(db, 'applications'));
      await setDoc(docRef, {
        ...application,
        studentId: studentIds[i],
        schoolId: i < 2 ? schoolIds[1] : schoolIds[0], // Assign to appropriate school
        programId: programIds[i],
        createdAt: serverTimestamp()
      });
      applicationIds.push(docRef.id);
      console.log(`Created application for: ${application.studentName}`);
    }

    // Update students with application IDs
    for (let i = 0; i < studentIds.length; i++) {
      const studentRef = doc(db, 'students', studentIds[i]);
      await setDoc(studentRef, {
        applications: [applicationIds[i]]
      }, { merge: true });
    }

    // Seed payments
    console.log("Seeding payments...");
    for (let i = 0; i < demoPayments.length; i++) {
      const payment = demoPayments[i];
      const docRef = doc(collection(db, 'payments'));
      await setDoc(docRef, {
        ...payment,
        applicationId: applicationIds[i],
        studentId: studentIds[i],
        createdAt: serverTimestamp()
      });
      console.log(`Created payment for: ${payment.studentName}`);
    }

    // Seed activities
    console.log("Seeding activities...");
    for (let i = 0; i < demoActivities.length; i++) {
      const activity = demoActivities[i];
      const docRef = doc(collection(db, 'activities'));
      await setDoc(docRef, {
        ...activity,
        targetId: applicationIds[i % applicationIds.length],
        createdAt: serverTimestamp()
      });
      console.log(`Created activity: ${activity.type}`);
    }

    // Seed users
    console.log("Seeding users...");
    for (const user of demoUsers) {
      const docRef = doc(collection(db, 'users'));
      await setDoc(docRef, {
        ...user,
        createdAt: serverTimestamp()
      });
      console.log(`Created user: ${user.name}`);
    }

    console.log("Firestore seeding completed successfully!");
    console.log("\nSummary:");
    console.log(`- Schools: ${schoolIds.length}`);
    console.log(`- Programs: ${programIds.length}`);
    console.log(`- Students: ${studentIds.length}`);
    console.log(`- Applications: ${applicationIds.length}`);
    console.log(`- Payments: ${demoPayments.length}`);
    console.log(`- Activities: ${demoActivities.length}`);
    console.log(`- Users: ${demoUsers.length}`);

  } catch (error) {
    console.error("Error seeding Firestore:", error);
  }
}

// Helper function to clear collection (optional)
async function clearCollection(collectionName) {
  const querySnapshot = await getDocs(collection(db, collectionName));
  const batch = writeBatch(db);
  
  querySnapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });
  
  await batch.commit();
  console.log(`Cleared collection: ${collectionName}`);
}

// Run the seeding
seedFirestore().then(() => {
  console.log("Seeding process completed.");
  process.exit(0);
}).catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
