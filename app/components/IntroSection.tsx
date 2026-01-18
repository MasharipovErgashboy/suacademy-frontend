"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface IntroData {
    id: number;
    title: string;
    content: string;
    youtube_video_url: string;
}

export default function IntroSection() {
    const [intro, setIntro] = useState<IntroData | null>(null);
    const [loading, setLoading] = useState(true);
    const [nationality, setNationality] = useState<string>("uz");

    useEffect(() => {
        const saved = localStorage.getItem("nationality");
        if (saved) setNationality(saved);
    }, []);

    useEffect(() => {
        axios
            .get("http://127.0.0.1:8000/home/intro/", {
                headers: {
                    "Accept-Language": nationality,
                },
            })
            .then((res) => {
                setIntro(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Intro error:", err);
                setLoading(false);
            });
    }, [nationality]);

    if (loading) {
        return (
            <div className="grid md:grid-cols-2 gap-8 animate-pulse">
                <div className="bg-gray-100 h-64 rounded-2xl"></div>
                <div className="bg-gray-100 h-64 rounded-2xl"></div>
            </div>
        );
    }

    if (!intro) {
        return null;
    }

    // Extract YouTube video ID
    const getYouTubeId = (url: string) => {
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^?&"'>]+)/);
        return match ? match[1] : null;
    };

    const videoId = getYouTubeId(intro.youtube_video_url);

    const isUz = nationality === "uz";

    return (
        <div className="grid md:grid-cols-2 gap-8 items-start py-8">
            {/* Video Section - Custom Styled */}
            <div className={`relative rounded-3xl overflow-hidden shadow-2xl p-[4px] ${isUz ? "bg-gradient-to-br from-blue-500 to-purple-600" : "bg-gradient-to-br from-[#FE9B19] to-red-600"}`}>
                <div className="relative rounded-[22px] overflow-hidden bg-black">
                    {videoId ? (
                        <div className="relative w-full aspect-video group">
                            {/* YouTube iframe with hidden controls */}
                            <iframe
                                className="w-full h-full scale-[1.02]"
                                src={`https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0&controls=1&fs=1&iv_load_policy=3&cc_load_policy=0&autohide=1`}
                                title="Video Player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>

                            {/* Custom gradient overlay */}
                            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/30 via-transparent to-black/20"></div>
                        </div>
                    ) : (
                        <div className="w-full aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-white/50" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                                    </svg>
                                </div>
                                <p className="text-white/70 text-sm">Video mavjud emas</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Content Section */}
            <div className="space-y-6">
                <h2 className="text-3xl md:text-5xl font-black leading-tight tracking-tight">
                    <span className={isUz ? "text-[#008BE2]" : "text-[#FE9B19]"}>
                        {intro.title.split(" ")[0]}
                    </span>{" "}
                    <span className="text-slate-900">{intro.title.split(" ").slice(1).join(" ")}</span>
                </h2>
                <div className="text-slate-600 text-lg leading-relaxed space-y-4 font-medium">
                    {intro.content.split('\n').map((paragraph, idx) => (
                        <p key={idx}>{paragraph.replace(/"/g, '')}</p>
                    ))}
                </div>
                <button
                    onClick={() => window.location.href = "/lessons"}
                    className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95 ${isUz ? "bg-blue-600 shadow-blue-200" : "bg-[#FE9B19] shadow-orange-200"}`}
                >
                    {isUz ? "Batafsil ma'lumot" : "詳細情報"}
                </button>
            </div>
        </div>
    );
}
