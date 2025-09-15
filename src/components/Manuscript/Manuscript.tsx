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
    <div dangerouslySetInnerHTML={{ __html: manuscript.split('{phrase}').shift() }}/>
    <Phrase phrase={phrase}/>
    <div dangerouslySetInnerHTML={{ __html: manuscript.split('{phrase}').pop() }}/>
  </Container>
)
