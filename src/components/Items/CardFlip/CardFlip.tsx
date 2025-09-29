"use client";

import React, {useState} from "react";
import {Button, Image as Img} from "react-bootstrap";
import {ReactCardFlip} from "./ReactCardFlip";

export type CardFlipProps = {
  front: string;
  back: string;
}

export const CardFlipButton: React.FC<CardFlipProps> = ({front}) => (
  <Img src={front} className="w-100 mh-100"/>
);

export const CardFlip: React.FC<CardFlipProps> = ({front, back}) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div style={{maxWidth: "95%", maxHeight: "95%", boxShadow: "0 0 20px black", border: "thin solid #555"}} className="bg-secondary-subtle">
      <ReactCardFlip isFlipped={flipped} flipDirection="horizontal">
        <div className="mh-100 mw-100">
          {/*@ts-ignore*/}
          <Button variant="link" onClick={() => setFlipped(!flipped)} className="p-0 m-0 w-100 h-100">
            <Img src={front} className="w-100 mh-100"/>
          </Button>
        </div>

        <div className="mh-100 mw-100">
          <Button variant="link" onClick={() => setFlipped(!flipped)} className="p-0 m-0 w-100 h-100">
            <Img src={back} className="w-100 mh-100"/>
          </Button>
        </div>
      </ReactCardFlip>
    </div>
  );
}
