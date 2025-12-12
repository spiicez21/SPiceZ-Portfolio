import { useState } from 'react';
import SectionFrame from '../ui/SectionFrame';
import AnimateIn from '../utils/AnimateIn';
import Magnetic from '../utils/Magnetic';
import InkButton from '../ui/InkButton';
import contactData from '../../content/contact.json';
import { Github, Linkedin, Twitter, Instagram, Mail, Coffee } from 'lucide-react';
import './OpenTicket.css';

const OpenTicket = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

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
                // Reset success status after 3 seconds
                setTimeout(() => setStatus('idle'), 3000);
            } else {
                console.error('Server responded with:', response.status);
                if (response.status === 404) {
                    alert("⚠️ Developer Note: This feature uses Netlify Functions.\nIt will not work on 'localhost' unless you run 'netlify dev'.\nPlease deploy to test!");
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

    const getIcon = (platform: string) => {
        switch (platform.toLowerCase()) {
            case 'github':
                return <Github size={24} />;
            case 'linkedin':
                return <Linkedin size={24} />;
            case 'twitter':
                return <Twitter size={24} />;
            case 'instagram':
                return <Instagram size={24} />;
            case 'buy me a coffee':
                return <Coffee size={24} />;
            default:
                return <Mail size={24} />;
        }
    };

    return (
        <SectionFrame id="open-ticket" label="OPEN A TICKET" number="09">
            <div className="contact-content">
                <AnimateIn className="contact-left" animation="slide-right" duration={0.8} threshold={0.2}>
                    <h3 className="contact-heading">Let's Connect</h3>
                    <p className="contact-description">
                        Got a project in mind? Want to collaborate? Or just want to say hi?
                        Drop me a message and I'll get back to you as soon as possible.
                    </p>

                    <div className="resume-download">
                        <InkButton href="/Resume/Resume.pdf" variant="primary">
                            Download Resume
                        </InkButton>
                    </div>

                    <div className="social-links">
                        {contactData.socials.map((social, idx) => (
                            <Magnetic key={idx} strength={0.4}>
                                <a
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-link"
                                    aria-label={social.platform}
                                >
                                    {getIcon(social.platform)}
                                    <span>{social.platform}</span>
                                </a>
                            </Magnetic>
                        ))}
                    </div>

                    <div className="email-box">
                        <Mail size={20} />
                        <a href={`mailto:${contactData.email}`}>{contactData.email}</a>
                    </div>
                </AnimateIn>

                <AnimateIn className="contact-right" animation="slide-left" delay={0.2} duration={0.8} threshold={0.2}>
                    <form
                        onSubmit={handleSubmit}
                        className="contact-form"
                    >
                        <div className="form-group">
                            <label htmlFor="name">NAME</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="form-input"
                                placeholder="John Doe"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">EMAIL</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="form-input"
                                placeholder="john@example.com"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="message">MESSAGE</label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows={6}
                                className="form-textarea"
                                placeholder="Project details or just a hello..."
                            />
                        </div>

                        <InkButton variant="primary" disabled={status === 'sending'}>
                            {status === 'sending' ? 'Transmitting...' :
                                status === 'success' ? 'Packet Sent! ✓' :
                                    status === 'error' ? 'Transmission Failed ⚠️' :
                                        'Send Packet →'}
                        </InkButton>
                    </form>
                </AnimateIn>
            </div>
        </SectionFrame>
    );
};

export default OpenTicket;
