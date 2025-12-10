import { useState } from 'react';
import './CMS.css';

const CMS = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const adminPassword = import.meta.env.VITE_CMS_KEY || 'admin123';
        if (password === adminPassword) {
            setIsAuthenticated(true);
        } else {
            alert('Wrong password!');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="cms-login">
                <div className="login-box">
                    <h1 className="login-title">CMS ACCESS</h1>
                    <form onSubmit={handleLogin} className="login-form">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter Admin Key"
                            className="login-input"
                        />
                        <button type="submit" className="login-button">
                            AUTHENTICATE
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="cms-dashboard">
            <div className="cms-header">
                <h1 className="cms-title">[CMS] Portfolio Management System</h1>
                <a href="/" className="cms-back-link">← Back to Portfolio</a>
            </div>

            <div className="cms-content">
                <div className="cms-info">
                    <h2>Content Management</h2>
                    <p>
                        This is a placeholder CMS dashboard. In a full implementation, you would be able to:
                    </p>
                    <ul>
                        <li>Edit projects, graphics, and other content</li>
                        <li>Upload images to Cloudinary</li>
                        <li>Manage tech stack and certifications</li>
                        <li>Update contact information</li>
                    </ul>
                    <p className="cms-note">
                        Note: For local development, edit the JSON files in <code>/src/content/</code> directly.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CMS;
