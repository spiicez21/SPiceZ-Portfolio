import { useEffect, useRef, useState } from 'react';

interface AsciiImageProps {
    src: string;
    alt: string;
    className?: string;
    characters?: string;
    density?: number; // Lower is more dense
    enableOnHover?: boolean;
}

const DENSITY_CHARS = 'Ñ@#W$9876543210?!abc;:+=-,._ ';

const AsciiImage = ({
    src,
    alt,
    className = '',
    characters = DENSITY_CHARS,
    density = 4, // Sampling step
    enableOnHover = true
}: AsciiImageProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [asciiText, setAsciiText] = useState<string>('');

    useEffect(() => {
        if (!src) return;

        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = src;

        img.onload = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            if (!ctx) return;

            // Maintain aspect ratio but scale down for ASCII processing
            const aspectRatio = img.width / img.height;
            // We want fixed width for processing to control density
            const processWidth = 100;
            const processHeight = processWidth / aspectRatio; // Corrected height calculation

            canvas.width = processWidth;
            canvas.height = processHeight;

            // Draw image to small canvas
            ctx.drawImage(img, 0, 0, processWidth, processHeight);

            // Get pixel data
            const imageData = ctx.getImageData(0, 0, processWidth, processHeight);
            const data = imageData.data;

            let text = '';

            // Iterate through pixels
            // Note: characters are taller than wide, so we might need to skip lines or stretch
            // Standard font aspect ratio correction is roughly 0.5 (width/height)
            // So we sample every 'density' pixels horizontally, but maybe density*2 vertically?
            // Let's stick to simple sampling first.

            for (let y = 0; y < processHeight; y += 2) { // Skip every other row for aspect correction
                for (let x = 0; x < processWidth; x++) {
                    const offset = (y * processWidth + x) * 4;
                    const r = data[offset];
                    const g = data[offset + 1];
                    const b = data[offset + 2];
                    // const a = data[offset + 3];

                    const brightness = (r + g + b) / 3;
                    const charIndex = Math.floor((brightness / 255) * (characters.length - 1));
                    const char = characters[characters.length - 1 - charIndex]; // Invert for dark-on-light or light-on-dark

                    text += char;
                }
                text += '\n';
            }

            setAsciiText(text);
        };
    }, [src, characters, density]);

    return (
        <div
            ref={containerRef}
            className={`ascii-wrapper relative overflow-hidden ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ position: 'relative' }}
        >
            {/* Original Image */}
            <img
                src={src}
                alt={alt}
                className={`w-full h-full object-cover transition-opacity duration-300 ${isHovered && enableOnHover ? 'opacity-0' : 'opacity-100'}`}
            />

            {/* Hidden Canvas for processing */}
            <canvas ref={canvasRef} className="hidden" />

            {/* ASCII Overlay */}
            <div
                className={`ascii-overlay absolute inset-0 bg-black flex items-center justify-center overflow-hidden pointer-events-none transition-opacity duration-300 ${isHovered && enableOnHover ? 'opacity-100' : 'opacity-0'}`}
                style={{
                    fontFamily: 'monospace',
                    fontSize: '10px',
                    lineHeight: '10px',
                    whiteSpace: 'pre',
                    color: '#fff', // White based on user feedback
                    textAlign: 'center'
                }}
            >
                {asciiText}
            </div>
        </div>
    );
};

export default AsciiImage;
