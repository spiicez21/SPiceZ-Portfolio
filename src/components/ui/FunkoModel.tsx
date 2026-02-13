import { Suspense, useRef, memo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import type { Group } from 'three';
import TopographicBackground from './TopographicBackground';
import './FunkoModel.css';

const MODEL_PATH = '/fonko-spz/fonk-spz.glb';

const Model = () => {
    const { scene } = useGLTF(MODEL_PATH);
    const groupRef = useRef<Group>(null);

    useFrame(({ clock }) => {
        if (groupRef.current) {
            groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 1.5) * 0.15;
        }
    });

    return (
        <group ref={groupRef} scale={2.2}>
            <primitive object={scene} />
        </group>
    );
};

const RotatingLights = () => {
    const lightsRef = useRef<Group>(null);

    useFrame(({ clock }) => {
        if (lightsRef.current) {
            lightsRef.current.rotation.y = clock.getElapsedTime() * 0.4;
        }
    });

    return (
        <group ref={lightsRef}>
            {/* Key light */}
            <directionalLight
                position={[4, 4, 5]}
                intensity={5}
                castShadow
                shadow-mapSize-width={512}
                shadow-mapSize-height={512}
            />
            {/* Fill light */}
            <directionalLight position={[-4, 2, 4]} intensity={3} />
            {/* Rim light */}
            <spotLight position={[0, 3, -5]} intensity={4} penumbra={0.6} angle={0.5} color="#b2ff05" />
        </group>
    );
};

const FunkoModel = memo(() => {
    return (
        <div className="funko-model-wrapper">
            <div className="funko-model-header">
                <span className="funko-model-label">3D VIEWPORT</span>
                <span className="funko-model-status">LIVE</span>
            </div>
            <div className="funko-model-canvas">
                <div className="funko-contour-bg">
                    <TopographicBackground lineColor="#b2ff05" />
                </div>
                <Canvas
                    camera={{ position: [0, 1, 4], fov: 45 }}
                    gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
                    dpr={[1, 1.5]}
                    frameloop="always"
                    performance={{ min: 0.5 }}
                >
                    <RotatingLights />

                    {/* Back light */}
                    <spotLight position={[0, 2, -5]} intensity={4} penumbra={0.5} angle={0.6} color="#b2ff05" />

                    {/* Left side light */}
                    <directionalLight position={[-5, 2, 0]} intensity={3} color="#ffffff" />

                    {/* Ambient fill (stays static) */}
                    <ambientLight intensity={0.8} />

                    <Suspense fallback={null}>
                        <Model />
                        <ContactShadows
                            position={[0, -1, 0]}
                            opacity={0.4}
                            scale={6}
                            blur={2}
                            far={4}
                            frames={1}
                        />
                        <Environment
                            files="/HDR/syferfontein_1d_clear_puresky_1k.hdr"
                            background={false}
                            environmentIntensity={2.5}
                        />
                    </Suspense>

                    <OrbitControls enableZoom={false} enablePan={false} />
                </Canvas>
            </div>
            <div className="funko-model-footer">
                <span>DRAG TO ROTATE</span>
                <span className="funko-model-dot" />
                <span>FONKO-SPZ.GLB</span>
            </div>
        </div>
    );
});

// Preload on module load
useGLTF.preload(MODEL_PATH);

export default FunkoModel;
