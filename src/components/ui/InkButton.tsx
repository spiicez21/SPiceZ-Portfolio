import { type ReactNode } from 'react';
import Magnetic from '../utils/Magnetic';
import './InkButton.css';

interface InkButtonProps {
    children: ReactNode;
    onClick?: () => void;
    href?: string;
    variant?: 'primary' | 'secondary';
    className?: string;
    type?: 'button' | 'submit' | 'reset';
}

const InkButton = ({
    children,
    onClick,
    href,
    variant = 'primary',
    className = '',
    type = 'button'
}: InkButtonProps) => {
    const ButtonContent = (
        <>
            <span className="ink-text">{children}</span>
            <div className="ink-splash" />
        </>
    );

    if (href) {
        return (
            <Magnetic strength={0.3}>
                <a
                    href={href}
                    className={`ink-button ${variant} ${className}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {ButtonContent}
                </a>
            </Magnetic>
        );
    }

    return (
        <Magnetic strength={0.3}>
            <button
                className={`ink-button ${variant} ${className}`}
                onClick={onClick}
                type={type}
            >
                {ButtonContent}
            </button>
        </Magnetic>
    );
};

export default InkButton;
