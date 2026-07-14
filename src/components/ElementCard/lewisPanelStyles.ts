import type React from 'react';

export const nobleNoticeStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
  padding: '32px 16px',
  textAlign: 'center',
  background: 'rgba(0, 243, 255, 0.02)',
  border: '1px dashed rgba(0, 243, 255, 0.15)',
  borderRadius: '6px'
};

export const panelStyle: React.CSSProperties = {
  padding: '16px',
  background: 'var(--surface-card)',
  border: '1px solid var(--glass-border)',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

export const panelTitleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-title)',
  fontSize: '12px',
  color: 'var(--neon-cyan)',
  margin: '0 0 6px 0',
  letterSpacing: '1px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px'
};

export const fieldLabelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '10px',
  color: 'var(--text-secondary)',
  marginBottom: '4px',
  fontFamily: 'var(--font-mono)'
};

export const sliderLabelStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '10px',
  color: 'var(--text-secondary)',
  marginBottom: '4px',
  fontFamily: 'var(--font-mono)'
};

export const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '6px',
  background: 'var(--bg-tertiary)',
  border: '1px solid var(--glass-border)',
  borderRadius: '4px',
  color: 'var(--text-primary)',
  outline: 'none',
  fontSize: '11px'
};

export const rangeStyle: React.CSSProperties = {
  width: '100%',
  accentColor: 'var(--neon-cyan)',
  cursor: 'pointer'
};

export const telemetryStyle: React.CSSProperties = {
  borderTop: '1px solid rgba(255,255,255,0.06)',
  paddingTop: '10px',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  fontFamily: 'var(--font-mono)',
  fontSize: '10px'
};

export const visualsGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
  gap: '12px'
};

export const canvasPanelStyle: React.CSSProperties = {
  padding: '12px',
  background: 'rgba(255, 255, 255, 0.01)',
  border: '1px solid var(--glass-border)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
};

export const canvasTitleStyle: React.CSSProperties = {
  fontSize: '9px',
  fontFamily: 'var(--font-mono)',
  color: 'var(--text-muted)',
  marginBottom: '8px',
  letterSpacing: '1px'
};

export const canvasStyle: React.CSSProperties = {
  border: '1px solid rgba(255,255,255,0.04)',
  borderRadius: '6px',
  background: '#07080f'
};

export const summaryStyle: React.CSSProperties = {
  padding: '14px',
  background: 'rgba(255, 0, 127, 0.02)',
  border: '1px solid rgba(255, 0, 127, 0.15)',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px'
};

export const summaryHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontFamily: 'var(--font-title)',
  fontSize: '11px',
  color: 'var(--neon-magenta)',
  letterSpacing: '1px'
};

export const summaryGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '12px',
  fontFamily: 'var(--font-mono)',
  fontSize: '10px',
  color: 'var(--text-secondary)'
};
