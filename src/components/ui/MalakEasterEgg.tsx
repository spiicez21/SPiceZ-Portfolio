import { useState, useRef } from 'react';
import { X } from 'lucide-react';
import './MalakEasterEgg.css';

const MalakEasterEgg = () => {
    const [showPopup, setShowPopup] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    // Check if Malak Easter Egg is enabled
    const isEnabled = import.meta.env.VITE_MALAK === 'true' || import.meta.env.VITE_MALAK === true;

    const handleMiniClick = async () => {
        setShowPopup(true);

        // Play audio with error handling
        if (audioRef.current) {
            try {
                audioRef.current.currentTime = 0;
                await audioRef.current.play();
            } catch (error) {
                console.log('Audio playback failed:', error);
            }
        }

        // Auto-close after 2 seconds (audio duration)
        setTimeout(() => {
            setShowPopup(false);
        }, 2000);
    };

    const handleClose = () => {
        setShowPopup(false);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    };

    // Don't render if disabled
    if (!isEnabled) return null;

    return (
        <>
            {/* Small bouncing image behind footer */}
            <div className="malak-mini" onClick={handleMiniClick}>
                <img src="/Malak/malak-mini.png" alt="Malak" />
            </div>

            {/* Popup with large image */}
            {showPopup && (
                <div className="malak-popup-overlay" onClick={handleClose}>
                    <div className="malak-popup" onClick={(e) => e.stopPropagation()}>
                        <button className="malak-close" onClick={handleClose}>
                            <X size={24} />
                        </button>
                        <img src="/Malak/malak-show.png" alt="Malak" className="malak-show" />
                    </div>
                </div>
            )}

            {/* Hidden audio element */}
            <audio ref={audioRef} src="/Malak/Audio/daithambi.m4a" />
        </>
    );
};

export default MalakEasterEgg;
