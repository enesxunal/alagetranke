"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Package } from "lucide-react";
import type { ProductCategory } from "@/types/database.types";
import { getCategoryFallbackImage } from "@/data/productImages";

interface ProductImageProps {
  src: string;
  alt: string;
  category: ProductCategory;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
}

export function ProductImage({
  src,
  alt,
  category,
  className = "object-cover",
  sizes,
  priority,
  fill = true,
}: ProductImageProps) {
  const fallback = getCategoryFallbackImage(category);
  const [imgSrc, setImgSrc] = useState(src || fallback);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setImgSrc(src || fallback);
    setFailed(false);
  }, [src, fallback]);

  if (failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-black">
        <Package className="h-10 w-10 text-gold/40" />
      </div>
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      priority={priority}
      sizes={sizes}
      className={className}
      onError={() => {
        if (imgSrc !== fallback) {
          setImgSrc(fallback);
        } else {
          setFailed(true);
        }
      }}
    />
  );
}
