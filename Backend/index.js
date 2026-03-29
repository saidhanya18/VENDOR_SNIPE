require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// Utility delay function
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Decide workflow based on keywords
function decideWorkflow(input) {
  input = input.toLowerCase();
  const keywords = {
    cloud: ["cloud", "aws", "azure", "gcp", "hosting", "server", "infrastructure"],
    payment: ["payment", "gateway", "stripe", "razorpay", "billing", "checkout"],
    hr: ["hr", "human resource", "people", "payroll", "hiring"],
    crm: ["crm", "sales", "customer", "lead", "pipeline", "hubspot", "salesforce"],
    cyber: ["security", "cyber", "firewall", "threat", "antivirus", "protection"],
    logistics: ["logistics", "shipping", "delivery", "ecommerce ops", "warehouse"]
  };

  for (const [workflow, words] of Object.entries(keywords)) {
    if (words.some((word) => input.includes(word))) return workflow;
  }
  return "general";
}

// Build goal (optional, placeholder for AI)
function buildGoal(input) {
  return `
You are an AI procurement agent.

User request: ${input}

Steps:
1. Find vendors
2. Compare pricing
3. Compare strengths
4. Suggest best

Return JSON:
{
  "vendors": [
    {
      "name": "",
      "category": "",
      "pricing": "",
      "rating": "",
      "strengths": "",
      "best_for": ""
    }
  ],
  "best_choice": ""
}
`;
}

// Root route
app.get("/", (req, res) => {
  res.send("Procurement Agent Server is running!");
});

// Run agent endpoint with streaming logs
app.get("/run-agent", async (req, res) => {
  const input = req.query.input || "best cloud provider";

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const sendLog = (msg) => res.write(`data: ${JSON.stringify({ log: msg })}\n\n`);

  // Stream logs with delays
  sendLog("Understanding your requirement...");
  await delay(1000);
  sendLog("Identifying relevant vendors...");
  await delay(1000);
  sendLog("Comparing pricing models...");
  await delay(1000);
  sendLog("Analyzing strengths and use cases...");
  await delay(1000);
  sendLog("Finalizing recommendation...");
  await delay(500);

  const workflow = decideWorkflow(input);

  let result = [];
  let best_choice = "";

  if (workflow === "cloud") {
    result = [
      {
        name: "Amazon Web Services (AWS)",
        category: "Cloud Infrastructure",
        pricing: "$0.023/GB",
        rating: "4.7",
        strengths: "Highly scalable global infrastructure",
        best_for: "Large-scale applications",
        website: "https://aws.amazon.com",
        verdict: "yellow",
      },
      {
        name: "Google Cloud Platform (GCP)",
        category: "Cloud Infrastructure",
        pricing: "Flexible pricing",
        rating: "4.6",
        strengths: "Strong AI/ML ecosystem",
        best_for: "AI startups",
        website: "https://cloud.google.com",
        verdict: "green",
      },
      {
        name: "Microsoft Azure",
        category: "Cloud Infrastructure",
        pricing: "Enterprise pricing",
        rating: "4.5",
        strengths: "Deep Microsoft integration",
        best_for: "Corporate environments",
        website: "https://azure.microsoft.com",
        verdict: "yellow",
      },
    ];
    best_choice = "Google Cloud Platform (GCP)";
  } else if (workflow === "hr") {
    result = [
      {
        name: "Workday",
        category: "HR Management",
        pricing: "Enterprise pricing",
        rating: "4.6",
        strengths: "Full HR + finance suite",
        best_for: "Large enterprises",
        website: "https://www.workday.com",
        verdict: "yellow",
      },
      {
        name: "BambooHR",
        category: "HR Management",
        pricing: "$6–8/user/month",
        rating: "4.5",
        strengths: "Simple and user-friendly",
        best_for: "Startups and SMBs",
        website: "https://www.bamboohr.com",
        verdict: "green",
      },
      {
        name: "Zoho People",
        category: "HR Management",
        pricing: "Affordable plans",
        rating: "4.4",
        strengths: "Great integration with Zoho suite",
        best_for: "Budget-friendly teams",
        website: "https://www.zoho.com/people",
        verdict: "yellow",
      },
    ];
    best_choice = "BambooHR";
  } else if (workflow === "payment") {
    result = [
      {
        name: "Stripe",
        category: "Payment Gateway",
        pricing: "2.9% + $0.30",
        rating: "4.7",
        strengths: "Best developer APIs",
        best_for: "Global SaaS",
        website: "https://stripe.com",
        verdict: "green",
      },
      {
        name: "Razorpay",
        category: "Payment Gateway",
        pricing: "2% per transaction",
        rating: "4.6",
        strengths: "Best for Indian market",
        best_for: "Indian startups",
        website: "https://razorpay.com",
        verdict: "green",
      },
      {
        name: "PayPal",
        category: "Payment Gateway",
        pricing: "Higher fees",
        rating: "4.4",
        strengths: "Global trust",
        best_for: "International payments",
        website: "https://paypal.com",
        verdict: "yellow",
      },
    ];
    best_choice = "Razorpay";
  } else if (workflow === "crm") {
    result = [
      { name: "HubSpot CRM", category: "CRM", pricing: "Free to $1,200/mo", rating: "4.7", strengths: "Best-in-class UI and marketing sync", best_for: "B2B SaaS Startups", website: "https://hubspot.com", verdict: "green" },
      { name: "Salesforce", category: "CRM", pricing: "Contact Sales", rating: "4.8", strengths: "Unlimited customization", best_for: "Enterprise SaaS", website: "https://salesforce.com", verdict: "yellow" },
      { name: "Pipedrive", category: "CRM", pricing: "$15/user/mo", rating: "4.5", strengths: "Visual sales pipeline focus", best_for: "Small Sales Teams", website: "https://pipedrive.com", verdict: "green" }
    ];
    best_choice = "HubSpot CRM";
  } else if (workflow === "cyber") {
    result = [
      { name: "Cloudflare", category: "Cybersecurity", pricing: "Free to Enterprise", rating: "4.8", strengths: "DDoS protection and CDN", best_for: "Web-facing startups", website: "https://cloudflare.com", verdict: "green" },
      { name: "CrowdStrike", category: "Cybersecurity", pricing: "Quote based", rating: "4.7", strengths: "Endpoint protection", best_for: "Enterprise security", website: "https://crowdstrike.com", verdict: "yellow" }
    ];
    best_choice = "Cloudflare";
  } else if (workflow === "logistics") {
    result = [
      { name: "Shiprocket", category: "Logistics", pricing: "Pay-as-you-go", rating: "4.4", strengths: "Multi-carrier integration", best_for: "D2C brands in India", website: "https://shiprocket.in", verdict: "green" },
      { name: "Delhivery", category: "Logistics", pricing: "Custom", rating: "4.2", strengths: "Massive delivery network", best_for: "Heavy shipping needs", website: "https://delhivery.com", verdict: "yellow" }
    ];
    best_choice = "Shiprocket";
  } else {
    result = [
      {
        name: "Notion",
        category: "Productivity",
        pricing: "Free + paid plans",
        rating: "4.6",
        strengths: "All-in-one workspace",
        best_for: "Teams",
        website: "https://www.notion.so",
        verdict: "green",
      },
    ];
    best_choice = "Notion";
  }

  res.write(
    `data: ${JSON.stringify({
      result,
      best_choice,
      workflow,
    })}\n\n`
  );

  res.end();
});

// Follow-up chat endpoint
app.post("/chat", async (req, res) => {
  const { 
    question = "", 
    query = "General", 
    vendors = [], 
    bestChoice = "" 
  } = req.body;

  if (!question) {
    return res.status(400).json({ error: "No question provided" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.TINYFISH_API_KEY, // Ensure this is in your .env
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20240620", // Standard Claude 3.5 Sonnet name
        max_tokens: 500,
        messages: [
          {
            role: "user",
            content: `You are a procurement assistant. The user searched for: "${query}". 
            Vendors analyzed: ${vendors.length > 0 ? vendors.join(", ") : "None yet"}. 
            Top recommendation: ${bestChoice || "None"}.

            User asks: "${question}"

            Answer helpfully in 2-3 sentences, referencing the actual vendors above.`,
          },
        ],
      }),
    });

    const data = await response.json();
    
    if (data.error) {
        console.error("Anthropic Error:", data.error);
        throw new Error(data.error.message);
    }

    const text = data.content?.filter(c => c.type === "text").map((c) => c.text).join("") || "";
    res.json({ answer: text });
  } catch (err) {
    console.error("Server Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});