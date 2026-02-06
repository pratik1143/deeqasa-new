"use client";

import { useIsMobile } from '@/hooks/use-mobile';
import { useInView, useScroll, useTransform, motion } from 'framer-motion';
import Image from 'next/image';
import React, { useRef } from 'react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const posterImage = PlaceHolderImages.find(img => img.id === 'hero-poster');
const posterImageUrl = posterImage?.imageUrl || "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=1080";

const VideoBackground = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 100], { clamp: false });
    const scale = useTransform(scrollY, [0, 500], [1, 1.15]);

    return (
        <motion.div 
            className="absolute inset-0 overflow-hidden -z-10"
            style={{ y, scale }}
        >
            <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="absolute w-full h-full object-cover"
                style={{
                    filter: `brightness(0.9) contrast(1.1) saturate(1)`
                }}
                poster={posterImageUrl}
            >
                <source src="/HP_ZBook_Fury_G1i_1080P.mp4" type="video/mp4" />
            </video>
        </motion.div>
    );
};

const FallbackImage = () => {
    if (!posterImage) {
        return (
             <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-blue-50 to-purple-50 -z-10" />
        );
    }
    
    return (
        <div className="absolute inset-0 -z-10">
            <Image
                src={posterImage.imageUrl}
                alt={posterImage.description}
                fill
                className="object-cover opacity-80"
                data-ai-hint={posterImage.imageHint}
                priority
            />
        </div>
    );
};

export const HeroVideoBackground = () => {
    const isMobile = useIsMobile();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    const showVideo = !isMobile && isInView;

    return (
        <div ref={ref} className="absolute inset-0 w-full h-full">
            {showVideo ? <VideoBackground /> : <FallbackImage />}
            
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/20 via-transparent to-background/20" />
            
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent animate-scanline" />
            </div>
        </div>
    );
};