<div align="center">

<img src="https://img.shields.io/badge/LIVE-vendor--snipe.vercel.app-00ff88?style=for-the-badge&labelColor=000000" alt="Live Demo"/>
<img src="https://img.shields.io/badge/built_at-TinyFish_Hackathon_2026-blueviolet?style=for-the-badge&labelColor=000000" alt="Hackathon"/>
<img src="https://img.shields.io/badge/powered_by-TinyFish_Web_Agent-ff6b35?style=for-the-badge&labelColor=000000" alt="TinyFish"/>

<br/><br/>

```
 ██╗   ██╗███████╗███╗   ██╗██████╗  ██████╗ ██████╗ ███████╗███╗   ██╗██╗██████╗ ███████╗
 ██║   ██║██╔════╝████╗  ██║██╔══██╗██╔═══██╗██╔══██╗██╔════╝████╗  ██║██║██╔══██╗██╔════╝
 ██║   ██║█████╗  ██╔██╗ ██║██║  ██║██║   ██║██████╔╝███████╗██╔██╗ ██║██║██████╔╝█████╗  
 ╚██╗ ██╔╝██╔══╝  ██║╚██╗██║██║  ██║██║   ██║██╔══██╗╚════██║██║╚██╗██║██║██╔═══╝ ██╔══╝  
  ╚████╔╝ ███████╗██║ ╚████║██████╔╝╚██████╔╝██║  ██║███████║██║ ╚████║██║██║     ███████╗
   ╚═══╝  ╚══════╝╚═╝  ╚═══╝╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝╚═╝╚═╝     ╚══════╝
```

### **Stop guessing. Start knowing.**
### A live, multi-step AI web agent that researches, scores, and recommends vendors — in real time.

<br/>

[🚀 **Try it Live**](https://vendor-snipe.vercel.app/) &nbsp;·&nbsp; [📖 **Read the Deep Dive**](https://medium.com/@saidhanyashree/revolutionizing-vendor-selection-with-a-live-ai-web-agent-20c870bab764) &nbsp;·&nbsp; [🎬 **Watch Demo**](https://drive.google.com/file/d/1Wd0SWncslUqnkNdvx6ciqUP1zfrOWn0N/view?usp=sharing)

</div>

---

## 🎯 The Problem Nobody Talks About

Businesses waste **hours every week** doing vendor research the wrong way:

| The Old Way | The VendorSnipe Way |
|---|---|
| 📁 Outdated spreadsheets | ⚡ Live web data, fetched right now |
| 🌐 Manually browsing 10+ sites | 🤖 AI agent browses on your behalf |
| 📊 Gut-feel comparisons | 📈 Objective scoring across 4 dimensions |
| ⏱️ Hours of research | ⚡ Minutes to a ranked recommendation |
| 🤷 "We think this vendor is good?" | ✅ "This vendor scores 92/100. Here's why." |

> **VendorSnipe replaces guesswork with intelligence.**

---

## ✨ What Makes It Different

Unlike tools that rank vendors from a static database, VendorSnipe **goes to the live web** every single time.

```
Your query: "Best project management tool under $50 for a small team"
     │
     ▼
┌────────────────────────────────────┐
│  STEP 1 — Category Intelligence    │  Parses intent · Detects category
│  TinyFish Web Agent                │  Shortlists top relevant vendors
└──────────────┬─────────────────────┘
               │ live vendor list
               ▼
┌────────────────────────────────────┐
│  STEP 2 — Live Web Intelligence    │  Hits vendor websites in real-time
│  TinyFish Web Agent                │  Pulls pricing · features · reviews
└──────────────┬─────────────────────┘  Aggregates G2 · Capterra · more
               │ structured data
               ▼
┌────────────────────────────────────┐
│  STEP 3 — Score · Rank · Recommend │  Multi-dimensional scoring
│  Scoring Engine + React Dashboard  │  Highlights winner with reasoning
└────────────────────────────────────┘
               │
               ▼
    🏆 Ranked vendor cards with strengths,
       weaknesses, pricing fit & ratings
```

---

## 🔥 Key Features

### 🌐 Always-Live Data
No cached results. No stale databases. The agent fetches **real pricing, real reviews, real features** — as they exist on vendor websites right now.

### 🧠 Multi-Step AI Reasoning
The agent thinks like a senior analyst: first understanding what you need, then researching each option, then synthesizing a verdict. Not a keyword match. Actual reasoning.

### 📊 Visual Results Dashboard
Every vendor gets a **result card** with:
- Overall score
- Pricing fit indicator
- Feature relevance score  
- Aggregated rating
- Key strengths and weaknesses

### 🔍 Custom Query Intelligence
Ask naturally. The agent understands constraints like budget, team size, and use case — and filters results accordingly.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React + Vite + Tailwind CSS |
| **Web Agent** | TinyFish `/run-sse` (live browser automation) |
| **AI Reasoning** | Multi-step agent with structured output |
| **Deployment** | Vercel |

---

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/vendor-snipe.git
cd vendor-snipe

# Install dependencies
npm install

# Add your environment variables
cp .env.example .env
# → Add your TINYFISH_API_KEY

# Run locally
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and try a query like:
> *"Best CRM software under $30/user/month for a 10-person sales team"*

---

## 💡 Example Use Cases

- **Startup founders** comparing SaaS tools before committing budgets
- **Procurement teams** shortlisting vendors without manual research
- **Consultants** quickly benchmarking tools for clients
- **Anyone** tired of reading 50 G2 reviews to find the obvious winner

---

## 📐 Architecture Deep Dive

For a full walkthrough of how the multi-step agent works, the reasoning pipeline, and real demo results:

📖 [**Read the full write-up on Medium →**](https://medium.com/@saidhanyashree/revolutionizing-vendor-selection-with-a-live-ai-web-agent-20c870bab764)

---

## 🏆 Built At

**TinyFish $2M Pre-Accelerator Hackathon — March 2026**

VendorSnipe was built to demonstrate how TinyFish's live web agent capability unlocks a class of AI applications that static LLMs simply cannot power — real-time, evidence-based decision tools.

---

<div align="center">

**Decisions at the speed of the web — powered by AI.**

[🌐 vendor-snipe.vercel.app](https://vendor-snipe.vercel.app)

</div>
