import { useState, useRef } from 'react';
import AsciiRain from '../ui/AsciiRain';
import SectionFrame from '../ui/SectionFrame';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Send, Check, AlertTriangle, Loader2 } from 'lucide-react';


import './OpenTicket.css';
gsap.registerPlugin(ScrollTrigger);

const OpenTicket = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });

        tl.from(".ticket-header-line", {
            width: 0,
            duration: 0.8,
            ease: "expo.inOut"
        });

    }, { scope: containerRef });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');

        try {
            const response = await fetch('/.netlify/functions/contact-discord', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', message: '' });
                setTimeout(() => setStatus('idle'), 3000);
            } else {
                if (response.status === 404) {
                    alert("⚠️ Developer Note: This feature uses Netlify Functions.\nIt will not work on 'localhost' unless you run 'netlify dev'.");
                }
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
            label="OPEN A TICKET"
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
                            <span className="ticket-id">NEW TICKET // #001</span>
                            <div className="ticket-header-line"></div>
                            <span className="ticket-status">STATUS: STANDBY</span>
                        </div>

                        <form onSubmit={handleSubmit} className="ticket-form">
                            <div className="form-field">
                                <label htmlFor="name">AGENT NAME</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="ENTER NAME"
                                />
                            </div>
                            <div className="form-field">
                                <label htmlFor="email">RETURN FREQUENCY</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="ENTER EMAIL"
                                />
                            </div>

                            <div className="form-field">
                                <label htmlFor="message">TRANSMISSION DATA</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={4}
                                    placeholder="ENTER MESSAGE CONTENT..."
                                />
                            </div>

                            <button
                                type="submit"
                                className={`ticket-submit ${status}`}
                                disabled={status === 'sending' || status === 'success'}
                            >
                                <span className="btn-content">
                                    {status === 'sending' && <><Loader2 className="spin" size={16} /> TRANSMITTING</>}
                                    {status === 'success' && <><Check size={16} /> SENT CONFIRMED</>}
                                    {status === 'error' && <><AlertTriangle size={16} /> FAILED</>}
                                    {status === 'idle' && <><Send size={16} /> SEND TICKET</>}
                                </span>
                                <div className="btn-glitch"></div>
                            </button>
                        </form>
                    </div>

                    {/* Column 2: Matrix Rain */}
                    <div className="matrix-container">
                        <div className="matrix-overlay">
                            <span className="matrix-label">ENCRYPTION: ACTIVE</span>
                        </div>
                        <AsciiRain />
                    </div>

                </div>

            </div>
        </SectionFrame>
    );
};

export default OpenTicket;
