import { useEffect, useState, useRef } from 'react';
import { gsap } from '../lib/animations/gsapClient';
import './BootLoader.css';

interface LoadingState {
    stage: string;
    progress: number;
    status: 'loading' | 'complete' | 'error';
}

const bootMessages = [
    '> Calibrating neural networks...',
    '> Downloading more RAM...',
    '> Brewing coffee.exe...',
    '> Summoning async functions...',
    '> Git pulling creativity...',
    '> npm install hackathon-wins...',
    '> Compiling procrastination.css...',
    '> Initializing retro vibes...',
];

const stages = [
    { name: 'INITIALIZING SYSTEM...', progress: 20 },
    { name: 'LOADING DEPENDENCIES...', progress: 40 },
    { name: 'FETCHING ASSETS...', progress: 70 },
    { name: 'COMPILING UI COMPONENTS...', progress: 90 },
    { name: 'READY TO DEPLOY', progress: 100 },
];

interface BootLoaderProps {
    onComplete: () => void;
}

const BootLoader = ({ onComplete }: BootLoaderProps) => {
    const [loadingState, setLoadingState] = useState<LoadingState>({
        stage: stages[0].name,
        progress: 0,
        status: 'loading',
    });
    const [messages, setMessages] = useState<string[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let currentStage = 0;
        let messageIndex = 0;

        // Add messages progressively
        const messageInterval = setInterval(() => {
            if (messageIndex < bootMessages.length) {
                const randomMessage = bootMessages[Math.floor(Math.random() * bootMessages.length)];
                setMessages(prev => [...prev, randomMessage]);
                messageIndex++;
            }
        }, 400);

        // Progress through stages
        const stageInterval = setInterval(() => {
            if (currentStage < stages.length) {
                setLoadingState({
                    stage: stages[currentStage].name,
                    progress: stages[currentStage].progress,
                    status: currentStage === stages.length - 1 ? 'complete' : 'loading',
                });
                currentStage++;
            } else {
                clearInterval(stageInterval);
                clearInterval(messageInterval);

                // Completion animation
                setTimeout(() => {
                    if (containerRef.current) {
                        gsap.to(containerRef.current, {
                            opacity: 0,
                            duration: 0.5,
                            onComplete: () => {
                                onComplete();
                                sessionStorage.setItem('portfolio_visited', 'true');
                            },
                        });
                    }
                }, 500);
            }
        }, 800);

        return () => {
            clearInterval(messageInterval);
            clearInterval(stageInterval);
        };
    }, [onComplete]);

    const progressBarFill = `${loadingState.progress}%`;
    const progressChars = '█'.repeat(Math.floor(loadingState.progress / 10)) +
        '░'.repeat(10 - Math.floor(loadingState.progress / 10));

    return (
        <div ref={containerRef} className="boot-loader">
            <div className="boot-container">
                <div className="boot-header">
                    <div className="boot-title">INITIALIZING SPiceZ.PORTFOLIO v2.0.25</div>
                </div>

                <div className="boot-content">
                    <div className="boot-messages">
                        {messages.slice(-5).map((msg, idx) => (
                            <div key={idx} className="boot-message">
                                {msg}
                            </div>
                        ))}
                    </div>

                    <div className="boot-progress">
                        <div className="progress-label">
                            {'>'} Loading assets... [{progressChars}] {loadingState.progress}%
                        </div>
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: progressBarFill }}
                            />
                        </div>
                    </div>

                    <div className="boot-status">
                        STATUS: {loadingState.stage}
                    </div>
                </div>
            </div>

            <div className="scanline" />
        </div>
    );
};

export default BootLoader;
