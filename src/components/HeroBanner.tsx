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
    <section className="relative min-h-[85vh] overflow-hidden">
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

      <div className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col justify-center px-4 py-20 lg:px-8">
        <div className="max-w-2xl">
          <Badge variant="gold" className="mb-6 animate-fade-in">
            <Sparkles className="h-3 w-3" />
            B2B · Cash & Carry · Wesseling
          </Badge>

          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl text-balance">
            {t("hero_title")}
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-300">
            {t("hero_subtitle")}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/products">
              <Button size="lg" className="shadow-xl shadow-gold/20">
                {t("hero_cta")}
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="secondary">
                {t("hero_cta_register")}
              </Button>
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/40 px-4 py-3 backdrop-blur-sm">
              <MapPin className="h-5 w-5 shrink-0 text-gold" />
              <div>
                <p className="text-xs text-gray-500">Standort</p>
                <p className="text-sm font-medium text-white">Wesseling</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/40 px-4 py-3 backdrop-blur-sm">
              <Clock className="h-5 w-5 shrink-0 text-gold" />
              <div>
                <p className="text-xs text-gray-500">{t("footer_hours")}</p>
                <p className="text-sm font-medium text-white">
                  {t("footer_hours_value")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/40 px-4 py-3 backdrop-blur-sm">
              <ShieldCheck className="h-5 w-5 shrink-0 text-gold" />
              <div>
                <p className="text-xs text-gray-500">B2B</p>
                <p className="text-sm font-medium text-white">
                  {t("footer_b2b_note").slice(0, 32)}…
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
