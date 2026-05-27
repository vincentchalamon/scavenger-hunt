"use client";

import React, {PropsWithChildren, ReactNode, useCallback, useEffect, useId, useRef, useState} from "react";
import {Container, Modal} from "react-bootstrap";
import {ZoomableFrame, Icon} from "@/components/UI";
import {useTranslation} from "@/i18n";

type ModalItemProps = {
  button: ReactNode;
  onShow?: () => void;
  onHide?: () => void;
  place?: string;
  step?: number;
};

const iconButtonStyle: React.CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: 12,
  background: "var(--color-bg)",
  border: "1px solid var(--color-hairline)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  flexShrink: 0,
};

export const ModalItem = ({button, children, onShow = () => {}, onHide = () => {}, place, step}: PropsWithChildren<ModalItemProps>) => {
  const {t} = useTranslation();
  const [isShown, setIsShown] = useState<boolean>(false);
  const isShownRef = useRef(false);
  // Unique ID per modal instance: popstate only closes THIS modal when going past its own entry
  const modalId = useId();

  const show = useCallback(() => {
    setIsShown(true);
    isShownRef.current = true;
    window.history.pushState({modal: modalId}, "");
    onShow();
  }, [onShow, modalId]);

  const hide = useCallback(() => {
    setIsShown(false);
    isShownRef.current = false;
    onHide();
  }, [onHide]);

  // Handle browser back button: close this modal only when navigating past its own history entry.
  // Using event.state?.modal !== modalId ensures nested modals don't close the parent.
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (isShownRef.current && event.state?.modal !== modalId) {
        hide();
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [hide, modalId]);

  return (
    <>
      <div className="h-100 w-100 p-0 m-0" onClick={show}>{button}</div>
      <Modal show={isShown} fullscreen onHide={hide} data-testid="modal">
        <Modal.Body className="p-0 position-relative" style={{background: "var(--color-bg)"}}>
          {/* Header clair, sans label de type d'énigme */}
          <div style={{
            height: 56, padding: "0 14px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "var(--color-surface)",
            borderBottom: "1px solid var(--color-hairline)",
            position: "relative", zIndex: 5,
          }}>
            <button onClick={hide} aria-label={t('close')} data-testid="modal-close" style={iconButtonStyle}>
              <Icon.X size={18} color="var(--color-ink)" strokeWidth={2} />
            </button>
            <div style={{textAlign: "center", flex: 1, padding: "0 10px", minWidth: 0}}>
              {typeof step === "number" && (
                <div style={{
                  fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--color-honey-deep)",
                  letterSpacing: 1.2, textTransform: "uppercase", fontWeight: 700,
                }}>
                  {t('stepLabel')} {String(step).padStart(2, "0")}
                </div>
              )}
              {place && (
                <div style={{
                  fontFamily: "var(--font-display)", fontSize: 14, color: "var(--color-ink)",
                  fontWeight: 700, marginTop: 1,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                  {place}
                </div>
              )}
            </div>
            <div style={{width: 36, flexShrink: 0}} />
          </div>

          {/* Contenu plein écran */}
          <div style={{
            position: "absolute", top: 56, bottom: 0, left: 0, right: 0,
            background: "var(--color-bg-warm)", overflow: "hidden",
          }}>
            <ZoomableFrame>
              <Container className="d-flex flex-column justify-content-center h-100 w-100 p-0">
                {children}
              </Container>
            </ZoomableFrame>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
