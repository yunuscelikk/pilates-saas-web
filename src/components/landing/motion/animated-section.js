"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  fadeUp,
  fadeIn,
  slideLeft,
  slideRight,
  scaleIn,
  viewportConfig,
} from "@/lib/animations";

const variants = { fadeUp, fadeIn, slideLeft, slideRight, scaleIn };

export default function AnimatedSection({
  children,
  variant = "fadeUp",
  delay = 0,
  className = "",
}) {
  const shouldReduce = useReducedMotion();

  if (shouldReduce) {
    return <div className={className}>{children}</div>;
  }

  const selected = variants[variant] || fadeUp;
  const withDelay = delay
    ? {
        ...selected,
        visible: {
          ...selected.visible,
          transition: { ...selected.visible.transition, delay },
        },
      }
    : selected;

  return (
    <motion.div
      variants={withDelay}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
      className={className}
    >
      {children}
    </motion.div>
  );
}
