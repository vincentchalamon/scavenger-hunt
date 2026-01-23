"use client";

import {Container} from "react-bootstrap";
import React, {useContext} from "react";
import {PhraseContext} from "@/contexts/PhraseContext";

type ManuscriptProps = {
  rules: string;
  manuscript: string;
  phrase: string;
}

export const Manuscript: React.FC<ManuscriptProps> = ({rules, manuscript, phrase}) => {
  const {keywords} = useContext(PhraseContext);

  return (
    <Container className="py-3 text-dark" data-testid="manuscript">
      <div style={{
        textAlign: "justify",
        textJustify: "inter-word",
      }} dangerouslySetInnerHTML={{
        // @ts-ignore
        __html: manuscript.replace('{phrase}', phrase.split(" ").map((keyword) => keywords.includes(keyword) ? keyword : "..".repeat(keyword.length)).join(" ")),
      }}/>
      <hr/>
      <div style={{
        textAlign: "justify",
        textJustify: "inter-word",
      }} dangerouslySetInnerHTML={{
        // @ts-ignore
        __html: rules,
      }}/>
    </Container>
  );
}
