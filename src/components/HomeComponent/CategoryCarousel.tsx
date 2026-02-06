"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { CategoryType } from "@/Interfaces/categoryInterfaces";
import { useState, useEffect } from "react";

type Props = {
  categories: CategoryType[];
};

const CategoryCarousel = ({ categories }: Props) => {
  const [pause, setPause] = useState(false);

  const [sliderRef, slider] = useKeenSlider({
    loop: true,
    slides: {
      perView: 1.5,
      spacing: 15,
    },
    breakpoints: {
      "(min-width: 640px)": {
        slides: { perView: 2.5, spacing: 20 },
      },
      "(min-width: 1024px)": {
        slides: { perView: 4, spacing: 24 },
      },
    },
    dragSpeed: 1.2,
    rubberband: true,
    created() {
      if (!pause) slider.current?.moveToIdx(0, true);
    },
  });

  // Autoplay effect
  useEffect(() => {
    if (!slider) return;
    if (pause) return;

    const interval = setInterval(() => {
      slider.current?.next();
    }, 3500);

    return () => clearInterval(interval);
  }, [slider, pause]);

  return (
    <div
      ref={sliderRef}
      className="keen-slider  p-3 "
      onMouseEnter={() => setPause(true)}    // hover এ autoplay pause
      onMouseLeave={() => setPause(false)}   // mouse ছাড়লে autoplay চালু
    >
      {categories.map((category) => (
        <div key={category._id?category._id.toString():category?.name} className="keen-slider__slide">
          <HomeCategoryCard category={category} />
        </div>
      ))}
    </div>
  );
};

export default CategoryCarousel;
