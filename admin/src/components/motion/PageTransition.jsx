import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

/**
 * Standard cubic-bezier easing curve for fluid, responsive transitions.
 * Complies with UI/UX Engineering principles: duration < 300ms, physics-based ease-out.
 */
const EASING_CURVE = [0.16, 1, 0.3, 1];

const pageVariants = {
  initial: (reduced) => ({
    opacity: 0,
    y: reduced ? 0 : 14,
    filter: reduced ? 'none' : 'blur(2px)',
  }),
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.24,
      ease: EASING_CURVE,
    },
  },
  exit: (reduced) => ({
    opacity: 0,
    y: reduced ? 0 : -10,
    filter: reduced ? 'none' : 'blur(2px)',
    transition: {
      duration: 0.18,
      ease: EASING_CURVE,
    },
  }),
};

/**
 * PageTransition wrapper component
 * Provides seamless, physics-based page switch animations using Framer Motion.
 *
 * @param {React.ReactNode} children - The outlet or page element to animate
 * @param {string} className - Optional additional CSS classes
 * @param {React.RefObject} containerRef - Optional scroll container ref (e.g. for AdminLayout)
 * @param {boolean} showProgressBar - Whether to show the top route switch progress bar (default true)
 */
export const PageTransition = ({
  children,
  className = '',
  containerRef = null,
  showProgressBar = true,
}) => {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  // Scroll to top when exiting finishes right before new route mounts
  const handleExitComplete = () => {
    if (containerRef?.current) {
      containerRef.current.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  };

  // Immediate scroll reset when user has prefers-reduced-motion
  useEffect(() => {
    if (shouldReduceMotion) {
      handleExitComplete();
    }
  }, [location.pathname, shouldReduceMotion]);

  return (
    <>
      {/* Top route switch progress indicator */}
      {showProgressBar && !shouldReduceMotion && (
        <motion.div
          key={`route-progress-${location.pathname}`}
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{
            scaleX: [0, 0.75, 1],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 0.42,
            times: [0, 0.65, 1],
            ease: EASING_CURVE,
          }}
          style={{ transformOrigin: '0% 50%' }}
          className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-brand-interactive via-blue-400 to-accent-innovation shadow-[0_1px_8px_rgba(37,99,235,0.4)] z-50 pointer-events-none"
          aria-hidden="true"
        />
      )}

      {/* Main route switch presence */}
      <AnimatePresence
        mode="wait"
        initial={false}
        onExitComplete={handleExitComplete}
      >
        <motion.div
          key={location.pathname}
          custom={shouldReduceMotion}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className={`w-full flex-1 flex flex-col ${className}`}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default PageTransition;

