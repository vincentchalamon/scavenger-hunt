"use client";

import React, {useState} from "react";
import {Button, Container, Modal} from "react-bootstrap";

export const ModalItem = ({button, children}: Readonly<{ button: React.ReactNode, children: React.ReactNode }>) => {
  const [show, setShow] = useState<boolean>(false);

  return (
    <>
      <div onClick={() => setShow(true)}>{button}</div>
      <Modal show={show} fullscreen onHide={() => setShow(false)}>
        <Modal.Body className="p-0 position-relative">
          <Button className="btn-close z-3 position-absolute m-3 top-0 end-0" onClick={() => setShow(false)}/>
          <Container className="position-relative d-flex flex-column justify-content-center align-items-center object-fit-contain h-100 w-100 p-0">
            {children}
          </Container>
        </Modal.Body>
      </Modal>
    </>
  );
}
