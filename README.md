# VendorSnipe — Autonomous AI Procurement Agent

> Built for TinyFish $2M Pre-Accelerator Hackathon

Live App: https://vendor-snipe.vercel.app/  
Deep Dive: https://medium.com/@saidhanyashree/revolutionizing-vendor-selection-with-a-live-ai-web-agent-20c870bab764  

---

## TL;DR

VendorSnipe is an autonomous AI agent that performs end-to-end vendor selection:

- Understands requirements  
- Simulates vendor discovery  
- Compares structured data  
- Recommends the best option  

This is not a chatbot.  
This is a decision-making system.

---

## The Problem

Vendor selection today is:

- Time-consuming  
- Fragmented across sources  
- Lacking structured comparison  
- Difficult to scale  

---

## The Approach

VendorSnipe introduces an AI procurement agent that executes:



This mirrors real-world procurement workflows.

---

## Architecture

```mermaid
flowchart LR
    A[User Query] --> B[Intent Detection]
    B --> C[Workflow Engine]
    C --> D[Agent Execution Loop]
    D --> E[Vendor Analysis]
    E --> F[Final Decision]

Execution Flow
Query is parsed and intent is extracted
Workflow is selected dynamically
Agent performs multi-step reasoning
Vendors are structured into comparable format
Best recommendation is generated
Capabilities
Multi-domain support: Cloud, Payments, HR, CRM, Cybersecurity, Logistics
Real-time execution using Server-Sent Events
Transparent reasoning via step-by-step logs
Structured vendor comparison
Try It

https://vendor-snipe.vercel.app/

Example queries:

Best cloud provider for AI startup  
HR tools for 50 employees  
Payment gateway for Indian SaaS  
Sample Output
Top Recommendation: Google Cloud Platform

Reason:
- Strong AI/ML ecosystem  
- Flexible pricing  
- Best suited for AI startups  
Tech Stack

Frontend:

React.js
EventSource (real-time streaming)

Backend:

Node.js
Express
Server-Sent Events (SSE)

Infrastructure:

Vercel (Frontend)
Render (Backend)
Differentiation
Capability	VendorSnipe	Typical Projects
Agent-based workflow	Yes	No
Multi-step reasoning	Yes	No
Real-time execution	Yes	No
Structured decision output	Yes	No
Why This Matters

Procurement is a large and complex problem space.

VendorSnipe demonstrates how AI agents can:

Reduce decision time
Improve consistency
Scale across domains
Future Work
Integration with live web data (TinyFish)
Vendor scoring and ranking models
LLM-based deeper reasoning
Enterprise integrations


Author

Saidhanya Sree

Final Note

This project reflects a shift from static tools to autonomous systems that can reason and act.
