import { useState, useEffect, useRef, useCallback, Component } from "react";
// recharts no longer used — all charts replaced with pure SVG

// ─────────────────────────────────────────────────────────────
//  ERROR BOUNDARY — catches recharts / render crashes in Vite
// ─────────────────────────────────────────────────────────────
class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) { console.error("Chart error:", error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{padding:'2rem',textAlign:'center',color:'#8892a4',background:'rgba(99,102,241,0.05)',borderRadius:'14px',border:'1px solid rgba(99,102,241,0.2)'}}>
          <div style={{fontSize:'2rem',marginBottom:'0.75rem'}}>⚠️</div>
          <p style={{fontSize:'0.9rem',marginBottom:'1rem'}}>Chart failed to render. Try selecting a different tab or role.</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{padding:'0.5rem 1.25rem',borderRadius:'10px',background:'rgba(99,102,241,0.15)',border:'1px solid rgba(99,102,241,0.3)',color:'#a5b4fc',cursor:'pointer',fontFamily:'DM Sans,sans-serif',fontSize:'0.85rem'}}
          >Retry</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─────────────────────────────────────────────────────────────
//  GLOBAL CSS
// ─────────────────────────────────────────────────────────────
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap');

:root {
  --primary:#6366f1; --violet:#8b5cf6; --pink:#ec4899; --cyan:#06b6d4;
  --bg:#070b14; --bg2:#0d1220; --card:rgba(255,255,255,0.04);
  --border:rgba(99,102,241,0.22); --text:#f0f4ff; --muted:#8892a4;
  --grad:linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#ec4899 100%);
  --glow:0 0 40px rgba(99,102,241,0.35);
}
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--text);overflow-x:hidden;}

.page-wrap{
  min-height:100vh;
  background:var(--bg);
  background-image:radial-gradient(ellipse at 20% 15%,rgba(99,102,241,0.08) 0%,transparent 50%),
                   radial-gradient(ellipse at 80% 80%,rgba(139,92,246,0.06) 0%,transparent 50%);
}
.page-enter{animation:pgIn 0.55s cubic-bezier(0.25,0.46,0.45,0.94) both;}
@keyframes pgIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}

.navbar{
  position:fixed;top:0;left:0;right:0;z-index:1000;
  display:flex;justify-content:space-between;align-items:center;
  padding:1rem 2.5rem;
  background:rgba(7,11,20,0.85);backdrop-filter:blur(22px);
  border-bottom:1px solid var(--border);
  transition:all 0.4s ease;
}
.navbar.scrolled{padding:0.7rem 2.5rem;background:rgba(7,11,20,0.97);box-shadow:0 4px 30px rgba(0,0,0,0.5);}
.brand{
  font-family:'Syne',sans-serif;font-weight:800;font-size:1.45rem;
  background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
  cursor:pointer;border:none;background-color:transparent;letter-spacing:-0.5px;
}
.nav-links{display:flex;gap:0.2rem;align-items:center;}
.nav-links a{
  color:var(--muted);text-decoration:none;font-weight:500;
  padding:0.48rem 0.95rem;border-radius:10px;
  transition:all 0.25s ease;font-size:0.93rem;cursor:pointer;
  border:none;background:none;font-family:'DM Sans',sans-serif;
}
.nav-links a:hover{color:var(--text);background:rgba(99,102,241,0.12);}
.nav-links a.active{color:var(--text);background:rgba(99,102,241,0.14);}
.nav-cta{
  background:var(--grad) !important;color:white !important;
  -webkit-text-fill-color:white !important;
  padding:0.48rem 1.2rem !important;border-radius:10px;
}
.hamburger{display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:4px;}
.hamburger span{display:block;width:24px;height:2px;background:var(--text);border-radius:2px;transition:all 0.35s ease;}
.hamburger.open span:nth-child(1){transform:rotate(45deg) translate(5px,5px);}
.hamburger.open span:nth-child(2){opacity:0;transform:scaleX(0);}
.hamburger.open span:nth-child(3){transform:rotate(-45deg) translate(5px,-5px);}

.btn{
  display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;
  padding:0.875rem 2rem;border-radius:14px;border:none;
  font-family:'DM Sans',sans-serif;font-weight:600;font-size:0.95rem;
  cursor:pointer;text-decoration:none;transition:all 0.3s ease;
}
.btn-primary{background:var(--grad);color:white;box-shadow:0 4px 20px rgba(99,102,241,0.35);}
.btn-primary:hover{transform:translateY(-3px);box-shadow:0 8px 30px rgba(99,102,241,0.55);}
.btn-primary:active{transform:translateY(-1px);}
.btn-ghost{background:rgba(99,102,241,0.1);color:var(--text);border:1px solid var(--border);}
.btn-ghost:hover{background:rgba(99,102,241,0.18);border-color:rgba(99,102,241,0.4);transform:translateY(-3px);}
.btn-cyan{background:rgba(6,182,212,0.15);color:#22d3ee;border:1px solid rgba(6,182,212,0.25);}
.btn-cyan:hover{background:rgba(6,182,212,0.25);transform:translateY(-3px);}
.btn-sm{padding:0.6rem 1.25rem;font-size:0.85rem;border-radius:10px;}

.glass-card{background:var(--card);border:1px solid var(--border);border-radius:22px;backdrop-filter:blur(12px);}
.s-label{color:var(--primary);font-size:0.82rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;}
.s-title{font-family:'Syne',sans-serif;font-size:clamp(1.8rem,4vw,2.6rem);font-weight:800;letter-spacing:-1.5px;}
.s-sub{color:var(--muted);font-size:1rem;max-width:520px;}
.grad-text{background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}

.scroll-wrap{width:100%;overflow-x:auto;padding:0.5rem 0 1rem;}
.scroll-wrap::-webkit-scrollbar{height:5px;}
.scroll-wrap::-webkit-scrollbar-thumb{background:rgba(99,102,241,0.3);border-radius:5px;}
.cards-row{display:flex;gap:1.25rem;padding:0.5rem 0.25rem;min-width:max-content;}

/* HOME */
.hero{min-height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:8rem 2rem 4rem;position:relative;z-index:1;}
.hero-badge{display:inline-flex;align-items:center;gap:0.6rem;background:rgba(99,102,241,0.12);border:1px solid rgba(99,102,241,0.3);color:var(--primary);font-size:0.83rem;font-weight:600;padding:0.4rem 1.1rem;border-radius:50px;margin-bottom:2rem;animation:badgeIn 0.8s ease 0.3s both;}
.badge-dot{width:6px;height:6px;border-radius:50%;background:var(--cyan);animation:pulseDot 2s infinite;}
@keyframes badgeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes pulseDot{0%,100%{box-shadow:0 0 0 0 rgba(6,182,212,0.5)}50%{box-shadow:0 0 0 6px rgba(6,182,212,0)}}
.hero-icon{font-size:5rem;margin-bottom:1.5rem;display:block;animation:floatBounce 4s ease-in-out infinite;filter:drop-shadow(0 0 20px rgba(99,102,241,0.5));}
@keyframes floatBounce{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-22px) rotate(2deg)}}
.hero h1{font-family:'Syne',sans-serif;font-size:clamp(2.8rem,7vw,5rem);font-weight:800;line-height:1.08;letter-spacing:-2px;margin-bottom:1.5rem;animation:heroIn 0.9s ease 0.3s both;}
@keyframes heroIn{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:none}}
.hero-sub{font-size:clamp(1rem,2.5vw,1.25rem);color:var(--muted);max-width:560px;margin:0 auto 3rem;line-height:1.7;animation:heroIn 0.9s ease 0.5s both;}
.hero-btns{display:flex;gap:1rem;flex-wrap:wrap;justify-content:center;animation:heroIn 0.9s ease 0.7s both;}
.scroll-hint{position:absolute;bottom:2.5rem;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:0.5rem;color:var(--muted);font-size:0.78rem;animation:fadeIn 1s ease 1.5s both;}
.scroll-arrow{animation:scrollBounce 1.5s ease-in-out infinite;}
@keyframes scrollBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(8px)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}

.stats-row{display:flex;justify-content:center;flex-wrap:wrap;border-top:1px solid var(--border);border-bottom:1px solid var(--border);background:rgba(255,255,255,0.015);position:relative;z-index:1;}
.stat-item{flex:1;min-width:180px;text-align:center;padding:2rem 1.5rem;border-right:1px solid var(--border);}
.stat-item:last-child{border-right:none;}
.stat-num{font-family:'Syne',sans-serif;font-size:2.4rem;font-weight:800;display:block;background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.stat-label{color:var(--muted);font-size:0.88rem;margin-top:0.2rem;}

.features-section{padding:6rem 2rem;max-width:1200px;margin:0 auto;position:relative;z-index:1;}
.feat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1.5rem;margin-top:3.5rem;}
.feat-card{background:var(--card);border:1px solid var(--border);border-radius:20px;padding:2.5rem;transition:all 0.4s cubic-bezier(0.25,0.46,0.45,0.94);cursor:default;backdrop-filter:blur(10px);position:relative;overflow:hidden;}
.feat-card::before{content:'';position:absolute;inset:0;border-radius:20px;background:var(--grad);opacity:0;transition:opacity 0.4s;z-index:0;}
.feat-card:hover::before{opacity:0.06;}
.feat-card:hover{transform:translateY(-8px);border-color:rgba(99,102,241,0.5);box-shadow:0 20px 60px rgba(0,0,0,0.4);}
.feat-card>*{position:relative;z-index:1;}
.feat-icon{width:54px;height:54px;border-radius:16px;background:rgba(99,102,241,0.12);border:1px solid rgba(99,102,241,0.2);display:flex;align-items:center;justify-content:center;font-size:1.5rem;margin-bottom:1.5rem;transition:transform 0.4s ease;}
.feat-card:hover .feat-icon{transform:scale(1.1) rotate(5deg);}
.feat-card h3{font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:700;margin-bottom:0.7rem;letter-spacing:-0.3px;}
.feat-card p{color:var(--muted);font-size:0.92rem;line-height:1.65;margin:0;}
.feat-link{display:inline-flex;align-items:center;gap:0.4rem;color:var(--primary);font-size:0.84rem;font-weight:600;margin-top:1.2rem;cursor:pointer;border:none;background:none;font-family:'DM Sans',sans-serif;transition:gap 0.3s ease;padding:0;}
.feat-link:hover{gap:0.8rem;}

.how-section{padding:5rem 2rem;max-width:1000px;margin:0 auto;position:relative;z-index:1;}
.steps-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:2rem;margin-top:3.5rem;}
.step-item{text-align:center;padding:2rem 1.5rem;}
.step-num{width:50px;height:50px;border-radius:50%;background:var(--grad);display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:1.1rem;margin:0 auto 1.2rem;box-shadow:0 4px 20px rgba(99,102,241,0.4);color:white;}
.step-item h3{font-family:'Syne',sans-serif;font-weight:700;margin-bottom:0.4rem;font-size:1rem;}
.step-item p{color:var(--muted);font-size:0.88rem;margin:0;}

.cta-section{margin:4rem 2rem 6rem;max-width:800px;margin-left:auto;margin-right:auto;background:var(--card);border:1px solid var(--border);border-radius:28px;padding:4rem;text-align:center;position:relative;overflow:hidden;z-index:1;backdrop-filter:blur(10px);}
.cta-section::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 100%,rgba(99,102,241,0.15) 0%,transparent 70%);pointer-events:none;}
.cta-section h2{font-family:'Syne',sans-serif;font-size:2rem;font-weight:800;margin-bottom:1rem;letter-spacing:-1px;}
.cta-section p{color:var(--muted);margin-bottom:2.5rem;font-size:1.05rem;}

/* DASHBOARD */
.main-wrap{max-width:1200px;margin:0 auto;padding:7rem 2rem 4rem;}
.page-head{margin-bottom:2.5rem;}
.page-welcome{color:var(--muted);font-size:0.95rem;margin-bottom:0.3rem;}
.page-head h1{font-family:'Syne',sans-serif;font-size:clamp(1.8rem,4vw,2.6rem);font-weight:800;letter-spacing:-1.5px;background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.qs-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(155px,1fr));gap:1rem;margin-bottom:2.5rem;}
.qs-card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:1.4rem;display:flex;flex-direction:column;gap:0.4rem;transition:all 0.3s ease;backdrop-filter:blur(8px);animation:cardIn 0.5s ease both;}
.qs-card:hover{border-color:rgba(99,102,241,0.4);box-shadow:0 10px 30px rgba(0,0,0,0.3);transform:translateY(-4px);}
.qs-icon{font-size:1.5rem;}
.qs-num{font-family:'Syne',sans-serif;font-size:1.5rem;font-weight:800;}
.qs-label{color:var(--muted);font-size:0.8rem;}
@keyframes cardIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
.dash-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1.5rem;}
.dash-card{background:var(--card);border:1px solid var(--border);border-radius:22px;padding:2.5rem;text-align:center;position:relative;overflow:hidden;transition:all 0.4s cubic-bezier(0.25,0.46,0.45,0.94);backdrop-filter:blur(12px);animation:cardIn 0.6s ease both;}
.dash-card:hover{transform:translateY(-10px);border-color:rgba(99,102,241,0.5);box-shadow:0 25px 60px rgba(0,0,0,0.45);}
.card-glow{position:absolute;width:120px;height:120px;border-radius:50%;top:-30px;right:-30px;opacity:0.06;filter:blur(30px);transition:all 0.4s ease;}
.dash-card:hover .card-glow{opacity:0.18;transform:scale(1.3);}
.card-badge{display:inline-block;padding:0.28rem 0.82rem;border-radius:50px;font-size:0.72rem;font-weight:600;margin-bottom:1.3rem;letter-spacing:0.5px;text-transform:uppercase;}
.badge-purple{background:rgba(99,102,241,0.15);color:#818cf8;border:1px solid rgba(99,102,241,0.2);}
.badge-pink{background:rgba(236,72,153,0.12);color:#f472b6;border:1px solid rgba(236,72,153,0.2);}
.badge-cyan{background:rgba(6,182,212,0.12);color:#22d3ee;border:1px solid rgba(6,182,212,0.2);}
.dash-card-icon{font-size:3.2rem;margin-bottom:1.2rem;display:inline-block;transition:transform 0.4s cubic-bezier(0.34,1.56,0.64,1);filter:drop-shadow(0 0 12px rgba(99,102,241,0.3));}
.dash-card:hover .dash-card-icon{transform:scale(1.15) rotate(5deg);filter:drop-shadow(0 0 22px rgba(99,102,241,0.5));}
.dash-card h3{font-family:'Syne',sans-serif;font-size:1.3rem;font-weight:700;margin-bottom:0.6rem;position:relative;z-index:1;letter-spacing:-0.3px;}
.dash-card>p{color:var(--muted);margin-bottom:1.5rem;font-size:0.92rem;line-height:1.6;position:relative;z-index:1;}
.card-features{list-style:none;text-align:left;margin-bottom:2rem;display:flex;flex-direction:column;gap:0.45rem;position:relative;z-index:1;}
.card-features li{display:flex;align-items:center;gap:0.55rem;color:var(--muted);font-size:0.86rem;}
.card-features li::before{content:'✓';color:var(--primary);font-weight:700;font-size:0.73rem;}
.section-divider{text-align:center;margin:2.5rem 0 1.5rem;}
.section-divider span{color:var(--muted);font-size:0.82rem;letter-spacing:2px;text-transform:uppercase;}

/* CHATBOT */
.chat-wrap{max-width:820px;margin:0 auto;padding:6.5rem 1.5rem 2rem;display:flex;flex-direction:column;height:100vh;}
.chat-header{text-align:center;padding:1.25rem 0 0.75rem;flex-shrink:0;}
.ai-avatar{width:64px;height:64px;border-radius:20px;background:var(--grad);display:inline-flex;align-items:center;justify-content:center;font-size:1.8rem;margin-bottom:0.9rem;box-shadow:0 8px 30px rgba(99,102,241,0.4);animation:avatarPulse 3s ease-in-out infinite;}
@keyframes avatarPulse{0%,100%{box-shadow:0 8px 30px rgba(99,102,241,0.4)}50%{box-shadow:0 8px 40px rgba(99,102,241,0.7)}}
.chat-header h2{font-family:'Syne',sans-serif;font-size:1.4rem;font-weight:800;letter-spacing:-0.5px;margin-bottom:0.2rem;}
.online-status{display:inline-flex;align-items:center;gap:0.4rem;color:var(--muted);font-size:0.82rem;}
.status-dot{width:7px;height:7px;border-radius:50%;background:#10b981;animation:onlinePulse 2s infinite;}
@keyframes onlinePulse{0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,0.5)}50%{box-shadow:0 0 0 5px rgba(16,185,129,0)}}
.quick-queries{display:flex;gap:0.6rem;flex-wrap:wrap;padding:0.75rem 0;flex-shrink:0;justify-content:center;}
.qq-btn{padding:0.42rem 0.95rem;border-radius:50px;background:rgba(99,102,241,0.08);border:1px solid var(--border);color:var(--muted);font-size:0.8rem;font-weight:500;cursor:pointer;transition:all 0.25s ease;font-family:'DM Sans',sans-serif;white-space:nowrap;}
.qq-btn:hover{background:rgba(99,102,241,0.18);border-color:rgba(99,102,241,0.5);color:var(--text);transform:translateY(-2px);}
#chatbox{flex:1;overflow-y:auto;padding:1.25rem;display:flex;flex-direction:column;gap:1.2rem;background:var(--card);border:1px solid var(--border);border-radius:22px;backdrop-filter:blur(12px);scrollbar-width:thin;scrollbar-color:rgba(99,102,241,0.4) transparent;min-height:0;}
#chatbox::-webkit-scrollbar{width:5px;}
#chatbox::-webkit-scrollbar-thumb{background:rgba(99,102,241,0.3);border-radius:5px;}
.msg{max-width:78%;display:flex;flex-direction:column;gap:0.22rem;animation:msgIn 0.3s cubic-bezier(0.34,1.56,0.64,1);}
@keyframes msgIn{from{opacity:0;transform:translateY(10px) scale(0.97)}to{opacity:1;transform:none}}
.msg.user{align-self:flex-end;}
.msg.bot{align-self:flex-start;}
.msg-label{font-size:0.7rem;color:var(--muted);padding:0 0.4rem;font-weight:500;}
.msg.user .msg-label{text-align:right;}
.msg-bubble{padding:0.85rem 1.2rem;border-radius:18px;font-size:0.93rem;line-height:1.6;}
.msg.user .msg-bubble{background:var(--grad);color:white;border-bottom-right-radius:4px;box-shadow:0 4px 20px rgba(99,102,241,0.3);}
.msg.bot .msg-bubble{background:rgba(99,102,241,0.1);border:1px solid var(--border);color:var(--text);border-bottom-left-radius:4px;}
.typing-dots{display:inline-flex;align-items:center;gap:4px;background:rgba(99,102,241,0.1);border:1px solid var(--border);padding:0.85rem 1.2rem;border-radius:18px;border-bottom-left-radius:4px;}
.typing-dots span{width:7px;height:7px;border-radius:50%;background:var(--primary);animation:dotBounce 1.4s infinite ease-in-out;}
.typing-dots span:nth-child(1){animation-delay:0s;}
.typing-dots span:nth-child(2){animation-delay:0.2s;}
.typing-dots span:nth-child(3){animation-delay:0.4s;}
@keyframes dotBounce{0%,80%,100%{transform:scale(0.5);opacity:0.5}40%{transform:scale(1.1);opacity:1}}
.input-row{display:flex;gap:0.75rem;padding:0.9rem 0;flex-shrink:0;}
.chat-input{flex:1;padding:0.88rem 1.35rem;background:rgba(255,255,255,0.05);border:1.5px solid var(--border);border-radius:16px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:0.93rem;transition:all 0.3s ease;outline:none;}
.chat-input:focus{border-color:var(--primary);background:rgba(99,102,241,0.06);box-shadow:0 0 0 3px rgba(99,102,241,0.1);}
.chat-input::placeholder{color:var(--muted);}
.send-btn{padding:0.88rem 1.5rem;border-radius:16px;border:none;background:var(--grad);color:white;font-family:'DM Sans',sans-serif;font-weight:600;font-size:0.93rem;cursor:pointer;transition:all 0.3s ease;box-shadow:0 4px 15px rgba(99,102,241,0.35);white-space:nowrap;}
.send-btn:hover{transform:translateY(-3px);box-shadow:0 8px 25px rgba(99,102,241,0.5);}

/* CAREER PAGE */
.career-wrap{max-width:760px;margin:0 auto;padding:6.5rem 1.5rem 4rem;}
.page-title{font-family:'Syne',sans-serif;font-size:clamp(1.6rem,4vw,2.2rem);font-weight:800;letter-spacing:-1px;text-align:center;margin-bottom:2.5rem;background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.stepper{display:flex;align-items:center;justify-content:center;margin-bottom:2.5rem;}
.step-dot{display:flex;flex-direction:column;align-items:center;gap:0.38rem;flex:1;position:relative;}
.step-dot:not(:last-child)::after{content:'';position:absolute;top:18px;left:50%;width:100%;height:2px;background:rgba(99,102,241,0.2);z-index:0;transition:background 0.5s ease;}
.step-dot.done:not(:last-child)::after{background:var(--primary);}
.step-circle{width:36px;height:36px;border-radius:50%;border:2px solid rgba(99,102,241,0.3);background:transparent;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-size:0.82rem;font-weight:700;color:var(--muted);z-index:1;position:relative;transition:all 0.4s cubic-bezier(0.34,1.56,0.64,1);}
.step-dot.active .step-circle{background:var(--grad);color:white;border-color:transparent;box-shadow:0 4px 20px rgba(99,102,241,0.5);transform:scale(1.15);}
.step-dot.done .step-circle{background:rgba(99,102,241,0.2);color:var(--primary);border-color:var(--primary);}
.step-dot-label{font-size:0.7rem;color:var(--muted);font-weight:500;}
.step-dot.active .step-dot-label{color:var(--text);}
.prog-bar{background:rgba(99,102,241,0.12);border-radius:50px;height:5px;margin-bottom:2.5rem;overflow:hidden;}
.prog-fill{height:100%;background:var(--grad);border-radius:50px;transition:width 0.6s cubic-bezier(0.25,0.46,0.45,0.94);}
.step-card{background:var(--card);border:1px solid var(--border);border-radius:22px;padding:2.5rem;backdrop-filter:blur(12px);animation:stepIn 0.45s cubic-bezier(0.25,0.46,0.45,0.94);}
@keyframes stepIn{from{opacity:0;transform:translateY(20px) scale(0.98)}to{opacity:1;transform:none}}
.step-card h2{font-family:'Syne',sans-serif;font-size:1.45rem;font-weight:800;letter-spacing:-0.5px;margin-bottom:0.4rem;}
.step-desc{color:var(--muted);font-size:0.88rem;margin-bottom:2rem;}
.upload-zone{border:2px dashed var(--border);border-radius:16px;padding:2.5rem;text-align:center;cursor:pointer;transition:all 0.3s ease;background:rgba(99,102,241,0.04);margin-bottom:1.5rem;position:relative;overflow:hidden;}
.upload-zone:hover,.upload-zone.has-file{border-color:var(--primary);background:rgba(99,102,241,0.08);}
.upload-icon{font-size:2.5rem;margin-bottom:0.7rem;display:block;}
.upload-zone p{color:var(--muted);font-size:0.88rem;}
.file-name{color:var(--primary);font-weight:600;margin-top:0.45rem;font-size:0.88rem;}
.spinner{width:46px;height:46px;border:3px solid rgba(99,102,241,0.2);border-top:3px solid var(--primary);border-radius:50%;animation:spin 0.9s linear infinite;margin:0 auto 1.2rem;}
@keyframes spin{to{transform:rotate(360deg)}}
.score-ring{width:140px;height:140px;border-radius:50%;background:var(--grad);display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-size:2.2rem;font-weight:800;color:white;box-shadow:0 8px 40px rgba(99,102,241,0.5);animation:scoreReveal 0.8s cubic-bezier(0.34,1.56,0.64,1);margin:0 auto 1.5rem;}
@keyframes scoreReveal{from{transform:scale(0) rotate(-30deg)}to{transform:none}}
.suggestion-card{background:rgba(99,102,241,0.06);border-radius:14px;border-left:3px solid var(--primary);padding:1.2rem 1.5rem;margin-bottom:1rem;animation:slideInL 0.4s ease;}
@keyframes slideInL{from{opacity:0;transform:translateX(-15px)}to{opacity:1;transform:none}}
.suggestion-card h3{font-size:1rem;font-weight:600;margin-bottom:0.7rem;}
.suggestion-card ul{list-style:none;}
.suggestion-card li{padding:0.35rem 0;color:var(--muted);font-size:0.88rem;display:flex;align-items:flex-start;gap:0.55rem;border-bottom:1px solid rgba(99,102,241,0.1);}
.suggestion-card li:last-child{border-bottom:none;}
.suggestion-card li::before{content:'✓';color:var(--primary);font-weight:700;flex-shrink:0;margin-top:0.1rem;}
.chart-box{background:rgba(99,102,241,0.05);border:1px solid var(--border);border-radius:18px;padding:2rem;margin-bottom:2rem;}
.chart-box h3{font-family:'Syne',sans-serif;font-weight:700;margin-bottom:1.5rem;text-align:center;font-size:1.1rem;}

/* ─────────────── ENHANCED CAREER PATH ─────────────── */
.cp-wrap{max-width:1200px;margin:0 auto;padding:6.5rem 1.5rem 4rem;font-family:'Space Grotesk',sans-serif;}

/* Hero */
.cp-hero{text-align:center;margin-bottom:3rem;animation:fadeUp 0.6s ease both;}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
.cp-eyebrow{display:inline-flex;align-items:center;gap:8px;background:rgba(99,102,241,0.12);border:1px solid rgba(99,102,241,0.3);color:#a5b4fc;font-size:0.78rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;padding:6px 16px;border-radius:50px;margin-bottom:1.5rem;}
.cp-pulse{width:6px;height:6px;border-radius:50%;background:#06b6d4;animation:pulseDot 2s infinite;}
.cp-hero h1{font-family:'Syne',sans-serif;font-size:clamp(2rem,5vw,3.2rem);font-weight:800;letter-spacing:-2px;line-height:1.05;margin-bottom:1rem;}
.cp-hero p{color:var(--muted);font-size:1rem;max-width:480px;margin:0 auto;}

/* Search */
.cp-search-wrap{max-width:480px;margin:1.8rem auto 0;animation:fadeUp 0.6s ease 0.15s both;}
.cp-search{width:100%;padding:0.8rem 1.2rem;background:rgba(255,255,255,0.06);border:1px solid var(--border);border-radius:14px;color:var(--text);font-family:'Space Grotesk',sans-serif;font-size:0.92rem;outline:none;transition:all 0.3s;}
.cp-search:focus{border-color:rgba(99,102,241,0.5);background:rgba(99,102,241,0.06);}
.cp-search::placeholder{color:var(--muted);}

/* Field tabs */
.cp-tabs{display:flex;gap:0.6rem;flex-wrap:wrap;justify-content:center;margin:2.5rem 0 2rem;animation:fadeUp 0.6s ease 0.2s both;}
.cp-tab{display:flex;align-items:center;gap:8px;padding:0.6rem 1.25rem;border-radius:50px;background:rgba(255,255,255,0.04);border:1px solid var(--border);color:var(--muted);font-size:0.88rem;font-weight:500;cursor:pointer;transition:all 0.3s ease;font-family:'Space Grotesk',sans-serif;}
.cp-tab:hover{background:rgba(99,102,241,0.1);border-color:rgba(99,102,241,0.4);color:var(--text);transform:translateY(-2px);}
.cp-tab.active{background:rgba(99,102,241,0.15);border-color:rgba(99,102,241,0.5);color:var(--text);box-shadow:0 0 20px rgba(99,102,241,0.2);}

/* Role cards grid */
.cp-role-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:1rem;margin-bottom:2rem;}
.cp-role-card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:1.4rem;cursor:pointer;transition:all 0.35s cubic-bezier(0.34,1.56,0.64,1);position:relative;overflow:hidden;text-align:left;animation:cpCardIn 0.4s ease both;}
@keyframes cpCardIn{from{opacity:0;transform:translateY(15px) scale(0.96)}to{opacity:1;transform:none}}
.cp-role-card::before{content:'';position:absolute;inset:0;background:var(--grad);opacity:0;transition:opacity 0.3s;border-radius:16px;}
.cp-role-card:hover{transform:translateY(-6px) scale(1.02);border-color:rgba(99,102,241,0.5);box-shadow:0 20px 40px rgba(0,0,0,0.4);}
.cp-role-card:hover::before{opacity:0.06;}
.cp-role-card.selected{border-color:#6366f1;background:rgba(99,102,241,0.1);box-shadow:0 0 30px rgba(99,102,241,0.25);}
.cp-rc-icon{font-size:2rem;margin-bottom:0.75rem;display:block;transition:transform 0.4s ease;position:relative;z-index:1;}
.cp-role-card:hover .cp-rc-icon,.cp-role-card.selected .cp-rc-icon{transform:scale(1.2) rotate(8deg);}
.cp-rc-title{font-family:'Syne',sans-serif;font-weight:700;font-size:0.92rem;margin-bottom:0.3rem;position:relative;z-index:1;}
.cp-rc-desc{color:var(--muted);font-size:0.76rem;line-height:1.4;position:relative;z-index:1;}
.cp-rc-hot{position:absolute;top:0.7rem;right:0.7rem;background:rgba(245,158,11,0.15);border:1px solid rgba(245,158,11,0.3);color:#fbbf24;font-size:0.62rem;font-weight:700;padding:2px 7px;border-radius:50px;letter-spacing:0.5px;}

/* Detail panel */
.cp-detail{background:var(--card);border:1px solid var(--border);border-radius:24px;overflow:hidden;margin-top:2rem;animation:panelIn 0.5s cubic-bezier(0.25,0.46,0.45,0.94) both;}
@keyframes panelIn{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:none}}
.cp-dp-header{padding:2rem 2.5rem;background:linear-gradient(135deg,rgba(99,102,241,0.12),rgba(139,92,246,0.08));border-bottom:1px solid var(--border);display:flex;align-items:center;gap:1.5rem;flex-wrap:wrap;}
.cp-dp-icon{font-size:3rem;filter:drop-shadow(0 0 20px rgba(99,102,241,0.4));}
.cp-dp-title{font-family:'Syne',sans-serif;font-size:1.75rem;font-weight:800;letter-spacing:-1px;}
.cp-dp-meta{display:flex;gap:0.75rem;margin-top:0.5rem;flex-wrap:wrap;}
.cp-dp-badge{padding:4px 12px;border-radius:50px;font-size:0.74rem;font-weight:600;}
.cp-b-green{background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.25);color:#34d399;}
.cp-b-cyan{background:rgba(6,182,212,0.12);border:1px solid rgba(6,182,212,0.25);color:#22d3ee;}
.cp-b-amber{background:rgba(245,158,11,0.12);border:1px solid rgba(245,158,11,0.25);color:#fbbf24;}

/* Detail tabs */
.cp-dp-tabs{display:flex;border-bottom:1px solid var(--border);}
.cp-dp-tab{flex:1;padding:1rem;text-align:center;font-size:0.83rem;font-weight:600;color:var(--muted);cursor:pointer;border:none;background:none;font-family:'Space Grotesk',sans-serif;transition:all 0.3s;border-bottom:2px solid transparent;position:relative;top:1px;}
.cp-dp-tab.active{color:var(--text);border-bottom-color:#6366f1;}
.cp-dp-tab:hover:not(.active){color:var(--text);background:rgba(255,255,255,0.02);}
.cp-dp-content{padding:2rem 2.5rem;}

/* Section header inside detail */
.cp-sec-hdr{display:flex;align-items:center;gap:0.6rem;margin-bottom:1.2rem;}
.cp-sec-line{width:3px;height:18px;background:var(--grad);border-radius:2px;flex-shrink:0;}
.cp-sec-txt{font-family:'Syne',sans-serif;font-weight:700;font-size:1rem;}

/* Salary cards */
.cp-sal-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:2rem;}
.cp-sal-card{background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:14px;padding:1.2rem;text-align:center;}
.cp-sal-label{color:var(--muted);font-size:0.74rem;margin-bottom:0.4rem;}
.cp-sal-val{font-family:'Syne',sans-serif;font-size:1.35rem;font-weight:800;}

/* Skill bars */
.cp-skill-row{display:flex;align-items:center;gap:1rem;margin-bottom:0.9rem;}
.cp-skill-name{width:160px;flex-shrink:0;font-size:0.82rem;color:var(--muted);}
.cp-skill-track{flex:1;background:rgba(255,255,255,0.05);border-radius:50px;height:8px;overflow:hidden;}
.cp-skill-fill{height:100%;border-radius:50px;transition:width 0.9s cubic-bezier(0.25,0.46,0.45,0.94);}
.cp-skill-pct{width:36px;text-align:right;font-size:0.78rem;font-weight:600;}

/* Roadmap */
.cp-rm-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.85rem;}
.cp-rm-step{display:flex;align-items:flex-start;gap:0.85rem;background:rgba(99,102,241,0.05);border:1px solid rgba(99,102,241,0.12);border-radius:14px;padding:1rem 1.2rem;animation:fadeUp 0.4s ease both;}
.cp-rm-num{width:28px;height:28px;border-radius:50%;flex-shrink:0;background:var(--grad);color:white;display:flex;align-items:center;justify-content:center;font-size:0.72rem;font-weight:800;box-shadow:0 3px 12px rgba(99,102,241,0.4);}
.cp-rm-text{font-size:0.84rem;color:#cbd5e1;line-height:1.5;padding-top:0.2rem;}

/* Job flow */
.cp-job-flow{position:relative;}
.cp-job-step{display:flex;align-items:flex-start;gap:1.2rem;margin-bottom:0;}
.cp-job-left{display:flex;flex-direction:column;align-items:center;flex-shrink:0;}
.cp-job-circle{width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.1rem;z-index:1;position:relative;}
.cp-job-connector{width:2px;height:40px;margin:4px 0;opacity:0.4;}
.cp-job-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:1.1rem 1.4rem;flex:1;margin-bottom:12px;transition:border-color 0.3s;}
.cp-job-card:hover{border-color:rgba(99,102,241,0.4);}
.cp-job-role-name{font-weight:700;font-size:0.95rem;margin-bottom:0.2rem;}
.cp-job-company{color:var(--muted);font-size:0.8rem;}
.cp-job-salary{padding:4px 12px;border-radius:50px;font-size:0.78rem;font-weight:700;white-space:nowrap;}

/* CTA buttons at bottom of detail */
.cp-cta-row{display:flex;gap:1rem;flex-wrap:wrap;margin-top:1.5rem;}
.cp-cta-row .btn{flex:1;}

/* Responsive */
@media(max-width:640px){
  .cp-rm-grid{grid-template-columns:1fr;}
  .cp-sal-grid{grid-template-columns:1fr 1fr;}
  .cp-dp-content{padding:1.5rem;}
  .cp-dp-header{padding:1.5rem;}
  .cp-role-grid{grid-template-columns:repeat(auto-fill,minmax(150px,1fr));}
  .cp-dp-tab{font-size:0.73rem;padding:0.75rem 0.25rem;}
}

/* RESUME */
.resume-wrap{max-width:1100px;margin:0 auto;padding:6.5rem 1.5rem 4rem;}
.resume-layout{display:grid;grid-template-columns:1fr 1fr;gap:2rem;align-items:start;}
.form-card2{background:var(--card);border:1px solid var(--border);border-radius:22px;padding:2.5rem;backdrop-filter:blur(12px);}
.form-card2 h2{font-family:'Syne',sans-serif;font-size:1.15rem;font-weight:700;margin-bottom:2rem;display:flex;align-items:center;gap:0.55rem;}
.field{position:relative;margin-bottom:1.4rem;}
.field input,.field textarea{width:100%;padding:1.05rem 1.2rem 0.55rem;background:rgba(255,255,255,0.05);border:1.5px solid var(--border);border-radius:14px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:0.93rem;transition:all 0.3s ease;outline:none;resize:vertical;}
.field textarea{min-height:105px;padding-top:1.35rem;}
.field label{position:absolute;left:1.2rem;top:0.92rem;color:var(--muted);font-size:0.88rem;font-weight:500;transition:all 0.25s ease;pointer-events:none;background:transparent;}
.field input:focus,.field textarea:focus{border-color:var(--primary);background:rgba(99,102,241,0.06);box-shadow:0 0 0 3px rgba(99,102,241,0.1);}
.field input:focus+label,.field input:not(:placeholder-shown)+label,.field textarea:focus+label,.field textarea:not(:placeholder-shown)+label{top:0.3rem;font-size:0.7rem;color:var(--primary);}
.field input::placeholder,.field textarea::placeholder{opacity:0;}
.btn-row{display:flex;gap:0.7rem;flex-wrap:wrap;margin-top:0.3rem;}
.btn-row .btn{flex:1;}
.success-bar{display:flex;align-items:center;gap:0.5rem;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);border-radius:12px;padding:0.85rem 1.2rem;margin-bottom:1.3rem;color:#34d399;font-weight:600;font-size:0.88rem;animation:slideDown 0.3s ease;}
@keyframes slideDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:none}}
.preview-placeholder{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:280px;text-align:center;gap:0.9rem;color:var(--muted);background:var(--card);border:1.5px dashed var(--border);border-radius:18px;padding:3rem;}
.ph-icon{font-size:3rem;opacity:0.45;}
.resume-preview{background:white;border-radius:18px;padding:3rem;position:sticky;top:5.5rem;animation:previewIn 0.5s cubic-bezier(0.34,1.56,0.64,1);box-shadow:0 20px 60px rgba(0,0,0,0.5);color:#1a1a2e;}
@keyframes previewIn{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:none}}
.prev-name{font-size:1.75rem;font-weight:800;color:#1a1a2e;font-family:'Syne',sans-serif;margin-bottom:0.25rem;letter-spacing:-0.5px;}
.prev-contact{display:flex;gap:0.8rem;flex-wrap:wrap;margin-bottom:1.4rem;}
.prev-contact span{font-size:0.8rem;color:#64748b;}
.prev-section{margin-bottom:1.4rem;}
.prev-sec-title{font-size:0.68rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#6366f1;padding-bottom:0.45rem;border-bottom:2px solid #e2e8f0;margin-bottom:0.65rem;}
.prev-text{font-size:0.85rem;color:#334155;line-height:1.6;white-space:pre-line;}
.skills-row{display:flex;flex-wrap:wrap;gap:0.35rem;}
.skill-badge{padding:0.28rem 0.75rem;border-radius:50px;font-size:0.74rem;font-weight:600;background:rgba(99,102,241,0.1);color:#6366f1;border:1px solid rgba(99,102,241,0.2);}

/* RESPONSIVE */
@media(max-width:900px){.resume-layout{grid-template-columns:1fr;}.resume-preview{position:static;}}
@media(max-width:768px){
  .hamburger{display:flex;}
  .nav-links{display:none;position:absolute;top:100%;left:0;right:0;background:rgba(7,11,20,0.97);backdrop-filter:blur(20px);flex-direction:column;padding:1.5rem;border-bottom:1px solid var(--border);}
  .nav-links.open{display:flex;}
  .navbar{padding:1rem 1.5rem;}
  .stat-item{border-right:none;border-bottom:1px solid var(--border);}
  .stat-item:last-child{border-bottom:none;}
  .stats-row{flex-direction:column;}
  .hero-btns,.cta-section .hero-btns{flex-direction:column;align-items:center;}
  .hero-btns .btn,.cta-section .btn{width:100%;justify-content:center;}
  .cta-section{padding:2.5rem 1.5rem;}
  .chat-wrap{padding:5.5rem 1rem 1rem;}
  .msg{max-width:90%;}
  .input-row{flex-direction:column;}
  .send-btn{width:100%;}
  .step-dot-label{display:none;}
  .btn-row{flex-direction:column;}
  .resume-layout{grid-template-columns:1fr;}
  .form-card2{padding:1.75rem;}
}
`;

// ─────────────────────────────────────────────────────────────
//  DATA
// ─────────────────────────────────────────────────────────────
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
  "RF Engineer":["Learn Electronics fundamentals","Study RF communication principles","Learn Microwave engineering","Understand antenna design","Learn RF simulation tools","Work on RF circuits","Study wireless standards","Build RF projects","Intern in telecom companies","Apply for RF engineer roles"],
  "Semiconductor Engineer":["Learn semiconductor physics","Study microelectronics","Learn IC fabrication process","Understand chip manufacturing","Learn testing techniques","Work with semiconductor tools","Build semiconductor projects","Intern in chip companies","Learn industry standards","Apply for semiconductor jobs"],
  "Chip Design Engineer":["Learn Digital Electronics","Learn VLSI basics","Learn Verilog or VHDL","Learn ASIC design","Learn FPGA development","Use EDA tools","Build chip design projects","Understand chip architecture","Practice design simulations","Apply for chip design jobs"],
  "Control Systems Engineer":["Learn control systems theory","Learn MATLAB","Study signal processing","Understand system modeling","Learn automation systems","Build control system projects","Learn robotics control","Simulate systems","Work with sensors","Apply for control systems roles"],
  "Embedded Systems Engineer":["Learn C programming","Learn microcontrollers","Study electronics circuits","Learn Arduino and Raspberry Pi","Learn embedded Linux","Build embedded projects","Work with sensors and IoT","Learn RTOS concepts","Build embedded portfolio","Apply for embedded roles"],
  "VLSI Design Engineer":["Learn digital electronics","Learn VLSI design fundamentals","Learn Verilog HDL","Learn FPGA development","Use EDA tools","Study chip architecture","Build VLSI projects","Simulate circuits","Understand semiconductor design","Apply for VLSI jobs"],
  "FPGA Engineer":["Learn digital logic","Learn Verilog or VHDL","Understand FPGA architecture","Use FPGA development boards","Learn hardware debugging","Build FPGA projects","Learn signal processing","Work on hardware simulations","Build hardware portfolio","Apply for FPGA jobs"],
  "Telecommunication Engineer":["Learn communication systems","Study signal processing","Learn networking fundamentals","Learn wireless communication","Understand 4G/5G technologies","Work with telecom equipment","Build communication projects","Learn telecom protocols","Intern in telecom industry","Apply for telecom jobs"],
  "IoT Engineer":["Learn electronics basics","Learn programming (C/Python)","Learn Arduino and Raspberry Pi","Understand sensors and actuators","Learn IoT protocols","Work with cloud IoT platforms","Build IoT projects","Learn embedded systems","Deploy IoT solutions","Apply for IoT jobs"],
  "Hardware Engineer":["Learn electronics fundamentals","Study circuit design","Learn PCB design","Use hardware design tools","Build hardware prototypes","Test hardware systems","Work with microcontrollers","Build electronics projects","Create hardware portfolio","Apply for hardware engineer jobs"],
  "Aerospace Engineer":["Learn aerodynamics","Study aircraft structures","Learn propulsion systems","Study fluid mechanics","Learn CAD tools","Work on aerospace simulations","Build aerospace projects","Intern in aviation industry","Learn aerospace standards","Apply for aerospace jobs"],
  "Thermal Engineer":["Learn thermodynamics","Study heat transfer","Learn fluid mechanics","Use simulation tools","Design thermal systems","Work on energy systems","Build thermal projects","Optimize cooling systems","Study HVAC systems","Apply for thermal engineer roles"],
  "Maintenance Engineer":["Learn mechanical systems","Understand machine operations","Study maintenance techniques","Learn troubleshooting","Work with industrial equipment","Learn safety procedures","Build maintenance plans","Intern in manufacturing plants","Gain industrial experience","Apply for maintenance jobs"],
  "Quality Control Engineer":["Learn quality management systems","Study Six Sigma concepts","Learn testing methods","Understand manufacturing processes","Learn inspection tools","Work with quality standards","Perform product testing","Analyze defects","Improve production quality","Apply for QC roles"],
  "Mechanical Design Engineer":["Learn mechanical design principles","Learn CAD software","Study material science","Learn product design","Build design prototypes","Work with simulations","Optimize mechanical systems","Build design projects","Create engineering portfolio","Apply for design engineer roles"],
  "Manufacturing Engineer":["Learn manufacturing processes","Study industrial engineering","Learn production planning","Optimize manufacturing systems","Learn automation basics","Work on production lines","Improve process efficiency","Build manufacturing projects","Learn lean manufacturing","Apply for manufacturing jobs"],
  "Automotive Engineer":["Learn automotive systems","Study engine design","Learn vehicle dynamics","Use CAD tools","Study electric vehicles","Build automotive projects","Work with vehicle simulations","Intern in automotive companies","Learn automotive safety standards","Apply for automotive roles"],
  "Robotics Engineer":["Learn programming","Learn electronics basics","Study robotics principles","Learn sensors and actuators","Learn ROS framework","Build robot prototypes","Program robot movements","Integrate AI with robotics","Build robotics projects","Apply for robotics jobs"],
  "CAD Engineer":["Learn CAD software","Study mechanical drawing","Learn 3D modeling","Understand product design","Create design simulations","Build engineering models","Optimize product designs","Work on design projects","Build CAD portfolio","Apply for CAD jobs"],
  "Production Engineer":["Learn production processes","Study manufacturing planning","Learn industrial engineering","Optimize production systems","Improve workflow efficiency","Monitor manufacturing quality","Manage production lines","Build production reports","Learn lean manufacturing","Apply for production engineer jobs"],
  "UI UX Designer":["Learn design fundamentals (color, typography, layout)","Understand UX principles and user psychology","Learn design tools (Figma, Adobe XD, Sketch)","Study user research and user personas","Learn wireframing and prototyping","Study usability testing","Learn interaction design principles","Design real UI/UX projects","Build a strong design portfolio","Apply for UI/UX designer jobs"],
  "Product Manager":["Learn product management fundamentals","Understand business strategy and product lifecycle","Learn market research and user analysis","Study Agile and Scrum methodologies","Learn product roadmapping","Understand UX and product design basics","Learn data analysis and product metrics","Work on product case studies","Build product management portfolio","Apply for product manager roles"],
  "Business Analyst":["Learn business analysis fundamentals","Understand business processes and workflows","Learn data analysis using Excel","Learn SQL for data querying","Learn data visualization tools (Power BI or Tableau)","Understand requirement gathering techniques","Learn documentation (BRD, FRD)","Work on business case studies","Build portfolio with business analysis projects","Apply for business analyst roles"],
  "Digital Marketing Specialist":["Learn digital marketing fundamentals","Understand SEO","Learn Social Media Marketing","Learn Google Ads and PPC advertising","Learn content marketing strategies","Understand email marketing","Learn analytics tools (Google Analytics)","Run real marketing campaigns","Build marketing portfolio","Apply for digital marketing jobs"],
  "Mobile App Developer":["Learn programming basics","Learn Java or Kotlin for Android","Learn Swift for iOS development","Understand mobile UI/UX principles","Learn Android Studio or Xcode","Build mobile apps","Integrate APIs and databases","Test mobile applications","Publish apps on app stores","Apply for mobile developer roles"],
  "Game Developer":["Learn programming (C# or C++)","Learn game development basics","Learn Unity or Unreal Engine","Understand game physics","Learn 3D modeling basics","Build simple games","Add sound and animations","Optimize game performance","Publish games or demos","Apply for game developer jobs"],
  "Data Engineer":["Learn Python programming","Learn SQL databases","Learn data warehousing concepts","Learn ETL pipelines","Learn big data tools (Hadoop/Spark)","Work with cloud data platforms","Build data pipelines","Handle large datasets","Build data engineering projects","Apply for data engineer jobs"],
  "Content Creator":["Choose a content niche","Learn video editing tools","Learn storytelling and scripting","Understand social media platforms","Create consistent content","Build audience engagement","Learn branding and marketing","Collaborate with creators","Monetize content platforms","Grow personal brand"],
  "Entrepreneur":["Learn business fundamentals","Identify market problems","Develop business ideas","Learn startup planning","Understand marketing strategies","Build minimum viable product","Test business model","Seek funding or investors","Scale business operations","Launch and grow startup"],
};

const AI_RESPONSES = {
  'hello': 'Hello! Great to meet you! How can I help you today? 🎓',
  'hi': 'Hi there! Ready to help with your studies or career questions! 📚',
  'how are you': "I'm running at full capacity and ready to help you succeed! 🤖",
  'what is ai': "AI (Artificial Intelligence) enables computers to learn, reason, and solve problems — transforming every industry from education to healthcare. 🧠",
  'how to study': "Proven study techniques:\n\n1️⃣ Pomodoro – 25 min study, 5 min break\n2️⃣ Active recall – Test yourself instead of re-reading\n3️⃣ Spaced repetition – Review at increasing intervals\n4️⃣ Teach others – Forces deeper understanding\n5️⃣ Mind maps – Connect ideas visually 🗺️",
  'career advice': "Key career tips:\n\n🚀 Build real projects for your portfolio\n💼 Tailor your resume for each application\n🌐 Network actively on LinkedIn\n📚 Keep learning new skills\n🎯 Use our Career Path Finder for your personalized roadmap!",
  'grades': "Boost your grades:\n\n✏️ Attend every class and take notes\n📖 Review notes within 24 hours\n❓ Ask questions without hesitation\n👥 Join or form study groups\n⏰ Start assignments early, never cram!",
  'resume': "Resume essentials:\n\n📄 Keep it to 1 page for freshers\n🎯 Customize for each job description\n✅ Use action verbs: Built, Led, Designed\n📊 Quantify achievements\n⚡ Try our Resume Builder for a polished result!",
  'study tips': "Study tips that work:\n\n🧠 Study in your best mental state\n📵 Phone away while studying\n🎧 Lo-fi music for focus\n📝 Handwrite key concepts – boosts retention\n💤 Sleep 7–8 hrs – memory consolidates during sleep!",
  'how to write a resume': "For a great resume:\n\n📌 Strong summary at the top\n💼 Experience with impact metrics\n🛠️ Skills section with keywords\n🎓 Education with CGPA if strong\n🔗 Add GitHub, LinkedIn, portfolio links!\n\nTry our Resume Builder → it's free! 📄",
  'thank you': 'You are very welcome! Good luck with your studies! 💪',
  'bye': "Goodbye! Come back anytime! 👋 Best of luck! 🌟",
};

// ─────────────────────────────────────────────────────────────
//  CAREER PATH DATA
// ─────────────────────────────────────────────────────────────
const CP_FIELDS = [
  { id:'cse', label:'💻 CSE / Software', roles:[
    { icon:'🤖', title:'ML Engineer', roleKey:'Machine Learning Engineer', desc:'Build & deploy AI models', hot:true, salary:['₹8L','₹18L','₹35L+'], demand:'Very High', growth:'+42%',
      trend:[{yr:'2017',v:28},{yr:'2018',v:34},{yr:'2019',v:40},{yr:'2020',v:52},{yr:'2021',v:65},{yr:'2022',v:78},{yr:'2023',v:90},{yr:'2024',v:100},{yr:'2025',v:112,f:true},{yr:'2026',v:128,f:true},{yr:'2027',v:145,f:true},{yr:'2028',v:165,f:true}],
      skills:[['Python',95],['ML Frameworks',90],['Math/Stats',85],['MLOps',75],['SQL/Data',70]],
      jobs:[{title:'Junior ML Engineer',salary:'₹8–14L',company:'Startups & Mid-size',color:'#4ade80'},{title:'ML Engineer',salary:'₹14–25L',company:'Product Companies',color:'#22d3ee'},{title:'Senior ML Engineer',salary:'₹25–45L',company:'FAANG / Unicorns',color:'#a78bfa'},{title:'Staff ML Engineer',salary:'₹45L+',company:'Big Tech',color:'#f472b6'}],
      radarSkills:[{skill:'Python',score:95},{skill:'ML',score:90},{skill:'Stats',score:85},{skill:'MLOps',score:75},{skill:'SQL',score:70}]},
    { icon:'📊', title:'Data Scientist', roleKey:'Data Scientist', desc:'Mine insights from data', hot:true, salary:['₹6L','₹15L','₹30L+'], demand:'High', growth:'+35%',
      trend:[{yr:'2017',v:30},{yr:'2018',v:38},{yr:'2019',v:45},{yr:'2020',v:55},{yr:'2021',v:65},{yr:'2022',v:75},{yr:'2023',v:85},{yr:'2024',v:95},{yr:'2025',v:105,f:true},{yr:'2026',v:118,f:true},{yr:'2027',v:132,f:true},{yr:'2028',v:148,f:true}],
      skills:[['Python/R',90],['Statistics',88],['Visualization',80],['ML/AI',78],['SQL',85]],
      jobs:[{title:'Jr. Data Analyst',salary:'₹5–9L',company:'All industries',color:'#4ade80'},{title:'Data Scientist',salary:'₹12–22L',company:'Tech & Finance',color:'#22d3ee'},{title:'Senior Data Scientist',salary:'₹22–40L',company:'Product Firms',color:'#a78bfa'},{title:'Principal Scientist',salary:'₹40L+',company:'Research Labs',color:'#f472b6'}],
      radarSkills:[{skill:'Python/R',score:90},{skill:'Stats',score:88},{skill:'Viz',score:80},{skill:'ML',score:78},{skill:'SQL',score:85}]},
    { icon:'☁️', title:'Cloud Engineer', roleKey:'Cloud Engineer', desc:'Build cloud infrastructure', hot:false, salary:['₹7L','₹16L','₹28L+'], demand:'Very High', growth:'+38%',
      trend:[{yr:'2017',v:20},{yr:'2018',v:28},{yr:'2019',v:38},{yr:'2020',v:50},{yr:'2021',v:62},{yr:'2022',v:74},{yr:'2023',v:85},{yr:'2024',v:95},{yr:'2025',v:108,f:true},{yr:'2026',v:122,f:true},{yr:'2027',v:138,f:true},{yr:'2028',v:155,f:true}],
      skills:[['AWS/Azure/GCP',92],['Linux',85],['Kubernetes',82],['Terraform',78],['Networking',75]],
      jobs:[{title:'Cloud Support Eng.',salary:'₹6–10L',company:'IT Services',color:'#4ade80'},{title:'Cloud Engineer',salary:'₹12–22L',company:'SaaS companies',color:'#22d3ee'},{title:'Cloud Architect',salary:'₹22–40L',company:'Enterprise',color:'#a78bfa'},{title:'Principal Architect',salary:'₹40L+',company:'Big Tech',color:'#f472b6'}],
      radarSkills:[{skill:'AWS/GCP',score:92},{skill:'Linux',score:85},{skill:'K8s',score:82},{skill:'Terraform',score:78},{skill:'Network',score:75}]},
    { icon:'⚙️', title:'DevOps Engineer', roleKey:'DevOps Engineer', desc:'Automate & scale systems', hot:false, salary:['₹7L','₹15L','₹28L+'], demand:'High', growth:'+32%',
      trend:[{yr:'2017',v:22},{yr:'2018',v:30},{yr:'2019',v:40},{yr:'2020',v:52},{yr:'2021',v:63},{yr:'2022',v:73},{yr:'2023',v:84},{yr:'2024',v:95},{yr:'2025',v:106,f:true},{yr:'2026',v:120,f:true},{yr:'2027',v:135,f:true},{yr:'2028',v:150,f:true}],
      skills:[['CI/CD',90],['Docker/K8s',88],['Cloud',85],['Git',92],['Scripting',80]],
      jobs:[{title:'DevOps Jr.',salary:'₹6–10L',company:'IT Firms',color:'#4ade80'},{title:'DevOps Engineer',salary:'₹12–22L',company:'Product Co.',color:'#22d3ee'},{title:'Sr. DevOps / SRE',salary:'₹22–38L',company:'Unicorns',color:'#a78bfa'},{title:'Platform Engineer',salary:'₹38L+',company:'Big Tech',color:'#f472b6'}],
      radarSkills:[{skill:'CI/CD',score:90},{skill:'Docker',score:88},{skill:'Cloud',score:85},{skill:'Git',score:92},{skill:'Scripts',score:80}]},
    { icon:'🔒', title:'Cybersecurity', roleKey:'Cybersecurity Analyst', desc:'Protect systems from attacks', hot:false, salary:['₹6L','₹14L','₹28L+'], demand:'High', growth:'+33%',
      trend:[{yr:'2017',v:25},{yr:'2018',v:32},{yr:'2019',v:40},{yr:'2020',v:50},{yr:'2021',v:60},{yr:'2022',v:72},{yr:'2023',v:84},{yr:'2024',v:95},{yr:'2025',v:108,f:true},{yr:'2026',v:122,f:true},{yr:'2027',v:138,f:true},{yr:'2028',v:155,f:true}],
      skills:[['Networking',88],['Linux',85],['Pen Testing',82],['SIEM',75],['Scripting',78]],
      jobs:[{title:'Jr. Security Analyst',salary:'₹5–9L',company:'IT Services',color:'#4ade80'},{title:'Security Analyst',salary:'₹10–18L',company:'BFSI/Tech',color:'#22d3ee'},{title:'Sr. Security Engineer',salary:'₹18–30L',company:'Enterprise',color:'#a78bfa'},{title:'CISO / Sec Architect',salary:'₹30L+',company:'All sectors',color:'#f472b6'}],
      radarSkills:[{skill:'Network',score:88},{skill:'Linux',score:85},{skill:'PenTest',score:82},{skill:'SIEM',score:75},{skill:'Scripts',score:78}]},
    { icon:'🌐', title:'Full Stack Dev', roleKey:'Full Stack Developer', desc:'Frontend + Backend mastery', hot:false, salary:['₹5L','₹14L','₹25L+'], demand:'High', growth:'+28%',
      trend:[{yr:'2017',v:40},{yr:'2018',v:46},{yr:'2019',v:52},{yr:'2020',v:60},{yr:'2021',v:68},{yr:'2022',v:76},{yr:'2023',v:85},{yr:'2024',v:95},{yr:'2025',v:104,f:true},{yr:'2026',v:115,f:true},{yr:'2027',v:127,f:true},{yr:'2028',v:140,f:true}],
      skills:[['React/Vue',88],['Node.js',85],['SQL/NoSQL',82],['REST APIs',90],['CSS/UI',80]],
      jobs:[{title:'Jr. Developer',salary:'₹4–8L',company:'Startups',color:'#4ade80'},{title:'Full Stack Dev',salary:'₹10–20L',company:'Product Co.',color:'#22d3ee'},{title:'Sr. Full Stack',salary:'₹20–35L',company:'Unicorns',color:'#a78bfa'},{title:'Tech Lead',salary:'₹35L+',company:'All',color:'#f472b6'}],
      radarSkills:[{skill:'React',score:88},{skill:'Node.js',score:85},{skill:'DB',score:82},{skill:'APIs',score:90},{skill:'CSS',score:80}]},
  ]},
  { id:'ece', label:'📡 ECE / Hardware', roles:[
    { icon:'💾', title:'VLSI Engineer', roleKey:'VLSI Design Engineer', desc:'Chip & semiconductor design', hot:true, salary:['₹8L','₹18L','₹35L+'], demand:'Very High', growth:'+45%',
      trend:[{yr:'2017',v:20},{yr:'2018',v:25},{yr:'2019',v:32},{yr:'2020',v:40},{yr:'2021',v:52},{yr:'2022',v:65},{yr:'2023',v:80},{yr:'2024',v:95},{yr:'2025',v:110,f:true},{yr:'2026',v:128,f:true},{yr:'2027',v:148,f:true},{yr:'2028',v:170,f:true}],
      skills:[['Verilog/VHDL',92],['EDA Tools',88],['ASIC Design',85],['Verification',82],['DFT',75]],
      jobs:[{title:'VLSI Jr. Eng.',salary:'₹7–12L',company:'Fab-less chips',color:'#4ade80'},{title:'Design Eng.',salary:'₹12–22L',company:'Semiconductor',color:'#22d3ee'},{title:'Sr. Design Eng.',salary:'₹22–40L',company:'Intel/Qualcomm',color:'#a78bfa'},{title:'Design Architect',salary:'₹40L+',company:'FAANG Chip',color:'#f472b6'}],
      radarSkills:[{skill:'Verilog',score:92},{skill:'EDA',score:88},{skill:'ASIC',score:85},{skill:'Verify',score:82},{skill:'DFT',score:75}]},
    { icon:'📟', title:'Embedded Engineer', roleKey:'Embedded Systems Engineer', desc:'Hardware-software systems', hot:false, salary:['₹5L','₹12L','₹22L+'], demand:'Moderate', growth:'+20%',
      trend:[{yr:'2017',v:35},{yr:'2018',v:38},{yr:'2019',v:42},{yr:'2020',v:46},{yr:'2021',v:52},{yr:'2022',v:60},{yr:'2023',v:70},{yr:'2024',v:80},{yr:'2025',v:88,f:true},{yr:'2026',v:97,f:true},{yr:'2027',v:107,f:true},{yr:'2028',v:118,f:true}],
      skills:[['C/C++',92],['Microcontrollers',88],['RTOS',80],['Protocols',75],['Linux',70]],
      jobs:[{title:'Embedded Jr.',salary:'₹4–8L',company:'Electronics firms',color:'#4ade80'},{title:'Embedded Eng.',salary:'₹8–16L',company:'Automotive/IoT',color:'#22d3ee'},{title:'Sr. Embedded Dev',salary:'₹16–28L',company:'R&D Labs',color:'#a78bfa'},{title:'Principal Eng.',salary:'₹28L+',company:'Chip makers',color:'#f472b6'}],
      radarSkills:[{skill:'C/C++',score:92},{skill:'MCU',score:88},{skill:'RTOS',score:80},{skill:'Protocols',score:75},{skill:'Linux',score:70}]},
    { icon:'🌍', title:'IoT Engineer', roleKey:'IoT Engineer', desc:'Internet of Things devices', hot:true, salary:['₹5L','₹13L','₹24L+'], demand:'High', growth:'+38%',
      trend:[{yr:'2017',v:18},{yr:'2018',v:25},{yr:'2019',v:35},{yr:'2020',v:45},{yr:'2021',v:58},{yr:'2022',v:68},{yr:'2023',v:80},{yr:'2024',v:92},{yr:'2025',v:106,f:true},{yr:'2026',v:122,f:true},{yr:'2027',v:140,f:true},{yr:'2028',v:160,f:true}],
      skills:[['Embedded C',85],['Cloud IoT',80],['Protocols',88],['Sensors',82],['Security',70]],
      jobs:[{title:'IoT Jr. Dev',salary:'₹4–8L',company:'Smart device cos',color:'#4ade80'},{title:'IoT Engineer',salary:'₹10–18L',company:'Industrial IoT',color:'#22d3ee'},{title:'IoT Architect',salary:'₹18–30L',company:'Enterprise',color:'#a78bfa'},{title:'IoT Lead',salary:'₹30L+',company:'Product Co.',color:'#f472b6'}],
      radarSkills:[{skill:'Embedded C',score:85},{skill:'Cloud',score:80},{skill:'Protocols',score:88},{skill:'Sensors',score:82},{skill:'Security',score:70}]},
    { icon:'⚡', title:'FPGA Engineer', roleKey:'FPGA Engineer', desc:'Programmable hardware dev', hot:false, salary:['₹7L','₹15L','₹28L+'], demand:'Moderate', growth:'+22%',
      trend:[{yr:'2017',v:22},{yr:'2018',v:28},{yr:'2019',v:35},{yr:'2020',v:42},{yr:'2021',v:52},{yr:'2022',v:62},{yr:'2023',v:74},{yr:'2024',v:85},{yr:'2025',v:96,f:true},{yr:'2026',v:108,f:true},{yr:'2027',v:122,f:true},{yr:'2028',v:138,f:true}],
      skills:[['Verilog/VHDL',90],['FPGA Arch.',85],['Timing Analysis',80],['HW Debug',78],['Signal Proc.',75]],
      jobs:[{title:'FPGA Jr. Eng.',salary:'₹6–10L',company:'Electronics firms',color:'#4ade80'},{title:'FPGA Engineer',salary:'₹10–18L',company:'Defense/Telecom',color:'#22d3ee'},{title:'Sr. FPGA Eng.',salary:'₹18–30L',company:'R&D',color:'#a78bfa'},{title:'Principal Eng.',salary:'₹30L+',company:'Aerospace',color:'#f472b6'}],
      radarSkills:[{skill:'Verilog',score:90},{skill:'FPGA',score:85},{skill:'Timing',score:80},{skill:'Debug',score:78},{skill:'DSP',score:75}]},
  ]},
  { id:'mech', label:'⚙️ Mechanical', roles:[
    { icon:'🤖', title:'Robotics Engineer', roleKey:'Robotics Engineer', desc:'Build autonomous machines', hot:true, salary:['₹6L','₹15L','₹30L+'], demand:'High', growth:'+40%',
      trend:[{yr:'2017',v:15},{yr:'2018',v:20},{yr:'2019',v:28},{yr:'2020',v:38},{yr:'2021',v:50},{yr:'2022',v:62},{yr:'2023',v:76},{yr:'2024',v:90},{yr:'2025',v:105,f:true},{yr:'2026',v:122,f:true},{yr:'2027',v:142,f:true},{yr:'2028',v:165,f:true}],
      skills:[['ROS/ROS2',88],['Python/C++',85],['Kinematics',80],['Computer Vision',75],['Control',82]],
      jobs:[{title:'Robotics Jr.',salary:'₹5–9L',company:'Startups',color:'#4ade80'},{title:'Robotics Eng.',salary:'₹10–20L',company:'Automation cos',color:'#22d3ee'},{title:'Sr. Robotics Eng.',salary:'₹20–35L',company:'R&D labs',color:'#a78bfa'},{title:'Robotics Architect',salary:'₹35L+',company:'Tier-1 cos',color:'#f472b6'}],
      radarSkills:[{skill:'ROS',score:88},{skill:'Python',score:85},{skill:'Kinemat.',score:80},{skill:'CV',score:75},{skill:'Control',score:82}]},
    { icon:'✈️', title:'Aerospace Engineer', roleKey:'Aerospace Engineer', desc:'Aircraft & spacecraft design', hot:false, salary:['₹6L','₹14L','₹28L+'], demand:'Moderate', growth:'+22%',
      trend:[{yr:'2017',v:30},{yr:'2018',v:33},{yr:'2019',v:36},{yr:'2020',v:40},{yr:'2021',v:46},{yr:'2022',v:54},{yr:'2023',v:65},{yr:'2024',v:75},{yr:'2025',v:83,f:true},{yr:'2026',v:92,f:true},{yr:'2027',v:102,f:true},{yr:'2028',v:114,f:true}],
      skills:[['CAD/CAE',90],['Aerodynamics',85],['FEA',82],['CFD',78],['Materials',75]],
      jobs:[{title:'Jr. Aero Eng.',salary:'₹5–9L',company:'Defence/ISRO',color:'#4ade80'},{title:'Aero Eng.',salary:'₹9–18L',company:'Aerospace OEMs',color:'#22d3ee'},{title:'Sr. Aero Eng.',salary:'₹18–30L',company:'Tier-1 suppliers',color:'#a78bfa'},{title:'Chief Eng.',salary:'₹30L+',company:'ISRO/DRDO/Airbus',color:'#f472b6'}],
      radarSkills:[{skill:'CAD',score:90},{skill:'Aero',score:85},{skill:'FEA',score:82},{skill:'CFD',score:78},{skill:'Mater.',score:75}]},
    { icon:'🚗', title:'Automotive Engineer', roleKey:'Automotive Engineer', desc:'Design & develop vehicles', hot:true, salary:['₹5L','₹13L','₹25L+'], demand:'High', growth:'+30%',
      trend:[{yr:'2017',v:25},{yr:'2018',v:28},{yr:'2019',v:32},{yr:'2020',v:38},{yr:'2021',v:48},{yr:'2022',v:58},{yr:'2023',v:70},{yr:'2024',v:82},{yr:'2025',v:94,f:true},{yr:'2026',v:108,f:true},{yr:'2027',v:124,f:true},{yr:'2028',v:142,f:true}],
      skills:[['CAD',88],['EV Systems',82],['Vehicle Dynamics',80],['MATLAB',75],['ADAS',72]],
      jobs:[{title:'Jr. Auto Eng.',salary:'₹4–8L',company:'Tier-2 suppliers',color:'#4ade80'},{title:'Auto Engineer',salary:'₹9–18L',company:'OEMs (Tata, M&M)',color:'#22d3ee'},{title:'Sr. Engineer',salary:'₹18–28L',company:'Tier-1 / EV cos',color:'#a78bfa'},{title:'Technical Lead',salary:'₹28L+',company:'Global OEMs',color:'#f472b6'}],
      radarSkills:[{skill:'CAD',score:88},{skill:'EV',score:82},{skill:'Dynamics',score:80},{skill:'MATLAB',score:75},{skill:'ADAS',score:72}]},
    { icon:'⚙️', title:'Mechanical Design', roleKey:'Mechanical Design Engineer', desc:'Design machines & systems', hot:false, salary:['₹5L','₹12L','₹22L+'], demand:'Moderate', growth:'+18%',
      trend:[{yr:'2017',v:35},{yr:'2018',v:38},{yr:'2019',v:42},{yr:'2020',v:47},{yr:'2021',v:54},{yr:'2022',v:62},{yr:'2023',v:72},{yr:'2024',v:82},{yr:'2025',v:91,f:true},{yr:'2026',v:100,f:true},{yr:'2027',v:111,f:true},{yr:'2028',v:123,f:true}],
      skills:[['SolidWorks/CATIA',90],['FEA/FEM',85],['GD&T',78],['Material Sci.',75],['3D Modeling',88]],
      jobs:[{title:'Jr. Design Eng.',salary:'₹4–8L',company:'Mfg. firms',color:'#4ade80'},{title:'Design Engineer',salary:'₹8–15L',company:'OEMs',color:'#22d3ee'},{title:'Sr. Design Eng.',salary:'₹15–25L',company:'Tier-1',color:'#a78bfa'},{title:'Chief Design',salary:'₹25L+',company:'Global firms',color:'#f472b6'}],
      radarSkills:[{skill:'CAD',score:90},{skill:'FEA',score:85},{skill:'GD&T',score:78},{skill:'Mater.',score:75},{skill:'3D',score:88}]},
  ]},
  { id:'others', label:'🚀 Business / Design', roles:[
    { icon:'🎨', title:'UI/UX Designer', roleKey:'UI UX Designer', desc:'Design user experiences', hot:false, salary:['₹4L','₹12L','₹25L+'], demand:'High', growth:'+28%',
      trend:[{yr:'2017',v:30},{yr:'2018',v:36},{yr:'2019',v:42},{yr:'2020',v:52},{yr:'2021',v:62},{yr:'2022',v:72},{yr:'2023',v:82},{yr:'2024',v:92},{yr:'2025',v:102,f:true},{yr:'2026',v:114,f:true},{yr:'2027',v:128,f:true},{yr:'2028',v:144,f:true}],
      skills:[['Figma',95],['User Research',85],['Prototyping',88],['Design Systems',80],['CSS/HTML',70]],
      jobs:[{title:'Jr. UX Designer',salary:'₹3–6L',company:'Agencies',color:'#4ade80'},{title:'UX Designer',salary:'₹8–15L',company:'Product cos',color:'#22d3ee'},{title:'Senior UX',salary:'₹15–28L',company:'SaaS/Fintech',color:'#a78bfa'},{title:'Design Lead',salary:'₹28L+',company:'Big Tech',color:'#f472b6'}],
      radarSkills:[{skill:'Figma',score:95},{skill:'Research',score:85},{skill:'Prototype',score:88},{skill:'DS',score:80},{skill:'CSS',score:70}]},
    { icon:'📦', title:'Product Manager', roleKey:'Product Manager', desc:'Lead product development', hot:true, salary:['₹8L','₹20L','₹40L+'], demand:'Very High', growth:'+38%',
      trend:[{yr:'2017',v:25},{yr:'2018',v:30},{yr:'2019',v:38},{yr:'2020',v:48},{yr:'2021',v:60},{yr:'2022',v:72},{yr:'2023',v:84},{yr:'2024',v:96},{yr:'2025',v:110,f:true},{yr:'2026',v:126,f:true},{yr:'2027',v:144,f:true},{yr:'2028',v:165,f:true}],
      skills:[['Strategy',90],['Data Analysis',85],['Roadmapping',88],['Agile/Scrum',85],['Communication',92]],
      jobs:[{title:'Associate PM',salary:'₹7–12L',company:'Startups',color:'#4ade80'},{title:'Product Manager',salary:'₹15–28L',company:'SaaS/Fintech',color:'#22d3ee'},{title:'Sr. PM',salary:'₹28–45L',company:'Unicorns',color:'#a78bfa'},{title:'Director of PM',salary:'₹45L+',company:'Big Tech',color:'#f472b6'}],
      radarSkills:[{skill:'Strategy',score:90},{skill:'Data',score:85},{skill:'Roadmap',score:88},{skill:'Agile',score:85},{skill:'Comms',score:92}]},
    { icon:'📲', title:'Mobile Dev', roleKey:'Mobile App Developer', desc:'iOS & Android applications', hot:false, salary:['₹5L','₹14L','₹26L+'], demand:'High', growth:'+25%',
      trend:[{yr:'2017',v:35},{yr:'2018',v:40},{yr:'2019',v:46},{yr:'2020',v:54},{yr:'2021',v:62},{yr:'2022',v:72},{yr:'2023',v:82},{yr:'2024',v:93},{yr:'2025',v:104,f:true},{yr:'2026',v:116,f:true},{yr:'2027',v:130,f:true},{yr:'2028',v:145,f:true}],
      skills:[['React Native',88],['Kotlin/Swift',85],['APIs',90],['State Mgmt',82],['UI/UX',78]],
      jobs:[{title:'Jr. Mobile Dev',salary:'₹4–8L',company:'Agencies',color:'#4ade80'},{title:'Mobile Engineer',salary:'₹10–18L',company:'Product cos',color:'#22d3ee'},{title:'Sr. Mobile Eng.',salary:'₹18–30L',company:'Unicorns',color:'#a78bfa'},{title:'Mobile Architect',salary:'₹30L+',company:'Big Tech',color:'#f472b6'}],
      radarSkills:[{skill:'RN/Flutter',score:88},{skill:'Native',score:85},{skill:'APIs',score:90},{skill:'State',score:82},{skill:'UI',score:78}]},
    { icon:'📊', title:'Business Analyst', roleKey:'Business Analyst', desc:'Analyze business processes', hot:false, salary:['₹5L','₹12L','₹22L+'], demand:'Moderate', growth:'+20%',
      trend:[{yr:'2017',v:32},{yr:'2018',v:36},{yr:'2019',v:42},{yr:'2020',v:48},{yr:'2021',v:56},{yr:'2022',v:65},{yr:'2023',v:74},{yr:'2024',v:84},{yr:'2025',v:93,f:true},{yr:'2026',v:103,f:true},{yr:'2027',v:115,f:true},{yr:'2028',v:128,f:true}],
      skills:[['Excel/SQL',88],['Tableau/BI',85],['Req. Gathering',82],['Documentation',80],['Agile',75]],
      jobs:[{title:'Jr. BA',salary:'₹4–8L',company:'IT Services',color:'#4ade80'},{title:'Business Analyst',salary:'₹8–15L',company:'BFSI/Tech',color:'#22d3ee'},{title:'Sr. BA',salary:'₹15–25L',company:'Consulting',color:'#a78bfa'},{title:'Business Architect',salary:'₹25L+',company:'MNCs',color:'#f472b6'}],
      radarSkills:[{skill:'Excel',score:88},{skill:'BI',score:85},{skill:'Req.',score:82},{skill:'Docs',score:80},{skill:'Agile',score:75}]},
  ]},
];

// ─────────────────────────────────────────────────────────────
//  PARTICLES CANVAS
// ─────────────────────────────────────────────────────────────
function ParticlesBG() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, raf;
    const COLORS = ['#6366f1','#8b5cf6','#ec4899','#06b6d4'];
    const particles = [];
    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);
    for (let i = 0; i < 75; i++) {
      particles.push({ x: Math.random()*W, y: Math.random()*H, vx:(Math.random()-0.5)*0.4, vy:(Math.random()-0.5)*0.4, r: Math.random()*1.5+0.4, color: COLORS[Math.floor(Math.random()*4)], opacity: Math.random()*0.35+0.05 });
    }
    function draw() {
      ctx.clearRect(0,0,W,H);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if(p.x<0||p.x>W) p.vx*=-1;
        if(p.y<0||p.y>H) p.vy*=-1;
        ctx.save(); ctx.globalAlpha=p.opacity; ctx.fillStyle=p.color;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill(); ctx.restore();
        for (let j = i+1; j < particles.length; j++) {
          const q = particles[j];
          const d = Math.hypot(p.x-q.x,p.y-q.y);
          if(d<120){ ctx.save(); ctx.globalAlpha=(1-d/120)*0.07; ctx.strokeStyle='#6366f1'; ctx.lineWidth=0.5; ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y); ctx.stroke(); ctx.restore(); }
        }
      }
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} style={{position:'fixed',top:0,left:0,zIndex:0,pointerEvents:'none'}} />;
}

// ─────────────────────────────────────────────────────────────
//  NAVBAR
// ─────────────────────────────────────────────────────────────
function Navbar({ page, navigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);
  const links = [
    { id:'home', label:'Home' }, { id:'dashboard', label:'Dashboard' },
    { id:'chatbot', label:'Chatbot' }, { id:'career', label:'Career' },
    { id:'resume', label:'Resume' },
  ];
  const go = (id) => { navigate(id); setOpen(false); };
  return (
    <header className={`navbar${scrolled?' scrolled':''}`}>
      <button className="brand" onClick={() => go('home')}>🎓 SmartEduCare</button>
      <button className={`hamburger${open?' open':''}`} onClick={() => setOpen(!open)} aria-label="menu">
        <span/><span/><span/>
      </button>
      <nav className={`nav-links${open?' open':''}`}>
        {links.map(l => (
          <a key={l.id} className={page===l.id?'active':''} onClick={() => go(l.id)}>{l.label}</a>
        ))}
        <a className="nav-cta" onClick={() => go('career-path')}>Get Started</a>
      </nav>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────
//  HOME PAGE
// ─────────────────────────────────────────────────────────────
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

function StatItem({ num, label, delay }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const count = useCounter(num, visible);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if(e.isIntersecting) setVisible(true); }, { threshold:0.5 });
    if(ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div className="stat-item" ref={ref} style={{animationDelay:`${delay}s`}}>
      <span className="stat-num">{count}+</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

function HomePage({ navigate }) {
  const features = [
    { icon:'🤖', title:'AI Chatbot', desc:'Get instant 24/7 answers to academic and career questions from our intelligent assistant.', page:'chatbot', link:'Start chatting' },
    { icon:'🚀', title:'Career Path Finder', desc:'Explore tailored roadmaps across CSE, ECE, Mechanical, Civil, and MBA with step-by-step guidance.', page:'career-path', link:'Find your path' },
    { icon:'📄', title:'Resume Builder', desc:'Create ATS-optimized resumes in minutes. Fill details and download a professionally formatted PDF.', page:'resume', link:'Build resume' },
    { icon:'🎯', title:'Resume Job Matching', desc:'Upload your resume and a job description to get a match score, skill gap analysis and suggestions.', page:'career', link:'Analyze match' },
    { icon:'📊', title:'Skill Radar Chart', desc:'Visualize your skills against job requirements with an interactive radar chart powered by recharts.', page:'career', link:'See chart' },
    { icon:'🧭', title:'Dashboard Hub', desc:'Access all tools from one centralized dashboard. Track progress and jump right back in.', page:'dashboard', link:'Open dashboard' },
  ];
  return (
    <div className="page-wrap page-enter">
      <ParticlesBG />
      <section className="hero">
        <div className="hero-badge"><span className="badge-dot" />AI-Powered Education Platform</div>
        <span className="hero-icon">🤖</span>
        <h1>Shape Your <span className="grad-text">Future</span><br/>With AI Guidance</h1>
        <p className="hero-sub">SmartEduCare combines intelligent career counseling, resume building, and skill gap analysis to launch your professional journey.</p>
        <div className="hero-btns">
          <button className="btn btn-primary" onClick={() => navigate('career-path')}>Explore Career Paths →</button>
          <button className="btn btn-ghost" onClick={() => navigate('dashboard')}>View Dashboard</button>
        </div>
        <div className="scroll-hint"><span className="scroll-arrow">↓</span><span>Discover features</span></div>
      </section>
      <div className="stats-row" style={{position:'relative',zIndex:1}}>
        <StatItem num={50} label="Career Paths" delay={0} />
        <StatItem num={200} label="Resume Templates" delay={0.1} />
        <StatItem num={10} label="Engineering Fields" delay={0.2} />
        <StatItem num={100} label="Happy Students" delay={0.3} />
      </div>
      <section className="features-section">
        <div style={{textAlign:'center',marginBottom:'0.75rem'}}><span className="s-label">What We Offer</span></div>
        <div style={{textAlign:'center',marginBottom:'0.75rem'}}><h2 className="s-title">Everything You Need to <span className="grad-text">Succeed</span></h2></div>
        <div style={{textAlign:'center',marginBottom:'3.5rem'}}><p className="s-sub" style={{margin:'0 auto'}}>Comprehensive tools designed for engineering students to navigate their career journey.</p></div>
        <div className="feat-grid">
          {features.map((f,i) => (
            <div className="feat-card" key={i}>
              <div className="feat-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <button className="feat-link" onClick={() => navigate(f.page)}>{f.link} →</button>
            </div>
          ))}
        </div>
      </section>
      <section className="how-section">
        <div style={{textAlign:'center',marginBottom:'0.75rem'}}><span className="s-label">Simple Process</span></div>
        <div style={{textAlign:'center',marginBottom:'0.75rem'}}><h2 className="s-title">How It <span className="grad-text">Works</span></h2></div>
        <div style={{textAlign:'center'}}><p className="s-sub" style={{margin:'0 auto'}}>Get from confused to career-ready in four easy steps.</p></div>
        <div className="steps-grid">
          {[['1','Choose Field','Pick your engineering discipline or MBA interest area.'],['2','Explore Roles','Browse specific job roles within your chosen field.'],['3','Get Roadmap','Receive a 10-step actionable learning roadmap.'],['4','Build Resume','Create and download your ATS-friendly resume.']].map(([n,t,d]) => (
            <div className="step-item" key={n}>
              <div className="step-num">{n}</div>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </section>
      <div style={{padding:'0 2rem 6rem',position:'relative',zIndex:1}}>
        <div className="cta-section" style={{margin:'0 auto',maxWidth:'800px'}}>
          <h2>Ready to Start Your Journey?</h2>
          <p>Join thousands of students who've discovered their ideal career path with SmartEduCare.</p>
          <button className="btn btn-primary" onClick={() => navigate('career-path')}>Discover Your Career Path →</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  DASHBOARD
// ─────────────────────────────────────────────────────────────
function DashboardPage({ navigate }) {
  const cards = [
    { badge:'AI Powered', badgeCls:'badge-purple', glow:'#6366f1', icon:'🤖', title:'AI Chatbot', desc:'Get instant answers to academic and career questions.', features:['24/7 AI availability','Study & career tips','Quick query shortcuts'], page:'chatbot', btnTxt:'Open Chatbot →' },
    { badge:'Smart Match', badgeCls:'badge-pink', glow:'#ec4899', icon:'🚀', title:'Career Advisor', desc:'Upload resume & job description to see how well you match.', features:['Skill gap analysis','Match score radar','Role suggestions'], page:'career', btnTxt:'Start Analysis →' },
    { badge:'ATS Ready', badgeCls:'badge-cyan', glow:'#06b6d4', icon:'📄', title:'Resume Builder', desc:'Create a professional ATS-friendly resume and download as PDF.', features:['Instant preview','PDF download','Skills tagging'], page:'resume', btnTxt:'Build Resume →' },
  ];
  return (
    <div className="page-wrap page-enter">
      <div className="main-wrap">
        <div className="page-head">
          <p className="page-welcome">Good to see you 👋</p>
          <h1>Student Dashboard</h1>
        </div>
        <div className="qs-grid">
          {[['🛠️','3','Tools Available'],['🗺️','50+','Career Paths'],['📈','AI','Powered Analysis'],['⚡','Free','All Features']].map(([icon,num,label],i) => (
            <div className="qs-card" key={i} style={{animationDelay:`${i*0.08}s`}}>
              <span className="qs-icon">{icon}</span>
              <span className="qs-num">{num}</span>
              <span className="qs-label">{label}</span>
            </div>
          ))}
        </div>
        <div className="section-divider"><span>— Your Tools —</span></div>
        <div className="dash-grid">
          {cards.map((c,i) => (
            <div className="dash-card" key={i} style={{animationDelay:`${0.15+i*0.15}s`}}>
              <div className="card-glow" style={{background:c.glow}} />
              <span className={`card-badge ${c.badgeCls}`}>{c.badge}</span>
              <div className="dash-card-icon">{c.icon}</div>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
              <ul className="card-features">
                {c.features.map((f,j) => <li key={j}>{f}</li>)}
              </ul>
              <button className="btn btn-primary" style={{width:'100%'}} onClick={() => navigate(c.page)}>{c.btnTxt}</button>
            </div>
          ))}
        </div>
        <div className="section-divider" style={{marginTop:'2.5rem'}}><span>— Explore —</span></div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:'1rem',marginTop:'1.25rem'}}>
          <button className="btn btn-ghost" onClick={() => navigate('career-path')}>🗺️ Career Path Finder</button>
          <button className="btn btn-ghost" onClick={() => navigate('chatbot')}>💬 Ask AI Assistant</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  CHATBOT
// ─────────────────────────────────────────────────────────────
function ChatbotPage() {
  const [messages, setMessages] = useState([{ sender:'bot', text:"Hello! I'm your AI Student Assistant. I can help with career advice, study tips, and academic guidance. What would you like to know? 🎓" }]);
  const [input, setInput] = useState('');
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
    setMessages(prev => [...prev, { sender:'user', text:message }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { sender:'bot', text:getResponse(message) }]);
    }, 900 + Math.random()*500);
  }, [input]);

  useEffect(() => {
    if (chatboxRef.current) chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
  }, [messages, typing]);

  const quickQueries = [{ label:'💡 What is AI?', q:'What is AI?' }, { label:'📚 Improve grades', q:'How to improve grades?' }, { label:'🚀 Career advice', q:'Career advice' }, { label:'✏️ Study tips', q:'Study tips' }, { label:'📄 Resume tips', q:'How to write a resume?' }];

  return (
    <div className="page-wrap page-enter" style={{height:'100vh'}}>
      <div className="chat-wrap">
        <div className="chat-header">
          <div className="ai-avatar">🤖</div>
          <h2>AI Student Assistant</h2>
          <span className="online-status"><span className="status-dot" /> Online &amp; Ready</span>
        </div>
        <div className="quick-queries">
          {quickQueries.map(q => <button key={q.q} className="qq-btn" onClick={() => sendMessage(q.q)}>{q.label}</button>)}
        </div>
        <div id="chatbox" ref={chatboxRef}>
          {messages.map((m,i) => (
            <div key={i} className={`msg ${m.sender}`}>
              <span className="msg-label">{m.sender==='user'?'You':'AI Assistant'}</span>
              <div className="msg-bubble" dangerouslySetInnerHTML={{__html: m.text.replace(/\n/g,'<br/>')}} />
            </div>
          ))}
          {typing && (
            <div className="msg bot">
              <span className="msg-label">AI Assistant</span>
              <div className="typing-dots"><span/><span/><span/></div>
            </div>
          )}
        </div>
        <div className="input-row">
          <input className="chat-input" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendMessage()} placeholder="Ask me anything..." />
          <button className="send-btn" onClick={() => sendMessage()}>Send ➤</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  CAREER PAGE (Resume Job Matching)
// ─────────────────────────────────────────────────────────────
const DEMO_SKILLS = { resume_skills:['Python','Machine Learning','SQL','Pandas','NumPy'], job_skills:['Python','Machine Learning','SQL','Deep Learning','TensorFlow','PyTorch'] };
const DEMO_SUGGESTIONS = { skill_gap_analysis:['Missing Deep Learning knowledge','No TensorFlow/PyTorch experience','Limited model deployment skills'], recommended_learning:['Take Deep Learning Specialization on Coursera','Learn TensorFlow or PyTorch through official docs','Practice model deployment with Flask or FastAPI'], suggested_projects:['Build an image classifier with CNN','Create a sentiment analysis pipeline','Deploy an ML model to cloud'], career_roles:['Junior ML Engineer','Data Analyst with ML focus','Research Assistant'], career_growth_tips:['Contribute to open-source ML projects','Participate in Kaggle competitions','Build a strong GitHub portfolio'] };

function CareerPage() {
  const [step, setStep] = useState(1);
  const [resumeFile, setResumeFile] = useState(null);
  const [jobFile, setJobFile] = useState(null);
  const [results, setResults] = useState(null);

  const progPct = { 1:'16%', 2:'50%', loading:'65%', 3:'100%' };
  const stepDots = [{ n:1, label:'Resume' }, { n:2, label:'Job Desc' }, { n:3, label:'Results' }];
  const curStep = step==='loading'?2:step;

  const analyze = async () => {
    if (!jobFile) { alert('Please upload a job description.'); return; }
    setStep('loading');
    try {
      const ctrl = new AbortController();
      const tid = setTimeout(() => ctrl.abort(), 8000);
      const fd = new FormData();
      fd.append('resume', resumeFile); fd.append('job', jobFile);
      const resp = await fetch('http://127.0.0.1:5000/analyze', { method:'POST', body:fd, signal:ctrl.signal });
      clearTimeout(tid);
      if (!resp.ok) throw new Error('HTTP '+resp.status);
      const data = await resp.json();
      if (!data.success) throw new Error(data.error);
      setResults({ score: data.score+'%', radarData: buildRadar(data.resume_skills, data.job_skills), suggestions: data.suggestions });
      setStep(3);
    } catch(e) {
      setResults({ score:'72%', radarData: buildRadar(DEMO_SKILLS.resume_skills, DEMO_SKILLS.job_skills), suggestions: DEMO_SUGGESTIONS, demo:true });
      setStep(3);
    }
  };

  const buildRadar = (rs, js) => {
    const all = [...new Set([...rs, ...js])];
    return all.map(skill => ({ skill, Resume: rs.includes(skill)?1:0, Job: js.includes(skill)?1:0 }));
  };

  return (
    <div className="page-wrap page-enter">
      <div className="career-wrap">
        <h1 className="page-title">🎯 Resume Job Matching</h1>
        <div className="stepper">
          {stepDots.map((d) => (
            <div key={d.n} className={`step-dot${curStep===d.n?' active':''}${curStep>d.n?' done':''}`}>
              <div className="step-circle">{curStep>d.n?'✓':d.n}</div>
              <span className="step-dot-label">{d.label}</span>
            </div>
          ))}
        </div>
        <div className="prog-bar"><div className="prog-fill" style={{width:progPct[step]||'16%'}} /></div>
        {step===1 && (
          <div className="step-card">
            <h2>📄 Upload Your Resume</h2>
            <p className="step-desc">Upload your resume in PDF, DOC, or DOCX format.</p>
            <label className={`upload-zone${resumeFile?' has-file':''}`}>
              <input type="file" accept=".pdf,.doc,.docx" style={{display:'none'}} onChange={e=>setResumeFile(e.target.files[0])} />
              <span className="upload-icon">📁</span>
              <p>Drop resume here or <strong>click to browse</strong></p>
              {resumeFile && <div className="file-name">✅ {resumeFile.name}</div>}
            </label>
            <button className="btn btn-primary" style={{width:'100%'}} onClick={() => { if(!resumeFile){alert('Please upload your resume.');return;} setStep(2); }}>Continue →</button>
          </div>
        )}
        {step===2 && (
          <div className="step-card">
            <h2>💼 Upload Job Description</h2>
            <p className="step-desc">Upload the job description to compare against your resume.</p>
            <label className={`upload-zone${jobFile?' has-file':''}`}>
              <input type="file" accept=".pdf,.doc,.docx" style={{display:'none'}} onChange={e=>setJobFile(e.target.files[0])} />
              <span className="upload-icon">📋</span>
              <p>Drop job description here or <strong>click to browse</strong></p>
              {jobFile && <div className="file-name">✅ {jobFile.name}</div>}
            </label>
            <div style={{display:'flex',gap:'1rem',flexWrap:'wrap'}}>
              <button className="btn btn-ghost btn-sm" style={{flex:'0 0 auto'}} onClick={() => setStep(1)}>← Back</button>
              <button className="btn btn-primary" style={{flex:1}} onClick={analyze}>Analyze Match →</button>
            </div>
          </div>
        )}
        {step==='loading' && (
          <div className="step-card" style={{textAlign:'center',padding:'4rem 2rem'}}>
            <div className="spinner" />
            <p style={{color:'var(--muted)'}}>Analyzing your resume against the job description...</p>
          </div>
        )}
        {step===3 && results && (
          <div className="step-card">
            <h2>📊 Match Results</h2>
            {results.demo && <p style={{color:'var(--cyan)',fontSize:'0.82rem',marginBottom:'1.5rem'}}>⚡ Demo mode — backend not connected. Showing sample data.</p>}
            <div style={{textAlign:'center',padding:'1.5rem 0'}}>
              <div className="score-ring">{results.score}</div>
              <strong style={{fontFamily:'Syne,sans-serif',fontSize:'1rem'}}>Match Score</strong>
            </div>
            <div className="chart-box">
              <h3>Skill Comparison Radar</h3>
              <SvgRadarChart data={results.radarData.map(d => ({ skill: d.skill, score: ((d.Resume + d.Job) / 2) * 100 }))} />
              <div style={{display:'flex',gap:'1.5rem',justifyContent:'center',marginTop:'0.75rem',fontSize:'0.78rem',color:'var(--muted)'}}>
                <span style={{display:'flex',alignItems:'center',gap:5}}>
                  <span style={{width:10,height:10,borderRadius:'50%',background:'#6366f1',display:'inline-block'}}/>Resume
                </span>
                <span style={{display:'flex',alignItems:'center',gap:5}}>
                  <span style={{width:10,height:10,borderRadius:'50%',background:'#ec4899',display:'inline-block'}}/>Job
                </span>
              </div>
            </div>
            {Object.entries({ '🎯 Skill Gap Analysis':'skill_gap_analysis', '📚 Recommended Learning':'recommended_learning', '🚀 Suggested Projects':'suggested_projects', '💼 Career Role Suggestions':'career_roles', '📈 Career Growth Tips':'career_growth_tips' }).map(([label, key]) => (
              results.suggestions[key]?.length > 0 && (
                <div key={key} className="suggestion-card">
                  <h3>{label}</h3>
                  <ul>{results.suggestions[key].map((item,i) => <li key={i}>{item}</li>)}</ul>
                </div>
              )
            ))}
            <button className="btn btn-ghost" style={{width:'100%',marginTop:'1rem'}} onClick={() => { setStep(1); setResumeFile(null); setJobFile(null); setResults(null); }}>Start Over ↺</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  SKILL BAR (animated on mount)
// ─────────────────────────────────────────────────────────────
function SkillBar({ name, pct, color, delay }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), delay);
    return () => clearTimeout(t);
  }, [pct, delay]);
  return (
    <div className="cp-skill-row">
      <div className="cp-skill-name">{name}</div>
      <div className="cp-skill-track">
        <div className="cp-skill-fill" style={{ width: `${width}%`, background: color }} />
      </div>
      <div className="cp-skill-pct" style={{ color }}>{pct}%</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  CAREER PATH — DETAIL PANEL CONTENT
// ─────────────────────────────────────────────────────────────
const SKILL_COLORS = ['#6366f1','#8b5cf6','#06b6d4','#10b981','#f59e0b'];
const JOB_ICONS = ['🌱','💼','🚀','👑'];

// ─────────────────────────────────────────────────────────────
//  PURE SVG TREND CHART  — zero recharts dependency
//  Replaces the recharts LineChart which crashes in Vite when
//  ResponsiveContainer can't measure a parent height at mount.
// ─────────────────────────────────────────────────────────────
function SvgTrendChart({ data }) {
  const [tooltip, setTooltip] = useState(null);
  const W = 580, H = 200, PL = 38, PR = 18, PT = 14, PB = 32;
  const cW = W - PL - PR, cH = H - PT - PB;

  const vals = data.map(d => d.v);
  const minV = Math.min(...vals), maxV = Math.max(...vals);
  const range = maxV - minV || 1;

  const px = (i) => PL + (i / (data.length - 1)) * cW;
  const py = (v) => PT + cH - ((v - minV) / range) * cH;

  const pastIdx  = data.reduce((last, d, i) => (!d.f ? i : last), 0);
  const histData = data.slice(0, pastIdx + 1);
  const foreData = data.slice(pastIdx);           // includes bridge point

  const toPath = (pts) =>
    pts.map((d, i) => `${i === 0 ? 'M' : 'L'}${px(data.indexOf(d))},${py(d.v)}`).join(' ');

  const histPath = toPath(histData);
  const forePath = toPath(foreData);

  // Y-axis ticks
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(t => ({
    v: Math.round(minV + t * range),
    y: PT + cH - t * cH,
  }));

  // Find "Now" x position (year 2024)
  const nowIdx = data.findIndex(d => String(d.yr) === '2024');
  const nowX   = nowIdx >= 0 ? px(nowIdx) : null;

  return (
    <div style={{position:'relative', width:'100%', overflowX:'auto'}}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{display:'block', maxWidth:W, margin:'0 auto'}}
        onMouseLeave={() => setTooltip(null)}
      >
        {/* Grid lines */}
        {yTicks.map(t => (
          <line key={t.v} x1={PL} x2={W - PR} y1={t.y} y2={t.y}
            stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        ))}

        {/* "Now" reference line */}
        {nowX !== null && (
          <>
            <line x1={nowX} x2={nowX} y1={PT} y2={PT + cH}
              stroke="rgba(99,102,241,0.35)" strokeWidth="1" strokeDasharray="4 3" />
            <text x={nowX + 4} y={PT + 10} fill="#6366f1" fontSize="9">Now</text>
          </>
        )}

        {/* Historical line */}
        <path d={histPath} fill="none" stroke="#6366f1" strokeWidth="2.5"
          strokeLinejoin="round" strokeLinecap="round" />

        {/* Forecast line (dashed) */}
        <path d={forePath} fill="none" stroke="#06b6d4" strokeWidth="2"
          strokeDasharray="6 4" strokeLinejoin="round" strokeLinecap="round" />

        {/* Dots + invisible hit targets */}
        {data.map((d, i) => (
          <g key={i}>
            <circle cx={px(i)} cy={py(d.v)} r={3.5}
              fill={d.f ? '#06b6d4' : '#6366f1'}
              stroke={d.f ? '#06b6d4' : '#6366f1'}
              strokeWidth="1.5" />
            {/* Large transparent hit area */}
            <circle cx={px(i)} cy={py(d.v)} r={12} fill="transparent"
              style={{cursor:'pointer'}}
              onMouseEnter={(e) => setTooltip({ idx:i, x:px(i), y:py(d.v), yr:d.yr, v:d.v, f:!!d.f })}
            />
          </g>
        ))}

        {/* Tooltip */}
        {tooltip && (() => {
          const tx = Math.min(tooltip.x + 8, W - 80);
          const ty = Math.max(tooltip.y - 36, PT);
          return (
            <g>
              <rect x={tx} y={ty} width={74} height={28} rx={6}
                fill="rgba(10,14,26,0.95)" stroke="rgba(99,102,241,0.35)" strokeWidth="1" />
              <text x={tx + 8} y={ty + 11} fill="#a5b4fc" fontSize="9.5" fontWeight="600">
                {tooltip.yr}{tooltip.f ? ' (est.)' : ''}
              </text>
              <text x={tx + 8} y={ty + 22} fill="#f0f4ff" fontSize="10.5" fontWeight="700">
                Index: {tooltip.v}
              </text>
            </g>
          );
        })()}

        {/* X-axis labels — show every other to avoid crowding */}
        {data.map((d, i) => i % 2 === 0 && (
          <text key={i} x={px(i)} y={H - 4} textAnchor="middle"
            fill="#64748b" fontSize="9.5">{d.yr}</text>
        ))}

        {/* Y-axis labels */}
        {yTicks.map(t => (
          <text key={t.v} x={PL - 5} y={t.y + 4} textAnchor="end"
            fill="#64748b" fontSize="9">{t.v}</text>
        ))}
      </svg>
    </div>
  );
}

function TrendTab({ role }) {
  if (!role?.trend?.length) {
    return <p style={{color:'var(--muted)',fontSize:'0.9rem',padding:'1rem 0'}}>No trend data available.</p>;
  }
  return (
    <div>
      {/* Salary cards */}
      <div className="cp-sal-grid">
        <div className="cp-sal-card">
          <div className="cp-sal-label">Entry Level</div>
          <div className="cp-sal-val" style={{color:'#34d399'}}>{role.salary[0]}</div>
        </div>
        <div className="cp-sal-card">
          <div className="cp-sal-label">Mid Level</div>
          <div className="cp-sal-val" style={{color:'#22d3ee'}}>{role.salary[1]}</div>
        </div>
        <div className="cp-sal-card">
          <div className="cp-sal-label">Senior Level</div>
          <div className="cp-sal-val" style={{color:'#a78bfa'}}>{role.salary[2]}</div>
        </div>
      </div>

      <div className="cp-sec-hdr">
        <div className="cp-sec-line" />
        <div className="cp-sec-txt">Job Demand — Past & AI Forecast</div>
      </div>
      <p style={{color:'var(--muted)',fontSize:'0.8rem',marginBottom:'1rem'}}>
        Historical demand index (2017–2024) + forecasted growth through 2028
      </p>

      <div style={{background:'rgba(99,102,241,0.04)',border:'1px solid rgba(99,102,241,0.1)',borderRadius:14,padding:'1rem 0.5rem 0.5rem'}}>
        <SvgTrendChart data={role.trend} />
      </div>

      <div style={{display:'flex',gap:'1.5rem',marginTop:'0.75rem',fontSize:'0.76rem',color:'var(--muted)'}}>
        <span style={{display:'flex',alignItems:'center',gap:6}}>
          <span style={{width:16,height:3,background:'#6366f1',borderRadius:2,display:'inline-block'}}/>Historical
        </span>
        <span style={{display:'flex',alignItems:'center',gap:6}}>
          <span style={{width:16,height:3,borderTop:'2px dashed #06b6d4',display:'inline-block'}}/>AI Forecast
        </span>
      </div>
    </div>
  );
}

function JobsTab({ role }) {
  return (
    <div>
      <div className="cp-sec-hdr"><div className="cp-sec-line" /><div className="cp-sec-txt">Career Progression Path</div></div>
      <p style={{color:'var(--muted)',fontSize:'0.8rem',marginBottom:'1.5rem'}}>Step-by-step job ladder from fresher to senior</p>
      <div className="cp-job-flow">
        {role.jobs.map((j, i) => (
          <div key={i} className="cp-job-step">
            <div className="cp-job-left">
              <div className="cp-job-circle"
                style={{background:`${j.color}22`,border:`2px solid ${j.color}`}}>
                {JOB_ICONS[i]}
              </div>
              {i < role.jobs.length - 1 && (
                <div className="cp-job-connector"
                  style={{background:`linear-gradient(${j.color},${role.jobs[i+1].color})`}} />
              )}
            </div>
            <div className="cp-job-card" style={{'--hc': j.color}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'0.5rem'}}>
                <div>
                  <div className="cp-job-role-name" style={{color:j.color}}>{j.title}</div>
                  <div className="cp-job-company">{j.company}</div>
                </div>
                <div className="cp-job-salary"
                  style={{background:`${j.color}18`,border:`1px solid ${j.color}44`,color:j.color}}>
                  {j.salary}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  PURE SVG RADAR CHART  — no recharts / no ResizeObserver crash
// ─────────────────────────────────────────────────────────────
function SvgRadarChart({ data }) {
  const [hovered, setHovered] = useState(null);
  const SIZE = 260, CX = 130, CY = 130, R = 95;
  const levels = 5;
  const n = data.length;

  // angle for each axis (start from top, go clockwise)
  const angle = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const point = (i, r) => ({
    x: CX + r * Math.cos(angle(i)),
    y: CY + r * Math.sin(angle(i)),
  });

  // grid rings
  const rings = Array.from({ length: levels }, (_, k) => {
    const r = (R * (k + 1)) / levels;
    const pts = Array.from({ length: n }, (_, i) => point(i, r));
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z';
  });

  // data polygon
  const dataPts = data.map((d, i) => point(i, (d.score / 100) * R));
  const dataPath = dataPts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z';

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width="100%" style={{display:'block',maxWidth:SIZE,margin:'0 auto'}}>
      <defs>
        <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.08" />
        </radialGradient>
      </defs>

      {/* Grid rings */}
      {rings.map((d, k) => (
        <path key={k} d={d} fill="none"
          stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      ))}

      {/* Axis lines */}
      {data.map((_, i) => {
        const outer = point(i, R);
        return <line key={i} x1={CX} y1={CY} x2={outer.x} y2={outer.y}
          stroke="rgba(255,255,255,0.07)" strokeWidth="1" />;
      })}

      {/* Data polygon fill */}
      <path d={dataPath} fill="url(#radarFill)" stroke="#6366f1" strokeWidth="2" strokeLinejoin="round" />

      {/* Data dots */}
      {dataPts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={hovered === i ? 6 : 4}
          fill="#6366f1" stroke="#0d1220" strokeWidth="2"
          style={{cursor:'pointer',transition:'r 0.15s'}}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
        />
      ))}

      {/* Tooltip bubble */}
      {hovered !== null && (() => {
        const p = dataPts[hovered];
        const d = data[hovered];
        // keep bubble inside svg
        const bx = Math.min(Math.max(p.x - 36, 4), SIZE - 76);
        const by = Math.max(p.y - 44, 4);
        return (
          <g>
            <rect x={bx} y={by} width={72} height={30} rx={7}
              fill="rgba(10,14,26,0.97)" stroke="rgba(99,102,241,0.4)" strokeWidth="1" />
            <text x={bx+8} y={by+12} fill="#a5b4fc" fontSize="9" fontWeight="600">{d.skill}</text>
            <text x={bx+8} y={by+24} fill="#f0f4ff" fontSize="11" fontWeight="700">{d.score}%</text>
          </g>
        );
      })()}

      {/* Axis labels */}
      {data.map((d, i) => {
        const pad = 14;
        const p = point(i, R + pad);
        const anchor = Math.abs(Math.cos(angle(i))) < 0.1 ? 'middle'
          : Math.cos(angle(i)) > 0 ? 'start' : 'end';
        return (
          <text key={i} x={p.x} y={p.y + 4} textAnchor={anchor}
            fill="#94a3b8" fontSize="10.5" fontWeight="500">{d.skill}</text>
        );
      })}
    </svg>
  );
}

function SkillsTab({ role }) {
  if (!role?.skills?.length) return null;
  return (
    <div>
      <div className="cp-sec-hdr">
        <div className="cp-sec-line" />
        <div className="cp-sec-txt">Core Skills Required</div>
      </div>
      <p style={{color:'var(--muted)',fontSize:'0.8rem',marginBottom:'1.5rem'}}>
        Industry importance score for {role.title} roles
      </p>

      {/* Skill bars */}
      {role.skills.map(([name, pct], i) => (
        <SkillBar key={name} name={name} pct={pct} color={SKILL_COLORS[i % 5]} delay={i * 100} />
      ))}

      {/* Pure SVG Radar */}
      <div style={{marginTop:'1.8rem'}}>
        <div className="cp-sec-hdr">
          <div className="cp-sec-line" />
          <div className="cp-sec-txt">Skill Radar</div>
        </div>
        <div style={{background:'rgba(99,102,241,0.04)',border:'1px solid rgba(99,102,241,0.1)',borderRadius:14,padding:'1rem 0.5rem',marginTop:'0.75rem'}}>
          <SvgRadarChart data={role.radarSkills} />
        </div>
      </div>
    </div>
  );
}

function RoadmapTab({ role, navigate }) {
  const steps = CAREER_ROADMAPS[role.roleKey] || [];
  return (
    <div>
      <div className="cp-sec-hdr"><div className="cp-sec-line" /><div className="cp-sec-txt">10-Step Learning Roadmap</div></div>
      <p style={{color:'var(--muted)',fontSize:'0.8rem',marginBottom:'1.5rem'}}>Structured path from beginner to job-ready {role.title}</p>
      <div className="cp-rm-grid">
        {steps.map((step, i) => (
          <div key={i} className="cp-rm-step" style={{animationDelay:`${i*0.05}s`}}>
            <div className="cp-rm-num">{i+1}</div>
            <div className="cp-rm-text">{step}</div>
          </div>
        ))}
      </div>
      <div className="cp-cta-row">
        <button className="btn btn-primary" onClick={() => navigate('resume')}>📄 Build Your Resume →</button>
        <button className="btn btn-ghost" onClick={() => navigate('career')}>🎯 Match to Job →</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  CAREER PATH PAGE
// ─────────────────────────────────────────────────────────────
function CareerPathPage({ navigate }) {
  const [activeField, setActiveField] = useState('cse');
  const [selectedRole, setSelectedRole] = useState(null);
  const [activeTab, setActiveTab] = useState('trend');
  const [search, setSearch] = useState('');
  const detailRef = useRef(null);

  const allRoles = CP_FIELDS.flatMap(f => f.roles.map(r => ({ ...r, fieldId: f.id })));

  const displayedRoles = search
    ? allRoles.filter(r => r.title.toLowerCase().includes(search.toLowerCase()) || r.desc.toLowerCase().includes(search.toLowerCase()))
    : (CP_FIELDS.find(f => f.id === activeField)?.roles || []);

  const handleRoleClick = (role) => {
    setSelectedRole(prev => prev?.title === role.title ? null : role);
    setActiveTab('trend');
    setTimeout(() => {
      if (detailRef.current) detailRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  };

  const handleFieldClick = (id) => {
    setActiveField(id);
    setSelectedRole(null);
    setSearch('');
  };

  const TABS = [
    { id:'trend',   label:'📈 Trends' },
    { id:'jobs',    label:'💼 Job Levels' },
    { id:'skills',  label:'🛠 Skills' },
    { id:'roadmap', label:'🗺 Roadmap' },
  ];

  return (
    <div className="page-wrap page-enter">
      <div className="cp-wrap">

        {/* HERO */}
        <div className="cp-hero">
          <div className="cp-eyebrow"><span className="cp-pulse" />AI Career Intelligence</div>
          <h1>Discover Your <span className="grad-text">Career Path</span></h1>
          <p>Explore trends, salaries, growth forecasts & personalised roadmaps for every engineering career.</p>
          <div className="cp-search-wrap">
            <input
              className="cp-search"
              placeholder="🔍  Search roles… e.g. Machine Learning, VLSI"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* FIELD TABS */}
        {!search && (
          <div className="cp-tabs">
            {CP_FIELDS.map(f => (
              <button key={f.id} className={`cp-tab${activeField === f.id ? ' active' : ''}`}
                onClick={() => handleFieldClick(f.id)}>
                {f.label}
              </button>
            ))}
          </div>
        )}

        {/* ROLE GRID */}
        <div className="cp-role-grid">
          {displayedRoles.map((r, i) => (
            <div
              key={r.title}
              className={`cp-role-card${selectedRole?.title === r.title ? ' selected' : ''}`}
              style={{ animationDelay: `${i * 0.06}s` }}
              onClick={() => handleRoleClick(r)}
            >
              {r.hot && <span className="cp-rc-hot">🔥 TRENDING</span>}
              <span className="cp-rc-icon">{r.icon}</span>
              <div className="cp-rc-title">{r.title}</div>
              <div className="cp-rc-desc">{r.desc}</div>
            </div>
          ))}
        </div>

        {/* DETAIL PANEL */}
        {selectedRole && (
          <div className="cp-detail" ref={detailRef}>

            {/* Header */}
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

            {/* Tabs */}
            <div className="cp-dp-tabs">
              {TABS.map(t => (
                <button
                  key={t.id}
                  className={`cp-dp-tab${activeTab === t.id ? ' active' : ''}`}
                  onClick={() => setActiveTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab Content — key forces full remount when role or tab changes,
                preventing recharts from reusing stale internal state across roles */}
            <div className="cp-dp-content">
              <ErrorBoundary key={selectedRole.roleKey + '-' + activeTab}>
                {activeTab === 'trend'   && <TrendTab   key={selectedRole.roleKey} role={selectedRole} />}
                {activeTab === 'jobs'    && <JobsTab    key={selectedRole.roleKey} role={selectedRole} />}
                {activeTab === 'skills'  && <SkillsTab  key={selectedRole.roleKey} role={selectedRole} />}
                {activeTab === 'roadmap' && <RoadmapTab key={selectedRole.roleKey} role={selectedRole} navigate={navigate} />}
              </ErrorBoundary>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  RESUME BUILDER
// ─────────────────────────────────────────────────────────────
function ResumeBuilderPage() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', linkedin:'', skills:'', education:'', experience:'', projects:'' });
  const [preview, setPreview] = useState(null);
  const [success, setSuccess] = useState(false);
  const previewRef = useRef(null);

  const set = (k) => (e) => setForm(prev => ({...prev, [k]:e.target.value}));

  const generate = () => {
    if(!form.name || !form.email) { alert('Please enter at least your name and email.'); return; }
    setPreview({ ...form });
    setSuccess(true);
    setTimeout(() => { if(previewRef.current) previewRef.current.scrollIntoView({behavior:'smooth'}); }, 100);
  };

  const downloadPDF = () => {
    if(!preview) { alert('Please generate the resume first.'); return; }
    if(window.html2pdf) {
      window.html2pdf().set({ margin:0.5, filename:'SmartEduCare_Resume.pdf', image:{type:'jpeg',quality:0.98}, html2canvas:{scale:2,useCORS:true}, jsPDF:{unit:'in',format:'letter',orientation:'portrait'} }).from(document.getElementById('resume-preview-content')).save();
    } else {
      window.print();
    }
  };

  const reset = () => { setForm({ name:'',email:'',phone:'',linkedin:'',skills:'',education:'',experience:'',projects:'' }); setPreview(null); setSuccess(false); };

  useEffect(() => {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    document.head.appendChild(s);
  }, []);

  const fields = [
    { key:'name', label:'Full Name *', type:'input' },
    { key:'email', label:'Email Address *', type:'input' },
    { key:'phone', label:'Phone Number', type:'input' },
    { key:'linkedin', label:'LinkedIn / Portfolio URL', type:'input' },
    { key:'skills', label:'Skills (comma separated)', type:'input' },
    { key:'education', label:'Education Details', type:'textarea' },
    { key:'experience', label:'Work Experience', type:'textarea' },
    { key:'projects', label:'Projects (optional)', type:'textarea' },
  ];

  return (
    <div className="page-wrap page-enter">
      <div className="resume-wrap">
        <h1 className="page-title">📄 Resume Builder</h1>
        <p style={{textAlign:'center',color:'var(--muted)',marginBottom:'3rem',fontSize:'0.95rem'}}>Fill in your details and generate an ATS-friendly resume in seconds.</p>
        <div className="resume-layout">
          <div>
            {success && <div className="success-bar">✓ Resume generated successfully!</div>}
            <div className="form-card2">
              <h2>✏️ Your Information</h2>
              {fields.map(f => (
                <div className="field" key={f.key}>
                  {f.type==='input'
                    ? <input type="text" value={form[f.key]} onChange={set(f.key)} placeholder=" " />
                    : <textarea value={form[f.key]} onChange={set(f.key)} placeholder=" " />
                  }
                  <label>{f.label}</label>
                </div>
              ))}
              <div className="btn-row">
                <button className="btn btn-primary" onClick={generate}>✨ Generate Preview</button>
                <button className="btn btn-cyan" onClick={downloadPDF}>📥 Download PDF</button>
                <button className="btn btn-ghost" onClick={reset}>↺ Reset</button>
              </div>
            </div>
          </div>
          <div ref={previewRef}>
            {!preview
              ? <div className="preview-placeholder"><span className="ph-icon">👁️</span><strong>Resume Preview</strong><p style={{fontSize:'0.83rem'}}>Fill in your details and click "Generate Preview"</p></div>
              : (
                <div className="resume-preview" id="resume-preview-content">
                  <div className="prev-name">{preview.name}</div>
                  <div className="prev-contact">
                    <span>📧 {preview.email}</span>
                    {preview.phone && <span>📞 {preview.phone}</span>}
                    {preview.linkedin && <span>🔗 {preview.linkedin}</span>}
                  </div>
                  {preview.skills && (
                    <div className="prev-section">
                      <div className="prev-sec-title">Skills</div>
                      <div className="skills-row">
                        {preview.skills.split(',').map((s,i) => <span key={i} className="skill-badge">{s.trim()}</span>)}
                      </div>
                    </div>
                  )}
                  {preview.education && (
                    <div className="prev-section">
                      <div className="prev-sec-title">Education</div>
                      <p className="prev-text">{preview.education}</p>
                    </div>
                  )}
                  {preview.experience && (
                    <div className="prev-section">
                      <div className="prev-sec-title">Experience</div>
                      <p className="prev-text">{preview.experience}</p>
                    </div>
                  )}
                  {preview.projects && (
                    <div className="prev-section">
                      <div className="prev-sec-title">Projects</div>
                      <p className="prev-text">{preview.projects}</p>
                    </div>
                  )}
                </div>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  APP
// ─────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState('home');
  const [transitioning, setTransitioning] = useState(false);

  const navigate = useCallback((p) => {
    if (p === page) return;
    setTransitioning(true);
    setTimeout(() => {
      setPage(p);
      setTransitioning(false);
      window.scrollTo({ top:0, behavior:'instant' });
    }, 280);
  }, [page]);

  const pages = { home: HomePage, dashboard: DashboardPage, chatbot: ChatbotPage, career: CareerPage, 'career-path': CareerPathPage, resume: ResumeBuilderPage };
  const PageComponent = pages[page] || HomePage;

  return (
    <div style={{ opacity: transitioning ? 0 : 1, transform: transitioning ? 'translateY(-12px)' : 'none', transition:'all 0.28s ease', minHeight:'100vh', background:'#070b14' }}>
      <style>{STYLES}</style>
      <Navbar page={page} navigate={navigate} />
      <PageComponent navigate={navigate} />
    </div>
  );
}