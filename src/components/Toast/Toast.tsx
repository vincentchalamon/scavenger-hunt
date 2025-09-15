"use client";

import React, {useContext} from "react";
import {Button, Toast as Notification} from "react-bootstrap";
import {ToastContext} from "@/contexts/ToastContext";

export const Toast: React.FC = () => {
  const {toast, setToast} = useContext(ToastContext);

  return <Notification show={!!toast} autohide delay={5000} onClose={() => setToast(undefined)} className="position-absolute bg-success text-light" style={{
    zIndex: 2000,
    top: '3%',
    left: '12%',
    width: '75%',
  }}>
    <Notification.Body className="me-3">
      <Button className="btn-close z-3 position-absolute m-2 top-0 end-0" onClick={() => setToast(undefined)}/>
      {toast}
    </Notification.Body>
  </Notification>;
}
