"use client";

import {Container} from "react-bootstrap";
import React, {useContext} from "react";
import {PhraseContext} from "@/contexts/PhraseContext";
import {ParchmentCard} from "@/components/UI";
import styles from "./Manuscript.module.css";

type ManuscriptProps = {
  manuscript: string;
  phrase: string;
}

export const Manuscript: React.FC<ManuscriptProps> = ({manuscript, phrase}) => {
  const {keywords}: {keywords: string[]} = useContext(PhraseContext);

  return (
    <Container className="py-3" data-testid="manuscript">
      <ParchmentCard variant="bordered" elevation="lg">
        {/* Manuscript content */}
        <div className={styles.manuscriptContent} dangerouslySetInnerHTML={{
          // @ts-ignore
          __html: manuscript.replace('{phrase}', `<span data-testid="phrase-area">${phrase.split(" ").map((keyword) =>
            keywords.includes(keyword)
              ? `<span class="${styles.foundKeyword}">${keyword}</span>`
              : `<span class="${styles.hiddenKeyword}">${"··".repeat(keyword.length)}</span>`
          ).join(" ")}</span>`),
        }}/>
      </ParchmentCard>
    </Container>
  );
}
