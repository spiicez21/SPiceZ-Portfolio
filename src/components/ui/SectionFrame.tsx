import { type ReactNode } from 'react';
import ScrambleText from '../utils/ScrambleText';
import './SectionFrame.css';

interface SectionFrameProps {
    id: string;
    label: string;
    number: string;
    children: ReactNode;
    className?: string;
}

const SectionFrame = ({ id, label, number, children, className = '' }: SectionFrameProps) => {
    return (
        <section id={id} className={`section-frame ${className}`}>
            <div className="section-border">
                {/* Conditionally render header only if label or number is present */}
                {(label || number) && (
                    <div className="section-header-content">
                        <span className="section-number">
                            <span className="hash">#</span>
                            {number}
                        </span>
                        <h2 className="section-label">
                            <ScrambleText text={label} revealSpeed={40} scrambleSpeed={20} />
                        </h2>
                    </div>
                )}
                <div className="section-content">
                    {children}
                </div>
            </div>
            <div className="scanline-overlay" />
        </section>
    );
};

export default SectionFrame;
