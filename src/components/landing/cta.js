"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/ui/button";
import AnimatedButton from "@/components/landing/motion/animated-button";
import AnimatedSection from "@/components/landing/motion/animated-section";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <AnimatedSection variant="scaleIn">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand to-brand-dark px-8 py-16 text-center sm:px-16">
            <div className="animate-gradient absolute inset-0 bg-gradient-to-r from-brand via-primary-400 to-brand-dark bg-[length:200%_100%]" />
            <div className="relative">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Stüdyonuzu dijitalleştirmeye
                <br />
                bugün başlayın
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-white/90">
                14 gün ücretsiz deneyin. Kredi kartı gerekmez, kurulum yok,
                anında başlayın.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/register">
                  <AnimatedButton>
                    <motion.div
                      animate={{
                        boxShadow: [
                          "0 0 0 0 rgba(255, 255, 255, 0.4)",
                          "0 0 0 12px rgba(255, 255, 255, 0)",
                        ],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                      className="rounded-lg"
                    >
                      <Button
                        size="lg"
                        className="border-white bg-white px-8 text-base text-brand-dark hover:bg-brand-light"
                      >
                        Ücretsiz Deneyin
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </AnimatedButton>
                </Link>
                <AnimatedButton>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/30 px-8 text-base text-white hover:bg-white/10"
                  >
                    Demo Talep Et
                  </Button>
                </AnimatedButton>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
