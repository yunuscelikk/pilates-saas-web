"use client";

import { motion, useReducedMotion } from "framer-motion";
import { staggerItem, cardHover } from "@/lib/animations";

export default function AnimatedCard({ children, className = "" }) {
  const shouldReduce = useReducedMotion();

  if (shouldReduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={staggerItem}
      whileHover={cardHover}
      className={className}
    >
      {children}
    </motion.div>
  );
}
