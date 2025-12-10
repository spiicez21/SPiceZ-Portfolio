import { ReactNode } from 'react';
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
                <div className="section-label">
                    [{number}] {label}
                </div>
                <div className="section-content">
                    {children}
                </div>
            </div>
            <div className="scanline-overlay" />
        </section>
    );
};

export default SectionFrame;
