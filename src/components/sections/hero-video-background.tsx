
"use client";

import { useIsMobile } from '@/hooks/use-mobile';
import { useScroll, useTransform, motion } from 'framer-motion';
import Image from 'next/image';
import React, { useRef, useState, useEffect } from 'react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const posterImage = PlaceHolderImages.find(img => img.id === 'hero-poster');
const posterImageUrl = posterImage?.imageUrl || "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=1080";

// Updated to the specific requested HP Enterprise video
const HERO_VIDEO_URL = "/HP_ZBook_Fury_G1i_1080P.mp4";

const VideoElement = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 100], { clamp: false });
    const scale = useTransform(scrollY, [0, 500], [1, 1.1]);

    useEffect(() => {
        const attemptPlay = () => {
            if (videoRef.current) {
                videoRef.current.play().catch(error => {
                    console.warn("Autoplay was prevented by browser security policy. Interaction may be required.", error);
                });
            }
        };

        // Attempt immediate play
        attemptPlay();

        // Backup: attempt play on first user interaction if blocked
        const handleInteraction = () => {
            attemptPlay();
            document.removeEventListener('click', handleInteraction);
            document.removeEventListener('keydown', handleInteraction);
        };

        document.addEventListener('click', handleInteraction);
        document.addEventListener('keydown', handleInteraction);

        return () => {
            document.removeEventListener('click', handleInteraction);
            document.removeEventListener('keydown', handleInteraction);
        };
    }, []);

    return (
        <motion.div 
            className="absolute inset-0 overflow-hidden z-0"
            style={{ y, scale }}
        >
            <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="absolute w-full h-full object-cover"
                style={{
                    filter: `brightness(0.8) contrast(1.05) saturate(0.9)`
                }}
                poster={posterImageUrl}
            >
                <source src={HERO_VIDEO_URL} type="video/mp4" />
            </video>
        </motion.div>
    );
};

const FallbackImage = () => {
    if (!posterImage) return <div className="absolute inset-0 bg-black -z-10" />;
    
    return (
        <div className="absolute inset-0 -z-10">
            <Image
                src={posterImage.imageUrl}
                alt={posterImage.description}
                fill
                className="object-cover opacity-40"
                data-ai-hint={posterImage.imageHint}
                priority
            />
        </div>
    );
};

export const HeroVideoBackground = () => {
    const isMobile = useIsMobile();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="absolute inset-0 bg-black z-0" />;

    return (
        <div className="absolute inset-0 w-full h-full z-0">
            {!isMobile ? <VideoElement /> : <FallbackImage />}
            
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/10 via-transparent to-background/10" />
            
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent animate-scanline" />
            </div>
        </div>
    );
};
