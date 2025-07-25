import React, { useMemo } from 'react';

interface GradientTextProps {
  children: React.ReactNode;
  colors: string[];
  animationSpeed?: number;
  showBorder?: boolean;
  className?: string;
}

const GradientText: React.FC<GradientTextProps> = ({
  children,
  colors,
  animationSpeed = 5,
  showBorder = false,
  className = '',
}) => {
  const gradientStyle = useMemo(() => ({
    background: `linear-gradient(90deg, ${colors.join(', ')})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundSize: '200% 200%',
    animation: `gradientAnimation ${animationSpeed}s ease infinite`,
  }), [colors, animationSpeed]);

  const borderStyle = showBorder ? { border: '1px solid', borderImageSource: `linear-gradient(90deg, ${colors.join(', ')})`, borderImageSlice: 1 } : {};

  return (
    <span style={{ ...gradientStyle, ...borderStyle }} className={className}>
      {children}
    </span>
  );
};

export default GradientText;