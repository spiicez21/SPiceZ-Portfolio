import { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrambleTextProps {
    text: string;
    className?: string;
    delay?: number;
    revealSpeed?: number; // ms between revealing each character
    scrambleSpeed?: number; // ms between scrambling characters
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+-=[]{}|;:,.<>?/';

const ScrambleText = ({
    text,
    className = '',
    delay = 0,
    revealSpeed = 50,
    scrambleSpeed = 30,
}: ScrambleTextProps) => {
    const [displayText, setDisplayText] = useState(text);
    const elementRef = useRef<HTMLSpanElement>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    useGSAP(() => {
        const element = elementRef.current;
        if (!element) return;

        ScrollTrigger.create({
            trigger: element,
            start: 'top 85%',
            once: true,
            onEnter: () => {
                startScramble();
            }
        });
    }, { scope: elementRef });

    const startScramble = () => {
        if (isAnimating) return;
        setIsAnimating(true);

        const length = text.length;
        let revealed = 0;
        let scrambleFrame = 0;

        // Initial delay
        setTimeout(() => {
            const interval = setInterval(() => {
                let output = '';

                // Build the string
                for (let i = 0; i < length; i++) {
                    if (i < revealed) {
                        output += text[i];
                    } else {
                        output += CHARS[Math.floor(Math.random() * CHARS.length)];
                    }
                }

                setDisplayText(output);

                // Logic to advance revealed characters
                scrambleFrame++;
                if (scrambleFrame % Math.floor(revealSpeed / scrambleSpeed) === 0) {
                    revealed++; // Reveal one more character
                }

                // End condition
                if (revealed > length) {
                    clearInterval(interval);
                    setDisplayText(text); // Ensure final text is correct
                    setIsAnimating(false);
                }

            }, scrambleSpeed);
        }, delay * 1000);
    };

    return (
        <span ref={elementRef} className={className} style={{ display: 'inline-block' }}>
            {displayText}
        </span>
    );
};

export default ScrambleText;
