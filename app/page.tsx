"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ScrollAnimation from "./components/ScrollAnimation";

export default function Home() {
  const [nationality, setNationality] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedNationality = localStorage.getItem("nationality");
    if (savedNationality) {
      setNationality(savedNationality);
    }
  }, []);

  const handleSelectNationality = (value: string) => {
    localStorage.setItem("nationality", value);
    setNationality(value);
    router.push("/home");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#FFF4E6]">
      {/* Logo / Title */}
      <ScrollAnimation direction="up" duration={0.8}>
        <h1 className="mb-8 text-4xl font-bold md:text-5xl lg:text-6xl tracking-tight text-center">
          <span className="text-[#008BE2]">SU</span>{" "}
          <span className="text-[#FF9933]">Academy</span>
        </h1>
      </ScrollAnimation>

      {/* Main Illustration Container */}
      <ScrollAnimation direction="up" delay={0.2} duration={0.8} className="w-full max-w-2xl">
        <div className="relative w-full aspect-[16/9] mb-12">
          <Image
            src="/illustration.jpg"
            alt="Education Illustration"
            fill
            className="object-contain"
            priority
          />
        </div>
      </ScrollAnimation>

      {/* Selection Buttons */}
      <ScrollAnimation direction="up" delay={0.4} duration={0.8} className="w-full max-w-2xl px-4">
        <div className="flex flex-col sm:flex-row gap-6 w-full">
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
      </ScrollAnimation>

      {/* Footer hint */}
      {nationality && (
        <ScrollAnimation className="mt-8">
          <p className="text-zinc-500 text-sm italic">
            Tanlangan millat: {nationality === "uz" ? "O'zbek" : "Yapon"}
          </p>
        </ScrollAnimation>
      )}
    </div>
  );
}
