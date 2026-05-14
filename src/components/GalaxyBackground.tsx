import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, Html, Stars } from '@react-three/drei';
import * as THREE from 'three';

interface PlanetData {
  name: string;
  color: string;
  distance: number;
  speed: number;
  size: number;
  summary: string;
}

const PLANETS: PlanetData[] = [
  { name: 'uddoktaOS', color: '#00F0FF', distance: 3, speed: 0.5, size: 0.3, summary: 'SaaS for entrepreneurs. SME management.' },
  { name: 'sheba link', color: '#6600FF', distance: 4.5, speed: 0.4, size: 0.35, summary: 'Health-tech bridge. Linking doctors, patients, and clinics.' },
  { name: 'glowUp', color: '#FF00A0', distance: 6, speed: 0.3, size: 0.25, summary: 'Lifestyle/Beauty marketplace. Sales and bookings.' },
  { name: 'drivable', color: '#00FF66', distance: 7.5, speed: 0.2, size: 0.4, summary: 'Self-drive rentals. Car rentals for self-drive.' },
  { name: 'banglaPay', color: '#FFD700', distance: 9, speed: 0.15, size: 0.3, summary: 'Fintech/Payment aggregator. Mobile banking.' },
];

const Planet = ({ planet }: { planet: PlanetData }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const angleRef = useRef(Math.random() * Math.PI * 2);

  useFrame((state, delta) => {
    if (groupRef.current) {
      const currentSpeed = hovered ? 0 : planet.speed;
      angleRef.current += delta * currentSpeed;

      const x = Math.cos(angleRef.current) * planet.distance;
      const z = Math.sin(angleRef.current) * planet.distance;
      groupRef.current.position.set(x, 0, z);

      // Counteract perspective scaling
      const dist = state.camera.position.distanceTo(groupRef.current.position);
      const scale = dist / 12.5;
      groupRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group ref={groupRef}>
      <Sphere args={[planet.size, 32, 32]}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
      >
        <meshStandardMaterial color={planet.color} emissive={planet.color} emissiveIntensity={0.5} />
      </Sphere>

      {/* Label always visible, anchored exactly to top edge of planet */}
      <Html center position={[0, planet.size, 0]} zIndexRange={[100, 0]}>
        <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 mb-3 transition-all duration-300 pointer-events-none ${hovered ? 'scale-110' : 'scale-100'}`}>
          <div className="text-white text-sm font-bold whitespace-nowrap drop-shadow-lg bg-black/40 px-2 py-1 rounded backdrop-blur-sm border border-white/10">
            {planet.name}
          </div>
        </div>
      </Html>

      {/* Summary card, anchored exactly to bottom edge of planet */}
      {hovered && (
        <Html center position={[0, -planet.size, 0]} zIndexRange={[100, 0]}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 mt-3 pointer-events-none w-48 p-3 bg-obsidian/80 backdrop-blur-md rounded-xl border border-white/20 text-xs text-gray-300 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <p>{planet.summary}</p>
          </div>
        </Html>
      )}
    </group>
  );
};

const Sun = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.05;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group>
      <Sphere ref={meshRef} args={[1.5, 64, 64]}>
        <meshStandardMaterial color="#ffffff" emissive="#00F0FF" emissiveIntensity={2} toneMapped={false} />
      </Sphere>
    </group>
  );
};

const AsteroidBelt = () => {
  const beltRef = useRef<THREE.Points>(null);
  const streamRef = useRef<THREE.Points>(null);

  useFrame(({ clock }) => {
    if (beltRef.current) {
      beltRef.current.rotation.y = clock.getElapsedTime() * -0.05;
    }
    if (streamRef.current) {
      // Animate data stream points inward
      const positions = streamRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const z = positions[i + 2];
        const dist = Math.sqrt(x * x + z * z);
        
        // Move toward center
        if (dist < 0.5) {
          // Reset to outer edge
          const theta = Math.random() * Math.PI * 2;
          const radius = 12 + Math.random() * 4;
          positions[i] = Math.cos(theta) * radius;
          positions[i + 2] = Math.sin(theta) * radius;
          positions[i + 1] = (Math.random() - 0.5) * 2;
        } else {
          const speed = 0.01 + Math.random() * 0.02;
          positions[i] -= (x / dist) * speed;
          positions[i + 2] -= (z / dist) * speed;
        }
      }
      streamRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const beltParticles = useMemo(() => {
    const temp: number[] = [];
    for (let i = 0; i < 1500; i++) {
      const radius = 12 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      temp.push(Math.cos(theta) * radius, (Math.random() - 0.5) * 1.5, Math.sin(theta) * radius);
    }
    return new Float32Array(temp);
  }, []);

  const streamParticles = useMemo(() => {
    const temp: number[] = [];
    for (let i = 0; i < 500; i++) {
      const radius = 5 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      temp.push(Math.cos(theta) * radius, (Math.random() - 0.5) * 2, Math.sin(theta) * radius);
    }
    return new Float32Array(temp);
  }, []);

  return (
    <group>
      {/* Outer Rotating Belt */}
      <points ref={beltRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[beltParticles, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.03} color="#00F0FF" transparent opacity={0.4} blending={THREE.AdditiveBlending} />
      </points>

      {/* Inward Flowing Data Stream */}
      <points ref={streamRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[streamParticles, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.05} color="#00F0FF" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
      </points>
    </group>
  );
};

const CameraAdjuster = ({ isWarping }: { isWarping: boolean }) => {
  const { camera, size, mouse } = useThree();
  const targetZ = useRef(11);
  const targetY = useRef(6);
  const perspectiveCamera = camera as THREE.PerspectiveCamera;

  useEffect(() => {
    const aspect = size.width / size.height;
    const baseZ = 11;
    const baseY = 6;

    if (aspect < 2.0) {
      const factor = 2.0 / aspect;
      targetZ.current = Math.min(baseZ * factor, 40);
      targetY.current = Math.min(baseY * factor, 20);
    } else {
      targetZ.current = baseZ;
      targetY.current = baseY;
    }
  }, [size]);

  useFrame(() => {
    if (isWarping) {
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, 0, 0.1);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, 1, 0.1);
      perspectiveCamera.fov = THREE.MathUtils.lerp(perspectiveCamera.fov, 150, 0.05);
    } else {
      // Subtle mouse parallax
      const parallaxX = mouse.x * 2;
      const parallaxY = mouse.y * 2;

      camera.position.x = THREE.MathUtils.lerp(camera.position.x, parallaxX, 0.05);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY.current + parallaxY, 0.05);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ.current, 0.05);
      perspectiveCamera.fov = THREE.MathUtils.lerp(perspectiveCamera.fov, 45, 0.1);
    }

    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  });

  return null;
};

export const GalaxyBackground = ({ isWarping = false }: { isWarping?: boolean }) => {
  return (
    <div className="absolute inset-0 z-0 bg-obsidian">
      <Canvas camera={{ position: [0, 6, 11], fov: 45 }}>
        <CameraAdjuster isWarping={isWarping} />
        <color attach="background" args={['#050505']} />
        <ambientLight intensity={0.1} />
        <pointLight position={[0, 0, 0]} intensity={2} color="#00F0FF" distance={20} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

        <group rotation={[0.2, 0, 0]}>
          <Sun />
          <AsteroidBelt />
          {PLANETS.map((planet, index) => (
            <React.Fragment key={index}>
              {/* Orbit Path */}
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[planet.distance - 0.02, planet.distance + 0.02, 64]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.05} side={THREE.DoubleSide} />
              </mesh>
              <Planet planet={planet} />
            </React.Fragment>
          ))}
        </group>
      </Canvas>
    </div>
  );
};
