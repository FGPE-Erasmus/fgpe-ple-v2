import { motion } from "framer-motion";

export default function withChangeAnimation<T>(
  Component: React.ComponentType<T>
) {
  return (props: T) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
    >
      <Component {...props} />
    </motion.div>
  );
}
