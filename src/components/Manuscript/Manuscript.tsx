"use client";

import {Container} from "react-bootstrap";
import React, {useContext} from "react";
import {PhraseContext} from "@/contexts/PhraseContext";
import {ParchmentCard} from "@/components/UI";
import {CompletionCard} from "@/components/CompletionCard/CompletionCard";
import styles from "./Manuscript.module.css";

type ManuscriptProps = {
  manuscript: string;
  phrase: string;
  onGoToMap?: () => void;
}

export const Manuscript: React.FC<ManuscriptProps> = ({manuscript, phrase, onGoToMap}) => {
  const {keywords, defaultKeywords} = useContext(PhraseContext);

  const words = phrase.split(" ");
  const uniqueWords = [...new Set(words)];
  const total = Math.max(1, uniqueWords.length - defaultKeywords.length);
  const found = Math.min(Math.max(0, keywords.length - defaultKeywords.length), total);
  const allFound = found >= total;

  const phraseHtml = `<span data-testid="phrase-area" class="${styles.phraseBoard}">${words.map((word) =>
    keywords.includes(word)
      ? `<span class="${styles.foundKeyword}">${word}</span>`
      : `<span class="${styles.hiddenKeyword}">${"··".repeat(word.length)}</span>`
  ).join(" ")}</span>`;

  return (
    <Container className="py-3" data-testid="manuscript">
      {allFound && (
        <div style={{marginBottom: 'var(--spacing-lg)'}}>
          <CompletionCard phrase={phrase} defaultKeywords={defaultKeywords} onGoToMap={onGoToMap} />
        </div>
      )}

      <ParchmentCard variant="bordered" elevation="lg">
        <div
          className={styles.manuscriptContent}
          dangerouslySetInnerHTML={{__html: manuscript.replace('{phrase}', phraseHtml)}}
        />
      </ParchmentCard>
    </Container>
  );
}
