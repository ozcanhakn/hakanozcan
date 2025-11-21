"use client"

import { Float, PointMaterial, Points, Stars } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import { Bloom, EffectComposer } from "@react-three/postprocessing"
// @ts-ignore
import * as random from "maath/random/dist/maath-random.esm"
import { useRef, useState } from "react"

function ParticleField(props: any) {
    const ref = useRef<any>(null)
    // 5000 points * 3 coordinates (x, y, z) = 15000
    const [sphere] = useState(() => random.inSphere(new Float32Array(15000), { radius: 1.5 }))

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10
            ref.current.rotation.y -= delta / 15

            // Mouse interaction
            const x = state.mouse.x * 0.2
            const y = state.mouse.y * 0.2
            ref.current.rotation.x += (y - ref.current.rotation.x) * delta
            ref.current.rotation.y += (x - ref.current.rotation.y) * delta
        }
    })

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#ffa0e0"
                    size={0.005}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    )
}

function AnimatedStars() {
    const ref = useRef<any>(null)
    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 20
            ref.current.rotation.y -= delta / 20
        }
    })
    return (
        <group ref={ref}>
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        </group>
    )
}

export default function ThreeScene() {
    return (
        <div className="w-full h-full absolute inset-0">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <fog attach="fog" args={['#000', 1, 10]} />
                <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                    <ParticleField />
                </Float>
                <AnimatedStars />
                <EffectComposer>
                    <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} intensity={0.5} />
                </EffectComposer>
            </Canvas>
        </div>
    )
}
