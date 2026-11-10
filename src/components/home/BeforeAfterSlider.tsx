"use client";

import { useState } from "react";

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
}: {
  beforeImage: string;
  afterImage: string;
}) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (clientX: number, rect: DOMRect) => {
    const x = clientX - rect.left;
    const pos = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(pos);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    handleMove(e.touches[0].clientX, rect);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    handleMove(e.clientX, rect);
  };

  return (
    <div
      className="relative aspect-[16/10] w-full select-none overflow-hidden rounded-2xl border border-border bg-muted cursor-ew-resize"
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/* After Image (Full background) */}
      <img
        src={afterImage}
        alt="After Transformation"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Before Image (Clipped) */}
      <div
        className="absolute inset-y-0 left-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={beforeImage}
          alt="Before Transformation"
          className="absolute inset-y-0 left-0 h-full max-w-none object-cover"
          style={{ width: "100%", height: "100%", minWidth: "100%" }}
        />
        {/* Subtle dark divider overlay on before image */}
        <div className="absolute inset-0 bg-black/5" />
      </div>

      {/* Divider Line */}
      <div
        className="absolute inset-y-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] transition-all"
        style={{ left: `calc(${sliderPosition}% - 2px)` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -left-3.5 flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary shadow-lg border border-border">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" transform="rotate(90 12 12)" />
          </svg>
        </div>
      </div>

      {/* Floating Labels */}
      <div className="absolute top-3 left-3 rounded-full bg-black/60 backdrop-blur-xs px-3 py-1 text-[11px] font-medium text-white pointer-events-none">
        Before
      </div>
      <div className="absolute top-3 right-3 rounded-full bg-black/60 backdrop-blur-xs px-3 py-1 text-[11px] font-medium text-white pointer-events-none">
        After
      </div>
    </div>
  );
}

