import { Canvas } from '@react-three/fiber';
import { useGLTF, Stage, Float } from '@react-three/drei';
import { Suspense } from 'react';

const Model = () => {
    const { scene } = useGLTF('/model/spicez.glb');
    return <primitive object={scene} />;
};

const SpiceZModel = () => {
    return (
        <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
            <Canvas
                shadows
                dpr={[1, 2]}
                camera={{ fov: 45, position: [0, 0, 8] }} // Adjusted camera for better view inside box
                style={{ pointerEvents: 'none' }} // Disable all mouse interactions on canvas
            >
                <Suspense fallback={null}>
                    {/* Floating animation for subtle movement */}
                    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                        <Stage environment={null} intensity={1} contactShadow={false}>
                            <Model />
                        </Stage>
                    </Float>

                    {/* Custom Lighting if Stage isn't enough */}
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={1} />
                </Suspense>
            </Canvas>
        </div>
    );
};

// Preload the model
useGLTF.preload('/model/spicez.glb');

export default SpiceZModel;
