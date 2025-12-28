"use client";

import { Float, PointMaterial, Points, Stars } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
// @ts-ignore
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

// Mouse pozisyonunu takip eden hook
function useMousePosition() {
    const mouse = useRef({ x: 0, y: 0 });

    if (typeof window !== "undefined") {
        window.addEventListener("mousemove", (e) => {
            mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });
    }

    return mouse;
}

// Interaktif parçacık sistemi
function InteractiveParticles({ count = 3000 }: { count?: number }) {
    const ref = useRef<THREE.Points>(null);
    const { mouse } = useThree();

    // Parçacık pozisyonları
    const [positions] = useState(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 2 + Math.random() * 2;

            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = r * Math.cos(phi);
        }
        return pos;
    });

    // Orijinal pozisyonları kaydet
    const originalPositions = useMemo(() => new Float32Array(positions), [positions]);

    useFrame((state, delta) => {
        if (!ref.current) return;

        const positionAttr = ref.current.geometry.attributes.position;
        if (!positionAttr) return;

        const time = state.clock.elapsedTime;
        const positionArray = positionAttr.array as Float32Array;

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            // Orijinal pozisyon - undefined kontrolü
            const ox = originalPositions[i3] ?? 0;
            const oy = originalPositions[i3 + 1] ?? 0;
            const oz = originalPositions[i3 + 2] ?? 0;

            // Noise bazlı hareket
            const noise = Math.sin(time * 0.5 + i * 0.01) * 0.1;

            // Mouse etkileşimi
            const dx = mouse.x * 2 - ox;
            const dy = mouse.y * 2 - oy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const influence = Math.max(0, 1 - dist / 3) * 0.3;

            positionArray[i3] = ox + noise + dx * influence;
            positionArray[i3 + 1] = oy + noise + dy * influence;
            positionArray[i3 + 2] = oz + Math.sin(time + i * 0.1) * 0.05;
        }

        positionAttr.needsUpdate = true;
        ref.current.rotation.y += delta * 0.02;
    });

    return (
        <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#f97316"
                size={0.015}
                sizeAttenuation
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </Points>
    );
}

// Karadelik (Black Hole) - Grok AI Style
function BlackHole() {
    const groupRef = useRef<THREE.Group>(null);
    const diskRef = useRef<THREE.Mesh>(null);
    const innerDiskRef = useRef<THREE.Mesh>(null);
    const { mouse } = useThree();

    useFrame((state) => {
        if (!groupRef.current) return;

        const time = state.clock.elapsedTime;

        // Yavaş genel dönüş
        groupRef.current.rotation.y = time * 0.1;

        // Mouse etkileşimi - hafif eğim
        groupRef.current.rotation.x = -0.3 + mouse.y * 0.1;
        groupRef.current.rotation.z = mouse.x * 0.05;

        // Accretion disk dönüşü
        if (diskRef.current) {
            diskRef.current.rotation.z = time * 0.5;
        }
        if (innerDiskRef.current) {
            innerDiskRef.current.rotation.z = -time * 0.8;
        }
    });

    return (
        <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.3}>
            <group ref={groupRef} position={[0, 0, 0]}>

                {/* Merkez Karadelik (Event Horizon) */}
                <mesh>
                    <sphereGeometry args={[0.5, 64, 64]} />
                    <meshStandardMaterial
                        color="#000000"
                        roughness={1}
                        metalness={0}
                    />
                </mesh>

                {/* İç Glow Ring - Metalik Siyah */}
                <mesh>
                    <ringGeometry args={[0.52, 0.6, 64]} />
                    <meshStandardMaterial
                        color="#334155"
                        emissive="#1e293b"
                        emissiveIntensity={1}
                        transparent
                        opacity={0.9}
                        side={THREE.DoubleSide}
                    />
                </mesh>

                {/* Accretion Disk - Dış - Parlak Siyah */}
                <mesh ref={diskRef} rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[1.2, 0.15, 16, 100]} />
                    <meshStandardMaterial
                        color="#1f2937"
                        emissive="#374151"
                        emissiveIntensity={0.8}
                        transparent
                        opacity={0.85}
                    />
                </mesh>

                {/* Accretion Disk - Orta - Koyu Gri */}
                <mesh ref={innerDiskRef} rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[0.9, 0.1, 16, 80]} />
                    <meshStandardMaterial
                        color="#27272a"
                        emissive="#3f3f46"
                        emissiveIntensity={1}
                        transparent
                        opacity={0.8}
                    />
                </mesh>

                {/* Gravitasyonel Lens Efekti - Üst halka - Slate */}
                <mesh rotation={[0, 0, 0]}>
                    <torusGeometry args={[0.7, 0.02, 16, 100]} />
                    <meshStandardMaterial
                        color="#475569"
                        emissive="#64748b"
                        emissiveIntensity={1.5}
                        transparent
                        opacity={0.7}
                    />
                </mesh>

                {/* Photon Sphere */}
                <mesh>
                    <sphereGeometry args={[0.75, 32, 32]} />
                    <meshStandardMaterial
                        color="#0a0a0a"
                        transparent
                        opacity={0.4}
                        wireframe
                    />
                </mesh>

                {/* Dış Glow Halkası - Koyu */}
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[1.5, 2.0, 64]} />
                    <meshStandardMaterial
                        color="#1e293b"
                        emissive="#334155"
                        emissiveIntensity={0.3}
                        transparent
                        opacity={0.2}
                        side={THREE.DoubleSide}
                    />
                </mesh>

                {/* Çekilmekte olan parçacıklar */}
                <AccretionParticles />
            </group>
        </Float>
    );
}

// Karadeliğe çekilen parçacıklar
function AccretionParticles() {
    const ref = useRef<THREE.Points>(null);
    const count = 500;

    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 0.8 + Math.random() * 1.5;
            pos[i * 3] = Math.cos(angle) * radius;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 0.3;
            pos[i * 3 + 2] = Math.sin(angle) * radius;
        }
        return pos;
    }, []);

    useFrame((state) => {
        if (!ref.current) return;

        const positionAttr = ref.current.geometry.attributes.position;
        if (!positionAttr) return;

        const time = state.clock.elapsedTime;
        const posArray = positionAttr.array as Float32Array;

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const x = posArray[i3] ?? 0;
            const z = posArray[i3 + 2] ?? 0;

            const angle = Math.atan2(z, x);
            const radius = Math.sqrt(x * x + z * z);

            // Spirale çekiliş
            const newAngle = angle + 0.02;
            const newRadius = radius - 0.005;

            if (newRadius < 0.6) {
                // Yeniden başlat
                const resetRadius = 1.5 + Math.random() * 0.8;
                posArray[i3] = Math.cos(newAngle) * resetRadius;
                posArray[i3 + 2] = Math.sin(newAngle) * resetRadius;
            } else {
                posArray[i3] = Math.cos(newAngle) * newRadius;
                posArray[i3 + 2] = Math.sin(newAngle) * newRadius;
            }

            // Y ekseni salınımı
            posArray[i3 + 1] = Math.sin(time * 2 + i * 0.1) * 0.1;
        }

        positionAttr.needsUpdate = true;
    });

    return (
        <Points ref={ref} positions={positions} stride={3}>
            <PointMaterial
                transparent
                color="#fbbf24"
                size={0.03}
                sizeAttenuation
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </Points>
    );
}



// İkinci morphing geometri - torus
function MorphingTorus() {
    const meshRef = useRef<THREE.Mesh>(null);
    const { mouse } = useThree();

    useFrame((state, delta) => {
        if (!meshRef.current) return;

        const time = state.clock.elapsedTime;

        meshRef.current.rotation.x = time * 0.1;
        meshRef.current.rotation.y = time * 0.15;

        // Mouse etkileşimi
        meshRef.current.position.x = mouse.x * 0.5;
        meshRef.current.position.y = mouse.y * 0.5;
    });

    return (
        <Float speed={1.5} rotationIntensity={1} floatIntensity={0.8}>
            <mesh ref={meshRef} position={[2, 1, -2]} scale={0.5}>
                <torusGeometry args={[1, 0.3, 16, 50]} />
                <meshStandardMaterial
                    color="#0ea5e9"
                    wireframe
                    transparent
                    opacity={0.4}
                    emissive="#06b6d4"
                    emissiveIntensity={0.2}
                />
            </mesh>
        </Float>
    );
}

// Üçüncü geometri - octahedron
function FloatingOctahedron() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!meshRef.current) return;

        const time = state.clock.elapsedTime;
        meshRef.current.rotation.x = time * 0.2;
        meshRef.current.rotation.z = time * 0.15;
        meshRef.current.position.y = Math.sin(time * 0.5) * 0.3;
    });

    return (
        <Float speed={2} rotationIntensity={1.5} floatIntensity={1}>
            <mesh ref={meshRef} position={[-2.5, -0.5, -1.5]} scale={0.4}>
                <octahedronGeometry args={[1, 0]} />
                <meshStandardMaterial
                    color="#f43f5e"
                    wireframe
                    transparent
                    opacity={0.5}
                    emissive="#fb7185"
                    emissiveIntensity={0.3}
                />
            </mesh>
        </Float>
    );
}

// Parçacık halkaları
function ParticleRings() {
    const ref = useRef<THREE.Points>(null);

    const positions = useMemo(() => {
        const count = 1000;
        const pos = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const radius = 3 + Math.random() * 0.5;

            pos[i * 3] = Math.cos(angle) * radius;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 0.2;
            pos[i * 3 + 2] = Math.sin(angle) * radius;
        }

        return pos;
    }, []);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.y += delta * 0.1;
            ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
        }
    });

    return (
        <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#c084fc"
                size={0.02}
                sizeAttenuation
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </Points>
    );
}

// Animasyonlu yıldızlar
function AnimatedStars() {
    const ref = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 30;
            ref.current.rotation.y -= delta / 40;
        }
    });

    return (
        <group ref={ref}>
            <Stars radius={80} depth={60} count={3000} factor={3} saturation={0.5} fade speed={0.5} />
        </group>
    );
}

// Ana sahne
function Scene() {
    return (
        <>
            {/* Işıklar */}
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#f97316" />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#06b6d4" />
            <spotLight position={[0, 10, 0]} intensity={0.8} color="#f97316" angle={0.3} />

            {/* Fog */}
            <fog attach="fog" args={["#000", 3, 15]} />

            {/* Ana objeler */}
            <BlackHole />
            <MorphingTorus />
            <FloatingOctahedron />

            {/* Parçacıklar - Optimize */}
            <InteractiveParticles count={1000} />
            <ParticleRings />
            <AnimatedStars />

            {/* Post-processing - Hafifletildi */}
            <EffectComposer>
                <Bloom
                    luminanceThreshold={0.4}
                    luminanceSmoothing={0.9}
                    intensity={0.8}
                />
                <Vignette eskil={false} offset={0.1} darkness={0.6} />
            </EffectComposer>
        </>
    );
}

export default function ThreeScene() {
    return (
        <div className="w-full h-full absolute inset-0">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 60 }}
                gl={{
                    antialias: false,
                    alpha: true,
                    powerPreference: 'high-performance',
                    stencil: false,
                    depth: true
                }}
                dpr={[1, 1.5]}
                frameloop="demand"
            >
                <Scene />
            </Canvas>
        </div>
    );
}
