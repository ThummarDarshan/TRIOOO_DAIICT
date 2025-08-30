import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const alertBadgeVariants = cva(
  'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium transition-smooth',
  {
    variants: {
      variant: {
        safe: 'bg-safe text-safe-foreground shadow-sm',
        advisory: 'bg-advisory text-advisory-foreground shadow-sm',
        warning: 'bg-warning text-warning-foreground shadow-sm',
        emergency: 'bg-emergency text-emergency-foreground shadow-sm',
      },
      size: {
        sm: 'px-2 py-1 text-xs',
        md: 'px-2.5 py-0.5 text-sm',
        lg: 'px-3 py-1 text-base',
      },
    },
    defaultVariants: {
      variant: 'safe',
      size: 'md',
    },
  }
);

export interface AlertBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertBadgeVariants> {}

function AlertBadge({ className, variant, size, ...props }: AlertBadgeProps) {
  return (
    <div className={cn(alertBadgeVariants({ variant, size }), className)} {...props} />
  );
}

export { AlertBadge, alertBadgeVariants };