import { useRef } from 'react';
import SectionFrame from '../ui/SectionFrame';
import certificationsData from '../../content/certifications.json';
import { ExternalLink } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import './VerifiedCredentials.css';


gsap.registerPlugin(ScrollTrigger);

const VerifiedCredentials = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const cards = gsap.utils.toArray<HTMLElement>('.cert-item');

    // Single timeline for all cards in the section
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    });

    tl.fromTo(cards,
      {
        clipPath: 'polygon(0% 50%, 100% 50%, 100% 50%, 0% 50%)',
        autoAlpha: 0,
      },
      {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        autoAlpha: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        force3D: true
      }
    );
  }, { scope: containerRef });

  return (
    <SectionFrame
      id="verified-credentials"
      label="VERIFIED CREDENTIALS"
      number="07"
    >
      <div ref={containerRef} className="certifications-list">
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
      </div>
    </SectionFrame>
  );
};

export default VerifiedCredentials;
