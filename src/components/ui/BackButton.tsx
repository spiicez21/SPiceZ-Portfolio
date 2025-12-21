import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useRef } from 'react';
import { gsap } from '../../lib/animations/gsapClient';
import './BackButton.css';

const BackButton = () => {
    const navigate = useNavigate();
    const maskRef = useRef<HTMLDivElement>(null);

    const handleBack = () => {
        if (!maskRef.current) {
            navigate('/');
            return;
        }

        // Create exit transition
        gsap.set(maskRef.current, {
            x: '-100%',
            display: 'block',
        });

        gsap.to(maskRef.current, {
            x: '0%',
            duration: 0.8,
            ease: 'power3.inOut',
            onComplete: () => {
                navigate('/');
            }
        });
    };

    return (
        <>
            <button className="back-button" onClick={handleBack} aria-label="Go back to home">
                <ArrowLeft size={20} />
                <span>BACK</span>
            </button>
            <div ref={maskRef} className="back-transition-mask" />
        </>
    );
};

export default BackButton;
