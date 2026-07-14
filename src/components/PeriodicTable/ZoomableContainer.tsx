import { useCallback, useEffect, useRef, useState } from 'react';
import type { PointerEvent, ReactNode, TouchEvent } from 'react';
import { Maximize, ZoomIn, ZoomOut } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

interface ZoomableContainerProps {
  children: ReactNode;
  initialScale?: number;
  maxScale?: number;
  minScale?: number;
  onScaleChange?: (scale: number | ((previous: number) => number)) => void;
  scale?: number;
}

export function ZoomableContainer({
  children,
  initialScale = 1,
  maxScale = 3,
  minScale = 0.45,
  onScaleChange,
  scale: externalScale,
}: ZoomableContainerProps) {
  const { t } = useLanguage('common');
  const containerRef = useRef<HTMLDivElement>(null);
  const [internalScale, setInternalScale] = useState(initialScale);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const pinchStartDist = useRef<number | null>(null);
  const scale = externalScale ?? internalScale;
  const updateScale = onScaleChange ?? setInternalScale;
  const lastScale = useRef(scale);

  const clampScale = useCallback(
    (value: number) => Math.min(Math.max(value, minScale), maxScale),
    [maxScale, minScale],
  );

  const manualZoom = useCallback(
    (delta: number) => updateScale((previous) => clampScale(previous + delta)),
    [clampScale, updateScale],
  );

  const handleWheel = useCallback((event: WheelEvent) => {
    event.preventDefault();
    manualZoom(event.deltaY > 0 ? -0.1 : 0.1);
  }, [manualZoom]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  const handlePointerDown = (event: PointerEvent) => {
    if ((event.target as HTMLElement).closest('button')) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    setIsDragging(true);
    dragStart.current = {
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent) => {
    if (!isDragging) return;
    setPosition({
      x: event.clientX - dragStart.current.x,
      y: event.clientY - dragStart.current.y,
    });
  };

  const handlePointerUp = (event: PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const getPinchDistance = (event: TouchEvent) => {
    if (event.touches.length < 2) return null;
    const dx = event.touches[0].clientX - event.touches[1].clientX;
    const dy = event.touches[0].clientY - event.touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (event: TouchEvent) => {
    if (event.touches.length !== 2) return;
    pinchStartDist.current = getPinchDistance(event);
    lastScale.current = scale;
  };

  const handleTouchMove = (event: TouchEvent) => {
    if (event.touches.length !== 2 || pinchStartDist.current === null) return;
    const distance = getPinchDistance(event);
    if (distance) updateScale(clampScale(lastScale.current * (distance / pinchStartDist.current)));
  };

  const resetZoom = () => {
    updateScale(initialScale);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="pt-zoom-shell" ref={containerRef}>
      <div className="pt-zoom-controls" aria-label={t('zoomControl')}>
        <button aria-label={t('zoomIn')} onClick={() => manualZoom(0.2)} type="button">
          <ZoomIn size={17} />
        </button>
        <button aria-label={t('resetZoom')} onClick={resetZoom} type="button">
          <Maximize size={17} />
        </button>
        <button aria-label={t('zoomOut')} onClick={() => manualZoom(-0.2)} type="button">
          <ZoomOut size={17} />
        </button>
      </div>
      <div
        className={isDragging ? 'pt-zoom-canvas is-dragging' : 'pt-zoom-canvas'}
        onPointerCancel={handlePointerUp}
        onPointerDown={handlePointerDown}
        onPointerLeave={handlePointerUp}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onTouchEnd={() => { pinchStartDist.current = null; }}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchStart}
        style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  );
}
