"use client";

import React, { useEffect, useState } from 'react';

export default function JapaneseLiveBackground() {
  const [petals, setPetals] = useState<number[]>([]);

  useEffect(() => {
    setPetals(Array.from({ length: 35 }, (_, i) => i));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-rose-50 via-white to-sky-50 pointer-events-none">

      {/* Central Rotating Japanese Crest / 'Mandala' Equivalent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] opacity-20 animate-spin-slow">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-rose-300">
          {/* Stylized Japanese 'Asanoha' or Radial Pattern */}
          <g fill="none" stroke="currentColor" strokeWidth="0.5">
            <circle cx="100" cy="100" r="90" />
            <circle cx="100" cy="100" r="60" />
            {/* Radial Lines */}
            {[...Array(12)].map((_, i) => (
              <line key={i} x1="100" y1="100" x2="100" y2="10" transform={`rotate(${i * 30} 100 100)`} />
            ))}
            {/* Intersecting Arcs for 'Seigaiha' feel */}
            <circle cx="100" cy="100" r="30" strokeOpacity="0.5" />
            <rect x="40" y="40" width="120" height="120" rx="10" transform="rotate(45 100 100)" strokeOpacity="0.3" />
          </g>
        </svg>
      </div>

      {/* Floating Ornaments - Gentle Glows */}
      <div className="absolute top-[-50px] right-[-50px] w-64 h-64 border-[1px] border-rose-400/20 rounded-full animate-pulse blur-xl opacity-40"></div>
      <div className="absolute bottom-[-100px] left-[-50px] w-96 h-96 border-[1px] border-sky-300/20 rounded-full animate-pulse animation-delay-2000 blur-xl opacity-40"></div>

      {/* Atmospheric Fog/Gradient - Light */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white/80 to-transparent"></div>

      {/* Falling Sakura Petals */}
      {petals.map((i) => {
        const size = Math.random() * 12 + 6;
        const left = Math.random() * 100;
        const delay = Math.random() * 8;
        const duration = Math.random() * 12 + 10;

        return (
          <div
            key={i}
            className="petal absolute"
            style={{
              left: `${left}%`,
              width: `${size}px`,
              height: `${size}px`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
              opacity: Math.random() * 0.5 + 0.4,
            }}
          >
            <svg viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-pink-400 drop-shadow-sm">
              <path d="M15 0C15 0 18.5 8 25 10C31.5 12 30 20 20 22C10 24 10 16 10 16C10 16 5 18 0 15C-5 12 8 5 15 0Z" fill="currentColor" />
            </svg>
          </div>
        );
      })}

      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #e11d48 1px, transparent 0)`,
          backgroundSize: '30px 30px'
        }}>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 80s linear infinite;
        }
        .petal {
          top: -10%;
          animation-name: fall-sway;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @keyframes fall-sway {
          0% {
            top: -10%;
            transform: translateX(0) rotate(0deg);
          }
          50% {
             transform: translateX(40px) rotate(180deg);
          }
          100% {
            top: 110%;
            transform: translateX(-20px) rotate(360deg);
          }
        }
        .animation-delay-2000 {
            animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}
