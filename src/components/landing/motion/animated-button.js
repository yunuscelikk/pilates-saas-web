"use client";

import { motion, useReducedMotion } from "framer-motion";
import { buttonHover, buttonTap } from "@/lib/animations";

export default function AnimatedButton({ children, className = "" }) {
  const shouldReduce = useReducedMotion();

  if (shouldReduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      whileHover={buttonHover}
      whileTap={buttonTap}
      transition={{ duration: 0.15 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
