// Admin Parent & Visitor Enquiries Mock Data
// Isolated for enquiry triage, email correspondence & status tracking

export const initialEnquiries = [
  {
    id: 1,
    parentName: 'Deepak Mehrotra',
    email: 'deepak.m@example.com',
    phone: '+91 98450 11223',
    grade: 'Grade 9',
    category: 'Admissions 2026-27',
    message: 'Interested to know about the Robotics lab hardware curriculum and Olympiad coaching schedules for Grade 9 intake.',
    date: '2026-03-11',
    status: 'pending',
  },
  {
    id: 2,
    parentName: 'Ananya Roy',
    email: 'ananya.roy@example.com',
    phone: '+91 99012 34567',
    grade: 'Grade 1',
    category: 'School Transport & Bus Routes',
    message: 'Do you offer door-to-door GPS bus transport with female attendants for the Indiranagar 100ft road sector?',
    date: '2026-03-10',
    status: 'approved',
  },
  {
    id: 3,
    parentName: 'Col. Vikram Rathore',
    email: 'vikram.rathore@example.com',
    phone: '+91 98110 56789',
    grade: 'Grade 11 - Science',
    category: 'Fee Structure & Scholarships',
    message: 'Inquiring regarding merit scholarship quotas for defense personnel wards scoring above 95% in Grade 10 Board exams.',
    date: '2026-03-12',
    status: 'pending',
  },
  {
    id: 4,
    parentName: 'Shalini Kulkarni',
    email: 'shalini.k@example.com',
    phone: '+91 98452 77889',
    grade: 'Grade 6',
    category: 'Campus Walking Tour',
    message: 'Would like to book a Saturday morning walking tour of the science labs and swimming complex for two parents and candidate.',
    date: '2026-03-12',
    status: 'pending',
  },
];

export const enquiryCategories = [
  'General Information',
  'Admissions 2026-27',
  'Fee Structure & Scholarships',
  'Curriculum & Academics',
  'School Transport & Bus Routes',
  'Campus Walking Tour',
  'Other Inquiries',
];

