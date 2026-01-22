"use client";

import React from 'react';

export default function UzbekLiveBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden bg-slate-900 pointer-events-none">

            {/* Background Gradient - Deep Turquoise/Blue */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#004e92] to-[#000428] opacity-100"></div>

            {/* Rotating Mandala / Geometric Pattern Center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-10 animate-spin-slow">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-amber-400">
                    {/* Simple representation of an 8-pointed star / girih pattern */}
                    <g fill="none" stroke="currentColor" strokeWidth="0.5">
                        <circle cx="100" cy="100" r="90" />
                        <circle cx="100" cy="100" r="70" />
                        <path d="M100 10 L190 100 L100 190 L10 100 Z" />
                        <path d="M100 10 L100 190 M10 100 L190 100" />
                        <rect x="36" y="36" width="128" height="128" transform="rotate(45 100 100)" />
                    </g>
                </svg>
            </div>

            {/* Floating Ornaments - Gold Accents */}
            <div className="absolute top-[-50px] right-[-50px] w-64 h-64 border-[20px] border-amber-500/10 rounded-full animate-float blur-sm"></div>
            <div className="absolute bottom-[-100px] left-[-50px] w-96 h-96 border-[40px] border-blue-500/10 rounded-full animate-float animation-delay-2000 blur-sm"></div>

            {/* Mosaic Grid Overlay */}
            <div className="absolute inset-0"
                style={{
                    backgroundImage: `linear-gradient(rgba(255, 215, 0, 0.05) 1px, transparent 1px),
             linear-gradient(90deg, rgba(255, 215, 0, 0.05) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                    maskImage: 'radial-gradient(circle, black 40%, transparent 100%)'
                }}>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>

            <style jsx global>{`
        @keyframes spin-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 120s linear infinite;
        }
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
        }
        .animate-float {
            animation: float 6s ease-in-out infinite;
        }
        .animation-delay-2000 {
            animation-delay: 2s;
        }
      `}</style>
        </div>
    );
}
