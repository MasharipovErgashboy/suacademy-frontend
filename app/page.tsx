"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [nationality, setNationality] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedNationality = localStorage.getItem("nationality");
    if (savedNationality) {
      setNationality(savedNationality);
      // Don't auto-redirect - let user stay on this page if they navigate back
    }
  }, []);

  const handleSelectNationality = (value: string) => {
    localStorage.setItem("nationality", value);
    setNationality(value);
    // Navigate to home page
    router.push("/home");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      {/* Logo / Title */}
      <h1 className="mb-8 text-4xl font-bold md:text-5xl lg:text-6xl tracking-tight">
        <span className="text-[#008BE2]">SU</span>{" "}
        <span className="text-[#FF9933]">Academy</span>
      </h1>

      {/* Main Illustration Container */}
      <div className="relative w-full max-w-2xl aspect-[16/9] mb-12 animate-in fade-in zoom-in duration-1000">
        <Image
          src="/illustration.jpg"
          alt="Education Illustration"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Selection Buttons */}
      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl px-4">
        <button
          onClick={() => handleSelectNationality("uz")}
          className="flex-1 bg-white text-[#008BE2] font-semibold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 border border-transparent hover:bg-[#008BE2] hover:text-white text-xl"
        >
          O&apos;zbeklar
        </button>
        <button
          onClick={() => handleSelectNationality("ja")}
          className="flex-1 bg-white text-[#FF9933] font-semibold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 border border-transparent hover:bg-[#FE9B19] hover:text-white text-xl"
        >
          日本人
        </button>
      </div>

      {/* Footer hint */}
      {nationality && (
        <p className="mt-8 text-zinc-500 text-sm italic">
          Tanlangan millat: {nationality === "uz" ? "O'zbek" : "Yapon"}
        </p>
      )}
    </div>
  );
}
