"use client";

import { Float, Line, OrbitControls, PointMaterial, Points, Stars, Text } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { motion } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

// Skill verileri
const skills = [
  { name: "Java", color: "#E76F00" },
  { name: "Spring", color: "#6DB33F" },
  { name: "Python", color: "#3776AB" },
  { name: "Data Science", color: "#FF6B6B" },
  { name: "AI", color: "#f97316" },
  { name: "Backend", color: "#FFD700" },
  { name: "SaaS", color: "#f97316" },
  { name: "Mobile", color: "#4CAF50" },
  { name: "Database", color: "#F44336" },
  { name: "React", color: "#61DAFB" },
  { name: "Next.js", color: "#FFFFFF" },
  { name: "TypeScript", color: "#3178C6" },
  { name: "Node.js", color: "#339933" },
  { name: "AWS", color: "#FF9900" },
  { name: "Docker", color: "#2496ED" },
  { name: "GraphQL", color: "#E10098" },
  { name: "Three.js", color: "#f97316" },
  { name: "PostgreSQL", color: "#336791" },
  { name: "Redis", color: "#DC382D" },
  { name: "Kubernetes", color: "#326CE5" },
  { name: "Go", color: "#00ADD8" },
  { name: "FastAPI", color: "#009688" },
  { name: "LangChain", color: "#fbbf24" },
  { name: "OpenAI", color: "#10A37F" },
  { name: "Flutter", color: "#02569B" },
  { name: "MongoDB", color: "#47A248" },
  { name: "System Design", color: "#f97316" }
];

// Nebula Parçacıkları
function NebulaParticles({ count = 3000 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Spiral galaxy şekli
      const angle = (i / count) * Math.PI * 20;
      const radius = (i / count) * 25 + Math.random() * 5;
      const spiralOffset = Math.sin(angle * 0.5) * 3;

      pos[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 4;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8 + spiralOffset;
      pos[i * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * 4;
    }
    return pos;
  }, [count]);

  const colors = useMemo(() => {
    const cols = new Float32Array(count * 3);
    const color1 = new THREE.Color("#f97316"); // Turuncu
    const color2 = new THREE.Color("#1e293b"); // Koyu slate
    const color3 = new THREE.Color("#fbbf24"); // Amber

    for (let i = 0; i < count; i++) {
      const t = Math.random();
      const color = t < 0.5
        ? color1.clone().lerp(color2, t * 2)
        : color2.clone().lerp(color3, (t - 0.5) * 2);
      cols[i * 3] = color.r;
      cols[i * 3 + 1] = color.g;
      cols[i * 3 + 2] = color.b;
    }
    return cols;
  }, [count]);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial
        vertexColors
        transparent
        size={0.08}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

// Neural Network Bağlantıları
function NeuralConnections() {
  const linesRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  // Skill düğümlerinin pozisyonları
  const nodes = useMemo(() => {
    const temp: [number, number, number][] = [];
    const phiSpan = Math.PI * (3 - Math.sqrt(5));
    const count = skills.length;
    const radius = 12;

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phiSpan * i;
      temp.push([
        Math.cos(theta) * radiusAtY * radius,
        y * radius,
        Math.sin(theta) * radiusAtY * radius
      ]);
    }
    return temp;
  }, []);

  // Bağlantı çizgileri oluştur
  const connections = useMemo(() => {
    const lines: { start: THREE.Vector3; end: THREE.Vector3 }[] = [];

    nodes.forEach((node, i) => {
      // En yakın 3 düğüme bağlan
      const distances = nodes.map((other, j) => ({
        index: j,
        dist: Math.sqrt(
          Math.pow(node[0] - other[0], 2) +
          Math.pow(node[1] - other[1], 2) +
          Math.pow(node[2] - other[2], 2)
        )
      }));

      distances.sort((a, b) => a.dist - b.dist);

      for (let k = 1; k <= 2; k++) {
        const distanceEntry = distances[k];
        // Güvenli erişim: hem distance entry hem de hedef node'un varlığını kontrol et
        if (distanceEntry && distanceEntry.dist < 15) {
          const targetNode = nodes[distanceEntry.index];
          if (targetNode) {
            lines.push({
              start: new THREE.Vector3(...node),
              end: new THREE.Vector3(...targetNode)
            });
          }
        }
      }
    });

    return lines;
  }, [nodes]);

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      linesRef.current.rotation.x = mouse.y * 0.1;
    }
  });

  return (
    <group ref={linesRef}>
      {connections.map((conn, i) => (
        <Line
          key={i}
          points={[conn.start, conn.end]}
          color="#f97316"
          transparent
          opacity={0.15}
          lineWidth={1}
        />
      ))}
    </group>
  );
}

// Skill Düğümleri (Parlayan Küreler)
function SkillNodes() {
  const groupRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  const nodes = useMemo(() => {
    const temp: { position: [number, number, number]; skill: typeof skills[0] }[] = [];
    const phiSpan = Math.PI * (3 - Math.sqrt(5));
    const count = skills.length;
    const radius = 12;

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phiSpan * i;
      const currentSkill = skills[i];
      if (currentSkill) {
        temp.push({
          position: [
            Math.cos(theta) * radiusAtY * radius,
            y * radius,
            Math.sin(theta) * radiusAtY * radius
          ],
          skill: currentSkill
        });
      }
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      groupRef.current.rotation.x = mouse.y * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <SkillNode key={i} position={node.position} skill={node.skill} />
      ))}
    </group>
  );
}

// Tek bir skill düğümü
function SkillNode({ position, skill }: { position: [number, number, number]; skill: { name: string; color: string } }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Pulse efekti
      const scale = hovered ? 1.5 : 1 + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.1;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <Float floatIntensity={0.5} rotationIntensity={0.2}>
      <group position={position}>
        {/* Glow sphere */}
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial
            color={skill.color}
            emissive={skill.color}
            emissiveIntensity={hovered ? 2 : 0.8}
            transparent
            opacity={hovered ? 1 : 0.8}
          />
        </mesh>

        {/* Skill Name */}
        {hovered && (
          <Text
            position={[0, 0.8, 0]}
            fontSize={0.5}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            {skill.name}
          </Text>
        )}
      </group>
    </Float>
  );
}

// Merkez Çekirdek
function CoreSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[2, 1]} />
      <meshStandardMaterial
        color="#1a1a1a"
        wireframe
        emissive="#f97316"
        emissiveIntensity={0.3}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

// Ana 3D Sahne
function NebulaScene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#f97316" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#22d3ee" />

      <fog attach="fog" args={["#000000", 15, 50]} />

      <CoreSphere />
      <NebulaParticles count={800} />
      <NeuralConnections />
      <SkillNodes />
      <Stars radius={80} depth={50} count={1000} factor={3} saturation={0} fade speed={0.5} />

      <OrbitControls
        autoRotate
        autoRotateSpeed={0.3}
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI * 0.7}
        minPolarAngle={Math.PI * 0.3}
      />

      <EffectComposer>
        <Bloom
          luminanceThreshold={0.4}
          luminanceSmoothing={0.9}
          intensity={0.6}
        />
        <Vignette eskil={false} offset={0.1} darkness={0.5} />
      </EffectComposer>
    </>
  );
}

export default function AboutSection() {
  return (
    <section className="relative w-full min-h-screen py-20 bg-black overflow-hidden flex flex-col lg:flex-row items-center">

      {/* Left: 3D Nebula Scene */}
      <div className="w-full lg:w-1/2 h-[60vh] lg:h-screen relative cursor-move">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-900/10 to-amber-900/10 rounded-full blur-3xl -z-10" />
        <Canvas
          camera={{ position: [0, 0, 30], fov: 60 }}
          gl={{ antialias: false, powerPreference: 'high-performance' }}
          dpr={[1, 1.5]}
        >
          <NebulaScene />
        </Canvas>

        <div className="absolute bottom-10 left-0 right-0 text-center pointer-events-none">
          <p className="text-orange-500/50 text-sm uppercase tracking-[0.3em] animate-pulse">
            Keşfetmek için sürükleyin
          </p>
        </div>
      </div>

      {/* Right: Content */}
      <div className="w-full lg:w-1/2 px-6 lg:px-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 tracking-tighter mb-8">
            HAKKIMDA
          </h2>
          <p className="text-2xl text-gray-300 leading-relaxed font-light mb-10">
            Geniş bir teknoloji yelpazesinde uzmanlaşmış, veriden yapay zekaya, backend'den mobile uzanan bir yetenek seti.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-8 text-gray-400 text-lg leading-relaxed"
        >
          <p>
            <strong className="text-orange-400">Veri Bilimi ve Yapay Zeka</strong> tutkum, karmaşık verilerden anlamlı içgörüler çıkarmamı ve akıllı sistemler tasarlamamı sağlıyor. <strong className="text-orange-400">Java Spring</strong> ve <strong className="text-orange-400">Backend</strong> mimarilerindeki derin tecrübemle, ölçeklenebilir ve güvenli kurumsal çözümler üretiyorum.
          </p>
          <p>
            <strong className="text-orange-400">Mobil Geliştirme</strong> ve <strong className="text-orange-400">SaaS</strong> projelerimle, kullanıcı deneyimini merkeze alan, modern ve hızlı uygulamalar hayata geçiriyorum. Veritabanı optimizasyonundan bulut mimarilerine kadar, teknolojinin her katmanında iz bırakıyorum.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-slate-800 mt-12"
        >
          <div className="flex flex-col">
            <span className="text-4xl font-bold text-orange-500 mb-1">AI</span>
            <span className="text-xs text-gray-500 uppercase tracking-widest">Solutions</span>
          </div>
          <div className="flex flex-col">
            <span className="text-4xl font-bold text-orange-500 mb-1">SaaS</span>
            <span className="text-xs text-gray-500 uppercase tracking-widest">Architecture</span>
          </div>
          <div className="flex flex-col">
            <span className="text-4xl font-bold text-orange-500 mb-1">Mobile</span>
            <span className="text-xs text-gray-500 uppercase tracking-widest">Development</span>
          </div>
          <div className="flex flex-col">
            <span className="text-4xl font-bold text-orange-500 mb-1">Data</span>
            <span className="text-xs text-gray-500 uppercase tracking-widest">Science</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
