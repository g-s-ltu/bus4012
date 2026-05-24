import React, { useEffect, useState } from 'react';

interface AnimatedCheckmarkProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  duration?: number;
  className?: string;
}

export const AnimatedCheckmark: React.FC<AnimatedCheckmarkProps> = ({
  size = 100,
  color = '#16a34a',
  strokeWidth = 4,
  duration = 800,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Start animation after mount
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const checkmarkLength = 30;

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={isVisible ? 0 : circumference}
          strokeLinecap="round"
          style={{
            transition: `stroke-dashoffset ${duration}ms ease-in-out`,
          }}
        />
        
        {/* Checkmark */}
        <path
          d={`M ${size * 0.3} ${size * 0.5} L ${size * 0.45} ${size * 0.65} L ${size * 0.7} ${size * 0.35}`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={checkmarkLength}
          strokeDashoffset={isVisible ? 0 : checkmarkLength}
          style={{
            transition: `stroke-dashoffset ${duration}ms ease-in-out ${duration / 2}ms`,
          }}
        />
      </svg>
    </div>
  );
};

// Alternative success circle with animated checkmark
export const AnimatedSuccessCircle: React.FC<AnimatedCheckmarkProps> = ({
  size = 120,
  color = '#16a34a',
  strokeWidth = 3,
  duration = 800,
  className = '',
}) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // Phase 1: Circle appears
    const timer1 = setTimeout(() => setPhase(1), 50);
    // Phase 2: Checkmark appears
    const timer2 = setTimeout(() => setPhase(2), duration / 2);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [duration]);

  const center = size / 2;
  const radius = (size - strokeWidth * 2) / 2;

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill={color}
          className={`transition-all duration-500 ${
            phase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
          }`}
          style={{ transformOrigin: 'center' }}
        />
        
        {/* Checkmark */}
        <path
          d={`M ${size * 0.3} ${size * 0.5} L ${size * 0.45} ${size * 0.65} L ${size * 0.7} ${size * 0.35}`}
          fill="none"
          stroke="white"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-all duration-300 ${
            phase >= 2 ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            strokeDasharray: 50,
            strokeDashoffset: phase >= 2 ? 0 : 50,
            transition: 'stroke-dashoffset 0.3s ease-out, opacity 0.3s ease-out',
          }}
        />
      </svg>
    </div>
  );
};