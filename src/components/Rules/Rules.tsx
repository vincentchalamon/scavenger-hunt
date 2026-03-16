"use client";

import {Container} from "react-bootstrap";
import React from "react";
import {ParchmentCard} from "@/components/UI";
import {useTranslation} from "@/i18n";
import styles from "./Rules.module.css";

export const Rules: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Container className="py-3" data-testid="rules">
      <ParchmentCard variant="bordered" elevation="lg">
        <div className={styles.rulesContent}>
          <h1>{t('rulesTitle')}</h1>

          {/* TL;DR */}
          <div className={styles.tldr}>
            <p dangerouslySetInnerHTML={{ __html: t('rulesTldr') }} />
          </div>

          {/* Objectif principal */}
          <div className={styles.objective}>
            <p dangerouslySetInnerHTML={{ __html: t('rulesObjective') }} />
          </div>

          {/* Step 0 - Before starting */}
          <div className={styles.stepZero}>
            <h2 dangerouslySetInnerHTML={{ __html: t('rulesStep0Title') }} />
            <p dangerouslySetInnerHTML={{ __html: t('rulesStep0') }} />
          </div>

          {/* Step 1 */}
          <div className={styles.step}>
            <h2 dangerouslySetInnerHTML={{ __html: t('rulesStep1Title') }} />
            <p dangerouslySetInnerHTML={{ __html: t('rulesStep1') }} />
          </div>

          {/* Step 2 */}
          <div className={styles.step}>
            <h2 dangerouslySetInnerHTML={{ __html: t('rulesStep2Title') }} />
            <p dangerouslySetInnerHTML={{ __html: t('rulesStep2') }} />
          </div>

          {/* Step 3 */}
          <div className={styles.step}>
            <h2 dangerouslySetInnerHTML={{ __html: t('rulesStep3Title') }} />
            <p dangerouslySetInnerHTML={{ __html: t('rulesStep3') }} />
          </div>

          {/* Step 4 */}
          <div className={styles.step}>
            <h2 dangerouslySetInnerHTML={{ __html: t('rulesStep4Title') }} />
            <p dangerouslySetInnerHTML={{ __html: t('rulesStep4') }} />
          </div>

          {/* Step 5 */}
          <div className={styles.step}>
            <h2 dangerouslySetInnerHTML={{ __html: t('rulesStep5Title') }} />
            <p dangerouslySetInnerHTML={{ __html: t('rulesStep5') }} />
          </div>

          {/* Tip */}
          <div className={styles.tip}>
            <p dangerouslySetInnerHTML={{ __html: t('rulesTip') }} />
          </div>
        </div>
      </ParchmentCard>
    </Container>
  );
}

