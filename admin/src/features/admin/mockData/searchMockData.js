// Admin Global Command Palette (Ctrl+K) Search Index Mock Data
// Isolated for instant keyboard navigation across candidates, pages & quick administrative actions

export const adminSearchableItems = [
  // Page Direct Jumps
  { type: 'Page', title: 'Admissions Operations Dashboard', path: '/admin/dashboard', iconName: 'LayoutDashboard' },
  { type: 'Page', title: 'Applications & Verification Queue', path: '/admin/admissions', iconName: 'GraduationCap' },
  { type: 'Page', title: 'Parent & Public Enquiries', path: '/admin/enquiries', iconName: 'MessageSquare' },
  { type: 'Page', title: 'Website Content & News CMS', path: '/admin/content', iconName: 'FileText' },
  { type: 'Page', title: 'Institutional Settings & Security', path: '/admin/settings', iconName: 'Settings' },

  // Candidate Quick Searches
  { type: 'Candidate', title: 'Aarav Sharma — #SHS-2026-8492 (Grade 6)', path: '/admin/admissions', iconName: 'GraduationCap' },
  { type: 'Candidate', title: 'Meera Iyer — #SHS-2026-3104 (Grade 11 PCM)', path: '/admin/admissions', iconName: 'GraduationCap' },
  { type: 'Candidate', title: 'Kabir Sengupta — #SHS-2026-7241 (Grade 1)', path: '/admin/admissions', iconName: 'GraduationCap' },
  { type: 'Candidate', title: 'Ananya Deshmukh — #SHS-2026-5520 (Grade 9)', path: '/admin/admissions', iconName: 'GraduationCap' },
  { type: 'Candidate', title: 'Rohan Varma — #SHS-2026-9014 (Grade 11 Commerce)', path: '/admin/admissions', iconName: 'GraduationCap' },
  { type: 'Candidate', title: 'Zoya Fatima — #SHS-2026-4418 (Grade 11 Humanities)', path: '/admin/admissions', iconName: 'GraduationCap' },

  // Quick Action Triggers
  { type: 'Action', title: 'Publish Urgent Notification Circular', path: '/admin/content', iconName: 'PlusCircle' },
  { type: 'Action', title: 'Launch Live Public School Website', path: '/', external: true, iconName: 'ExternalLink' },
];

