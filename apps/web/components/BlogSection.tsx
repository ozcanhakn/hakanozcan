"use client";

import { Float, PointMaterial, Points, Stars } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

// Blog interface
interface Blog {
  id: string;
  title: string;
  slug: string;
  summary: string;
  thumbnail: string;
  created_at: string;
  category?: string;
}

// Floating Parçacıklar
function FloatingParticles({ count = 1000 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, [count]);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.01;
      ref.current.rotation.x += delta * 0.005;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#f97316"
        size={0.03}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

// Floating Küpler
function FloatingCubes() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  const cubes = useMemo(() => {
    const positions: [number, number, number][] = [];
    for (let i = 0; i < 15; i++) {
      positions.push([
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15
      ]);
    }
    return positions;
  }, []);

  return (
    <group ref={groupRef}>
      {cubes.map((pos, i) => (
        <Float key={i} speed={1 + Math.random()} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh position={pos} scale={0.3 + Math.random() * 0.3}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
              color="#1a1a1a"
              wireframe
              emissive="#f97316"
              emissiveIntensity={0.3}
              transparent
              opacity={0.5}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

// Blog 3D Sahne
function BlogScene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#f97316" />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#22d3ee" />

      <fog attach="fog" args={["#000000", 10, 50]} />

      <FloatingParticles count={400} />
      <FloatingCubes />
      <Stars radius={60} depth={40} count={600} factor={2} saturation={0} fade speed={0.3} />

      <EffectComposer>
        <Bloom luminanceThreshold={0.4} luminanceSmoothing={0.9} intensity={0.5} />
        <Vignette eskil={false} offset={0.1} darkness={0.3} />
      </EffectComposer>
    </>
  );
}

// 3D Tilt Kart Hook
function use3DTilt() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  return { x, y, rotateX, rotateY };
}

// Blog Kartı
function BlogCard({ blog, index, isLarge }: { blog: Blog; index: number; isLarge: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const tilt = use3DTilt();

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
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: tilt.rotateX,
        rotateY: tilt.rotateY,
        transformStyle: "preserve-3d"
      }}
      className={`group relative ${isLarge ? "md:col-span-8 md:row-span-2" : "md:col-span-4"} perspective-1000`}
    >
      <Link href={`/blog/${blog.slug}`} className="block h-full">
        <div className="relative w-full h-full min-h-[300px] rounded-3xl overflow-hidden border border-slate-800 hover:border-orange-500/30 transition-all duration-500">
          {/* Image */}
          <Image
            src={blog.thumbnail}
            alt={blog.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-500" />

          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Content */}
          <div
            style={{ transform: "translateZ(30px)" }}
            className="absolute bottom-0 left-0 p-8 w-full"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-white">
                {blog.category || "Teknoloji"}
              </span>
              <span className="text-xs text-gray-400 font-medium">
                {new Date(blog.created_at).toLocaleDateString("tr-TR", { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            <h3 className={`font-bold text-white mb-2 group-hover:text-orange-400 transition-colors duration-300 ${isLarge ? "text-3xl md:text-5xl" : "text-xl md:text-2xl"}`}>
              {blog.title}
            </h3>

            {isLarge && (
              <p className="text-gray-300 text-lg line-clamp-2 max-w-2xl">
                {blog.summary}
              </p>
            )}
          </div>

          {/* Floating Arrow */}
          <motion.div
            style={{ transform: "translateZ(40px)" }}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/20"
          >
            <span className="text-white text-xl">→</span>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function BlogSection() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_SUPABASE_API_URL;
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!apiUrl || !anonKey) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${apiUrl}/rest/v1/blogs?select=*&order=created_at.desc&limit=3`,
          {
            headers: {
              apikey: anonKey,
              Authorization: `Bearer ${anonKey}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        setBlogs(Array.isArray(data) ? data : []);
      } catch {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const displayedBlogs = blogs.slice(0, 3);

  return (
    <section className="relative w-full py-40 px-6 bg-black overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 opacity-40">
        <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
          <BlogScene />
        </Canvas>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row justify-between items-end mb-20 gap-10"
        >
          <div>
            <h2 className="text-7xl md:text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-orange-500 via-amber-400 to-orange-500/10 tracking-tighter">
              BLOG
            </h2>
            <p className="text-gray-400 text-xl mt-4 max-w-md">
              Teknoloji, tasarım ve gelecek üzerine düşünceler.
            </p>
          </div>

          <Link href="/blog">
            <button className="group flex items-center gap-3 px-6 py-3 rounded-full border border-slate-800 hover:border-orange-500/50 hover:bg-orange-500/10 transition-all duration-300">
              <span className="text-white font-medium group-hover:text-orange-400 transition-colors">Tüm Yazıları Gör</span>
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-orange-500"
              >
                →
              </motion.span>
            </button>
          </Link>
        </motion.div>

        {isLoading ? (
          <div className="text-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-gray-500 text-lg">Blog yazıları yükleniyor...</p>
          </div>
        ) : displayedBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {displayedBlogs.map((blog, index) => (
              <BlogCard key={blog.id} blog={blog} index={index} isLarge={index === 0} />
            ))}
          </div>
        ) : hasError ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-orange-500 text-2xl">!</span>
            </div>
            <p className="text-gray-500 text-lg">Blog yazıları şu an yüklenemiyor.</p>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-500 text-2xl">📝</span>
            </div>
            <p className="text-gray-500 text-lg">Henüz blog yazısı bulunmuyor.</p>
          </div>
        )}
      </div>
    </section>
  );
}