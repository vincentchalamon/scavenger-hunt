"use client";

import React from "react";
import {Button, Toast as Notification} from "react-bootstrap";
import {useToast} from "@/contexts/ToastContext";

export const Toast: React.FC = () => {
  const {toast, style, clearToast} = useToast();

  return <Notification show={!!toast} autohide delay={5000} onClose={() => clearToast()} className={`position-absolute bg-${style} text-light`} style={{
    zIndex: 2000,
    top: '3%',
    left: '12%',
    width: '75%',
  }}>
    <Notification.Body className="me-3">
      <Button className="btn-close z-3 position-absolute m-2 top-0 end-0" onClick={() => clearToast()}/>
      {toast}
    </Notification.Body>
  </Notification>;
}
