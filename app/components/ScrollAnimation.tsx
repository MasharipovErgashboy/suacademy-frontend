"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollAnimationProps {
    children: ReactNode;
    className?: string;
    direction?: "up" | "left" | "right" | "none";
    delay?: number;
    duration?: number;
    viewport?: { once: boolean; amount: number };
}

export default function ScrollAnimation({
    children,
    className = "",
    direction = "up",
    delay = 0,
    duration = 0.5,
    viewport = { once: true, amount: 0.3 }
}: ScrollAnimationProps) {
    const getVariants = () => {
        const distance = 50;

        const initial = {
            opacity: 0,
            y: direction === "up" ? distance : 0,
            x: direction === "left" ? -distance : direction === "right" ? distance : 0,
        };

        const animate = {
            opacity: 1,
            y: 0,
            x: 0,
        };

        return { initial, animate };
    };

    const variants = getVariants();

    return (
        <motion.div
            className={className}
            initial={variants.initial}
            whileInView={variants.animate}
            viewport={viewport}
            transition={{
                duration,
                delay,
                ease: "easeOut"
            }}
        >
            {children}
        </motion.div>
    );
}
