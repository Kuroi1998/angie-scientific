import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';

interface ZoomableContainerProps {
  children: React.ReactNode;
  minScale?: number;
  maxScale?: number;
  initialScale?: number;
}

export const ZoomableContainer: React.FC<ZoomableContainerProps> = ({
  children,
  minScale = 0.4,
  maxScale = 3,
  initialScale = 1,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(initialScale);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const pinchStartDist = useRef<number | null>(null);
  const lastScale = useRef(initialScale);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    if (!containerRef.current) return;
    
    // Zoom in/out based on wheel delta
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale(prev => {
      const newScale = Math.min(Math.max(prev + delta, minScale), maxScale);
      return newScale;
    });
  }, [minScale, maxScale]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [handleWheel]);

  const handlePointerDown = (e: React.PointerEvent) => {
    // only start drag if we aren't clicking on a button inside
    if ((e.target as HTMLElement).tagName === 'BUTTON') return;
    
    if (e.pointerType === 'mouse' && e.button !== 0) return; // Only left click for mouse
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  // Touch logic for Pinch to Zoom
  const getPinchDistance = (e: React.TouchEvent) => {
    if (e.touches.length < 2) return null;
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      pinchStartDist.current = getPinchDistance(e);
      lastScale.current = scale;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchStartDist.current !== null) {
      const dist = getPinchDistance(e);
      if (dist) {
        const delta = dist / pinchStartDist.current;
        setScale(() => {
          const newScale = Math.min(Math.max(lastScale.current * delta, minScale), maxScale);
          return newScale;
        });
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2) {
      pinchStartDist.current = null;
    }
  };

  const resetZoom = () => {
    setScale(initialScale);
    setPosition({ x: 0, y: 0 });
  };

  const manualZoom = (delta: number) => {
    setScale(prev => Math.min(Math.max(prev + delta, minScale), maxScale));
  };

  return (
    <div 
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', touchAction: 'none' }}
      ref={containerRef}
    >
      {/* Control Overlay */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        zIndex: 50,
        background: 'rgba(5, 5, 10, 0.7)',
        padding: '8px',
        borderRadius: '8px',
        border: '1px solid var(--glass-border)',
        backdropFilter: 'blur(4px)'
      }}>
        <button 
          onClick={() => manualZoom(0.2)}
          className="btn-icon" 
          aria-label="Zoom In"
          style={{ width: '32px', height: '32px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
        >
          <ZoomIn size={18} />
        </button>
        <button 
          onClick={resetZoom}
          className="btn-icon" 
          aria-label="Reset Zoom"
          style={{ width: '32px', height: '32px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
        >
          <Maximize size={18} />
        </button>
        <button 
          onClick={() => manualZoom(-0.2)}
          className="btn-icon" 
          aria-label="Zoom Out"
          style={{ width: '32px', height: '32px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
        >
          <ZoomOut size={18} />
        </button>
      </div>

      {/* Pannable/Zoomable Content */}
      <div 
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          width: '100%',
          height: '100%',
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.1s ease-out',
          cursor: isDragging ? 'grabbing' : 'grab',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ pointerEvents: isDragging ? 'none' : 'auto', width: '100%', display: 'flex', justifyContent: 'center' }}>
          {children}
        </div>
      </div>
    </div>
  );
};
