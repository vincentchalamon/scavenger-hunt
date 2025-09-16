"use client";

import * as THREE from "three";
import {Item} from "@/components/Items/Item";
import React, {ReactNode, useRef} from "react";
import {Button, Image as Img} from "react-bootstrap";
import {Canvas, useLoader} from "@react-three/fiber";
import {OrbitControls} from "@react-three/drei";

interface BoxProps {
  image: string;
}

export const Box: React.FC<BoxProps> = ({image}) => {
  const ref = useRef<THREE.Mesh>(null!);
  const colorMap = useLoader(THREE.TextureLoader, image);

  return (
    <mesh position={[0, 0, 0]} ref={ref} scale={2}>
      <boxGeometry args={[1, 1, 1]}/>
      <meshStandardMaterial map={colorMap}/>
    </mesh>
  );
}

interface ThreeFiberProps {
  icon: string;
  image: string;
}

export class ThreeFiber extends Item {
  constructor(private options: ThreeFiberProps) {
    super();
  }

  renderButton(): ReactNode {
    return (
      // @ts-ignore
      <Button variant="link" className="h-100">
        <Img src={this.options.icon} className="w-100 mh-100"/>
      </Button>
    );
  }

  onHide(): void {
  }

  onShow(): void {
  }

  render(): ReactNode {
    return (
      <Canvas>
        <OrbitControls/>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <Box image={this.options.image}/>
      </Canvas>
    );
  }
}
