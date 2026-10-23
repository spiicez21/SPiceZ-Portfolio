import { useState, useRef, lazy } from 'react';
import LazyMount from '../utils/LazyMount';
import SectionFrame from '../ui/SectionFrame';

// three.js + @react-three/fiber + drei is ~1MB of JS. Keep it out of this
// section's chunk and only fetch it when the viewport reaches the model.
const FunkoModel = lazy(() => import('../ui/FunkoModel'));
import { Send, Check, AlertTriangle, Loader2 } from 'lucide-react';


import './OpenTicket.css';

const OpenTicket = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    // Simplified: Removed GSAP ScrollTrigger for minor line animation

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');

        try {
            const response = await fetch('https://formspree.io/f/mbdaganb', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', message: '' });
                setTimeout(() => setStatus('idle'), 3000);
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Submission error:', error);
            setStatus('error');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <SectionFrame
            id="open-ticket"
            label="SAY HELLO"
            number="09"
        >
            <div ref={containerRef} className="ticket-layout">

                {/* Left: Quick Connect */}
                {/* Left: Quick Connect Removed */}

                {/* Right: The Ticket Interface */}

                {/* Right: The Ticket Interface */}
                <div className="ticket-interface-row">

                    {/* Column 1: Format */}
                    <div className="ticket-system">
                        <div className="ticket-header">
                            <span className="ticket-id">A NOTE FROM YOU</span>
                            <div className="ticket-header-line"></div>
                            <span className="ticket-status">I’M ALL EARS</span>
                        </div>

                        <form onSubmit={handleSubmit} className="ticket-form">
                            <div className="form-field">
                                    <label htmlFor="name">YOUR NAME</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="What should I call you?"
                                />
                            </div>
                            <div className="form-field">
                                    <label htmlFor="email">YOUR EMAIL</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div className="form-field">
                                    <label htmlFor="message">WHAT’S ON YOUR MIND?</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={4}
                                    placeholder="Tell me a little about it…"
                                />
                            </div>

                            <button
                                type="submit"
                                className={`ticket-submit ${status}`}
                                disabled={status === 'sending' || status === 'success'}
                            >
                                <span className="btn-content">
                                    {status === 'sending' && <><Loader2 className="spin" size={16} /> SENDING</>}
                                    {status === 'success' && <><Check size={16} /> MESSAGE SENT</>}
                                    {status === 'error' && <><AlertTriangle size={16} /> TRY AGAIN</>}
                                    {status === 'idle' && <><Send size={16} /> SEND MESSAGE</>}
                                </span>
                                <div className="btn-glitch"></div>
                            </button>
                        </form>
                    </div>

                    {/* Column 2: 3D Model Viewer */}
                    <div className="matrix-container" style={{ padding: 0, background: 'transparent', boxShadow: 'none' }}>
                        <LazyMount minHeight="30rem" margin={250}>
                            <FunkoModel />
                        </LazyMount>
                    </div>

                </div>

            </div>
        </SectionFrame>
    );
};

export default OpenTicket;
