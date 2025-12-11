import SectionFrame from '../ui/SectionFrame';
import AnimateIn from '../utils/AnimateIn';
import certificationsData from '../../content/certifications.json';
import { ExternalLink } from 'lucide-react';
import './VerifiedCredentials.css';

const VerifiedCredentials = () => {
  return (
    <SectionFrame id="verified-credentials" label="VERIFIED CREDENTIALS" number="07">
      <AnimateIn className="certifications-list" animation="slide-right" stagger={0.1} duration={0.6}>
        {certificationsData.map((cert, index) => (
          <div key={cert.id} className="cert-item">
            <div className="cert-number">{String(index + 1).padStart(2, '0')}</div>
            {(cert as any).Badge && (
              <div className="cert-badge-wrapper">
                <img src={(cert as any).Badge} alt={cert.title} className="cert-badge" loading="lazy" />
              </div>
            )}
            <div className="cert-content">
              <h3 className="cert-title">{cert.title}</h3>
              <div className="cert-meta">
                <span className="cert-issuer">{cert.issuer}</span>
                <span className="cert-divider">•</span>
                <span className="cert-date">{cert.date}</span>
              </div>
            </div>
            {cert.link && cert.link !== '#' && (
              <a
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                className="cert-link"
                aria-label="View certificate"
              >
                <span className="cert-link-text">View</span>
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        ))}
      </AnimateIn>
    </SectionFrame>
  );
};

export default VerifiedCredentials;
