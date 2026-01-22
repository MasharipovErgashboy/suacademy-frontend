"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import axios from "axios";
import { BACKEND_URL } from "../lib/auth";

interface SwiperItem {
    id: number;
    title: string;
    description: string;
    button_text: string | null;
    button_url: string | null;
    image: string;
    order: number;
}

export default function HeroSwiper() {
    const [slides, setSlides] = useState<SwiperItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [nationality, setNationality] = useState<string>("uz");

    useEffect(() => {
        const saved = localStorage.getItem("nationality");
        if (saved) setNationality(saved);
    }, []);

    useEffect(() => {
        axios
            .get(`${BACKEND_URL}/home/swiper/`, {
                headers: {
                    "Accept-Language": nationality,
                },
            })
            .then((res) => {
                setSlides(res.data.results || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Swiper error:", err);
                setLoading(false);
            });
    }, [nationality]);

    if (loading) {
        return (
            <div className="w-full h-64 bg-gray-100 animate-pulse rounded-2xl"></div>
        );
    }

    if (slides.length === 0) {
        return null;
    }

    const isUz = nationality === "uz";

    return (
        <div className="w-full rounded-2xl overflow-hidden shadow-lg">
            <Swiper
                modules={[Autoplay, Pagination]}
                spaceBetween={0}
                slidesPerView={1}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                className="hero-swiper"
            >
                {slides.map((slide) => {
                    const buttonText = slide.button_text?.trim();
                    const isDetailsButton = buttonText === "詳細情報" || buttonText === "Batafsil";
                    const targetUrl = isDetailsButton ? "/lessons" : slide.button_url;

                    return (
                        <SwiperSlide key={slide.id}>
                            <div
                                className="relative w-full h-64 md:h-80 lg:h-96 bg-cover bg-center"
                                style={{
                                    backgroundImage: `url(${BACKEND_URL}${slide.image})`,
                                }}
                            >
                                <div className={`absolute inset-0 flex items-start pt-8 md:pt-12 ${isUz ? "bg-gradient-to-r from-blue-900/90 to-transparent" : "bg-gradient-to-r from-[#FE9B19]/90 to-transparent"}`}>
                                    <div className="container mx-auto px-6 md:px-16 max-w-2xl">
                                        <h2 className="text-white text-2xl md:text-4xl lg:text-5xl font-bold mb-4 drop-shadow-md leading-tight">
                                            {slide.title}
                                        </h2>
                                        <p className="text-white/95 text-sm md:text-lg mb-6 md:mb-8 font-medium drop-shadow-sm line-clamp-3 md:line-clamp-none">
                                            {slide.description}
                                        </p>
                                        {slide.button_text && (
                                            <Link
                                                href={targetUrl || "#"}
                                                className={`inline-flex items-center gap-2 bg-white px-6 py-2 md:px-8 md:py-3 rounded-full font-bold transition-all transform hover:scale-105 shadow-xl text-sm md:text-base ${isUz ? "text-blue-600 hover:bg-blue-50" : "text-[#FE9B19] hover:bg-orange-50"}`}
                                            >
                                                {slide.button_text}
                                                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
            <style jsx global>{`
                .swiper-pagination-bullet-active {
                    background-color: ${isUz ? "#2563EB" : "#FE9B19"} !important;
                }
            `}</style>
        </div>
    );
}
