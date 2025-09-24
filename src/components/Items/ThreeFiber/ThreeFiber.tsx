"use client";

import * as THREE from "three";
import {Item} from "@/components/Items";
import React, {ReactNode, useRef} from "react";
import {Canvas, useLoader} from "@react-three/fiber";
import {OrbitControls} from "@react-three/drei";
import {ThreeEvent} from "@react-three/fiber/dist/declarations/src/core/events";
import {ItemOptionsType} from "@/types/Item";
import {Image as Img} from "react-bootstrap";

type BoxProps = {
  image: string;
  keyword: string;
  onKeywordFounded: (keyword: string) => void;
}

export const Box: React.FC<BoxProps> = ({image, keyword, onKeywordFounded}) => {
  const ref = useRef<THREE.Mesh>(null!);
  // todo improve texture
  const colorMap = useLoader(THREE.TextureLoader, image);
  const onPointerMove = (event: ThreeEvent<PointerEvent>) => {
    // @ts-ignore
    if (event.camera.position.y < -3) {
      onKeywordFounded(keyword);
    }
  };

  return (
    <mesh position={[0, 0, 0]} ref={ref} scale={3} onPointerMove={onPointerMove}>
      <boxGeometry args={[1, 1, 1]}/>
      <meshStandardMaterial map={colorMap}/>
    </mesh>
  );
}

type ThreeFiberProps = {
  image: string;
  keyword: string;
}

export class ThreeFiber extends Item {
  constructor(private options: ThreeFiberProps & ItemOptionsType) {
    super();
  }

  renderImage(): ReactNode {
    return (
      <Img src={this.options.image} className="w-100 mh-100"/>
    );
  }

  render(): ReactNode {
    return (
      <Canvas style={{height: "500px"}}>
        <OrbitControls/>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <Box image={this.options.image} keyword={this.options.keyword} onKeywordFounded={this.options.onKeywordClicked}/>
      </Canvas>
    );
  }
}
