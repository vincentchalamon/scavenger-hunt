"use client";

import {Container} from "react-bootstrap";
import React, {useContext} from "react";
import {PhraseContext} from "@/contexts/PhraseContext";

type ManuscriptProps = {
  manuscript: string;
  phrase: string;
}

export const Manuscript: React.FC<ManuscriptProps> = ({manuscript, phrase}) => {
  const {keywords} = useContext(PhraseContext);

  return (
    <Container className="py-3 text-dark">
      <div dangerouslySetInnerHTML={{
        // @ts-ignore
        __html: manuscript.replace('{phrase}', phrase.split(" ").map((keyword) => keywords.includes(keyword) ? keyword : "..".repeat(keyword.length)).join(" ")),
      }}/>
    </Container>
  );
}
