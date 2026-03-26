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
        <div className="hero-glow" style={{ position: "absolute", top: "10%", right: "-15%", width: 700, height: 700, background: "radial-gradient(circle, var(--glow1) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(60px)", pointerEvents: "none", animation: "glowPulse 6s ease-in-out infinite alternate" }} />
        <div className="hero-glow" style={{ position: "absolute", bottom: "5%", left: "-10%", width: 500, height: 500, background: "radial-gradient(circle, var(--glow2) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(50px)", pointerEvents: "none", animation: "glowPulse 8s ease-in-out 2s infinite alternate" }} />
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
              <div style={{ fontFamily: "var(--font-accent)", fontSize: "0.7rem", color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1.5rem", fontWeight: 600 }}>About</div>
              <div style={{ aspectRatio: "3/4", borderRadius: 12, overflow: "hidden", background: "linear-gradient(135deg, var(--accent-muted), var(--accent-muted))", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "var(--font-accent)", fontSize: "0.73rem", color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>your photo here</span>
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
function WorkPage() {
  const projects = [
    { num: "01", tags: "Product Management · UX Research · Senior Capstone", title: "sip'd — Cafe Discovery App", challenge: "Cafe enthusiasts struggle to find cafes matching their study/social needs", approach: "User interviews + persona development + iterative UX flows", outcome: "Community-first cafe discovery app with warm brand identity", techs: ["UX Research", "Project Management", "Figma", "React", "Node.js", "Team Lead"], gradient: "linear-gradient(135deg, #2D5A3D, #4A8C5E)" },
    { num: "02", tags: "Product Management · Externship", title: "BeReal — 3-Second Voice Note Reactions", challenge: "Text reactions feel impersonal on an authenticity-first platform", approach: "PRD-lite + screen flow mapping + clickable prototype", outcome: "Voice note feature balancing authenticity with engagement", techs: ["PRD", "Prototyping", "User Flows", "Product Strategy"], gradient: "linear-gradient(135deg, #1A1A2E, #3D3D6B)" },
    { num: "03", tags: "Creative · Musical Theatre", title: "Katotohanan — Original Filipino Musical", challenge: "Amplifying the untold struggles of the Philippines' indigenous communities to life through original musical theatre", approach: "Playwriting + production management + community casting", outcome: "Sparked conversation around power, truth, and oppression, 1,000+ attendees at PCN, Hollywood Fringe Festival production", techs: ["Playwright", "Director", "Producer", "Storytelling"], gradient: "linear-gradient(135deg, #6B2B3A, #8C4A5A)" },
  ];
  return (
    <div>
      <section style={{ paddingTop: "8rem", paddingBottom: "3rem" }}>
        <Reveal><div style={{ fontFamily: "var(--font-accent)", fontSize: "0.7rem", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1.5rem" }}>Selected Work</div></Reveal>
        <Reveal delay={0.1}><h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: 1.05, letterSpacing: "-0.03em", color: "var(--text)" }}>Projects &<br />Case Studies</h1></Reveal>
      </section>
      {projects.map(p => (
        <section key={p.num} style={{ padding: "4rem 0", borderTop: "1px solid var(--border)" }}>
          <Reveal delay={0.05}>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "3rem", alignItems: "start" }} className="responsive-grid">
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(3rem, 5vw, 5rem)", color: "var(--accent)", opacity: 0.2, lineHeight: 1, minWidth: 80 }}>{p.num}</div>
              <div>
                <div style={{ fontFamily: "var(--font-accent)", fontSize: "0.7rem", color: "var(--accent)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.8rem", fontWeight: 600 }}>{p.tags}</div>
                <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(1.5rem, 3vw, 2.2rem)", lineHeight: 1.2, marginBottom: "2rem", color: "var(--text)" }}>{p.title}</h2>
                <div style={{ width: "100%", aspectRatio: "16/8", borderRadius: 12, background: p.gradient, marginBottom: "2rem", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-accent)", fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.06em", textTransform: "uppercase" }}>project visual</div>
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
    { date: "January 2026 — Present", title: "Senior Capstone — sip'd", org: "CECS 491A · California State University, Long Beach", desc: (<><span>• Led end-to-end MVP development for a multi-dimensional cafe rating system (8 attributes × 5 user purposes); defined product requirements via user interviews, authored a full PRD, user flow docs, and operational playbooks that aligned a cross-functional team of 5.</span><br/><span>• Applied design thinking through persona research and use-case scenario mapping, translating raw interview data into actionable go-to-market positioning.</span></>) },
    { date: "January 2026 — March 2026", title: "Product Management Externship", org: "BeReal · Extern", desc: (<><span>• Generated 30 feature concepts using AI-assisted tools (Claude) and applied RICE prioritization scoring to identify the highest-value opportunity; validated all AI outputs before incorporating into product strategy.</span><br/><span>• Conducted competitive benchmarking across Instagram and Twitter (X), synthesizing engagement and retention data into a PRD-lite with annotated event logs, used to inform go-to-market positioning and stakeholder alignment.</span><br/><span>• Practiced and self-reviewed recorded pitch of the research-backed feature recommendation as final project, iterating on clarity and stakeholder framing to ensure the value proposition and supporting data were communicated concisely.</span></>) },
    { date: "May 2024 — May 2025", title: "Membership Chair", org: "Pilipino American Coalition · CSULB", desc: (<><span>• Owned strategy and execution for the Ate/Kuya/Ading mentorship program, recruiting and managing 300+ members, building pairing logic, coordinating timelines across 5 weeks, and serving as the primary internal communications lead for all participants.</span><br/><span>• Proactively approached problems by leading cabinet meetings, to clearly communicate issues, priorities, and action steps, ensuring alignment between an 18-person cabinet and 300+ general members.</span></>) },
    { date: "June 2023 — June 2025", title: "Playwright & Director — Katotohanan", org: "Pilipino Cultural Night · CSULB & Hollywood Fringe Festival 2025", desc: (<><span>• Wrote and directed an original Filipino musical performed for 1,000+ attendees, sparking conversation around power, truth, and oppression, while managing the full production lifecycle from concept through live performance across a 9-month timeline.</span><br/><span>• Led cross-functional collaboration across choreography, music, and technical crews, coordinating creative direction and iterating through structured feedback loops to hit all milestones on deadline.</span></>) },
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
        <Reveal delay={0.1}><h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: 1.05, letterSpacing: "-0.03em", color: "var(--text)" }}>Resume &<br />Experience</h1></Reveal>
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
        <Reveal delay={0.1}><h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: 1.05, letterSpacing: "-0.03em", color: "var(--text)", marginBottom: "2rem", maxWidth: 700 }}>Let's build<br />something <span style={{ color: "var(--accent)" }}>together</span>.</h1></Reveal>
        <Reveal delay={0.2}><p style={{ color: "var(--text-muted)", fontSize: "1.05rem", maxWidth: 500, lineHeight: 1.8, marginBottom: "3rem" }}>I'm currently looking for internships in UX research, product management, and software development. But I'm always looking to learn and connect—especially with those open to mentorship or just to have an insightful conversation!</p></Reveal>
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

/* ── MAIN ── */
export default function Portfolio() {
  const [page, setPage] = useState("home");
  const [transitioning, setTransitioning] = useState(false);
  const [mode, setMode] = useState("light");
  const t = themes[mode];
  const toggle = useCallback(() => setMode(m => m === "dark" ? "light" : "dark"), []);
  const navigate = useCallback((newPage) => {
    if (newPage === page) return;
    setTransitioning(true);
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
        @keyframes glowPulse { 0% { opacity: 0.4; transform: scale(1); } 100% { opacity: 0.8; transform: scale(1.1); } }
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
        {page === "work" && <WorkPage />}
        {page === "resume" && <ResumePage />}
        {page === "contact" && <ContactPage />}
        <footer style={{ padding: "3rem 0", borderTop: "1px solid var(--border)", textAlign: "center", marginTop: "4rem" }}>
          <span style={{ fontFamily: "var(--font-accent)", fontSize: "0.68rem", color: "var(--text-muted)", letterSpacing: "0.06em" }}>© 2026 Justine Alexa Dinglas — Made with <span style={{ color: "var(--accent)" }}>♥</span></span>
        </footer>
      </main>
    </ThemeCtx.Provider>
  );
}