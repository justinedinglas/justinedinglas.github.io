import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";

/* ── THEME ── */
const ThemeCtx = createContext();
function useTheme() { return useContext(ThemeCtx); }
const themes = {
  light: { bg: "#FAF5F0", bgAlt: "#F3EDE6", text: "#2A2025", textMuted: "#6B5E64", accent: "#7B2D3F", accentMuted: "rgba(123,45,63,0.06)", border: "rgba(42,32,37,0.1)", navBg: "rgba(250,245,240,0.88)", selBg: "#7B2D3F", selColor: "#FAF5F0", glow1: "rgba(123,45,63,0.08)", glow2: "rgba(200,160,170,0.12)" },
  dark: { bg: "#1A1214", bgAlt: "#1F171A", text: "#F2EBE5", textMuted: "#8A7E82", accent: "#C4647A", accentMuted: "rgba(196,100,122,0.12)", border: "rgba(242,235,229,0.08)", navBg: "rgba(26,18,20,0.85)", selBg: "#C4647A", selColor: "#1A1214", glow1: "rgba(196,100,122,0.15)", glow2: "rgba(160,80,120,0.08)" },
};

/* ── REVEAL ── */
function useReveal(th = 0.1) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.unobserve(el); } }, { threshold: th });
    obs.observe(el);
    return () => obs.disconnect();
  }, [th]);
  return [ref, v];
}
function Reveal({ children, delay = 0, style = {} }) {
  const [ref, v] = useReveal();
  return <div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(22px)", transition: `opacity 0.7s cubic-bezier(0.4,0,0.2,1) ${delay}s, transform 0.7s cubic-bezier(0.4,0,0.2,1) ${delay}s`, ...style }}>{children}</div>;
}

/* ── THEME TOGGLE ── */
function ThemeToggle() {
  const { mode, toggle } = useTheme();
  return (
    <button onClick={toggle} aria-label="Toggle theme" style={{
      background: "none", border: "1px solid var(--border)", borderRadius: 100, cursor: "pointer",
      padding: "0.35rem 0.7rem", display: "flex", alignItems: "center", gap: "0.35rem",
      fontFamily: "var(--font-accent)", fontSize: "0.6rem", letterSpacing: "0.08em",
      textTransform: "uppercase", color: "var(--text-muted)", transition: "border-color 0.3s, color 0.3s",
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; }}
    >
      {mode === "dark" ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      )}
      {mode === "dark" ? "Light" : "Dark"}
    </button>
  );
}

/* ── ROLE ROTATOR ── */
function RoleRotator() {
  const roles = ["product thinker", "UX researcher", "web developer", "storyteller", "movie enthusiast", "community builder", "foodie"];
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => { setIdx(i => (i + 1) % roles.length); setFade(true); }, 300);
    }, 2500);
    return () => clearInterval(interval);
  }, []);
  return (
    <span style={{
      color: "var(--accent)", display: "inline-block", minWidth: 280,
      opacity: fade ? 1 : 0, transform: fade ? "translateY(0)" : "translateY(8px)",
      transition: "opacity 0.3s ease, transform 0.3s ease",
    }}>{roles[idx]}</span>
  );
}

/* ── TOP NAV (desktop) ── */
function TopNav({ current, onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const links = [
    { id: "home", label: "Home" },
    { id: "work", label: "Work" },
    { id: "resume", label: "Resume" },
    { id: "contact", label: "Contact" },
  ];
  return (
    <nav className="nav-desktop-bar" style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: scrolled ? "0.8rem 3rem" : "1.2rem 3rem",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      background: scrolled ? "var(--navBg)" : "transparent",
      backdropFilter: scrolled ? "blur(18px)" : "none",
      WebkitBackdropFilter: scrolled ? "blur(18px)" : "none",
      borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
    }}>
      <button onClick={() => onNavigate("home")} style={{
        background: "none", border: "none", cursor: "pointer",
        fontFamily: "var(--font-display)", fontSize: "1.05rem", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em",
      }}>Justine Dinglas<span style={{ color: "var(--accent)" }}>.</span></button>
      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        {links.map(l => (
          <button key={l.id} onClick={() => onNavigate(l.id)} style={{
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "var(--font-accent)", fontSize: "0.72rem", fontWeight: 500,
            letterSpacing: "0.08em", textTransform: "uppercase",
            color: current === l.id ? "var(--accent)" : "var(--text-muted)", transition: "color 0.3s",
          }}
            onMouseEnter={e => e.target.style.color = current === l.id ? "var(--accent)" : "var(--text)"}
            onMouseLeave={e => e.target.style.color = current === l.id ? "var(--accent)" : "var(--text-muted)"}
          >{l.label}</button>
        ))}
        <div style={{ width: 1, height: 16, background: "var(--border)" }} />
        <ThemeToggle />
      </div>
    </nav>
  );
}

/* ── MOBILE NAV ── */
function MobileNav({ current, onNavigate }) {
  const [open, setOpen] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const links = [
    { id: "home", label: "Home" },
    { id: "work", label: "Work" },
    { id: "resume", label: "Resume" },
    { id: "contact", label: "Contact" },
  ];
  const go = (id) => { setFadeIn(false); setTimeout(() => { setOpen(false); onNavigate(id); }, 400); };
  const toggleOpen = () => {
    if (open) { setFadeIn(false); setTimeout(() => setOpen(false), 400); }
    else { setOpen(true); requestAnimationFrame(() => requestAnimationFrame(() => setFadeIn(true))); }
  };
  return (
    <>
      <div className="mobile-nav-bar" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 101,
        padding: "1rem 1.5rem", display: "none", justifyContent: "space-between", alignItems: "center",
        background: open ? "transparent" : "var(--navBg)",
        backdropFilter: open ? "none" : "blur(18px)",
        borderBottom: open ? "none" : "1px solid var(--border)",
        transition: "background 0.4s, border-color 0.4s, backdrop-filter 0.4s",
      }}>
        <button onClick={() => go("home")} style={{
          background: "none", border: "none", cursor: "pointer",
          fontFamily: "var(--font-display)", fontSize: "1.05rem", fontWeight: 700,
          color: open ? "#F2EBE5" : "var(--text)", transition: "color 0.4s",
        }}>Justine Dinglas<span style={{ color: "var(--accent)" }}>.</span></button>
        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
          {!open && <ThemeToggle />}
          <button onClick={toggleOpen} style={{
            background: "none", border: "none", cursor: "pointer",
            padding: "0.5rem", width: 32, height: 32,
            position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ position: "absolute", width: 22, height: 14 }}>
              <span style={{ position: "absolute", left: 0, width: 22, height: 1.5, borderRadius: 2, background: open ? "#F2EBE5" : "var(--text)", top: open ? 6 : 0, transform: open ? "rotate(45deg)" : "rotate(0)", transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)" }} />
              <span style={{ position: "absolute", left: 0, top: 6, width: 22, height: 1.5, borderRadius: 2, background: open ? "#F2EBE5" : "var(--text)", opacity: open ? 0 : 1, transition: "opacity 0.3s ease" }} />
              <span style={{ position: "absolute", left: 0, width: 22, height: 1.5, borderRadius: 2, background: open ? "#F2EBE5" : "var(--text)", top: open ? 6 : 12, transform: open ? "rotate(-45deg)" : "rotate(0)", transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)" }} />
            </div>
          </button>
        </div>
      </div>
      {open && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 100,
          background: "#1A1214",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2.5rem",
          opacity: fadeIn ? 1 : 0, transition: "opacity 0.4s ease",
        }}>
          {links.map((l, i) => (
            <button key={l.id} onClick={() => go(l.id)} style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "var(--font-display)", fontSize: "2.2rem", fontWeight: 700,
              color: current === l.id ? "var(--accent)" : "#F2EBE5",
              opacity: fadeIn ? 1 : 0, transform: fadeIn ? "translateY(0)" : "translateY(20px)",
              transition: `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s, color 0.3s`,
              letterSpacing: "-0.01em",
            }}>{l.label}</button>
          ))}
        </div>
      )}
    </>
  );
}

/* ── SCROLL INDICATOR ── */
function ScrollIndicator() {
  const [opacity, setOpacity] = useState(1);
  useEffect(() => {
    const h = () => setOpacity(Math.max(0, 1 - window.scrollY / 300));
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <div style={{
      position: "absolute", bottom: "2rem", left: "50%",
      display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem",
      opacity: opacity, transform: `translateX(-50%) translateY(${(1 - opacity) * 10}px)`,
      transition: "opacity 0.15s ease, transform 0.15s ease", pointerEvents: "none",
      animation: opacity > 0.1 ? "scrollBounce 2s ease-in-out infinite" : "none",
    }}>
      <div style={{ fontFamily: "var(--font-accent)", fontSize: "0.58rem", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Scroll</div>
      <svg width="14" height="8" viewBox="0 0 14 8" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 1 7 7 13 1"/></svg>
    </div>
  );
}

/* ── HOME ── */
function HomePage() {
  return (
    <div>
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 0 4rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "relative", zIndex: 1 }}>
          <Reveal>
            <div style={{ fontFamily: "var(--font-accent)", fontSize: "0.72rem", color: "var(--accent)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "1.5rem", fontWeight: 600 }}>
              CSULB '26 in Computer Science · Web Dev · UX Research
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(2.4rem, 6vw, 4.5rem)", lineHeight: 1.1, letterSpacing: "-0.03em", color: "var(--text)", marginBottom: "1.8rem", maxWidth: 750 }}>
              Hi! I'm Justine —<br /><RoleRotator />
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p style={{ fontSize: "1.08rem", color: "var(--text-muted)", maxWidth: 480, lineHeight: 1.75 }}>
              Blending product thinking and software development with creative storytelling.
            </p>
          </Reveal>
        </div>
        <ScrollIndicator />
      </section>

      {/* About */}
      <section style={{ padding: "6rem 0", borderTop: "1px solid var(--border)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: "4rem", alignItems: "start" }} className="responsive-grid">
          <Reveal>
            <div>
              <div style={{ aspectRatio: "3/4", borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)",}}>
              <img src="/justine.jpg" alt="Justine Dinglas" style={{ width: "100%", height: "100%", objectFit: "cover",}} />
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(1.8rem, 3vw, 2.4rem)", lineHeight: 1.15, marginBottom: "1.5rem", color: "var(--text)" }}>Justine Alexa Dinglas</h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.98rem", lineHeight: 1.8, marginBottom: "1.2rem" }}>
                Computer Science student at California State University, Long Beach (graduating December 2026) working across product management, UX research, and front-end development — always where technology meets creative expression.
              </p>
              <p style={{ color: "var(--text-muted)", fontSize: "0.98rem", lineHeight: 1.8 }}>
                Growing up immersed in music, film, and theater taught me that great experiences are intentional, emotional, and human-centered. My goal is to bridge the gap between technical craft and creative expression in everything I ship.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* What I Do */}
      <section style={{ padding: "6rem 0", borderTop: "1px solid var(--border)" }}>
        <Reveal><div style={{ fontFamily: "var(--font-accent)", fontSize: "0.7rem", color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "3rem", fontWeight: 600 }}>What I Do</div></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }} className="responsive-three-col">
          {[
            { title: "Product Management", desc: "Defining product direction through PRDs, prioritization frameworks, and a sharp focus on user needs." },
            { title: "UX Research", desc: "User research grounded in interviews, persona development, journey mapping, and real data." },
            { title: "Web Development", desc: "Front-end development grounded in HTML/CSS, React, and JavaScript." },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 0.08}>
              <div style={{ padding: "2rem 0", borderTop: "1px solid var(--border)" }}>
                <div style={{ fontFamily: "var(--font-accent)", fontSize: "0.63rem", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.4rem" }}>0{i + 1}</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.2rem", marginBottom: "0.8rem", color: "var(--text)" }}>{item.title}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Interests */}
      <section style={{ padding: "6rem 0", borderTop: "1px solid var(--border)" }}>
        <Reveal><div style={{ fontFamily: "var(--font-accent)", fontSize: "0.7rem", color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "3rem", fontWeight: 600 }}>Beyond Tech</div></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }} className="responsive-three-col">
          {["Musical Theatre", "Filipino Culture, History, & Community", "Creative Writing", "Films", "Concerts & Festivals", "Food"].map((item, i) => (
            <Reveal key={item} delay={i * 0.05}>
              <div style={{ padding: "1.2rem 1.4rem", borderRadius: 8, border: "1px solid var(--border)", transition: "border-color 0.3s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
              ><span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>{item}</span></div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ── WORK ── */
function WorkPage({ onNavigate }) {
  const projects = [
    { num: "01", tags: "Product Management · UX Research · Senior Capstone", title: "sip'd — Cafe Discovery App", challenge: "Cafe enthusiasts struggle to find cafes matching their study/social needs", approach: "User interviews + persona development + iterative UX flows", outcome: "Community-first cafe discovery app with warm brand identity", techs: ["UX Research", "Project Management", "Figma", "React", "Node.js", "Team Lead"], image: "/sipd.jpg", gradient: "linear-gradient(135deg, #2D5A3D, #4A8C5E)", caseStudy: "case-sipd" },
    { num: "02", tags: "Product Management · UX Research · Externship", title: "BeReal — 3-Second Voice Note Reactions", challenge: "Text reactions feel impersonal on an authenticity-first platform", approach: "PRD-lite + screen flow mapping + clickable prototype", outcome: "Voice note feature balancing authenticity with engagement", techs: ["PRD", "Prototyping", "User Flows", "Product Strategy"], image: "/bereal.jpg", gradient: "linear-gradient(135deg, #1A1A2E, #3D3D6B)", caseStudy: "case-bereal" },
    { num: "03", tags: "Creative Writing · Musical Theatre", title: "Katotohanan — Original Filipino Musical", challenge: "Amplifying the untold struggles of the Philippines' indigenous communities to life through original musical theatre", approach: "Playwriting + production management + community casting", outcome: "Sparked conversation around power, truth, and oppression, 1,000+ attendees at PCN, Hollywood Fringe Festival production", techs: ["Playwright", "Director", "Producer", "Storytelling"], image: "/katotohanan.jpg", gradient: "linear-gradient(135deg, #6B2B3A, #8C4A5A)" },
  ];
  return (
    <div>
      <section style={{ paddingTop: "8rem", paddingBottom: "3rem" }}>
        <Reveal><div style={{ fontFamily: "var(--font-accent)", fontSize: "0.7rem", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1.5rem" }}>Selected Work</div></Reveal>
        <Reveal delay={0.1}><h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: 1.05, letterSpacing: "-0.03em", color: "var(--text)" }}>Projects & Case Studies</h1></Reveal>
      </section>
      {projects.map(p => (
        <section key={p.num} style={{ padding: "4rem 0", borderTop: "1px solid var(--border)" }}>
          <Reveal delay={0.05}>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "3rem", alignItems: "start" }} className="responsive-grid">
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(3rem, 5vw, 5rem)", color: "var(--accent)", opacity: 0.2, lineHeight: 1, minWidth: 80 }}>{p.num}</div>
              <div>
                <div style={{ fontFamily: "var(--font-accent)", fontSize: "0.7rem", color: "var(--accent)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.8rem", fontWeight: 600 }}>{p.tags}</div>
                <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(1.5rem, 3vw, 2.2rem)", lineHeight: 1.2, marginBottom: "2rem", color: "var(--text)" }}>{p.title}</h2>
                <div style={{ width: "100%", aspectRatio: "16/8", borderRadius: 12, overflow: "hidden", marginBottom: "2rem", background: p.gradient }}><img src={p.image} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem", marginBottom: "2rem" }} className="responsive-three-col">
                  {[{ label: "Challenge", val: p.challenge }, { label: "Approach", val: p.approach }, { label: "Outcome", val: p.outcome }].map(d => (
                    <div key={d.label}>
                      <div style={{ fontFamily: "var(--font-accent)", fontSize: "0.63rem", color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem", fontWeight: 600 }}>{d.label}</div>
                      <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.65 }}>{d.val}</p>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {p.techs.map(t => (<span key={t} style={{ fontFamily: "var(--font-accent)", fontSize: "0.66rem", padding: "0.35rem 0.9rem", borderRadius: 100, border: "1px solid var(--border)", color: "var(--text-muted)", letterSpacing: "0.04em" }}>{t}</span>))}
                </div>
                {p.caseStudy && (
                  <button onClick={() => onNavigate(p.caseStudy)} style={{
                    marginTop: "1.5rem", padding: "0.7rem 1.5rem", borderRadius: 100, border: "none", cursor: "pointer",
                    background: "var(--accent)", color: "#fff",
                    fontFamily: "var(--font-accent)", fontSize: "0.72rem", fontWeight: 600,
                    letterSpacing: "0.06em", textTransform: "uppercase",
                    transition: "transform 0.3s, opacity 0.3s",
                  }}
                    onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.opacity = "0.9"; }}
                    onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.opacity = "1"; }}
                  >View Case Study →</button>
                )}
              </div>
            </div>
          </Reveal>
        </section>
      ))}
    </div>
  );
}
/* ── RESUME ── */
function ResumePage() {
  const experience = [
    { date: "January 2026 — Present", title: "Senior Capstone — sip'd", org: "CECS 491A · California State University, Long Beach", 
      desc: (<><span>• Led end-to-end MVP development for a multi-dimensional cafe rating system (8 attributes × 5 user purposes), authoring a full PRD, user flow docs, and operational playbooks for a cross-functional team of 5.</span><br/>
      <span>• Conducted user research across 15 interviews, synthesizing qualitative data into 3 detailed personas and use-case scenario maps that directly informed product requirements.</span><br/>
      <span>• Executed competitive analysis across 4+ platforms (Yelp, Google Maps, Beli, Instagram/TikTok), identifying UX patterns and unmet user needs to shape go-to-market positioning.</span><br/>
      <span>• Applied design thinking through persona research and use-case scenario mapping, translating raw interview data into actionable product direction.</span></>)},
    { date: "January 2026 — March 2026", title: "Product Management Externship", org: "BeReal · Extern", 
      desc: (<><span>• Generated 30 feature concepts using AI-assisted tools (Claude) and applied RICE prioritization scoring to identify the highest-value opportunity.</span><br/>
      <span>• Conducted competitive benchmarking across Instagram and Twitter (X), synthesizing engagement and retention data into a PRD-lite with annotated event logs.</span><br/>
      <span>• Designed a 10-screen clickable prototype covering a complete happy path, 2 error-state flows, and layered MAU retention hooks, validated against BeReal's design system.</span><br/>
      <span>• Led mixed-method user research across 7 participants via surveys and a focus group, synthesizing findings into a research insights doc identifying core friction points.</span></>)},
    { date: "May 2024 — May 2025", title: "Membership Chair", org: "Pilipino American Coalition · CSULB",
      desc: (<><span>• Owned strategy and execution for the Ate/Kuya/Ading mentorship program, recruiting and managing 300+ members, building pairing logic, coordinating timelines across 5 weeks, and serving as the primary internal communications lead for all participants.</span><br/>
      <span>• Proactively approached problems by leading in cabinet meetings to clearly communicate issues, priorities, and action steps, ensuring alignment between an 18-person cabinet and 300+ general members.</span></>) },
    { date: "June 2023 — June 2025", title: "Playwright & Director — Katotohanan", org: "Pilipino Cultural Night · CSULB & Hollywood Fringe Festival 2025", 
      desc: (<><span>• Wrote and directed an original Filipino musical performed for 1,000+ attendees, sparking conversation around power, truth, and oppression, while managing the full production lifecycle from concept through live performance across a 9-month timeline.</span><br/>
      <span>• Led cross-functional collaboration across choreography, music, and technical crews, coordinating creative direction and iterating through structured feedback loops to hit all milestones on deadline.</span></>) },
  ];
  const skills = [
    { category: "Product", items: ["PRDs & Roadmaps", "User Research", "A/B Testing", "Prioritization", "Stakeholder Management"] },
    { category: "Design", items: ["Figma", "Wireframing", "Prototyping", "User Flows", "Journey Mapping"] },
    { category: "Development", items: ["React", "JavaScript", "HTML/CSS", "Python", "Git & GitHub"] },
    { category: "Tools", items: ["Claude AI", "Notion", "Adobe Creative Suite", "Google Workspace", "Microsoft Office"] },
  ];
  return (
    <div>
      <section style={{ paddingTop: "8rem", paddingBottom: "3rem" }}>
        <Reveal><div style={{ fontFamily: "var(--font-accent)", fontSize: "0.7rem", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1.5rem" }}>My Journey</div></Reveal>
        <Reveal delay={0.1}><h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: 1.05, letterSpacing: "-0.03em", color: "var(--text)" }}>Resume & Experience</h1></Reveal>
      </section>
      <section style={{ padding: "3rem 0", borderTop: "1px solid var(--border)" }}>
        <Reveal>
          <div style={{ fontFamily: "var(--font-accent)", fontSize: "0.7rem", color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1.5rem", fontWeight: 600 }}>Education</div>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.4rem", color: "var(--text)", marginBottom: "0.3rem" }}>B.S. Computer Science</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>California State University, Long Beach</p>
          <p style={{ color: "var(--accent)", fontSize: "0.78rem", marginTop: "0.3rem", fontFamily: "var(--font-accent)", letterSpacing: "0.06em" }}>Expected December 2026</p>
        </Reveal>
      </section>
      <section style={{ padding: "3rem 0", borderTop: "1px solid var(--border)" }}>
        <Reveal><div style={{ fontFamily: "var(--font-accent)", fontSize: "0.7rem", color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "2.5rem", fontWeight: 600 }}>Experience</div></Reveal>
        {experience.map((t, i) => (
          <Reveal key={t.title} delay={i * 0.06}>
            <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "2rem", paddingBottom: "2.5rem", marginBottom: "2.5rem", borderBottom: i < experience.length - 1 ? "1px solid var(--border)" : "none" }} className="responsive-grid">
              <div style={{ fontFamily: "var(--font-accent)", fontSize: "0.72rem", color: "var(--text-muted)", letterSpacing: "0.06em", paddingTop: "0.15rem" }}>{t.date}</div>
              <div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.15rem", marginBottom: "0.2rem", color: "var(--text)" }}>{t.title}</h3>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.6rem", fontStyle: "italic" }}>{t.org}</div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.7 }}>{t.desc}</div>
              </div>
            </div>
          </Reveal>
        ))}
      </section>
      <section style={{ padding: "3rem 0", borderTop: "1px solid var(--border)" }}>
        <Reveal><div style={{ fontFamily: "var(--font-accent)", fontSize: "0.7rem", color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "2.5rem", fontWeight: 600 }}>Skills & Tools</div></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2rem" }} className="responsive-four-col">
          {skills.map((s, i) => (
            <Reveal key={s.category} delay={i * 0.06}>
              <div>
                <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.95rem", marginBottom: "1rem", color: "var(--accent)" }}>{s.category}</h4>
                {s.items.map(item => (<div key={item} style={{ fontSize: "0.85rem", color: "var(--text-muted)", padding: "0.5rem 0", borderBottom: "1px solid var(--border)" }}>{item}</div>))}
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ── CONTACT ── */
function ContactPage() {
  return (
    <div>
      <section style={{ paddingTop: "8rem", minHeight: "80vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <Reveal><div style={{ fontFamily: "var(--font-accent)", fontSize: "0.7rem", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1.5rem" }}>Get in Touch</div></Reveal>
        <Reveal delay={0.1}><h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: 1.05, letterSpacing: "-0.03em", color: "var(--text)", marginBottom: "2rem", maxWidth: 700 }}>Let's build something <span style={{ color: "var(--accent)" }}>together</span>.</h1></Reveal>
        <Reveal delay={0.2}><p style={{ color: "var(--text-muted)", fontSize: "1.05rem", maxWidth: 500, lineHeight: 1.8, marginBottom: "3rem" }}>I'm currently in search for internships in UX research, product management, and software development. But I'm always looking to learn and connect—especially with those open to mentorship or just to have an insightful conversation!</p></Reveal>
        <Reveal delay={0.3}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            {[
              { label: "Email", href: "mailto:justinealexa.dinglas01@csulb.student.edu", val: "justinealexa.dinglas01@csulb.student.edu" },
              { label: "LinkedIn", href: "https://www.linkedin.com/in/justinedinglas/", val: "linkedin.com/in/justinedinglas" },
              { label: "GitHub", href: "https://github.com/justinedinglas", val: "github.com/justinedinglas" },
              { label: "Beli", href: "https://beliapp.co/app/dinonaraz", val: "beliapp.co/app/dinonaraz" },
            ].map(c => (
              <div key={c.label} style={{ display: "flex", gap: "2rem", alignItems: "baseline" }}>
                <div style={{ fontFamily: "var(--font-accent)", fontSize: "0.63rem", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", width: 80 }}>{c.label}</div>
                <a href={c.href} target={c.href.startsWith("mailto") ? undefined : "_blank"} rel="noopener noreferrer" style={{ color: "var(--text)", fontSize: "1rem", textDecoration: "none", borderBottom: "1px solid var(--border)", paddingBottom: 2, transition: "color 0.3s, border-color 0.3s" }}
                  onMouseEnter={e => { e.target.style.color = "var(--accent)"; e.target.style.borderColor = "var(--accent)"; }}
                  onMouseLeave={e => { e.target.style.color = "var(--text)"; e.target.style.borderColor = "var(--border)"; }}
                >{c.val}</a>
              </div>
            ))}
          </div>
        </Reveal>
      </section>
    </div>
  );
}
/* ── SIP'D CASE STUDY ── */
function SipdCaseStudy({ onNavigate }) {
  const Section = ({ label, title, children }) => (
    <section style={{ padding: "4rem 0", borderTop: "1px solid var(--border)" }}>
      <Reveal>
        <div style={{ fontFamily: "var(--font-accent)", fontSize: "0.7rem", color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem", fontWeight: 600 }}>{label}</div>
        {title && <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(1.5rem, 3vw, 2rem)", lineHeight: 1.2, marginBottom: "1.5rem", color: "var(--text)" }}>{title}</h2>}
      </Reveal>
      <Reveal delay={0.08}>{children}</Reveal>
    </section>
  );

  return (
    <div>
      {/* Hero */}
      <section style={{ paddingTop: "8rem", paddingBottom: "2rem" }}>
        <Reveal>
          <button onClick={() => onNavigate("work")} style={{
            background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: "2rem",
            fontFamily: "var(--font-accent)", fontSize: "0.72rem", color: "var(--text-muted)",
            letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: "0.4rem", transition: "color 0.3s",
          }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            Back to Work
          </button>
        </Reveal>
        <Reveal delay={0.05}>
          <div style={{ fontFamily: "var(--font-accent)", fontSize: "0.7rem", color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem", fontWeight: 600 }}>Case Study · Senior Capstone</div>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(2.5rem, 6vw, 4rem)", lineHeight: 1.05, letterSpacing: "-0.03em", color: "var(--text)", marginBottom: "1.5rem" }}>sip'd</h1>
        </Reveal>
        <Reveal delay={0.15}>
          <p style={{ fontSize: "1.15rem", color: "var(--text-muted)", maxWidth: 600, lineHeight: 1.75, marginBottom: "2rem" }}>
            A cafe discovery app that lets users find and rate cafes by purpose — studying, meetings, solo work, or socializing — across functional criteria like WiFi, noise level, and outlet availability.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap" }}>
            {[{ l: "Role", v: "Product Manager" }, { l: "Team", v: "Justine D., Morsey R., Lee S., Manjot S., and Jomel T." }, { l: "Timeline", v: "Jan 2026 — Present" }, { l: "Tools", v: "Figma, React, Node.js, Notion" }].map(d => (
              <div key={d.l}>
                <div style={{ fontFamily: "var(--font-accent)", fontSize: "0.6rem", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.3rem" }}>{d.l}</div>
                <div style={{ fontSize: "0.95rem", color: "var(--text)" }}>{d.v}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Hero image */}
      <section style={{ padding: "2rem 0" }}>
        <Reveal>
          <div style={{ width: "100%", aspectRatio: "16/8", borderRadius: 12, overflow: "hidden", background: "linear-gradient(135deg, #2D5A3D, #4A8C5E)" }}>
            <img src="/sipd.jpg" alt="sip'd app" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </Reveal>
      </section>

      {/* Problem */}
      <Section label="The Problem" title="Current platforms prioritize aesthetics over function">
        <p style={{ color: "var(--text-muted)", fontSize: "0.98rem", lineHeight: 1.8, marginBottom: "1.2rem", maxWidth: 700 }}>
          Students searching for a quiet study spot, professionals needing a reliable place for coffee meetings, or remote workers seeking consistent WiFi and power outlets must rely on trial-and-error or sift through irrelevant reviews to determine if a cafe will actually meet their needs.
        </p>
        <p style={{ color: "var(--text-muted)", fontSize: "0.98rem", lineHeight: 1.8, marginBottom: "2rem", maxWidth: 700 }}>
          Platforms like Yelp and Google Maps prioritize aesthetics and food quality, but none help users find a cafe that's actually functional for their intended purpose. The absence of purpose-specific, crowd-sourced data about noise levels, seating availability, WiFi reliability, and outlet access means users lack the information necessary to make informed decisions.
        </p>
        <div style={{ borderLeft: "2px solid var(--accent)", paddingLeft: "1.2rem", marginBottom: "1rem" }}>
          <p style={{ color: "var(--text)", fontSize: "0.95rem", lineHeight: 1.7, fontStyle: "italic", marginBottom: "0.3rem" }}>"The Yelp pictures are misleading, and then there's no seats, or it's a big cafe, but all the seats are taken."</p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>— Interviewee, software engineer and MBA student</p>
        </div>
        <div style={{ borderLeft: "2px solid var(--accent)", paddingLeft: "1.2rem" }}>
          <p style={{ color: "var(--text)", fontSize: "0.95rem", lineHeight: 1.7, fontStyle: "italic", marginBottom: "0.3rem" }}>"It's super frustrating when all the seats are taken. Or we find a good seat, but it doesn't have a charger. So we have to change our plans."</p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>— Interviewee, Biology student, Long Beach City College</p>
        </div>
      </Section>

      {/* Research */}
      <Section label="Research" title="15 semi-structured interviews across diverse cafe-goers">
        <p style={{ color: "var(--text-muted)", fontSize: "0.98rem", lineHeight: 1.8, marginBottom: "2rem", maxWidth: 700 }}>
          We conducted 15 semi-structured interviews, each lasting 20-30 minutes, with participants ranging from high school students to working professionals (ages 14-34). Interviews followed a 23-question framework across six sections: background and context, current behavior, pain points and frustrations, tools and workarounds, behavior patterns and preferences, and reaction to concept.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginBottom: "2.5rem" }} className="responsive-three-col">
          {[
            { n: "15", l: "User Interviews", d: "Semi-structured, 20-30 min each" },
            { n: "23", l: "Question Framework", d: "Across 6 research sections" },
            { n: "15/15", l: "Reported Frustration", d: "Every user had cafe discovery pain points" },
          ].map(s => (
            <div key={s.l} style={{ padding: "1.5rem", borderRadius: 12, border: "1px solid var(--border)" }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.8rem", color: "var(--accent)", marginBottom: "0.3rem" }}>{s.n}</div>
              <div style={{ fontFamily: "var(--font-accent)", fontSize: "0.65rem", color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.5rem" }}>{s.l}</div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: 1.6 }}>{s.d}</p>
            </div>
          ))}
        </div>

        {/* Pain points */}
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.15rem", marginBottom: "1.2rem", color: "var(--text)" }}>Top Pain Points</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2.5rem" }} className="responsive-grid">
          {[
            { title: "Seating Unavailability", desc: "Arriving to find no open tables, especially during midterm/finals seasons" },
            { title: "Outlet Scarcity", desc: "Many cafes have few or no outlets, and those that exist are often occupied" },
            { title: "Misleading Online Info", desc: "Photos that make cafes look spacious when they're cramped, or Google 'busy times' that reflect line length rather than table availability" },
            { title: "Wasted Trips", desc: "Driving to a cafe only to leave immediately because it doesn't meet basic needs" },
            { title: "Unreliable Hours", desc: "Cafes closing earlier than listed, especially for late-night users" },
            { title: "Inadequate Workspace", desc: "Small or bolted-down tables that make laptop-based studying impossible" },
          ].map(p => (
            <div key={p.title} style={{ padding: "1.2rem", borderRadius: 10, border: "1px solid var(--border)" }}>
              <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.92rem", marginBottom: "0.4rem", color: "var(--text)" }}>{p.title}</h4>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: 1.6 }}>{p.desc}</p>
            </div>
          ))}
        </div>

        {/* Attribute rankings */}
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.15rem", marginBottom: "1.2rem", color: "var(--text)" }}>Attribute Priority Rankings</h3>
        <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: 1.7, marginBottom: "1.5rem", maxWidth: 600 }}>
          We asked interviewees to rate the importance of cafe attributes on a 1-5 scale. These priorities directly informed our rating system design:
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", maxWidth: 500 }}>
          {[
            { attr: "Outlet Availability", rating: 4.3, rank: 1 },
            { attr: "WiFi Reliability", rating: 4.1, rank: 2 },
            { attr: "Seating Comfort", rating: 3.7, rank: 3 },
            { attr: "Crowd Size / Busyness", rating: 3.6, rank: 4 },
            { attr: "Noise Level", rating: 3.2, rank: 5 },
            { attr: "Lighting", rating: 2.7, rank: 6 },
          ].map(a => (
            <div key={a.attr} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ fontFamily: "var(--font-accent)", fontSize: "0.6rem", color: "var(--text-muted)", width: 20, textAlign: "right" }}>#{a.rank}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.2rem" }}>
                  <span style={{ fontSize: "0.88rem", color: "var(--text)" }}>{a.attr}</span>
                  <span style={{ fontFamily: "var(--font-accent)", fontSize: "0.78rem", color: "var(--accent)", fontWeight: 600 }}>{a.rating}</span>
                </div>
                <div style={{ width: "100%", height: 4, borderRadius: 2, background: "var(--border)" }}>
                  <div style={{ width: `${(a.rating / 5) * 100}%`, height: "100%", borderRadius: 2, background: "var(--accent)", transition: "width 0.6s ease" }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Key Insights */}
      <Section label="Key Insights" title="5 strategic findings that shaped sip'd">
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {[
            { n: "01", title: "The search process itself is the core problem", desc: "Every persona loses time before they even arrive at a cafe. The friction isn't at the cafe — it's in finding the right one." },
            { n: "02", title: "Real-time data is the universal unmet need", desc: "No current tool provides live seating, outlet, or crowd information. This is the gap sip'd fills." },
            { n: "03", title: "Users already build informal systems", desc: "Mental cafe rotations, group chat intel, personal Google Sheets. These DIY workarounds signal strong latent demand for a formalized tool." },
            { n: "04", title: "Infrastructure filters belong front and center", desc: "Outlets, WiFi, and table size are not review topics — they are first-class search filters that should be surfaced before a user ever reads a review." },
            { n: "05", title: "Low-friction contribution works across all personas", desc: "Even casual visitors said they would rate a cafe if prompted with a quick one-tap interaction post-visit. The contribution model should be lightweight, not form-heavy." },
          ].map(ins => (
            <div key={ins.n} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1.5rem", alignItems: "start" }} className="responsive-grid">
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.5rem", color: "var(--accent)", opacity: 0.3, lineHeight: 1, minWidth: 36 }}>{ins.n}</div>
              <div>
                <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", marginBottom: "0.4rem", color: "var(--text)" }}>{ins.title}</h4>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.65 }}>{ins.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Personas */}
      <Section label="Personas" title="3 distinct user archetypes from 15 interviews">
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.8, marginBottom: "2rem", maxWidth: 700 }}>
          Each persona represents a cluster of shared motivations, behaviors, and pain points observed across multiple interviewees.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {[
            {
              name: "The Social Coordinator", emoji: "🎉",
              desc: "A sporadic cafe visitor who prioritizes a comfortable, 'good-vibes' location to socialize with friends without having to fight cafe crowds. Seat availability, crowd levels, menu variety, and overall aesthetics are paramount.",
              behavior: "Quick deciders — 10 to 15 minutes to choose. Uses social media, friend recs, and previously enjoyed spots. Will leave or switch plans entirely if a cafe is too busy.",
              quote: '"The most frustrating thing is definitely finding enough seating for all of my friends."',
              quoteBy: "— Interviewee, recent Engineering grad",
              needs: "Real-time crowd and seating indicators, menu previews, honest environment reviews",
            },
            {
              name: "The Productivity Power-User", emoji: "💻",
              desc: "Needs a reliable cafe workspace for long work sessions 2-3 times a week. Approaches cafes with a productivity-first view — charging access, reliable WiFi, seating availability, and adequate table size are top priorities.",
              behavior: "Relies on Yelp, Maps, and personal lists of known reliable spots. Leaves immediately if no visible seating or outlets. Wastes productive time repeating this process until a suitable cafe is found.",
              quote: '"I would love to know if they have an adequate amount of chargers. That\'s super important."',
              quoteBy: "— Interviewee, Biology student, Long Beach City College",
              needs: "Filters for outlets, WiFi, table size, seating availability. Real-time occupancy data.",
            },
            {
              name: "The Data-Driven Local", emoji: "📊",
              desc: "Has found the perfect rotation of cafes and won't switch without a data-backed reason. Often mid-career professionals or graduate students. Prioritizes technical metrics like parking ease, drink quality, or WiFi speed.",
              behavior: "Rarely looks at reviews — finds them too subjective. Some already track and rank cafes manually in spreadsheets. Primary recommenders in their social circles.",
              quote: '"I hardly look at the reviews — I just try it out for the first time, and if it doesn\'t end up being a place I like, I just scratch it off my list."',
              quoteBy: "— Interviewee, Business Administration student",
              needs: "Personal cafe log, data-driven rankings, verified parking info, advanced tracking features",
            },
          ].map(p => (
            <div key={p.name} style={{ padding: "2rem", borderRadius: 14, border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "1rem" }}>
                <span style={{ fontSize: "1.5rem" }}>{p.emoji}</span>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.15rem", color: "var(--text)" }}>{p.name}</h3>
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: 1.7, marginBottom: "1rem" }}>{p.desc}</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1rem" }} className="responsive-grid">
                <div>
                  <div style={{ fontFamily: "var(--font-accent)", fontSize: "0.6rem", color: "var(--accent)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.4rem", fontWeight: 600 }}>Behavior</div>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: 1.6 }}>{p.behavior}</p>
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-accent)", fontSize: "0.6rem", color: "var(--accent)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.4rem", fontWeight: 600 }}>Key Needs</div>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: 1.6 }}>{p.needs}</p>
                </div>
              </div>
              <div style={{ borderLeft: "2px solid var(--accent)", paddingLeft: "1rem" }}>
                <p style={{ color: "var(--text)", fontSize: "0.9rem", fontStyle: "italic", marginBottom: "0.2rem", lineHeight: 1.6 }}>{p.quote}</p>
                <p style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>{p.quoteBy}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Use Cases */}
      <Section label="Use Cases" title="Real scenarios that illustrate the problem">
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {[
            {
              title: "Saturday Brunch with the Group Chat",
              context: "Chan, 27, needs to find a cafe that can seat 13 friends for a brunch hangout. Everyone's scattered across the city.",
              friction: "25 minutes bouncing between TikTok, Google Maps, and group chat screenshots. Photos are misleading — one cafe looks spacious but reviews say it's cramped. Top pick doesn't take reservations.",
              outcome: "They luck into a large table, but friends are disappointed by the limited food menu (not visible online). The entire planning process could have been 5 minutes with the right info upfront.",
              insight: "Group seating capacity and visible menus are the #1 decision-unlockers for social planners.",
            },
            {
              title: "Midterm Week Workspace Hunt",
              context: "Karina, 22, a CS major, needs a 4-hour study block before a 7PM exam. Campus library is packed by 9AM.",
              friction: "Drives 12 minutes to their #1 pick — tables taken, no visible outlets. Drives to backup #2, finds one small table. WiFi is barely functional.",
              outcome: "Hotspots from phone, gets 2.5 hours of productive work instead of 4. Third time this month they've lost study time to the 'find a workspace' problem.",
              insight: "The wasted trip cost isn't just time — it's lost productivity that can't be recovered before an exam.",
            },
            {
              title: "Tuesday Night, the 9 PM Productivity Window",
              context: "Alex, 23, just finished a long shift and needs a quiet cafe open past 10 PM. Home is too distracting.",
              friction: "Googles 'cafes open late near me' — results are outdated. Checks 6 cafes on Maps one by one. Drives to the 11 PM option — they closed early tonight.",
              outcome: "Ends up at a 24-hour fast food spot with poor lighting and noise. Gets 90 minutes of work instead of 3 hours.",
              insight: "Verified, real-time operating hours are critical. Late-night users are underserved and highly loyal once they find reliable spots.",
            },
          ].map((uc, i) => (
            <div key={uc.title} style={{ padding: "2rem", borderRadius: 14, border: "1px solid var(--border)" }}>
              <div style={{ fontFamily: "var(--font-accent)", fontSize: "0.6rem", color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Use Case {i + 1}</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem", color: "var(--text)", marginBottom: "1rem" }}>{uc.title}</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem", marginBottom: "1rem" }} className="responsive-grid">
                <div>
                  <div style={{ fontFamily: "var(--font-accent)", fontSize: "0.6rem", color: "var(--accent)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.4rem", fontWeight: 600 }}>Context</div>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: 1.6 }}>{uc.context}</p>
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-accent)", fontSize: "0.6rem", color: "var(--accent)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.4rem", fontWeight: 600 }}>Friction</div>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: 1.6 }}>{uc.friction}</p>
                </div>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ fontFamily: "var(--font-accent)", fontSize: "0.6rem", color: "var(--accent)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.4rem", fontWeight: 600 }}>Outcome</div>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: 1.6 }}>{uc.outcome}</p>
              </div>
              <div style={{ background: "var(--accent-muted)", padding: "1rem", borderRadius: 8 }}>
                <div style={{ fontFamily: "var(--font-accent)", fontSize: "0.6rem", color: "var(--accent)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.3rem", fontWeight: 600 }}>Key Insight</div>
                <p style={{ color: "var(--text)", fontSize: "0.88rem", lineHeight: 1.6, fontWeight: 500 }}>{uc.insight}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Solution */}
      <Section label="The Solution" title="A purpose-driven rating system">
        <p style={{ color: "var(--text-muted)", fontSize: "0.98rem", lineHeight: 1.8, marginBottom: "2rem", maxWidth: 700 }}>
          sip'd lets users rate cafes across functional attributes — mapped against user purposes like studying, meetings, solo work, socializing, and casual visits. This creates a purpose-driven discovery experience that goes far beyond a single star rating. Infrastructure filters like outlets, WiFi, and table size are surfaced as first-class search criteria, not buried in reviews.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }} className="responsive-three-col">
          {[
            { attr: "Outlet Availability", rating: "4.3 avg importance" },
            { attr: "WiFi Reliability", rating: "4.1 avg importance" },
            { attr: "Seating Comfort", rating: "3.7 avg importance" },
            { attr: "Crowd Size", rating: "3.6 avg importance" },
            { attr: "Noise Level", rating: "3.2 avg importance" },
            { attr: "Lighting", rating: "2.7 avg importance" },
          ].map((a, i) => (
            <div key={a.attr} style={{ padding: "1rem", borderRadius: 8, border: "1px solid var(--border)", textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-accent)", fontSize: "0.6rem", color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.3rem" }}>#{i + 1}</div>
              <div style={{ fontSize: "0.9rem", color: "var(--text)", fontWeight: 500, marginBottom: "0.2rem" }}>{a.attr}</div>
              <div style={{ fontSize: "0.72rem", color: "var(--accent)", fontFamily: "var(--font-accent)" }}>{a.rating}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* My Role */}
      <Section label="My Role" title="What I owned">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }} className="responsive-grid">
          {[
            { title: "Product Strategy", desc: "Led product strategy from problem discovery through MVP definition. Authored the PRD and operational playbooks for a cross-functional team of 5." },
            { title: "User Research", desc: "Co-led 15 semi-structured user interviews using a 23-question framework, synthesized findings into 3 detailed personas and use-case scenario maps, and translated raw interview data into actionable product direction." },
            { title: "Team Operations", desc: "Established operational processes from scratch — task tracking in Notion, sprint planning, and conflict resolution protocols — ensuring on-time delivery across all milestones." },
            { title: "Competitive Analysis", desc: "Executed competitive analysis across 5+ platforms (Yelp, Google Maps, Beli, Instagram, TikTok), identifying the market gap in purpose-driven cafe discovery and synthesizing adoption insights into go-to-market positioning." },
          ].map(r => (
            <div key={r.title}>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", marginBottom: "0.8rem", color: "var(--text)" }}>{r.title}</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: 1.7 }}>{r.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Reflection */}
      <Section label="Reflection" title="What I learned">
        <p style={{ color: "var(--text-muted)", fontSize: "0.98rem", lineHeight: 1.8, marginBottom: "1.2rem", maxWidth: 700 }}>
          sip'd has been one of the most full-stack PM experiences I've had — going from problem discovery all the way to beginning to build something people would actually use. It taught me how to balance user needs with technical constraints, how to keep a team aligned when things get ambiguous, and how to make product decisions grounded in real data rather than assumptions.
        </p>
      </Section>

      {/* Back */}
      <section style={{ padding: "3rem 0", borderTop: "1px solid var(--border)" }}>
        <Reveal>
          <button onClick={() => onNavigate("work")} style={{
            background: "none", border: "none", cursor: "pointer", padding: 0,
            fontFamily: "var(--font-accent)", fontSize: "0.72rem", color: "var(--text-muted)",
            letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: "0.4rem", transition: "color 0.3s",
          }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            Back to All Projects
          </button>
        </Reveal>
      </section>
    </div>
  );
}
/* ── BEREAL CASE STUDY ── */
function BerealCaseStudy({ onNavigate }) {
  const Section = ({ label, title, children }) => (
    <section style={{ padding: "4rem 0", borderTop: "1px solid var(--border)" }}>
      <Reveal>
        <div style={{ fontFamily: "var(--font-accent)", fontSize: "0.7rem", color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem", fontWeight: 600 }}>{label}</div>
        {title && <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(1.5rem, 3vw, 2rem)", lineHeight: 1.2, marginBottom: "1.5rem", color: "var(--text)" }}>{title}</h2>}
      </Reveal>
      <Reveal delay={0.08}>{children}</Reveal>
    </section>
  );

  return (
    <div>
      {/* Hero */}
      <section style={{ paddingTop: "8rem", paddingBottom: "2rem" }}>
        <Reveal>
          <button onClick={() => onNavigate("work")} style={{
            background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: "2rem",
            fontFamily: "var(--font-accent)", fontSize: "0.72rem", color: "var(--text-muted)",
            letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: "0.4rem", transition: "color 0.3s",
          }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            Back to Work
          </button>
        </Reveal>
        <Reveal delay={0.05}>
          <div style={{ fontFamily: "var(--font-accent)", fontSize: "0.7rem", color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem", fontWeight: 600 }}>Case Study · PM Externship</div>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(2.2rem, 5vw, 3.5rem)", lineHeight: 1.08, letterSpacing: "-0.03em", color: "var(--text)", marginBottom: "1.5rem" }}>BeReal: 3-Second Voice Note Reactions</h1>
        </Reveal>
        <Reveal delay={0.15}>
          <p style={{ fontSize: "1.1rem", color: "var(--text-muted)", maxWidth: 600, lineHeight: 1.75, marginBottom: "2rem" }}>
            Designing a voice reaction feature that keeps BeReal authentic while driving daily engagement. From 30 feature concepts to a validated prototype.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap" }}>
            {[{ l: "Role", v: "Product Management Extern" }, { l: "Program", v: "Extern" }, { l: "Timeline", v: "Jan — Mar 2026" }, { l: "Deliverables", v: "PRD-lite, Prototype, Focus Group" }].map(d => (
              <div key={d.l}>
                <div style={{ fontFamily: "var(--font-accent)", fontSize: "0.6rem", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.3rem" }}>{d.l}</div>
                <div style={{ fontSize: "0.95rem", color: "var(--text)" }}>{d.v}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Hero image */}
      <section style={{ padding: "2rem 0" }}>
        <Reveal>
          <div style={{ width: "100%", aspectRatio: "16/8", borderRadius: 12, overflow: "hidden", background: "linear-gradient(135deg, #1A1A2E, #3D3D6B)" }}>
            <img src="/bereal.jpg" alt="BeReal voice reactions" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </Reveal>
      </section>

      {/* Problem */}
      <Section label="The Problem" title="Text reactions are starting to get old.">
        <p style={{ color: "var(--text-muted)", fontSize: "0.98rem", lineHeight: 1.8, marginBottom: "1.2rem", maxWidth: 700 }}>
          BeReal's entire identity is built on raw, unfiltered moments. But the reaction layer hasn't kept up. Emoji reactions and text comments get rather repetitive after a few posts, and that gap contributes to declining daily returns.
        </p>
        <p style={{ color: "var(--text-muted)", fontSize: "0.98rem", lineHeight: 1.8, maxWidth: 700 }}>
          The question: how do you make reactions feel as authentic as the posts themselves, and can that authenticity become a re-engagement mechanic?
        </p>
      </Section>

      {/* Ideation */}
      <Section label="Ideation" title="30 concepts, narrowed to 1">
        <p style={{ color: "var(--text-muted)", fontSize: "0.98rem", lineHeight: 1.8, marginBottom: "2rem", maxWidth: 700 }}>
          I generated 30 feature concepts using a Problem → Idea → MAU Hypothesis framework, leveraging AI-assisted tools (Claude) for rapid ideation while validating every output against BeReal's product principles. Each idea was structured around a specific user behavior problem, a proposed solution, and a measurable retention hypothesis.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginBottom: "2rem" }} className="responsive-three-col">
          {[
            { n: "30", l: "Feature Concepts", d: "Generated via Problem → Idea → MAU framework" },
            { n: "7", l: "Top Candidates", d: "Scored through RICE prioritization" },
            { n: "19.2", l: "Winning RICE Score", d: "Voice Note Reactions — highest by 2x" },
          ].map(s => (
            <div key={s.l} style={{ padding: "1.5rem", borderRadius: 12, border: "1px solid var(--border)" }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.8rem", color: "var(--accent)", marginBottom: "0.3rem" }}>{s.n}</div>
              <div style={{ fontFamily: "var(--font-accent)", fontSize: "0.65rem", color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.5rem" }}>{s.l}</div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: 1.6 }}>{s.d}</p>
            </div>
          ))}
        </div>
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem", marginBottom: "1rem", color: "var(--text)" }}>Why Voice Note Reactions won</h3>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.8, maxWidth: 700 }}>
          It scored highest at 19.2 because it has the lowest effort in the table, and since effort is the denominator, a quick build amplifies everything else. It pairs strong reach and impact with high confidence — voice reactions outperform text in emotional resonance. It's also a natural fit for BeReal's values: a spontaneous 3-second reaction is harder to fake than a typed reply, so the engagement it drives feels genuine.
        </p>
      </Section>

      {/* Competitive Benchmarking */}
      <Section label="Research" title="Competitive benchmarking across social platforms">
        <p style={{ color: "var(--text-muted)", fontSize: "0.98rem", lineHeight: 1.8, marginBottom: "2rem", maxWidth: 700 }}>
          Analyzed how Instagram, Twitter (X), Snapchat, and TikTok approach authenticity, engagement mechanics, and social reactions to identify whitespace opportunities and validate the voice reaction concept.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="responsive-grid">
          {[
            { platform: "Instagram", finding: "Reactions are performative — likes, comments, and story replies prioritize polish over spontaneity" },
            { platform: "Twitter / X", finding: "Engagement is text-heavy and public. No intimate reaction mechanic between friends" },
            { platform: "Snapchat", finding: "Voice notes exist but aren't tied to specific content. No reaction-to-post voice mechanic" },
            { platform: "TikTok", finding: "Duets and stitches are voice-adjacent but require content creation, not quick reactions" },
          ].map(c => (
            <div key={c.platform} style={{ padding: "1.2rem", borderRadius: 10, border: "1px solid var(--border)" }}>
              <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.92rem", marginBottom: "0.4rem", color: "var(--text)" }}>{c.platform}</h4>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: 1.6 }}>{c.finding}</p>
            </div>
          ))}
        </div>
        <div style={{ background: "var(--accent-muted)", padding: "1rem", borderRadius: 8, marginTop: "1.5rem", maxWidth: 700 }}>
          <p style={{ color: "var(--text)", fontSize: "0.9rem", lineHeight: 1.6, fontWeight: 500 }}>Key gap: No major social platform offers a voice-based reaction tied to a specific post. The mechanic is entirely unoccupied.</p>
        </div>
      </Section>

      {/* Solution */}
      <Section label="The Solution" title="Hold, react, send — in 3 seconds">
        <p style={{ color: "var(--text-muted)", fontSize: "0.98rem", lineHeight: 1.8, marginBottom: "2rem", maxWidth: 700 }}>
          Hold the mic icon on any friend's BeReal to send an unedited 3-second voice reaction. The 3-second cap is the feature: it removes performance anxiety and keeps reactions as raw as the posts themselves. No editing, no replay before sending — the same logic as the dual-camera timer that made BeReal what it is.
        </p>
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem", marginBottom: "1.2rem", color: "var(--text)" }}>10-screen clickable prototype</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem", marginBottom: "2rem" }} className="responsive-grid">
          {[
            { label: "Happy Path", desc: "Onboarding → Feed → Recording → Confirmation → Notification → Playback" },
            { label: "Error Flows", desc: "Two error state flows covering permission denial and recording failures" },
            { label: "MAU Hooks", desc: "Four compounding retention hooks: streak cue, social proof, nostalgia strip, and tomorrow nudge" },
            { label: "Event Logs", desc: "Annotated event logs for every screen documenting analytics triggers" },
          ].map(f => (
            <div key={f.label} style={{ padding: "1.2rem", borderRadius: 10, border: "1px solid var(--border)" }}>
              <div style={{ fontFamily: "var(--font-accent)", fontSize: "0.6rem", color: "var(--accent)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.4rem", fontWeight: 600 }}>{f.label}</div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Validation */}
      <Section label="Validation" title="Focus group results">
        <p style={{ color: "var(--text-muted)", fontSize: "0.98rem", lineHeight: 1.8, marginBottom: "2rem", maxWidth: 700 }}>
          I ran a moderated focus group and collected survey responses with 7 participants to validate the concept, test the prototype, and surface edge cases.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginBottom: "2.5rem" }} className="responsive-three-col">
          {[
            { n: "4.1/5", l: "Overall Score", d: "Average across 7 survey respondents" },
            { n: "4.4/5", l: "Authenticity Fit", d: "How well it fits BeReal's identity" },
            { n: "7/7", l: "Would Recommend", d: "100% greenlight consensus" },
          ].map(s => (
            <div key={s.l} style={{ padding: "1.5rem", borderRadius: 12, border: "1px solid var(--border)" }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.8rem", color: "var(--accent)", marginBottom: "0.3rem" }}>{s.n}</div>
              <div style={{ fontFamily: "var(--font-accent)", fontSize: "0.65rem", color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.5rem" }}>{s.l}</div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: 1.6 }}>{s.d}</p>
            </div>
          ))}
        </div>

        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem", marginBottom: "1.2rem", color: "var(--text)" }}>Key findings</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem", marginBottom: "2rem" }}>
          {[
            { title: "Notification curiosity drives app opens", desc: "All participants said they would open the app upon receiving a voice reaction. Unlike text that can be previewed from the lock screen, voice requires an app open — the format itself is the re-engagement mechanic.", quote: '"Instead of a normal text reaction where you could see what they say on the notification page, you can\'t really do that with sound. So it kind of makes me wanna go in the app to hear what they said."' },
            { title: "The feature adds a meaningful new dimension", desc: "Participants compared it to when BeReal first introduced music — an added layer that makes the app more engaging without changing its identity.", quote: '"It\'s kind of a similar feel to when they first introduced adding music. Like, an added dimension to the app."' },
            { title: "Review-before-send is the #1 requested change", desc: "Multiple participants felt sending automatically without hearing it back first was a gap, drawing comparison to how image reactions already work.", quote: '"With the image reactions you send, you\'re able to look at them before you send them. So I think a similar thing should be there with the voice reactions."' },
          ].map(f => (
            <div key={f.title} style={{ padding: "1.5rem", borderRadius: 12, border: "1px solid var(--border)" }}>
              <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.5rem", color: "var(--text)" }}>{f.title}</h4>
              <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", lineHeight: 1.65, marginBottom: "0.8rem" }}>{f.desc}</p>
              <div style={{ borderLeft: "2px solid var(--accent)", paddingLeft: "1rem" }}>
                <p style={{ color: "var(--text)", fontSize: "0.88rem", fontStyle: "italic", lineHeight: 1.6 }}>{f.quote}</p>
              </div>
            </div>
          ))}
        </div>

        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem", marginBottom: "1rem", color: "var(--text)" }}>Unprompted insights from participants</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="responsive-grid">
          {[
            { title: "Review before send", desc: "Ability to hear the recording back before it's delivered" },
            { title: "Automated captions", desc: "Accessibility need, voice message transcription" },
            { title: "Content moderation", desc: "Warning if a reaction contains inappropriate audio, especially in public settings" },
            { title: "Audio quality", desc: "Ensuring the actual recording is clear and legible before launch" },
          ].map(ins => (
            <div key={ins.title} style={{ padding: "1rem", borderRadius: 8, background: "var(--accent-muted)" }}>
              <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.88rem", marginBottom: "0.3rem", color: "var(--text)" }}>{ins.title}</h4>
              <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", lineHeight: 1.55 }}>{ins.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Reflection */}
      <Section label="Reflection" title="What I learned">
        <p style={{ color: "var(--text-muted)", fontSize: "0.98rem", lineHeight: 1.8, marginBottom: "1.2rem", maxWidth: 700 }}>
          This externship taught me how to take a product from zero to validated concept in a compressed timeline. The biggest lesson was that the best features aren't the most complex — they're the ones where the mechanic itself enforces the product's values. The 3-second constraint isn't a limitation; it's what makes the feature authentic.
        </p>
        <p style={{ color: "var(--text-muted)", fontSize: "0.98rem", lineHeight: 1.8, maxWidth: 700 }}>
          Running the focus group also reinforced something I've come to believe: the most valuable insights come from what users say unprompted. Nobody asked about content moderation or accessibility — participants raised those on their own, which is the strongest signal that the concept resonated enough for them to think through real-world edge cases.
        </p>
      </Section>

      {/* Back */}
      <section style={{ padding: "3rem 0", borderTop: "1px solid var(--border)" }}>
        <Reveal>
          <button onClick={() => onNavigate("work")} style={{
            background: "none", border: "none", cursor: "pointer", padding: 0,
            fontFamily: "var(--font-accent)", fontSize: "0.72rem", color: "var(--text-muted)",
            letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: "0.4rem", transition: "color 0.3s",
          }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            Back to All Projects
          </button>
        </Reveal>
      </section>
    </div>
  );
}
/* ── MAIN ── */
export default function Portfolio() {
  const [page, setPage] = useState(() => {
  const hash = window.location.hash.replace("#", "");
  return hash || "home";
});
  const [transitioning, setTransitioning] = useState(false);
  const [mode, setMode] = useState("light");
  const t = themes[mode];
  const toggle = useCallback(() => setMode(m => m === "dark" ? "light" : "dark"), []);
  const navigate = useCallback((newPage) => {
  if (newPage === page) return;
  setTransitioning(true);
  window.location.hash = newPage === "home" ? "" : newPage;
  setTimeout(() => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "instant" });
    setTimeout(() => setTransitioning(false), 50);
  }, 350);
}, [page]);

  return (
    <ThemeCtx.Provider value={{ mode, toggle }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Manrope:wght@300;400;500;600&family=Archivo:wght@400;500;600&display=swap');
        :root {
          --bg: ${t.bg}; --bg-alt: ${t.bgAlt}; --text: ${t.text}; --text-muted: ${t.textMuted};
          --accent: ${t.accent}; --accent-muted: ${t.accentMuted}; --border: ${t.border};
          --navBg: ${t.navBg}; --glow1: ${t.glow1}; --glow2: ${t.glow2};
          --font-display: 'Sora', sans-serif; --font-body: 'Manrope', sans-serif; --font-accent: 'Archivo', sans-serif;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body, #root { height: 100%; }
        body { font-family: var(--font-body); background: var(--bg); color: var(--text); line-height: 1.7; font-weight: 300; transition: background 0.4s, color 0.4s; }
        ::selection { background: ${t.selBg}; color: ${t.selColor}; }
        a { text-decoration: none; }
        html { scrollbar-width: none; } 
        html::-webkit-scrollbar { display: none; }
        @keyframes scrollBounce { 0%, 100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(8px); } }
        @media (max-width: 900px) {
          .nav-desktop-bar { display: none !important; }
          .mobile-nav-bar { display: flex !important; }
          .responsive-grid { grid-template-columns: 1fr !important; }
          .responsive-three-col { grid-template-columns: 1fr !important; }
          .responsive-four-col { grid-template-columns: 1fr 1fr !important; }
          .hero-glow { display: none !important; }
        }
        @media (min-width: 901px) { .mobile-nav-bar { display: none !important; } }
      `}</style>

      <TopNav current={page} onNavigate={navigate} />
      <MobileNav current={page} onNavigate={navigate} />

      <main style={{
        maxWidth: 1100, margin: "0 auto", padding: "0 3rem", minHeight: "100vh",
        opacity: transitioning ? 0 : 1, transform: transitioning ? "translateY(10px)" : "translateY(0)",
        transition: "opacity 0.35s ease, transform 0.35s ease",
      }}>
        {page === "home" && <HomePage />}
        {page === "work" && <WorkPage onNavigate={navigate} />}
        {page === "resume" && <ResumePage />}
        {page === "contact" && <ContactPage />}
        {page === "case-sipd" && <SipdCaseStudy onNavigate={navigate} />}
        {page === "case-bereal" && <BerealCaseStudy onNavigate={navigate} />}
        <footer style={{ padding: "3rem 0", borderTop: "1px solid var(--border)", textAlign: "center", marginTop: "4rem" }}>
          <span style={{ fontFamily: "var(--font-accent)", fontSize: "0.68rem", color: "var(--text-muted)", letterSpacing: "0.06em" }}>© 2026 Justine Alexa Dinglas — Made with <span style={{ color: "var(--accent)" }}>♥</span></span>
        </footer>
      </main>
    </ThemeCtx.Provider>
  );
}