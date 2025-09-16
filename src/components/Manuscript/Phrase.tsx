"use client";

import {Container} from "react-bootstrap";
import React, {useContext} from "react";
import {PhraseContext} from "@/contexts/PhraseContext";

interface PhraseProps {
  phrase: string;
}

export const Phrase: React.FC<PhraseProps> = ({phrase}) => {
  const {keywords} = useContext(PhraseContext);

  return (
    <Container className="py-3 text-dark fw-bold h6">
      {/*@ts-ignore*/}
      {phrase.split(" ").map((keyword) => keywords.includes(keyword) ? keyword : "_".repeat(keyword.length)).join(" ")}
    </Container>
  );
}
