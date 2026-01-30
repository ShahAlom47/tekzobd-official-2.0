"use client";

import React from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

interface PriceRangeSliderProps {
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: [number, number];
  onChange: (value: number[]) => void;
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  min = 0,
  max = 50000,
  step = 100,
  defaultValue = [1000, 10000],
  onChange,
}) => {
  return (
    <div className="w-full">
      <Slider
        range
        step={step}
        min={min}
        max={max}
        defaultValue={defaultValue}
        onChange={(value) => onChange(value as number[])}
        railStyle={{
          backgroundColor: "#d1d5db", // Tailwind: gray-300
          height: "2px",
        }}
        trackStyle={{
          backgroundColor: "#3b82f6", // Tailwind: blue-500
          height: "2px",
        }}
        handleStyle={[
          {
            backgroundColor: "#111827", // Tailwind: gray-900
            borderColor: "#111827",
            height: 12,
            width: 12,
            marginTop: -5,
          },
          {
            backgroundColor: "#111827", // second handle
            borderColor: "#111827",
            height: 12,
            width: 12,
            marginTop: -5,
          },
        ]}
      />
    </div>
  );
};

export default PriceRangeSlider;
