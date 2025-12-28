"use client";

import { Float, MeshDistortMaterial, PointMaterial, Points, Sphere } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

// Proje verileri
const projects = [
  {
    title: "Assistyl",
    description: "AI-Powered B2B Support Assistant - Yapay zeka destekli müşteri hizmetleri platformu. Otomatik ticket yönetimi, akıllı öneri sistemi ve gerçek zamanlı analitik.",
    image: "/assistlydemo.png",
    tags: ["React", "Node.js", "Sentry", "Clerk", "Convex", "AWS", "Turbo"],
    gradient: "from-cyan-500 to-blue-500",
    color: "#22d3ee",
    link: "#"
  },
  {
    title: "Intria",
    description: "AI-Powered Risk Intelligence Platform - Yapay zeka ile portföy risk analizi, gerçek zamanlı piyasa takibi ve akıllı yatırım önerileri.",
    image: "/intria1.PNG",
    tags: ["Next.js 15", "TypeScript", "Convex", "OpenAI", "Redis", "TurboRepo"],
    gradient: "from-orange-500 to-amber-500",
    color: "#f97316",
    link: "https://intria-web.vercel.app/"
  }
];

// Portal Parçacıkları
function PortalParticles({ color }: { color: string }) {
  const ref = useRef<THREE.Points>(null);
  const count = 200; // Optimized from 500

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 1.5 + Math.random() * 0.5;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.2;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.z += delta * 0.5;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color={color}
        size={0.02}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

// Hologram Ring
function HologramRing({ color, radius, speed }: { color: string; radius: number; speed: number }) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * speed;
    }
  });

  return (
    <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, 0.02, 16, 100]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

// Portal Merkez Küresi
function PortalCore({ color }: { color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere ref={meshRef} args={[0.8, 32, 32]}>
        <MeshDistortMaterial
          color="#0a0a0a"
          emissive={color}
          emissiveIntensity={0.3}
          roughness={0.2}
          metalness={0.8}
          distort={0.2}
          speed={2}
        />
      </Sphere>
    </Float>
  );
}

// Portal 3D Sahne
function PortalScene({ color }: { color: string }) {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={1} color={color} />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color={color} />

      <PortalCore color={color} />
      <PortalParticles color={color} />
      <HologramRing color={color} radius={1.2} speed={0.5} />
      <HologramRing color={color} radius={1.4} speed={-0.3} />
      <HologramRing color={color} radius={1.6} speed={0.2} />

      <EffectComposer>
        <Bloom luminanceThreshold={0.4} luminanceSmoothing={0.9} intensity={0.8} />
        <Vignette eskil={false} offset={0.1} darkness={0.4} />
      </EffectComposer>
    </>
  );
}

// 3D Tilt Hook
function use3DTilt() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  return { x, y, rotateX, rotateY };
}

// Proje Kartı
function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isEven = index % 2 === 0;
  const tilt = use3DTilt();
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    tilt.x.set(xPct);
    tilt.y.set(yPct);
  };

  const handleMouseLeave = () => {
    tilt.x.set(0);
    tilt.y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-16`}
    >
      {/* 3D Hologram Portal Card */}
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => setIsHovered(true)}
        style={{
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
          transformStyle: "preserve-3d"
        }}
        className="w-full lg:w-3/5 relative aspect-video rounded-3xl cursor-pointer group perspective-1000"
      >
        {/* Portal Background */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden">
          <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
            <PortalScene color={project.color} />
          </Canvas>
        </div>

        {/* Glassmorphism Frame */}
        <div className="absolute inset-0 rounded-3xl border border-slate-700/50 bg-black/30 backdrop-blur-sm" />

        {/* Project Image */}
        <div
          style={{ transform: "translateZ(30px)" }}
          className="absolute inset-6 rounded-2xl overflow-hidden shadow-2xl border border-slate-800"
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          {/* Image Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t ${project.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
        </div>

        {/* Floating Project Title */}
        <motion.div
          style={{ transform: "translateZ(50px)" }}
          className={`absolute -bottom-4 ${isEven ? "-right-4" : "-left-4"} px-6 py-3 rounded-2xl bg-gradient-to-r ${project.gradient} text-white font-bold text-lg shadow-xl`}
        >
          {project.title}
        </motion.div>

        {/* Glow Effect */}
        <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500 -z-10 scale-150`} />
      </motion.div>

      {/* Content */}
      <div className="w-full lg:w-2/5 space-y-8">
        <div>
          <h3 className={`text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${project.gradient} mb-4`}>
            {project.title}
          </h3>
          <p className="text-xl text-gray-400 leading-relaxed">
            {project.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {project.tags.map((tag: string, i: number) => (
            <span
              key={i}
              className="px-4 py-2 rounded-full text-sm font-medium bg-white/5 text-gray-300 border border-slate-800 hover:bg-orange-500/10 hover:border-orange-500/30 hover:text-orange-300 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>

        <Link href={project.link}>
          <button className={`group relative px-8 py-4 rounded-full bg-gradient-to-r ${project.gradient} text-white font-bold text-lg overflow-hidden hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] transition-all duration-300`}>
            <span className="relative z-10 flex items-center gap-2">
              Projeyi İncele
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </span>
          </button>
        </Link>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  return (
    <section className="relative w-full py-40 px-6 bg-black overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.1),transparent_50%)]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-32"
        >
          <h2 className="text-7xl md:text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-orange-500 via-amber-400 to-orange-500/10 tracking-tighter">
            PROJELER
          </h2>
          <p className="text-xl text-gray-500 mt-6 max-w-2xl mx-auto">
            Yapay zeka, SaaS ve enterprise çözümlerden oluşan proje portföyüm
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-40">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
