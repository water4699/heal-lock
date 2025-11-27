import * as React from "react";
import { cn } from "@/lib/utils";

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange"> {
  value?: number[];
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value = [0], onValueChange, min = 0, max = 100, step = 1, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = [Number(e.target.value)];
      onValueChange?.(newValue);
    };

    const percentage = ((value[0] - min) / (max - min)) * 100;

    return (
      <>
        <style>{`
          .pink-slider::-webkit-slider-thumb {
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: linear-gradient(135deg, hsl(330, 70%, 60%), hsl(270, 50%, 70%));
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(236, 72, 153, 0.3);
            cursor: pointer;
            transition: all 0.2s;
          }
          .pink-slider::-webkit-slider-thumb:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 12px rgba(236, 72, 153, 0.5);
          }
          .pink-slider::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: linear-gradient(135deg, hsl(330, 70%, 60%), hsl(270, 50%, 70%));
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(236, 72, 153, 0.3);
            cursor: pointer;
          }
        `}</style>
        <div className={cn("relative flex w-full items-center", className)}>
          <input
            type="range"
            ref={ref}
            min={min}
            max={max}
            step={step}
            value={value[0]}
            onChange={handleChange}
            className="pink-slider h-3 w-full cursor-pointer appearance-none rounded-full bg-gray-200"
            style={{
              background: `linear-gradient(to right, hsl(330, 70%, 60%) 0%, hsl(330, 70%, 60%) ${percentage}%, hsl(0, 0%, 90%) ${percentage}%, hsl(0, 0%, 90%) 100%)`,
            }}
            {...props}
          />
        </div>
      </>
    );
  },
);
Slider.displayName = "Slider";

export { Slider };

