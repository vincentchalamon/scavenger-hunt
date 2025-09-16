"use client";

import React, {ReactNode, useState} from "react";
import {Button, Container, Modal} from "react-bootstrap";

export const ModalItem = ({button, children, onShow = () => {}, onHide = () => {}}: Readonly<{ button: ReactNode, children: ReactNode, onShow?: () => void, onHide?: () => void }>) => {
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
      <div className="h-100 w-100" onClick={show}>{button}</div>
      <Modal show={isShown} fullscreen onHide={hide}>
        <Modal.Body className="p-0 position-relative">
          <Button className="btn-close z-3 position-absolute m-3 top-0 end-0" onClick={hide}/>
          <Container className="position-relative d-flex flex-column justify-content-center align-items-center object-fit-contain h-100 w-100 p-0">
            {children}
          </Container>
        </Modal.Body>
      </Modal>
    </>
  );
}
