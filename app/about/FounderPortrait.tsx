"use client";

import Image, { type ImageLoaderProps } from "next/image";

// 1080 is the closest configured Next.js size to the 1024px source.
// The optimizer preserves the source dimensions rather than upscaling it.
function founderLoader({ src, width, quality }: ImageLoaderProps) {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${Math.min(width, 1080)}&q=${quality ?? 90}`;
}

export default function FounderPortrait() {
  return (
    <Image
      src="/aleksandar-dimitrov-founder-2026.webp"
      alt="Aleksandar Dimitrov, Founder of Entimema"
      fill
      sizes="(max-width: 640px) calc(100vw - 36px), (max-width: 864px) 92vw, (max-width: 1279px) 39vw, 499px"
      quality={90}
      loading="lazy"
      loader={founderLoader}
    />
  );
}
