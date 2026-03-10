import React, { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Slider.css';

/*
 * High-resolution slide data.
 * Each entry carries multiple srcSet widths so the browser picks
 * the smallest file that still looks sharp at the rendered size.
 * Replace URLs with your own CDN / optimised images as needed.
 */
const slides = [
  {
    src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80&auto=format&fit=crop',
    srcSet: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=640&q=80&auto=format&fit=crop 640w',
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=960&q=80&auto=format&fit=crop 960w',
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80&auto=format&fit=crop 1200w',
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80&auto=format&fit=crop 1920w',
    ],
    alt: 'Conference event – attendees networking in a modern venue',
  },
  {
    src: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&q=80&auto=format&fit=crop',
    srcSet: [
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=640&q=80&auto=format&fit=crop 640w',
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=960&q=80&auto=format&fit=crop 960w',
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&q=80&auto=format&fit=crop 1200w',
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1920&q=80&auto=format&fit=crop 1920w',
    ],
    alt: 'Speaker presenting on stage at a tech event',
  },
  {
    src: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&q=80&auto=format&fit=crop',
    srcSet: [
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=640&q=80&auto=format&fit=crop 640w',
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=960&q=80&auto=format&fit=crop 960w',
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&q=80&auto=format&fit=crop 1200w',
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1920&q=80&auto=format&fit=crop 1920w',
    ],
    alt: 'Workshop participants collaborating together',
  },
  {
    src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80&auto=format&fit=crop',
    srcSet: [
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=640&q=80&auto=format&fit=crop 640w',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=960&q=80&auto=format&fit=crop 960w',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80&auto=format&fit=crop 1200w',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920&q=80&auto=format&fit=crop 1920w',
    ],
    alt: 'Celebration event with vibrant lighting',
  },
];

export const Slider = () => {
  const [current, setCurrent] = useState(0);
  const length = slides.length;

  /* ---- navigation ---- */
  const nextSlide = useCallback(
    () => setCurrent((prev) => (prev === length - 1 ? 0 : prev + 1)),
    [length]
  );
  const prevSlide = useCallback(
    () => setCurrent((prev) => (prev === 0 ? length - 1 : prev - 1)),
    [length]
  );

  /* ---- auto-play (5 s interval) ---- */
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  /* ---- keyboard a11y ---- */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [nextSlide, prevSlide]);

  if (!slides.length) return null;

  const { src, srcSet, alt } = slides[current];

  return (
    <div className="slider-outer" role="region" aria-roledescription="carousel" aria-label="Event highlights">
      <div className="slider-viewport">
        {/* Previous */}
        <button
          className="slider-btn slider-btn--prev"
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          <ChevronLeft size={22} strokeWidth={2.5} />
        </button>

        {/* Image */}
        <div className="slider-img-wrap">
          <img
            key={current}
            src={src}
            srcSet={srcSet.join(', ')}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
            width={1200}
            height={600}
            alt={alt}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="slider-img"
          />
        </div>

        {/* Next */}
        <button
          className="slider-btn slider-btn--next"
          onClick={nextSlide}
          aria-label="Next slide"
        >
          <ChevronRight size={22} strokeWidth={2.5} />
        </button>

        {/* Dots */}
        <div className="slider-dots">
          {slides.map((_, idx) => (
            <button
              key={idx}
              className={`slider-dot ${idx === current ? 'slider-dot--active' : ''}`}
              onClick={() => setCurrent(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              aria-current={idx === current ? 'true' : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
