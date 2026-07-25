import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Hero 3D 背景：Agent 环状粒子带（design.md §6.3 / home.md S1）
 * ~900 微粒 torus（半径 3.2，厚度 0.5），语义五色循环着色；
 * +200 游离粒子；60s/圈极慢旋转；鼠标视差；加载淡入。
 */

// 粒子颜色不随主题变化（亮色守恒例外，light-mode.md §3.7）
const SEMANTIC_COLORS = ["#38BDF8", "#FBBF24", "#A78BFA", "#34D399", "#F472B6"];

function makePositions(count: number, ring: boolean) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const color = new THREE.Color();
  for (let i = 0; i < count; i++) {
    if (ring) {
      // 环带：torus 主半径 3.2，管厚度 0.5
      const theta = Math.random() * Math.PI * 2;
      const r = 3.2 + (Math.random() - 0.5) * 0.5;
      const tube = (Math.random() - 0.5) * 0.5;
      positions[i * 3] = Math.cos(theta) * r;
      positions[i * 3 + 1] = tube;
      positions[i * 3 + 2] = Math.sin(theta) * r;
    } else {
      // 游离粒子：环内外球状漂浮
      const rad = 1.2 + Math.random() * 4.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = rad * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = rad * Math.cos(phi) * 0.6;
      positions[i * 3 + 2] = rad * Math.sin(phi) * Math.sin(theta);
    }
    color.set(SEMANTIC_COLORS[i % SEMANTIC_COLORS.length]);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }
  return { positions, colors };
}

function ParticleCloud({
  count,
  ring,
  size,
  opacity,
}: {
  count: number;
  ring: boolean;
  size: number;
  opacity: number;
}) {
  const ref = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);
  const { positions, colors } = useMemo(() => makePositions(count, ring), [count, ring]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // 加载淡入（1.2s）
    if (matRef.current) {
      matRef.current.opacity = Math.min(opacity, (t / 1.2) * opacity);
    }
    if (ref.current) {
      const s = 0.8 + 0.2 * Math.min(1, t / 1.2);
      ref.current.scale.setScalar(s);
    }
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        size={size}
        vertexColors
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

function RingGroup({ isMobile }: { isMobile: boolean }) {
  const group = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const ringCount = isMobile ? 450 : 900;
  const freeCount = isMobile ? 100 : 200;

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    // 60s/圈极慢旋转
    if (spin.current) spin.current.rotation.y += delta * ((Math.PI * 2) / 60);
    if (group.current) {
      // 鼠标视差（lerp 平滑）
      const px = state.pointer.x * 0.35;
      const py = state.pointer.y * 0.25;
      group.current.position.x += (px - group.current.position.x) * 0.05;
      group.current.position.y += (py - group.current.position.y) * 0.05;
      // 环轻微呼吸浮动
      group.current.rotation.z = Math.sin(t * 0.1) * 0.04;
    }
  });

  return (
    <group ref={group} rotation={[1.05, 0, 0]}>
      <group ref={spin}>
        <ParticleCloud count={ringCount} ring size={0.045} opacity={0.85} />
        <ParticleCloud count={freeCount} ring={false} size={0.03} opacity={0.5} />
      </group>
    </group>
  );
}

export default function ParticleRing() {
  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 768 : false;
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced) {
    // 降级：静态 SVG 居中 40% 透明度
    return (
      <img
        src="/diagram-agent-loop.svg"
        alt=""
        className="absolute left-1/2 top-1/2 w-[min(90vw,900px)] -translate-x-1/2 -translate-y-1/2 opacity-40"
      />
    );
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 6.5], fov: 50 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      <RingGroup isMobile={isMobile} />
    </Canvas>
  );
}
