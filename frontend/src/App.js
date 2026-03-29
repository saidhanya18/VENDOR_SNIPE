import { useState, useEffect, useRef } from "react";
const BASE_URL = process.env.REACT_APP_API_URL;

// ─── STYLES ───────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #080b10; --surface: #0d1117; --border: #1a2030;
    --accent: #00e5ff; --accent2: #7c3aed; --green: #22c55e;
    --yellow: #f59e0b; --red: #ef4444; --text: #e2e8f0;
    --muted: #4a5568; --card: #0f1520;
  }
  body { background: var(--bg); color: var(--text); font-family: 'Syne', sans-serif; overflow-x: hidden; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
  @keyframes glow { 0%,100%{box-shadow:0 0 20px rgba(0,229,255,0.1);} 50%{box-shadow:0 0 40px rgba(0,229,255,0.3);} }
  @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0;} }
  @keyframes float { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-8px);} }
  @keyframes slideIn { from{opacity:0;transform:translateX(-10px);} to{opacity:1;transform:translateX(0);} }
  .fade-up{animation:fadeUp 0.5s ease forwards;}
  .fade-up-1{animation:fadeUp 0.5s 0.1s ease both;}
  .fade-up-2{animation:fadeUp 0.5s 0.2s ease both;}
  .fade-up-3{animation:fadeUp 0.5s 0.3s ease both;}
  .fade-up-4{animation:fadeUp 0.5s 0.4s ease both;}
  .mono{font-family:'JetBrains Mono',monospace;}
  .grid-bg{position:fixed;inset:0;pointer-events:none;z-index:0;
    background-image:linear-gradient(rgba(0,229,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,0.03) 1px,transparent 1px);
    background-size:40px 40px;}
  .noise{position:fixed;inset:0;pointer-events:none;z-index:1;opacity:0.02;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");}
  .corner-tl,.corner-br{position:fixed;width:200px;height:200px;pointer-events:none;z-index:0;}
  .corner-tl{top:0;left:0;border-top:1px solid rgba(0,229,255,0.15);border-left:1px solid rgba(0,229,255,0.15);}
  .corner-br{bottom:0;right:0;border-bottom:1px solid rgba(124,58,237,0.15);border-right:1px solid rgba(124,58,237,0.15);}
`;

function StyleProvider({ children }) { return <><style>{css}</style>{children}</>; }
function Background() { return <><div className="grid-bg"/><div className="noise"/><div className="corner-tl"/><div className="corner-br"/></>; }

// ─── TINYFISH API ─────────────────────────────────────────────────────────────
// TinyFish proxy: just Content-Type header, no api key or anthropic-version needed
async function callAI(messages, { query = "", vendors = [], bestChoice = "" } = {}) {
  const lastMessage = messages[messages.length - 1].content;
  
  const res = await fetch(`${BASE_URL}/chat`,{
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      question: lastMessage,
      query: query || "General Inquiry",
      vendors: vendors.map(v => v.name) || [], 
      bestChoice: bestChoice || "" 
    }),
  });
  
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  
  // Format response to match expected Claude structure in your UI
  return { content: [{ type: "text", text: data.answer }] };
}

function extractText(data) {
  return (data.content || []).filter(b => b.type === "text").map(b => b.text).join("");
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar({ page, setPage }) {
  return (
    <nav style={{
      position:"fixed",top:0,left:0,right:0,zIndex:100,
      padding:"0 32px",height:60,display:"flex",alignItems:"center",justifyContent:"space-between",
      borderBottom:"1px solid var(--border)",background:"rgba(8,11,16,0.9)",backdropFilter:"blur(16px)",
    }}>
      <div onClick={() => setPage("landing")} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:28,height:28,borderRadius:6,background:"linear-gradient(135deg,var(--accent),var(--accent2))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800}}>V</div>
        <span style={{fontWeight:800,fontSize:15,letterSpacing:"0.05em"}}>VENDOR<span style={{color:"var(--accent)"}}>SNIPE</span></span>
      </div>
      <div style={{display:"flex",gap:24,alignItems:"center"}}>
        {["home","skills"].map(p => (
          <button key={p} onClick={() => setPage(p)} style={{
            background:"none",border:"none",cursor:"pointer",
            color:page===p?"var(--accent)":"var(--muted)",
            fontSize:13,fontWeight:600,letterSpacing:"0.08em",
            textTransform:"uppercase",fontFamily:"inherit",transition:"color 0.2s",
          }}>{p}</button>
        ))}
        <div style={{
          padding:"6px 14px",borderRadius:4,
          background:"rgba(0,229,255,0.08)",border:"1px solid rgba(0,229,255,0.2)",
          fontSize:11,fontFamily:"JetBrains Mono,monospace",
          color:"var(--accent)",fontWeight:500,animation:"pulse 2s infinite",
        }}>● LIVE</div>
      </div>
    </nav>
  );
}

// ─── LANDING ──────────────────────────────────────────────────────────────────
function LandingPage({ setPage }) {
  const [typed, setTyped] = useState("");
  const phrases = useRef([
  "best HR tools for 50-person startup",
  "payment gateway for Indian startup",
  "CRM for B2B SaaS company",
  "cybersecurity tools for SMB"
]).current;
  const pidx = useRef(0), cidx = useRef(0), del = useRef(false);

  useEffect(() => {
    const tick = () => {
      const p = phrases[pidx.current];
      if (!del.current) {
        cidx.current++;
        setTyped(p.slice(0, cidx.current));
        if (cidx.current === p.length) { del.current = true; return setTimeout(tick, 1800); }
      } else {
        cidx.current--;
        setTyped(p.slice(0, cidx.current));
        if (cidx.current === 0) { del.current = false; pidx.current = (pidx.current + 1) % phrases.length; }
      }
      setTimeout(tick, del.current ? 40 : 70);
    };
    const t = setTimeout(tick, 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"80px 24px 40px",position:"relative",zIndex:2}}>
      <div className="fade-up" style={{padding:"5px 14px",borderRadius:100,border:"1px solid rgba(0,229,255,0.25)",background:"rgba(0,229,255,0.05)",fontSize:11,fontFamily:"JetBrains Mono,monospace",color:"var(--accent)",marginBottom:32,letterSpacing:"0.12em",textTransform:"uppercase"}}>
        ⚡ Powered by TinyFish AI · Live Web Search
      </div>

      <h1 className="fade-up-1" style={{fontSize:"clamp(42px,8vw,80px)",fontWeight:800,textAlign:"center",lineHeight:1.05,marginBottom:24,letterSpacing:"-0.02em"}}>
        Find the Best<br/>
        <span style={{background:"linear-gradient(90deg,var(--accent),var(--accent2))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Vendor in Seconds</span>
      </h1>

      <div className="fade-up-2 mono" style={{fontSize:16,color:"var(--muted)",marginBottom:48,height:24}}>
        <span style={{color:"var(--accent)"}}>$ </span>
        <span style={{color:"var(--text)"}}>{typed}</span>
        <span style={{animation:"blink 1s infinite"}}>▋</span>
      </div>

      <div className="fade-up-3" style={{display:"flex",gap:12,marginBottom:64,flexWrap:"wrap",justifyContent:"center"}}>
        <button onClick={() => setPage("home")} style={{
          padding:"14px 32px",borderRadius:6,cursor:"pointer",
          background:"linear-gradient(135deg,var(--accent),#00b4cc)",
          border:"none",color:"#000",fontWeight:800,fontSize:15,
          fontFamily:"Syne,sans-serif",letterSpacing:"0.05em",
          boxShadow:"0 0 30px rgba(0,229,255,0.3)",transition:"transform 0.2s,box-shadow 0.2s",
        }}
          onMouseEnter={e=>{e.target.style.transform="translateY(-2px)";e.target.style.boxShadow="0 0 50px rgba(0,229,255,0.5)";}}
          onMouseLeave={e=>{e.target.style.transform="";e.target.style.boxShadow="0 0 30px rgba(0,229,255,0.3)";}}
        >START SNIPING →</button>
        <button onClick={() => setPage("skills")} style={{
          padding:"14px 32px",borderRadius:6,cursor:"pointer",
          background:"transparent",border:"1px solid var(--border)",
          color:"var(--text)",fontWeight:600,fontSize:15,
          fontFamily:"Syne,sans-serif",letterSpacing:"0.05em",transition:"border-color 0.2s,color 0.2s",
        }}
          onMouseEnter={e=>{e.target.style.borderColor="var(--accent)";e.target.style.color="var(--accent)";}}
          onMouseLeave={e=>{e.target.style.borderColor="var(--border)";e.target.style.color="var(--text)";}}
        >VIEW SKILLS</button>
      </div>

      <div className="fade-up-4" style={{display:"flex",gap:48,flexWrap:"wrap",justifyContent:"center"}}>
        {[{val:"3-Step",label:"AI Agent Pipeline"},{val:"Live",label:"Web Search Data"},{val:"10+",label:"Vendor Categories"}].map(s => (
          <div key={s.label} style={{textAlign:"center"}}>
            <div style={{fontSize:28,fontWeight:800,color:"var(--accent)"}}>{s.val}</div>
            <div style={{fontSize:12,color:"var(--muted)",fontFamily:"JetBrains Mono,monospace",marginTop:4}}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── HOME / SEARCH ────────────────────────────────────────────────────────────
function HomePage({ setPage, setQuery }) {
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const presets = [
    {icon:"☁️",label:"Cloud Infrastructure",query:"best cloud provider for scalable startup"},
    {icon:"👥",label:"HR Management",query:"best HR tools for 50-person startup"},
    {icon:"💳",label:"Payment Gateway",query:"best payment gateway for Indian startup"},
    {icon:"📊",label:"CRM & Sales",query:"best CRM for B2B SaaS company"},
    {icon:"🔐",label:"Cybersecurity",query:"best cybersecurity tools for SMB"},
    {icon:"📦",label:"Logistics & Ops",query:"best logistics software for ecommerce"},
  ];

  const go = (q) => { const v = q||input; if (!v.trim()) return; setQuery(v); setPage("agent"); };
  useEffect(() => { inputRef.current?.focus(); }, []);

  return (
    <div style={{minHeight:"100vh",padding:"100px 24px 60px",position:"relative",zIndex:2,maxWidth:760,margin:"0 auto"}}>
      <div className="fade-up" style={{marginBottom:48}}>
        <div style={{fontSize:12,fontFamily:"JetBrains Mono,monospace",color:"var(--accent)",marginBottom:12,letterSpacing:"0.1em"}}>// PROCUREMENT SEARCH</div>
        <h2 style={{fontSize:32,fontWeight:800,marginBottom:8}}>What are you procuring?</h2>
        <p style={{color:"var(--muted)",fontSize:14}}>Describe your need. Our 3-step AI agent searches the web and ranks real vendors.</p>
      </div>

      <div className="fade-up-1" style={{position:"relative",marginBottom:16,borderRadius:8,overflow:"hidden",border:"1px solid var(--border)",background:"var(--card)",animation:"glow 3s ease-in-out infinite"}}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,var(--accent),transparent)"}}/>
        <div style={{display:"flex",alignItems:"center",padding:"0 16px"}}>
          <span style={{color:"var(--accent)",fontSize:18,marginRight:12}}>⌕</span>
          <input ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="e.g. best HR tools for 50-person startup in India"
            style={{flex:1,background:"none",border:"none",outline:"none",color:"var(--text)",fontSize:15,padding:"18px 0",fontFamily:"Syne,sans-serif"}}
          />
          <button onClick={()=>go()} disabled={!input.trim()} style={{
            padding:"8px 20px",borderRadius:5,cursor:input.trim()?"pointer":"not-allowed",
            background:input.trim()?"var(--accent)":"var(--border)",
            border:"none",color:input.trim()?"#000":"var(--muted)",
            fontWeight:700,fontSize:13,fontFamily:"Syne,sans-serif",transition:"all 0.2s",
          }}>ANALYZE →</button>
        </div>
      </div>

      <div className="fade-up-1 mono" style={{fontSize:11,color:"var(--muted)",marginBottom:40}}>
        Press Enter · 3-step AI agent · Live web data · ~15–20 seconds
      </div>

      <div className="fade-up-2">
        <div style={{fontSize:11,fontFamily:"JetBrains Mono,monospace",color:"var(--muted)",marginBottom:16,letterSpacing:"0.1em"}}>QUICK CATEGORIES</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:10}}>
          {presets.map((p,i) => (
            <button key={p.label} onClick={()=>go(p.query)} style={{
              padding:"14px 16px",borderRadius:6,cursor:"pointer",
              background:"var(--card)",border:"1px solid var(--border)",
              textAlign:"left",color:"var(--text)",fontFamily:"Syne,sans-serif",
              transition:"all 0.2s",display:"flex",gap:10,alignItems:"center",
              animation:`fadeUp 0.4s ${0.05*i}s ease both`,
            }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(0,229,255,0.4)";e.currentTarget.style.background="rgba(0,229,255,0.04)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.background="var(--card)";}}
            >
              <span style={{fontSize:20}}>{p.icon}</span>
              <div>
                <div style={{fontSize:13,fontWeight:600}}>{p.label}</div>
                <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>Click to analyze →</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── AGENT PAGE ───────────────────────────────────────────────────────────────
// Real 3-step pipeline:
//  Step 1 → Claude detects category + picks vendors
//  Step 2 → Claude uses web_search per vendor (live data)
//  Step 3 → Claude scores + ranks using real fetched data
function AgentPage({ query, setResults, setBestChoice, setPage }) {
  const [logs, setLogs] = useState([]);
  const [phase, setPhase] = useState("idle");
  const [progress, setProgress] = useState(0);
  const [agentThoughts, setAgentThoughts] = useState([]);
  const [liveSearches, setLiveSearches] = useState([]);
  const [stepsDone, setStepsDone] = useState([false, false, false]);
  const logsRef = useRef(null);

  useEffect(() => { if (logsRef.current) logsRef.current.scrollTop = logsRef.current.scrollHeight; }, [logs]);

  const log = (icon, text) => setLogs(prev => [...prev, { icon, text, time: new Date().toLocaleTimeString("en-US", { hour12: false }) }]);

const runAgent = async () => {
  setPhase("running");
  setLogs([]); 
  setProgress(0);

  const cleanQuery = query.trim().toLowerCase();

  // Connect to the Express SSE endpoint
const eventSource = new EventSource(
  `${BASE_URL}/run-agent?input=${encodeURIComponent(cleanQuery)}`
);
eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.log) {
      log("🤖", data.log);
      setProgress((p) => Math.min(p + 15, 90));
    }
    if (data.result) {
      setResults(data.result);
      setBestChoice(data.best_choice);
      setProgress(100);
      setPhase("done");
      eventSource.close();
      setTimeout(() => setPage("results"), 1000);
    }

    // Handle Final Result
    if (data.result) {
      setResults(data.result);
      setBestChoice(data.best_choice);
      setStepsDone([true, true, true]);
      setProgress(100);
      setPhase("done");
      eventSource.close();
      
      setTimeout(() => setPage("results"), 1200);
    }
  };

  eventSource.onerror = () => {
    console.error("EventSource failed.");
    eventSource.close();
  };
};

  const stepLabels = ["Detect Category", "Live Web Search", "Score & Rank"];

  return (
    <div style={{minHeight:"100vh",padding:"100px 24px 60px",position:"relative",zIndex:2,maxWidth:720,margin:"0 auto"}}>

      <div className="fade-up" style={{padding:"12px 16px",borderRadius:6,background:"var(--card)",border:"1px solid var(--border)",marginBottom:32,fontFamily:"JetBrains Mono,monospace",fontSize:13}}>
        <span style={{color:"var(--muted)"}}>query: </span>
        <span style={{color:"var(--accent)"}}>"{query}"</span>
      </div>

      {phase === "idle" && (
        <div className="fade-up" style={{textAlign:"center",padding:"60px 0"}}>
          <div style={{fontSize:64,marginBottom:24,animation:"float 3s ease-in-out infinite"}}>🎯</div>
          <h2 style={{fontSize:24,fontWeight:800,marginBottom:8}}>3-Step AI Agent Ready</h2>
          <div style={{display:"flex",gap:12,justifyContent:"center",marginBottom:16,flexWrap:"wrap"}}>
            {["Step 1: Detect Category","Step 2: Live Web Search","Step 3: Score & Rank"].map((s,i) => (
              <div key={i} style={{fontSize:12,color:"var(--muted)",fontFamily:"JetBrains Mono,monospace",padding:"4px 10px",borderRadius:4,border:"1px solid var(--border)"}}>
                {s}
              </div>
            ))}
          </div>
          <p style={{color:"var(--muted)",marginBottom:32,fontSize:12,fontFamily:"JetBrains Mono,monospace"}}>~15–20 seconds · real web data · no static results</p>
          <button onClick={runAgent} style={{
            padding:"16px 40px",borderRadius:6,cursor:"pointer",
            background:"linear-gradient(135deg,var(--accent),var(--accent2))",
            border:"none",color:"#fff",fontWeight:800,fontSize:16,
            fontFamily:"Syne,sans-serif",letterSpacing:"0.05em",
            boxShadow:"0 0 40px rgba(0,229,255,0.3)",transition:"transform 0.2s",
          }}
            onMouseEnter={e=>e.target.style.transform="scale(1.05)"}
            onMouseLeave={e=>e.target.style.transform=""}
          >⚡ LAUNCH AI AGENT</button>
        </div>
      )}

      {(phase === "running" || phase === "done") && (
        <div className="fade-up">

          {/* PROGRESS */}
          <div style={{marginBottom:20}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <span style={{fontSize:12,fontFamily:"JetBrains Mono,monospace",color:"var(--muted)"}}>AGENT PROGRESS</span>
              <span style={{fontSize:12,fontFamily:"JetBrains Mono,monospace",color:"var(--accent)"}}>{progress}%</span>
            </div>
            <div style={{height:4,background:"var(--border)",borderRadius:2,overflow:"hidden"}}>
              <div style={{height:"100%",borderRadius:2,transition:"width 0.5s ease",width:`${progress}%`,background:"linear-gradient(90deg,var(--accent),var(--accent2))",boxShadow:"0 0 10px var(--accent)"}}/>
            </div>
          </div>

          {/* STEP PIPELINE */}
          <div style={{display:"flex",gap:8,marginBottom:20}}>
            {stepLabels.map((label, i) => (
              <div key={i} style={{
                flex:1,padding:"10px 12px",borderRadius:6,
                background:stepsDone[i]?"rgba(0,229,255,0.08)":"var(--card)",
                border:`1px solid ${stepsDone[i]?"rgba(0,229,255,0.3)":"var(--border)"}`,
                transition:"all 0.4s",
              }}>
                <div style={{fontSize:10,fontFamily:"JetBrains Mono,monospace",color:stepsDone[i]?"var(--green)":"var(--muted)",marginBottom:2}}>
                  {stepsDone[i] ? "✓ DONE" : `0${i+1}`}
                </div>
                <div style={{fontSize:11,fontWeight:600,color:stepsDone[i]?"var(--text)":"var(--muted)"}}>{label}</div>
              </div>
            ))}
          </div>

          {/* LIVE SEARCH TAGS */}
          {liveSearches.length > 0 && (
            <div style={{marginBottom:16,display:"flex",flexWrap:"wrap",gap:6}}>
              <span style={{fontSize:11,color:"var(--muted)",fontFamily:"JetBrains Mono,monospace",marginRight:4}}>🌐 Searching:</span>
              {liveSearches.map(v => (
                <span key={v} style={{padding:"3px 10px",borderRadius:4,fontSize:11,background:"rgba(124,58,237,0.1)",border:"1px solid rgba(124,58,237,0.25)",color:"var(--accent2)",fontFamily:"JetBrains Mono,monospace"}}>{v}</span>
              ))}
            </div>
          )}

          {/* LOG TERMINAL */}
          <div style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:8,overflow:"hidden",marginBottom:20}}>
            <div style={{padding:"10px 16px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:"#ef4444"}}/>
              <div style={{width:10,height:10,borderRadius:"50%",background:"#f59e0b"}}/>
              <div style={{width:10,height:10,borderRadius:"50%",background:"#22c55e"}}/>
              <span style={{fontSize:11,fontFamily:"JetBrains Mono,monospace",color:"var(--muted)",marginLeft:8}}>vendorsnipe_agent.log</span>
            </div>
            <div ref={logsRef} style={{padding:"16px",maxHeight:280,overflowY:"auto"}}>
              {logs.map((l, i) => (
                <div key={i} style={{display:"flex",gap:12,marginBottom:10,animation:"slideIn 0.3s ease both",fontFamily:"JetBrains Mono,monospace",fontSize:12}}>
                  <span style={{color:"var(--muted)",minWidth:70,fontSize:11}}>[{l.time}]</span>
                  <span style={{marginRight:6}}>{l.icon}</span>
                  <span style={{color:i===logs.length-1&&phase==="running"?"var(--accent)":"var(--text)"}}>{l.text}</span>
                  {i===logs.length-1&&phase==="running"&&<span style={{animation:"pulse 1s infinite",color:"var(--accent)"}}>▋</span>}
                </div>
              ))}
              {phase==="done"&&<div style={{fontFamily:"JetBrains Mono,monospace",fontSize:12,color:"var(--green)"}}>✓ Analysis complete. Redirecting...</div>}
            </div>
          </div>

          {/* AGENT THOUGHTS */}
          {agentThoughts.length > 0 && (
            <div style={{padding:"16px",borderRadius:8,background:"rgba(124,58,237,0.06)",border:"1px solid rgba(124,58,237,0.2)"}}>
              <div style={{fontSize:11,fontFamily:"JetBrains Mono,monospace",color:"var(--accent2)",marginBottom:10}}>💭 AGENT REASONING</div>
              {agentThoughts.map((t,i) => (
                <div key={i} style={{fontSize:12,color:"var(--muted)",marginBottom:8,paddingLeft:12,borderLeft:"2px solid rgba(124,58,237,0.4)",animation:"slideIn 0.3s ease both"}}>{t}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── RESULT CARD ──────────────────────────────────────────────────────────────
function ResultCard({ vendor, isBest, index }) {
  const [expanded, setExpanded] = useState(false);
  const vc = {green:"var(--green)",yellow:"var(--yellow)",red:"var(--red)"}[vendor.verdict]||"var(--muted)";
  const vl = {green:"BEST FIT",yellow:"DECENT",red:"POOR FIT"}[vendor.verdict]||"N/A";
  const rp = (parseFloat(vendor.rating)/5)*100;

  return (
    <div onClick={()=>setExpanded(!expanded)} style={{
      borderRadius:8,cursor:"pointer",
      background:isBest?"rgba(0,229,255,0.04)":"var(--card)",
      border:`1px solid ${isBest?"rgba(0,229,255,0.35)":"var(--border)"}`,
      overflow:"hidden",animation:`fadeUp 0.4s ${index*0.08}s ease both`,
      transition:"border-color 0.2s,transform 0.15s",position:"relative",
    }}
      onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
      onMouseLeave={e=>e.currentTarget.style.transform=""}
    >
      {isBest&&<div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,var(--accent),var(--accent2))"}}/>}

      <div style={{padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:36,height:36,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",background:isBest?"rgba(0,229,255,0.15)":"var(--border)",fontSize:16,fontWeight:800,color:isBest?"var(--accent)":"var(--muted)"}}>
            {isBest?"★":index+1}
          </div>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontWeight:700,fontSize:15}}>{vendor.name}</span>
              {isBest&&<span style={{fontSize:10,padding:"2px 8px",borderRadius:100,background:"rgba(0,229,255,0.15)",color:"var(--accent)",fontFamily:"JetBrains Mono,monospace"}}>TOP PICK</span>}
            </div>
            <div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>{vendor.category}</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:20}}>
          <div>
            <div style={{fontSize:11,color:"var(--muted)",fontFamily:"JetBrains Mono,monospace",marginBottom:4}}>RATING</div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:60,height:4,background:"var(--border)",borderRadius:2,overflow:"hidden"}}>
                <div style={{width:`${rp}%`,height:"100%",background:"var(--green)",borderRadius:2}}/>
              </div>
              <span style={{fontSize:13,fontWeight:700,color:"var(--green)"}}>{vendor.rating}</span>
            </div>
          </div>
          <div style={{padding:"5px 12px",borderRadius:4,background:`${vc}18`,border:`1px solid ${vc}40`,fontSize:11,fontFamily:"JetBrains Mono,monospace",color:vc}}>{vl}</div>
          <div style={{color:"var(--muted)",fontSize:12}}>{expanded?"▲":"▼"}</div>
        </div>
      </div>

      {expanded && (
        <div style={{padding:"16px 20px 20px",borderTop:"1px solid var(--border)",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:16}}>
          {[{label:"PRICING",value:vendor.pricing},{label:"STRENGTHS",value:vendor.strengths},{label:"BEST FOR",value:vendor.best_for},{label:"WEBSITE",value:vendor.website||"—"}].map(item => (
            <div key={item.label}>
              <div style={{fontSize:10,fontFamily:"JetBrains Mono,monospace",color:"var(--muted)",marginBottom:4,letterSpacing:"0.1em"}}>{item.label}</div>
              <div style={{fontSize:13,color:"var(--text)",wordBreak:"break-word"}}>
                {item.label==="WEBSITE"&&item.value!=="—"
                  ?<a href={item.value} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} style={{color:"var(--accent)",textDecoration:"none"}}>{item.value}</a>
                  :item.value}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── RESULTS PAGE ─────────────────────────────────────────────────────────────
function ResultsPage({ results, bestChoice, query, setPage, setQuery }) {
  const [followUp, setFollowUp] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [chatLog]);

  const handleFollowUp = async () => {
    if (!followUp.trim() || chatLoading) return;
    const q = followUp.trim();
    setFollowUp("");
    setChatLog(prev => [...prev, { role: "user", text: q }]);
    setChatLoading(true);
    try {
      const data = await callAI([{ role: "user", content:
        `You are a procurement assistant. The user searched for: "${query}".
Vendors analyzed: ${results.map(v=>v.name).join(", ")}.
Top recommendation: ${bestChoice}.
User asks: "${q}"
Answer helpfully in 2-3 sentences, referencing these specific vendors.` }], { maxTokens: 400 });
      setChatLog(prev => [...prev, { role: "ai", text: extractText(data) || "Sorry, could not process that." }]);
    } catch (err) {
      setChatLog(prev => [...prev, { role: "ai", text: `Error: ${err.message}` }]);
    }
    setChatLoading(false);
  };

  if (!results.length) {
    return (
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:20,position:"relative",zIndex:2}}>
        <div style={{fontSize:48}}>🎯</div>
        <p style={{color:"var(--muted)"}}>No results yet. Run an analysis first.</p>
        <button onClick={()=>setPage("home")} style={{padding:"12px 24px",borderRadius:6,cursor:"pointer",background:"var(--accent)",border:"none",color:"#000",fontWeight:700,fontFamily:"Syne,sans-serif"}}>← Back to Search</button>
      </div>
    );
  }

  const bestVendor = results.find(v=>v.name===bestChoice)||results[0];
  const sorted = [bestVendor,...results.filter(v=>v.name!==bestVendor.name)];

  return (
    <div style={{minHeight:"100vh",padding:"100px 24px 80px",position:"relative",zIndex:2,maxWidth:820,margin:"0 auto"}}>

      <div className="fade-up" style={{marginBottom:32,display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
        <div>
          <div style={{fontSize:11,fontFamily:"JetBrains Mono,monospace",color:"var(--accent)",marginBottom:8}}>// ANALYSIS COMPLETE · LIVE WEB DATA</div>
          <h2 style={{fontSize:28,fontWeight:800}}>{results.length} Vendors Analyzed</h2>
          <p style={{color:"var(--muted)",fontSize:13,marginTop:4,fontFamily:"JetBrains Mono,monospace"}}>"{query}"</p>
        </div>
        <button onClick={()=>{setPage("home");setQuery("");}} style={{
          padding:"10px 20px",borderRadius:6,cursor:"pointer",
          background:"var(--card)",border:"1px solid var(--border)",
          color:"var(--text)",fontFamily:"Syne,sans-serif",fontWeight:600,fontSize:13,alignSelf:"flex-start",
        }}
          onMouseEnter={e=>e.currentTarget.style.borderColor="var(--accent)"}
          onMouseLeave={e=>e.currentTarget.style.borderColor="var(--border)"}
        >← New Search</button>
      </div>

      <div className="fade-up-1" style={{
        padding:"20px 24px",borderRadius:8,marginBottom:24,
        background:"linear-gradient(135deg,rgba(0,229,255,0.08),rgba(124,58,237,0.08))",
        border:"1px solid rgba(0,229,255,0.25)",display:"flex",gap:16,alignItems:"flex-start",flexWrap:"wrap",
      }}>
        <div style={{fontSize:36}}>🏆</div>
        <div>
          <div style={{fontSize:11,fontFamily:"JetBrains Mono,monospace",color:"var(--accent)",marginBottom:6}}>AI RECOMMENDATION · LIVE DATA</div>
          <div style={{fontSize:20,fontWeight:800}}>{bestChoice}</div>
          {bestVendor?.strengths&&<div style={{fontSize:13,color:"var(--muted)",marginTop:4}}>{bestVendor.strengths}</div>}
        </div>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:40}}>
        {sorted.map((vendor,i) => <ResultCard key={vendor.name} vendor={vendor} isBest={vendor.name===bestChoice} index={i}/>)}
      </div>

    </div>
  );
}

// ─── SKILLS PAGE ──────────────────────────────────────────────────────────────
function SkillsPage() {
  const skills = [
    {icon:"🧠",name:"Step 1 · Category Detection",color:"var(--accent)",checks:["Parses natural language query","Detects exact procurement category","Maps to correct vendor universe","Rejects irrelevant vendors"],sources:["Claude AI Reasoning"]},
    {icon:"🌐",name:"Step 2 · Live Web Search",color:"#a78bfa",checks:["Real-time vendor site searches","Live pricing data retrieved","G2/Capterra ratings pulled","Recent reviews analyzed"],sources:["web_search_20250305","G2","Capterra","Vendor Sites"]},
    {icon:"⚖️",name:"Step 3 · Score & Recommend",color:"#34d399",checks:["Vendors ranked by query fit","Pricing models compared","Strengths & weaknesses mapped","Best choice with full reasoning"],sources:["Claude AI Analysis"]},
    {icon:"💬",name:"Follow-up Chat",color:"#f59e0b",checks:["Context-aware Q&A","References actual vendor data","Handles pricing questions","Compares vendors on demand"],sources:["Claude AI","Session Context"]},
  ];

  return (
    <div style={{minHeight:"100vh",padding:"100px 24px 60px",position:"relative",zIndex:2,maxWidth:900,margin:"0 auto"}}>
      <div className="fade-up" style={{marginBottom:40}}>
        <div style={{fontSize:11,fontFamily:"JetBrains Mono,monospace",color:"var(--accent)",marginBottom:12,letterSpacing:"0.1em"}}>// AGENT ARCHITECTURE</div>
        <h2 style={{fontSize:32,fontWeight:800}}>3-Step AI Agent Pipeline</h2>
        <p style={{color:"var(--muted)",marginTop:8}}>Multi-step reasoning with live web search — zero static fallback data.</p>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(380px,1fr))",gap:16}}>
        {skills.map((skill,i) => (
          <div key={skill.name} style={{padding:"24px",borderRadius:8,background:"var(--card)",border:"1px solid var(--border)",animation:`fadeUp 0.4s ${i*0.08}s ease both`,position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:skill.color,opacity:0.6}}/>
            <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:16}}>
              <div style={{fontSize:28}}>{skill.icon}</div>
              <div>
                <div style={{fontWeight:700,fontSize:14}}>{skill.name}</div>
                <div style={{fontSize:11,color:skill.color,fontFamily:"JetBrains Mono,monospace",marginTop:2}}>{skill.checks.length} capabilities</div>
              </div>
            </div>
            <div style={{marginBottom:16}}>
              {skill.checks.map(c=>(
                <div key={c} style={{display:"flex",gap:8,alignItems:"center",padding:"4px 0",fontSize:13}}>
                  <span style={{color:skill.color}}>✓</span><span style={{color:"var(--text)"}}>{c}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{fontSize:10,fontFamily:"JetBrains Mono,monospace",color:"var(--muted)",marginBottom:8,letterSpacing:"0.1em"}}>DATA SOURCES</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {skill.sources.map(s=>(
                  <span key={s} style={{padding:"3px 10px",borderRadius:4,fontSize:11,background:`${skill.color}12`,border:`1px solid ${skill.color}25`,color:skill.color,fontFamily:"JetBrains Mono,monospace"}}>{s}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="fade-up" style={{marginTop:40,padding:"24px",borderRadius:8,border:"1px solid var(--border)",background:"var(--card)",fontFamily:"JetBrains Mono,monospace",fontSize:12}}>
        <div style={{color:"var(--accent)",marginBottom:16,fontSize:11,letterSpacing:"0.1em"}}>// ARCHITECTURE</div>
        <pre style={{color:"var(--text)",lineHeight:1.8,overflowX:"auto",fontSize:12}}>{`User Query
    │
    ▼
┌──────────────────────┐
│  STEP 1: Claude AI   │  ← detects category, selects 4 vendors
└──────────┬───────────┘
           │
    ┌──────▼──────┐
    │   STEP 2    │  ← web_search_20250305 tool
    │  Web Agent  │     4 live searches (1 per vendor)
    └──────┬──────┘     real pricing · ratings · features
           │
┌──────────▼───────────┐
│  STEP 3: Claude AI   │  ← scores on real data
│  Analyst             │     produces final ranked JSON
└──────────┬───────────┘
           │
    React Dashboard
    + Follow-up Chat (TinyFish AI)`}</pre>
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("landing");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [bestChoice, setBestChoice] = useState("");

  return (
    <StyleProvider>
      <Background/>
      <Navbar page={page} setPage={setPage}/>
      {page==="landing"&&<LandingPage setPage={setPage}/>}
      {page==="home"&&<HomePage setPage={setPage} setQuery={setQuery}/>}
      {page==="agent"&&<AgentPage query={query} setResults={setResults} setBestChoice={setBestChoice} setPage={setPage}/>}
      {page==="results"&&<ResultsPage results={results} bestChoice={bestChoice} query={query} setPage={setPage} setQuery={setQuery}/>}
      {page==="skills"&&<SkillsPage/>}
    </StyleProvider>
  );
}
