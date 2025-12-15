import { useState } from "react";

interface BubbleTextProps {
    text: string;
    className?: string;
}

export const BubbleText = ({ text, className = "" }: BubbleTextProps) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <span
            onMouseLeave={() => setHoveredIndex(null)}
            className={`cursor-default font-mono text-white inline-block ${className}`}
        >
            {text.split("").map((char, idx) => {
                const distance = hoveredIndex !== null ? Math.abs(hoveredIndex - idx) : null;

                // Base transition classes
                let classes = "transition-all duration-200 ease-in-out inline-block";

                // Logic for "Only White Text" using opacity/weight
                switch (distance) {
                    case 0:
                        // Hovered
                        classes += " font-black opacity-100 scale-110";
                        break;
                    case 1:
                        // Neighbors
                        classes += " font-bold opacity-90 scale-105";
                        break;
                    default:
                        // Default
                        classes += " font-normal opacity-100";
                        break;
                }

                return (
                    <span
                        key={idx}
                        onMouseEnter={() => setHoveredIndex(idx)}
                        className={classes}
                    >
                        {char === " " ? "\u00A0" : char}
                    </span>
                );
            })}
        </span>
    );
};
