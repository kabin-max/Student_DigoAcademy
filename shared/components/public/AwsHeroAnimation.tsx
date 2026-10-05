'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line, Float, Points, PointMaterial, Html } from '@react-three/drei';
import * as THREE from 'three';

// ------------------------------------------------------------------
// Types & Data
// ------------------------------------------------------------------
const AWS_SERVICES = [
  { name: 'EC2', image: '/hero/ec2.png', radius: 4.5, speed: 0.3, color: '#3366CC', badge: '1' },
  { name: 'S3', image: '/hero/s3.png', radius: 6.0, speed: 0.25, color: '#FF9900', badge: '2' },
  { name: 'Lambda', image: '/hero/lambda.png', radius: 7.5, speed: 0.2, color: '#8C4FFF', badge: '3' },
  { name: 'ElasticBean', image: '/hero/elasticbean.png', radius: 9.0, speed: 0.15, color: '#E7157B', badge: '4' },
  { name: 'CloudFront', image: '/hero/cloudfront.png', radius: 10.5, speed: 0.1, color: '#00B894', badge: '5' },
];

// ------------------------------------------------------------------
// Components
// ------------------------------------------------------------------

function CentralLogo() {
  return (
    <Html center zIndexRange={[100, 0]}>
      <div className="relative flex items-center justify-center group pointer-events-auto">
        {/* Outer glowing dashed/dotted ring */}
        <div className="absolute w-56 h-56 rounded-full border border-dashed border-cyan-500/40 bg-cyan-900/5 animate-[spin_20s_linear_infinite]" />
        
        {/* Inner solid ring with glow */}
        <div className="absolute w-44 h-44 rounded-full border border-cyan-400/50 shadow-[0_0_40px_rgba(6,182,212,0.4)]" />
        
        {/* Core glow */}
        <div className="absolute w-32 h-32 rounded-full bg-cyan-500/20 blur-2xl" />
        
        {/* Logo */}
        <div className="relative z-10 w-36 h-36 rounded-full bg-[#050505]/60 backdrop-blur-md shadow-2xl border border-white/10 flex items-center justify-center p-4">
          <img 
            src="/AWS.png" 
            alt="Central Logo" 
            className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          />
        </div>
      </div>
    </Html>
  );
}

function ServiceNode({ service, index }: { service: typeof AWS_SERVICES[0]; index: number }) {
  const ref = useRef<THREE.Group>(null);
  
  // Create circular orbit path
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * service.radius, 0, Math.sin(angle) * service.radius));
    }
    return pts;
  }, [service.radius]);

  const offset = (index * (Math.PI * 2)) / AWS_SERVICES.length + (index * 0.5);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime * service.speed + offset;
      ref.current.position.x = Math.cos(t) * service.radius;
      ref.current.position.z = Math.sin(t) * service.radius;
    }
  });

  return (
    <group>
      {/* Orbit Ring */}
      <Line 
        points={points} 
        color="#ffffff" 
        opacity={0.05} 
        transparent 
        lineWidth={1} 
      />
      
      {/* Orbiting Node */}
      <group ref={ref}>
        <Html center zIndexRange={[100, 0]}>
          <div className="relative flex flex-col items-center justify-center pointer-events-auto transition-transform hover:scale-110">
            {/* Dashed outer ring for icon */}
            <div 
              className="absolute -inset-1 rounded-full border border-dashed animate-[spin_8s_linear_infinite]"
              style={{ borderColor: service.color, opacity: 0.7 }}
            />
            
            {/* Glow under icon */}
            <div 
              className="absolute inset-0 rounded-full blur-md"
              style={{ backgroundColor: service.color, opacity: 0.25 }}
            />
            
            {/* Icon Container */}
            <div 
              className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#0f172a]/90 backdrop-blur-sm border border-white/10"
              style={{ boxShadow: `0 0 20px ${service.color}30` }}
            >
              <img 
                src={service.image} 
                alt={service.name}
                className="w-7 h-7 object-contain"
              />
              
              {/* Badge */}
              <div 
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg"
                style={{ backgroundColor: service.color }}
              >
                {service.badge}
              </div>
            </div>
          </div>
        </Html>
      </group>
    </group>
  );
}

// 3. Background Particle System
function ParticleSystem() {
  const count = 300;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 8 + Math.random() * 20;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos((Math.random() * 2) - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count]);

  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.01;
      ref.current.rotation.x = state.clock.elapsedTime * 0.005;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial transparent color="#38bdf8" size={0.03} sizeAttenuation={true} depthWrite={false} opacity={0.3} />
    </Points>
  );
}

// ------------------------------------------------------------------
// Main Component
// ------------------------------------------------------------------
export function AwsHeroAnimation() {
  return (
    <div className="relative w-full h-full min-h-[600px] lg:min-h-[800px] bg-[#020617] overflow-hidden rounded-2xl">
      <Canvas camera={{ position: [0, 8, 14], fov: 60 }} dpr={[1, 2]}>
        <color attach="background" args={['#020617']} />
        
        <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
          {/* Apply a slight tilt so we see the flat orbits in perspective */}
          <group rotation={[-0.3, 0, 0]}>
            <CentralLogo />
            {AWS_SERVICES.map((service, idx) => (
              <ServiceNode key={service.name} service={service} index={idx} />
            ))}
          </group>
        </Float>
        
        <ParticleSystem />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.3} 
          maxPolarAngle={Math.PI / 2 - 0.2}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
      
      {/* Background gradients for depth */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.15)_0%,rgba(2,6,23,0)_70%)]" />
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(2,6,23,1)]" />
    </div>
  );
}
