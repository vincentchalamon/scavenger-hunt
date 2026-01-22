"use client";

import React, {PropsWithChildren, ReactNode, useState} from "react";
import {Button, Container, Modal} from "react-bootstrap";

export const ModalItem = ({button, children, onShow = () => {}, onHide = () => {}}: PropsWithChildren<{ button: ReactNode, onShow?: () => void, onHide?: () => void }>) => {
  const [isShown, setIsShown] = useState<boolean>(false);
  const show = () => {
    setIsShown(true);
    onShow();
  }
  const hide = () => {
    setIsShown(false);
    onHide();
  }

  return (
    <>
      <div className="h-100 w-100 p-0 m-0" onClick={show}>{button}</div>
      <Modal show={isShown} fullscreen onHide={hide} data-testid="modal">
        <Modal.Body className="p-0 position-relative" style={{
          backgroundImage: "url('assets/background.png')",
          backgroundPosition: "center",
          backgroundRepeat: "repeat",
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          backgroundBlendMode: "lighten",
        }}>
          {/*@ts-ignore*/}
          <Button className="btn-close z-3 position-absolute m-3 top-0 end-0" onClick={hide}/>
          <Container className="d-flex flex-column justify-content-center h-100 w-100 p-0">
            {children}
          </Container>
        </Modal.Body>
      </Modal>
    </>
  );
}
