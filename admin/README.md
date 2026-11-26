# Siddhant High School — Admin Panel Application

This directory contains the **Super Admin OS & Management Console** for Siddhant High School (Shubham Education & Welfare Society), built with React 18, Vite, Tailwind CSS, Redux Toolkit, and Framer Motion.

For full project documentation, architectural overview, and screenshots, see the root [README](../Readme.md).

---

## 🚀 Quick Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run linter
pnpm lint
```

## 🔑 Administrator Access

Administrator credentials are not embedded in the project. They must be provided through the authorized setup process using the configured environment variables.

## 📁 Key Directories

- `src/pages/admin/` — Admin pages (Dashboard, Admissions, Enquiries, CMS, Settings)
- `src/features/admin/` — Admin business logic, forms, verification modals, mock data, and storage service
- `src/components/ui/` — Design system primitives (GlassCard, Button, Modal, Badge, Dropzone, Skeleton)
- `src/store/` — Redux store configuration and slices
- `src/routes.jsx` — React Router v6 setup with route protection
