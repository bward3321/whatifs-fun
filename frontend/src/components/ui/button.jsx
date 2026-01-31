import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium font-body transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-tactical",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-alert",
        outline:
          "border border-primary/40 bg-transparent text-primary hover:bg-primary/10 hover:border-primary/60",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-primary/10 hover:text-primary",
        link: "text-primary underline-offset-4 hover:underline",
        // Tactical variants
        tactical: "bg-card border border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 shadow-tactical",
        alert: "bg-destructive/20 border border-destructive/50 text-destructive hover:bg-destructive/30 animate-pulse",
        success: "bg-success/20 border border-success/50 text-success hover:bg-success/30",
        warning: "bg-warning/20 border border-warning/50 text-warning hover:bg-warning/30",
        launch: "bg-gradient-to-r from-destructive to-destructive-glow text-destructive-foreground hover:shadow-alert font-display tracking-wider",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-14 rounded-md px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }
