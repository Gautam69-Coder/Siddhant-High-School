// Admin Content Management System (CMS) Mock Data
// Isolated for news tickers, calendar dates, faculty directory & media gallery

export const initialNewsAnnouncements = [
  {
    id: 1,
    title: 'Admissions Open for Academic Session 2026–27 at Siddhant High School: Final registration deadline is April 15, 2026.',
    category: 'Official',
    urgent: true,
    date: '2026-03-01',
  },
  {
    id: 2,
    title: 'Siddhant Robotics Team qualifies for National STEM Olympiad Finals with autonomous rover prototype.',
    category: 'Innovation',
    urgent: true,
    date: '2026-02-28',
  },
  {
    id: 3,
    title: 'CBSE Secondary Board Mock Examinations scheduled across all senior wings from May 18, 2026.',
    category: 'Academic',
    urgent: false,
    date: '2026-02-24',
  },
  {
    id: 4,
    title: 'Annual Founders Day Cultural Gala "Horizon 2026" tickets now available for parents.',
    category: 'Cultural',
    urgent: false,
    date: '2026-02-20',
  },
];

export const initialCalendarEvents = [
  {
    id: 1,
    title: 'Entrance Aptitude Assessments (Round 1)',
    date: '2026-04-22',
    category: 'Academic',
  },
  {
    id: 2,
    title: 'Inter-School Autonomous Rover Challenge',
    date: '2026-04-25',
    category: 'Robotics & STEM',
  },
  {
    id: 3,
    title: 'Annual Founders Day Cultural Gala',
    date: '2026-05-02',
    category: 'Cultural',
  },
  {
    id: 4,
    title: 'State Inter-School Aquatics Meet',
    date: '2026-05-10',
    category: 'Sports',
  },
  {
    id: 5,
    title: 'School Reopens for Session 2026-27',
    date: '2026-06-08',
    category: 'Academic',
  },
];

export const initialFacultyProfiles = [
  {
    id: 1,
    name: 'Dr. Katherine Price',
    role: 'Head of School / Principal',
    dept: 'Leadership',
    qualifications: 'Ph.D. Educational Leadership (Oxon), M.Ed',
  },
  {
    id: 2,
    name: 'Prof. Arvind Nambiar',
    role: 'Dean of STEM & Autonomous Robotics',
    dept: 'Robotics',
    qualifications: 'M.Tech Robotics (IIT Bombay), B.Tech ECE',
  },
  {
    id: 3,
    name: 'Mrs. Malini Sundaram',
    role: 'Head of Senior Secondary Mathematics',
    dept: 'Academics',
    qualifications: 'M.Sc. Pure Mathematics, B.Ed (Gold Medalist)',
  },
  {
    id: 4,
    name: 'Coach Ravinder Singh',
    role: 'Director of Physical Education & Aquatics',
    dept: 'Sports',
    qualifications: 'M.P.Ed, FINA Certified Swimming Coach',
  },
];

export const initialGalleryUploads = [
  {
    id: 1,
    title: 'Olympic Aquatic Complex',
    category: 'Sports',
    url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    title: 'Maker Lab 3D Printing Station',
    category: 'STEM',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    title: 'Horizon Auditorium Symphony Stage',
    category: 'Arts',
    url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 4,
    title: 'Advanced Chemistry Research Laboratory',
    category: 'Academics',
    url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
  },
];

