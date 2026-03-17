import { useState, useEffect, useRef, useCallback, Component } from "react";

// ─── SPOTLIGHT HOOK ───────────────────────────────────────────
function useSpotlight() {
  const [idx, setIdx] = useState(-1);
  const bind = (i) => ({
    onMouseEnter: () => setIdx(i),
    onMouseLeave: () => setIdx(-1),
  });
  const style = (i) => ({
    transition: "all 0.42s cubic-bezier(0.25,0.46,0.45,0.94)",
    filter: idx >= 0 && idx !== i ? "blur(2px) brightness(0.8) saturate(0.4)" : "none",
    transform: idx === i ? "translateY(-16px) scale(1.04)" : idx >= 0 ? "scale(0.96)" : "none",
    zIndex: idx === i ? 20 : 1,
    position: "relative",
    boxShadow: idx === i
      ? "0 30px 80px rgba(14,165,233,0.28), 0 0 0 1px rgba(56,189,248,0.38)"
      : "none",
  });
  return { idx, bind, style };
}

// ─── ERROR BOUNDARY ───────────────────────────────────────────
class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return (
      <div style={{ padding:"2rem", textAlign:"center", color:"#64748B",
        background:"rgba(14,165,233,0.04)", borderRadius:"14px",
        border:"1px solid rgba(14,165,233,0.15)" }}>
        <div style={{ fontSize:"2rem", marginBottom:".5rem" }}>⚠️</div>
        <p style={{ marginBottom:".75rem", fontSize:".9rem" }}>Render failed.</p>
        <button onClick={() => this.setState({ hasError:false })} style={{
          padding:".4rem 1rem", borderRadius:"8px", background:"rgba(14,165,233,0.1)",
          border:"1px solid rgba(14,165,233,0.22)", color:"#0EA5E9", cursor:"pointer" }}>Retry</button>
      </div>
    );
    return this.props.children;
  }
}

// ─── GLOBAL STYLES ────────────────────────────────────────────
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;800&family=Nunito:wght@400;500;600;700;800&family=Fira+Code:wght@400;500;600&display=swap');

:root {
  --primary: #0EA5E9;
  --lavender: #38BDF8;
  --teal: #0284C7;
  --magenta: #6366F1;
  --gold: #F59E0B;
  --violet: #0369A1;
  --rose: #EF4444;
  --bg: #F0F9FF;
  --bg2: #E0F2FE;
  --card: rgba(255,255,255,0.92);
  --border: rgba(14,165,233,0.18);
  --text: #0C1A2E;
  --muted: #64748B;
  --grad: linear-gradient(135deg,#0369A1 0%,#0EA5E9 50%,#38BDF8 100%);
  --grad2: linear-gradient(135deg,#6366F1 0%,#0EA5E9 100%);
  --grad3: linear-gradient(135deg,#0284C7 0%,#7DD3FC 100%);
  --glow: 0 0 60px rgba(14,165,233,0.2);
  --glow-teal: 0 0 60px rgba(2,132,199,0.18);
}

*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
html { scroll-behavior:smooth; }
body { font-family:'Nunito',sans-serif; background:var(--bg); color:var(--text); overflow-x:hidden; }

/* ── BG BLOBS ── */
.bg-canvas { position:fixed; inset:0; z-index:0; pointer-events:none; overflow:hidden; }
.bg-blob { position:absolute; border-radius:50%; filter:blur(130px); }
.bg-blob-1 { width:700px; height:700px; background:radial-gradient(circle,#38BDF8 0%,transparent 70%);
  top:-250px; left:-200px; opacity:0.14; animation:blobDrift1 16s ease-in-out infinite; }
.bg-blob-2 { width:600px; height:600px; background:radial-gradient(circle,#BAE6FD 0%,transparent 70%);
  bottom:-200px; right:-150px; opacity:0.13; animation:blobDrift2 20s ease-in-out infinite; }
.bg-blob-3 { width:450px; height:450px; background:radial-gradient(circle,#0EA5E9 0%,transparent 70%);
  top:40%; left:55%; opacity:0.08; animation:blobDrift3 24s ease-in-out infinite; }
.bg-blob-4 { width:350px; height:350px; background:radial-gradient(circle,#7DD3FC 0%,transparent 70%);
  top:60%; left:10%; opacity:0.09; animation:blobDrift4 18s ease-in-out infinite; }
@keyframes blobDrift1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(60px,-80px) scale(1.1)} 66%{transform:translate(-40px,50px) scale(0.92)} }
@keyframes blobDrift2 { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(-70px,60px) scale(1.08)} 70%{transform:translate(40px,-40px) scale(0.95)} }
@keyframes blobDrift3 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-90px,-70px) scale(1.15)} }
@keyframes blobDrift4 { 0%,100%{transform:translate(0,0) scale(1)} 45%{transform:translate(80px,-60px) scale(1.1)} }
.bg-canvas::after { content:''; position:absolute; inset:0;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  opacity:0.018; pointer-events:none; }

/* ── VARIED ANIMATION KEYFRAMES ── */
@keyframes slideFromLeft { from{transform:translateX(-70px) scale(0.94);opacity:0} to{transform:none;opacity:1} }
@keyframes slideFromRight { from{transform:translateX(70px) scale(0.94);opacity:0} to{transform:none;opacity:1} }
@keyframes flipFromLeft { from{transform:perspective(700px) rotateY(-75deg) scale(0.85);opacity:0} to{transform:perspective(700px) rotateY(0) scale(1);opacity:1} }
@keyframes flipFromRight { from{transform:perspective(700px) rotateY(75deg) scale(0.85);opacity:0} to{transform:perspective(700px) rotateY(0) scale(1);opacity:1} }
@keyframes bounceIn { 0%{transform:scale(0.3);opacity:0} 55%{transform:scale(1.1);opacity:1} 78%{transform:scale(0.94)} 100%{transform:scale(1);opacity:1} }
@keyframes popRotateCW { 0%{transform:scale(0) rotate(-28deg);opacity:0} 65%{transform:scale(1.12) rotate(5deg);opacity:1} 100%{transform:scale(1) rotate(0);opacity:1} }
@keyframes popRotateCCW { 0%{transform:scale(0) rotate(28deg);opacity:0} 65%{transform:scale(1.12) rotate(-5deg);opacity:1} 100%{transform:scale(1) rotate(0);opacity:1} }
@keyframes expandCenter { 0%{transform:scale(0.5) translateY(22px);opacity:0} 65%{transform:scale(1.06) translateY(-4px);opacity:1} 100%{transform:none;opacity:1} }
@keyframes dropBounce { 0%{transform:translateY(-55px) scale(0.8);opacity:0} 60%{transform:translateY(10px) scale(1.05);opacity:1} 80%{transform:translateY(-5px)} 100%{transform:none;opacity:1} }
@keyframes rollIn { from{transform:translateX(-60px) rotate(-18deg);opacity:0} to{transform:none;opacity:1} }
@keyframes rollInR { from{transform:translateX(60px) rotate(18deg);opacity:0} to{transform:none;opacity:1} }
@keyframes twBlink { 0%,50%{opacity:1} 51%,100%{opacity:0} }
@keyframes cursorPulse { 0%,100%{transform:scaleY(1)} 50%{transform:scaleY(0.2)} }

.tw-cursor {
  display:inline-block; color:var(--lavender); font-weight:300;
  animation:twBlink .75s step-end infinite; margin-left:2px;
}

/* ── NAVBAR ── */
.navbar { position:fixed; top:0; left:0; right:0; z-index:1000;
  display:flex; justify-content:space-between; align-items:center;
  padding:1.1rem 2.5rem;
  background:rgba(255,255,255,0.9); backdrop-filter:blur(28px) saturate(200%);
  border-bottom:1px solid rgba(14,165,233,0.15);
  transition:all 0.4s ease; }
.navbar.scrolled { padding:.7rem 2.5rem; background:rgba(255,255,255,0.98);
  box-shadow:0 4px 32px rgba(2,132,199,0.1), 0 1px 0 rgba(14,165,233,0.12); }
.brand { font-family:'Bebas Neue',sans-serif; font-size:1.75rem; letter-spacing:2px;
  background:var(--grad); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
  cursor:pointer; border:none; background-color:transparent; }
.nav-links { display:flex; gap:.12rem; align-items:center; }
.nav-links a { color:var(--muted); text-decoration:none; font-weight:700; font-size:.84rem;
  padding:.44rem .9rem; border-radius:10px; letter-spacing:.5px;
  transition:all .25s ease; cursor:pointer; border:none; background:none;
  font-family:'Barlow',sans-serif; text-transform:uppercase; }
.nav-links a:hover { color:var(--primary); background:rgba(14,165,233,0.08); }
.nav-links a.active { color:var(--primary); background:rgba(14,165,233,0.1); }
.nav-cta { background:var(--grad) !important; color:#ffffff !important;
  -webkit-text-fill-color:#ffffff !important;
  padding:.44rem 1.15rem !important; border-radius:10px; font-weight:800 !important; }
.nav-cta:hover { transform:translateY(-2px) !important; box-shadow:0 8px 30px rgba(14,165,233,0.38) !important; }
.hamburger { display:none; flex-direction:column; gap:5px; background:none; border:none; cursor:pointer; padding:4px; }
.hamburger span { display:block; width:24px; height:2px; background:var(--text); border-radius:2px; transition:all .35s ease; }
.hamburger.open span:nth-child(1) { transform:rotate(45deg) translate(5px,5px); }
.hamburger.open span:nth-child(2) { opacity:0; transform:scaleX(0); }
.hamburger.open span:nth-child(3) { transform:rotate(-45deg) translate(5px,-5px); }

/* ── BUTTONS ── */
.btn { display:inline-flex; align-items:center; justify-content:center; gap:.5rem;
  padding:.9rem 2.1rem; border-radius:14px; border:none;
  font-family:'Barlow',sans-serif; font-weight:800; font-size:.95rem;
  cursor:pointer; text-decoration:none; letter-spacing:.5px;
  transition:all .32s cubic-bezier(.25,.46,.45,.94);
  position:relative; overflow:hidden; text-transform:uppercase; }
.btn::after { content:''; position:absolute; inset:0; background:rgba(255,255,255,0); transition:background .3s; }
.btn:hover::after { background:rgba(255,255,255,0.1); }
.btn-primary { background:var(--grad); color:#ffffff; box-shadow:0 4px 28px rgba(14,165,233,0.32); }
.btn-primary:hover { transform:translateY(-4px) scale(1.02); box-shadow:0 14px 45px rgba(14,165,233,0.52); }
.btn-primary:active { transform:translateY(-1px); }
.btn-ghost { background:rgba(14,165,233,0.08); color:var(--text); border:1px solid rgba(14,165,233,0.2); }
.btn-ghost:hover { background:rgba(14,165,233,0.16); border-color:rgba(14,165,233,0.42); transform:translateY(-4px); }
.btn-teal { background:rgba(2,132,199,0.1); color:#0284C7; border:1px solid rgba(2,132,199,0.22); }
.btn-teal:hover { background:rgba(2,132,199,0.18); transform:translateY(-4px); box-shadow:0 8px 30px rgba(2,132,199,0.2); }
.btn-magenta { background:rgba(99,102,241,0.1); color:#6366F1; border:1px solid rgba(99,102,241,0.22); }
.btn-magenta:hover { background:rgba(99,102,241,0.18); transform:translateY(-4px); }
.btn-sm { padding:.54rem 1.15rem; font-size:.8rem; border-radius:10px; }

/* ── UTIL ── */
.page-wrap { min-height:100vh; position:relative; }
.page-enter { animation:expandCenter .55s cubic-bezier(.25,.46,.45,.94) both; }
.s-label { font-family:'Fira Code',monospace; color:var(--primary); font-size:.72rem;
  font-weight:600; letter-spacing:3.5px; text-transform:uppercase; display:inline-block; }
.s-title { font-family:'Bebas Neue',sans-serif; font-size:clamp(2.4rem,5vw,3.8rem); letter-spacing:2px; line-height:1.05; }
.s-sub { color:var(--muted); font-size:.98rem; max-width:520px; line-height:1.8; }
.grad-text { background:var(--grad); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.teal-text { color:var(--teal); }

/* ── HERO ── */
.hero { min-height:100vh; display:flex; flex-direction:column;
  justify-content:center; align-items:center; text-align:center;
  padding:8rem 2rem 4rem; position:relative; z-index:1; }
.hero-badge { display:inline-flex; align-items:center; gap:.6rem;
  background:rgba(14,165,233,0.1); border:1px solid rgba(14,165,233,0.3);
  color:var(--primary); font-size:.72rem; font-weight:600;
  padding:.38rem 1.1rem; border-radius:50px; margin-bottom:2.5rem;
  animation:dropBounce .9s ease .2s both; letter-spacing:2.5px;
  font-family:'Fira Code',monospace; text-transform:uppercase; }
.badge-dot { width:7px; height:7px; border-radius:50%; background:var(--teal); animation:pulseBlue 2s infinite; flex-shrink:0; }
@keyframes pulseBlue { 0%,100%{box-shadow:0 0 0 0 rgba(14,165,233,.7);} 50%{box-shadow:0 0 0 8px rgba(14,165,233,0);} }

.hero-icon { font-size:6rem; margin-bottom:1.5rem; display:block;
  animation:heroIconFloat 5s ease-in-out infinite;
  filter:drop-shadow(0 0 35px rgba(14,165,233,.45)) drop-shadow(0 0 70px rgba(56,189,248,.22)); }
@keyframes heroIconFloat { 0%,100%{transform:translateY(0) rotate(-4deg) scale(1);}
  25%{transform:translateY(-10px) rotate(0deg) scale(1.02);}
  50%{transform:translateY(-28px) rotate(4deg) scale(1.04);}
  75%{transform:translateY(-12px) rotate(0deg) scale(1.01);} }

.hero h1 { font-family:'Bebas Neue',sans-serif;
  font-size:clamp(3.5rem,9vw,7rem); font-weight:400; line-height:1.05; letter-spacing:4px;
  margin-bottom:1.5rem; min-height:2.1em; color:var(--text); }
.hero-sub { font-size:clamp(1rem,2.5vw,1.22rem); color:var(--muted);
  max-width:560px; margin:0 auto 3rem; line-height:1.85;
  animation:slideFromLeft .9s ease .8s both; font-weight:600; }
.hero-btns { display:flex; gap:1rem; flex-wrap:wrap; justify-content:center;
  animation:expandCenter .8s cubic-bezier(.34,1.56,.64,1) 1s both; }
.scroll-hint { position:absolute; bottom:2.5rem; left:50%; transform:translateX(-50%);
  display:flex; flex-direction:column; align-items:center; gap:.4rem;
  color:var(--muted); font-size:.7rem; letter-spacing:2px;
  font-family:'Fira Code',monospace; animation:slideFromLeft 1s ease 1.6s both; }
.scroll-arrow { animation:scrollBounce 1.5s ease-in-out infinite; color:var(--primary); font-size:1.1rem; }
@keyframes scrollBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(10px)} }

/* ── STATS ── */
.stats-row { display:flex; justify-content:center; flex-wrap:wrap;
  border-top:1px solid rgba(14,165,233,0.14);
  border-bottom:1px solid rgba(14,165,233,0.14);
  background:rgba(255,255,255,0.85); position:relative; z-index:1; }
.stat-item { flex:1; min-width:180px; text-align:center; padding:2.2rem 1.5rem;
  border-right:1px solid rgba(14,165,233,0.1);
  transition:background .35s, transform .35s;
  cursor:default; position:relative; overflow:hidden; }
.stat-item::before { content:''; position:absolute; inset:0;
  background:radial-gradient(circle at 50% 0%, rgba(14,165,233,0.08) 0%, transparent 70%);
  opacity:0; transition:opacity .35s; }
.stat-item:hover::before { opacity:1; }
.stat-item:hover { transform:translateY(-3px); }
.stat-item:last-child { border-right:none; }
.stat-num { font-family:'Bebas Neue',sans-serif; font-size:3rem; letter-spacing:2px; display:block;
  background:var(--grad); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.stat-label { color:var(--muted); font-size:.82rem; margin-top:.1rem; font-weight:700;
  letter-spacing:.5px; text-transform:uppercase; font-family:'Barlow',sans-serif; }

/* ── FEATURES ── */
.features-section { padding:7rem 2rem; max-width:1260px; margin:0 auto; position:relative; z-index:1; }
.feat-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); gap:1.4rem; margin-top:3.5rem; }
.feat-card { background:rgba(255,255,255,0.95); border:1px solid rgba(14,165,233,0.15);
  border-radius:22px; padding:2.6rem; cursor:default; backdrop-filter:blur(14px);
  position:relative; overflow:hidden; box-shadow:0 2px 18px rgba(2,132,199,0.07); }
.feat-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px;
  background:var(--grad); opacity:0; transition:opacity .4s; }
.feat-card:hover::before { opacity:1; }
.feat-card > * { position:relative; z-index:1; }
.feat-icon { width:58px; height:58px; border-radius:18px;
  background:rgba(14,165,233,0.1); border:1px solid rgba(14,165,233,0.2);
  display:flex; align-items:center; justify-content:center; font-size:1.6rem;
  margin-bottom:1.6rem;
  transition:transform .5s cubic-bezier(.34,1.56,.64,1), box-shadow .4s, border-color .4s; }
.feat-card:hover .feat-icon { transform:scale(1.15) rotate(8deg);
  box-shadow:0 8px 30px rgba(14,165,233,0.28); border-color:rgba(14,165,233,0.42); }
.feat-card h3 { font-family:'Barlow',sans-serif; font-size:1.15rem; font-weight:800;
  margin-bottom:.7rem; letter-spacing:.2px; text-transform:uppercase; color:var(--text); }
.feat-card p { color:var(--muted); font-size:.9rem; line-height:1.75; margin:0; }
.feat-link { display:inline-flex; align-items:center; gap:.4rem;
  color:var(--teal); font-size:.8rem; font-weight:700; margin-top:1.3rem;
  cursor:pointer; border:none; background:none; font-family:'Barlow',sans-serif;
  transition:gap .3s, color .3s; padding:0; text-transform:uppercase; letter-spacing:1px; }
.feat-link:hover { gap:.9rem; color:var(--primary); }

/* ── UNBOXING HOVER PANEL ── */
.feat-unbox { position:absolute; bottom:0; left:0; right:0; padding:1rem 1.6rem;
  background:linear-gradient(to top, rgba(14,165,233,0.14) 0%, rgba(56,189,248,0.04) 100%);
  border-top:1px solid rgba(56,189,248,0.2);
  border-radius:0 0 22px 22px;
  transform:translateY(100%);
  transition:transform .42s cubic-bezier(.25,.46,.45,.94);
  backdrop-filter:blur(12px); z-index:5; }
.feat-card:hover .feat-unbox { transform:translateY(0); }
.feat-unbox-row { display:flex; align-items:center; gap:.5rem;
  font-size:.72rem; color:#0284C7; font-family:'Fira Code',monospace;
  padding:.2rem 0; letter-spacing:.4px; }
.feat-unbox-row::before { content:'▸'; color:var(--primary); font-size:.62rem; }

/* ── HOW IT WORKS ── */
.how-section { padding:5rem 2rem; max-width:1060px; margin:0 auto; position:relative; z-index:1; }
.steps-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:2rem; margin-top:3.5rem; }
.step-item { text-align:center; padding:2rem 1.5rem; position:relative; }
.step-num { width:56px; height:56px; border-radius:50%; background:var(--grad);
  display:flex; align-items:center; justify-content:center;
  font-family:'Bebas Neue',sans-serif; font-size:1.4rem; letter-spacing:1px;
  margin:0 auto 1.3rem; box-shadow:0 8px 30px rgba(14,165,233,.4); color:#ffffff;
  transition:transform .5s cubic-bezier(.34,1.56,.64,1), box-shadow .4s; }
.step-item:hover .step-num { transform:scale(1.15) rotate(8deg); box-shadow:0 12px 45px rgba(14,165,233,.58); }
.step-item h3 { font-family:'Barlow',sans-serif; font-weight:800; margin-bottom:.4rem; font-size:1rem; text-transform:uppercase; letter-spacing:.5px; color:var(--text); }
.step-item p { color:var(--muted); font-size:.88rem; }

/* ── CTA ── */
.cta-section { max-width:800px; margin:2rem auto 6rem;
  background:linear-gradient(135deg,#0C2D48 0%,#0369A1 100%);
  border:1px solid rgba(14,165,233,0.2);
  border-radius:28px; padding:4.5rem; text-align:center;
  position:relative; overflow:hidden; z-index:1; backdrop-filter:blur(14px); }
.cta-section::before { content:''; position:absolute; inset:0;
  background:radial-gradient(ellipse at 50% 110%,rgba(56,189,248,.22) 0%,transparent 65%); pointer-events:none; }
.cta-section h2 { font-family:'Bebas Neue',sans-serif; font-size:2.8rem; letter-spacing:3px; margin-bottom:1rem; color:#ffffff; }
.cta-section p { color:rgba(255,255,255,0.75); margin-bottom:2.5rem; font-size:1.05rem; }

/* ── DASHBOARD ── */
.main-wrap { max-width:1260px; margin:0 auto; padding:7.5rem 2rem 4rem; }
.page-head { margin-bottom:2.5rem; }
.page-welcome { color:var(--muted); font-size:.75rem; margin-bottom:.3rem;
  font-family:'Fira Code',monospace; letter-spacing:2px; text-transform:uppercase; }
.page-head h1 { font-family:'Bebas Neue',sans-serif; font-size:clamp(2.2rem,5vw,3.4rem);
  letter-spacing:2px; background:var(--grad); -webkit-background-clip:text;
  -webkit-text-fill-color:transparent; background-clip:text; }
.qs-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(155px,1fr)); gap:1rem; margin-bottom:2.5rem; }
.qs-card { background:rgba(255,255,255,0.97); border:1px solid rgba(14,165,233,0.15);
  border-radius:16px; padding:1.5rem; display:flex; flex-direction:column; gap:.4rem;
  transition:all .35s cubic-bezier(.34,1.56,.64,1); backdrop-filter:blur(10px); cursor:default;
  box-shadow:0 2px 12px rgba(2,132,199,0.07); }
.qs-card:hover { border-color:rgba(14,165,233,.4); box-shadow:0 14px 45px rgba(14,165,233,.12);
  transform:translateY(-6px); }
.qs-icon { font-size:1.6rem; }
.qs-num { font-family:'Bebas Neue',sans-serif; font-size:1.8rem; letter-spacing:2px; color:var(--primary); }
.qs-label { color:var(--muted); font-size:.75rem; font-weight:700; text-transform:uppercase;
  letter-spacing:.8px; font-family:'Barlow',sans-serif; }

.dash-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); gap:1.5rem; }
.dash-card { background:rgba(255,255,255,0.97); border:1px solid rgba(14,165,233,0.15);
  border-radius:26px; padding:2.6rem; text-align:center; position:relative;
  overflow:hidden; backdrop-filter:blur(16px);
  box-shadow:0 4px 24px rgba(2,132,199,0.08); }
.dash-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px;
  opacity:0; transition:opacity .4s; }
.card-stripe-orange::before { background:var(--grad); }
.card-stripe-teal::before { background:var(--grad3); }
.card-stripe-magenta::before { background:var(--grad2); }
.dash-card:hover::before { opacity:1; }
.card-glow-orb { position:absolute; width:180px; height:180px; border-radius:50%;
  top:-50px; right:-50px; opacity:0.04; filter:blur(50px); transition:all .5s; }
.dash-card:hover .card-glow-orb { opacity:0.1; transform:scale(1.3); }
.dash-card-icon { font-size:3.8rem; margin-bottom:1.3rem; display:inline-block;
  transition:transform .55s cubic-bezier(.34,1.56,.64,1), filter .4s; }
.dash-card:hover .dash-card-icon { transform:scale(1.15) rotate(-5deg); }
.dash-card h3 { font-family:'Bebas Neue',sans-serif; font-size:1.65rem; letter-spacing:2px; margin-bottom:.6rem; color:var(--text); }
.dash-card > p { color:var(--muted); margin-bottom:1.5rem; font-size:.9rem; line-height:1.7; }
.card-features { list-style:none; text-align:left; margin-bottom:2rem; display:flex; flex-direction:column; gap:.5rem; }
.card-features li { display:flex; align-items:center; gap:.6rem; color:var(--muted); font-size:.86rem; }
.card-features li::before { content:'▸'; color:var(--primary); font-size:.75rem; }
.card-badge-tag { display:inline-block; padding:.26rem .78rem; border-radius:50px;
  font-size:.66rem; font-weight:700; margin-bottom:1.3rem;
  letter-spacing:1.5px; text-transform:uppercase; font-family:'Fira Code',monospace; }
.tag-orange { background:rgba(14,165,233,0.1); color:#0369A1; border:1px solid rgba(14,165,233,0.28); }
.tag-teal { background:rgba(2,132,199,0.08); color:#0284C7; border:1px solid rgba(2,132,199,0.24); }
.tag-magenta { background:rgba(99,102,241,0.1); color:#6366F1; border:1px solid rgba(99,102,241,0.28); }
.section-divider { text-align:center; margin:2.5rem 0 1.5rem; }
.section-divider span { color:var(--muted); font-size:.68rem; letter-spacing:4px;
  text-transform:uppercase; font-family:'Fira Code',monospace; }

/* ── CHATBOT ── */
.chat-wrap { max-width:820px; margin:0 auto; padding:6.5rem 1.5rem 2rem; display:flex; flex-direction:column; height:100vh; }
.chat-header { text-align:center; padding:1.25rem 0 .75rem; flex-shrink:0; }
.ai-avatar { width:72px; height:72px; border-radius:22px; background:var(--grad);
  display:inline-flex; align-items:center; justify-content:center; font-size:2.1rem;
  margin-bottom:.9rem; box-shadow:0 8px 40px rgba(14,165,233,.4);
  animation:avatarPulse 3.5s ease-in-out infinite; }
@keyframes avatarPulse { 0%,100%{box-shadow:0 8px 40px rgba(14,165,233,.4);} 50%{box-shadow:0 8px 60px rgba(14,165,233,.65);} }
.chat-header h2 { font-family:'Bebas Neue',sans-serif; font-size:1.7rem; letter-spacing:2px; margin-bottom:.2rem; color:var(--text); }
.online-status { display:inline-flex; align-items:center; gap:.4rem; color:var(--muted); font-size:.78rem; font-family:'Fira Code',monospace; }
.status-dot { width:8px; height:8px; border-radius:50%; background:var(--teal); animation:onlinePulse 2s infinite; }
@keyframes onlinePulse { 0%,100%{box-shadow:0 0 0 0 rgba(2,132,199,.75);} 50%{box-shadow:0 0 0 7px rgba(2,132,199,0);} }
.quick-queries { display:flex; gap:.6rem; flex-wrap:wrap; padding:.75rem 0; flex-shrink:0; justify-content:center; }
.qq-btn { padding:.4rem .95rem; border-radius:50px;
  background:rgba(14,165,233,0.07); border:1px solid rgba(14,165,233,0.18);
  color:var(--muted); font-size:.77rem; font-weight:700; cursor:pointer;
  transition:all .25s ease; font-family:'Barlow',sans-serif; white-space:nowrap; letter-spacing:.4px; text-transform:uppercase; }
.qq-btn:hover { background:rgba(14,165,233,0.16); border-color:rgba(14,165,233,0.38); color:var(--primary); transform:translateY(-2px); }
#chatbox { flex:1; overflow-y:auto; padding:1.25rem; display:flex; flex-direction:column; gap:1.2rem;
  background:rgba(255,255,255,0.85); border:1px solid rgba(14,165,233,0.15);
  border-radius:22px; backdrop-filter:blur(16px);
  scrollbar-width:thin; scrollbar-color:rgba(14,165,233,.28) transparent; min-height:0; }
#chatbox::-webkit-scrollbar { width:5px; }
#chatbox::-webkit-scrollbar-thumb { background:rgba(14,165,233,.25); border-radius:5px; }
.msg { max-width:78%; display:flex; flex-direction:column; gap:.22rem; }
.msg.user { align-self:flex-end; animation:slideFromRight .35s cubic-bezier(.34,1.56,.64,1); }
.msg.bot { align-self:flex-start; animation:slideFromLeft .35s cubic-bezier(.34,1.56,.64,1); }
.msg-label { font-size:.65rem; color:var(--muted); padding:0 .4rem; font-weight:600;
  font-family:'Fira Code',monospace; letter-spacing:1px; text-transform:uppercase; }
.msg.user .msg-label { text-align:right; }
.msg-bubble { padding:.9rem 1.3rem; border-radius:18px; font-size:.9rem; line-height:1.7; }
.msg.user .msg-bubble { background:var(--grad); color:#ffffff;
  border-bottom-right-radius:4px; box-shadow:0 6px 28px rgba(14,165,233,.28); font-weight:700; }
.msg.bot .msg-bubble { background:rgba(255,255,255,0.97); border:1px solid rgba(14,165,233,0.16);
  color:var(--text); border-bottom-left-radius:4px; box-shadow:0 2px 10px rgba(2,132,199,0.06); }
.typing-dots { display:inline-flex; align-items:center; gap:5px;
  background:rgba(255,255,255,0.97); border:1px solid rgba(14,165,233,.16);
  padding:.9rem 1.3rem; border-radius:18px; border-bottom-left-radius:4px; }
.typing-dots span { width:8px; height:8px; border-radius:50%; background:var(--primary);
  animation:dotBounce 1.4s infinite ease-in-out; }
.typing-dots span:nth-child(1){animation-delay:0s;}
.typing-dots span:nth-child(2){animation-delay:.2s;}
.typing-dots span:nth-child(3){animation-delay:.4s;}
@keyframes dotBounce { 0%,80%,100%{transform:scale(.5);opacity:.5} 40%{transform:scale(1.15);opacity:1} }
.input-row { display:flex; gap:.75rem; padding:.9rem 0; flex-shrink:0; }
.chat-input { flex:1; padding:.9rem 1.4rem;
  background:rgba(255,255,255,0.95); border:1.5px solid rgba(14,165,233,0.22);
  border-radius:16px; color:var(--text); font-family:'Nunito',sans-serif;
  font-size:.9rem; transition:all .3s; outline:none; }
.chat-input:focus { border-color:var(--primary); background:#fff; box-shadow:0 0 0 3px rgba(14,165,233,.1); }
.chat-input::placeholder { color:var(--muted); }
.send-btn { padding:.9rem 1.6rem; border-radius:16px; border:none; background:var(--grad);
  color:#ffffff; font-family:'Barlow',sans-serif; font-weight:800; font-size:.9rem;
  cursor:pointer; letter-spacing:.5px; text-transform:uppercase;
  transition:all .3s; box-shadow:0 4px 20px rgba(14,165,233,.3); white-space:nowrap; }
.send-btn:hover { transform:translateY(-3px); box-shadow:0 12px 35px rgba(14,165,233,.52); }

/* ── CAREER JOB MATCH ── */
.career-wrap { max-width:780px; margin:0 auto; padding:6.5rem 1.5rem 4rem; }
.page-title { font-family:'Bebas Neue',sans-serif; font-size:clamp(2rem,5vw,3rem);
  letter-spacing:3px; text-align:center; margin-bottom:2.5rem;
  background:var(--grad); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.stepper { display:flex; align-items:center; justify-content:center; margin-bottom:2.5rem; }
.step-dot { display:flex; flex-direction:column; align-items:center; gap:.38rem; flex:1; position:relative; }
.step-dot:not(:last-child)::after { content:''; position:absolute; top:18px; left:50%; width:100%; height:2px;
  background:rgba(14,165,233,0.15); z-index:0; transition:background .5s; }
.step-dot.done:not(:last-child)::after { background:var(--primary); }
.step-circle { width:36px; height:36px; border-radius:50%; border:2px solid rgba(14,165,233,.25);
  background:transparent; display:flex; align-items:center; justify-content:center;
  font-family:'Bebas Neue',sans-serif; font-size:.95rem; letter-spacing:1px;
  color:var(--muted); z-index:1; position:relative; transition:all .4s cubic-bezier(.34,1.56,.64,1); }
.step-dot.active .step-circle { background:var(--grad); color:#ffffff; border-color:transparent;
  box-shadow:0 4px 24px rgba(14,165,233,.5); transform:scale(1.15); }
.step-dot.done .step-circle { background:rgba(14,165,233,.12); color:var(--primary); border-color:var(--primary); }
.step-dot-label { font-size:.68rem; color:var(--muted); font-weight:700; font-family:'Barlow',sans-serif; letter-spacing:.5px; text-transform:uppercase; }
.step-dot.active .step-dot-label { color:var(--text); }
.prog-bar { background:rgba(14,165,233,.08); border-radius:50px; height:4px; margin-bottom:2.5rem; overflow:hidden; }
.prog-fill { height:100%; background:var(--grad); border-radius:50px; transition:width .6s cubic-bezier(.25,.46,.45,.94); }
.step-card { background:rgba(255,255,255,0.97); border:1px solid rgba(14,165,233,.18);
  border-radius:26px; padding:2.5rem; backdrop-filter:blur(18px);
  animation:expandCenter .45s cubic-bezier(.25,.46,.45,.94);
  box-shadow:0 4px 28px rgba(2,132,199,0.1); }
.step-card h2 { font-family:'Bebas Neue',sans-serif; font-size:1.8rem; letter-spacing:2px; margin-bottom:.4rem; color:var(--text); }
.step-desc { color:var(--muted); font-size:.86rem; margin-bottom:2rem; }
.upload-zone { border:2px dashed rgba(14,165,233,0.25); border-radius:20px;
  padding:3.5rem 2rem; text-align:center; cursor:pointer; transition:all .35s;
  background:rgba(14,165,233,0.03); margin-bottom:1.5rem; position:relative; }
.upload-zone:hover,.upload-zone.has-file { border-color:var(--primary); background:rgba(14,165,233,0.07);
  box-shadow:0 0 50px rgba(14,165,233,0.1); }
.upload-icon { font-size:3rem; margin-bottom:.9rem; display:block; }
.upload-zone p { color:var(--muted); font-size:.88rem; }
.file-name { color:var(--teal); font-weight:700; margin-top:.55rem; font-size:.84rem; font-family:'Fira Code',monospace; }
.upload-btn-wrap { display:flex; justify-content:center; }
.spinner { width:50px; height:50px; border:3px solid rgba(14,165,233,.14);
  border-top:3px solid var(--primary); border-radius:50%;
  animation:spin .8s linear infinite; margin:0 auto 1.2rem; }
@keyframes spin { to{transform:rotate(360deg)} }
.score-ring { width:155px; height:155px; border-radius:50%; background:var(--grad);
  display:flex; align-items:center; justify-content:center;
  font-family:'Bebas Neue',sans-serif; font-size:2.8rem; letter-spacing:2px;
  color:#ffffff; box-shadow:0 10px 55px rgba(14,165,233,.45);
  animation:bounceIn .8s cubic-bezier(.34,1.56,.64,1); margin:0 auto 1.5rem; }
.suggestion-card { background:rgba(14,165,233,0.04); border-radius:16px;
  border-left:3px solid var(--primary); padding:1.3rem 1.5rem; margin-bottom:1rem;
  animation:slideFromLeft .4s ease; }
.suggestion-card h3 { font-size:.95rem; font-weight:800; margin-bottom:.75rem;
  font-family:'Barlow',sans-serif; text-transform:uppercase; letter-spacing:.5px; color:var(--text); }
.suggestion-card ul { list-style:none; }
.suggestion-card li { padding:.35rem 0; color:var(--muted); font-size:.86rem;
  display:flex; align-items:flex-start; gap:.55rem;
  border-bottom:1px solid rgba(14,165,233,.08); }
.suggestion-card li:last-child { border-bottom:none; }
.suggestion-card li::before { content:'▸'; color:var(--primary); font-weight:700; flex-shrink:0; margin-top:.1rem; }
.chart-box { background:rgba(14,165,233,0.03); border:1px solid rgba(14,165,233,.12);
  border-radius:20px; padding:2rem; margin-bottom:2rem; }
.chart-box h3 { font-family:'Bebas Neue',sans-serif; font-size:1.3rem; letter-spacing:1.5px; margin-bottom:1.5rem; text-align:center; color:var(--text); }

/* ── CAREER PATH ── */
.cp-wrap { max-width:1260px; margin:0 auto; padding:6.5rem 1.5rem 4rem; }
.cp-hero { text-align:center; margin-bottom:3rem; animation:expandCenter .6s ease both; }
.cp-eyebrow { display:inline-flex; align-items:center; gap:8px;
  background:rgba(14,165,233,0.08); border:1px solid rgba(14,165,233,.24);
  color:var(--primary); font-size:.7rem; font-weight:600; letter-spacing:3px;
  text-transform:uppercase; padding:6px 16px; border-radius:50px; margin-bottom:1.5rem;
  font-family:'Fira Code',monospace; }
.cp-pulse { width:6px; height:6px; border-radius:50%; background:var(--teal); animation:pulseBlue 2s infinite; }
.cp-hero h1 { font-family:'Bebas Neue',sans-serif; font-size:clamp(2.6rem,6vw,4.2rem);
  letter-spacing:3px; line-height:1.05; margin-bottom:1rem; color:var(--text); }
.cp-hero p { color:var(--muted); font-size:.98rem; max-width:500px; margin:0 auto; line-height:1.8; }
.cp-search-wrap { max-width:480px; margin:1.8rem auto 0; animation:slideFromLeft .6s ease .15s both; }
.cp-search { width:100%; padding:.88rem 1.3rem;
  background:rgba(255,255,255,0.95); border:1px solid rgba(14,165,233,.18);
  border-radius:14px; color:var(--text); font-family:'Nunito',sans-serif;
  font-size:.9rem; outline:none; transition:all .3s; }
.cp-search:focus { border-color:rgba(14,165,233,.48); background:#fff; box-shadow:0 0 0 3px rgba(14,165,233,.08); }
.cp-search::placeholder { color:var(--muted); }
.cp-tabs { display:flex; gap:.6rem; flex-wrap:wrap; justify-content:center; margin:2.5rem 0 2rem; animation:dropBounce .6s ease .2s both; }
.cp-tab { display:flex; align-items:center; gap:8px; padding:.55rem 1.25rem;
  border-radius:50px; background:rgba(255,255,255,0.9); border:1px solid rgba(14,165,233,.15);
  color:var(--muted); font-size:.82rem; font-weight:800; cursor:pointer;
  transition:all .3s; font-family:'Barlow',sans-serif; text-transform:uppercase; letter-spacing:.5px;
  box-shadow:0 2px 8px rgba(14,165,233,0.06); }
.cp-tab:hover { background:rgba(14,165,233,.08); border-color:rgba(14,165,233,.32); color:var(--text); transform:translateY(-2px); }
.cp-tab.active { background:rgba(14,165,233,.1); border-color:rgba(14,165,233,.38);
  color:var(--primary); box-shadow:0 0 25px rgba(14,165,233,.14); }
.cp-role-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(192px,1fr)); gap:1rem; margin-bottom:2rem; }
.cp-role-card { background:rgba(255,255,255,0.97); border:1px solid rgba(14,165,233,.15);
  border-radius:18px; padding:1.5rem; cursor:pointer;
  transition:border-color .3s, background .3s; position:relative; overflow:hidden;
  box-shadow:0 2px 10px rgba(2,132,199,0.06); }
.cp-role-card.selected { border-color:var(--primary); background:rgba(14,165,233,.07); box-shadow:0 0 38px rgba(14,165,233,.15); }
.cp-rc-icon { font-size:2.1rem; margin-bottom:.8rem; display:block; transition:transform .4s cubic-bezier(.34,1.56,.64,1); }
.cp-role-card:hover .cp-rc-icon,.cp-role-card.selected .cp-rc-icon { transform:scale(1.25) rotate(8deg); }
.cp-rc-title { font-family:'Barlow',sans-serif; font-weight:800; font-size:.92rem; margin-bottom:.3rem; text-transform:uppercase; letter-spacing:.4px; color:var(--text); }
.cp-rc-desc { color:var(--muted); font-size:.74rem; line-height:1.48; }
.cp-rc-hot { position:absolute; top:.7rem; right:.7rem;
  background:rgba(245,158,11,0.12); border:1px solid rgba(245,158,11,.3);
  color:#D97706; font-size:.58rem; font-weight:700; padding:2px 8px;
  border-radius:50px; font-family:'Fira Code',monospace; letter-spacing:.5px; }
.cp-detail { background:rgba(255,255,255,0.99); border:1px solid rgba(14,165,233,.18);
  border-radius:28px; overflow:hidden; margin-top:2rem;
  animation:expandCenter .5s cubic-bezier(.25,.46,.45,.94) both;
  box-shadow:0 4px 32px rgba(2,132,199,0.1); }
.cp-dp-header { padding:2rem 2.5rem;
  background:linear-gradient(135deg,rgba(14,165,233,.06),rgba(56,189,248,.04));
  border-bottom:1px solid rgba(14,165,233,.12);
  display:flex; align-items:center; gap:1.5rem; flex-wrap:wrap; }
.cp-dp-icon { font-size:3.5rem; filter:drop-shadow(0 0 22px rgba(14,165,233,.45)); }
.cp-dp-title { font-family:'Bebas Neue',sans-serif; font-size:2rem; letter-spacing:2px; color:var(--text); }
.cp-dp-meta { display:flex; gap:.75rem; margin-top:.5rem; flex-wrap:wrap; }
.cp-dp-badge { padding:4px 12px; border-radius:50px; font-size:.7rem; font-weight:700; font-family:'Fira Code',monospace; }
.cp-b-green { background:rgba(2,132,199,.1); border:1px solid rgba(2,132,199,.25); color:var(--teal); }
.cp-b-cyan { background:rgba(56,189,248,.1); border:1px solid rgba(56,189,248,.25); color:#0284C7; }
.cp-b-amber { background:rgba(245,158,11,.1); border:1px solid rgba(245,158,11,.25); color:#D97706; }
.cp-dp-tabs { display:flex; border-bottom:1px solid rgba(14,165,233,.12); background:rgba(240,249,255,0.5); }
.cp-dp-tab { flex:1; padding:1rem; text-align:center; font-size:.8rem; font-weight:800;
  color:var(--muted); cursor:pointer; border:none; background:none; font-family:'Barlow',sans-serif;
  transition:all .3s; border-bottom:2px solid transparent; position:relative; top:1px;
  text-transform:uppercase; letter-spacing:.5px; }
.cp-dp-tab.active { color:var(--primary); border-bottom-color:var(--primary); }
.cp-dp-tab:hover:not(.active) { color:var(--text); background:rgba(14,165,233,.04); }
.cp-dp-content { padding:2rem 2.5rem; }
.cp-sec-hdr { display:flex; align-items:center; gap:.6rem; margin-bottom:1.2rem; }
.cp-sec-line { width:3px; height:18px; background:var(--grad); border-radius:2px; flex-shrink:0; }
.cp-sec-txt { font-family:'Barlow',sans-serif; font-weight:800; font-size:1rem; text-transform:uppercase; letter-spacing:.5px; color:var(--text); }
.cp-sal-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1rem; margin-bottom:2rem; }
.cp-sal-card { background:rgba(240,249,255,0.9); border:1px solid rgba(14,165,233,.14); border-radius:14px; padding:1.3rem; text-align:center; transition:border-color .3s, transform .3s; }
.cp-sal-card:hover { border-color:rgba(14,165,233,.35); transform:translateY(-4px); }
.cp-sal-label { color:var(--muted); font-size:.68rem; margin-bottom:.4rem; font-family:'Fira Code',monospace; letter-spacing:.5px; text-transform:uppercase; }
.cp-sal-val { font-family:'Bebas Neue',sans-serif; font-size:1.5rem; letter-spacing:1px; }
.cp-skill-row { display:flex; align-items:center; gap:1rem; margin-bottom:.9rem; }
.cp-skill-name { width:160px; flex-shrink:0; font-size:.8rem; color:var(--muted); font-weight:700; font-family:'Barlow',sans-serif; }
.cp-skill-track { flex:1; background:rgba(14,165,233,.08); border-radius:50px; height:8px; overflow:hidden; }
.cp-skill-fill { height:100%; border-radius:50px; transition:width .9s cubic-bezier(.25,.46,.45,.94); }
.cp-skill-pct { width:38px; text-align:right; font-size:.76rem; font-weight:700; font-family:'Fira Code',monospace; }
.cp-rm-grid { display:grid; grid-template-columns:1fr 1fr; gap:.85rem; }
.cp-rm-step { display:flex; align-items:flex-start; gap:.85rem;
  background:rgba(14,165,233,0.04); border:1px solid rgba(14,165,233,.12);
  border-radius:14px; padding:1rem 1.2rem;
  transition:border-color .3s, transform .3s; }
.cp-rm-step:hover { border-color:rgba(14,165,233,.3); transform:translateY(-3px); }
.cp-rm-num { width:28px; height:28px; border-radius:50%; flex-shrink:0;
  background:var(--grad); color:#ffffff; display:flex; align-items:center;
  justify-content:center; font-size:.72rem; font-weight:800;
  box-shadow:0 3px 15px rgba(14,165,233,.38); font-family:'Bebas Neue',sans-serif; }
.cp-rm-text { font-size:.83rem; color:#475569; line-height:1.55; padding-top:.2rem; }
.cp-job-flow { position:relative; }
.cp-job-step { display:flex; align-items:flex-start; gap:1.2rem; margin-bottom:0; }
.cp-job-left { display:flex; flex-direction:column; align-items:center; flex-shrink:0; }
.cp-job-circle { width:46px; height:46px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.1rem; z-index:1; position:relative; }
.cp-job-connector { width:2px; height:42px; margin:4px 0; opacity:.35; }
.cp-job-card { background:rgba(240,249,255,0.8); border:1px solid rgba(14,165,233,.1);
  border-radius:16px; padding:1.15rem 1.4rem; flex:1; margin-bottom:12px;
  transition:border-color .3s, transform .3s; }
.cp-job-card:hover { border-color:rgba(14,165,233,.32); transform:translateX(4px); }
.cp-job-role-name { font-weight:800; font-size:.95rem; margin-bottom:.2rem; font-family:'Barlow',sans-serif; text-transform:uppercase; letter-spacing:.3px; }
.cp-job-company { color:var(--muted); font-size:.78rem; }
.cp-job-salary { padding:4px 12px; border-radius:50px; font-size:.74rem; font-weight:700; white-space:nowrap; font-family:'Fira Code',monospace; }
.cp-cta-row { display:flex; gap:1rem; flex-wrap:wrap; margin-top:1.5rem; }
.cp-cta-row .btn { flex:1; }

/* ── RESUME BUILDER ── */
.resume-wrap { max-width:1200px; margin:0 auto; padding:6.5rem 1.5rem 4rem; }
.resume-hero { text-align:center; margin-bottom:3.5rem; }
.resume-hero h1 { font-family:'Bebas Neue',sans-serif; font-size:clamp(2.2rem,5vw,3.5rem);
  letter-spacing:3px; margin-bottom:.75rem;
  background:var(--grad); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.resume-hero p { color:var(--muted); font-size:.95rem; max-width:540px; margin:0 auto; line-height:1.8; }
.resume-layout { display:grid; grid-template-columns:1fr 1fr; gap:2rem; align-items:start; }
.form-card2 { background:rgba(255,255,255,0.97); border:1px solid rgba(14,165,233,.15);
  border-radius:26px; padding:2.5rem; backdrop-filter:blur(20px);
  box-shadow:0 4px 24px rgba(2,132,199,0.08); }
.form-card2-header { display:flex; align-items:center; gap:.75rem; margin-bottom:2rem;
  padding-bottom:1.25rem; border-bottom:1px solid rgba(14,165,233,.12); }
.form-card2-icon { font-size:1.8rem; filter:drop-shadow(0 0 12px rgba(14,165,233,.4)); }
.form-card2-title { font-family:'Bebas Neue',sans-serif; font-size:1.5rem; letter-spacing:1.5px; color:var(--text); }
.form-card2-sub { font-size:.78rem; color:var(--muted); font-family:'Fira Code',monospace; letter-spacing:.5px; }
.form-section-label { display:flex; align-items:center; gap:.7rem; margin:1.6rem 0 .9rem;
  font-family:'Fira Code',monospace; font-size:.66rem; color:var(--teal);
  letter-spacing:2.5px; text-transform:uppercase; }
.form-section-label::before { content:''; width:20px; height:2px; background:var(--teal); border-radius:2px; opacity:.65; }
.form-section-label::after { content:''; flex:1; height:1px; background:rgba(14,165,233,.12); }
.field { position:relative; margin-bottom:1.15rem; }
.field input,.field textarea { width:100%; padding:1.1rem 1.25rem .55rem;
  background:rgba(14,165,233,0.03); border:1.5px solid rgba(14,165,233,.16);
  border-radius:14px; color:var(--text); font-family:'Nunito',sans-serif;
  font-size:.9rem; transition:all .3s; outline:none; resize:vertical; }
.field textarea { min-height:95px; padding-top:1.4rem; }
.field label { position:absolute; left:1.25rem; top:.95rem;
  color:var(--muted); font-size:.86rem; font-weight:700;
  transition:all .25s cubic-bezier(.25,.46,.45,.94); pointer-events:none; font-family:'Barlow',sans-serif; }
.field input:focus,.field textarea:focus { border-color:var(--primary); background:rgba(14,165,233,.05); box-shadow:0 0 0 3px rgba(14,165,233,.09); }
.field input:focus+label,.field input:not(:placeholder-shown)+label,
.field textarea:focus+label,.field textarea:not(:placeholder-shown)+label {
  top:.28rem; font-size:.64rem; color:var(--primary);
  letter-spacing:2px; text-transform:uppercase; font-family:'Fira Code',monospace; }
.field input::placeholder,.field textarea::placeholder { opacity:0; }
.field-grid { display:grid; grid-template-columns:1fr 1fr; gap:.75rem; }
.btn-row { display:flex; gap:.7rem; flex-wrap:wrap; margin-top:1.75rem; }
.btn-row .btn { flex:1; }
.success-bar { display:flex; align-items:center; gap:.55rem;
  background:rgba(2,132,199,0.08); border:1px solid rgba(2,132,199,.24);
  border-radius:12px; padding:.85rem 1.2rem; margin-bottom:1.3rem;
  color:var(--teal); font-weight:700; font-size:.8rem;
  animation:slideFromLeft .3s ease; font-family:'Fira Code',monospace; letter-spacing:.5px; }
.preview-pane { position:sticky; top:5.5rem; }
.preview-placeholder { display:flex; flex-direction:column; align-items:center; justify-content:center;
  min-height:380px; text-align:center; gap:1rem; color:var(--muted);
  background:rgba(240,249,255,0.8); border:2px dashed rgba(14,165,233,.2);
  border-radius:24px; padding:3rem; }
.ph-icon { font-size:4rem; opacity:.3; animation:heroIconFloat 3s ease-in-out infinite; }
.ph-title { font-family:'Bebas Neue',sans-serif; font-size:1.5rem; letter-spacing:2px; opacity:.5; color:var(--text); }
.ph-sub { font-size:.82rem; opacity:.5; font-family:'Fira Code',monospace; letter-spacing:.5px; }
.resume-preview { background:#ffffff; border-radius:22px; overflow:hidden;
  animation:expandCenter .55s cubic-bezier(.34,1.56,.64,1);
  box-shadow:0 20px 70px rgba(2,132,199,0.2), 0 0 0 1px rgba(14,165,233,.18), 0 0 40px rgba(14,165,233,.08);
  color:#1a1a2e; }
.prev-header { background:linear-gradient(135deg,#0C2D48 0%,#0369A1 100%);
  padding:2rem 2.5rem; position:relative; overflow:hidden; }
.prev-header::before { content:''; position:absolute; top:-40px; right:-40px;
  width:180px; height:180px; border-radius:50%;
  background:radial-gradient(circle,rgba(56,189,248,.32) 0%,transparent 70%); }
.prev-header::after { content:''; position:absolute; bottom:-30px; left:-30px;
  width:140px; height:140px; border-radius:50%;
  background:radial-gradient(circle,rgba(125,211,252,.22) 0%,transparent 70%); }
.prev-name { font-family:'Bebas Neue',sans-serif; font-size:2rem; letter-spacing:3px;
  color:#ffffff; margin-bottom:.2rem; position:relative; z-index:1; }
.prev-headline { font-size:.8rem; color:rgba(125,211,252,0.95); font-weight:700;
  letter-spacing:2px; text-transform:uppercase; font-family:'Barlow',sans-serif; position:relative; z-index:1; }
.prev-contact { display:flex; gap:1rem; flex-wrap:wrap; padding:1rem 2.5rem;
  background:#f0f9ff; border-bottom:2px solid #bae6fd; }
.prev-contact span { font-size:.74rem; color:#64748b; display:flex; align-items:center; gap:.35rem; font-weight:600; }
.prev-body { padding:1.5rem 2.5rem; }
.prev-section { margin-bottom:1.3rem; }
.prev-sec-title { font-size:.62rem; font-weight:800; letter-spacing:3.5px; text-transform:uppercase;
  color:#0284C7; padding-bottom:.4rem; border-bottom:2px solid #e0f2fe; margin-bottom:.65rem; font-family:'Barlow',sans-serif; }
.prev-text { font-size:.83rem; color:#334155; line-height:1.7; white-space:pre-line; }
.skills-row { display:flex; flex-wrap:wrap; gap:.35rem; }
.skill-badge { padding:.28rem .75rem; border-radius:8px; font-size:.72rem; font-weight:800;
  background:rgba(14,165,233,0.1); color:#0284C7; border:1px solid rgba(14,165,233,.22);
  font-family:'Barlow',sans-serif; letter-spacing:.3px; text-transform:uppercase; }

/* ── SHIMMER ── */
@keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
.shimmer { background:linear-gradient(90deg,#0369A1 0%,#38BDF8 22%,#0EA5E9 45%,#6366F1 68%,#0369A1 100%);
  background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent;
  background-clip:text; animation:shimmer 5s linear infinite; }

/* ── RESPONSIVE ── */
@media(max-width:900px){.resume-layout{grid-template-columns:1fr;}.preview-pane{position:static;}.field-grid{grid-template-columns:1fr;}}
@media(max-width:768px){
  .hamburger{display:flex;}
  .nav-links{display:none;position:absolute;top:100%;left:0;right:0;background:rgba(255,255,255,0.98);backdrop-filter:blur(24px);flex-direction:column;padding:1.5rem;border-bottom:1px solid rgba(14,165,233,.12);}
  .nav-links.open{display:flex;}
  .navbar{padding:1rem 1.5rem;}
  .stat-item{border-right:none;border-bottom:1px solid rgba(14,165,233,.08);}
  .stat-item:last-child{border-bottom:none;}
  .stats-row{flex-direction:column;}
  .hero-btns,.cta-section .btn{width:100%;justify-content:center;}
  .hero-btns{flex-direction:column;align-items:center;}
  .cta-section{padding:2.5rem 1.5rem;}
  .chat-wrap{padding:5.5rem 1rem 1rem;}
  .msg{max-width:92%;}
  .input-row{flex-direction:column;}
  .send-btn{width:100%;}
  .step-dot-label{display:none;}
  .btn-row{flex-direction:column;}
  .resume-layout{grid-template-columns:1fr;}
  .form-card2{padding:1.75rem;}
  .cp-rm-grid{grid-template-columns:1fr;}
  .cp-sal-grid{grid-template-columns:1fr 1fr;}
  .cp-dp-content{padding:1.4rem;}
  .cp-dp-header{padding:1.4rem;}
  .cp-role-grid{grid-template-columns:repeat(auto-fill,minmax(148px,1fr));}
  .cp-dp-tab{font-size:.7rem;padding:.7rem .15rem;}
}
.reveal{opacity:0;transform:translateY(28px);transition:opacity .65s ease,transform .65s ease;}
.reveal.visible{opacity:1;transform:none;}
`;

// ─── DATA ─────────────────────────────────────────────────────
const CAREER_ROADMAPS = {
  "Machine Learning Engineer":["Learn Python programming","Learn Linear Algebra and Statistics","Learn NumPy and Pandas","Study Machine Learning algorithms","Learn Deep Learning concepts","Use TensorFlow or PyTorch","Work on ML projects","Deploy ML models","Build GitHub portfolio","Apply for ML Engineer roles"],
  "Data Scientist":["Learn Python","Learn Statistics and Probability","Learn Pandas and NumPy","Learn Data Visualization","Learn Machine Learning","Work with real datasets","Build Data Science projects","Create GitHub portfolio","Practice SQL","Apply for Data Scientist jobs"],
  "Cloud Engineer":["Learn Linux fundamentals","Learn Networking basics","Learn AWS or Azure or GCP","Understand Cloud architecture","Learn Docker containers","Learn Kubernetes","Practice Infrastructure as Code","Build Cloud projects","Get Cloud certifications","Apply for Cloud Engineer jobs"],
  "DevOps Engineer":["Learn Linux","Learn Networking","Learn Git and GitHub","Learn CI/CD pipelines","Learn Docker","Learn Kubernetes","Learn Cloud platforms","Automate deployments","Build DevOps projects","Apply for DevOps jobs"],
  "Cybersecurity Analyst":["Learn Networking fundamentals","Learn Linux systems","Learn Cybersecurity basics","Study Ethical Hacking","Learn Security tools","Practice penetration testing","Participate in CTF competitions","Get Security certifications","Build security projects","Apply for Cybersecurity roles"],
  "Blockchain Developer":["Learn programming (JavaScript or Python)","Understand Blockchain fundamentals","Learn Cryptography basics","Learn Ethereum and Smart Contracts","Learn Solidity programming","Build decentralized applications","Work with Web3 tools","Build blockchain projects","Create GitHub portfolio","Apply for Blockchain jobs"],
  "Software Developer":["Learn a programming language","Learn Data Structures","Learn Algorithms","Learn Git version control","Build software projects","Learn APIs and backend","Practice debugging","Contribute to open source","Build portfolio","Apply for developer jobs"],
  "Software Engineer":["Learn programming fundamentals","Learn Data Structures and Algorithms","Understand Software Design patterns","Learn Git collaboration","Build real-world applications","Learn System Design basics","Practice coding interviews","Contribute to open source","Build portfolio","Apply for Software Engineer jobs"],
  "Full Stack Developer":["Learn HTML CSS JavaScript","Learn Frontend framework (React)","Learn Backend (Node.js)","Learn databases (MongoDB or SQL)","Build REST APIs","Learn authentication systems","Build full stack projects","Deploy applications","Build portfolio website","Apply for Full Stack jobs"],
  "Frontend Developer":["Learn HTML","Learn CSS","Learn JavaScript","Learn Responsive Design","Learn React or Angular","Build UI projects","Learn Git","Create portfolio website","Practice UI challenges","Apply for Frontend jobs"],
  "VLSI Design Engineer":["Learn digital electronics","Learn VLSI design fundamentals","Learn Verilog HDL","Learn FPGA development","Use EDA tools","Study chip architecture","Build VLSI projects","Simulate circuits","Understand semiconductor design","Apply for VLSI jobs"],
  "FPGA Engineer":["Learn digital logic","Learn Verilog or VHDL","Understand FPGA architecture","Use FPGA development boards","Learn hardware debugging","Build FPGA projects","Learn signal processing","Work on hardware simulations","Build hardware portfolio","Apply for FPGA jobs"],
  "Embedded Systems Engineer":["Learn C programming","Learn microcontrollers","Study electronics circuits","Learn Arduino and Raspberry Pi","Learn embedded Linux","Build embedded projects","Work with sensors and IoT","Learn RTOS concepts","Build embedded portfolio","Apply for embedded roles"],
  "IoT Engineer":["Learn electronics basics","Learn programming (C/Python)","Learn Arduino and Raspberry Pi","Understand sensors and actuators","Learn IoT protocols","Work with cloud IoT platforms","Build IoT projects","Learn embedded systems","Deploy IoT solutions","Apply for IoT jobs"],
  "Robotics Engineer":["Learn programming","Learn electronics basics","Study robotics principles","Learn sensors and actuators","Learn ROS framework","Build robot prototypes","Program robot movements","Integrate AI with robotics","Build robotics projects","Apply for robotics jobs"],
  "Aerospace Engineer":["Learn aerodynamics","Study aircraft structures","Learn propulsion systems","Study fluid mechanics","Learn CAD tools","Work on aerospace simulations","Build aerospace projects","Intern in aviation industry","Learn aerospace standards","Apply for aerospace jobs"],
  "Automotive Engineer":["Learn automotive systems","Study engine design","Learn vehicle dynamics","Use CAD tools","Study electric vehicles","Build automotive projects","Work with vehicle simulations","Intern in automotive companies","Learn automotive safety standards","Apply for automotive roles"],
  "Mechanical Design Engineer":["Learn mechanical design principles","Learn CAD software","Study material science","Learn product design","Build design prototypes","Work with simulations","Optimize mechanical systems","Build design projects","Create engineering portfolio","Apply for design engineer roles"],
  "UI UX Designer":["Learn design fundamentals","Understand UX principles","Learn Figma and Adobe XD","Study user research","Learn wireframing","Study usability testing","Learn interaction design","Design real UI/UX projects","Build portfolio","Apply for UI/UX jobs"],
  "Product Manager":["Learn product management fundamentals","Understand business strategy","Learn market research","Study Agile and Scrum","Learn product roadmapping","Understand UX basics","Learn data analysis","Work on product case studies","Build portfolio","Apply for PM roles"],
  "Business Analyst":["Learn business analysis fundamentals","Understand business processes","Learn data analysis using Excel","Learn SQL","Learn data visualization (Power BI)","Understand requirement gathering","Learn documentation","Work on business case studies","Build portfolio","Apply for BA roles"],
  "Digital Marketing Specialist":["Learn digital marketing fundamentals","Understand SEO","Learn Social Media Marketing","Learn Google Ads","Learn content marketing","Understand email marketing","Learn Google Analytics","Run real campaigns","Build marketing portfolio","Apply for digital marketing jobs"],
  "Mobile App Developer":["Learn programming basics","Learn Kotlin for Android","Learn Swift for iOS","Understand mobile UI/UX","Learn Android Studio or Xcode","Build mobile apps","Integrate APIs","Test applications","Publish apps","Apply for mobile developer roles"],
  "Game Developer":["Learn C# or C++","Learn game development basics","Learn Unity or Unreal Engine","Understand game physics","Learn 3D modeling basics","Build simple games","Add sound and animations","Optimize performance","Publish games","Apply for game developer jobs"],
  "Data Engineer":["Learn Python","Learn SQL","Learn data warehousing","Learn ETL pipelines","Learn big data tools","Work with cloud platforms","Build data pipelines","Handle large datasets","Build projects","Apply for data engineer jobs"],
};

const AI_RESPONSES = {
  'hello':'Hello! Great to meet you! How can I help you today? 🎓',
  'hi':'Hi there! Ready to help with your studies or career questions! 📚',
  'how are you':"I'm running at full capacity and ready to help you succeed! 🤖",
  'what is ai':"AI (Artificial Intelligence) enables computers to learn, reason, and solve problems — transforming every industry from education to healthcare. 🧠",
  'how to study':"Proven study techniques:\n\n1️⃣ Pomodoro – 25 min study, 5 min break\n2️⃣ Active recall – Test yourself instead of re-reading\n3️⃣ Spaced repetition – Review at increasing intervals\n4️⃣ Teach others – Forces deeper understanding\n5️⃣ Mind maps – Connect ideas visually 🗺️",
  'career advice':"Key career tips:\n\n🚀 Build real projects for your portfolio\n💼 Tailor your resume for each application\n🌐 Network actively on LinkedIn\n📚 Keep learning new skills\n🎯 Use our Career Path Finder for your personalized roadmap!",
  'grades':"Boost your grades:\n\n✏️ Attend every class and take notes\n📖 Review notes within 24 hours\n❓ Ask questions without hesitation\n👥 Join or form study groups\n⏰ Start assignments early, never cram!",
  'resume':"Resume essentials:\n\n📄 Keep it to 1 page for freshers\n🎯 Customize for each job\n✅ Use action verbs: Built, Led, Designed\n📊 Quantify achievements\n⚡ Try our Resume Builder!",
  'study tips':"Study tips that work:\n\n🧠 Study in your best mental state\n📵 Phone away while studying\n🎧 Lo-fi music for focus\n📝 Handwrite key concepts\n💤 Sleep 7–8 hrs!",
  'how to write a resume':"For a great resume:\n\n📌 Strong summary at top\n💼 Experience with impact metrics\n🛠️ Skills with keywords\n🎓 Education with CGPA\n🔗 Add GitHub and LinkedIn!\n\nTry our Resume Builder → it's free! 📄",
  'thank you':'You are very welcome! Good luck with your studies! 💪',
  'bye':"Goodbye! Come back anytime! 👋 Best of luck! 🌟",
};

const CP_FIELDS = [
  { id:'cse', label:'💻 CSE / Software', roles:[
    { icon:'🤖', title:'ML Engineer', roleKey:'Machine Learning Engineer', desc:'Build & deploy AI models', hot:true, salary:['₹8L','₹18L','₹35L+'], demand:'Very High', growth:'+42%',
      trend:[{yr:'2017',v:28},{yr:'2018',v:34},{yr:'2019',v:40},{yr:'2020',v:52},{yr:'2021',v:65},{yr:'2022',v:78},{yr:'2023',v:90},{yr:'2024',v:100},{yr:'2025',v:112,f:true},{yr:'2026',v:128,f:true},{yr:'2027',v:145,f:true},{yr:'2028',v:165,f:true}],
      skills:[['Python',95],['ML Frameworks',90],['Math/Stats',85],['MLOps',75],['SQL/Data',70]],
      jobs:[{title:'Junior ML Engineer',salary:'₹8–14L',company:'Startups & Mid-size',color:'#0284C7'},{title:'ML Engineer',salary:'₹14–25L',company:'Product Companies',color:'#0EA5E9'},{title:'Senior ML Engineer',salary:'₹25–45L',company:'FAANG / Unicorns',color:'#38BDF8'},{title:'Staff ML Engineer',salary:'₹45L+',company:'Big Tech',color:'#6366F1'}],
      radarSkills:[{skill:'Python',score:95},{skill:'ML',score:90},{skill:'Stats',score:85},{skill:'MLOps',score:75},{skill:'SQL',score:70}]},
    { icon:'📊', title:'Data Scientist', roleKey:'Data Scientist', desc:'Mine insights from data', hot:true, salary:['₹6L','₹15L','₹30L+'], demand:'High', growth:'+35%',
      trend:[{yr:'2017',v:30},{yr:'2018',v:38},{yr:'2019',v:45},{yr:'2020',v:55},{yr:'2021',v:65},{yr:'2022',v:75},{yr:'2023',v:85},{yr:'2024',v:95},{yr:'2025',v:105,f:true},{yr:'2026',v:118,f:true},{yr:'2027',v:132,f:true},{yr:'2028',v:148,f:true}],
      skills:[['Python/R',90],['Statistics',88],['Visualization',80],['ML/AI',78],['SQL',85]],
      jobs:[{title:'Jr. Data Analyst',salary:'₹5–9L',company:'All industries',color:'#0284C7'},{title:'Data Scientist',salary:'₹12–22L',company:'Tech & Finance',color:'#0EA5E9'},{title:'Senior Data Scientist',salary:'₹22–40L',company:'Product Firms',color:'#38BDF8'},{title:'Principal Scientist',salary:'₹40L+',company:'Research Labs',color:'#6366F1'}],
      radarSkills:[{skill:'Python/R',score:90},{skill:'Stats',score:88},{skill:'Viz',score:80},{skill:'ML',score:78},{skill:'SQL',score:85}]},
    { icon:'☁️', title:'Cloud Engineer', roleKey:'Cloud Engineer', desc:'Build cloud infrastructure', hot:false, salary:['₹7L','₹16L','₹28L+'], demand:'Very High', growth:'+38%',
      trend:[{yr:'2017',v:20},{yr:'2018',v:28},{yr:'2019',v:38},{yr:'2020',v:50},{yr:'2021',v:62},{yr:'2022',v:74},{yr:'2023',v:85},{yr:'2024',v:95},{yr:'2025',v:108,f:true},{yr:'2026',v:122,f:true},{yr:'2027',v:138,f:true},{yr:'2028',v:155,f:true}],
      skills:[['AWS/Azure/GCP',92],['Linux',85],['Kubernetes',82],['Terraform',78],['Networking',75]],
      jobs:[{title:'Cloud Support Eng.',salary:'₹6–10L',company:'IT Services',color:'#0284C7'},{title:'Cloud Engineer',salary:'₹12–22L',company:'SaaS companies',color:'#0EA5E9'},{title:'Cloud Architect',salary:'₹22–40L',company:'Enterprise',color:'#38BDF8'},{title:'Principal Architect',salary:'₹40L+',company:'Big Tech',color:'#6366F1'}],
      radarSkills:[{skill:'AWS/GCP',score:92},{skill:'Linux',score:85},{skill:'K8s',score:82},{skill:'Terraform',score:78},{skill:'Network',score:75}]},
    { icon:'⚙️', title:'DevOps Engineer', roleKey:'DevOps Engineer', desc:'Automate & scale systems', hot:false, salary:['₹7L','₹15L','₹28L+'], demand:'High', growth:'+32%',
      trend:[{yr:'2017',v:22},{yr:'2018',v:30},{yr:'2019',v:40},{yr:'2020',v:52},{yr:'2021',v:63},{yr:'2022',v:73},{yr:'2023',v:84},{yr:'2024',v:95},{yr:'2025',v:106,f:true},{yr:'2026',v:120,f:true},{yr:'2027',v:135,f:true},{yr:'2028',v:150,f:true}],
      skills:[['CI/CD',90],['Docker/K8s',88],['Cloud',85],['Git',92],['Scripting',80]],
      jobs:[{title:'DevOps Jr.',salary:'₹6–10L',company:'IT Firms',color:'#0284C7'},{title:'DevOps Engineer',salary:'₹12–22L',company:'Product Co.',color:'#0EA5E9'},{title:'Sr. DevOps / SRE',salary:'₹22–38L',company:'Unicorns',color:'#38BDF8'},{title:'Platform Engineer',salary:'₹38L+',company:'Big Tech',color:'#6366F1'}],
      radarSkills:[{skill:'CI/CD',score:90},{skill:'Docker',score:88},{skill:'Cloud',score:85},{skill:'Git',score:92},{skill:'Scripts',score:80}]},
    { icon:'🔒', title:'Cybersecurity', roleKey:'Cybersecurity Analyst', desc:'Protect systems from attacks', hot:false, salary:['₹6L','₹14L','₹28L+'], demand:'High', growth:'+33%',
      trend:[{yr:'2017',v:25},{yr:'2018',v:32},{yr:'2019',v:40},{yr:'2020',v:50},{yr:'2021',v:60},{yr:'2022',v:72},{yr:'2023',v:84},{yr:'2024',v:95},{yr:'2025',v:108,f:true},{yr:'2026',v:122,f:true},{yr:'2027',v:138,f:true},{yr:'2028',v:155,f:true}],
      skills:[['Networking',88],['Linux',85],['Pen Testing',82],['SIEM',75],['Scripting',78]],
      jobs:[{title:'Jr. Security Analyst',salary:'₹5–9L',company:'IT Services',color:'#0284C7'},{title:'Security Analyst',salary:'₹10–18L',company:'BFSI/Tech',color:'#0EA5E9'},{title:'Sr. Security Engineer',salary:'₹18–30L',company:'Enterprise',color:'#38BDF8'},{title:'CISO / Sec Architect',salary:'₹30L+',company:'All sectors',color:'#6366F1'}],
      radarSkills:[{skill:'Network',score:88},{skill:'Linux',score:85},{skill:'PenTest',score:82},{skill:'SIEM',score:75},{skill:'Scripts',score:78}]},
    { icon:'🌐', title:'Full Stack Dev', roleKey:'Full Stack Developer', desc:'Frontend + Backend mastery', hot:false, salary:['₹5L','₹14L','₹25L+'], demand:'High', growth:'+28%',
      trend:[{yr:'2017',v:40},{yr:'2018',v:46},{yr:'2019',v:52},{yr:'2020',v:60},{yr:'2021',v:68},{yr:'2022',v:76},{yr:'2023',v:85},{yr:'2024',v:95},{yr:'2025',v:104,f:true},{yr:'2026',v:115,f:true},{yr:'2027',v:127,f:true},{yr:'2028',v:140,f:true}],
      skills:[['React/Vue',88],['Node.js',85],['SQL/NoSQL',82],['REST APIs',90],['CSS/UI',80]],
      jobs:[{title:'Jr. Developer',salary:'₹4–8L',company:'Startups',color:'#0284C7'},{title:'Full Stack Dev',salary:'₹10–20L',company:'Product Co.',color:'#0EA5E9'},{title:'Sr. Full Stack',salary:'₹20–35L',company:'Unicorns',color:'#38BDF8'},{title:'Tech Lead',salary:'₹35L+',company:'All',color:'#6366F1'}],
      radarSkills:[{skill:'React',score:88},{skill:'Node.js',score:85},{skill:'DB',score:82},{skill:'APIs',score:90},{skill:'CSS',score:80}]},
  ]},
  { id:'ece', label:'📡 ECE / Hardware', roles:[
    { icon:'💾', title:'VLSI Engineer', roleKey:'VLSI Design Engineer', desc:'Chip & semiconductor design', hot:true, salary:['₹8L','₹18L','₹35L+'], demand:'Very High', growth:'+45%',
      trend:[{yr:'2017',v:20},{yr:'2018',v:25},{yr:'2019',v:32},{yr:'2020',v:40},{yr:'2021',v:52},{yr:'2022',v:65},{yr:'2023',v:80},{yr:'2024',v:95},{yr:'2025',v:110,f:true},{yr:'2026',v:128,f:true},{yr:'2027',v:148,f:true},{yr:'2028',v:170,f:true}],
      skills:[['Verilog/VHDL',92],['EDA Tools',88],['ASIC Design',85],['Verification',82],['DFT',75]],
      jobs:[{title:'VLSI Jr. Eng.',salary:'₹7–12L',company:'Fab-less chips',color:'#0284C7'},{title:'Design Eng.',salary:'₹12–22L',company:'Semiconductor',color:'#0EA5E9'},{title:'Sr. Design Eng.',salary:'₹22–40L',company:'Intel/Qualcomm',color:'#38BDF8'},{title:'Design Architect',salary:'₹40L+',company:'FAANG Chip',color:'#6366F1'}],
      radarSkills:[{skill:'Verilog',score:92},{skill:'EDA',score:88},{skill:'ASIC',score:85},{skill:'Verify',score:82},{skill:'DFT',score:75}]},
    { icon:'📟', title:'Embedded Engineer', roleKey:'Embedded Systems Engineer', desc:'Hardware-software systems', hot:false, salary:['₹5L','₹12L','₹22L+'], demand:'Moderate', growth:'+20%',
      trend:[{yr:'2017',v:35},{yr:'2018',v:38},{yr:'2019',v:42},{yr:'2020',v:46},{yr:'2021',v:52},{yr:'2022',v:60},{yr:'2023',v:70},{yr:'2024',v:80},{yr:'2025',v:88,f:true},{yr:'2026',v:97,f:true},{yr:'2027',v:107,f:true},{yr:'2028',v:118,f:true}],
      skills:[['C/C++',92],['Microcontrollers',88],['RTOS',80],['Protocols',75],['Linux',70]],
      jobs:[{title:'Embedded Jr.',salary:'₹4–8L',company:'Electronics firms',color:'#0284C7'},{title:'Embedded Eng.',salary:'₹8–16L',company:'Automotive/IoT',color:'#0EA5E9'},{title:'Sr. Embedded Dev',salary:'₹16–28L',company:'R&D Labs',color:'#38BDF8'},{title:'Principal Eng.',salary:'₹28L+',company:'Chip makers',color:'#6366F1'}],
      radarSkills:[{skill:'C/C++',score:92},{skill:'MCU',score:88},{skill:'RTOS',score:80},{skill:'Protocols',score:75},{skill:'Linux',score:70}]},
    { icon:'🌍', title:'IoT Engineer', roleKey:'IoT Engineer', desc:'Internet of Things devices', hot:true, salary:['₹5L','₹13L','₹24L+'], demand:'High', growth:'+38%',
      trend:[{yr:'2017',v:18},{yr:'2018',v:25},{yr:'2019',v:35},{yr:'2020',v:45},{yr:'2021',v:58},{yr:'2022',v:68},{yr:'2023',v:80},{yr:'2024',v:92},{yr:'2025',v:106,f:true},{yr:'2026',v:122,f:true},{yr:'2027',v:140,f:true},{yr:'2028',v:160,f:true}],
      skills:[['Embedded C',85],['Cloud IoT',80],['Protocols',88],['Sensors',82],['Security',70]],
      jobs:[{title:'IoT Jr. Dev',salary:'₹4–8L',company:'Smart device cos',color:'#0284C7'},{title:'IoT Engineer',salary:'₹10–18L',company:'Industrial IoT',color:'#0EA5E9'},{title:'IoT Architect',salary:'₹18–30L',company:'Enterprise',color:'#38BDF8'},{title:'IoT Lead',salary:'₹30L+',company:'Product Co.',color:'#6366F1'}],
      radarSkills:[{skill:'Embedded C',score:85},{skill:'Cloud',score:80},{skill:'Protocols',score:88},{skill:'Sensors',score:82},{skill:'Security',score:70}]},
    { icon:'⚡', title:'FPGA Engineer', roleKey:'FPGA Engineer', desc:'Programmable hardware dev', hot:false, salary:['₹7L','₹15L','₹28L+'], demand:'Moderate', growth:'+22%',
      trend:[{yr:'2017',v:22},{yr:'2018',v:28},{yr:'2019',v:35},{yr:'2020',v:42},{yr:'2021',v:52},{yr:'2022',v:62},{yr:'2023',v:74},{yr:'2024',v:85},{yr:'2025',v:96,f:true},{yr:'2026',v:108,f:true},{yr:'2027',v:122,f:true},{yr:'2028',v:138,f:true}],
      skills:[['Verilog/VHDL',90],['FPGA Arch.',85],['Timing Analysis',80],['HW Debug',78],['Signal Proc.',75]],
      jobs:[{title:'FPGA Jr. Eng.',salary:'₹6–10L',company:'Electronics firms',color:'#0284C7'},{title:'FPGA Engineer',salary:'₹10–18L',company:'Defense/Telecom',color:'#0EA5E9'},{title:'Sr. FPGA Eng.',salary:'₹18–30L',company:'R&D',color:'#38BDF8'},{title:'Principal Eng.',salary:'₹30L+',company:'Aerospace',color:'#6366F1'}],
      radarSkills:[{skill:'Verilog',score:90},{skill:'FPGA',score:85},{skill:'Timing',score:80},{skill:'Debug',score:78},{skill:'DSP',score:75}]},
  ]},
  { id:'mech', label:'⚙️ Mechanical', roles:[
    { icon:'🤖', title:'Robotics Engineer', roleKey:'Robotics Engineer', desc:'Build autonomous machines', hot:true, salary:['₹6L','₹15L','₹30L+'], demand:'High', growth:'+40%',
      trend:[{yr:'2017',v:15},{yr:'2018',v:20},{yr:'2019',v:28},{yr:'2020',v:38},{yr:'2021',v:50},{yr:'2022',v:62},{yr:'2023',v:76},{yr:'2024',v:90},{yr:'2025',v:105,f:true},{yr:'2026',v:122,f:true},{yr:'2027',v:142,f:true},{yr:'2028',v:165,f:true}],
      skills:[['ROS/ROS2',88],['Python/C++',85],['Kinematics',80],['Computer Vision',75],['Control',82]],
      jobs:[{title:'Robotics Jr.',salary:'₹5–9L',company:'Startups',color:'#0284C7'},{title:'Robotics Eng.',salary:'₹10–20L',company:'Automation cos',color:'#0EA5E9'},{title:'Sr. Robotics Eng.',salary:'₹20–35L',company:'R&D labs',color:'#38BDF8'},{title:'Robotics Architect',salary:'₹35L+',company:'Tier-1 cos',color:'#6366F1'}],
      radarSkills:[{skill:'ROS',score:88},{skill:'Python',score:85},{skill:'Kinemat.',score:80},{skill:'CV',score:75},{skill:'Control',score:82}]},
    { icon:'✈️', title:'Aerospace Engineer', roleKey:'Aerospace Engineer', desc:'Aircraft & spacecraft design', hot:false, salary:['₹6L','₹14L','₹28L+'], demand:'Moderate', growth:'+22%',
      trend:[{yr:'2017',v:30},{yr:'2018',v:33},{yr:'2019',v:36},{yr:'2020',v:40},{yr:'2021',v:46},{yr:'2022',v:54},{yr:'2023',v:65},{yr:'2024',v:75},{yr:'2025',v:83,f:true},{yr:'2026',v:92,f:true},{yr:'2027',v:102,f:true},{yr:'2028',v:114,f:true}],
      skills:[['CAD/CAE',90],['Aerodynamics',85],['FEA',82],['CFD',78],['Materials',75]],
      jobs:[{title:'Jr. Aero Eng.',salary:'₹5–9L',company:'Defence/ISRO',color:'#0284C7'},{title:'Aero Eng.',salary:'₹9–18L',company:'Aerospace OEMs',color:'#0EA5E9'},{title:'Sr. Aero Eng.',salary:'₹18–30L',company:'Tier-1 suppliers',color:'#38BDF8'},{title:'Chief Eng.',salary:'₹30L+',company:'ISRO/DRDO/Airbus',color:'#6366F1'}],
      radarSkills:[{skill:'CAD',score:90},{skill:'Aero',score:85},{skill:'FEA',score:82},{skill:'CFD',score:78},{skill:'Mater.',score:75}]},
    { icon:'🚗', title:'Automotive Engineer', roleKey:'Automotive Engineer', desc:'Design & develop vehicles', hot:true, salary:['₹5L','₹13L','₹25L+'], demand:'High', growth:'+30%',
      trend:[{yr:'2017',v:25},{yr:'2018',v:28},{yr:'2019',v:32},{yr:'2020',v:38},{yr:'2021',v:48},{yr:'2022',v:58},{yr:'2023',v:70},{yr:'2024',v:82},{yr:'2025',v:94,f:true},{yr:'2026',v:108,f:true},{yr:'2027',v:124,f:true},{yr:'2028',v:142,f:true}],
      skills:[['CAD',88],['EV Systems',82],['Vehicle Dynamics',80],['MATLAB',75],['ADAS',72]],
      jobs:[{title:'Jr. Auto Eng.',salary:'₹4–8L',company:'Tier-2 suppliers',color:'#0284C7'},{title:'Auto Engineer',salary:'₹9–18L',company:'OEMs (Tata, M&M)',color:'#0EA5E9'},{title:'Sr. Engineer',salary:'₹18–28L',company:'Tier-1 / EV cos',color:'#38BDF8'},{title:'Technical Lead',salary:'₹28L+',company:'Global OEMs',color:'#6366F1'}],
      radarSkills:[{skill:'CAD',score:88},{skill:'EV',score:82},{skill:'Dynamics',score:80},{skill:'MATLAB',score:75},{skill:'ADAS',score:72}]},
    { icon:'⚙️', title:'Mechanical Design', roleKey:'Mechanical Design Engineer', desc:'Design machines & systems', hot:false, salary:['₹5L','₹12L','₹22L+'], demand:'Moderate', growth:'+18%',
      trend:[{yr:'2017',v:35},{yr:'2018',v:38},{yr:'2019',v:42},{yr:'2020',v:47},{yr:'2021',v:54},{yr:'2022',v:62},{yr:'2023',v:72},{yr:'2024',v:82},{yr:'2025',v:91,f:true},{yr:'2026',v:100,f:true},{yr:'2027',v:111,f:true},{yr:'2028',v:123,f:true}],
      skills:[['SolidWorks/CATIA',90],['FEA/FEM',85],['GD&T',78],['Material Sci.',75],['3D Modeling',88]],
      jobs:[{title:'Jr. Design Eng.',salary:'₹4–8L',company:'Mfg. firms',color:'#0284C7'},{title:'Design Engineer',salary:'₹8–15L',company:'OEMs',color:'#0EA5E9'},{title:'Sr. Design Eng.',salary:'₹15–25L',company:'Tier-1',color:'#38BDF8'},{title:'Chief Design',salary:'₹25L+',company:'Global firms',color:'#6366F1'}],
      radarSkills:[{skill:'CAD',score:90},{skill:'FEA',score:85},{skill:'GD&T',score:78},{skill:'Mater.',score:75},{skill:'3D',score:88}]},
  ]},
  { id:'others', label:'🚀 Business / Design', roles:[
    { icon:'🎨', title:'UI/UX Designer', roleKey:'UI UX Designer', desc:'Design user experiences', hot:false, salary:['₹4L','₹12L','₹25L+'], demand:'High', growth:'+28%',
      trend:[{yr:'2017',v:30},{yr:'2018',v:36},{yr:'2019',v:42},{yr:'2020',v:52},{yr:'2021',v:62},{yr:'2022',v:72},{yr:'2023',v:82},{yr:'2024',v:92},{yr:'2025',v:102,f:true},{yr:'2026',v:114,f:true},{yr:'2027',v:128,f:true},{yr:'2028',v:144,f:true}],
      skills:[['Figma',95],['User Research',85],['Prototyping',88],['Design Systems',80],['CSS/HTML',70]],
      jobs:[{title:'Jr. UX Designer',salary:'₹3–6L',company:'Agencies',color:'#0284C7'},{title:'UX Designer',salary:'₹8–15L',company:'Product cos',color:'#0EA5E9'},{title:'Senior UX',salary:'₹15–28L',company:'SaaS/Fintech',color:'#38BDF8'},{title:'Design Lead',salary:'₹28L+',company:'Big Tech',color:'#6366F1'}],
      radarSkills:[{skill:'Figma',score:95},{skill:'Research',score:85},{skill:'Prototype',score:88},{skill:'DS',score:80},{skill:'CSS',score:70}]},
    { icon:'📦', title:'Product Manager', roleKey:'Product Manager', desc:'Lead product development', hot:true, salary:['₹8L','₹20L','₹40L+'], demand:'Very High', growth:'+38%',
      trend:[{yr:'2017',v:25},{yr:'2018',v:30},{yr:'2019',v:38},{yr:'2020',v:48},{yr:'2021',v:60},{yr:'2022',v:72},{yr:'2023',v:84},{yr:'2024',v:96},{yr:'2025',v:110,f:true},{yr:'2026',v:126,f:true},{yr:'2027',v:144,f:true},{yr:'2028',v:165,f:true}],
      skills:[['Strategy',90],['Data Analysis',85],['Roadmapping',88],['Agile/Scrum',85],['Communication',92]],
      jobs:[{title:'Associate PM',salary:'₹7–12L',company:'Startups',color:'#0284C7'},{title:'Product Manager',salary:'₹15–28L',company:'SaaS/Fintech',color:'#0EA5E9'},{title:'Sr. PM',salary:'₹28–45L',company:'Unicorns',color:'#38BDF8'},{title:'Director of PM',salary:'₹45L+',company:'Big Tech',color:'#6366F1'}],
      radarSkills:[{skill:'Strategy',score:90},{skill:'Data',score:85},{skill:'Roadmap',score:88},{skill:'Agile',score:85},{skill:'Comms',score:92}]},
    { icon:'📲', title:'Mobile Dev', roleKey:'Mobile App Developer', desc:'iOS & Android applications', hot:false, salary:['₹5L','₹14L','₹26L+'], demand:'High', growth:'+25%',
      trend:[{yr:'2017',v:35},{yr:'2018',v:40},{yr:'2019',v:46},{yr:'2020',v:54},{yr:'2021',v:62},{yr:'2022',v:72},{yr:'2023',v:82},{yr:'2024',v:93},{yr:'2025',v:104,f:true},{yr:'2026',v:116,f:true},{yr:'2027',v:130,f:true},{yr:'2028',v:145,f:true}],
      skills:[['React Native',88],['Kotlin/Swift',85],['APIs',90],['State Mgmt',82],['UI/UX',78]],
      jobs:[{title:'Jr. Mobile Dev',salary:'₹4–8L',company:'Agencies',color:'#0284C7'},{title:'Mobile Engineer',salary:'₹10–18L',company:'Product cos',color:'#0EA5E9'},{title:'Sr. Mobile Eng.',salary:'₹18–30L',company:'Unicorns',color:'#38BDF8'},{title:'Mobile Architect',salary:'₹30L+',company:'Big Tech',color:'#6366F1'}],
      radarSkills:[{skill:'RN/Flutter',score:88},{skill:'Native',score:85},{skill:'APIs',score:90},{skill:'State',score:82},{skill:'UI',score:78}]},
    { icon:'📊', title:'Business Analyst', roleKey:'Business Analyst', desc:'Analyze business processes', hot:false, salary:['₹5L','₹12L','₹22L+'], demand:'Moderate', growth:'+20%',
      trend:[{yr:'2017',v:32},{yr:'2018',v:36},{yr:'2019',v:42},{yr:'2020',v:48},{yr:'2021',v:56},{yr:'2022',v:65},{yr:'2023',v:74},{yr:'2024',v:84},{yr:'2025',v:93,f:true},{yr:'2026',v:103,f:true},{yr:'2027',v:115,f:true},{yr:'2028',v:128,f:true}],
      skills:[['Excel/SQL',88],['Tableau/BI',85],['Req. Gathering',82],['Documentation',80],['Agile',75]],
      jobs:[{title:'Jr. BA',salary:'₹4–8L',company:'IT Services',color:'#0284C7'},{title:'Business Analyst',salary:'₹8–15L',company:'BFSI/Tech',color:'#0EA5E9'},{title:'Sr. BA',salary:'₹15–25L',company:'Consulting',color:'#38BDF8'},{title:'Business Architect',salary:'₹25L+',company:'MNCs',color:'#6366F1'}],
      radarSkills:[{skill:'Excel',score:88},{skill:'BI',score:85},{skill:'Req.',score:82},{skill:'Docs',score:80},{skill:'Agile',score:75}]},
  ]},
];

const DEMO_SKILLS = { resume_skills:['Python','Machine Learning','SQL','Pandas','NumPy'], job_skills:['Python','Machine Learning','SQL','Deep Learning','TensorFlow','PyTorch'] };
const DEMO_SUGGESTIONS = { skill_gap_analysis:['Missing Deep Learning knowledge','No TensorFlow/PyTorch experience','Limited model deployment skills'], recommended_learning:['Take Deep Learning Specialization on Coursera','Learn TensorFlow or PyTorch through official docs','Practice model deployment with Flask or FastAPI'], suggested_projects:['Build an image classifier with CNN','Create a sentiment analysis pipeline','Deploy an ML model to cloud'], career_roles:['Junior ML Engineer','Data Analyst with ML focus','Research Assistant'], career_growth_tips:['Contribute to open-source ML projects','Participate in Kaggle competitions','Build a strong GitHub portfolio'] };

const FEAT_UNBOX = [
  ["24/7 Available","10K+ Queries","95% Accuracy"],
  ["50+ Career Roles","AI Forecasts to 2028","10 Fields Covered"],
  ["ATS Score: 98%","Live Preview","PDF Export Ready"],
  ["Skill Gap Detection","Match Score Analysis","Role Fit Report"],
  ["Radar Visualization","5-Axis Skill Map","Gap Insights AI"],
  ["3 Core Tools","Progress Tracking","Quick Access Hub"],
];

const FEAT_ANIMS = [
  'slideFromLeft .7s ease .1s both',
  'flipFromRight .82s ease .18s both',
  'bounceIn .65s ease .14s both',
  'flipFromLeft .82s ease .24s both',
  'popRotateCW .68s ease .2s both',
  'slideFromRight .7s ease .3s both',
];
const STEP_ANIMS = [
  'popRotateCW .7s ease .35s both',
  'bounceIn .62s ease .52s both',
  'popRotateCCW .7s ease .68s both',
  'expandCenter .65s ease .84s both',
];
const QS_ANIMS = [
  'slideFromLeft .52s ease .05s both',
  'dropBounce .62s ease .14s both',
  'slideFromRight .52s ease .1s both',
  'expandCenter .52s ease .2s both',
];
const DASH_ANIMS = [
  'slideFromLeft .65s ease .15s both',
  'expandCenter .72s cubic-bezier(.34,1.56,.64,1) .3s both',
  'slideFromRight .65s ease .45s both',
];
const SKILL_COLORS = ["#0EA5E9","#38BDF8","#0284C7","#6366F1","#F59E0B"];
const JOB_ICONS = ["🌱","💼","🚀","👑"];

// ─── TYPEWRITER ───────────────────────────────────────────────
function TypeWriter() {
  const line1 = 'Shape Your ';
  const line1Grad = 'Future';
  const line2 = 'With AI Guidance';
  const total = line1.length + line1Grad.length + line2.length;
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!started || count >= total) return;
    const delay = count < line1.length + line1Grad.length ? 58 : 52;
    const t = setTimeout(() => setCount(c => c + 1), delay);
    return () => clearTimeout(t);
  }, [count, started, total, line1.length, line1Grad.length]);

  const l1 = line1.slice(0, Math.min(count, line1.length));
  const l1g = count > line1.length ? line1Grad.slice(0, count - line1.length) : '';
  const l2chars = count > line1.length + line1Grad.length ? count - line1.length - line1Grad.length : 0;
  const l2 = line2.slice(0, l2chars);
  const done = count >= total;

  return (
    <>
      {l1}<span className="grad-text">{l1g}</span>
      {l2chars > 0 && <><br/>{l2}</>}
      {!done && <span className="tw-cursor">|</span>}
    </>
  );
}

// ─── BG BLOBS ─────────────────────────────────────────────────
function BgCanvas() {
  return (
    <div className="bg-canvas">
      <div className="bg-blob bg-blob-1" />
      <div className="bg-blob bg-blob-2" />
      <div className="bg-blob bg-blob-3" />
      <div className="bg-blob bg-blob-4" />
    </div>
  );
}

// ─── PARTICLES ────────────────────────────────────────────────
function ParticlesBG() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, raf;
    const COLORS = ["#0EA5E9","#38BDF8","#0284C7","#BAE6FD","#7DD3FC"];
    const particles = [];
    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < 65; i++) {
      particles.push({ x:Math.random()*W, y:Math.random()*H, vx:(Math.random()-.5)*.38, vy:(Math.random()-.5)*.38,
        r:Math.random()*1.4+.4, color:COLORS[Math.floor(Math.random()*5)], opacity:Math.random()*.25+.06 });
    }
    function draw() {
      ctx.clearRect(0,0,W,H);
      for (let i=0;i<particles.length;i++) {
        const p=particles[i]; p.x+=p.vx; p.y+=p.vy;
        if(p.x<0||p.x>W) p.vx*=-1; if(p.y<0||p.y>H) p.vy*=-1;
        ctx.save(); ctx.globalAlpha=p.opacity; ctx.fillStyle=p.color;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill(); ctx.restore();
        for (let j=i+1;j<particles.length;j++) {
          const q=particles[j]; const d=Math.hypot(p.x-q.x,p.y-q.y);
          if(d<110){ ctx.save(); ctx.globalAlpha=(1-d/110)*.07; ctx.strokeStyle="#0EA5E9"; ctx.lineWidth=.5;
            ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y); ctx.stroke(); ctx.restore(); }
        }
      }
      raf=requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize",resize); };
  }, []);
  return <canvas ref={canvasRef} style={{position:"fixed",top:0,left:0,zIndex:0,pointerEvents:"none"}} />;
}

// ─── NAVBAR ───────────────────────────────────────────────────
function Navbar({ page, navigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const links = [
    {id:"home",label:"Home"},{id:"dashboard",label:"Dashboard"},
    {id:"chatbot",label:"Chatbot"},{id:"career",label:"Career"},{id:"resume",label:"Resume"},
  ];
  const go = (id) => { navigate(id); setOpen(false); };
  return (
    <header className={`navbar${scrolled?" scrolled":""}`}>
      <button className="brand" onClick={() => go("home")}>🎓 SmartEduCare</button>
      <button className={`hamburger${open?" open":""}`} onClick={() => setOpen(!open)} aria-label="menu">
        <span/><span/><span/>
      </button>
      <nav className={`nav-links${open?" open":""}`}>
        {links.map(l => (
          <a key={l.id} className={page===l.id?"active":""} onClick={() => go(l.id)}>{l.label}</a>
        ))}
        <a className="nav-cta" onClick={() => go("career-path")}>Get Started</a>
      </nav>
    </header>
  );
}

// ─── COUNTER ──────────────────────────────────────────────────
function useCounter(target, trigger) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let cur = 0; const step = target / 60;
    const timer = setInterval(() => {
      cur = Math.min(cur + step, target);
      setCount(Math.floor(cur));
      if (cur >= target) clearInterval(timer);
    }, 22);
    return () => clearInterval(timer);
  }, [trigger, target]);
  return count;
}

function StatItem({ num, label, delay, anim }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const count = useCounter(num, visible);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if(e.isIntersecting) setVisible(true); }, {threshold:0.5});
    if(ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div className="stat-item" ref={ref} style={{animation:`${anim} ${delay}s ease both`}}>
      <span className="stat-num">{count}+</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────
function HomePage({ navigate }) {
  const sp = useSpotlight();
  const features = [
    { icon:"🤖", title:"AI Chatbot", desc:"Get instant 24/7 answers to academic and career questions from our intelligent assistant.", page:"chatbot", link:"Start Chatting" },
    { icon:"🚀", title:"Career Path Finder", desc:"Explore tailored roadmaps across CSE, ECE, Mechanical, and MBA with step-by-step guidance.", page:"career-path", link:"Find Your Path" },
    { icon:"📄", title:"Resume Builder", desc:"Create ATS-optimized resumes in minutes. Fill details and download a professionally formatted PDF.", page:"resume", link:"Build Resume" },
    { icon:"🎯", title:"Job Matching", desc:"Upload your resume and a job description to get a match score, skill gap analysis and suggestions.", page:"career", link:"Analyze Match" },
    { icon:"📊", title:"Skill Radar", desc:"Visualize your skills against job requirements with an interactive radar chart.", page:"career", link:"See Chart" },
    { icon:"🧭", title:"Dashboard Hub", desc:"Access all tools from one centralized dashboard. Track progress and jump right back in.", page:"dashboard", link:"Open Dashboard" },
  ];
  const STAT_ANIMS = ['dropBounce','bounceIn','popRotateCW','slideFromRight'];
  return (
    <div className="page-wrap page-enter">
      <BgCanvas />
      <ParticlesBG />
      <section className="hero">
        <div className="hero-badge"><span className="badge-dot" />AI-Powered Education Platform</div>
        <span className="hero-icon">🤖</span>
        <h1><TypeWriter /></h1>
        <p className="hero-sub">SmartEduCare combines intelligent career counseling, resume building, and skill gap analysis to launch your professional journey.</p>
        <div className="hero-btns">
          <button className="btn btn-primary" onClick={() => navigate("career-path")}>Explore Career Paths →</button>
          <button className="btn btn-ghost" onClick={() => navigate("dashboard")}>View Dashboard</button>
        </div>
        <div className="scroll-hint"><span className="scroll-arrow">↓</span><span>Scroll to explore</span></div>
      </section>

      <div className="stats-row" style={{position:"relative",zIndex:1}}>
        {[["50","Career Paths",.3],["200","Resume Templates",.45],["10","Engineering Fields",.6],["100","Happy Students",.75]].map(([num,label,delay],i) => (
          <StatItem key={label} num={Number(num)} label={label} delay={delay} anim={STAT_ANIMS[i]} />
        ))}
      </div>

      <section className="features-section">
        <div style={{textAlign:"center",marginBottom:".75rem"}}><span className="s-label">What We Offer</span></div>
        <div style={{textAlign:"center",marginBottom:".75rem"}}><h2 className="s-title">Everything To <span className="grad-text">Succeed</span></h2></div>
        <div style={{textAlign:"center",marginBottom:"3.5rem"}}><p className="s-sub" style={{margin:"0 auto"}}>Comprehensive tools designed for engineering students to navigate their career journey.</p></div>
        <div className="feat-grid">
          {features.map((f,i) => (
            <div className="feat-card" key={i}
              style={{...sp.style(i), animation:FEAT_ANIMS[i]}}
              {...sp.bind(i)}>
              <div className="feat-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <button className="feat-link" onClick={() => navigate(f.page)}>{f.link} →</button>
              <div className="feat-unbox">
                {FEAT_UNBOX[i].map((stat,j) => (
                  <div key={j} className="feat-unbox-row">{stat}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="how-section">
        <div style={{textAlign:"center",marginBottom:".75rem"}}><span className="s-label">Simple Process</span></div>
        <div style={{textAlign:"center",marginBottom:".75rem"}}><h2 className="s-title">How It <span className="grad-text">Works</span></h2></div>
        <div style={{textAlign:"center"}}><p className="s-sub" style={{margin:"0 auto"}}>Get from confused to career-ready in four easy steps.</p></div>
        <div className="steps-grid">
          {[["1","Choose Field","Pick your engineering discipline."],
            ["2","Explore Roles","Browse specific job roles within your field."],
            ["3","Get Roadmap","Receive a 10-step actionable roadmap."],
            ["4","Build Resume","Create and download your ATS-friendly resume."]].map(([n,t,d],i) => (
            <div className="step-item" key={n} style={{animation:STEP_ANIMS[i]}}>
              <div className="step-num">{n}</div>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </section>

      <div style={{padding:"0 2rem 6rem",position:"relative",zIndex:1}}>
        <div className="cta-section">
          <h2 className="shimmer">Ready to Start?</h2>
          <p>Join thousands of students who've discovered their ideal career path.</p>
          <button className="btn btn-primary" onClick={() => navigate("career-path")}>Discover Your Career Path →</button>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────
function DashboardPage({ navigate }) {
  const sp = useSpotlight();
  const cards = [
    { tag:"AI Powered", tagCls:"tag-orange", stripe:"card-stripe-orange", glow:"#0EA5E9", icon:"🤖", title:"AI Chatbot", desc:"Get instant answers to academic and career questions.", features:["24/7 AI availability","Study & career tips","Quick query shortcuts"], page:"chatbot", btnTxt:"Open Chatbot →" },
    { tag:"Smart Match", tagCls:"tag-magenta", stripe:"card-stripe-magenta", glow:"#6366F1", icon:"🚀", title:"Career Advisor", desc:"Upload resume & job description to see how well you match.", features:["Skill gap analysis","Match score radar","Role suggestions"], page:"career", btnTxt:"Start Analysis →" },
    { tag:"ATS Ready", tagCls:"tag-teal", stripe:"card-stripe-teal", glow:"#0284C7", icon:"📄", title:"Resume Builder", desc:"Create a professional ATS-friendly resume and download as PDF.", features:["Instant preview","PDF download","Skills tagging"], page:"resume", btnTxt:"Build Resume →" },
  ];
  return (
    <div className="page-wrap page-enter">
      <BgCanvas />
      <div className="main-wrap">
        <div className="page-head">
          <p className="page-welcome">// Welcome back 👋</p>
          <h1>Student Dashboard</h1>
        </div>
        <div className="qs-grid">
          {[["🛠️","3","Tools Available"],["🗺️","50+","Career Paths"],["📈","AI","Powered Analysis"],["⚡","Free","All Features"]].map(([icon,num,label],i) => (
            <div className="qs-card" key={i} style={{animation:QS_ANIMS[i]}}>
              <span className="qs-icon">{icon}</span>
              <span className="qs-num">{num}</span>
              <span className="qs-label">{label}</span>
            </div>
          ))}
        </div>
        <div className="section-divider"><span>── Your Tools ──</span></div>
        <div className="dash-grid">
          {cards.map((c,i) => (
            <div className={`dash-card ${c.stripe}`} key={i}
              style={{animation:DASH_ANIMS[i], ...sp.style(i)}}
              {...sp.bind(i)}>
              <div className="card-glow-orb" style={{background:c.glow}} />
              <span className={`card-badge-tag ${c.tagCls}`}>{c.tag}</span>
              <div className="dash-card-icon" style={{filter:`drop-shadow(0 0 14px ${c.glow}55)`}}>{c.icon}</div>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
              <ul className="card-features">
                {c.features.map((f,j) => <li key={j}>{f}</li>)}
              </ul>
              <button className="btn btn-primary" style={{width:"100%"}} onClick={() => navigate(c.page)}>{c.btnTxt}</button>
            </div>
          ))}
        </div>
        <div className="section-divider" style={{marginTop:"2.5rem"}}><span>── Explore ──</span></div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:"1rem",marginTop:"1.25rem"}}>
          <button className="btn btn-ghost" style={{animation:'slideFromLeft .5s ease .6s both'}} onClick={() => navigate("career-path")}>🗺️ Career Path Finder</button>
          <button className="btn btn-teal" style={{animation:'slideFromRight .5s ease .7s both'}} onClick={() => navigate("chatbot")}>💬 Ask AI Assistant</button>
        </div>
      </div>
    </div>
  );
}

// ─── CHATBOT ──────────────────────────────────────────────────
function ChatbotPage() {
  const [messages, setMessages] = useState([{ sender:"bot", text:"Hello! I'm your AI Student Assistant. I can help with career advice, study tips, and academic guidance. What would you like to know? 🎓" }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const chatboxRef = useRef(null);
  const getResponse = (msg) => {
    const m = msg.toLowerCase();
    for (const k in AI_RESPONSES) { if (m.includes(k)) return AI_RESPONSES[k]; }
    return "That's a great question! For detailed guidance, try our Career Path Finder or ask me about study tips, resume writing, or career advice! 🤔";
  };
  const sendMessage = useCallback((txt) => {
    const message = txt || input.trim();
    if (!message) return;
    setMessages(prev => [...prev, { sender:"user", text:message }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { sender:"bot", text:getResponse(message) }]);
    }, 900+Math.random()*500);
  }, [input]);
  useEffect(() => {
    if (chatboxRef.current) chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
  }, [messages, typing]);
  const quickQueries = [
    {label:"💡 What is AI?",q:"What is AI?"},
    {label:"📚 Improve grades",q:"How to improve grades?"},
    {label:"🚀 Career advice",q:"Career advice"},
    {label:"✏️ Study tips",q:"Study tips"},
    {label:"📄 Resume tips",q:"How to write a resume?"},
  ];
  return (
    <div className="page-wrap page-enter" style={{height:"100vh"}}>
      <BgCanvas />
      <div className="chat-wrap">
        <div className="chat-header" style={{animation:'dropBounce .7s ease both'}}>
          <div className="ai-avatar">🤖</div>
          <h2>AI Student Assistant</h2>
          <span className="online-status"><span className="status-dot" /> Online &amp; Ready</span>
        </div>
        <div className="quick-queries">
          {quickQueries.map((q,i) => <button key={q.q} className="qq-btn" style={{animation:`bounceIn .5s ease ${.1+i*.07}s both`}} onClick={() => sendMessage(q.q)}>{q.label}</button>)}
        </div>
        <div id="chatbox" ref={chatboxRef}>
          {messages.map((m,i) => (
            <div key={i} className={`msg ${m.sender}`}>
              <span className="msg-label">{m.sender==="user"?"// You":"// AI Assistant"}</span>
              <div className="msg-bubble" dangerouslySetInnerHTML={{__html: m.text.replace(/\n/g,"<br/>")}} />
            </div>
          ))}
          {typing && (
            <div className="msg bot">
              <span className="msg-label">// AI Assistant</span>
              <div className="typing-dots"><span/><span/><span/></div>
            </div>
          )}
        </div>
        <div className="input-row">
          <input className="chat-input" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMessage()} placeholder="Ask me anything..." />
          <button className="send-btn" onClick={() => sendMessage()}>Send ➤</button>
        </div>
      </div>
    </div>
  );
}

// ─── CAREER PAGE ──────────────────────────────────────────────
function CareerPage() {
  const [step, setStep] = useState(1);
  const [resumeFile, setResumeFile] = useState(null);
  const [jobFile, setJobFile] = useState(null);
  const [results, setResults] = useState(null);
  const progPct = { 1:"16%", 2:"50%", loading:"65%", 3:"100%" };
  const stepDots = [{n:1,label:"Resume"},{n:2,label:"Job Desc"},{n:3,label:"Results"}];
  const curStep = step==="loading"?2:step;

  const analyze = async () => {
    if (!jobFile) { alert("Please upload a job description."); return; }
    setStep("loading");
    try {
      const ctrl = new AbortController();
      const tid = setTimeout(() => ctrl.abort(), 8000);
      const fd = new FormData();
      fd.append("resume", resumeFile); fd.append("job", jobFile);
      const resp = await fetch("http://127.0.0.1:5000/analyze", { method:"POST", body:fd, signal:ctrl.signal });
      clearTimeout(tid);
      if (!resp.ok) throw new Error("HTTP "+resp.status);
      const data = await resp.json();
      if (!data.success) throw new Error(data.error);
      setResults({ score:data.score+"%", radarData:buildRadar(data.resume_skills,data.job_skills), suggestions:data.suggestions });
      setStep(3);
    } catch(e) {
      setResults({ score:"72%", radarData:buildRadar(DEMO_SKILLS.resume_skills,DEMO_SKILLS.job_skills), suggestions:DEMO_SUGGESTIONS, demo:true });
      setStep(3);
    }
  };

  const buildRadar = (rs,js) => {
    const all=[...new Set([...rs,...js])];
    return all.map(skill => ({ skill, Resume:rs.includes(skill)?1:0, Job:js.includes(skill)?1:0 }));
  };

  return (
    <div className="page-wrap page-enter">
      <BgCanvas />
      <div className="career-wrap">
        <h1 className="page-title">🎯 Resume Job Matching</h1>
        <div className="stepper">
          {stepDots.map((d) => (
            <div key={d.n} className={`step-dot${curStep===d.n?" active":""}${curStep>d.n?" done":""}`}>
              <div className="step-circle">{curStep>d.n?"✓":d.n}</div>
              <span className="step-dot-label">{d.label}</span>
            </div>
          ))}
        </div>
        <div className="prog-bar"><div className="prog-fill" style={{width:progPct[step]||"16%"}} /></div>

        {step===1 && (
          <div className="step-card">
            <h2>📄 Upload Your Resume</h2>
            <p className="step-desc">Upload your resume in PDF, DOC, or DOCX format.</p>
            <label className={`upload-zone${resumeFile?" has-file":""}`}>
              <input type="file" accept=".pdf,.doc,.docx" style={{display:"none"}} onChange={e=>setResumeFile(e.target.files[0])} />
              <span className="upload-icon">📁</span>
              <p>Drop resume here or <strong>click to browse</strong></p>
              {resumeFile && <div className="file-name">✅ {resumeFile.name}</div>}
            </label>
            <div className="upload-btn-wrap">
              <button className="btn btn-primary"
                style={{width:"50%", minWidth:160}}
                onClick={() => { if(!resumeFile){alert("Please upload your resume.");return;} setStep(2); }}>
                Continue →
              </button>
            </div>
          </div>
        )}

        {step===2 && (
          <div className="step-card">
            <h2>💼 Upload Job Description</h2>
            <p className="step-desc">Upload the job description to compare against your resume.</p>
            <label className={`upload-zone${jobFile?" has-file":""}`}>
              <input type="file" accept=".pdf,.doc,.docx" style={{display:"none"}} onChange={e=>setJobFile(e.target.files[0])} />
              <span className="upload-icon">📋</span>
              <p>Drop job description here or <strong>click to browse</strong></p>
              {jobFile && <div className="file-name">✅ {jobFile.name}</div>}
            </label>
            <div style={{display:"flex",gap:"1rem",flexWrap:"wrap"}}>
              <button className="btn btn-ghost btn-sm" style={{flex:"0 0 auto"}} onClick={() => setStep(1)}>← Back</button>
              <button className="btn btn-primary" style={{flex:1}} onClick={analyze}>Analyze Match →</button>
            </div>
          </div>
        )}

        {step==="loading" && (
          <div className="step-card" style={{textAlign:"center",padding:"4rem 2rem"}}>
            <div className="spinner" />
            <p style={{color:"var(--muted)"}}>Analyzing resume against job description...</p>
          </div>
        )}

        {step===3 && results && (
          <div className="step-card">
            <h2>📊 Match Results</h2>
            {results.demo && <p style={{color:"var(--teal)",fontSize:".82rem",marginBottom:"1.5rem",fontFamily:"'Fira Code',monospace"}}>⚡ Demo mode — showing sample data.</p>}
            <div style={{textAlign:"center",padding:"1.5rem 0"}}>
              <div className="score-ring">{results.score}</div>
              <strong style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.2rem",letterSpacing:"2px",color:"var(--text)"}}>Match Score</strong>
            </div>
            <div className="chart-box">
              <h3>Skill Comparison Radar</h3>
              <SvgRadarChart data={results.radarData.map(d => ({ skill:d.skill, score:((d.Resume+d.Job)/2)*100 }))} />
            </div>
            {Object.entries({"🎯 Skill Gap Analysis":"skill_gap_analysis","📚 Recommended Learning":"recommended_learning","🚀 Suggested Projects":"suggested_projects","💼 Career Roles":"career_roles","📈 Growth Tips":"career_growth_tips"}).map(([label,key]) => (
              results.suggestions[key]?.length > 0 && (
                <div key={key} className="suggestion-card">
                  <h3>{label}</h3>
                  <ul>{results.suggestions[key].map((item,i) => <li key={i}>{item}</li>)}</ul>
                </div>
              )
            ))}
            <button className="btn btn-ghost" style={{width:"100%",marginTop:"1rem"}} onClick={() => { setStep(1); setResumeFile(null); setJobFile(null); setResults(null); }}>Start Over ↺</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SKILL BAR ────────────────────────────────────────────────
function SkillBar({ name, pct, color, delay }) {
  const [width, setWidth] = useState(0);
  useEffect(() => { const t = setTimeout(() => setWidth(pct), delay); return () => clearTimeout(t); }, [pct, delay]);
  return (
    <div className="cp-skill-row">
      <div className="cp-skill-name">{name}</div>
      <div className="cp-skill-track"><div className="cp-skill-fill" style={{width:`${width}%`, background:color}} /></div>
      <div className="cp-skill-pct" style={{color}}>{pct}%</div>
    </div>
  );
}

// ─── SVG TREND CHART ──────────────────────────────────────────
function SvgTrendChart({ data }) {
  const [tooltip, setTooltip] = useState(null);
  const W=580,H=210,PL=42,PR=18,PT=14,PB=34;
  const cW=W-PL-PR, cH=H-PT-PB;
  const vals=data.map(d=>d.v); const minV=Math.min(...vals), maxV=Math.max(...vals); const range=maxV-minV||1;
  const px=(i)=>PL+(i/(data.length-1))*cW;
  const py=(v)=>PT+cH-((v-minV)/range)*cH;
  const pastIdx=data.reduce((last,d,i)=>(!d.f?i:last),0);
  const histData=data.slice(0,pastIdx+1); const foreData=data.slice(pastIdx);
  const toPath=(pts)=>pts.map((d,i)=>`${i===0?"M":"L"}${px(data.indexOf(d))},${py(d.v)}`).join(" ");
  const yTicks=[0,.25,.5,.75,1].map(t=>({v:Math.round(minV+t*range),y:PT+cH-t*cH}));
  const nowIdx=data.findIndex(d=>String(d.yr)==="2024"); const nowX=nowIdx>=0?px(nowIdx):null;
  return (
    <div style={{width:"100%",overflowX:"auto"}}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{display:"block",maxWidth:W,margin:"0 auto"}} onMouseLeave={()=>setTooltip(null)}>
        <defs>
          <linearGradient id="histGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0284C7"/><stop offset="100%" stopColor="#38BDF8"/>
          </linearGradient>
          <linearGradient id="foreGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#38BDF8"/><stop offset="100%" stopColor="#6366F1"/>
          </linearGradient>
        </defs>
        {yTicks.map(t=><line key={t.v} x1={PL} x2={W-PR} y1={t.y} y2={t.y} stroke="rgba(14,165,233,0.1)" strokeWidth="1"/>)}
        {nowX!==null&&<>
          <line x1={nowX} x2={nowX} y1={PT} y2={PT+cH} stroke="rgba(14,165,233,0.45)" strokeWidth="1.5" strokeDasharray="4 3"/>
          <text x={nowX+4} y={PT+12} fill="#0EA5E9" fontSize="9.5" fontFamily="'Fira Code',monospace">NOW</text>
        </>}
        <path d={toPath(histData)} fill="none" stroke="url(#histGrad)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
        <path d={toPath(foreData)} fill="none" stroke="url(#foreGrad)" strokeWidth="2" strokeDasharray="6 4" strokeLinejoin="round" strokeLinecap="round"/>
        {data.map((d,i)=>(
          <g key={i}>
            <circle cx={px(i)} cy={py(d.v)} r={3.5} fill={d.f?"#38BDF8":"#0EA5E9"}/>
            <circle cx={px(i)} cy={py(d.v)} r={13} fill="transparent" style={{cursor:"pointer"}} onMouseEnter={()=>setTooltip({i,x:px(i),y:py(d.v),yr:d.yr,v:d.v,f:!!d.f})}/>
          </g>
        ))}
        {tooltip&&(()=>{
          const tx=Math.min(tooltip.x+8,W-80),ty=Math.max(tooltip.y-38,PT);
          return (<g>
            <rect x={tx} y={ty} width={76} height={30} rx={7} fill="rgba(12,45,72,0.95)" stroke="rgba(14,165,233,0.45)" strokeWidth="1"/>
            <text x={tx+8} y={ty+12} fill="#38BDF8" fontSize="9" fontFamily="'Fira Code',monospace">{tooltip.yr}{tooltip.f?" (est.):":":"}</text>
            <text x={tx+8} y={ty+24} fill="#FFFFFF" fontSize="11" fontWeight="700" fontFamily="'Bebas Neue',sans-serif">{tooltip.v}</text>
          </g>);
        })()}
        {data.map((d,i)=>i%2===0&&<text key={i} x={px(i)} y={H-5} textAnchor="middle" fill="#94A3B8" fontSize="9.5" fontFamily="'Fira Code',monospace">{d.yr}</text>)}
        {yTicks.map(t=><text key={t.v} x={PL-5} y={t.y+4} textAnchor="end" fill="#94A3B8" fontSize="9">{t.v}</text>)}
      </svg>
    </div>
  );
}

// ─── SVG RADAR CHART ──────────────────────────────────────────
function SvgRadarChart({ data }) {
  const [hovered, setHovered] = useState(null);
  const SIZE=270,CX=135,CY=135,R=98;
  const n=data.length; const angle=(i)=>(Math.PI*2*i)/n-Math.PI/2;
  const point=(i,r)=>({x:CX+r*Math.cos(angle(i)),y:CY+r*Math.sin(angle(i))});
  const rings=Array.from({length:5},(_,k)=>{const r=(R*(k+1))/5; const pts=Array.from({length:n},(_,i)=>point(i,r)); return pts.map((p,i)=>`${i===0?"M":"L"}${p.x},${p.y}`).join(" ")+"Z";});
  const dataPts=data.map((d,i)=>point(i,(d.score/100)*R));
  const dataPath=dataPts.map((p,i)=>`${i===0?"M":"L"}${p.x},${p.y}`).join(" ")+"Z";
  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width="100%" style={{display:"block",maxWidth:SIZE,margin:"0 auto"}}>
      <defs>
        <radialGradient id="radarFill2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.35"/>
          <stop offset="100%" stopColor="#7DD3FC" stopOpacity="0.08"/>
        </radialGradient>
      </defs>
      {rings.map((d,k)=><path key={k} d={d} fill="none" stroke="rgba(14,165,233,0.12)" strokeWidth="1"/>)}
      {data.map((_,i)=>{const outer=point(i,R); return <line key={i} x1={CX} y1={CY} x2={outer.x} y2={outer.y} stroke="rgba(14,165,233,0.1)" strokeWidth="1"/>;} )}
      <path d={dataPath} fill="url(#radarFill2)" stroke="#0EA5E9" strokeWidth="2" strokeLinejoin="round"/>
      {dataPts.map((p,i)=>(
        <circle key={i} cx={p.x} cy={p.y} r={hovered===i?7:4.5}
          fill={hovered===i?"#38BDF8":"#0EA5E9"} stroke="rgba(255,255,255,0.9)" strokeWidth="2"
          style={{cursor:"pointer",transition:"r .15s,fill .15s"}}
          onMouseEnter={()=>setHovered(i)} onMouseLeave={()=>setHovered(null)}/>
      ))}
      {hovered!==null&&(()=>{const p=dataPts[hovered];const d=data[hovered];const bx=Math.min(Math.max(p.x-38,4),SIZE-78);const by=Math.max(p.y-46,4); return (<g><rect x={bx} y={by} width={74} height={32} rx={8} fill="rgba(12,45,72,0.95)" stroke="rgba(14,165,233,0.45)" strokeWidth="1"/><text x={bx+8} y={by+13} fill="#38BDF8" fontSize="9.5" fontFamily="'Fira Code',monospace" fontWeight="600">{d.skill}</text><text x={bx+8} y={by+26} fill="#FFFFFF" fontSize="12" fontWeight="700" fontFamily="'Bebas Neue',sans-serif">{d.score}%</text></g>);})()}
      {data.map((d,i)=>{const pad=15;const p=point(i,R+pad);const anchor=Math.abs(Math.cos(angle(i)))<0.1?"middle":Math.cos(angle(i))>0?"start":"end"; return <text key={i} x={p.x} y={p.y+4} textAnchor={anchor} fill="#64748B" fontSize="10" fontWeight="600" fontFamily="'Barlow',sans-serif">{d.skill}</text>;})}
    </svg>
  );
}

// ─── TREND TAB ────────────────────────────────────────────────
function TrendTab({ role }) {
  if (!role?.trend?.length) return <p style={{color:"var(--muted)",fontSize:".9rem",padding:"1rem 0"}}>No trend data available.</p>;
  return (
    <div>
      <div className="cp-sal-grid">
        {[["Entry Level",role.salary[0],"#0284C7"],["Mid Level",role.salary[1],"#0EA5E9"],["Senior Level",role.salary[2],"#38BDF8"]].map(([lbl,val,clr])=>(
          <div className="cp-sal-card" key={lbl}><div className="cp-sal-label">{lbl}</div><div className="cp-sal-val" style={{color:clr}}>{val}</div></div>
        ))}
      </div>
      <div className="cp-sec-hdr"><div className="cp-sec-line"/><div className="cp-sec-txt">Job Demand — Past &amp; AI Forecast</div></div>
      <p style={{color:"var(--muted)",fontSize:".78rem",marginBottom:"1rem",fontFamily:"'Fira Code',monospace"}}>Historical index 2017–2024 + forecasted growth through 2028</p>
      <div style={{background:"rgba(14,165,233,0.03)",border:"1px solid rgba(14,165,233,.1)",borderRadius:16,padding:"1rem .5rem .5rem"}}>
        <SvgTrendChart data={role.trend}/>
      </div>
      <div style={{display:"flex",gap:"1.5rem",marginTop:".85rem",fontSize:".74rem",color:"var(--muted)",fontFamily:"'Fira Code',monospace"}}>
        <span style={{display:"flex",alignItems:"center",gap:6}}>
          <span style={{width:18,height:3,background:"linear-gradient(90deg,#0284C7,#38BDF8)",borderRadius:2,display:"inline-block"}}/>Historical
        </span>
        <span style={{display:"flex",alignItems:"center",gap:6}}>
          <span style={{width:18,height:3,borderTop:"2.5px dashed #38BDF8",display:"inline-block"}}/>AI Forecast
        </span>
      </div>
    </div>
  );
}

// ─── JOBS TAB ─────────────────────────────────────────────────
function JobsTab({ role }) {
  return (
    <div>
      <div className="cp-sec-hdr"><div className="cp-sec-line"/><div className="cp-sec-txt">Career Progression Path</div></div>
      <p style={{color:"var(--muted)",fontSize:".78rem",marginBottom:"1.5rem",fontFamily:"'Fira Code',monospace"}}>Step-by-step job ladder from fresher to senior</p>
      <div className="cp-job-flow">
        {role.jobs.map((j,i)=>(
          <div key={i} className="cp-job-step">
            <div className="cp-job-left">
              <div className="cp-job-circle" style={{background:`${j.color}18`,border:`2px solid ${j.color}`}}>{JOB_ICONS[i]}</div>
              {i<role.jobs.length-1&&<div className="cp-job-connector" style={{background:`linear-gradient(${j.color},${role.jobs[i+1].color})`}}/>}
            </div>
            <div className="cp-job-card">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:".5rem"}}>
                <div><div className="cp-job-role-name" style={{color:j.color}}>{j.title}</div><div className="cp-job-company">{j.company}</div></div>
                <div className="cp-job-salary" style={{background:`${j.color}18`,border:`1px solid ${j.color}44`,color:j.color}}>{j.salary}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SKILLS TAB ───────────────────────────────────────────────
function SkillsTab({ role }) {
  if (!role?.skills?.length) return null;
  return (
    <div>
      <div className="cp-sec-hdr"><div className="cp-sec-line"/><div className="cp-sec-txt">Core Skills Required</div></div>
      <p style={{color:"var(--muted)",fontSize:".78rem",marginBottom:"1.5rem",fontFamily:"'Fira Code',monospace"}}>Industry importance score for {role.title} roles</p>
      {role.skills.map(([name,pct],i)=><SkillBar key={name} name={name} pct={pct} color={SKILL_COLORS[i%5]} delay={i*100}/>)}
      <div style={{marginTop:"1.8rem"}}>
        <div className="cp-sec-hdr"><div className="cp-sec-line"/><div className="cp-sec-txt">Skill Radar</div></div>
        <div style={{background:"rgba(14,165,233,0.03)",border:"1px solid rgba(14,165,233,.1)",borderRadius:16,padding:"1rem .5rem",marginTop:".75rem"}}>
          <SvgRadarChart data={role.radarSkills}/>
        </div>
      </div>
    </div>
  );
}

// ─── ROADMAP TAB ──────────────────────────────────────────────
function RoadmapTab({ role, navigate }) {
  const steps = CAREER_ROADMAPS[role.roleKey] || [];
  return (
    <div>
      <div className="cp-sec-hdr"><div className="cp-sec-line"/><div className="cp-sec-txt">10-Step Learning Roadmap</div></div>
      <p style={{color:"var(--muted)",fontSize:".78rem",marginBottom:"1.5rem",fontFamily:"'Fira Code',monospace"}}>Structured path from beginner to job-ready {role.title}</p>
      <div className="cp-rm-grid">
        {steps.map((step,i)=>(
          <div key={i} className="cp-rm-step" style={{animation:`${i%2===0?'slideFromLeft':'slideFromRight'} .4s ease ${i*.05}s both`}}>
            <div className="cp-rm-num">{i+1}</div>
            <div className="cp-rm-text">{step}</div>
          </div>
        ))}
      </div>
      <div className="cp-cta-row" style={{marginTop:"2rem"}}>
        <button className="btn btn-primary" onClick={()=>navigate("resume")}>📄 Build Your Resume →</button>
        <button className="btn btn-ghost" onClick={()=>navigate("career")}>🎯 Match to Job →</button>
      </div>
    </div>
  );
}

// ─── CAREER PATH PAGE ─────────────────────────────────────────
function CareerPathPage({ navigate }) {
  const [activeField, setActiveField] = useState("cse");
  const [selectedRole, setSelectedRole] = useState(null);
  const [activeTab, setActiveTab] = useState("trend");
  const [search, setSearch] = useState("");
  const detailRef = useRef(null);
  const sp = useSpotlight();

  const allRoles = CP_FIELDS.flatMap(f=>f.roles.map(r=>({...r,fieldId:f.id})));
  const displayedRoles = search
    ? allRoles.filter(r=>r.title.toLowerCase().includes(search.toLowerCase())||r.desc.toLowerCase().includes(search.toLowerCase()))
    : (CP_FIELDS.find(f=>f.id===activeField)?.roles||[]);

  const handleRoleClick = (role) => {
    setSelectedRole(prev=>prev?.title===role.title?null:role);
    setActiveTab("trend");
    setTimeout(()=>{ if(detailRef.current) detailRef.current.scrollIntoView({behavior:"smooth",block:"start"}); },120);
  };

  const TABS = [
    {id:"trend",label:"📈 Trends"},
    {id:"jobs",label:"💼 Job Levels"},
    {id:"skills",label:"🛠 Skills"},
    {id:"roadmap",label:"🗺 Roadmap"},
  ];

  const ROLE_ANIMS = ['slideFromLeft','expandCenter','slideFromRight','flipFromLeft','bounceIn','flipFromRight'];

  return (
    <div className="page-wrap page-enter">
      <BgCanvas/>
      <div className="cp-wrap">
        <div className="cp-hero">
          <div className="cp-eyebrow"><span className="cp-pulse"/>AI Career Intelligence</div>
          <h1>Discover Your <span className="grad-text">Career Path</span></h1>
          <p>Explore trends, salaries, growth forecasts &amp; personalised roadmaps for every engineering career.</p>
          <div className="cp-search-wrap">
            <input className="cp-search" placeholder="🔍  Search roles… e.g. Machine Learning, VLSI"
              value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
        </div>
        {!search&&(
          <div className="cp-tabs">
            {CP_FIELDS.map(f=>(
              <button key={f.id} className={`cp-tab${activeField===f.id?" active":""}`}
                onClick={()=>{setActiveField(f.id);setSelectedRole(null);setSearch("");}}>
                {f.label}
              </button>
            ))}
          </div>
        )}
        <div className="cp-role-grid">
          {displayedRoles.map((r,i)=>(
            <div key={r.title}
              className={`cp-role-card${selectedRole?.title===r.title?" selected":""}`}
              style={{
                animation:`${ROLE_ANIMS[i%ROLE_ANIMS.length]} .5s ease ${i*.06}s both`,
                transition:"all .38s cubic-bezier(.25,.46,.45,.94)",
                filter: sp.idx>=0&&sp.idx!==i?"blur(2px) brightness(0.8) saturate(0.4)":"none",
                transform: sp.idx===i?"translateY(-10px) scale(1.06)": sp.idx>=0?"scale(0.96)":"none",
                zIndex: sp.idx===i?20:1,
                position:"relative",
                boxShadow: sp.idx===i?"0 20px 60px rgba(14,165,233,0.22),0 0 0 1px rgba(56,189,248,0.32)":"none",
              }}
              {...sp.bind(i)}
              onClick={()=>handleRoleClick(r)}>
              {r.hot&&<span className="cp-rc-hot">🔥 TRENDING</span>}
              <span className="cp-rc-icon">{r.icon}</span>
              <div className="cp-rc-title">{r.title}</div>
              <div className="cp-rc-desc">{r.desc}</div>
            </div>
          ))}
        </div>
        {selectedRole&&(
          <div className="cp-detail" ref={detailRef}>
            <div className="cp-dp-header">
              <div className="cp-dp-icon">{selectedRole.icon}</div>
              <div>
                <div className="cp-dp-title">{selectedRole.title}</div>
                <div className="cp-dp-meta">
                  <span className="cp-dp-badge cp-b-green">💰 {selectedRole.salary[2]}</span>
                  <span className="cp-dp-badge cp-b-cyan">📈 {selectedRole.demand} Demand</span>
                  <span className="cp-dp-badge cp-b-amber">🚀 {selectedRole.growth} Growth</span>
                </div>
              </div>
            </div>
            <div className="cp-dp-tabs">
              {TABS.map(t=>(
                <button key={t.id} className={`cp-dp-tab${activeTab===t.id?" active":""}`} onClick={()=>setActiveTab(t.id)}>{t.label}</button>
              ))}
            </div>
            <div className="cp-dp-content">
              <ErrorBoundary key={selectedRole.roleKey+"-"+activeTab}>
                {activeTab==="trend"   &&<TrendTab   key={selectedRole.roleKey} role={selectedRole}/>}
                {activeTab==="jobs"    &&<JobsTab    key={selectedRole.roleKey} role={selectedRole}/>}
                {activeTab==="skills"  &&<SkillsTab  key={selectedRole.roleKey} role={selectedRole}/>}
                {activeTab==="roadmap" &&<RoadmapTab key={selectedRole.roleKey} role={selectedRole} navigate={navigate}/>}
              </ErrorBoundary>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── RESUME BUILDER ───────────────────────────────────────────
function ResumeBuilderPage() {
  const [form, setForm] = useState({ name:"", email:"", phone:"", linkedin:"", skills:"", education:"", experience:"", projects:"" });
  const [preview, setPreview] = useState(null);
  const [success, setSuccess] = useState(false);
  const previewRef = useRef(null);
  const set = (k) => (e) => setForm(prev=>({...prev,[k]:e.target.value}));

  const generate = () => {
    if (!form.name||!form.email) { alert("Please enter at least your name and email."); return; }
    setPreview({...form}); setSuccess(true);
    setTimeout(()=>{ if(previewRef.current) previewRef.current.scrollIntoView({behavior:"smooth"}); },100);
  };

  const downloadPDF = () => {
    if (!preview) { alert("Please generate the resume first."); return; }
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>SmartEduCare_Resume</title>
        <style>
          * { margin:0; padding:0; box-sizing:border-box; }
          body { font-family: Arial, sans-serif; background:#fff; color:#1a1a2e; }
          .header { background: linear-gradient(135deg,#0C2D48 0%,#0369A1 100%); padding:2rem 2.5rem; }
          .name { font-size:2rem; font-weight:900; letter-spacing:3px; color:#fff; margin-bottom:.2rem; }
          .headline { font-size:.8rem; color:rgba(125,211,252,0.95); font-weight:700; letter-spacing:2px; text-transform:uppercase; }
          .contact { display:flex; gap:1.5rem; flex-wrap:wrap; padding:1rem 2.5rem; background:#f0f9ff; border-bottom:2px solid #bae6fd; }
          .contact span { font-size:.78rem; color:#64748b; font-weight:600; }
          .body { padding:1.5rem 2.5rem; }
          .section { margin-bottom:1.3rem; }
          .sec-title { font-size:.62rem; font-weight:800; letter-spacing:3.5px; text-transform:uppercase; color:#0284C7; padding-bottom:.4rem; border-bottom:2px solid #e0f2fe; margin-bottom:.65rem; }
          .sec-text { font-size:.85rem; color:#334155; line-height:1.7; white-space:pre-line; }
          .skills-row { display:flex; flex-wrap:wrap; gap:.35rem; }
          .skill-badge { padding:.28rem .75rem; border-radius:8px; font-size:.72rem; font-weight:800; background:rgba(14,165,233,0.1); color:#0284C7; border:1px solid rgba(14,165,233,.22); text-transform:uppercase; }
          @media print { body { -webkit-print-color-adjust:exact; print-color-adjust:exact; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="name">${preview.name}</div>
          ${preview.email ? `<div class="headline">${preview.email}</div>` : ''}
        </div>
        <div class="contact">
          ${preview.email ? `<span>📧 ${preview.email}</span>` : ''}
          ${preview.phone ? `<span>📞 ${preview.phone}</span>` : ''}
          ${preview.linkedin ? `<span>🔗 ${preview.linkedin}</span>` : ''}
        </div>
        <div class="body">
          ${preview.skills ? `<div class="section"><div class="sec-title">Skills</div><div class="skills-row">${preview.skills.split(",").map(s=>`<span class="skill-badge">${s.trim()}</span>`).join('')}</div></div>` : ''}
          ${preview.education ? `<div class="section"><div class="sec-title">Education</div><p class="sec-text">${preview.education}</p></div>` : ''}
          ${preview.experience ? `<div class="section"><div class="sec-title">Experience</div><p class="sec-text">${preview.experience}</p></div>` : ''}
          ${preview.projects ? `<div class="section"><div class="sec-title">Projects</div><p class="sec-text">${preview.projects}</p></div>` : ''}
        </div>
        <script>window.onload = function(){ window.print(); }<\/script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const reset = () => { setForm({name:"",email:"",phone:"",linkedin:"",skills:"",education:"",experience:"",projects:""}); setPreview(null); setSuccess(false); };

  return (
    <div className="page-wrap page-enter">
      <BgCanvas/>
      <div className="resume-wrap">
        <div className="resume-hero">
          <h1>📄 Resume Builder</h1>
          <p>Fill in your details and generate a sleek, ATS-optimised resume in seconds. Instant preview — download as PDF.</p>
        </div>
        <div className="resume-layout">
          <div>
            {success&&<div className="success-bar">✅ Resume generated — check the preview on the right!</div>}
            <div className="form-card2">
              <div className="form-card2-header">
                <span className="form-card2-icon">🪪</span>
                <div><div className="form-card2-title">Your Information</div><div className="form-card2-sub">// fill every field for best results</div></div>
              </div>
              <div className="form-section-label">Contact Info</div>
              <div className="field-grid">
                <div className="field"><input type="text" value={form.name} onChange={set("name")} placeholder=" "/><label>Full Name *</label></div>
                <div className="field"><input type="text" value={form.email} onChange={set("email")} placeholder=" "/><label>Email Address *</label></div>
              </div>
              <div className="field-grid">
                <div className="field"><input type="text" value={form.phone} onChange={set("phone")} placeholder=" "/><label>Phone Number</label></div>
                <div className="field"><input type="text" value={form.linkedin} onChange={set("linkedin")} placeholder=" "/><label>LinkedIn / Portfolio URL</label></div>
              </div>
              <div className="form-section-label">Skills</div>
              <div className="field"><input type="text" value={form.skills} onChange={set("skills")} placeholder=" "/><label>Skills (comma separated)</label></div>
              <div className="form-section-label">Education</div>
              <div className="field"><textarea value={form.education} onChange={set("education")} placeholder=" "/><label>Education Details</label></div>
              <div className="form-section-label">Experience</div>
              <div className="field"><textarea value={form.experience} onChange={set("experience")} placeholder=" "/><label>Work Experience</label></div>
              <div className="form-section-label">Projects</div>
              <div className="field"><textarea value={form.projects} onChange={set("projects")} placeholder=" "/><label>Projects (optional)</label></div>
              <div className="btn-row">
                <button className="btn btn-primary" onClick={generate}>✨ Generate Preview</button>
                <button className="btn btn-teal" onClick={downloadPDF}>📥 Download PDF</button>
                <button className="btn btn-ghost btn-sm" style={{flex:"0 0 auto"}} onClick={reset}>↺ Reset</button>
              </div>
            </div>
          </div>
          <div className="preview-pane" ref={previewRef}>
            {!preview ? (
              <div className="preview-placeholder">
                <span className="ph-icon">👁️</span>
                <div className="ph-title">Resume Preview</div>
                <div className="ph-sub">// fill your details &amp; click generate</div>
              </div>
            ) : (
              <div className="resume-preview" id="resume-preview-content">
                <div className="prev-header">
                  <div className="prev-name">{preview.name}</div>
                  {preview.email&&<div className="prev-headline">{preview.email}</div>}
                </div>
                <div className="prev-contact">
                  {preview.email&&<span>📧 {preview.email}</span>}
                  {preview.phone&&<span>📞 {preview.phone}</span>}
                  {preview.linkedin&&<span>🔗 {preview.linkedin}</span>}
                </div>
                <div className="prev-body">
                  {preview.skills&&<div className="prev-section"><div className="prev-sec-title">Skills</div><div className="skills-row">{preview.skills.split(",").map((s,i)=><span key={i} className="skill-badge">{s.trim()}</span>)}</div></div>}
                  {preview.education&&<div className="prev-section"><div className="prev-sec-title">Education</div><p className="prev-text">{preview.education}</p></div>}
                  {preview.experience&&<div className="prev-section"><div className="prev-sec-title">Experience</div><p className="prev-text">{preview.experience}</p></div>}
                  {preview.projects&&<div className="prev-section"><div className="prev-sec-title">Projects</div><p className="prev-text">{preview.projects}</p></div>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [transitioning, setTransitioning] = useState(false);
  const navigate = useCallback((p) => {
    if (p===page) return;
    setTransitioning(true);
    setTimeout(()=>{ setPage(p); setTransitioning(false); window.scrollTo({top:0,behavior:"instant"}); },280);
  },[page]);
  const pages = { home:HomePage, dashboard:DashboardPage, chatbot:ChatbotPage, career:CareerPage, "career-path":CareerPathPage, resume:ResumeBuilderPage };
  const PageComponent = pages[page] || HomePage;
  return (
    <div style={{ opacity:transitioning?0:1, transform:transitioning?"translateY(-14px)":"none",
      transition:"all .28s ease", minHeight:"100vh", background:"#F0F9FF" }}>
      <style>{STYLES}</style>
      <Navbar page={page} navigate={navigate}/>
      <PageComponent navigate={navigate}/>
    </div>
  );
}