import { motion } from 'framer-motion';
import type { TaskStatus } from '@/models/task.model';

export const Status = (props: { status: TaskStatus }) => {
  const backlog = {
    circle1: {
      stroke: 'rgb(164, 168, 174)',
      strokeWidth: 1.5,
      strokeDasharray: '1.4 1.74',
      strokeDashoffset: 0.65,
      cx: 7,
      cy: 7,
      r: 6,
      fill: 'none',
    },
    circle2: {
      stroke: 'rgb(164, 168, 174)',
      strokeWidth: 4,
      strokeDasharray: '11.309733552923255 22.61946710584651',
      strokeDashoffset: 12,
      cx: 7,
      cy: 7,
      r: 2,
      fill: 'none',
    },
  };

  const inProgress = {
    circle1: {
      stroke: 'rgb(240, 191, 0)',
      strokeWidth: 1.5,
      strokeDasharray: '3.14 0',
      strokeDashoffset: -0.7,
      cx: 7,
      cy: 7,
      r: 6,
      fill: 'none',
    },
    circle2: {
      stroke: 'rgb(240, 191, 0)',
      strokeWidth: 4,
      strokeDasharray: '11.309733552923255 22.61946710584651',
      strokeDashoffset: 5.21,
      r: 2,
      cx: 7,
      cy: 7,
      fill: 'none',
    },
  };

  const done = {
    circle1: {
      stroke: 'rgb(48, 166, 109)',
      strokeWidth: 1.5,
      strokeDasharray: '3.14 0',
      strokeDashoffset: '-0.7',
      cx: 7,
      cy: 7,
      r: 6,
      fill: 'none',
    },
    circle2: {
      stroke: 'rgb(48, 166, 109)',
      strokeWidth: 6,
      strokeDasharray: '18.84955592153876 37.69911184307752',
      strokeDashoffset: '0',
      fill: 'none',
      r: 3,
      cx: 7,
      cy: 7,
    },
  };

  const status = props.status || 'backlog';

  const animateMap: Record<TaskStatus, any> = {
    todo: backlog,
    in_progress: inProgress,
    done,
  };

  return (
    <motion.svg
      aria-label="Status"
      height="14"
      role="img"
      viewBox="0 0 14 14"
      width="14"
    >
      <motion.circle
        animate={animateMap[status]?.circle1}
        initial={false}
        transition={{
          duration: 0.3,
          ease: 'easeOut',
        }}
      />
      <motion.circle
        animate={animateMap[status]?.circle2}
        initial={false}
        transform="rotate(-90 7 7)"
        transition={{
          duration: 0.3,
          ease: 'easeOut',
        }}
      />
      {status === 'done' && (
        <motion.path
          animate={{
            fill: 'white',
            scale: 0.9,
            opacity: 1,
          }}
          d="M10.951 4.24896C11.283 4.58091 11.283 5.11909 10.951 5.45104L5.95104 10.451C5.61909 10.783 5.0809 10.783 4.74896 10.451L2.74896 8.45104C2.41701 8.11909 2.41701 7.5809 2.74896 7.24896C3.0809 6.91701 3.61909 6.91701 3.95104 7.24896L5.35 8.64792L9.74896 4.24896C10.0809 3.91701 10.6191 3.91701 10.951 4.24896Z"
          exit={{
            fill: 'none',
            scale: 0,
            opacity: 0,
          }}
          initial={{
            fill: 'none',
            scale: 0,
            opacity: 0,
          }}
          stroke="none"
          transition={{
            duration: 0.2,
            ease: 'easeOut',
          }}
        />
      )}
    </motion.svg>
  );
};
