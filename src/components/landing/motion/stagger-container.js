"use client";

import { motion, useReducedMotion } from "framer-motion";
import { staggerContainer, staggerItem, viewportConfig } from "@/lib/animations";

export default function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.1,
}) {
  const shouldReduce = useReducedMotion();

  if (shouldReduce) {
    return <div className={className}>{children}</div>;
  }

  const container = {
    ...staggerContainer,
    visible: {
      transition: { staggerChildren: staggerDelay, delayChildren: 0.1 },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "" }) {
  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  );
}
