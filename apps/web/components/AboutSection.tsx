"use client";

import { Float, OrbitControls, Stars, Text } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

const skills = [
  { name: "Java", color: "#E76F00" },
  { name: "Spring", color: "#6DB33F" },
  { name: "Python", color: "#3776AB" },
  { name: "Data Science", color: "#FF6B6B" },
  { name: "AI", color: "#00E5FF" },
  { name: "Backend", color: "#FFD700" },
  { name: "SaaS", color: "#A020F0" },
  { name: "Mobile", color: "#4CAF50" },
  { name: "Database", color: "#F44336" },
  { name: "React", color: "#61DAFB" },
  { name: "Next.js", color: "#FFFFFF" },
  { name: "TypeScript", color: "#3178C6" },
  { name: "Node.js", color: "#339933" },
  { name: "AWS", color: "#FF9900" },
  { name: "Docker", color: "#2496ED" },
  { name: "GraphQL", color: "#E10098" },
  { name: "Three.js", color: "#FFFFFF" },
  { name: "PostgreSQL", color: "#336791" },
  { name: "Redis", color: "#DC382D" },
  { name: "Kubernetes", color: "#326CE5" },
  { name: "Go", color: "#00ADD8" },
  { name: "FastAPI", color: "#009688" },
  { name: "LangChain", color: "#FFFF00" },
  { name: "OpenAI", color: "#10A37F" },
  { name: "Flutter", color: "#02569B" },
  { name: "MongoDB", color: "#47A248" },
  { name: "System Design", color: "#FF4081" }
];

function Word({ children, position, color }: { children: string; position: [number, number, number]; color: string }) {
  const fontUrl = "/fonts/Inter-Bold.woff"; // Fallback or standard font, Text component handles default well usually
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ camera }) => {
    if (ref.current) {
      ref.current.quaternion.copy(camera.quaternion);
      
      // Malzeme tipini kontrol edip uygun şekilde erişim
      const material = ref.current.material;
      const targetColor = new THREE.Color(hovered ? "#ffffff" : color);
      
      // Materyali doğru şekilde işle
      if (Array.isArray(material)) {
        // Dizi içindeki tüm materyalleri işle
        material.forEach(mat => {
          if (mat && (mat as THREE.MeshStandardMaterial).color) {
            (mat as THREE.MeshStandardMaterial).color.lerp(targetColor, 0.1);
          }
        });
      } else {
        // Tek bir materyali işle
        if (material && (material as THREE.MeshStandardMaterial).color) {
          (material as THREE.MeshStandardMaterial).color.lerp(targetColor, 0.1);
        }
      }
    }
  });

  return (
    <Float floatIntensity={2} rotationIntensity={2}>
      <Text
        ref={ref}
        position={position}
        fontSize={1.2} // Increased font size
        color={color}
        anchorX="center"
        anchorY="middle"
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {children}
      </Text>
    </Float>
  );
}

function Cloud({ radius = 20 }) {
  // Create a spherical distribution of words using skills array directly
  const wordsWithPositions = useMemo(() => {
    const temp = [];
    const phiSpan = Math.PI * (3 - Math.sqrt(5)); // Golden angle
    const skillCount = skills.length;

    for (let i = 0; i < skillCount; i++) {
      const y = 1 - (i / (skillCount - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y); // radius at y

      const theta = phiSpan * i; // golden angle increment

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      temp.push({
        position: [x * radius, y * radius, z * radius] as [number, number, number],
        skill: skills[i]
      });
    }
    return temp;
  }, [radius]);

  return (
    <>
      {wordsWithPositions.map((item, i) => {
        // item.skill'in tanımlı olduğundan emin olalım
        if (!item.skill) {
          return null;
        }
        
        return (
          <Word 
            key={i} 
            position={item.position} 
            color={item.skill.color}
          >
            {item.skill.name}
          </Word>
        );
      })}
    </>
  );
}

export default function AboutSection() {
  return (
    <section className="relative w-full min-h-screen py-20 bg-black overflow-hidden flex flex-col lg:flex-row items-center">

      {/* Left: 3D Interactive Scene */}
      <div className="w-full lg:w-1/2 h-[60vh] lg:h-screen relative cursor-move">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 to-purple-900/10 rounded-full blur-3xl -z-10" />
        <Canvas camera={{ position: [0, 0, 35], fov: 90 }}>
          <fog attach="fog" args={['#000000', 20, 60]} />
          <ambientLight intensity={2} />
          <pointLight position={[10, 10, 10]} intensity={2} />
          <Cloud radius={18} />
          <OrbitControls autoRotate autoRotateSpeed={0.5} enableZoom={false} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        </Canvas>

        <div className="absolute bottom-10 left-0 right-0 text-center pointer-events-none">
          <p className="text-white/30 text-sm uppercase tracking-[0.3em] animate-pulse">
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
          <h2 className="text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-600 tracking-tighter mb-8">
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
            <strong className="text-white">Veri Bilimi ve Yapay Zeka</strong> tutkum, karmaşık verilerden anlamlı içgörüler çıkarmamı ve akıllı sistemler tasarlamamı sağlıyor. <strong className="text-white">Java Spring</strong> ve <strong className="text-white">Backend</strong> mimarilerindeki derin tecrübemle, ölçeklenebilir ve güvenli kurumsal çözümler üretiyorum.
          </p>
          <p>
            <strong className="text-white">Mobil Geliştirme</strong> ve <strong className="text-white">SaaS</strong> projelerimle, kullanıcı deneyimini merkeze alan, modern ve hızlı uygulamalar hayata geçiriyorum. Veritabanı optimizasyonundan bulut mimarilerine kadar, teknolojinin her katmanında iz bırakıyorum.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-white/10 mt-12"
        >
          <div className="flex flex-col">
            <span className="text-4xl font-bold text-white mb-1">AI</span>
            <span className="text-xs text-gray-500 uppercase tracking-widest">Solutions</span>
          </div>
          <div className="flex flex-col">
            <span className="text-4xl font-bold text-white mb-1">SaaS</span>
            <span className="text-xs text-gray-500 uppercase tracking-widest">Architecture</span>
          </div>
          <div className="flex flex-col">
            <span className="text-4xl font-bold text-white mb-1">Mobile</span>
            <span className="text-xs text-gray-500 uppercase tracking-widest">Development</span>
          </div>
          <div className="flex flex-col">
            <span className="text-4xl font-bold text-white mb-1">Data</span>
            <span className="text-xs text-gray-500 uppercase tracking-widest">Science</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
