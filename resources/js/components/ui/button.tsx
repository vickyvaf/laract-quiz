import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-100 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 select-none cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border-b-4 border-brand-700 hover:bg-brand-400 hover:border-brand-600 active:border-b-0 active:translate-y-[4px]",
        destructive:
          "bg-destructive text-white border-b-4 border-red-800 hover:bg-red-500 hover:border-red-700 active:border-b-0 active:translate-y-[4px]",
        outline:
          "border-2 border-b-4 border-input bg-background hover:bg-accent hover:text-accent-foreground active:border-b-2 active:translate-y-[2px]",
        secondary:
          "bg-secondary text-secondary-foreground border-b-4 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 active:border-b-0 active:translate-y-[4px]",
        ghost: "hover:bg-accent hover:text-accent-foreground active:translate-y-[1px]",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 py-3",
        sm: "h-9 px-4 py-2",
        lg: "h-12 px-8 py-4",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
