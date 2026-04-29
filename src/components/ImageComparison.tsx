import { useState, useRef } from "react";
import satelliteBefore from "@/assets/satellite-before.jpg";
import satelliteAfter from "@/assets/satellite-after.jpg";

const ImageComparison = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPosition((x / rect.width) * 100);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-xs text-muted-foreground font-mono">
        <span>◀ Previous Year</span>
        <span>Current Year ▶</span>
      </div>
      <div
        ref={containerRef}
        className="relative w-full h-64 rounded-lg overflow-hidden cursor-col-resize border border-border select-none"
        onMouseMove={(e) => e.buttons === 1 && handleMove(e.clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      >
        <img src={satelliteAfter} alt="Current" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPosition}%` }}>
          <img src={satelliteBefore} alt="Previous" className="absolute inset-0 w-full h-full object-cover" style={{ minWidth: containerRef.current?.offsetWidth }} />
        </div>
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-primary"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
            ⟷
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageComparison;
