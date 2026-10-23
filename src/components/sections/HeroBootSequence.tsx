import aboutData from '../../content/about.json';
import SpotifyBadge from '../ui/SpotifyBadge';
import './HeroBootSequence.css';

const HeroBootSequence = () => (
        <section className="intro-hero" id="boot-sequence" aria-labelledby="hero-title">
            <div className="intro-hero__topline"><span>YUGABHARATHI J</span><span>DEVELOPER · DESIGNER · BUILDER</span></div>
            <div className="intro-hero__main">
                <div className="intro-hero__visual" aria-label="A collage of Yugabharathi's creative work and interests">
                    <span className="intro-hero__board-note">CURRENTLY IN 27 TABS <i aria-hidden="true">✳</i> MUSIC · RACE WEEK · SIDE QUESTS</span>
                    <div className="intro-hero__portrait">
                        <img src="/images/portrait/yuga.webp" alt="Yugabharathi outdoors at dusk" fetchPriority="high" />
                    </div>
                    <img className="intro-hero__sticker intro-hero__sticker--music" src="/images/stickers/cassette.webp" alt="Retro headphones and cassette player" />
                    <img className="intro-hero__sticker intro-hero__sticker--racing" src="/images/stickers/f1-car.webp" alt="Red open-wheel racing car with a checkered flag" />
                    <img className="intro-hero__sticker intro-hero__sticker--game" src="/images/stickers/retro-console.webp" alt="Translucent purple handheld game console" />
                    <img className="intro-hero__sticker intro-hero__sticker--computer" src="/images/stickers/retro-computer.webp" alt="Vintage computer with a glowing code cursor" />
                </div>
                <div className="intro-hero__copy">
                    <p className="intro-hero__eyebrow"><span /> DEVELOPER · DESIGNER · PROFESSIONAL TAB COLLECTOR</p>
                    <h1 id="hero-title">I build with<br /><em>everything I love.</em></h1>
                    <p className="intro-hero__summary">{aboutData.intro} {aboutData.paragraphs[0]}</p>
                    <div className="intro-hero__actions">
                        <a className="intro-hero__button" href="#projects">Explore my work <span aria-hidden="true">↘</span></a>
                        <a className="intro-hero__text-link" href="/resume.pdf" target="_blank" rel="noopener noreferrer">View résumé ↗</a>
                    </div>
                    <div className="intro-hero__services"><span>UI / UX DESIGN</span><span>FULL STACK DEVELOPMENT</span><span>CREATIVE ASSETS</span></div>
                    <div className="intro-hero__music"><SpotifyBadge /></div>
                </div>
            </div>
            <div className="intro-hero__bottomline"><span>SCROLL TO DISCOVER</span><span className="intro-hero__scroll-mark">↓</span><span>SCROLL TO DISCOVER</span></div>
        </section>
);

export const AboutEditorial = () => (
    <section className="about-editorial" id="whoami" aria-labelledby="about-title">
        <div className="about-editorial__label"><span>03</span><span>A LITTLE ABOUT ME</span></div>
            <div className="about-editorial__body">
                <div><p className="about-editorial__kicker">CURIOUS BY NATURE. INTENTIONAL BY DESIGN.</p><h2 id="about-title">Engineering meets<br /><em>creative instinct.</em></h2><p className="about-editorial__location">Based in {aboutData.stats.location}</p></div>
                <div className="about-editorial__copy">{aboutData.paragraphs.slice(1).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
            </div>
    </section>
);

export default HeroBootSequence;
