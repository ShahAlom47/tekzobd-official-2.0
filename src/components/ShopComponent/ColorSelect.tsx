"use client"
import React, { useEffect, useState } from "react";

interface ColorSelectProps {
  availableColors?: string[];
  selectedColors: string[];
  onChange: (colors: string[]) => void;
  singleSelect?: boolean;
}

export const COLORS = [
  "Default",
  "Black",
  "White",
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Orange",
  "Pink",
  "Purple",
  "Gray",
  "Brown",
  "Navy",
  "Maroon",
  "Olive",
  "Teal",
  "Beige",
  "Silver",
  "Gold",
];

const ColorSelect: React.FC<ColorSelectProps> = ({
  availableColors,
  selectedColors,
  onChange,
  singleSelect = false,
}) => {
  const [activeColor, setActiveColor] = useState<string | null>(null);


  useEffect(() => {
  if (singleSelect && availableColors && availableColors.length > 0 && !activeColor) {
    // default first color select
    setActiveColor(availableColors[0]);
    onChange([availableColors[0]]);
  }
}, [singleSelect, availableColors,activeColor]);


  const handleSelect = (color: string) => {
    if (singleSelect) {
      setActiveColor(color);
      onChange([color]);
    } else {
      if (selectedColors.includes(color)) {
        onChange(selectedColors.filter((c) => c !== color));
      } else {
        onChange([...selectedColors, color]);
      }
    }
  };

  const colorsToShow = availableColors?.length ? availableColors : COLORS;

  return (
    <div className="flex flex-wrap gap-2">
      {colorsToShow.map((color) => {
        const isSelected = singleSelect
          ? activeColor === color
          : selectedColors.includes(color);

        return (
          <button
            key={color}
            type="button"
            onClick={() => handleSelect(color)}
            className={`flex items-center gap-2 px-3 py-1 rounded-full border text-sm transition
              ${isSelected ? "bg-black text-white" : "bg-gray-100 text-gray-700"}
            `}
          >
            {/* Color Circle */}
            <span
              className="w-4 h-4 rounded-full border"
              style={{ backgroundColor: color.toLowerCase() }}
            ></span>
            {color}
          </button>
        );
      })}
    </div>
  );
};

export default ColorSelect;
