import { type ReactNode } from 'react';
import './InkButton.css';

interface InkButtonProps {
    children: ReactNode;
    onClick?: () => void;
    href?: string;
    variant?: 'primary' | 'secondary';
    className?: string;
}

const InkButton = ({
    children,
    onClick,
    href,
    variant = 'primary',
    className = ''
}: InkButtonProps) => {
    const baseClass = `ink-button ink-button--${variant} ${className}`;

    if (href) {
        return (
            <a href={href} className={baseClass} target="_blank" rel="noopener noreferrer">
                {children}
            </a>
        );
    }

    return (
        <button onClick={onClick} className={baseClass}>
            {children}
        </button>
    );
};

export default InkButton;
