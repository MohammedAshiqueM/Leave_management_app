
import React from 'react';
import { cn } from "@/lib/utils";

const Card = React.forwardRef(({ 
  className, 
  children,
  hover = false,
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-soft overflow-hidden",
        hover && "transition-all duration-300 ease-out hover:shadow-medium hover:translate-y-[-2px]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

const CardHeader = React.forwardRef(({ 
  className, 
  children,
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    >
      {children}
    </div>
  );
});

const CardTitle = React.forwardRef(({ 
  className, 
  children,
  ...props 
}, ref) => {
  return (
    <h3
      ref={ref}
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    >
      {children}
    </h3>
  );
});

const CardDescription = React.forwardRef(({ 
  className, 
  children,
  ...props 
}, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    >
      {children}
    </p>
  );
});

const CardContent = React.forwardRef(({ 
  className, 
  children,
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn("p-6 pt-0", className)}
      {...props}
    >
      {children}
    </div>
  );
});

const CardFooter = React.forwardRef(({ 
  className, 
  children,
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    >
      {children}
    </div>
  );
});

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

Card.displayName = "Card";
CardHeader.displayName = "CardHeader";
CardTitle.displayName = "CardTitle";
CardDescription.displayName = "CardDescription";
CardContent.displayName = "CardContent";
CardFooter.displayName = "CardFooter";

export default Card;
