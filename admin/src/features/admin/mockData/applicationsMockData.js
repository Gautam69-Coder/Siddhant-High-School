// Admin Applications & Admissions Directorate Mock Data
// Isolated for candidate triage, document scrutiny & verification

export const initialApplications = [
  {
    id: 1,
    appId: '#SHS-2026-8492',
    studentName: 'Aarav Sharma',
    grade: 'Grade 6',
    parentName: 'Sunita Sharma',
    parentEmail: 'sunita.sharma@example.com',
    parentPhone: '+91 98450 78219',
    date: '2026-03-10',
    status: 'pending',
    dob: '2014-08-15',
    address: '#42, Palm Meadows, Whitefield, Bangalore',
    documents: [
      { name: 'Birth_Certificate_Municipal.pdf', size: '1.4 MB', type: 'Birth Record', verified: true },
      { name: 'Marksheet_Grade5_StJude.pdf', size: '2.1 MB', type: 'Academic Record', verified: true },
      { name: 'Student_Passport_Photo.png', size: '850 KB', type: 'Identity Photo', verified: false },
    ],
  },
  {
    id: 2,
    appId: '#SHS-2026-3104',
    studentName: 'Meera Iyer',
    grade: 'Grade 11 - Science (PCM)',
    parentName: 'Raghavan Iyer',
    parentEmail: 'raghavan.iyer@example.com',
    parentPhone: '+91 98200 45112',
    date: '2026-03-09',
    status: 'approved',
    dob: '2010-04-12',
    address: '100ft Road, Indiranagar, Bangalore',
    documents: [
      { name: 'CBSE_Grade10_BoardMarks.pdf', size: '3.2 MB', type: 'Board Result', verified: true },
      { name: 'NationalOlympiad_Certificate.pdf', size: '1.8 MB', type: 'Achievement', verified: true },
    ],
  },
  {
    id: 3,
    appId: '#SHS-2026-7241',
    studentName: 'Kabir Sengupta',
    grade: 'Grade 1',
    parentName: 'Rohan Sengupta',
    parentEmail: 'rohan.sengupta@example.com',
    parentPhone: '+91 97110 33490',
    date: '2026-03-08',
    status: 'rejected',
    dob: '2020-02-18',
    address: 'HSR Layout Sector 2, Bangalore',
    documents: [
      { name: 'Birth_Certificate_Bengaluru.pdf', size: '920 KB', type: 'Birth Record', verified: false },
    ],
  },
  {
    id: 4,
    appId: '#SHS-2026-5520',
    studentName: 'Ananya Deshmukh',
    grade: 'Grade 9',
    parentName: 'Pooja Deshmukh',
    parentEmail: 'pooja.deshmukh@example.com',
    parentPhone: '+91 98451 90812',
    date: '2026-03-11',
    status: 'pending',
    dob: '2011-11-22',
    address: 'Koramangala 4th Block, Bangalore',
    documents: [
      { name: 'Grade8_Final_Transcript.pdf', size: '1.6 MB', type: 'Academic Record', verified: true },
      { name: 'Karnataka_State_Chess_Cert.pdf', size: '1.1 MB', type: 'Sports Certificate', verified: true },
    ],
  },
  {
    id: 5,
    appId: '#SHS-2026-9014',
    studentName: 'Rohan Varma',
    grade: 'Grade 11 - Commerce',
    parentName: 'Sanjay Varma',
    parentEmail: 'sanjay.varma@example.com',
    parentPhone: '+91 98112 34567',
    date: '2026-03-11',
    status: 'pending',
    dob: '2010-09-05',
    address: 'Bellandur EcoSpace Corridor, Bangalore',
    documents: [
      { name: 'ICSE_Grade10_Provisional.pdf', size: '2.4 MB', type: 'Board Result', verified: true },
    ],
  },
  {
    id: 6,
    appId: '#SHS-2026-4418',
    studentName: 'Zoya Fatima',
    grade: 'Grade 11 - Humanities & Public Policy',
    parentName: 'Tariq Fatima',
    parentEmail: 'tariq.fatima@example.com',
    parentPhone: '+91 98440 22119',
    date: '2026-03-12',
    status: 'approved',
    dob: '2010-01-30',
    address: 'Frazer Town, Bangalore',
    documents: [
      { name: 'ModelUN_OutstandingDelegate.pdf', size: '1.5 MB', type: 'Leadership Record', verified: true },
      { name: 'Grade10_PreBoard_Scores.pdf', size: '2.0 MB', type: 'Academic Record', verified: true },
    ],
  },
];

export const gradeFilterOptions = [
  { label: 'All Grades', value: 'All' },
  { label: 'Grade 1', value: 'Grade 1' },
  { label: 'Grade 6', value: 'Grade 6' },
  { label: 'Grade 9', value: 'Grade 9' },
  { label: 'Grade 11', value: 'Grade 11' },
];

export const applicationStatusTabs = [
  'All',
  'Pending',
  'Approved',
  'Rejected',
];

