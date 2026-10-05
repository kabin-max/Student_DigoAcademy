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
  iconScale?: number;
};

const PILLARS: Pillar[] = [
  // Inner orbit: AWS Cloud Services
  { id: 'aws-ec2', name: 'AWS EC2', description: 'Scalable cloud compute capacity.', imageUrl: 'https://awsfundamentals.com/assets/aws-icons/Arch_Amazon-EC2_64.svg', color: 'text-[#FF9900]', bg: 'bg-[#FF9900]/10', orbit: 'inner', startAngle: 0 },
  { id: 'aws-s3', name: 'AWS S3', description: 'Secure, durable, and scalable object storage.', imageUrl: 'https://awsfundamentals.com/assets/aws-icons/Arch_Amazon-Simple-Storage-Service_64.svg', color: 'text-[#3F8624]', bg: 'bg-[#3F8624]/10', orbit: 'inner', startAngle: 90 },
  { id: 'aws-lambda', name: 'AWS Lambda', description: 'Event-driven, serverless computing.', imageUrl: 'https://awsfundamentals.com/assets/aws-icons/Arch_AWS-Lambda_64.svg', color: 'text-[#D13212]', bg: 'bg-[#D13212]/10', orbit: 'inner', startAngle: 180 },
  { id: 'aws-vpc', name: 'AWS VPC', description: 'Isolated cloud resources and networking.', imageUrl: 'https://awsfundamentals.com/assets/aws-icons/Arch_Amazon-Virtual-Private-Cloud_64.svg', color: 'text-[#00A1C9]', bg: 'bg-[#00A1C9]/10', orbit: 'inner', startAngle: 270 },

  // Outer orbit: DevOps Tools
  { id: 'docker', name: 'Docker', description: 'Containerize and isolate applications.', imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg', color: 'text-[#2496ED]', bg: 'bg-[#2496ED]/10', orbit: 'outer', startAngle: 0, iconScale: 1.5 },
  { id: 'k8s', name: 'Kubernetes', description: 'Automate deployment and scaling.', imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kubernetes/kubernetes-plain.svg', color: 'text-[#326CE5]', bg: 'bg-[#326CE5]/10', orbit: 'outer', startAngle: 60 },
  { id: 'terraform', name: 'Terraform', description: 'Infrastructure as Code for the cloud.', imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/terraform/terraform-original.svg', color: 'text-[#7B42BC]', bg: 'bg-[#7B42BC]/10', orbit: 'outer', startAngle: 120 },
  { id: 'gitlab', name: 'GitLab / CI/CD', description: 'Version control and CI/CD pipelines.', imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/gitlab/gitlab-original.svg', color: 'text-[#FC6D26]', bg: 'bg-[#FC6D26]/10', orbit: 'outer', startAngle: 180 },
  { id: 'jenkins', name: 'Jenkins', description: 'Continuous integration server.', imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jenkins/jenkins-original.svg', color: 'text-[#D33833]', bg: 'bg-[#D33833]/10', orbit: 'outer', startAngle: 240 },
  { id: 'codepipeline', name: 'CodePipeline', description: 'Continuous delivery service.', imageUrl: 'https://awsfundamentals.com/assets/aws-icons/Arch_AWS-CodePipeline_64.svg', color: 'text-[#D13212]', bg: 'bg-[#D13212]/10', orbit: 'outer', startAngle: 300 },
];

// Radii fitting within the container size
const INNER_RADIUS = 135;
const OUTER_RADIUS = 220;

const OrbitingPillar = ({
  pillar,
  isHovered,
  isPaused,
  setHoveredId
}: {
  pillar: Pillar;
  isHovered: boolean;
  isPaused: boolean;
  setHoveredId: (id: string | null) => void;
}) => {
  const radius = pillar.orbit === 'inner' ? INNER_RADIUS : OUTER_RADIUS;
  const speed = pillar.orbit === 'inner' ? 0.35 : 0.20; // rad/s
  const angle = useMotionValue((pillar.startAngle * Math.PI) / 180);

  const x = useTransform(angle, (a) => Math.cos(a) * radius);
  const y = useTransform(angle, (a) => Math.sin(a) * radius);

  useAnimationFrame((t, delta) => {
    if (!isPaused) {
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
        <div className={`relative z-10 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pillar.imageUrl}
            alt={pillar.name}
            className="w-8 h-8 md:w-10 md:h-10 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
            style={{ transform: `scale(${pillar.iconScale || 1})` }}
          />
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
            isPaused={hoveredId !== null}
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

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 304 182"
            className="relative z-10 w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          >
            <g>
              <path
                fill="#FFFFFF"
                d="M86.4,66.4c0,3.7,0.4,6.7,1.1,8.9c0.8,2.2,1.8,4.6,3.2,7.2c0.5,0.8,0.7,1.6,0.7,2.3c0,1-0.6,2-1.9,3l-6.3,4.2 c-0.9,0.6-1.8,0.9-2.6,0.9c-1,0-2-0.5-3-1.4C76.2,90,75,88.4,74,86.8c-1-1.7-2-3.6-3.1-5.9c-7.8,9.2-17.6,13.8-29.4,13.8 c-8.4,0-15.1-2.4-20-7.2c-4.9-4.8-7.4-11.2-7.4-19.2c0-8.5,3-15.4,9.1-20.6c6.1-5.2,14.2-7.8,24.5-7.8c3.4,0,6.9,0.3,10.6,0.8 c3.7,0.5,7.5,1.3,11.5,2.2v-7.3c0-7.6-1.6-12.9-4.7-16c-3.2-3.1-8.6-4.6-16.3-4.6c-3.5,0-7.1,0.4-10.8,1.3c-3.7,0.9-7.3,2-10.8,3.4 c-1.6,0.7-2.8,1.1-3.5,1.3c-0.7,0.2-1.2,0.3-1.6,0.3c-1.4,0-2.1-1-2.1-3.1v-4.9c0-1.6,0.2-2.8,0.7-3.5c0.5-0.7,1.4-1.4,2.8-2.1 c3.5-1.8,7.7-3.3,12.6-4.5c4.9-1.3,10.1-1.9,15.6-1.9c11.9,0,20.6,2.7,26.2,8.1c5.5,5.4,8.3,13.6,8.3,24.6V66.4z M45.8,81.6 c3.3,0,6.7-0.6,10.3-1.8c3.6-1.2,6.8-3.4,9.5-6.4c1.6-1.9,2.8-4,3.4-6.4c0.6-2.4,1-5.3,1-8.7v-4.2c-2.9-0.7-6-1.3-9.2-1.7 c-3.2-0.4-6.3-0.6-9.4-0.6c-6.7,0-11.6,1.3-14.9,4c-3.3,2.7-4.9,6.5-4.9,11.5c0,4.7,1.2,8.2,3.7,10.6 C37.7,80.4,41.2,81.6,45.8,81.6z M126.1,92.4c-1.8,0-3-0.3-3.8-1c-0.8-0.6-1.5-2-2.1-3.9L96.7,10.2c-0.6-2-0.9-3.3-0.9-4 c0-1.6,0.8-2.5,2.4-2.5h9.8c1.9,0,3.2,0.3,3.9,1c0.8,0.6,1.4,2,2,3.9l16.8,66.2l15.6-66.2c0.5-2,1.1-3.3,1.9-3.9c0.8-0.6,2.2-1,4-1 h8c1.9,0,3.2,0.3,4,1c0.8,0.6,1.5,2,1.9,3.9l15.8,67l17.3-67c0.6-2,1.3-3.3,2-3.9c0.8-0.6,2.1-1,3.9-1h9.3c1.6,0,2.5,0.8,2.5,2.5 c0,0.5-0.1,1-0.2,1.6c-0.1,0.6-0.3,1.4-0.7,2.5l-24.1,77.3c-0.6,2-1.3,3.3-2.1,3.9c-0.8,0.6-2.1,1-3.8,1h-8.6c-1.9,0-3.2-0.3-4-1 c-0.8-0.7-1.5-2-1.9-4L156,23l-15.4,64.4c-0.5,2-1.1,3.3-1.9,4c-0.8,0.7-2.2,1-4,1H126.1z M254.6,95.1c-5.2,0-10.4-0.6-15.4-1.8 c-5-1.2-8.9-2.5-11.5-4c-1.6-0.9-2.7-1.9-3.1-2.8c-0.4-0.9-0.6-1.9-0.6-2.8v-5.1c0-2.1,0.8-3.1,2.3-3.1c0.6,0,1.2,0.1,1.8,0.3 c0.6,0.2,1.5,0.6,2.5,1c3.4,1.5,7.1,2.7,11,3.5c4,0.8,7.9,1.2,11.9,1.2c6.3,0,11.2-1.1,14.6-3.3c3.4-2.2,5.2-5.4,5.2-9.5 c0-2.8-0.9-5.1-2.7-7c-1.8-1.9-5.2-3.6-10.1-5.2L246,52c-7.3-2.3-12.7-5.7-16-10.2c-3.3-4.4-5-9.3-5-14.5c0-4.2,0.9-7.9,2.7-11.1 c1.8-3.2,4.2-6,7.2-8.2c3-2.3,6.4-4,10.4-5.2c4-1.2,8.2-1.7,12.6-1.7c2.2,0,4.5,0.1,6.7,0.4c2.3,0.3,4.4,0.7,6.5,1.1 c2,0.5,3.9,1,5.7,1.6c1.8,0.6,3.2,1.2,4.2,1.8c1.4,0.8,2.4,1.6,3,2.5c0.6,0.8,0.9,1.9,0.9,3.3v4.7c0,2.1-0.8,3.2-2.3,3.2 c-0.8,0-2.1-0.4-3.8-1.2c-5.7-2.6-12.1-3.9-19.2-3.9c-5.7,0-10.2,0.9-13.3,2.8c-3.1,1.9-4.7,4.8-4.7,8.9c0,2.8,1,5.2,3,7.1 c2,1.9,5.7,3.8,11,5.5l14.2,4.5c7.2,2.3,12.4,5.5,15.5,9.6c3.1,4.1,4.6,8.8,4.6,14c0,4.3-0.9,8.2-2.6,11.6 c-1.8,3.4-4.2,6.4-7.3,8.8c-3.1,2.5-6.8,4.3-11.1,5.6C264.4,94.4,259.7,95.1,254.6,95.1z"
              />
              <g>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  fill="#FF9900"
                  d="M273.5,143.7c-32.9,24.3-80.7,37.2-121.8,37.2c-57.6,0-109.5-21.3-148.7-56.7c-3.1-2.8-0.3-6.6,3.4-4.4 c42.4,24.6,94.7,39.5,148.8,39.5c36.5,0,76.6-7.6,113.5-23.2C274.2,133.6,278.9,139.7,273.5,143.7z"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  fill="#FF9900"
                  d="M287.2,128.1c-4.2-5.4-27.8-2.6-38.5-1.3c-3.2,0.4-3.7-2.4-0.8-4.5c18.8-13.2,49.7-9.4,53.3-5 c3.6,4.5-1,35.4-18.6,50.2c-2.7,2.3-5.3,1.1-4.1-1.9C282.5,155.7,291.4,133.4,287.2,128.1z"
                />
              </g>
            </g>
          </svg>
        </div>
      </motion.div>
    </div>
  );
}
