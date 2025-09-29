"use client";

import React from "react";
import {Image as Img} from "react-bootstrap";

export type ImageProps = {
  image: string;
}

export const ImageButton: React.FC<ImageProps> = ({image}) => (
  <Img src={image} className="w-100 mh-100"/>
);

export const Image: React.FC<ImageProps> = ({image}) => (
  <div style={{maxWidth: "95%", maxHeight: "95%", boxShadow: "0 0 20px black", border: "thin solid #555"}} className="bg-secondary-subtle">
    <Img src={image} className="w-100 mh-100"/>
  </div>
);
