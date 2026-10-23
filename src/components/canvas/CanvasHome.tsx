import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowRight, Github, Linkedin, Instagram, Coffee, FileText, Moon, Sun, Star, Check, Loader2 } from 'lucide-react';
import projects from '../../content/projects.json';
import techstack from '../../content/techstack.json';
import certifications from '../../content/certifications.json';
import graphics from '../../content/graphics.json';
import wip from '../../content/wip.json';
import contact from '../../content/contact.json';
import aboutData from '../../content/about.json';
import { useSmoothScroll } from '../../context/SmoothScrollContext';
import StickerStage from './StickerStage';
import SpotifyPlayer from './SpotifyPlayer';
import LitPortrait from './LitPortrait';
import { dishes, dockApps, footerDrivers, featuredCapabilities, interests, journey, partnerMarks, profileDetails, type InterestCard } from './canvasData';
import './canvas.css';

const GITHUB_USER = 'spiicez21';

// Ask Cloudinary for a sized, auto-format copy instead of the full original.
const cld = (url: string, width: number) =>
    url.includes('res.cloudinary.com') ? url.replace('/upload/', `/upload/w_${width},f_auto,q_auto/`) : url;

const readTheme = (): 'light' | 'dark' => {
    try {
        return localStorage.getItem('cv-theme') === 'dark' ? 'dark' : 'light';
    } catch {
        return 'light';
    }
};

const NAV = [
    { id: 'work', label: 'Work' },
    { id: 'interests', label: 'Interests' },
    { id: 'about', label: 'About' },
    { id: 'journey', label: 'Journey' },
    { id: 'contact', label: 'Contact' },
];

const SectionHead = ({ eyebrow, title, muted }: { eyebrow: string; title: string; muted: string }) => (
    <header className="cv-head">
        <p className="cv-eyebrow">{eyebrow}</p>
        <h2 className="cv-title">{title} <span>{muted}</span></h2>
    </header>
);

const CountUp = ({ to, suffix = '' }: { to: number; suffix?: string }) => {
    const ref = useRef<HTMLSpanElement>(null);
    const [value, setValue] = useState(0);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return;
            io.disconnect();
            const start = performance.now();
            const step = (now: number) => {
                const t = Math.min((now - start) / 1100, 1);
                setValue(Math.round(to * (1 - Math.pow(1 - t, 3))));
                if (t < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        }, { threshold: 0.6 });
        io.observe(el);
        return () => io.disconnect();
    }, [to]);

    return <span ref={ref}>{value}{suffix}</span>;
};

const Marquee = ({ items, reverse = false }: { items: string[]; reverse?: boolean }) => (
    <div className={`cv-marquee ${reverse ? 'cv-marquee--rev' : ''}`}>
        <div className="cv-marquee__track">
            {[0, 1].map((copy) => (
                <ul key={copy} aria-hidden={copy === 1}>
                    {items.map((item) => <li key={item}>{item}</li>)}
                </ul>
            ))}
        </div>
    </div>
);

/* ───────────────────────── Nav ───────────────────────── */

const CanvasNav = ({ theme, onToggle }: { theme: 'light' | 'dark'; onToggle: () => void }) => {
    const lenis = useSmoothScroll();
    const go = (id: string) => (e: React.MouseEvent) => {
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        if (lenis) lenis.scrollTo(target, { offset: -72 });
        else target.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <nav className="cv-nav" aria-label="Primary">
            <a className="cv-nav__logo" href="#hero" onClick={go('hero')} aria-label="Back to top">
                <img src="/brand/logo.svg" alt="SPiceZ" width="44" height="24" />
            </a>
            <ul>
                {NAV.map((n) => (
                    <li key={n.id}><a href={`#${n.id}`} onClick={go(n.id)}>{n.label}</a></li>
                ))}
            </ul>
            <button className="cv-nav__theme" type="button" onClick={onToggle} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
                {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
            </button>
        </nav>
    );
};

/* ───────────────────────── Hero ───────────────────────── */

const Hero = () => (
    <section className="cv-section cv-hero" id="hero">
        <div className="cv-hero__copy">
            <span className="cv-badge"><i /> Open to internships & freelance</span>
            <p className="cv-hero__hello">Vanakkam 🙏</p>
            <h1>
                I'm Yuga, a developer &amp; designer who <span>builds with everything I love.</span>
            </h1>
            <p className="cv-hero__sub">
                Yugabharathi J on paper, SPiceZ on the internet. Full-stack products, UI craft and the occasional
                F1-themed side quest, made in Erode, India.
            </p>
            <div className="cv-actions">
                <a className="cv-btn cv-btn--primary" href="#work">View my work <ArrowRight size={15} /></a>
                <a className="cv-btn" href="/resume.pdf" target="_blank" rel="noopener noreferrer">View résumé <ArrowUpRight size={15} /></a>
            </div>
        </div>
        <StickerStage />
    </section>
);

/* ───────────────────────── Work ───────────────────────── */

const featured = projects.find((p) => p.id === 'project-7')!;
const selected = projects.filter((p) => p.id !== featured.id && p.id !== 'project-1').reverse();

const projectLink = (p: (typeof projects)[number]) => {
    const links = p.links as Record<string, string | undefined>;
    return [links.demo, links.repo, links.pr].find((l) => l && l !== '#');
};

const Featured = () => (
    <section className="cv-section" id="work">
        <SectionHead eyebrow="Not bad, honestly" title="Featured" muted="Project" />
        <article className="cv-card cv-featured">
            <div className="cv-featured__media">
                <img src={cld(featured.thumbnailPublicId, 1200)} alt={`${featured.title} dashboard`} loading="lazy" />
            </div>
            <div className="cv-featured__body">
                <div className="cv-tags">
                    <span>{featured.subtitle.split('·')[1]?.trim() ?? 'R&D'}</span>
                    <span>AI Platform</span>
                    <span>{featured.role}</span>
                </div>
                <h3>Intelligent DCA Management Platform</h3>
                <p>{featured.description}</p>
                <div className="cv-stack">{featured.tech.map((t) => <span key={t}>{t}</span>)}</div>
            </div>
        </article>
        <div className="cv-caps">
            {featuredCapabilities.map((c, i) => (
                <div key={c.title} className="cv-card cv-cap">
                    <span className="cv-cap__n">0{i + 1}</span>
                    <h4>{c.title}</h4>
                    <p>{c.body}</p>
                </div>
            ))}
        </div>
    </section>
);

const Selected = () => {
    const [showAll, setShowAll] = useState(false);
    const list = showAll ? selected : selected.slice(0, 6);

    return (
        <section className="cv-section" id="projects">
            <SectionHead eyebrow="There's more" title="Selected" muted="Projects" />
            <div className="cv-grid2">
                {list.map((p) => {
                    const href = projectLink(p);
                    const Tag = href ? 'a' : 'div';
                    return (
                        <Tag key={p.id} className="cv-card cv-project" {...(href ? { href, target: '_blank', rel: 'noopener noreferrer' } : {})}>
                            <div className="cv-project__media">
                                <img src={cld(p.thumbnailPublicId, 800)} alt="" loading="lazy" decoding="async" />
                            </div>
                            <div className="cv-project__body">
                                <div className="cv-project__top">
                                    <h3>{p.title.trim()}</h3>
                                    {href && <ArrowUpRight size={16} className="cv-project__arrow" />}
                                </div>
                                <p>{p.subtitle}</p>
                                <div className="cv-tags">{p.tech.slice(0, 3).map((t) => <span key={t}>{t}</span>)}</div>
                            </div>
                        </Tag>
                    );
                })}
            </div>
            {selected.length > 6 && (
                <button type="button" className="cv-btn cv-more" onClick={() => setShowAll((v) => !v)}>
                    {showAll ? 'Show less' : `Show all ${selected.length}`}
                </button>
            )}
        </section>
    );
};

const Flex = () => (
    <section className="cv-section" id="flex">
        <SectionHead eyebrow="A recent flex" title="More Than" muted="Expected" />
        <div className="cv-card cv-flex">
            <div className="cv-flex__copy">
                <span className="cv-flex__trophy" aria-hidden="true">🏆</span>
                <h3>HackBuzz 2k25 · 1st Place</h3>
                <p>
                    ThinkForge started as a study planner and ended up winning the whole thing. It's an AI tutor that reads your
                    material and quizzes you with MCQs, running entirely on a local Ollama LLM. No API bills, no data leaving the laptop.
                </p>
                <a className="cv-link" href="https://github.com/Yugabharathi21/Think-Forge" target="_blank" rel="noopener noreferrer">See the repo <ArrowUpRight size={14} /></a>
            </div>
            <dl className="cv-stats">
                <div><dt>Projects shipped</dt><dd><CountUp to={projects.length} suffix="+" /></dd></div>
                <div><dt>Design pieces</dt><dd><CountUp to={graphics.length} /></dd></div>
                <div><dt>Certifications</dt><dd><CountUp to={certifications.length} /></dd></div>
                <div><dt>Hackathon rank</dt><dd>#<CountUp to={1} /></dd></div>
            </dl>
        </div>
    </section>
);

/* ───────────────────────── About ───────────────────────── */

const About = () => (
    <section className="cv-section" id="about">
        <SectionHead eyebrow="Obligatory introduction" title="A Bit" muted="About Me" />
        <div className="cv-about">
            <div className="cv-about__left">
                <div className="cv-card cv-about__photo">
                    <LitPortrait />
                    <span className="cv-sticky">hi, it's me →</span>
                </div>
                <a className="cv-card cv-about__open" href="#contact">
                    <span className="cv-badge__dot" />
                    <div><strong>Open to opportunities</strong><span>Internships, freelance & hackathon teams</span></div>
                    <ArrowRight size={15} />
                </a>
            </div>
            <div className="cv-about__right">
                <div className="cv-card cv-about__text">
                    {aboutData.paragraphs.map((p) => <p key={p}>{p}</p>)}
                </div>
                <dl className="cv-card cv-details">
                    {profileDetails.map((d) => (
                        <div key={d.label}><dt>{d.label}</dt><dd>{d.value}</dd></div>
                    ))}
                </dl>
            </div>
        </div>
        <div className="cv-card cv-dock-card">
            <p className="cv-eyebrow">Apps I live in</p>
            <ul className="cv-dock">
                {dockApps.map((app) => {
                    const icon = <img src={`/images/apps/${app.id}.webp`} alt="" loading="lazy" draggable={false} />;
                    return (
                        <li key={app.id}>
                            <span className="cv-dock__tip">{app.name} <em>{app.note}</em></span>
                            {app.href ? <a href={app.href} aria-label={app.name}>{icon}</a> : <span role="img" aria-label={app.name}>{icon}</span>}
                            {app.running && <i className="cv-dock__dot" aria-hidden="true" />}
                        </li>
                    );
                })}
            </ul>
        </div>
        <div className="cv-card cv-toolkit">
            <p className="cv-eyebrow">My toolkit</p>
            {techstack.categories.map((c) => (
                <div key={c.id} className="cv-toolkit__row">
                    <span>{c.label}</span>
                    <div className="cv-stack">{c.items.map((i) => <span key={i}>{i}</span>)}</div>
                </div>
            ))}
        </div>
    </section>
);

/* ───────────────────────── Interests ───────────────────────── */

const ChessBoard = () => {
    // A frozen Scholar's-mate-ish position, purely decorative.
    const pieces: Record<number, string> = { 4: '♚', 12: '♟', 21: '♞', 26: '♝', 37: '♕', 52: '♙', 60: '♔', 45: '♘' };
    return (
        <div className="cv-chess" aria-hidden="true">
            {Array.from({ length: 64 }, (_, i) => (
                <span key={i} className={(Math.floor(i / 8) + i) % 2 ? 'd' : ''}>{pieces[i]}</span>
            ))}
        </div>
    );
};

const F1Lights = () => (
    <div className="cv-lights" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => <span key={i} style={{ animationDelay: `${i * 0.35}s` }} />)}
    </div>
);

// Restaurant-menu take on the food card: hover a dish (or wait) to have it served.
const FoodMenu = () => {
    const [active, setActive] = useState(0);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const id = setInterval(() => setActive((i) => (i + 1) % dishes.length), 2600);
        return () => clearInterval(id);
    }, [paused]);

    const dish = dishes[active];
    return (
        <div className="cv-menu" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
            <ol className="cv-menu__list">
                {dishes.map((d, i) => (
                    <li key={d.id}>
                        <button type="button" className={i === active ? 'is-active' : ''} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setActive(i)}>
                            <span className="cv-menu__name">{d.name}</span>
                            <span className="cv-menu__dots" aria-hidden="true" />
                            <span className="cv-menu__spice" aria-label={`Spice ${d.spice} of 5`}>
                                {[1, 2, 3, 4, 5].map((n) => <i key={n} className={n <= d.spice ? 'on' : ''} />)}
                            </span>
                        </button>
                    </li>
                ))}
            </ol>
            <figure className="cv-menu__plate" aria-live="polite">
                <span className="cv-menu__badge">Now serving</span>
                <img key={dish.id} src={dish.src} alt={dish.name} loading="lazy" decoding="async" draggable={false} />
                <figcaption><strong>{dish.name}</strong><span>{dish.note}</span></figcaption>
            </figure>
        </div>
    );
};

const InterestExtra = ({ card }: { card: InterestCard }) => {
    switch (card.id) {
        case 'f1': return <F1Lights />;
        case 'music': return <SpotifyPlayer />;
        case 'chess': return <ChessBoard />;
        case 'food': return <FoodMenu />;
        case 'design':
            return (
                <div className="cv-mini-strip">
                    {graphics.slice(0, 8).map((g) => <img key={g.id} src={cld(g.imagePublicId, 220)} alt={g.title} loading="lazy" />)}
                </div>
            );
        default: return null;
    }
};

const Interests = () => (
    <section className="cv-section" id="interests">
        <SectionHead eyebrow="Outside of code" title="Things I'm" muted="Into" />
        <div className="cv-bento">
            {interests.map((card) => (
                <article key={card.id} className={`cv-card cv-interest ${card.span ? `cv-interest--${card.span}` : ''}`} style={{ '--cv-accent': card.accent } as React.CSSProperties}>
                    <p className="cv-interest__eyebrow"><i /> {card.eyebrow}</p>
                    <h3>{card.title}</h3>
                    <p className="cv-interest__body">{card.body}</p>
                    {card.link && <a className="cv-link" href={card.link.href} target="_blank" rel="noopener noreferrer">{card.link.label} {card.id === 'coffee' ? <Coffee size={14} /> : <ArrowUpRight size={14} />}</a>}
                    <InterestExtra card={card} />
                    {card.image && <img className="cv-interest__img" src={card.image} alt="" loading="lazy" />}
                </article>
            ))}
        </div>
        <Marquee items={graphics.map((g) => g.title).filter((t, i, a) => a.indexOf(t) === i).concat(['Lights out', 'For all time', 'Box box', 'Check mate'])} />
    </section>
);

/* ───────────────────────── Journey + Lab ───────────────────────── */

const Journey = () => (
    <section className="cv-section" id="journey">
        <SectionHead eyebrow="Somehow employed" title="My" muted="Journey" />
        <ol className="cv-timeline">
            {journey.map((j) => (
                <li key={j.title} className="cv-card">
                    <span className="cv-timeline__year">{j.year}</span>
                    <div>
                        <h3>{j.title}</h3>
                        <p className="cv-timeline__org">{j.org}</p>
                        <p>{j.body}</p>
                    </div>
                    <div className="cv-tags">{j.tags.map((t) => <span key={t}>{t}</span>)}</div>
                </li>
            ))}
        </ol>
    </section>
);

type Repo = { id: number; name: string; description: string | null; html_url: string; stargazers_count: number; language: string | null };

const Lab = () => {
    const [repos, setRepos] = useState<Repo[]>([]);
    useEffect(() => {
        fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=4`)
            .then((r) => (r.ok ? r.json() : []))
            .then((d) => setRepos(Array.isArray(d) ? d : []))
            .catch(() => setRepos([]));
    }, []);

    return (
        <section className="cv-section" id="lab">
            <SectionHead eyebrow="Currently cooking" title="In The" muted="Lab" />
            <div className="cv-grid2">
                {wip.map((w) => (
                    <div key={w.id} className="cv-card cv-wip">
                        <div className="cv-project__top"><h3>{w.title}</h3><span className="cv-wip__pct">{w.progress}%</span></div>
                        <p>{w.description}</p>
                        <div className="cv-wip__bar"><span style={{ width: `${w.progress}%` }} /></div>
                    </div>
                ))}
            </div>
            <div className="cv-card cv-gh">
                <div className="cv-project__top">
                    <p className="cv-eyebrow">github.com/{GITHUB_USER}</p>
                    <a className="cv-link" href={`https://github.com/${GITHUB_USER}`} target="_blank" rel="noopener noreferrer">Profile <ArrowUpRight size={14} /></a>
                </div>
                <div className="cv-gh__graph">
                    <img src={`https://ghchart.rshah.org/34a853/${GITHUB_USER}`} alt="GitHub contribution graph" loading="lazy" />
                </div>
                {repos.length > 0 && (
                    <ul className="cv-gh__repos">
                        {repos.map((r) => (
                            <li key={r.id}>
                                <a href={r.html_url} target="_blank" rel="noopener noreferrer">
                                    <strong>{r.name}</strong>
                                    <span>{r.language ?? 'Misc'} · <Star size={11} /> {r.stargazers_count}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="cv-certs">
                {certifications.map((c) => (
                    <a key={c.title} className="cv-card cv-cert" href={c.link.trim()} target="_blank" rel="noopener noreferrer">
                        <img src={cld(c.Badge, 160)} alt="" loading="lazy" />
                        <div><strong>{c.title}</strong><span>{c.issuer} · {c.date}</span></div>
                    </a>
                ))}
            </div>
        </section>
    );
};

/* ───────────────────────── Contact ───────────────────────── */

const Contact = () => {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        try {
            const res = await fetch('https://formspree.io/f/mbdaganb', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error(String(res.status));
            setStatus('success');
            setForm({ name: '', email: '', message: '' });
            setTimeout(() => setStatus('idle'), 3500);
        } catch {
            setStatus('error');
        }
    };

    const field = (name: keyof typeof form) => ({
        name,
        value: form[name],
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [name]: e.target.value }),
        required: true,
    });

    const icons: Record<string, React.ReactNode> = {
        github: <Github size={18} />, linkedin: <Linkedin size={18} />, instagram: <Instagram size={18} />, coffee: <Coffee size={18} />,
    };

    return (
        <>
            <section className="cv-section" id="contact">
                <SectionHead eyebrow="Might as well say hi" title="Let's Build" muted="Together" />
                <form className="cv-card cv-form" onSubmit={submit}>
                    <div className="cv-form__row">
                        <label>Name<input {...field('name')} placeholder="Tony Stark" autoComplete="name" /></label>
                        <label>Email<input {...field('email')} type="email" placeholder="tony@stark.com" autoComplete="email" /></label>
                    </div>
                    <label>Project / Message<textarea {...field('message')} rows={5} placeholder="Tell me what you're building (or which driver you support)…" /></label>
                    <div className="cv-form__foot">
                        <span className="cv-form__status" role="status">
                            {status === 'success' && <><Check size={14} /> Sent! I'll get back soon.</>}
                            {status === 'error' && 'Something broke. Try email instead?'}
                        </span>
                        <button className="cv-btn cv-btn--primary" type="submit" disabled={status === 'sending'}>
                            {status === 'sending' ? <><Loader2 size={15} className="cv-spin" /> Sending</> : <>Send message <ArrowRight size={15} /></>}
                        </button>
                    </div>
                </form>
            </section>
            <section className="cv-section" id="socials">
                <SectionHead eyebrow="Elsewhere on the internet" title="Find Me" muted="Online" />
                <div className="cv-socials">
                    {contact.socials.map((s) => (
                        <a key={s.platform} className="cv-card cv-social" href={s.url} target="_blank" rel="noopener noreferrer">
                            {icons[s.icon]}<span>{s.platform}</span><ArrowUpRight size={14} />
                        </a>
                    ))}
                    <a className="cv-card cv-social" href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                        <FileText size={18} /><span>Résumé</span><ArrowUpRight size={14} />
                    </a>
                </div>
                <a className="cv-mail" href={`mailto:${contact.email}`}><img src="/images/apps/gmail.webp" alt="" width="22" height="22" /> {contact.email}</a>
            </section>
        </>
    );
};

/* ───────────────────────── Page ───────────────────────── */

const CanvasHome = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>(readTheme);

    useEffect(() => {
        try {
            localStorage.setItem('cv-theme', theme);
        } catch {
            /* storage blocked: theme just won't persist */
        }
    }, [theme]);

    return (
        <div className="cv" data-theme={theme}>
            <div className="cv-rail cv-rail--l" aria-hidden="true" />
            <div className="cv-rail cv-rail--r" aria-hidden="true" />
            <CanvasNav theme={theme} onToggle={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))} />
            <main>
                <Hero />
                <Marquee items={partnerMarks} />
                <Featured />
                <Selected />
                <Flex />
                <About />
                <Interests />
                <Journey />
                <Lab />
                <Contact />
            </main>
            <footer className="cv-footer">
                <div className="cv-footer__sign">
                    <ul className="cv-footer__lineup">
                        {footerDrivers.map((d) => (
                            <li key={d.src}><img src={d.src} alt={d.alt} height="52" loading="lazy" decoding="async" draggable={false} /></li>
                        ))}
                    </ul>
                    <p>© {new Date().getFullYear()} Yugabharathi J · SPiceZ. Designed & built with too many tabs open.</p>
                </div>
            </footer>
        </div>
    );
};

export default CanvasHome;
