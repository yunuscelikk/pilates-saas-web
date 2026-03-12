"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/ui/button";
import AnimatedButton from "@/components/landing/motion/animated-button";
import ParallaxMockup from "@/components/landing/motion/parallax-mockup";
import { ArrowRight, Play } from "lucide-react";
import { fadeUp } from "@/lib/animations";

function delayed(delay) {
  return {
    ...fadeUp,
    visible: {
      ...fadeUp.visible,
      transition: { ...fadeUp.visible.transition, delay },
    },
  };
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-light/50 via-white to-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(98,96,225,0.12),transparent)]" />
      <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-20 text-center sm:pt-28 lg:pt-32">
        <div className="mx-auto max-w-3xl">
          <motion.div
            variants={delayed(0)}
            initial="hidden"
            animate="visible"
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-brand-light px-4 py-1.5 text-sm font-medium text-primary-800"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400/75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
            </span>
            Pilates stüdyoları için #1 yönetim platformu
          </motion.div>

          <motion.h1
            variants={delayed(0.1)}
            initial="hidden"
            animate="visible"
            className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl"
          >
            Stüdyonuzu tek bir
            <span className="bg-gradient-to-r from-brand to-primary-400 bg-clip-text text-transparent">
              {" "}
              platformdan{" "}
            </span>
            yönetin
          </motion.h1>

          <motion.p
            variants={delayed(0.2)}
            initial="hidden"
            animate="visible"
            className="mt-6 text-lg leading-relaxed text-gray-600 sm:text-xl"
          >
            Üyelerinizi, ders programınızı, rezervasyonlarınızı ve ödemelerinizi
            tek bir yerden yönetin. Daha az iş, daha çok pilates.
          </motion.p>

          <motion.div
            variants={delayed(0.3)}
            initial="hidden"
            animate="visible"
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link href="/register">
              <AnimatedButton>
                <Button size="lg" className="px-8 text-base">
                  Ücretsiz Deneyin
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </AnimatedButton>
            </Link>
            <AnimatedButton>
              <Button variant="outline" size="lg" className="px-8 text-base">
                <Play className="h-4 w-4" />
                Demo İzle
              </Button>
            </AnimatedButton>
          </motion.div>
        </div>

        {/* Product Mockup with Parallax */}
        <ParallaxMockup className="relative mx-auto mt-16 max-w-5xl sm:mt-20">
          <div className="rounded-xl border border-gray-200 bg-white p-2 shadow-2xl shadow-gray-900/10 ring-1 ring-gray-900/5">
            <div className="overflow-hidden rounded-lg bg-gray-100">
              <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
                <div className="ml-4 h-5 w-64 rounded bg-gray-200" />
              </div>
              <div className="grid grid-cols-12 gap-0">
                {/* Sidebar mockup */}
                <div className="col-span-3 border-r border-gray-200 bg-gray-900 p-4 sm:col-span-2">
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className={`h-3 rounded ${i === 1 ? "w-16 bg-brand" : "w-12 bg-gray-700"}`}
                      />
                    ))}
                  </div>
                </div>
                {/* Content mockup */}
                <div className="col-span-9 p-6 sm:col-span-10">
                  <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-gray-200 bg-white p-4"
                      >
                        <div className="mb-2 h-3 w-16 rounded bg-gray-200" />
                        <div className="h-6 w-12 rounded bg-brand-light" />
                      </div>
                    ))}
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-white p-4">
                    <div className="mb-4 h-3 w-24 rounded bg-gray-200" />
                    <div className="space-y-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="h-3 w-3 rounded bg-gray-200" />
                          <div className="h-3 flex-1 rounded bg-gray-100" />
                          <div className="h-3 w-16 rounded bg-gray-200" />
                          <div className="h-5 w-12 rounded-full bg-green-100" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -inset-x-20 -bottom-20 h-40 bg-gradient-to-t from-white to-transparent" />
        </ParallaxMockup>
      </div>
    </section>
  );
}
