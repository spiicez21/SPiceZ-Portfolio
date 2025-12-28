import { type ReactNode } from 'react';
import './InkButton.css';

interface InkButtonProps {
    children: ReactNode;
    onClick?: () => void;
    href?: string;
    variant?: 'primary' | 'secondary';
    className?: string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
}

const InkButton = ({
    children,
    onClick,
    href,
    variant = 'primary',
    className = '',
    type = 'button',
    disabled = false
}: InkButtonProps) => {
    const ButtonContent = (
        <>
            <span className="ink-text">{children}</span>
            <div className="ink-splash" />
        </>
    );

    if (href) {
        return (
            <a
                href={href}
                className={`ink-button ${variant} ${className}`}
                target="_blank"
                rel="noopener noreferrer"
            >
                {ButtonContent}
            </a>
        );
    }

    return (
        <button
            className={`ink-button ${variant} ${className}`}
            onClick={onClick}
            type={type}
            disabled={disabled}
        >
            {ButtonContent}
        </button>
    );
};

export default InkButton;
