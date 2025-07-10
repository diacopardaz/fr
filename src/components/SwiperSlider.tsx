import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { CodeComponentMeta } from "@plasmicapp/host";

type SwiperSliderProps = {
  children?: React.ReactNode;
  loop?: boolean;
  autoplay?: boolean;
  autoplayDelay?: number;
  showPagination?: boolean;
  className?: string;
};

export const SwiperSlider = ({
  children,
  loop = true,
  autoplay = true,
  autoplayDelay = 3000,
  showPagination = true,
  className,
}: SwiperSliderProps) => {
  const slides = React.Children.toArray(children);

  return (
    <Swiper
      loop={loop}
      autoplay={autoplay ? { delay: autoplayDelay } : false}
      pagination={showPagination ? { clickable: true } : false}
      modules={[Autoplay, Pagination]}
      className={className}
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index}>{slide}</SwiperSlide>
      ))}
    </Swiper>
  );
};

export const SwiperSliderMeta: CodeComponentMeta<SwiperSliderProps> = {
  name: "SwiperSlider",
  importPath: "@/components/SwiperSlider",
  props: {
    children: {
      type: "slot",
      defaultValue: [
        { type: "text", value: "Slide 1" },
        { type: "text", value: "Slide 2" },
        { type: "text", value: "Slide 3" },
      ],
    },
    loop: { type: "boolean", defaultValue: true },
    autoplay: { type: "boolean", defaultValue: true },
    autoplayDelay: { type: "number", defaultValue: 3000 },
    showPagination: { type: "boolean", defaultValue: true },
    className: { type: "class" }, // 👈 برای Plasmic بسیار مهمه
  },
};
