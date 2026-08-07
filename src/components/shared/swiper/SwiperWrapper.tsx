"use client";

import "swiper/css";

import {
  Children,
  isValidElement,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import type { SwiperModule, SwiperOptions } from "swiper/types";
import ChevronIcon from "@/components/shared/icons/ChevronIcon";
import { cn } from "@/utils/cn";

type SwiperWrapperProps = {
  /**
   * One entry per slide — plain content, *not* `<SwiperSlide>` elements.
   * `<Swiper>` identifies real slides by checking each child's component
   * identity, which breaks when the element is created on the server and
   * crosses into this client component as a prop; wrapping every entry in
   * `<SwiperSlide>` ourselves, right here on the client, keeps that identity
   * intact. Pass already-keyed elements (e.g. from `array.map`) and the key
   * carries over to the generated `<SwiperSlide>`.
   */
  slides: ReactNode[];
  breakpoints?: SwiperOptions["breakpoints"];
  /** Applied to the underlying `<Swiper>` element. */
  swiperClassName?: string;
  loop?: boolean;
  spaceBetween?: number;
  slidesPerView?: SwiperOptions["slidesPerView"];
  additionalModules?: SwiperModule[];
  additionalOptions?: Partial<SwiperOptions>;
  /** Hide the built-in prev/next controls (e.g. when the caller renders its own). */
  showNavigation?: boolean;
  /**
   * Positions the prev/next button row. Defaults to the top-right corner of
   * the nearest positioned ancestor — put the wrapper inside a `relative`
   * container (e.g. alongside a section heading) to place it there.
   */
  buttonsClassName?: string;
  prevLabel: string;
  nextLabel: string;
  onSwiper?: (swiper: SwiperType) => void;
  onSlideChange?: (swiper: SwiperType) => void;
};

const EMPTY_ADDITIONAL_OPTIONS: Partial<SwiperOptions> = {};

/**
 * Shared Swiper carousel shell: slides + a prev/next button pair that track
 * the swiper's beginning/end/lock state (disabled at the ends, hidden
 * entirely when every slide already fits — no loop stub arrows). Meant to be
 * reused across sections; each usage supplies its own slides, breakpoints and
 * button positioning.
 */
export default function SwiperWrapper({
  slides,
  breakpoints,
  swiperClassName,
  loop = false,
  spaceBetween = 16,
  slidesPerView = 1,
  additionalModules = [],
  additionalOptions = EMPTY_ADDITIONAL_OPTIONS,
  showNavigation = true,
  buttonsClassName,
  prevLabel,
  nextLabel,
  onSwiper,
  onSlideChange,
}: SwiperWrapperProps) {
  const swiperInstanceRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  // When every slide fits at once (`watchOverflow`), Swiper "locks" itself —
  // we hide the arrows ourselves rather than relying on Swiper's own CSS.
  const [isLocked, setIsLocked] = useState(false);

  const syncSlideState = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
    setIsLocked(swiper.isLocked);
  };

  const handlePrevClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const swiper = swiperInstanceRef.current;
    if (!swiper || (swiper.isBeginning && !swiper.params.loop)) return;
    swiper.slidePrev();
  };

  const handleNextClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const swiper = swiperInstanceRef.current;
    if (!swiper || (swiper.isEnd && !swiper.params.loop)) return;
    swiper.slideNext();
  };

  return (
    <>
      {/*
        Outer clip + tight padding so DishCard shadows aren't cut, without
        leaving a wide gap on the right that peeks the next slide.
      */}
      <div className="-mx-3 -my-5 overflow-hidden px-3 py-5">
        <Swiper
          onSwiper={(swiper) => {
            swiperInstanceRef.current = swiper;
            syncSlideState(swiper);
            const sync = () => syncSlideState(swiper);
            swiper.on("lock", sync);
            swiper.on("unlock", sync);
            swiper.on("resize", sync);
            onSwiper?.(swiper);
          }}
          onSlideChange={(swiper) => {
            syncSlideState(swiper);
            onSlideChange?.(swiper);
          }}
          breakpoints={breakpoints}
          spaceBetween={spaceBetween}
          slidesPerView={slidesPerView}
          loop={loop}
          speed={600}
          modules={additionalModules}
          className={cn("!overflow-visible", swiperClassName)}
          {...additionalOptions}
        >
          {Children.map(slides, (slide, index) => (
            <SwiperSlide
              key={isValidElement(slide) ? (slide.key ?? index) : index}
              className="!h-auto overflow-visible"
            >
              {slide}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {showNavigation && !isLocked && (
        <div className={cn("flex items-center gap-2 sm:gap-3", buttonsClassName)}>
          <button
            type="button"
            disabled={isBeginning && !loop}
            aria-label={prevLabel}
            onClick={handlePrevClick}
            className="group flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-navy-dark bg-white transition duration-300 enabled:bg-navy-dark disabled:cursor-not-allowed disabled:opacity-100 sm:size-11 xl:enabled:hover:bg-navy"
          >
            <ChevronIcon className="size-4 rotate-180 text-navy-dark transition-colors duration-300 group-enabled:text-white sm:size-5" />
          </button>
          <button
            type="button"
            disabled={isEnd && !loop}
            aria-label={nextLabel}
            onClick={handleNextClick}
            className="group flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-navy-dark bg-white transition duration-300 enabled:bg-navy-dark disabled:cursor-not-allowed disabled:opacity-100 sm:size-11 xl:enabled:hover:bg-navy"
          >
            <ChevronIcon className="size-4 text-navy-dark transition-colors duration-300 group-enabled:text-white sm:size-5" />
          </button>
        </div>
      )}
    </>
  );
}
