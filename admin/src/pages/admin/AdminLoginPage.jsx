import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import AdminLoginCard from '../../features/admin/auth/AdminLoginCard';

export const AdminLoginPage = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -14, scale: 0.98 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <AdminLoginCard />
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;

