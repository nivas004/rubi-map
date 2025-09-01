import React from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

// --- Data -----------------------------------------------------------------
const CORE = {
  id: "Identity Layer",
  subtitle: "PHC + Web-of-Trust (FPP/SSI)",
  color: "#ea580c",
  desc:
    "A cryptographic foundation enabling one-per-person digital identity with privacy-preserving verification. PHC ensures authentic personhood while Web-of-Trust allows portable reputation and community vouching.",
};

const RUBI = {
  id: "RUBI",
  subtitle: "Retroactive Universal Basic Income",
  color: "#db2777",
  desc:
    "Fraud-resistant universal income distribution using PHC to ensure one payment per person, creating economic inclusion and local demand stimulus.",
};

// Main ring
const PETALS = [
  { id: "Digital Governance & Technology Policy", color: "#06b6d4", desc: "Secure citizen authentication for all government services with privacy-preserving credential verification" },
  { id: "Democracy & Electoral Systems", color: "#22c55e", desc: "Tamper-proof voting systems ensuring one person = one vote with cryptographic verifiability" },
  { id: "Cybersecurity & Digital Economy", color: "#22d3ee", desc: "Fraud-resistant identity verification preventing SIM swapping and critical infrastructure attacks" },
  { id: "Science & Research Integrity", color: "#93c5fd", desc: "Verifiable research attribution and AI accountability with human oversight requirements" },
  { id: "Education & Global Credentials", color: "#14b8a6", desc: "Portable, tamper-proof educational credentials recognized worldwide" },
  { id: "Healthcare & Medical Records", color: "#84cc16", desc: "Patient-controlled health data with selective privacy-preserving sharing" },
  { id: "Migration & Humanitarian Aid", color: "#a855f7", desc: "Portable identity for displaced populations enabling rapid, accurate aid distribution" },
  { id: "Financial Inclusion & Banking", color: "#f59e0b", desc: "Streamlined KYC compliance and fraud prevention for universal financial access" },
  { id: "Social Protection & Benefits", color: "#60a5fa", desc: "Ghost-free benefit distribution with community vouching for undocumented populations" },
  { id: "Supply Chain & Trade Verification", color: "#8b5cf6", desc: "End-to-end product authenticity and sustainable sourcing verification" },
  { id: "Climate Action & Carbon Markets", color: "#10b981", desc: "Verified environmental actions and direct climate dividend distribution" },
  { id: "Emergency Response & Disaster Relief", color: "#eab308", desc: "Rapid, fraud-resistant aid distribution during crises using social trust networks" },
];

// Sub-petals
const SUBS = {
  "Digital Governance & Technology Policy": [
    { id: "Citizen Digital Identity", desc: "Self-sovereign government service access" },
    { id: "Privacy-Preserving Verification", desc: "Prove age/residency without data exposure" },
  ],
  "Democracy & Electoral Systems": [
    { id: "Cryptographic Voting", desc: "End-to-end verifiable digital elections" },
    { id: "Voter Authentication", desc: "Anonymous yet verified democratic participation" },
  ],
  "Cybersecurity & Digital Economy": [
    { id: "Anti-Fraud Protection", desc: "Cryptographic defense against identity theft" },
    { id: "Zero-Trust Verification", desc: "Secure authentication for critical systems" },
  ],
  "Science & Research Integrity": [
    { id: "Research Attribution", desc: "Tamper-proof credit for scientific contributions" },
    { id: "AI Safety Gates", desc: "Human oversight for high-risk technology releases" },
  ],
  "Education & Global Credentials": [
    { id: "Global Diploma Verification", desc: "Instant worldwide credential authentication" },
    { id: "Skills Portability", desc: "Verified competencies that travel with learners" },
  ],
  "Healthcare & Medical Records": [
    { id: "Medical Record Portability", desc: "Health data follows the patient securely" },
    { id: "Vaccination Credentials", desc: "Prove health status without full record exposure" },
  ],
  "Migration & Humanitarian Aid": [
    { id: "Refugee Identity", desc: "Cryptographically verified identity for stateless persons" },
    { id: "Cross-Border Services", desc: "Portable records across international boundaries" },
  ],
  "Financial Inclusion & Banking": [
    { id: "Reusable KYC", desc: "One-time verification, multiple service access" },
    { id: "Financial Fraud Prevention", desc: "Cryptographic identity verification" },
  ],
  "Social Protection & Benefits": [
    { id: "Duplicate-Free Distribution", desc: "One credential = one benefit allocation" },
    { id: "Community Attestation", desc: "Trusted local vouching for vulnerable populations" },
  ],
  "Supply Chain & Trade Verification": [
    { id: "Product Authenticity", desc: "Cryptographic proof against counterfeiting" },
    { id: "Sustainability Tracking", desc: "Verifiable environmental and ethical sourcing" },
  ],
  "Climate Action & Carbon Markets": [
    { id: "Carbon Credit Verification", desc: "Tamper-proof environmental impact tracking" },
    { id: "Climate Payments", desc: "Direct distribution of environmental dividends" },
  ],
  "Emergency Response & Disaster Relief": [
    { id: "Crisis Aid Routing", desc: "Trusted network-based emergency assistance" },
    { id: "Disaster Payment Systems", desc: "Resilient identity verification during outages" },
  ],
};

export default function MapMobile() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-4">
        Retroactive UBI: <span className="text-fuchsia-400">Interactive Policy Map</span>
      </h1>
      <p className="text-center max-w-md mb-6 text-lg text-slate-300">
        Tap a policy node to reveal concrete <span className="font-semibold">PHC/FPP</span> and <span className="font-semibold">RUBI</span> use-cases.
      </p>

      <div className="w-full max-w-[400px] overflow-x-auto">
        <svg
          viewBox="0 0 400 400"
          width="100%"
          preserveAspectRatio="xMidYMid meet"
          className="mx-auto block select-none"
        >
          {/* Render mobile-specific map elements here */}
          {/* Example: Render core, RUBI, and petals */}
          <circle cx="200" cy="200" r="50" fill="#2a0f1f" />
          <text x="200" y="200" textAnchor="middle" fill="#fff">RUBI</text>
          {/* Add more SVG elements for petals and connections */}
        </svg>
      </div>

      <footer className="mt-8 text-xs text-slate-500 text-center">
        Built with privacy-first identity principles. Questions / collab: <span className="underline">hello@retroactiveubi.com</span>
      </footer>
    </div>
  );
}