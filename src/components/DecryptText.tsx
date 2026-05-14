import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

const CHARS = '!@#$%^&*<>?/|\\[]{}01ABCDEFXYZabcxyz';

interface DecryptTextProps {
  text: string;
  className?: string;
  duration?: number;
  delay?: number;
}

export const DecryptText = ({ text, className = '', duration = 1200, delay = 0 }: DecryptTextProps) => {
  const [displayed, setDisplayed] = useState(() => text.split('').map(() => CHARS[Math.floor(Math.random() * CHARS.length)]).join(''));
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const timeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [isInView, delay]);

  useEffect(() => {
    if (!started) return;

    const chars = text.split('');
    const resolved = new Array(chars.length).fill(false);
    
    // Snappier settings: 2 scramble frames per character, much faster interval
    const framesPerChar = 2;
    const totalFrames = chars.length * framesPerChar;
    const intervalMs = duration / totalFrames;

    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      const resolvedCount = Math.floor(frame / framesPerChar);

      // Mark chars up to resolvedCount as resolved
      for (let i = 0; i < resolvedCount && i < chars.length; i++) {
        resolved[i] = true;
      }

      setDisplayed(
        chars.map((ch, i) => {
          if (ch === ' ') return ' ';
          if (resolved[i]) return ch;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join('')
      );

      if (resolvedCount >= chars.length) {
        clearInterval(interval);
        setDisplayed(text);
      }
    }, Math.max(intervalMs, 16)); // Ensure it doesn't go below 60fps equivalent

    return () => clearInterval(interval);
  }, [started, text, duration]);

  return (
    <span ref={ref} className={`${className} font-system-mono tracking-wide`}>
      {displayed}
    </span>
  );
};
