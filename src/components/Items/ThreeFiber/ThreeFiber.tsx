"use client";

import * as THREE from "three";
import {Item} from "@/components/Items/Item";
import React, {ReactNode, useContext, useRef} from "react";
import {Button, Image as Img} from "react-bootstrap";
import {Canvas, useLoader} from "@react-three/fiber";
import {OrbitControls} from "@react-three/drei";
import {ThreeEvent} from "@react-three/fiber/dist/declarations/src/core/events";
import {PhraseContext} from "@/contexts/PhraseContext";
import {ToastContext} from "@/contexts/ToastContext";

interface BoxProps {
  image: string;
  keyword: string;
}

export const Box: React.FC<BoxProps> = ({image, keyword}) => {
  const ref = useRef<THREE.Mesh>(null!);
  // todo improve texture
  const colorMap = useLoader(THREE.TextureLoader, image);
  const {keywords, setKeywords} = useContext(PhraseContext);
  const {setToast} = useContext(ToastContext);
  const onPointerMove = (event: ThreeEvent<PointerEvent>) => {
    // @ts-ignore
    if (event.camera.position.y < -3 && !keywords.includes(keyword)) {
      // @ts-ignore
      setKeywords([...keywords, keyword].filter((value, index, self) => self.indexOf(value) === index));
      setToast('Bravo ! Vous avez trouvé un mot-clé vous menant vers le trésor !');
    }
  };

  return (
    <mesh position={[0, 0, 0]} ref={ref} scale={2} onPointerMove={onPointerMove}>
      <boxGeometry args={[1, 1, 1]}/>
      <meshStandardMaterial map={colorMap}/>
    </mesh>
  );
}

interface ThreeFiberProps {
  icon: string;
  image: string;
  keyword: string;
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
      <div className="position-relative d-flex flex-column justify-content-center align-items-center w-100 h-100 mw-100 mh-100">
        <Canvas>
          <OrbitControls/>
          <ambientLight intensity={Math.PI / 2} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
          <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
          <Box image={this.options.image} keyword={this.options.keyword}/>
        </Canvas>
      </div>
    );
  }
}
