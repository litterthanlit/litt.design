"use client";

import Link from "next/link";
import { startTransition, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Canvas, ThreeEvent, useFrame } from "@react-three/fiber";
import { ContactShadows, OrthographicCamera } from "@react-three/drei";
import * as THREE from "three";
import type { Project } from "@/data/types";

type ProjectAccordionProps = {
  projects: Project[];
};

type SceneProps = {
  activeIndex: number;
  onActivate: (index: number) => void;
  projects: Project[];
  reduceMotion: boolean;
};

type PanelProps = {
  active: boolean;
  index: number;
  project: Project;
  total: number;
  onActivate: (index: number) => void;
  reduceMotion: boolean;
};

const panelGeometry = new THREE.BoxGeometry(0.26, 3.8, 0.08);

function mixHex(hex: string, amount: number) {
  const color = new THREE.Color(hex);
  const white = new THREE.Color("#f6f1e9");
  return color.lerp(white, amount).getHexString();
}

function darkenHex(hex: string, amount: number) {
  const color = new THREE.Color(hex);
  const black = new THREE.Color("#131313");
  return color.lerp(black, amount).getHexString();
}

function buildPalette(project: Project) {
  return [
    `#${mixHex(project.accent, 0.88)}`,
    `#${mixHex(project.accent, 0.72)}`,
    `#${mixHex(project.accent, 0.45)}`,
    `#${darkenHex(project.accent, 0.24)}`,
    `#${mixHex(project.accent, 0.58)}`,
    `#${darkenHex(project.accent, 0.4)}`,
    `#${mixHex(project.accent, 0.8)}`,
    `#${darkenHex(project.accent, 0.66)}`,
  ];
}

function ProjectPanel({
  active,
  index,
  project,
  total,
  onActivate,
  reduceMotion,
}: PanelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const hitboxRef = useRef<THREE.Mesh>(null);
  const sliceRefs = useRef<THREE.Mesh[]>([]);
  const baseX = (index - (total - 1) / 2) * 1.06;
  const palette = buildPalette(project);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) {
      return;
    }

    const targetX = active ? baseX * 1.02 : baseX * 0.92;
    const targetZ = active ? 0.95 : -Math.abs(index - (total - 1) / 2) * 0.1;
    const targetY = active ? 0.18 : -0.05;
    const targetRotY = active ? baseX * -0.06 : baseX * -0.14;
    const targetScaleX = active ? 1.6 : 0.78;
    const targetScaleY = active ? 1.04 : 0.96;
    const lerpFactor = reduceMotion ? 1 : 1 - Math.exp(-delta * 8);

    group.position.x = THREE.MathUtils.lerp(group.position.x, targetX, lerpFactor);
    group.position.y = THREE.MathUtils.lerp(group.position.y, targetY, lerpFactor);
    group.position.z = THREE.MathUtils.lerp(group.position.z, targetZ, lerpFactor);
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, targetRotY, lerpFactor);
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, active ? -0.03 : 0.02, lerpFactor);
    group.scale.x = THREE.MathUtils.lerp(group.scale.x, targetScaleX, lerpFactor);
    group.scale.y = THREE.MathUtils.lerp(group.scale.y, targetScaleY, lerpFactor);

    sliceRefs.current.forEach((slice, sliceIndex) => {
      const centeredIndex = sliceIndex - (sliceRefs.current.length - 1) / 2;
      const targetSliceX = active ? centeredIndex * 0.42 : centeredIndex * 0.17;
      const targetSliceY = active ? Math.abs(centeredIndex) * 0.035 : Math.abs(centeredIndex) * 0.07;
      const targetSliceRotY = active ? centeredIndex * -0.06 : centeredIndex * -0.16;
      const material = slice.material as THREE.MeshPhysicalMaterial;

      slice.position.x = THREE.MathUtils.lerp(slice.position.x, targetSliceX, lerpFactor);
      slice.position.y = THREE.MathUtils.lerp(slice.position.y, -targetSliceY, lerpFactor);
      slice.rotation.y = THREE.MathUtils.lerp(slice.rotation.y, targetSliceRotY, lerpFactor);
      slice.position.z = THREE.MathUtils.lerp(slice.position.z, sliceIndex * 0.02, lerpFactor);
      material.transmission = THREE.MathUtils.lerp(material.transmission, active ? 0.2 : 0.08, lerpFactor);
      material.roughness = THREE.MathUtils.lerp(material.roughness, active ? 0.18 : 0.32, lerpFactor);
      material.thickness = THREE.MathUtils.lerp(material.thickness, active ? 0.6 : 0.3, lerpFactor);
      material.emissiveIntensity = THREE.MathUtils.lerp(
        material.emissiveIntensity,
        active && sliceIndex === 3 ? 0.16 : 0.04,
        lerpFactor,
      );
    });

    if (hitboxRef.current) {
      hitboxRef.current.scale.x = THREE.MathUtils.lerp(hitboxRef.current.scale.x, active ? 2.8 : 1.1, lerpFactor);
      hitboxRef.current.scale.y = THREE.MathUtils.lerp(hitboxRef.current.scale.y, active ? 1.2 : 1, lerpFactor);
    }
  });

  const activate = (event?: ThreeEvent<PointerEvent>) => {
    event?.stopPropagation();
    startTransition(() => onActivate(index));
  };

  return (
    <group ref={groupRef}>
      {palette.map((color, sliceIndex) => (
        <mesh
          key={`${project.slug}-${sliceIndex}`}
          ref={(node) => {
            if (node) {
              sliceRefs.current[sliceIndex] = node;
            }
          }}
          geometry={panelGeometry}
          castShadow
          receiveShadow
          onPointerOver={activate}
          onClick={activate}
        >
          <meshPhysicalMaterial
            color={color}
            transparent
            opacity={0.97}
            roughness={0.24}
            metalness={0.08}
            transmission={0.14}
            thickness={0.4}
            emissive={new THREE.Color(project.accent)}
            emissiveIntensity={0.05}
            clearcoat={1}
            clearcoatRoughness={0.16}
          />
        </mesh>
      ))}
      <mesh ref={hitboxRef} position={[0, 0, 0.1]} onPointerOver={activate} onClick={activate}>
        <planeGeometry args={[1.2, 4.2]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}

function AccordionScene({ activeIndex, onActivate, projects, reduceMotion }: SceneProps) {
  return (
    <>
      <color attach="background" args={["#f3efe8"]} />
      <fog attach="fog" args={["#f3efe8", 9, 18]} />
      <OrthographicCamera makeDefault position={[0, 0.8, 12]} zoom={92} />
      <ambientLight intensity={1.3} />
      <directionalLight
        position={[4, 5, 7]}
        intensity={2.2}
        color="#fff8ef"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-6, -1, 3]} intensity={0.8} color="#efddcf" />
      <group position={[0, -0.15, 0]} rotation={[-0.12, 0.08, 0]}>
        {projects.map((project, index) => (
          <ProjectPanel
            key={project.slug}
            active={index === activeIndex}
            index={index}
            onActivate={onActivate}
            project={project}
            reduceMotion={reduceMotion}
            total={projects.length}
          />
        ))}
      </group>
      <ContactShadows position={[0, -2.35, 0]} opacity={0.34} scale={18} blur={2.4} far={8} />
    </>
  );
}

export function ProjectAccordion({ projects }: ProjectAccordionProps) {
  const [activeIndex, setActiveIndex] = useState(projects[1] ? 1 : 0);
  const reduceMotion = useReducedMotion() ?? false;
  const activeProject = projects[activeIndex] ?? projects[0];

  return (
    <div className="relative overflow-hidden rounded-[2.8rem] border border-line bg-white/50 p-3 shadow-[0_40px_120px_rgba(19,19,19,0.08)] sm:p-4 lg:p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.68),rgba(238,233,225,0.3))]" />
      <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="relative min-h-[26rem] overflow-hidden rounded-[2.2rem] border border-line/80 bg-[#f3efe8] sm:min-h-[32rem] lg:min-h-[35rem]">
          <div className="absolute left-5 top-5 z-10 text-[0.68rem] uppercase tracking-[0.22em] text-muted sm:left-7 sm:top-7">
            Hover to expand
          </div>
          <div className="absolute right-5 top-5 z-10 hidden text-[0.68rem] uppercase tracking-[0.22em] text-muted sm:block">
            Three.js accordion prototype
          </div>
          <div className="absolute inset-x-[12%] bottom-[12%] top-[18%] z-10 hidden lg:grid lg:grid-cols-3 lg:gap-2">
            {projects.map((project, index) => (
              <button
                key={`${project.slug}-hotspot`}
                type="button"
                aria-label={`Preview ${project.title}`}
                className="h-full w-full cursor-pointer rounded-[1.6rem]"
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
          <Canvas dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
            <AccordionScene
              activeIndex={activeIndex}
              onActivate={setActiveIndex}
              projects={projects}
              reduceMotion={reduceMotion}
            />
          </Canvas>
        </div>

        <div className="flex flex-col justify-between gap-4 rounded-[2.2rem] border border-line bg-[#161616] p-5 text-[#f7f1e7] sm:p-6">
          <div className="flex flex-wrap gap-2">
            {projects.map((project, index) => (
              <button
                key={project.slug}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`rounded-full border px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.2em] transition ${
                  index === activeIndex
                    ? "border-white/35 bg-white/10 text-white"
                    : "border-white/12 text-white/52 hover:border-white/22 hover:text-white/86"
                }`}
              >
                {project.title}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeProject.slug}
              initial={reduceMotion ? undefined : { opacity: 0, y: 18, scale: 0.985 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -10, scale: 0.985 }}
              transition={{ type: "spring", stiffness: 180, damping: 24, mass: 0.9 }}
              className="space-y-6"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.68rem] uppercase tracking-[0.22em] text-white/48">
                  <span>{activeProject.category}</span>
                  <span>{activeProject.year}</span>
                  <span>{activeProject.client}</span>
                </div>
                <h2 className="font-display text-[clamp(2.4rem,5vw,4.8rem)] leading-[0.92] tracking-[-0.07em]">
                  {activeProject.title}
                </h2>
                <p className="max-w-lg text-sm leading-7 text-white/72 sm:text-base">
                  {activeProject.oneLineOutcome}
                </p>
              </div>

              <div className="grid gap-3 text-sm text-white/66">
                <div>
                  <p className="mb-2 text-[0.68rem] uppercase tracking-[0.22em] text-white/42">Scope</p>
                  <div className="flex flex-wrap gap-2">
                    {activeProject.services.map((service) => (
                      <span key={service} className="rounded-full border border-white/12 px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.16em] text-white/72">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
                {activeProject.metrics ? (
                  <div className="grid gap-3 sm:grid-cols-3">
                    {activeProject.metrics.map((metric) => (
                      <article key={metric.label} className="rounded-[1.4rem] border border-white/10 bg-white/5 p-3">
                        <p className="font-display text-2xl tracking-[-0.05em] text-white">{metric.value}</p>
                        <p className="mt-1 text-[0.68rem] uppercase tracking-[0.18em] text-white/44">{metric.label}</p>
                      </article>
                    ))}
                  </div>
                ) : null}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
            <p className="text-[0.72rem] uppercase tracking-[0.22em] text-white/46">
              Hover on desktop. Tap on mobile.
            </p>
            <Link
              href={`/work/${activeProject.slug}`}
              className="inline-flex items-center gap-3 rounded-full border border-white/18 px-4 py-2 text-[0.72rem] uppercase tracking-[0.22em] text-white transition hover:border-white/36 hover:bg-white/8"
            >
              Open case study
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
