
import React, { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";

const TransitionWrapper = ({
  children,
  show = true,
  animation = "fade",
  duration = 300,
  delay = 0,
  className,
  ...props
}) => {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    let timeout;
    if (show && !mounted) {
      setMounted(true);
      timeout = setTimeout(() => {
        setVisible(true);
      }, 10);
    } else if (!show && visible) {
      setVisible(false);
      timeout = setTimeout(() => {
        setMounted(false);
      }, duration);
    }
    
    return () => clearTimeout(timeout);
  }, [show, visible, mounted, duration]);

  if (!mounted) return null;

  const animations = {
    fade: {
      enter: "opacity-0",
      enterActive: "opacity-100 transition-opacity ease-out",
      exit: "opacity-0 transition-opacity ease-in",
    },
    scale: {
      enter: "opacity-0 scale-95",
      enterActive: "opacity-100 scale-100 transition-all ease-out",
      exit: "opacity-0 scale-95 transition-all ease-in",
    },
    slideUp: {
      enter: "opacity-0 translate-y-4",
      enterActive: "opacity-100 translate-y-0 transition-all ease-out",
      exit: "opacity-0 translate-y-4 transition-all ease-in",
    },
    slideDown: {
      enter: "opacity-0 -translate-y-4",
      enterActive: "opacity-100 translate-y-0 transition-all ease-out",
      exit: "opacity-0 -translate-y-4 transition-all ease-in",
    },
    slideLeft: {
      enter: "opacity-0 translate-x-4",
      enterActive: "opacity-100 translate-x-0 transition-all ease-out",
      exit: "opacity-0 translate-x-4 transition-all ease-in",
    },
    slideRight: {
      enter: "opacity-0 -translate-x-4",
      enterActive: "opacity-100 translate-x-0 transition-all ease-out",
      exit: "opacity-0 -translate-x-4 transition-all ease-in",
    },
  };

  const currentAnimation = animations[animation];

  return (
    <div
      className={cn(
        visible ? currentAnimation.enterActive : currentAnimation.exit,
        !visible && !show && currentAnimation.enter,
        "transform",
        className
      )}
      style={{ 
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default TransitionWrapper;
