import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export function AnimatedNumber({ 
  value, 
  prefix = '', 
  suffix = '', 
  decimals = 2,
  className = ''
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevValue = useRef(value);

  useEffect(() => {
    if (value !== prevValue.current) {
      setIsAnimating(true);
      
      // Animate the number change
      const start = prevValue.current;
      const end = value;
      const duration = 500;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const current = start + (end - start) * easeOutCubic;
        
        setDisplayValue(current);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
          prevValue.current = value;
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [value]);

  const formattedValue = displayValue.toFixed(decimals);
  const [intPart, decPart] = formattedValue.split('.');
  
  // Format with commas
  const formattedInt = parseInt(intPart).toLocaleString('en-US');

  return (
    <span className={`inline-flex items-baseline font-mono ${className}`}>
      {prefix}
      <AnimatePresence mode="popLayout">
        {formattedInt.split('').map((char, i) => (
          <motion.span
            key={`${i}-${char}`}
            initial={isAnimating ? { y: -20, opacity: 0 } : false}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 30,
              delay: i * 0.02 
            }}
            className="inline-block"
          >
            {char}
          </motion.span>
        ))}
      </AnimatePresence>
      {decimals > 0 && (
        <>
          <span>.</span>
          <AnimatePresence mode="popLayout">
            {decPart.split('').map((char, i) => (
              <motion.span
                key={`dec-${i}-${char}`}
                initial={isAnimating ? { y: -20, opacity: 0 } : false}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 300, 
                  damping: 30,
                  delay: (formattedInt.length + i) * 0.02 
                }}
                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
          </AnimatePresence>
        </>
      )}
      {suffix}
    </span>
  );
}
