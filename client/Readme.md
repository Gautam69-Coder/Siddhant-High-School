# 🏫 Siddhant High School — Web Portal & Super Admin OS

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.3-764ABC?style=flat-square&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.11-0055FF?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![License](https://img.shields.io/badge/License-Proprietary-slate.svg?style=flat-square)](#)

> **Official web portal and administrative management system for Siddhant High School**, managed by the **Shubham Education & Welfare Society**. Designed to streamline school operations, candidate admissions, credential verification, communications, and institutional content management.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
  - [Super Admin OS Dashboard](#1-super-admin-os-dashboard)
  - [Admissions & Verification Center](#2-admissions--verification-center)
  - [Parent Enquiries Manager](#3-parent-enquiries-manager)
  - [School Content Management (CMS)](#4-school-content-management-cms)
  - [Command Palette (`Ctrl + K`)](#5-command-palette-ctrl--k)
  - [Offline Reporting & CSV Export](#6-offline-reporting--csv-export)
- [Technology Stack](#-technology-stack)
- [Project Architecture & Structure](#-project-architecture--structure)
- [Quick Start Guide](#-quick-start-guide)
  - [Prerequisites](#prerequisites)
  - [Installation & Local Setup](#installation--local-setup)
  - [Running the Admin Panel](#running-the-admin-panel)
  - [Production Build](#production-build)
- [Demo Admin Credentials](#-demo-admin-credentials)
- [Future Roadmap](#-future-roadmap)
- [Contributing & Code Style](#-contributing--code-style)
- [Institution & Governance](#-institution--governance)

---

## 🌟 Overview

The **Siddhant High School** digital platform modernizes institutional workflows through an intuitive, high-performance web interface. The system provides school administrators, admissions officers, and faculty coordinators with powerful tools to triage incoming student applications, scrutinize academic documents, schedule school-wide events, publish notices, and handle parent inquiries in real time.

---

## 🚀 Key Features

### 1. Super Admin OS Dashboard
- **Executive KPI Cards**: Real-time monitoring of total applications, pending candidate evaluations, confirmed admissions, and new parent inquiries.
- **Conversion Funnel Analytics**: Multi-stage pipeline tracking applicants from initial submission to final enrollment.
- **Inbound Velocity Sparkline**: 7-day intake trend breakdown with peak submission detection.
- **Grade & Stream Capacity Monitor**: Live capacity gauges showing seats filled vs. total available across all grades.
- **Priority Action Desk**: Direct triage for urgent operational tasks and pending reviews.

### 2. Admissions & Verification Center
- **Interactive Candidate Registry**: Searchable and filterable table displaying application numbers (`#SHS-XXXX`), candidate details, guardian contacts, and status badges.
- **Detailed Inspection Drawer**: Slide-over panel displaying candidate bio data, academic history, and contact information.
- **Document Scrutinizer Modal**: Built-in document inspection viewer with tamper-check simulations and one-click cryptographic verification seals.
- **Determination Workflow**: Immediate status transitions (**Pending**, **Approved**, **Rejected**) with instant toast feedback.

### 3. Parent Enquiries Manager
- Real-time logging and triage for prospective student questions and campus tour requests.
- Contact tracking (Phone, Email, In-Person) with resolution status badges.

### 4. School Content Management (CMS)
- **News & Announcements**: Create, edit, pin, and publish institutional notices and circulars.
- **Academic & Events Calendar**: Schedule webinars, exams, athletic meets, and holidays.
- **Faculty & Staff Directory**: Manage educator profiles, qualifications, and department allocations.
- **Media Gallery Manager**: Categorized campus photo albums and event visual highlights.

### 5. Command Palette (`Ctrl + K` / `Cmd + K`)
- Global keyboard-driven launcher for instant candidate search by name or application ID.
- Quick navigation shortcuts across dashboard pages and administrative tools.

### 6. Offline Reporting & CSV Export
- Single-click CSV export utility to download formatted applicant records and enquiry logs for offline audits, compliance, and archiving.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Core** | [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/) |
| **Routing** | [React Router v6](https://reactrouter.com/) (Browser routing, nested layouts, code splitting with `Suspense` and `lazy`) |
| **State Management** | [Redux Toolkit](https://redux-toolkit.js.org/) (Auth, UI drawers, and CMS state) |
| **Styling** | [Tailwind CSS v3](https://tailwindcss.com/), [PostCSS](https://postcss.org/), [Autoprefixer](https://github.com/postcss/autoprefixer) |
| **Animation & Motion** | [Framer Motion](https://www.framer.com/motion/) (Smooth page transitions, layout animations, modals) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Persistence** | Browser `localStorage` abstraction layer with initial mock fallbacks (`adminStorageService`) |
| **Tooling & Linter** | ESLint with React Hooks & React Refresh plugins |

---

## 📂 Project Architecture & Structure

```plaintext
10_Siddhant-High-School/
├── Readme.md                          # Root project documentation
└── admin/                             # Super Admin Web Application
    ├── public/                        # Static assets (logos, crests, prospectus PDF)
    │   ├── assets/
    │   │   ├── crest.svg              # School crest & emblems
    │   │   └── logo.png               # Official institutional logo
    │   └── favicon.svg
    ├── src/
    │   ├── admin/
    │   │   └── mockData/              # Seed data references
    │   ├── components/
    │   │   ├── motion/
    │   │   │   └── PageTransition.jsx # Page fade & slide transition wrapper
    │   │   └── ui/                    # Reusable UI component library
    │   │       ├── Badge.jsx          # Status pill indicators
    │   │       ├── Button.jsx         # Accessible buttons with loading states
    │   │       ├── FileDropzone.jsx   # Drag-and-drop document uploader
    │   │       ├── GlassCard.jsx      # Glassmorphism cards with backdrop blur
    │   │       ├── InputField.jsx     # Form inputs with icon support & error states
    │   │       ├── Modal.jsx          # Accessible dialogs with spring animations
    │   │       └── Skeleton.jsx       # Content loading placeholders
    │   ├── features/
    │   │   └── admin/                 # Domain-specific admin feature modules
    │   │       ├── applications-manager/ # Applications & Enquiries tables
    │   │       ├── auth/              # Admin login card & route guards
    │   │       ├── cms-manager/       # News, Events, Faculty & Gallery editors
    │   │       ├── mockData/          # Structured mock database records
    │   │       ├── reports/           # DataExportBar CSV generator
    │   │       └── services/          # LocalStorage persistence service
    │   ├── layouts/
    │   │   └── AdminLayout.jsx        # Sidebar, topbar, command palette & shell
    │   ├── pages/
    │   │   └── admin/                 # Admin view views (Dashboard, Admissions, CMS, etc.)
    │   ├── store/
    │   │   └── index.js               # Redux store configuration
    │   ├── utils/
    │   │   └── csvExporter.js         # Browser CSV file download helper
    │   ├── App.jsx                    # Root app provider
    │   ├── index.css                  # Global Tailwind utility rules & fonts
    │   ├── main.jsx                   # React DOM entry point
    │   └── routes.jsx                 # Route definitions & lazy-loaded pages
    ├── index.html                     # HTML template
    ├── package.json                   # Dependencies & package scripts
    ├── postcss.config.js              # PostCSS plugin pipeline
    ├── tailwind.config.js             # Theme tokens, font families, and custom palettes
    └── vite.config.js                 # Vite bundler build config
```

---

## ⚡ Quick Start Guide

### Prerequisites
Make sure you have installed on your local machine:
- [Node.js](https://nodejs.org/) (Version **>= 18.0.0**)
- [pnpm](https://pnpm.io/) (Recommended) or [npm](https://www.npmjs.com/)

### Installation & Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Gautam-Doliya/Siddhant-High-School.git
   cd 10_Siddhant-High-School
   ```

2. **Navigate into the Admin workspace**:
   ```bash
   cd admin
   ```

3. **Install dependencies**:
   ```bash
   pnpm install
   # or with npm
   npm install
   ```

### Running the Admin Panel

Start the local development server with Hot Module Replacement (HMR):
```bash
pnpm dev
# or: npm run dev
```

Open your browser and navigate to:
```
http://localhost:5173/admin/login
```

### Production Build

To build the project for production deployment:
```bash
pnpm build
# or: npm run build
```

To preview the generated production build locally:
```bash
pnpm preview
# or: npm run preview
```

To run ESLint code verification:
```bash
pnpm lint
# or: npm run lint
```

---

## 🔑 Demo Admin Credentials

For development and evaluation, access the administrative console using the pre-configured credentials:

| Field | Demo Value |
| :--- | :--- |
| **Login Gateway** | `/admin/login` |
| **Email** | `admin@siddhanthighschool.edu` |
| **Password** | `admin123` |
| **Role** | `SUPER_ADMIN` (Dr. Katherine Price) |

> ℹ️ *Note: Authentication currently runs in simulated JWT mode with local session tokens (`shs_admin_token`) stored securely in your browser's local storage.*

---

## 🗺️ Future Roadmap

- [ ] **Public Portal**: Public-facing school website showcasing campus tour, academic curriculum, fee structures, and an online application form for prospective parents.
- [ ] **Backend Services**: Node.js & Express RESTful API with MongoDB / PostgreSQL database integration.
- [ ] **Email & SMS Notifications**: Automated transactional alerts for application status changes and admissions interview call letters.
- [ ] **Parent & Student Hub**: Dedicated portal for report cards, attendance records, school bus tracking, and tuition fee payments.
- [ ] **Role-Based Access Control (RBAC)**: Fine-grained permissions for Principal, Admissions Officers, Department Heads, and IT Staff.

---

## 🤝 Contributing & Code Style

1. Create a descriptive feature branch:
   ```bash
   git checkout -b feature/admissions-enhancement
   ```
2. Adhere to **WCAG 2.1 AA** accessibility standards and keep interactive focus rings visible.
3. Verify formatting and linting prior to committing:
   ```bash
   pnpm lint
   ```
4. Commit changes with clear conventional commits (e.g., `feat:`, `fix:`, `docs:`).

---

## 🏛️ Institution & Governance

**Siddhant High School**  
Under the auspices of **Shubham Education & Welfare Society**  
*Empowering future generations through academic excellence, character development, and holistic learning.*

© 2026 Shubham Education & Welfare Society. All rights reserved.
