import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";

/* ── THEME CONTEXT ── */
const ThemeCtx = createContext();
function useTheme() { return useContext(ThemeCtx); }

const themes = {
  dark: {
    bg: "#1A1214",
    bgDark: "#140E10",
    text: "#F2EBE5",
    textMuted: "#8A7E82",
    accent: "#C4647A",
    accentMuted: "rgba(196,100,122,0.15)",
    border: "rgba(242,235,229,0.08)",
    navBg: "rgba(20,14,16,0.92)",
    selBg: "#C4647A",
    selColor: "#1A1214",
  },
  light: {
    bg: "#FAF5F0",
    bgDark: "#F0EAE3",
    text: "#2A2025",
    textMuted: "#6B5E64",
    accent: "#7B2D3F",
    accentMuted: "rgba(123,45,63,0.08)",
    border: "rgba(42,32,37,0.1)",
    navBg: "rgba(240,234,227,0.92)",
    selBg: "#7B2D3F",
    selColor: "#FAF5F0",
  },
};

/* ── REVEAL ── */
function useReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function Reveal({ children, delay = 0, style = {} }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.7s cubic-bezier(0.4,0,0.2,1) ${delay}s, transform 0.7s cubic-bezier(0.4,0,0.2,1) ${delay}s`,
      ...style,
    }}>{children}</div>
  );
}

/* ── THEME TOGGLE ── */
function ThemeToggle() {
  const { mode, toggle } = useTheme();
  return (
    <button onClick={toggle} aria-label="Toggle theme" style={{
      background: "none", border: "1px solid var(--border)", borderRadius: 100,
      cursor: "pointer", padding: "0.4rem 0.75rem", display: "flex", alignItems: "center", gap: "0.4rem",
      fontFamily: "var(--font-accent)", fontSize: "0.62rem", letterSpacing: "0.08em",
      textTransform: "uppercase", color: "var(--text-muted)", transition: "border-color 0.3s, color 0.3s",
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; }}
    >
      {mode === "dark" ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      )}
      {mode === "dark" ? "Light" : "Dark"}
    </button>
  );
}

/* ── SIDEBAR NAV ── */
function Sidebar({ current, onNavigate }) {
  const [open, setOpen] = useState(false);
  const links = [
    { id: "home", label: "Home" },
    { id: "work", label: "Work" },
    { id: "resume", label: "Resume" },
    { id: "contact", label: "Contact" },
  ];
  const go = (id) => { setOpen(false); onNavigate(id); };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sidebar-desktop" style={{
        position: "fixed", top: 0, left: 0, width: 260, height: "100vh",
        background: "var(--bg-dark)", borderRight: "1px solid var(--border)",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        padding: "2.5rem 2rem", zIndex: 100, transition: "background 0.4s, border-color 0.4s",
      }}>
        <div>
          <button onClick={() => go("home")} style={{
            background: "none", border: "none", cursor: "pointer", padding: 0,
            fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 700, color: "var(--text)",
            letterSpacing: "-0.02em", marginBottom: "0.3rem", display: "block", textAlign: "left",
          }}>Justine Dinglas</button>
          <div style={{
            fontFamily: "var(--font-accent)", fontSize: "0.68rem", color: "var(--text-muted)",
            letterSpacing: "0.1em", textTransform: "uppercase",
          }}>Los Angeles, CA</div>
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>
          {links.map((l) => (
            <button key={l.id} onClick={() => go(l.id)} style={{
              background: "none", border: "none", cursor: "pointer", textAlign: "left",
              fontFamily: "var(--font-accent)", fontSize: "0.76rem", fontWeight: current === l.id ? 600 : 400,
              letterSpacing: "0.08em", textTransform: "uppercase",
              color: current === l.id ? "var(--accent)" : "var(--text-muted)",
              transition: "color 0.3s",
            }}>{l.label}</button>
          ))}
        </nav>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <ThemeToggle />
          <div style={{ display: "flex", gap: "1rem" }}>
            <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" style={{
              fontFamily: "var(--font-accent)", fontSize: "0.68rem", color: "var(--text-muted)",
              letterSpacing: "0.06em", textDecoration: "none", borderBottom: "1px solid var(--border)", paddingBottom: 2,
            }}>LinkedIn</a>
            <a href="https://github.com/yourprofile" target="_blank" rel="noopener noreferrer" style={{
              fontFamily: "var(--font-accent)", fontSize: "0.68rem", color: "var(--text-muted)",
              letterSpacing: "0.06em", textDecoration: "none", borderBottom: "1px solid var(--border)", paddingBottom: 2,
            }}>GitHub</a>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="mobile-header" style={{
        display: "none", position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "1rem 1.5rem", background: "var(--navBg)", backdropFilter: "blur(14px)",
        justifyContent: "space-between", alignItems: "center",
        borderBottom: "1px solid var(--border)", transition: "background 0.4s",
      }}>
        <button onClick={() => go("home")} style={{
          background: "none", border: "none", cursor: "pointer",
          fontFamily: "var(--font-display)", fontSize: "1.05rem", fontWeight: 700, color: "var(--text)",
        }}>Justine Dinglas</button>
        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
          <ThemeToggle />
          <button onClick={() => setOpen(!open)} style={{
            background: "none", border: "none", cursor: "pointer", padding: "0.4rem",
          }}>
            <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
              <line x1="0" y1="1" x2="22" y2="1" stroke="var(--text)" strokeWidth="1.5"/>
              <line x1="0" y1="8" x2="22" y2="8" stroke="var(--text)" strokeWidth="1.5"/>
              <line x1="0" y1="15" x2="22" y2="15" stroke="var(--text)" strokeWidth="1.5"/>
            </svg>
          </button>
        </div>
      </header>
      {open && (
        <div style={{
          position: "fixed", top: 52, left: 0, right: 0, bottom: 0, zIndex: 99,
          background: "var(--bg)", padding: "2rem",
          display: "flex", flexDirection: "column", gap: "1.8rem",
        }}>
          {links.map((l) => (
            <button key={l.id} onClick={() => go(l.id)} style={{
              background: "none", border: "none", cursor: "pointer", textAlign: "left",
              fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 700,
              color: current === l.id ? "var(--accent)" : "var(--text)",
            }}>{l.label}</button>
          ))}
        </div>
      )}
    </>
  );
}

/* ── HOME PAGE ── */
function HomePage({ onNavigate }) {
  return (
    <div>
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "6rem 0 4rem" }}>
        <Reveal>
          <div style={{ fontFamily: "var(--font-accent)", fontSize: "0.73rem", color: "var(--text-muted)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "2rem" }}>
            CS Student · Product · UX · Creative
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 style={{
            fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(3rem, 8vw, 6.5rem)",
            lineHeight: 1.0, letterSpacing: "-0.04em", color: "var(--text)", marginBottom: "2.5rem", maxWidth: 900,
          }}>
            PRODUCT<br />
            <span style={{ color: "var(--accent)" }}>THINKER</span> &<br />
            STORYTELLER
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap", marginBottom: "3rem" }}>
            {[["Portfolio 2026", "Los Angeles"], ["Selected Work", "3 projects"]].map(([a, b]) => (
              <div key={a}>
                <div style={{ fontFamily: "var(--font-accent)", fontSize: "0.63rem", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.3rem" }}>{a}</div>
                <div style={{ fontFamily: "var(--font-accent)", fontSize: "0.63rem", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{b}</div>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.3}>
          <p style={{ fontSize: "1.05rem", color: "var(--text-muted)", maxWidth: 520, lineHeight: 1.8 }}>
            Blending product thinking, UX research, and software development with creative storytelling. From writing a Filipino musical for 1,000+ people to shipping user-centered digital products.
          </p>
        </Reveal>
      </section>

      {/* About */}
      <section style={{ padding: "6rem 0", borderTop: "1px solid var(--border)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: "4rem", alignItems: "start" }} className="responsive-grid">
          <Reveal>
            <div>
              <div style={{ fontFamily: "var(--font-accent)", fontSize: "0.7rem", color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1.5rem", fontWeight: 600 }}>About</div>
              <div style={{
                aspectRatio: "3/4", borderRadius: 12, overflow: "hidden",
                background: "linear-gradient(135deg, var(--accent-muted), var(--accent-muted))",
                border: "1px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontFamily: "var(--font-accent)", fontSize: "0.73rem", color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>your photo here</span>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(1.8rem, 3vw, 2.4rem)", lineHeight: 1.15, marginBottom: "1.5rem", color: "var(--text)" }}>
                Justine Alexa Dinglas
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.98rem", lineHeight: 1.8, marginBottom: "1.2rem" }}>
                Computer Science student at Cal State Long Beach (graduating December 2026) at the intersection of technology and creative expression. My work spans product management, UX research, and front-end development.
              </p>
              <p style={{ color: "var(--text-muted)", fontSize: "0.98rem", lineHeight: 1.8, marginBottom: "1.2rem" }}>
                I wrote and produced <em style={{ color: "var(--text)" }}>Katotohanan</em>, an original Filipino musical for 1,000+ attendees at CSULB's Pilipino Cultural Night, later produced at the Hollywood Fringe Festival.
              </p>
              <p style={{ color: "var(--text-muted)", fontSize: "0.98rem", lineHeight: 1.8, marginBottom: "2rem" }}>
                As a leader in the Pilipino American Coalition, I've organized programs serving 300+ members and mentored through the Ate/Kuya/Ading program.
              </p>
              <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap" }}>
                {[{ n: "1,000+", l: "Musical Attendees" }, { n: "300+", l: "Members Mentored" }, { n: "Dec '26", l: "Graduation" }].map(s => (
                  <div key={s.l}>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.5rem", color: "var(--accent)", marginBottom: "0.2rem" }}>{s.n}</div>
                    <div style={{ fontFamily: "var(--font-accent)", fontSize: "0.63rem", color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* What I Do */}
      <section style={{ padding: "6rem 0", borderTop: "1px solid var(--border)" }}>
        <Reveal>
          <div style={{ fontFamily: "var(--font-accent)", fontSize: "0.7rem", color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "3rem", fontWeight: 600 }}>What I Do</div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }} className="responsive-three-col">
          {[
            { title: "Product Management", desc: "PRDs, prioritization frameworks, pressure-testing ideas, and translating user needs into features that matter." },
            { title: "UX Research & Design", desc: "User interviews, persona development, journey mapping, and flows grounded in real data." },
            { title: "Software Development", desc: "Front-end focused with a full-stack foundation. React, JavaScript, and clean, maintainable code." },
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
        <Reveal>
          <div style={{ fontFamily: "var(--font-accent)", fontSize: "0.7rem", color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "3rem", fontWeight: 600 }}>Beyond the Screen</div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }} className="responsive-three-col">
          {["Musical Theatre & Playwriting", "Filipino Culture & Community", "Creative & Fiction Writing", "Cafe Culture & Discovery", "Storytelling & Podcasting", "Mentorship & Youth Leadership"].map((item, i) => (
            <Reveal key={item} delay={i * 0.05}>
              <div style={{
                padding: "1.2rem 1.4rem", borderRadius: 8,
                border: "1px solid var(--border)", transition: "border-color 0.3s",
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
              >
                <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>{item}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ── WORK PAGE ── */
function WorkPage() {
  const projects = [
    {
      num: "01", tags: "Product Design · UX Research · Capstone", title: "sip'd — Cafe Discovery App",
      challenge: "College students struggle to find cafes matching their study/social needs",
      approach: "User interviews + persona development + iterative UX flows",
      outcome: "Community-first cafe discovery app with warm brand identity",
      techs: ["UX Research", "Persona Design", "Figma", "Team Lead"],
      gradient: "linear-gradient(135deg, #2D5A3D, #4A8C5E)",
    },
    {
      num: "02", tags: "Product Management · Externship", title: "BeReal — 3-Second Voice Note Reactions",
      challenge: "Text reactions feel impersonal on an authenticity-first platform",
      approach: "PRD-lite + screen flow mapping + clickable prototype",
      outcome: "Voice note feature balancing authenticity with engagement",
      techs: ["PRD", "Prototyping", "User Flows", "Product Strategy"],
      gradient: "linear-gradient(135deg, #1A1A2E, #3D3D6B)",
    },
    {
      num: "03", tags: "Creative · Musical Theatre", title: "Katotohanan — Original Filipino Musical",
      challenge: "Telling an authentic Filipino story through original musical theatre",
      approach: "Original playwriting + production management + community casting",
      outcome: "1,000+ attendees at PCN, Hollywood Fringe Festival production",
      techs: ["Playwright", "Producer", "Storytelling", "Hollywood Fringe"],
      gradient: "linear-gradient(135deg, #6B2B3A, #8C4A5A)",
    },
  ];

  return (
    <div>
      <section style={{ paddingTop: "6rem", paddingBottom: "3rem" }}>
        <Reveal>
          <div style={{ fontFamily: "var(--font-accent)", fontSize: "0.7rem", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "2rem" }}>Selected Work</div>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 style={{
            fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            lineHeight: 1.05, letterSpacing: "-0.03em", color: "var(--text)", marginBottom: "1rem",
          }}>Projects &<br />Case Studies</h1>
        </Reveal>
      </section>

      {projects.map((p) => (
        <section key={p.num} style={{ padding: "4rem 0", borderTop: "1px solid var(--border)" }}>
          <Reveal delay={0.05}>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "3rem", alignItems: "start" }} className="responsive-grid">
              <div style={{
                fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(3rem, 5vw, 5rem)",
                color: "var(--accent)", opacity: 0.25, lineHeight: 1, minWidth: 80,
              }}>{p.num}</div>
              <div>
                <div style={{ fontFamily: "var(--font-accent)", fontSize: "0.7rem", color: "var(--accent)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.8rem", fontWeight: 600 }}>{p.tags}</div>
                <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(1.5rem, 3vw, 2.2rem)", lineHeight: 1.2, marginBottom: "2rem", color: "var(--text)" }}>{p.title}</h2>
                <div style={{
                  width: "100%", aspectRatio: "16/8", borderRadius: 12,
                  background: p.gradient, marginBottom: "2rem",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-accent)", fontSize: "0.78rem", color: "rgba(255,255,255,0.4)",
                  letterSpacing: "0.06em", textTransform: "uppercase",
                }}>project visual</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem", marginBottom: "2rem" }} className="responsive-three-col">
                  {[
                    { label: "Challenge", val: p.challenge },
                    { label: "Approach", val: p.approach },
                    { label: "Outcome", val: p.outcome },
                  ].map(d => (
                    <div key={d.label}>
                      <div style={{ fontFamily: "var(--font-accent)", fontSize: "0.63rem", color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem", fontWeight: 600 }}>{d.label}</div>
                      <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.65 }}>{d.val}</p>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {p.techs.map(t => (
                    <span key={t} style={{
                      fontFamily: "var(--font-accent)", fontSize: "0.66rem", padding: "0.35rem 0.9rem",
                      borderRadius: 100, border: "1px solid var(--border)", color: "var(--text-muted)", letterSpacing: "0.04em",
                    }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      ))}
    </div>
  );
}

/* ── RESUME PAGE ── */
function ResumePage() {
  const experience = [
    { date: "2024 — Present", title: "Senior Capstone — sip'd", org: "CECS 491A · Cal State Long Beach", desc: "Leading product development for a cafe discovery app. User interviews, personas, UX flows, 5-person engineering team." },
    { date: "2024", title: "PM Externship — BeReal Feature", org: "Product Management Externship", desc: "PRD-lite and clickable prototype for 3-second voice note reactions. Screen flows and product strategy." },
    { date: "2022 — 2024", title: "Membership Chair & Leader", org: "Pilipino American Coalition · CSULB", desc: "Ate/Kuya/Ading mentorship program (300+ members), Kapatids Month, large-scale cultural events." },
    { date: "2023", title: "Playwright & Producer", org: "Katotohanan · CSULB PCN & Hollywood Fringe", desc: "Original Filipino musical, 1,000+ attendees. Secured Executive Producer for Hollywood Fringe." },
  ];
  const skills = [
    { category: "Product", items: ["PRDs & Roadmaps", "User Research", "A/B Testing", "Prioritization", "Stakeholder Mgmt"] },
    { category: "Design", items: ["Figma", "Wireframing", "Prototyping", "User Flows", "Journey Mapping"] },
    { category: "Engineering", items: ["React", "JavaScript", "HTML/CSS", "Python", "Git"] },
    { category: "Leadership", items: ["Community Org", "Mentorship", "Event Production", "Cross-functional"] },
  ];

  return (
    <div>
      <section style={{ paddingTop: "6rem", paddingBottom: "3rem" }}>
        <Reveal>
          <div style={{ fontFamily: "var(--font-accent)", fontSize: "0.7rem", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "2rem" }}>My Journey</div>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 style={{
            fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            lineHeight: 1.05, letterSpacing: "-0.03em", color: "var(--text)", marginBottom: "1rem",
          }}>Resume &<br />Experience</h1>
        </Reveal>
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
        <Reveal>
          <div style={{ fontFamily: "var(--font-accent)", fontSize: "0.7rem", color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "2.5rem", fontWeight: 600 }}>Experience</div>
        </Reveal>
        {experience.map((t, i) => (
          <Reveal key={t.title} delay={i * 0.06}>
            <div style={{
              display: "grid", gridTemplateColumns: "180px 1fr", gap: "2rem",
              paddingBottom: "2.5rem", marginBottom: "2.5rem",
              borderBottom: i < experience.length - 1 ? "1px solid var(--border)" : "none",
            }} className="responsive-grid">
              <div style={{ fontFamily: "var(--font-accent)", fontSize: "0.72rem", color: "var(--text-muted)", letterSpacing: "0.06em", paddingTop: "0.15rem" }}>{t.date}</div>
              <div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.15rem", marginBottom: "0.2rem", color: "var(--text)" }}>{t.title}</h3>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.6rem", fontStyle: "italic" }}>{t.org}</div>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.7 }}>{t.desc}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </section>

      <section style={{ padding: "3rem 0", borderTop: "1px solid var(--border)" }}>
        <Reveal>
          <div style={{ fontFamily: "var(--font-accent)", fontSize: "0.7rem", color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "2.5rem", fontWeight: 600 }}>Skills & Tools</div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2rem" }} className="responsive-four-col">
          {skills.map((s, i) => (
            <Reveal key={s.category} delay={i * 0.06}>
              <div>
                <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.95rem", marginBottom: "1rem", color: "var(--accent)" }}>{s.category}</h4>
                {s.items.map(item => (
                  <div key={item} style={{ fontSize: "0.85rem", color: "var(--text-muted)", padding: "0.5rem 0", borderBottom: "1px solid var(--border)" }}>{item}</div>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ── CONTACT PAGE ── */
function ContactPage() {
  return (
    <div>
      <section style={{ paddingTop: "6rem", minHeight: "80vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <Reveal>
          <div style={{ fontFamily: "var(--font-accent)", fontSize: "0.7rem", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "2rem" }}>Get in Touch</div>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 style={{
            fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            lineHeight: 1.05, letterSpacing: "-0.03em", color: "var(--text)", marginBottom: "2rem", maxWidth: 700,
          }}>Let's build<br />something <span style={{ color: "var(--accent)" }}>together</span>.</h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", maxWidth: 500, lineHeight: 1.8, marginBottom: "3rem" }}>
            I'm currently looking for internships in product management, UX research, and software development. I'd love to hear from you.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            {[
              { label: "Email", href: "mailto:your@email.com", val: "your@email.com" },
              { label: "LinkedIn", href: "https://linkedin.com/in/yourprofile", val: "linkedin.com/in/yourprofile" },
              { label: "GitHub", href: "https://github.com/yourprofile", val: "github.com/yourprofile" },
            ].map(c => (
              <div key={c.label} style={{ display: "flex", gap: "2rem", alignItems: "baseline" }}>
                <div style={{ fontFamily: "var(--font-accent)", fontSize: "0.63rem", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", width: 80 }}>{c.label}</div>
                <a href={c.href} target={c.href.startsWith("mailto") ? undefined : "_blank"} rel="noopener noreferrer" style={{
                  color: "var(--text)", fontSize: "1rem", textDecoration: "none",
                  borderBottom: "1px solid var(--border)", paddingBottom: 2, transition: "color 0.3s, border-color 0.3s",
                }}
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

/* ── MAIN APP ── */
export default function Portfolio() {
  const [page, setPage] = useState("home");
  const [transitioning, setTransitioning] = useState(false);
  const [mode, setMode] = useState("dark");
  const t = themes[mode];

  const toggle = useCallback(() => setMode(m => m === "dark" ? "light" : "dark"), []);

  const navigate = useCallback((newPage) => {
    if (newPage === page) return;
    setTransitioning(true);
    setTimeout(() => {
      setPage(newPage);
      const el = document.getElementById("main-content");
      if (el) el.scrollTop = 0;
      window.scrollTo({ top: 0, behavior: "instant" });
      setTimeout(() => setTransitioning(false), 50);
    }, 350);
  }, [page]);

  return (
    <ThemeCtx.Provider value={{ mode, toggle }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Manrope:wght@300;400;500;600&family=Archivo:wght@400;500;600&display=swap');
        :root {
          --bg: ${t.bg};
          --bg-dark: ${t.bgDark};
          --text: ${t.text};
          --text-muted: ${t.textMuted};
          --accent: ${t.accent};
          --accent-muted: ${t.accentMuted};
          --border: ${t.border};
          --navBg: ${t.navBg};
          --font-display: 'Sora', sans-serif;
          --font-body: 'Manrope', sans-serif;
          --font-accent: 'Archivo', sans-serif;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body, #root { height: 100%; }
        body {
          font-family: var(--font-body);
          background: var(--bg);
          color: var(--text);
          line-height: 1.7;
          font-weight: 300;
          transition: background 0.4s, color 0.4s;
        }
        ::selection { background: ${t.selBg}; color: ${t.selColor}; }
        a { text-decoration: none; }

        @media (max-width: 900px) {
          .sidebar-desktop { display: none !important; }
          .mobile-header { display: flex !important; }
          .main-area { margin-left: 0 !important; padding: 0 1.5rem !important; padding-top: 4rem !important; }
          .responsive-grid { grid-template-columns: 1fr !important; }
          .responsive-three-col { grid-template-columns: 1fr !important; }
          .responsive-four-col { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      <Sidebar current={page} onNavigate={navigate} />

      <main id="main-content" className="main-area" style={{
        marginLeft: 260, padding: "0 4rem", minHeight: "100vh",
        opacity: transitioning ? 0 : 1,
        transform: transitioning ? "translateY(10px)" : "translateY(0)",
        transition: "opacity 0.35s ease, transform 0.35s ease",
      }}>
        {page === "home" && <HomePage onNavigate={navigate} />}
        {page === "work" && <WorkPage />}
        {page === "resume" && <ResumePage />}
        {page === "contact" && <ContactPage />}

        <footer style={{ padding: "3rem 0", borderTop: "1px solid var(--border)", textAlign: "left", marginTop: "4rem" }}>
          <span style={{ fontFamily: "var(--font-accent)", fontSize: "0.68rem", color: "var(--text-muted)", letterSpacing: "0.06em" }}>
            © 2026 Justine Alexa Dinglas — Made with <span style={{ color: "var(--accent)" }}>♥</span>
          </span>
        </footer>
      </main>
    </ThemeCtx.Provider>
  );
}
