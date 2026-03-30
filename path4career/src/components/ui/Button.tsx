import * as React from"react"
import { Slot } from"@radix-ui/react-slot"
import { cn } from"../../utils/cn"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: 'default' | 'glass' | 'ghost' | 'outline' | 'gradient'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant ="default", size ="default", asChild = false, isLoading, children, ...props }, ref) => {
    const Comp = asChild ? Slot :"button"
    
    // Using string mapping instead of cva for simplicity/less dependencies
    const baseStyles ="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
    
    const variants = {
      default:"bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
      gradient:"bg-gradient-to-r from-brand-600 to-violet-600 text-white hover:from-brand-500 hover:to-violet-500 shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40",
      glass:"glass-surface text-foreground hover:bg-foreground/5",
      outline:"border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
      ghost:"hover:bg-accent hover:text-accent-foreground text-muted-foreground",
    }
    
    const sizes = {
      default:"h-10 px-4 py-2",
      sm:"h-9 rounded-lg px-3",
      lg:"h-14 rounded-2xl px-8 text-lg",
      icon:"h-10 w-10",
    }

    return (
      <Comp
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <>
            <div className="mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    )
  }
)
Button.displayName ="Button"

export { Button }
