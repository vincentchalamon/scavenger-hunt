"use client";

import {useCallback, useEffect, useRef} from "react";
import {useTranslation} from "@/i18n";
import {clearOnboardingFlag, hasSeenOnboarding, setOnboardingSeen} from "@/lib/storage";

type OnboardingOptions = {
  activeKey: string;
  setActiveKey: (key: string) => void;
};

export function useOnboarding({setActiveKey}: OnboardingOptions) {
  const {t} = useTranslation();
  const driverRef = useRef<any>(null);

  const start = useCallback(async () => {
    const {driver} = await import('driver.js');

    if (driverRef.current) {
      driverRef.current.destroy();
    }

    const waitFor = (selector: string, maxAttempts = 20, interval = 200): Promise<void> =>
      new Promise((resolve) => {
        const check = (attempts: number) => {
          if (document.querySelector(selector)) {
            resolve();
          } else if (attempts < maxAttempts) {
            setTimeout(() => check(attempts + 1), interval);
          } else {
            resolve(); // proceed anyway
          }
        };
        check(0);
      });

    const driverObj = driver({
      showProgress: true,
      progressText: '{{current}} / {{total}}',
      showButtons: ['next', 'close'],
      allowClose: true,
      popoverClass: 'onboarding-popover',
      onDestroyStarted: () => {
        setOnboardingSeen();
        driverObj.destroy();
      },
    });

    driverObj.setSteps([
      {
        element: '[data-testid="phrase-area"]',
        popover: {
          title: t('onboardingManuscriptTitle'),
          description: t('onboardingManuscriptDescription'),
          nextBtnText: t('onboardingNextLabel'),
          onNextClick: () => {
            setActiveKey('map');
            waitFor('.custom-leaflet-marker').then(() => {
              window.dispatchEvent(new Event('resize'));
              setTimeout(() => driverObj.moveNext(), 800);
            });
          },
        },
      },
      {
        element: '.custom-leaflet-marker',
        popover: {
          title: t('onboardingMarkerTitle'),
          description: t('onboardingMarkerDescription'),
          nextBtnText: t('onboardingNextLabel'),
          onNextClick: () => {
            window.dispatchEvent(new CustomEvent('onboarding:open-first-marker'));
            waitFor('[data-testid="place-item-trigger"]', 15, 150).then(() =>
              driverObj.moveNext()
            );
          },
        },
      },
      {
        element: '[data-testid="place-item-trigger"]',
        disableActiveInteraction: true,
        popover: {
          title: t('onboardingPopupTitle'),
          description: t('onboardingPopupDescription'),
          nextBtnText: t('onboardingNextLabel'),
          onNextClick: () => {
            window.dispatchEvent(new CustomEvent('onboarding:close-first-marker'));
            window.dispatchEvent(new Event('resize'));
            setTimeout(() => driverObj.moveNext(), 400);
          },
        },
      },
      {
        element: '[data-testid="search-field"]',
        popover: {
          title: t('onboardingSearchTitle'),
          description: t('onboardingSearchDescription'),
          nextBtnText: t('onboardingDoneLabel'),
        },
      },
    ]);

    driverObj.drive(0);
    driverRef.current = driverObj;
  }, [t, setActiveKey]);

  // Auto-start on first visit after the initial paint
  useEffect(() => {
    if (!hasSeenOnboarding()) {
      requestAnimationFrame(() => start());
    }
    return () => {
      driverRef.current?.destroy();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const replay = useCallback(() => {
    clearOnboardingFlag();
    start();
  }, [start]);

  return {replay};
}
