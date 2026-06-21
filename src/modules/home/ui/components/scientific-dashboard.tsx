"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Cpu,
  Terminal,
  CheckCircle2,
  TrendingUp,
  Flame,
  Gauge,
  Atom,
} from "lucide-react";

interface Node {
  id: string;
  x: number;
  y: number;
  label: string;
  element: string;
  color: string;
  description: string;
}

interface Link {
  source: string;
  target: string;
  bondType: 1 | 2; // single or double bond
}

interface MoleculeData {
  name: string;
  formula: string;
  nodes: Node[];
  links: Link[];
  reactorStats: {
    temp: number;
    pressure: number;
    flowRate: number;
    purity: number;
  };
}

const moleculePresets: Record<number, MoleculeData> = {
  0: {
    name: "Advanced Polymeric Matrix",
    formula: "C₁₂H₂₂O₁₁-Si",
    nodes: [
      { id: "1", x: 100, y: 150, label: "Carbon-1", element: "C", color: "bg-emerald-500", description: "Primary backbone link" },
      { id: "2", x: 180, y: 110, label: "Oxygen-2", element: "O", color: "bg-blue-400", description: "Ester coupling agent" },
      { id: "3", x: 260, y: 150, label: "Carbon-3", element: "C", color: "bg-emerald-500", description: "Secondary branch node" },
      { id: "4", x: 260, y: 230, label: "Silicon-4", element: "Si", color: "bg-purple-400", description: "Crosslinking silicon center" },
      { id: "5", x: 180, y: 270, label: "Carbon-5", element: "C", color: "bg-emerald-500", description: "Ring closure component" },
      { id: "6", x: 100, y: 230, label: "Oxygen-6", element: "O", color: "bg-blue-400", description: "Hydroxide bridge group" },
      { id: "7", x: 340, y: 110, label: "Methyl-7", element: "CH₃", color: "bg-orange-400", description: "Hydrophobic tail modifier" },
    ],
    links: [
      { source: "1", target: "2", bondType: 1 },
      { source: "2", target: "3", bondType: 1 },
      { source: "3", target: "4", bondType: 2 },
      { source: "4", target: "5", bondType: 1 },
      { source: "5", target: "6", bondType: 1 },
      { source: "6", target: "1", bondType: 2 },
      { source: "3", target: "7", bondType: 1 },
    ],
    reactorStats: {
      temp: 245.6,
      pressure: 14.8,
      flowRate: 3.42,
      purity: 99.98,
    },
  },
  1: {
    name: "Industrial Zeolite Lattice",
    formula: "Al₂Si₃O₁₀",
    nodes: [
      { id: "1", x: 180, y: 70, label: "Silicon-1", element: "Si", color: "bg-purple-400", description: "Tetrahedral network base" },
      { id: "2", x: 100, y: 150, label: "Oxygen-2", element: "O", color: "bg-blue-400", description: "Bridging lattice link" },
      { id: "3", x: 260, y: 150, label: "Oxygen-3", element: "O", color: "bg-blue-400", description: "Bridging lattice link" },
      { id: "4", x: 180, y: 230, label: "Aluminum-4", element: "Al", color: "bg-amber-400", description: "Catalytic active site" },
      { id: "5", x: 100, y: 270, label: "Sodium-5", element: "Na", color: "bg-red-400", description: "Charge compensating cation" },
      { id: "6", x: 260, y: 270, label: "Hydroxide-6", element: "OH", color: "bg-emerald-400", description: "Surface Brønsted acid site" },
    ],
    links: [
      { source: "1", target: "2", bondType: 1 },
      { source: "1", target: "3", bondType: 1 },
      { source: "2", target: "4", bondType: 1 },
      { source: "3", target: "4", bondType: 1 },
      { source: "4", target: "5", bondType: 1 },
      { source: "4", target: "6", bondType: 1 },
    ],
    reactorStats: {
      temp: 580.2,
      pressure: 42.1,
      flowRate: 18.9,
      purity: 99.45,
    },
  },
  2: {
    name: "Bio-Synthetic Polycarbonate",
    formula: "C₁₆H₁₈O₃",
    nodes: [
      { id: "1", x: 130, y: 110, label: "Benzene Center", element: "C₆H₄", color: "bg-emerald-500", description: "Aromatic backbone stabilizer" },
      { id: "2", x: 230, y: 110, label: "Carbonyl", element: "C=O", color: "bg-red-500", description: "Carbonate linkage bridge" },
      { id: "3", x: 300, y: 180, label: "Oxygen", element: "O", color: "bg-blue-400", description: "Condensation oxygen link" },
      { id: "4", x: 230, y: 250, label: "Isopropyl", element: "C(CH₃)₂", color: "bg-orange-400", description: "Chain flexibility regulator" },
      { id: "5", x: 130, y: 250, label: "Phenoxy", element: "O-Ph", color: "bg-cyan-400", description: "End-cap inhibitor" },
    ],
    links: [
      { source: "1", target: "2", bondType: 2 },
      { source: "2", target: "3", bondType: 1 },
      { source: "3", target: "4", bondType: 1 },
      { source: "4", target: "5", bondType: 1 },
      { source: "5", target: "1", bondType: 1 },
    ],
    reactorStats: {
      temp: 185.3,
      pressure: 2.8,
      flowRate: 1.15,
      purity: 99.99,
    },
  },
};

interface ScientificDashboardProps {
  slideIndex: number;
}

export const ScientificDashboard: React.FC<ScientificDashboardProps> = ({
  slideIndex,
}) => {
  const [activeTab, setActiveTab] = useState<"molecule" | "synthesis" | "reactor">("molecule");
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [chartData, setChartData] = useState<number[]>([40, 45, 42, 50, 48, 55, 62, 58, 65, 70, 72, 70, 78, 85, 82, 90, 89, 95, 98]);
  const [logs, setLogs] = useState<string[]>([
    "SYS: Reactor diagnostics normal.",
    "INF: Catalysis phase 3 calibration complete.",
    "INF: Initializing molecular synthesis engine...",
  ]);
  const [fluctuatedStats, setFluctuatedStats] = useState({
    temp: 0,
    pressure: 0,
    flowRate: 0,
    purity: 0,
  });

  const molecule = moleculePresets[slideIndex] || moleculePresets[0];

  // Initialize and fluctuate stats
  useEffect(() => {
    setFluctuatedStats({
      temp: molecule.reactorStats.temp,
      pressure: molecule.reactorStats.pressure,
      flowRate: molecule.reactorStats.flowRate,
      purity: molecule.reactorStats.purity,
    });
  }, [molecule]);

  useEffect(() => {
    const timer = setInterval(() => {
      setFluctuatedStats((prev) => {
        const deltaTemp = (Math.random() - 0.5) * 0.4;
        const deltaPress = (Math.random() - 0.5) * 0.1;
        const deltaFlow = (Math.random() - 0.5) * 0.05;
        const deltaPurity = (Math.random() - 0.5) * 0.002;
        return {
          temp: parseFloat((prev.temp + deltaTemp).toFixed(1)),
          pressure: parseFloat((prev.pressure + deltaPress).toFixed(1)),
          flowRate: parseFloat((prev.flowRate + deltaFlow).toFixed(2)),
          purity: Math.min(100, Math.max(90, parseFloat((prev.purity + deltaPurity).toFixed(2)))),
        };
      });

      // Add a simulated log line occasionally
      if (Math.random() > 0.7) {
        const events = [
          "INF: Flow optimization verified.",
          "SYS: Heat exchanger state adjusted.",
          "INF: Compound molecular structure stabilized.",
          "SYS: Reaction yield currently tracking at optimal 94.6%.",
          "INF: Pressure stabilization sub-routine normal.",
        ];
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        const timeStr = new Date().toLocaleTimeString().split(" ")[0];
        setLogs((prev) => [`[${timeStr}] ${randomEvent}`, ...prev.slice(0, 4)]);
      }

      // Add data to synthesis graph
      setChartData((prev) => {
        const nextVal = Math.min(100, Math.max(20, prev[prev.length - 1] + (Math.random() - 0.4) * 6));
        return [...prev.slice(1), parseFloat(nextVal.toFixed(1))];
      });
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto bg-slate-950/90 backdrop-blur-2xl rounded-3xl border border-slate-800/80 shadow-[0_32px_64px_rgba(0,0,0,0.3)] overflow-hidden text-slate-100 font-sans">
      {/* Dashboard Top Header */}
      <div className="bg-slate-900/60 px-6 py-4 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-400">
            Cisco Lab Reactor #042
          </span>
        </div>
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-800/50 bg-slate-950/40 p-1.5 gap-1">
        {/* We cast the array as const so tab.id has literal types matching activeTab */}
        {([
          { id: "molecule", label: "Molecule Spec", icon: Atom },
          { id: "synthesis", label: "Synthesis Graph", icon: TrendingUp },
          { id: "reactor", label: "Reactor Controls", icon: Cpu },
        ] as const).map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold tracking-wide flex items-center justify-center gap-2 transition-all duration-300 ${
                isActive
                  ? "bg-slate-850 text-white border border-slate-800 shadow-lg shadow-black/40"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-emerald-400" : ""}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Tab Area */}
      <div className="h-[280px] p-6 relative overflow-hidden flex flex-col justify-center bg-slate-950/10">
        <AnimatePresence mode="wait">
          {activeTab === "molecule" && (
            <motion.div
              key="molecule"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full flex flex-col justify-between"
            >
              {/* Molecule SVG Grid */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-full h-full max-h-[220px]" viewBox="0 0 400 320">
                  {/* Bonds / Links */}
                  {molecule.links.map((link, idx) => {
                    const src = molecule.nodes.find((n) => n.id === link.source);
                    const tgt = molecule.nodes.find((n) => n.id === link.target);
                    if (!src || !tgt) return null;

                    const isDouble = link.bondType === 2;

                    return (
                      <g key={idx}>
                        {isDouble ? (
                          <>
                            <line
                              x1={src.x - 3}
                              y1={src.y - 3}
                              x2={tgt.x - 3}
                              y2={tgt.y - 3}
                              stroke="#334155"
                              strokeWidth="3"
                              className="stroke-slate-700/60"
                            />
                            <line
                              x1={src.x + 3}
                              y1={src.y + 3}
                              x2={tgt.x + 3}
                              y2={tgt.y + 3}
                              stroke="#10b981"
                              strokeWidth="1.5"
                              className="stroke-emerald-500/40"
                            />
                          </>
                        ) : (
                          <line
                            x1={src.x}
                            y1={src.y}
                            x2={tgt.x}
                            y2={tgt.y}
                            stroke="#334155"
                            strokeWidth="2.5"
                            className="stroke-slate-700"
                          />
                        )}
                      </g>
                    );
                  })}

                  {/* Atoms / Nodes */}
                  {molecule.nodes.map((node) => (
                    <g
                      key={node.id}
                      onMouseEnter={() => setHoveredNode(node)}
                      onMouseLeave={() => setHoveredNode(null)}
                      className="cursor-pointer"
                    >
                      {/* Aura effect on hover */}
                      {hoveredNode?.id === node.id && (
                        <motion.circle
                          cx={node.x}
                          cy={node.y}
                          r="26"
                          fill="rgba(16, 185, 129, 0.15)"
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="18"
                        className="fill-slate-900 stroke-slate-800"
                        strokeWidth="2"
                      />
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="12"
                        className={`${
                          hoveredNode?.id === node.id ? "fill-emerald-500/20" : "fill-transparent"
                        } transition-colors`}
                      />
                      <text
                        x={node.x}
                        y={node.y}
                        dy="4"
                        textAnchor="middle"
                        className="text-[10px] font-black fill-slate-200"
                      >
                        {node.element}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>

              {/* Floating Node Information */}
              <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
                <AnimatePresence>
                  {hoveredNode ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="bg-slate-900/95 border border-slate-800 p-3 rounded-2xl shadow-xl flex flex-col pointer-events-auto"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-white">{hoveredNode.label}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-800 rounded-md text-emerald-400">
                          {hoveredNode.element}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 mt-1 leading-normal font-medium">
                        {hoveredNode.description}
                      </span>
                    </motion.div>
                  ) : (
                    <div className="text-center pb-2">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest animate-pulse">
                        Hover atoms to inspect molecular properties
                      </span>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {activeTab === "synthesis" && (
            <motion.div
              key="synthesis"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full flex flex-col justify-between"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex flex-col">
                  <span className="text-xs font-black text-white">{molecule.name} Synthesis</span>
                  <span className="text-[10px] text-slate-400 font-semibold">Yield output & compound concentration</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-black bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  <Activity className="w-3.5 h-3.5 animate-pulse" />
                  <span>Tracking Live</span>
                </div>
              </div>

              {/* Sparkline Chart */}
              <div className="flex-1 bg-slate-900/30 rounded-2xl border border-slate-900/80 p-4 relative overflow-hidden flex items-end">
                <svg className="w-full h-full max-h-[120px] overflow-visible" viewBox="0 0 400 120">
                  <defs>
                    <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  {[25, 50, 75, 100].map((yVal, index) => (
                    <line
                      key={index}
                      x1="0"
                      y1={120 - yVal}
                      x2="400"
                      y2={120 - yVal}
                      stroke="rgba(51, 65, 85, 0.15)"
                      strokeWidth="1"
                    />
                  ))}

                  {/* Area fill */}
                  <path
                    d={`M 0 120 ${chartData
                      .map((val, idx) => `L ${(idx * 400) / (chartData.length - 1)} ${120 - (val * 100) / 100}`)
                      .join(" ")} L 400 120 Z`}
                    fill="url(#chartGlow)"
                  />

                  {/* Sparkline Path */}
                  <path
                    d={chartData
                      .map((val, idx) => `${idx === 0 ? "M" : "L"} ${(idx * 400) / (chartData.length - 1)} ${120 - (val * 100) / 100}`)
                      .join(" ")}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                  />

                  {/* Dynamic Pointer circle */}
                  <circle
                    cx="400"
                    cy={120 - (chartData[chartData.length - 1] * 100) / 100}
                    r="5"
                    fill="#10b981"
                    className="drop-shadow-[0_0_6px_rgba(16,185,129,0.8)]"
                  />
                </svg>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-3">
                <div className="bg-slate-900/40 p-2.5 rounded-xl border border-slate-900 flex flex-col">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Compounding</span>
                  <span className="text-sm font-black text-white">94.6%</span>
                </div>
                <div className="bg-slate-900/40 p-2.5 rounded-xl border border-slate-900 flex flex-col">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Catalyst Act</span>
                  <span className="text-sm font-black text-white">98.2%</span>
                </div>
                <div className="bg-slate-900/40 p-2.5 rounded-xl border border-slate-900 flex flex-col">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Stabilizer</span>
                  <span className="text-sm font-black text-white">100%</span>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "reactor" && (
            <motion.div
              key="reactor"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-black text-white">Reactor Telemetry</span>
                <p className="text-[10px] text-slate-400 font-semibold mb-3">Live diagnostics from compound reaction chambers</p>
              </div>

              <div className="grid grid-cols-2 gap-3 flex-1">
                {/* Temp */}
                <div className="bg-slate-900/50 p-3 rounded-2xl border border-slate-800/80 flex items-center gap-3">
                  <div className="p-2 bg-red-500/10 rounded-xl border border-red-500/20 text-red-400">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Temperature</span>
                    <span className="text-sm font-black text-slate-200">{fluctuatedStats.temp} °C</span>
                  </div>
                </div>

                {/* Pressure */}
                <div className="bg-slate-900/50 p-3 rounded-2xl border border-slate-800/80 flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400">
                    <Gauge className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Pressure</span>
                    <span className="text-sm font-black text-slate-200">{fluctuatedStats.pressure} bar</span>
                  </div>
                </div>

                {/* Flow Rate */}
                <div className="bg-slate-900/50 p-3 rounded-2xl border border-slate-800/80 flex items-center gap-3">
                  <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Flow Rate</span>
                    <span className="text-sm font-black text-slate-200">{fluctuatedStats.flowRate} L/s</span>
                  </div>
                </div>

                {/* Purity */}
                <div className="bg-slate-900/50 p-3 rounded-2xl border border-slate-800/80 flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">QA Purity</span>
                    <span className="text-sm font-black text-slate-200">{fluctuatedStats.purity}%</span>
                  </div>
                </div>
              </div>

              {/* Status Alert bar */}
              <div className="mt-3 py-2 px-4 bg-emerald-950/20 border border-emerald-900/30 rounded-xl flex items-center justify-between text-[11px] text-emerald-400 font-bold">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Compound synthesis stable</span>
                </div>
                <span>99.9% Yield</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Terminal Log Output */}
      <div className="bg-slate-900/80 border-t border-slate-850 px-6 py-4 flex flex-col font-mono text-[10px] text-slate-400 gap-1 min-h-[96px] justify-end">
        <div className="flex items-center gap-2 mb-1.5 border-b border-slate-800 pb-1.5">
          <Terminal className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-bold uppercase tracking-wider text-slate-500">Live Synthesis Logs</span>
        </div>
        <div className="flex flex-col gap-0.5 max-h-[60px] overflow-hidden">
          {logs.map((log, idx) => (
            <div key={idx} className="truncate">
              <span className={log.includes("SYS:") ? "text-blue-400" : log.includes("WRN:") ? "text-amber-400" : "text-slate-400"}>
                {log}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
