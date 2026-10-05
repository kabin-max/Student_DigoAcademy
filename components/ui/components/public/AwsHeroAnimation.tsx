'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useAnimationFrame, useMotionValue, useTransform, useSpring, AnimatePresence } from 'motion/react';

type Pillar = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  color: string;
  bg: string;
  orbit: 'inner' | 'outer';
  startAngle: number;
};

const PILLARS: Pillar[] = [
  // Inner orbit: AWS Cloud Services
  { id: 'aws-ec2', name: 'AWS EC2', description: 'Scalable cloud compute capacity.', imageUrl: 'https://awsfundamentals.com/assets/aws-icons/Arch_Amazon-EC2_64.svg', color: 'text-[#FF9900]', bg: 'bg-[#FF9900]/10', orbit: 'inner', startAngle: 0 },
  { id: 'aws-s3', name: 'AWS S3', description: 'Secure, durable, and scalable object storage.', imageUrl: 'https://awsfundamentals.com/assets/aws-icons/Arch_Amazon-Simple-Storage-Service_64.svg', color: 'text-[#3F8624]', bg: 'bg-[#3F8624]/10', orbit: 'inner', startAngle: 90 },
  { id: 'aws-lambda', name: 'AWS Lambda', description: 'Event-driven, serverless computing.', imageUrl: 'https://awsfundamentals.com/assets/aws-icons/Arch_AWS-Lambda_64.svg', color: 'text-[#D13212]', bg: 'bg-[#D13212]/10', orbit: 'inner', startAngle: 180 },
  { id: 'aws-vpc', name: 'AWS VPC', description: 'Isolated cloud resources and networking.', imageUrl: 'https://awsfundamentals.com/assets/aws-icons/Arch_Amazon-Virtual-Private-Cloud_64.svg', color: 'text-[#00A1C9]', bg: 'bg-[#00A1C9]/10', orbit: 'inner', startAngle: 270 },
  
  // Outer orbit: DevOps Tools
  { id: 'docker', name: 'Docker', description: 'Containerize and isolate applications.', imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg', color: 'text-[#2496ED]', bg: 'bg-[#2496ED]/10', orbit: 'outer', startAngle: 45 },
  { id: 'k8s', name: 'Kubernetes', description: 'Automate deployment and scaling.', imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kubernetes/kubernetes-plain.svg', color: 'text-[#326CE5]', bg: 'bg-[#326CE5]/10', orbit: 'outer', startAngle: 135 },
  { id: 'terraform', name: 'Terraform', description: 'Infrastructure as Code for the cloud.', imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/terraform/terraform-original.svg', color: 'text-[#7B42BC]', bg: 'bg-[#7B42BC]/10', orbit: 'outer', startAngle: 225 },
  { id: 'gitlab', name: 'GitLab / CI/CD', description: 'Version control and CI/CD pipelines.', imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/gitlab/gitlab-original.svg', color: 'text-[#FC6D26]', bg: 'bg-[#FC6D26]/10', orbit: 'outer', startAngle: 315 },
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
  const angle = useMotionValue((pillar.startAngle * Math.PI) / 180);

  const x = useTransform(angle, (a) => Math.cos(a) * radius);
  const y = useTransform(angle, (a) => Math.sin(a) * radius);

  useAnimationFrame((t, delta) => {
    if (!isHovered) {
      angle.set(angle.get() + speed * (delta / 1000));
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={pillar.imageUrl} alt={pillar.name} className="w-6 h-6 md:w-8 md:h-8 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
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

        {/* Static SVG Orbit Rings sized exactly to the radii */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
          <svg className="absolute" width={INNER_RADIUS * 2} height={INNER_RADIUS * 2} viewBox={`-${INNER_RADIUS} -${INNER_RADIUS} ${INNER_RADIUS * 2} ${INNER_RADIUS * 2}`}>
            <circle 
              cx="0" cy="0" r={INNER_RADIUS - 1} 
              fill="none" 
              stroke="rgba(6, 182, 212, 0.3)" 
              strokeWidth="1.5" 
              strokeDasharray="6 8" 
            />
          </svg>
          <svg className="absolute" width={OUTER_RADIUS * 2} height={OUTER_RADIUS * 2} viewBox={`-${OUTER_RADIUS} -${OUTER_RADIUS} ${OUTER_RADIUS * 2} ${OUTER_RADIUS * 2}`}>
            <circle 
              cx="0" cy="0" r={OUTER_RADIUS - 1} 
              fill="none" 
              stroke="rgba(99, 102, 241, 0.3)" 
              strokeWidth="1.5" 
              strokeDasharray="6 8" 
            />
          </svg>
        </div>

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
