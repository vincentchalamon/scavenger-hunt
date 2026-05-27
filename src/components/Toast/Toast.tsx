"use client";

import React from "react";
import {Toast as Notification} from "react-bootstrap";
import {useToast} from "@/contexts/ToastContext";
import {useTranslation} from "@/i18n";
import {Icon} from "@/components/UI";

export const Toast: React.FC = () => {
  const {toast, style, clearToast} = useToast();
  const {t} = useTranslation();
  const isError = style === 'danger';

  return (
    <Notification
      data-testid="toast"
      show={!!toast}
      autohide
      delay={5000}
      onClose={() => clearToast()}
      className="position-absolute"
      style={{
        zIndex: 2000,
        top: '3%',
        left: '12%',
        width: '76%',
        background: isError ? 'var(--color-surface)' : 'var(--color-ink)',
        color: isError ? 'var(--color-ink)' : '#fff',
        border: isError ? '1px solid color-mix(in srgb, var(--color-ruby) 33%, transparent)' : 'none',
        borderRadius: 12,
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      <Notification.Body style={{
        display: 'flex', alignItems: 'center', gap: 10,
        fontFamily: 'var(--font-body)', fontSize: 13,
        padding: '10px 36px 10px 14px', position: 'relative',
      }}>
        {isError ? (
          <Icon.X size={18} color="var(--color-ruby)" strokeWidth={2} />
        ) : (
          <span style={{
            width: 24, height: 24, borderRadius: 12, background: 'var(--color-honey)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Icon.Check size={14} color="#fff" strokeWidth={2.5} />
          </span>
        )}
        <span style={{flex: 1}}>{toast}</span>
        <button
          onClick={() => clearToast()}
          aria-label={t('close')}
          style={{
            position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
            background: 'transparent', border: 'none', cursor: 'pointer', padding: 4,
            color: isError ? 'var(--color-ink-mute)' : 'rgba(255,255,255,0.7)',
          }}
        >
          <Icon.X size={14} color="currentColor" strokeWidth={2} />
        </button>
      </Notification.Body>
    </Notification>
  );
}
