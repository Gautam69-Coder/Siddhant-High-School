// Admin Overview & Dashboard Analytics Mock Data
// Isolated for Siddhant High School Admin OS

export const adminKpis = [
  {
    id: 'kpi-applications',
    label: 'Total Applications 2026',
    value: '428',
    change: '+14.2% YoY',
    trend: 'positive',
    iconName: 'GraduationCap',
    color: 'text-brand-primary',
    bg: 'bg-blue-50',
  },
  {
    id: 'kpi-pending',
    label: 'Pending Scrutiny',
    value: '38',
    change: '8 Urgent Today',
    trend: 'attention',
    iconName: 'Clock',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    id: 'kpi-accepted',
    label: 'Offers Accepted',
    value: '184',
    change: '43% Yield Rate',
    trend: 'positive',
    iconName: 'CheckCircle',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    id: 'kpi-enquiries',
    label: 'Open Parent Enquiries',
    value: '19',
    change: '5 Unread',
    trend: 'neutral',
    iconName: 'MessageSquare',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
];

export const funnelStages = [
  { stage: 'Applications Submitted', count: 428, pct: 100, color: 'bg-blue-600' },
  { stage: 'Documents Verified', count: 390, pct: 91, color: 'bg-indigo-600' },
  { stage: 'Aptitude Assessment Scheduled', count: 280, pct: 65, color: 'bg-purple-600' },
  { stage: 'Provisional Offer Granted', count: 184, pct: 43, color: 'bg-emerald-600' },
  { stage: 'Enrolled & Fee Cleared', count: 142, pct: 33, color: 'bg-emerald-700' },
];

export const gradeDistribution = [
  { grade: 'Grade 1 (Foundational)', count: 68, max: 80, pct: 85 },
  { grade: 'Grade 6 (Middle Intake)', count: 94, max: 100, pct: 94 },
  { grade: 'Grade 8 (Middle Final)', count: 42, max: 60, pct: 70 },
  { grade: 'Grade 9 (Secondary High)', count: 76, max: 90, pct: 84 },
  { grade: 'Grade 11 - Science (PCM/B)', count: 98, max: 100, pct: 98 },
  { grade: 'Grade 11 - Commerce', count: 50, max: 60, pct: 83 },
];

export const weeklyTrends = [
  { day: 'Mon', count: 14, height: '45%' },
  { day: 'Tue', count: 22, height: '70%' },
  { day: 'Wed', count: 18, height: '58%' },
  { day: 'Thu', count: 27, height: '88%' },
  { day: 'Fri', count: 24, height: '78%' },
  { day: 'Sat', count: 31, height: '100%' },
  { day: 'Sun', count: 10, height: '32%' },
];

export const urgentTasks = [
  {
    id: 1,
    title: 'Document verification pending for 12 Grade-11 Science applicants',
    deadline: 'Today by 05:00 PM',
    priority: 'high',
    link: '/admin/admissions',
  },
  {
    id: 2,
    title: '5 Parent enquiries awaiting transport corridor clarification',
    deadline: 'Within 2 hours',
    priority: 'medium',
    link: '/admin/enquiries',
  },
  {
    id: 3,
    title: 'Publish Hall Ticket circular for Round-1 Entrance Assessment',
    deadline: 'By April 18',
    priority: 'scheduled',
    link: '/admin/content',
  },
];

