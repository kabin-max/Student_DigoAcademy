'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useAnimationFrame, useMotionValue, useTransform, useSpring, AnimatePresence } from 'motion/react';
import { Container, ShipWheel, Boxes, Code2, Terminal, Activity, Workflow } from 'lucide-react';

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

type Pillar = {
  id: string;
  name: string;
  description: string;
  Icon: React.ElementType;
  color: string;
  bg: string;
  orbit: 'inner' | 'outer';
  startAngle: number;
};

const PILLARS: Pillar[] = [
  // Inner orbit (radius 165)
  { id: 'docker', name: 'Docker', description: 'Containerize applications for seamless deployment.', Icon: Container, color: 'text-blue-400', bg: 'bg-blue-400/10', orbit: 'inner', startAngle: 0 },
  { id: 'k8s', name: 'Kubernetes', description: 'Orchestrate and scale your containerized workloads.', Icon: ShipWheel, color: 'text-blue-500', bg: 'bg-blue-500/10', orbit: 'inner', startAngle: 90 },
  { id: 'terraform', name: 'Terraform', description: 'Infrastructure as Code for automated provisioning.', Icon: Boxes, color: 'text-purple-400', bg: 'bg-purple-400/10', orbit: 'inner', startAngle: 180 },
  { id: 'github', name: 'GitHub', description: 'Version control and CI/CD pipelines.', Icon: GithubIcon, color: 'text-white', bg: 'bg-white/10', orbit: 'inner', startAngle: 270 },
  // Outer orbit (radius 275)
  { id: 'python', name: 'Python', description: 'Versatile scripting and automation language.', Icon: Code2, color: 'text-yellow-400', bg: 'bg-yellow-400/10', orbit: 'outer', startAngle: 0 },
  { id: 'linux', name: 'Linux', description: 'The foundation of modern cloud environments.', Icon: Terminal, color: 'text-slate-300', bg: 'bg-slate-300/10', orbit: 'outer', startAngle: 120 },
  { id: 'argocd', name: 'ArgoCD', description: 'Declarative GitOps continuous delivery tool.', Icon: Workflow, color: 'text-emerald-400', bg: 'bg-emerald-400/10', orbit: 'outer', startAngle: 240 },
];

// Radii fitting within the container size
const INNER_RADIUS = 135; 
const OUTER_RADIUS = 220; 

const OrbitingPillar = ({ 
  pillar, 
  isHovered, 
  setHoveredId 
}: { 
  pillar: Pillar; 
  isHovered: boolean; 
  setHoveredId: (id: string | null) => void;
}) => {
  const radius = pillar.orbit === 'inner' ? INNER_RADIUS : OUTER_RADIUS;
  const speed = pillar.orbit === 'inner' ? 0.35 : 0.20; // rad/s
  const angleRef = useRef((pillar.startAngle * Math.PI) / 180);

  const x = useMotionValue(Math.cos(angleRef.current) * radius);
  const y = useMotionValue(Math.sin(angleRef.current) * radius);

  useAnimationFrame((t, delta) => {
    if (!isHovered) {
      angleRef.current += speed * (delta / 1000);
      x.set(Math.cos(angleRef.current) * radius);
      y.set(Math.sin(angleRef.current) * radius);
    }
  });

  return (
    <motion.div
      style={{ x, y }}
      className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${isHovered ? 'z-50' : 'z-10'}`}
      onMouseEnter={() => setHoveredId(pillar.id)}
      onMouseLeave={() => setHoveredId(null)}
      onFocus={() => setHoveredId(pillar.id)}
      onBlur={() => setHoveredId(null)}
      tabIndex={0}
      aria-label={pillar.name}
    >
      <div className="relative flex items-center justify-center cursor-pointer transition-transform hover:scale-110">
        
        {/* Active Pulse Ring */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 1, 0], scale: [0.8, 1.5, 2] }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
              className={`absolute inset-0 rounded-full border-2 ${pillar.bg.replace('bg-', 'border-').replace('/10', '/50')}`}
            />
          )}
        </AnimatePresence>

        {/* Icon Container */}
        <div className={`relative z-10 w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/20 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.5)] ${pillar.bg}`}>
          <pillar.Icon className={`w-6 h-6 md:w-7 md:h-7 ${pillar.color}`} />
        </div>

        {/* Tooltip */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-48 p-3 rounded-xl border border-white/10 bg-slate-900/90 backdrop-blur-md shadow-2xl pointer-events-none"
            >
              <div className="text-sm font-semibold text-white mb-1">{pillar.name}</div>
              <div className="text-xs text-slate-300 leading-tight">{pillar.description}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export function AwsHeroAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Mouse Parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(useSpring(mouseY, { stiffness: 100, damping: 30 }), [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(useSpring(mouseX, { stiffness: 100, damping: 30 }), [-0.5, 0.5], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div 
      className="relative w-full aspect-square max-w-[640px] flex items-center justify-center mx-auto overflow-visible rounded-full"
      style={{ perspective: 1000 }}
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div 
        className="relative w-full h-full flex items-center justify-center"
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      >
        {/* Background radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15)_0%,transparent_60%)] pointer-events-none rounded-full" />

        {/* Static SVG Orbit Rings */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="-300 -300 600 600">
          <circle 
            cx="0" cy="0" r={INNER_RADIUS} 
            fill="none" 
            stroke="rgba(6, 182, 212, 0.3)" 
            strokeWidth="1.5" 
            strokeDasharray="6 8" 
          />
          <circle 
            cx="0" cy="0" r={OUTER_RADIUS} 
            fill="none" 
            stroke="rgba(99, 102, 241, 0.3)" 
            strokeWidth="1.5" 
            strokeDasharray="6 8" 
          />
        </svg>

        {/* Orbiting Pillars */}
        {PILLARS.map((pillar) => (
          <OrbitingPillar 
            key={pillar.id} 
            pillar={pillar} 
            isHovered={hoveredId === pillar.id}
            setHoveredId={setHoveredId}
          />
        ))}

        {/* Center Logo */}
        <div className="relative z-10 w-28 h-28 md:w-36 md:h-36 rounded-full bg-slate-950/80 backdrop-blur-md shadow-2xl border border-white/10 flex items-center justify-center p-5">
          {/* Pulsing Concentric Rings */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border border-cyan-500/30"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: [1, 1.5, 2], opacity: [0.5, 0.2, 0] }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "linear",
                delay: i * 1,
              }}
            />
          ))}
          
          {/* Core glow */}
          <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-xl md:blur-2xl" />
          
          {/* Inner ring */}
          <div className="absolute -inset-2 rounded-full border border-cyan-400/50 shadow-[0_0_40px_rgba(6,182,212,0.4)]" />
          
          <Image 
            src="/AWS.png" 
            alt="Center Logo" 
            width={100}
            height={100}
            className="relative z-10 w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" 
          />
        </div>
      </motion.div>
    </div>
  );
}
