"use client";

import {Container} from "react-bootstrap";
import React, {useContext} from "react";
import {PhraseContext} from "@/contexts/PhraseContext";
import {ParchmentCard, Icon} from "@/components/UI";
import {useTranslation} from "@/i18n";
import styles from "./Manuscript.module.css";

type ManuscriptProps = {
  manuscript: string;
  phrase: string;
  onGoToMap?: () => void;
}

export const Manuscript: React.FC<ManuscriptProps> = ({manuscript, phrase, onGoToMap}) => {
  const {t} = useTranslation();
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
        <div className={styles.completeBanner} data-testid="phrase-complete">
          <div className={styles.completeMedallion}>
            <Icon.Sparkle size={26} color="#fff" strokeWidth={2.4} />
          </div>
          <div className={styles.completeKicker}>{t('phraseReconstructedKicker')}</div>
          <h2 className={styles.completeTitle}>{t('phraseReconstructedTitle')}</h2>
          <p className={styles.completeBody}>{t('phraseReconstructedBody')}</p>
          {onGoToMap && (
            <button className={styles.completeCta} onClick={onGoToMap}>
              <Icon.Map size={15} color="#fff" strokeWidth={2} />
              {t('backToMap')}
            </button>
          )}
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
