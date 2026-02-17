"use client";
import Image from "next/image";
import { useState } from "react";

interface LogoImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

export function LogoImage({
  src,
  alt,
  width,
  height,
  className = ""
}: LogoImageProps) {
  const [hasError, setHasError] = useState(false);
  const isSvg = src.endsWith('.svg');

  const handleError = () => {
    setHasError(true);
  };

  // SVG는 Next.js Image 최적화 없이 직접 렌더링 (더 빠름)
  if (isSvg && !hasError) {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onError={handleError}
        loading="lazy"
      />
    );
  }

  if (hasError) {
    return (
      <svg className={`${className} text-gray-400`} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
      </svg>
    );
  }

  // PNG/JPG 등 래스터 이미지는 Next.js Image 사용
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
      loading="lazy"
      quality={90}
      unoptimized={false}
    />
  );
}
