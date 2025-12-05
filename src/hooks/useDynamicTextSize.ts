import { useState, useEffect, useRef, useCallback } from 'react';

interface DynamicTextSizeOptions {
  minFontSize?: number;
  maxFontSize?: number;
  minLineHeight?: number;
  maxLineHeight?: number;
  padding?: number;
  tolerance?: number;
}

interface UseDynamicTextSizeReturn {
  fontSize: number;
  lineHeight: number;
  padding: number;
  containerRef: React.RefObject<HTMLDivElement>;
  textRef: React.RefObject<HTMLDivElement>;
  recalculate: () => void;
}

export const useDynamicTextSize = (
  text: string,
  options: DynamicTextSizeOptions = {}
): UseDynamicTextSizeReturn => {
  const {
    minFontSize = 12,
    maxFontSize = 24,
    minLineHeight = 1.2,
    maxLineHeight = 1.8,
    padding = 16,
    tolerance = 0.95
  } = options;

  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(maxFontSize);
  const [lineHeight, setLineHeight] = useState(maxLineHeight);
  const [currentPadding, setCurrentPadding] = useState(padding);

  const calculateOptimalSize = useCallback(() => {
    if (!containerRef.current || !textRef.current) return;

    const container = containerRef.current;
    const textElement = textRef.current;
    
    // Get container dimensions
    const containerWidth = container.clientWidth - (padding * 2);
    const containerHeight = container.clientHeight - (padding * 2);
    
    // Start with maximum font size
    let optimalFontSize = maxFontSize;
    let optimalLineHeight = maxLineHeight;
    let optimalPadding = padding;
    
    // Create a temporary element for measurement
    const tempElement = document.createElement('div');
    tempElement.style.position = 'absolute';
    tempElement.style.visibility = 'hidden';
    tempElement.style.width = `${containerWidth}px`;
    tempElement.style.fontFamily = window.getComputedStyle(textElement).fontFamily;
    tempElement.style.fontWeight = window.getComputedStyle(textElement).fontWeight;
    tempElement.style.letterSpacing = window.getComputedStyle(textElement).letterSpacing;
    tempElement.style.wordBreak = 'break-word';
    tempElement.style.hyphens = 'auto';
    tempElement.style.textAlign = 'justify';
    tempElement.style.overflowWrap = 'anywhere';
    tempElement.innerHTML = text.replace(/\s+/g, ' ').trim();
    
    document.body.appendChild(tempElement);
    
    // Binary search for optimal font size
    let low = minFontSize;
    let high = maxFontSize;
    
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      
      // Try different line heights for this font size
      let fits = false;
      let bestLineHeightForSize = minLineHeight;
      
      for (let lh = maxLineHeight; lh >= minLineHeight; lh -= 0.1) {
        tempElement.style.fontSize = `${mid}px`;
        tempElement.style.lineHeight = lh.toString();
        
        const textHeight = tempElement.scrollHeight;
        const textWidth = tempElement.scrollWidth;
        
        // Check if text fits within container
        if (textHeight <= containerHeight * tolerance && textWidth <= containerWidth) {
          fits = true;
          bestLineHeightForSize = lh;
          break;
        }
      }
      
      if (fits) {
        optimalFontSize = mid;
        optimalLineHeight = bestLineHeightForSize;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    
    // If still too big, reduce padding
    if (optimalFontSize === minFontSize) {
      for (let pad = padding; pad >= 8; pad -= 2) {
        const paddedWidth = container.clientWidth - (pad * 2);
        const paddedHeight = container.clientHeight - (pad * 2);
        
        tempElement.style.width = `${paddedWidth}px`;
        tempElement.style.fontSize = `${minFontSize}px`;
        tempElement.style.lineHeight = minLineHeight.toString();
        
        if (tempElement.scrollHeight <= paddedHeight && tempElement.scrollWidth <= paddedWidth) {
          optimalPadding = pad;
          break;
        }
      }
    }
    
    document.body.removeChild(tempElement);
    
    setFontSize(optimalFontSize);
    setLineHeight(optimalLineHeight);
    setCurrentPadding(optimalPadding);
  }, [text, minFontSize, maxFontSize, minLineHeight, maxLineHeight, padding, tolerance]);

  useEffect(() => {
    calculateOptimalSize();
    
    // Recalculate on window resize
    const handleResize = () => {
      setTimeout(calculateOptimalSize, 100);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateOptimalSize]);

  // Recalculate when text changes
  useEffect(() => {
    calculateOptimalSize();
  }, [text, calculateOptimalSize]);

  return {
    fontSize,
    lineHeight,
    padding: currentPadding,
    containerRef,
    textRef,
    recalculate: calculateOptimalSize
  };
};