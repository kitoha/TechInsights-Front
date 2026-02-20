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
  // 40px 미만 소형 이미지는 blur placeholder 생성 비용이 이미지보다 커서 비활성화
  const useBlurPlaceholder = fill || (!!width && width >= 40 && !!height && height >= 40);
  const isValidSrc = src && src.trim() !== '' && !src.includes('null') && !src.includes('undefined');
  const [imgSrc, setImgSrc] = useState<string>(isValidSrc ? src : fallbackSrc);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

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
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg" />
      )}
      {fill ? (
        <Image
          src={imgSrc}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 224px"
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onError={handleError}
          onLoad={handleLoad}
          priority={priority}
          quality={85}
          {...(useBlurPlaceholder && {
            placeholder: "blur",
            blurDataURL: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=",
          })}
          unoptimized={imgSrc === fallbackSrc}
        />
      ) : (
        <Image
          src={imgSrc}
          alt={alt}
          width={width}
          height={height}
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onError={handleError}
          onLoad={handleLoad}
          priority={priority}
          quality={85}
          {...(useBlurPlaceholder && {
            placeholder: "blur",
            blurDataURL: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=",
          })}
          unoptimized={imgSrc === fallbackSrc}
        />
      )}
    </div>
  );
}
