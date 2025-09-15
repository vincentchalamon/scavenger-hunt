"use client";

import {Container} from "react-bootstrap";
import React from "react";
import {Phrase} from "@/components/Manuscript/Phrase";

interface ManuscriptProps {
  manuscript: string;
  phrase: string;
}

export const Manuscript: React.FC<ManuscriptProps> = ({manuscript, phrase}) => (
  <Container className="py-3 text-dark">
    {manuscript}
    <Phrase phrase={phrase}/>
  </Container>
)
