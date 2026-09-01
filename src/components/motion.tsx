import { motion, type Variants } from "motion/react";
import type { ComponentProps, ReactNode } from "react";

export const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
};

export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
};

interface RevealProps extends Omit<
  ComponentProps<typeof motion.div>,
  "variants" | "initial" | "whileInView" | "viewport"
> {
  children: ReactNode;
  delay?: number;
}

/** Fades and slides an element up once, the first time it scrolls into view. */
export function Reveal({ children, delay = 0, transition, ...props }: RevealProps) {
  return (
    <motion.div
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: easeOut, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface StaggerProps extends ComponentProps<typeof motion.div> {
  children: ReactNode;
}

/** Container that staggers its StaggerItem children in as it scrolls into view. */
export function Stagger({ children, ...props }: StaggerProps) {
  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, ...props }: ComponentProps<typeof motion.div>) {
  return (
    <motion.div variants={staggerItemVariants} {...props}>
      {children}
    </motion.div>
  );
}
