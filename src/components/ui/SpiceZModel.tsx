import { Canvas } from '@react-three/fiber';
import { useGLTF, Float, AdaptiveDpr, AdaptiveEvents, BakeShadows } from '@react-three/drei';
import { Suspense, useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

const Model = () => {
    // Model optimization: useMemo for the scene if it's static
    // and ensuring components are lightweight
    const { scene } = useGLTF('/model/spicez.glb', true); // Enable draco if available

    // Optional: Traverse to optimize materials/meshes
    useMemo(() => {
        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                // Ensure frustum culling is on
                child.frustumCulled = true;
            }
        });
    }, [scene]);

    return <primitive object={scene} />;
};

const SpiceZModel = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsInView(entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
            <Canvas
                shadows
                // Performance optimizations
                dpr={[1, 1.5]} // Lowering max DPR for better perf on mobile/retina
                gl={{
                    antialias: false, // Turn off antialias for perf, let DPR handle it
                    alpha: true,
                    powerPreference: "high-performance",
                    stencil: false,
                    depth: true
                }}
                camera={{ fov: 45, position: [0, 0, 8] }}
                style={{ pointerEvents: 'none' }}
                performance={{ min: 0.5 }} // Allow R3F to scale down if perf drops
                frameloop={isInView ? 'always' : 'never'}
            >
                <Suspense fallback={null}>
                    {isInView && (
                        <>
                            <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
                                <Model />
                            </Float>

                            {/* Optimized Lighting - simpler than Stage */}
                            <ambientLight intensity={0.8} />
                            <spotLight position={[5, 5, 5]} angle={0.15} penumbra={1} intensity={1.5} castShadow />
                            <pointLight position={[-5, -5, -5]} intensity={1} />

                            {/* Performance helpers */}
                            <AdaptiveDpr pixelated />
                            <AdaptiveEvents />
                            <BakeShadows />
                        </>
                    )}
                </Suspense>
            </Canvas>
        </div>
    );
};

// Preload the model
useGLTF.preload('/model/spicez.glb');

export default SpiceZModel;
