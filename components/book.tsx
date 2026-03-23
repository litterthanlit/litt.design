"use client";

import { useRef, useMemo, useState, useCallback, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Project } from "@/data/types";

type BookProps = {
  project: Project;
  index: number;
  total: number;
  isHovered: boolean;
  anyHovered: boolean;
  onHover: (index: number | null) => void;
  onClick: (slug: string) => void;
  reduceMotion: boolean;
};

function useGradientTexture(cssGradient: string, width = 512, height = 720) {
  return useMemo(() => {
    if (typeof document === "undefined") return null;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const colorsMatch = cssGradient.match(
      /(?:rgba?\([^)]+\)|#[0-9a-fA-F]{3,8})\s*(?:\d+%)?/g
    );
    if (!colorsMatch || colorsMatch.length < 2) {
      ctx.fillStyle = "#888";
      ctx.fillRect(0, 0, width, height);
    } else {
      const gradient = ctx.createLinearGradient(0, 0, width * 0.4, height);
      colorsMatch.forEach((stop, i) => {
        const percentMatch = stop.match(/(\d+)%/);
        const colorPart = stop.replace(/\s*\d+%\s*$/, "").trim();
        const offset = percentMatch
          ? parseInt(percentMatch[1], 10) / 100
          : i / (colorsMatch.length - 1);
        try {
          ctx.fillStyle = colorPart;
          gradient.addColorStop(offset, colorPart);
        } catch {
          gradient.addColorStop(offset, "#888");
        }
      });
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, [cssGradient, width, height]);
}

const BOOK_WIDTH = 2.2;
const BOOK_HEIGHT = 3.2;
const BOOK_DEPTH = 0.15;

export function Book({
  project,
  index,
  total,
  isHovered,
  anyHovered,
  onHover,
  onClick,
  reduceMotion,
}: BookProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hoverCursor, setHoverCursor] = useState(false);

  const coverTexture = useGradientTexture(project.coverMedia.background);
  const spineColor = useMemo(() => {
    const c = new THREE.Color(project.accent);
    c.lerp(new THREE.Color("#0a0a0a"), 0.35);
    return c;
  }, [project.accent]);

  const materials = useMemo(() => {
    const offWhite = new THREE.MeshStandardMaterial({
      color: "#F2F1EE",
      roughness: 0.8,
    });
    const spine = new THREE.MeshStandardMaterial({
      color: spineColor,
      roughness: 0.6,
    });
    const cover = new THREE.MeshStandardMaterial({
      map: coverTexture,
      roughness: 0.7,
    });
    return [offWhite, spine, offWhite, offWhite, cover, offWhite];
  }, [coverTexture, spineColor]);

  const centerOffset = index - (total - 1) / 2;
  const baseRotY = centerOffset * -0.22;
  const baseX = centerOffset * (BOOK_WIDTH + 0.3);
  const baseY = 0;
  const baseZ = -Math.abs(centerOffset) * 0.15;

  const target = useRef({
    x: baseX,
    y: baseY,
    z: baseZ,
    rotY: baseRotY,
    brightness: 1,
  });

  useEffect(() => {
    if (isHovered) {
      target.current = {
        x: baseX,
        y: 0.3,
        z: 0.6,
        rotY: 0,
        brightness: 1,
      };
    } else if (anyHovered) {
      target.current = {
        x: baseX,
        y: baseY,
        z: baseZ,
        rotY: baseRotY,
        brightness: 0.65,
      };
    } else {
      target.current = {
        x: baseX,
        y: baseY,
        z: baseZ,
        rotY: baseRotY,
        brightness: 0.88,
      };
    }
  }, [isHovered, anyHovered, baseX, baseY, baseZ, baseRotY]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const t = target.current;
    const speed = reduceMotion ? 1 : 1 - Math.exp(-delta * 8);

    group.position.x = THREE.MathUtils.lerp(group.position.x, t.x, speed);
    group.position.y = THREE.MathUtils.lerp(group.position.y, t.y, speed);
    group.position.z = THREE.MathUtils.lerp(group.position.z, t.z, speed);
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, t.rotY, speed);

    const targetOpacity = isHovered ? 1 : anyHovered ? 0.55 : 0.88;
    materials.forEach((mat) => {
      mat.transparent = true;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, speed);
    });
  });

  useEffect(() => {
    if (hoverCursor) {
      document.body.style.cursor = "pointer";
    }
    return () => {
      if (hoverCursor) {
        document.body.style.cursor = "";
      }
    };
  }, [hoverCursor]);

  const handlePointerOver = useCallback(() => {
    onHover(index);
    setHoverCursor(true);
  }, [index, onHover]);

  const handlePointerOut = useCallback(() => {
    onHover(null);
    setHoverCursor(false);
  }, [onHover]);

  const handleClick = useCallback(() => {
    onClick(project.slug);
  }, [onClick, project.slug]);

  return (
    <group ref={groupRef} position={[baseX, baseY, baseZ]} rotation={[0, baseRotY, 0]}>
      <mesh
        material={materials}
        castShadow
        receiveShadow
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <boxGeometry args={[BOOK_WIDTH, BOOK_HEIGHT, BOOK_DEPTH]} />
      </mesh>
    </group>
  );
}
