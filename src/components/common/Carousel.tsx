'use client'

import React, { useState, useEffect, useCallback } from 'react'

interface CarouselProps {
    children: React.ReactNode[]
    autoPlay?: boolean
    interval?: number
    showIndicators?: boolean
    showControls?: boolean
    className?: string
}

export const Carousel = ({
    children,
    autoPlay = true,
    interval = 5000,
    showIndicators = true,
    showControls = true,
    className = '',
}: CarouselProps) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isHovered, setIsHovered] = useState(false)

    const goToSlide = useCallback((index: number) => {
        setCurrentIndex(index)
    }, [])

    const goToPrevious = useCallback(() => {
        setCurrentIndex((prev) => (prev === 0 ? children.length - 1 : prev - 1))
    }, [children.length])

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev === children.length - 1 ? 0 : prev + 1))
    }, [children.length])

    // Auto-play functionality
    useEffect(() => {
        if (!autoPlay || isHovered) return

        const timer = setInterval(() => {
            goToNext()
        }, interval)

        return () => clearInterval(timer)
    }, [autoPlay, interval, isHovered, goToNext])

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') goToPrevious()
            if (e.key === 'ArrowRight') goToNext()
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [goToPrevious, goToNext])

    if (children.length === 0) return null

    return (
        <div
            className={`relative overflow-hidden ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Slides Container */}
            <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {children.map((child, index) => (
                    <div key={index} className="min-w-full">
                        {child}
                    </div>
                ))}
            </div>

            {/* Previous Button */}
            {showControls && children.length > 1 && (
                <button
                    onClick={goToPrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Previous slide"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                </button>
            )}

            {/* Next Button */}
            {showControls && children.length > 1 && (
                <button
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Next slide"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </button>
            )}

            {/* Indicators */}
            {showIndicators && children.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {children.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-2 h-2 rounded-full transition-all ${
                                index === currentIndex
                                    ? 'bg-accent-primary w-8'
                                    : 'bg-white/50 hover:bg-white/75'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Slide Counter */}
            <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {currentIndex + 1} / {children.length}
            </div>
        </div>
    )
}
