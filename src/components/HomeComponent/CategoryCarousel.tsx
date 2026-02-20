"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { CategoryType } from "@/Interfaces/categoryInterfaces";
import { useState } from "react";
import HomeCategoryCard from "./HomeCategoryCard";

type Props = {
  categories: CategoryType[];
};

const CategoryCarousel = ({ categories }: Props) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderRef, slider] = useKeenSlider({
    loop: false, // simple carousel, no loop
    slides: {
      perView: 1.2,
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
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

  return (
    <div className="relative">
      {/* Slider */}
      <div ref={sliderRef} className="keen-slider p-3">
        {categories.map((category) => (
          <div
            key={category._id ? category._id.toString() : category?.name}
            className="keen-slider__slide"
          >
            <HomeCategoryCard category={category} />
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={() => slider.current?.prev()}
        disabled={currentSlide === 0}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow px-3 py-2 rounded-full"
      >
        ◀
      </button>

      <button
        onClick={() => slider.current?.next()}
        disabled={
          currentSlide ===
          (slider.current?.track.details.slides.length ?? 0) - 1
        }
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow px-3 py-2 rounded-full"
      >
        ▶
      </button>
    </div>
  );
};

export default CategoryCarousel;
