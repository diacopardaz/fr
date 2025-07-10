import React, { useEffect, useRef, useState } from "react";
import { classNames } from "@plasmicapp/react-web";
import { CodeComponentMeta } from "@plasmicapp/host";

type CustomSliderProps = {
  children?: React.ReactNode;
  showDots?: boolean;
  autoPlay?: boolean;
  autoPlayDelay?: number;
  className?: string;
};

export const CustomSlider = ({
  children,
  showDots = true,
  autoPlay = true,
  autoPlayDelay = 3000,
  className,
}: CustomSliderProps) => {
  const slides = React.Children.toArray(children);
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  const goToSlide = (index: number) => setCurrent(index);

  useEffect(() => {
    if (autoPlay) {
      timerRef.current = setInterval(nextSlide, autoPlayDelay);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoPlay, autoPlayDelay]);

  return (
    <>
      <style>{`
        /* styles... (همون قبلی‌ها) */
      `}</style>

      <div className={classNames("slider-container", className)}>
        <div
          className="slides-wrapper"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div className="slide" key={index}>
              {slide}
            </div>
          ))}
        </div>

        <button className="arrow left" onClick={prevSlide}>&lt;</button>
        <button className="arrow right" onClick={nextSlide}>&gt;</button>

        {showDots && (
          <div className="dots">
            {slides.map((_, index) => (
              <div
                key={index}
                className={classNames("dot", { active: index === current })}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export const CustomSliderMeta: CodeComponentMeta<CustomSliderProps> = {
  name: "CustomSlider",
  importPath: "@/components/CustomSlider",
  props: {
    children: {
      type: "slot",
      defaultValue: [
        { type: "text", value: "Slide 1" },
        { type: "text", value: "Slide 2" },
        { type: "text", value: "Slide 3" },
      ],
    },
    showDots: { type: "boolean", defaultValue: true },
    autoPlay: { type: "boolean", defaultValue: true },
    autoPlayDelay: { type: "number", defaultValue: 3000 },
  },
};
