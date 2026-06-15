"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  MapPin,
  Clock,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";
import { heroBannerImage } from "@/data/productImages";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function HeroBanner() {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-[62vh] overflow-hidden sm:min-h-[75vh] lg:min-h-[85vh]">
      <Image
        src={heroBannerImage}
        alt="Alagetränke Getränke Großhandel"
        fill
        priority
        className="object-cover object-center scale-105"
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(196,150,52,0.18)_0%,transparent_55%)]" />

      <div className="absolute right-0 top-0 hidden h-full w-1/3 border-l border-gold/10 bg-gradient-to-l from-gold/5 to-transparent lg:block" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="relative mx-auto flex min-h-[62vh] max-w-7xl flex-col justify-center px-4 py-14 sm:min-h-[75vh] sm:py-20 lg:min-h-[85vh] lg:px-8">
        <div className="max-w-2xl">
          <Badge variant="gold" className="mb-4 sm:mb-6 animate-fade-in text-xs sm:text-sm">
            <Sparkles className="h-3 w-3" />
            B2B · Cash & Carry · Wesseling
          </Badge>

          <h1 className="text-[1.75rem] font-bold leading-[1.15] tracking-tight text-white sm:text-4xl lg:text-6xl text-balance">
            {t("hero_title")}
          </h1>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-300 sm:mt-6 sm:text-lg">
            {t("hero_subtitle")}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-4">
            <Link href="/products" className="w-full sm:w-auto">
              <Button size="lg" className="w-full shadow-xl shadow-gold/20 sm:w-auto">
                {t("hero_cta")}
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                {t("hero_cta_register")}
              </Button>
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:mt-12 sm:grid-cols-3 sm:gap-4">
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 backdrop-blur-sm sm:px-4 sm:py-3">
              <MapPin className="h-4 w-4 shrink-0 text-gold sm:h-5 sm:w-5" />
              <div className="min-w-0">
                <p className="text-[10px] text-gray-500 sm:text-xs">Standort</p>
                <p className="text-sm font-medium text-white">Wesseling</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 backdrop-blur-sm sm:px-4 sm:py-3">
              <Clock className="h-4 w-4 shrink-0 text-gold sm:h-5 sm:w-5" />
              <div className="min-w-0">
                <p className="text-[10px] text-gray-500 sm:text-xs">{t("footer_hours")}</p>
                <p className="text-xs font-medium text-white sm:text-sm">
                  {t("footer_hours_value")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 backdrop-blur-sm sm:px-4 sm:py-3">
              <ShieldCheck className="h-4 w-4 shrink-0 text-gold sm:h-5 sm:w-5" />
              <div className="min-w-0">
                <p className="text-[10px] text-gray-500 sm:text-xs">B2B</p>
                <p className="text-xs font-medium text-white line-clamp-2 sm:text-sm">
                  {t("footer_b2b_note")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 lg:flex">
        <div className="h-10 w-6 rounded-full border border-white/20 p-1">
          <div className="h-2 w-full animate-bounce rounded-full bg-gold" />
        </div>
      </div>
    </section>
  );
}
