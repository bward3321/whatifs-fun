import { motion } from 'framer-motion';

export function DepthMarker({ label }) {
  return (
    <motion.div
      className="depth-marker"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8 }}
      data-testid={`depth-marker-${label}`}
    >
      <div className="depth-marker-line" />
      <h3 className="depth-marker-text">{label}</h3>
    </motion.div>
  );
}
