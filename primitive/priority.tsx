import { motion, type Transition } from 'framer-motion';

export const Priority = ({ priority }: { priority: number }) => {
  const smallSize = 3;
  const smallY = 16;

  const transition: Transition = {
    duration: 0.3,
    ease: 'easeOut',
  };

  return (
    <motion.svg
      aria-label="Priority"
      className="size-4 text-accent-foreground/80"
      height="24"
      role="img"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.rect
        animate={{
          height: priority >= 5 ? smallSize : 5,
          y: priority >= 5 ? smallY : 14,
        }}
        initial={{ height: 0 }}
        rx="1"
        transition={transition}
        width="2"
        x="5"
      />
      <motion.rect
        animate={{
          height: priority >= 4 ? smallSize : 8,
          y: priority >= 4 ? smallY : 11,
        }}
        initial={{ height: 0 }}
        rx="1"
        transition={transition}
        width="2"
        x="9"
      />
      <motion.rect
        animate={{
          height: priority >= 3 ? smallSize : 11,
          y: priority >= 3 ? smallY : 8,
        }}
        initial={{ height: 0 }}
        rx="1"
        transition={transition}
        width="2"
        x="13"
      />
      <motion.rect
        animate={{
          height: priority >= 2 ? smallSize : 14,
          y: priority >= 2 ? smallY : 5,
        }}
        initial={{ height: 0 }}
        rx="1"
        transition={transition}
        width="2"
        x="17"
      />
    </motion.svg>
  );
};
