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

    // HOLOGRAM PROJECTION - Scan line build-up
    cards.forEach((card, index) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      });

      tl.fromTo(card,
        {
          clipPath: 'polygon(0% 50%, 100% 50%, 100% 50%, 0% 50%)',
          opacity: 0,
          filter: 'brightness(2) blur(3px)',
        },
        {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          opacity: 1,
          filter: 'brightness(1) blur(0px)',
          duration: 1.2,
          delay: index * 0.08,
          ease: 'power2.out',
        }
      )
        .to(card, { opacity: 0.8, duration: 0.05 }, '<0.5')
        .to(card, { opacity: 1, duration: 0.05 });
    });
  }, { scope: containerRef });

  return (
    <SectionFrame id="verified-credentials" label="VERIFIED CREDENTIALS" number="07">
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
