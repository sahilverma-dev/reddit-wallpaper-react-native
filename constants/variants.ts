import { Variants } from "framer-motion";

export const page: Variants = {
  hidden: {
    x: "100vw",
    opacity: 0,
    // scale: 0.9,
    transition: {
      type: "tween",
      ease: "easeIn",
      duration: 0.5,
    },
  },
  visible: {
    x: 0,
    opacity: 1,
    // scale: 1,
    transition: {
      delay: 0.2,
      type: "tween",
      ease: "easeOut",
      duration: 0.5,
    },
  },
  exit: {
    x: "-100vw",
    opacity: 0,
    // scale: 0.9,
    transition: {
      type: "tween",
      ease: "easeIn",
      duration: 0.5,
    },
  },
};

export const container: Variants = {
  hidden: {
    x: 0,
  },
  visible: {
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      staggerChildren: 0.05,
    },
  },
};

export const item: Variants = {
  hidden: {
    x: 50,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
  },
};
