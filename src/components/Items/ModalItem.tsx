"use client";

import React, {PropsWithChildren, ReactNode, useCallback, useEffect, useRef, useState} from "react";
import {Button, Container, Modal} from "react-bootstrap";
import {assetPath} from "@/lib/assets";
import {ZoomableFrame} from "@/components/UI";

export const ModalItem = ({button, children, onShow = () => {}, onHide = () => {}}: PropsWithChildren<{ button: ReactNode, onShow?: () => void, onHide?: () => void }>) => {
  const [isShown, setIsShown] = useState<boolean>(false);
  const isShownRef = useRef(false);

  const show = useCallback(() => {
    setIsShown(true);
    isShownRef.current = true;
    window.history.pushState({modal: true}, "");
    onShow();
  }, [onShow]);

  const hide = useCallback(() => {
    setIsShown(false);
    isShownRef.current = false;
    onHide();
  }, [onHide]);

  // Handle browser back button — close modal instead of navigating away
  useEffect(() => {
    const handlePopState = () => {
      if (isShownRef.current) {
        hide();
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [hide]);

  return (
    <>
      <div className="h-100 w-100 p-0 m-0" onClick={show}>{button}</div>
      <Modal show={isShown} fullscreen onHide={hide} data-testid="modal">
        <Modal.Body className="p-0 position-relative" style={{
          backgroundImage: `url('${assetPath('/assets/background.png')}')`,
          backgroundPosition: "center",
          backgroundRepeat: "repeat",
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          backgroundBlendMode: "lighten",
        }}>
          {/*@ts-ignore*/}
          <Button className="btn-close z-3 position-absolute m-3 top-0 end-0" onClick={hide} style={{zIndex: 10}}/>
          <ZoomableFrame>
            <Container className="d-flex flex-column justify-content-center h-100 w-100 p-0">
              {children}
            </Container>
          </ZoomableFrame>
        </Modal.Body>
      </Modal>
    </>
  );
}
