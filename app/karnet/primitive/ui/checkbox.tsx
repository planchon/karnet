import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { motion } from 'framer-motion';
import { CheckIcon } from 'lucide-react';
import type * as React from 'react';
import { useSettings } from '@/hooks/useStores';
import { cn } from '@/lib/utils';

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  const settings = useSettings();
  return (
    <CheckboxPrimitive.Root
      className={cn(
        'peer size-4 shrink-0 rounded-[4px] border border-input shadow-xs outline-none transition-shadow focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:bg-input/30 dark:data-[state=checked]:bg-primary dark:aria-invalid:ring-destructive/40',
        settings.disableLinks && 'pointer-events-none select-none',
        className
      )}
      data-slot="checkbox"
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className="flex items-center justify-center text-current transition-none"
        data-slot="checkbox-indicator"
      >
        <motion.div
          animate={{
            scale: 1,
          }}
          className="flex items-center justify-center text-current"
          exit={{
            scale: 0,
          }}
          initial={{
            scale: 0,
          }}
          transition={{
            duration: 0.2,
            ease: 'easeOut',
          }}
        >
          <CheckIcon className="size-3.5" />
        </motion.div>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
