"use client"

import { Float, Line, OrbitControls, PointMaterial, Points, Stars } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { motion, useScroll } from "framer-motion";
import { useMemo, useRef } from "react";
import * as THREE from "three";

// Deneyim verileri
const experiences = [
  {
    year: "2020 - Günümüz",
    title: "Freelancer",
    role: "Fullstack & AI Developer",
    description: "Global müşteriler için ölçeklenebilir web uygulamaları ve yapay zeka çözümleri geliştiriyorum.",
    tech: ["Python", "React", "Node.js", "AWS", "Docker"],
    color: "#22d3ee"
  },
  {
    year: "2021 - 2023",
    title: "Ares Group",
    role: "Mobile Developer",
    description: "Yüksek performanslı mobil uygulamalar geliştirdim ve kullanıcı deneyimini optimize ettim.",
    tech: ["Kotlin", "Swift", "React Native"],
    color: "#a855f7"
  },
  {
    year: "2025",
    title: "FLO",
    role: "AI Developer",
    description: "Perakende sektöründe yapay zeka destekli tahminleme ve öneri sistemleri üzerine çalışıyorum.",
    tech: ["TensorFlow", "PyTorch", "BigQuery"],
    color: "#f97316"
  },
];

// Orbital Parçacıklar
function OrbitalParticles({ count = 2000 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Spiral şeklinde dağılım
      const angle = (i / count) * Math.PI * 10;
      const radius = 5 + (i / count) * 15;
      const height = (Math.random() - 0.5) * 10;

      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = height;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return pos;
  }, [count]);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#f97316"
        size={0.05}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

// Zaman Noktası 3D
function TimeNode({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position}>
        <octahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          wireframe
        />
      </mesh>
    </Float>
  );
}

// Bağlantı Çizgileri
function ConnectionLines() {
  // Her deneyim noktası için pozisyon hesaplama
  const positions = experiences.map((_, i) => {
    const angle = (i / experiences.length) * Math.PI * 2 - Math.PI / 2;
    const radius = 8;
    return [
      Math.cos(angle) * radius,
      0,
      Math.sin(angle) * radius
    ] as [number, number, number];
  });

  return (
    <group>
      {positions.map((pos, i) => {
        // Son nokta için bağlantı çizme
        if (i === positions.length - 1) return null;
        const nextPos = positions[i + 1];
        if (!nextPos) return null;

        // @react-three/drei Line bileşeni kullanarak çizgi çizme
        return (
          <Line
            key={i}
            points={[pos, nextPos]}
            color="#f97316"
            lineWidth={1}
            transparent
            opacity={0.3}
          />
        );
      })}
    </group>
  );
}

// Ana 3D Sahne
function TimelineScene() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  const nodePositions = experiences.map((exp, i) => {
    const angle = (i / experiences.length) * Math.PI * 2 - Math.PI / 2;
    const radius = 8;
    return {
      position: [
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      ] as [number, number, number],
      color: exp.color
    };
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#f97316" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#22d3ee" />

      <fog attach="fog" args={["#000000", 10, 40]} />

      <group ref={groupRef}>
        {nodePositions.map((node, i) => (
          <TimeNode key={i} position={node.position} color={node.color} />
        ))}
        <ConnectionLines />
      </group>

      <OrbitalParticles count={600} />
      <Stars radius={50} depth={30} count={800} factor={2} saturation={0} fade speed={0.5} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.2}
        maxPolarAngle={Math.PI * 0.6}
        minPolarAngle={Math.PI * 0.4}
      />

      <EffectComposer>
        <Bloom luminanceThreshold={0.4} luminanceSmoothing={0.9} intensity={0.6} />
        <Vignette eskil={false} offset={0.1} darkness={0.4} />
      </EffectComposer>
    </>
  );
}

export default function ExperienceSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  })

  return (
    <section ref={containerRef} className="relative w-full py-40 px-6 bg-black overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 opacity-60">
        <Canvas
          camera={{ position: [0, 15, 20], fov: 50 }}
          gl={{ antialias: false, powerPreference: 'high-performance' }}
          dpr={[1, 1.5]}
        >
          <TimelineScene />
        </Canvas>
      </div>

      {/* Content Overlay */}
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-32"
        >
          <h2 className="text-7xl md:text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-orange-500 via-amber-400 to-orange-500/10 tracking-tighter">
            DENEYİM
          </h2>
          <p className="text-xl text-gray-500 mt-6 max-w-2xl mx-auto">
            Profesyonel yolculuğumun kilometre taşları
          </p>
        </motion.div>

        <div className="relative">
          {/* Central Glowing Line */}
          <motion.div
            style={{ scaleY: scrollYProgress }}
            className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-orange-400 via-amber-500 to-orange-600 origin-top shadow-[0_0_20px_rgba(249,115,22,0.5)] z-0"
          />

          <div className="space-y-32">
            {experiences.map((exp, index) => (
              <TimelineItem key={index} data={exp} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function TimelineItem({ data, index }: { data: typeof experiences[0], index: number }) {
  const isEven = index % 2 === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className={`relative flex flex-col md:flex-row items-center ${isEven ? "md:flex-row-reverse" : ""} gap-10 md:gap-20`}
    >
      {/* Content Card */}
      <div className="flex-1 w-full pl-12 md:pl-0">
        <div className="group relative p-8 rounded-3xl bg-black/50 border border-slate-800 hover:border-orange-500/30 transition-all duration-500 backdrop-blur-xl overflow-hidden">
          {/* Hover Gradient */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
            style={{ background: `linear-gradient(135deg, ${data.color}, transparent)` }}
          />

          <div className="relative z-10">
            <span
              className="inline-block px-4 py-1 rounded-full text-xs font-bold text-white mb-4 shadow-lg"
              style={{ backgroundColor: data.color }}
            >
              {data.year}
            </span>
            <h3 className="text-3xl font-bold text-white mb-1">{data.title}</h3>
            <p className="text-lg text-gray-400 mb-4">{data.role}</p>
            <p className="text-gray-300 leading-relaxed mb-6">{data.description}</p>

            <div className="flex flex-wrap gap-2">
              {data.tech.map((t: string, i: number) => (
                <span key={i} className="px-3 py-1 rounded-md bg-white/5 text-xs text-gray-400 border border-slate-800 hover:border-orange-500/30 transition-colors">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Center Node */}
      <div className="absolute left-[11px] md:left-1/2 w-5 h-5 -translate-x-1/2 z-10">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-full h-full rounded-full border-4 shadow-[0_0_20px_rgba(249,115,22,0.5)]"
          style={{ backgroundColor: "#000", borderColor: data.color }}
        />
      </div>

      {/* Empty Space for alignment */}
      <div className="flex-1 hidden md:block" />
    </motion.div>
  )
}
