"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  priority?: boolean;
  // fill 모드: 부모가 크기를 잡고 이미지가 채우는 경우 (width/height 불필요)
  fill?: boolean;
  // 고정 크기 모드: fill이 false일 때 필요
  width?: number;
  height?: number;
}

export function OptimizedImage({
  src,
  alt,
  className = "",
  fallbackSrc = "/placeholder.svg",
  priority = false,
  fill = false,
  width,
  height,
}: OptimizedImageProps) {
  const useBlurPlaceholder = fill || (!!width && width >= 40 && !!height && height >= 40);
  const isValidSrc = src && src.trim() !== '' && !src.includes('null') && !src.includes('undefined');
  const isLogo = src && src.includes('/logos/');
  const [imgSrc, setImgSrc] = useState<string>(isValidSrc ? src : fallbackSrc);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const shouldPrioritize = priority || isLogo;

  useEffect(() => {
    const validSrc = src && src.trim() !== '' && !src.includes('null') && !src.includes('undefined');
    if (validSrc) {
      setImgSrc(src);
      setIsLoading(true);
      setHasError(false);
    } else {
      setImgSrc(fallbackSrc);
      setIsLoading(false);
      setHasError(false);
    }
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (imgSrc !== fallbackSrc && !hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
      setIsLoading(false);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg">
      {/* Skeleton Layer: Always rendered but fades out once loaded */}
      {!isLogo && (
        <div
          className={`absolute inset-0 bg-gray-100 dark:bg-gray-800 animate-pulse transition-opacity duration-500 z-10 ${isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
        />
      )}

      {fill ? (
        <Image
          src={imgSrc}
          alt={alt}
          fill
          sizes={isLogo ? "80px" : "(max-width: 768px) 100vw, 224px"}
          className={`${className} ${!isLogo && isLoading ? "scale-105 blur-sm opacity-0" : "scale-100 blur-0 opacity-100"
            } transition-all duration-500 ease-out`}
          onError={handleError}
          onLoad={handleLoad}
          priority={shouldPrioritize}
          quality={isLogo ? 100 : 85}
          {...(isLogo ? {} : useBlurPlaceholder ? {
            placeholder: "blur",
            blurDataURL: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=",
          } : {})}
          unoptimized={imgSrc === fallbackSrc || isLogo}
        />
      ) : (
        <Image
          src={imgSrc}
          alt={alt}
          width={width}
          height={height}
          className={`${className} ${!isLogo && isLoading ? "scale-105 blur-sm opacity-0" : "scale-100 blur-0 opacity-100"
            } transition-all duration-500 ease-out`}
          onError={handleError}
          onLoad={handleLoad}
          priority={shouldPrioritize}
          quality={isLogo ? 100 : 85}
          {...(isLogo ? {} : useBlurPlaceholder ? {
            placeholder: "blur",
            blurDataURL: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=",
          } : {})}
          unoptimized={imgSrc === fallbackSrc || isLogo}
        />
      )}
    </div>
  );
}
