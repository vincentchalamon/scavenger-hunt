"use client";

import * as THREE from "three";
import {Item} from "@/components/Items";
import React, {ReactNode, useRef} from "react";
import {Canvas, useLoader} from "@react-three/fiber";
import {OrbitControls} from "@react-three/drei";
import {ThreeEvent} from "@react-three/fiber/dist/declarations/src/core/events";
import {ItemOptionsType} from "@/types/Item";
import {Image as Img} from "react-bootstrap";
import {useKeyword} from "@/contexts/PhraseContext";

type CubeProps = {
  textures: string[];
  keyword: string;
  onKeywordFounded: () => void;
}

export const Cube: React.FC<CubeProps> = ({textures, onKeywordFounded}) => {
  const ref = useRef<THREE.Mesh>(null!);
  const [right, left, top, bottom, front, background] = useLoader(THREE.TextureLoader, textures);
  const onPointerMove = (event: ThreeEvent<PointerEvent>) => {
    // @ts-ignore
    if (event.camera.position.y < -3) {
      onKeywordFounded();
    }
  };

  return (
    <mesh position={[0, 0, 0]} ref={ref} scale={3} onPointerMove={onPointerMove}>
      <boxGeometry args={[1, 1, 1]}/>
      <meshBasicMaterial map={right} attach="material-0"/>
      <meshBasicMaterial map={left} attach="material-1"/>
      <meshBasicMaterial map={top} attach="material-2"/>
      <meshBasicMaterial map={bottom} attach="material-3"/>
      <meshBasicMaterial map={front} attach="material-4"/>
      <meshBasicMaterial map={background} attach="material-5"/>
    </mesh>
  );
}

type ThreeFiberProps = ItemOptionsType & {
  image: string;
  keyword: string;
  textures: string[];
}

export class ThreeFiber extends Item {
  constructor(private options: ThreeFiberProps) {
    super();
  }

  renderImage(): ReactNode {
    return (
      <Img src={this.options.image} className="w-100 mh-100"/>
    );
  }

  render(): ReactNode {
    return (
      <Component textures={this.options.textures} keyword={this.options.keyword}/>
    );
  }
}

export const Component: React.FC<Omit<ThreeFiberProps, "image">> = ({textures, keyword}) => {
  const {addKeyword} = useKeyword();

  return (
    <Canvas style={{height: "500px"}}>
      <OrbitControls/>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <Cube textures={textures} keyword={keyword} onKeywordFounded={() => addKeyword(keyword)}/>
    </Canvas>
  );
}
