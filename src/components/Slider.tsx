import React, { useEffect, useRef, useState } from "react";
import { classNames } from "@plasmicapp/react-web";
import { CodeComponentMeta } from "@plasmicapp/host";

type SliderProps = {
  children?: React.ReactNode;
  showDots?: boolean;
  autoPlay?: boolean;
  autoPlayDelay?: number; // milliseconds
  className?: string;
};

export const Slider = ({
  children,
  showDots = true,
  autoPlay = true,
  autoPlayDelay = 3000,
  className,
}: SliderProps) => {
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
        .slider-container {
          position: relative;
          overflow: hidden;
          width: 100%;
        }

        .slides-wrapper {
          display: flex;
          transition: transform 0.5s ease-in-out;
        }

        .slide {
          flex: 0 0 100%;
        }

        .dots {
          display: flex;
          justify-content: center;
          margin-top: 12px;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #ccc;
          margin: 0 4px;
          cursor: pointer;
          transition: background 0.3s;
        }

        .dot.active {
          background: #8254C6;
        }

        .arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0,0,0,0.3);
          color: white;
          border: none;
          padding: 8px 12px;
          cursor: pointer;
          z-index: 10;
        }

        .arrow.left {
          left: 10px;
        }

        .arrow.right {
          right: 10px;
        }
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

export const SliderMeta: CodeComponentMeta<SliderProps> = {
  name: "Slider",
  importPath: "@/components/Slider",
  props: {
    children: {
      type: "slot",
      defaultValue: [
        {
          type: "text",
          value: "Slide 1",
        },
        {
          type: "text",
          value: "Slide 2",
        },
        {
          type: "text",
          value: "Slide 3",
        },
      ],
    },
    showDots: {
      type: "boolean",
      defaultValue: true,
    },
    autoPlay: {
      type: "boolean",
      defaultValue: true,
    },
    autoPlayDelay: {
      type: "number",
      defaultValue: 3000,
    },
  },
};
