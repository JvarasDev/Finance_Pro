import { motion } from 'framer-motion';
import React from 'react';

export default function AnimatedList({ items }: { items: any[] }) {
  return (
    <motion.ul
      className="space-y-4"
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.1 } },
        hidden: {},
      }}
    >
      {items.map((item, i) => (
        <motion.li
          key={item.category}
          className="flex flex-col md:flex-row md:justify-between md:items-center border-0 p-6 rounded-2xl bg-white/90 dark:bg-dark/80 shadow-glass backdrop-blur-lg gap-2 md:gap-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
        >
          <span className="font-semibold capitalize text-dark dark:text-gold text-lg tracking-wide font-display">{item.category}</span>
          <span className="text-2xl font-extrabold text-gold drop-shadow font-display">${item.amount.toLocaleString('es-CL')}</span>
          <span className="text-xs text-zinc-500 dark:text-zinc-200 ml-2 italic font-display">{item.advice}</span>
        </motion.li>
      ))}
    </motion.ul>
  );
}
