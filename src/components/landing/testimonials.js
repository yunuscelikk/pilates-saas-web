"use client";

import { motion } from "framer-motion";
import Card, { CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import AnimatedSection from "@/components/landing/motion/animated-section";
import StaggerContainer, {
  StaggerItem,
} from "@/components/landing/motion/stagger-container";

const testimonials = [
  {
    name: "Ayşe Yılmaz",
    role: "Stüdyo Sahibi, FlowPilates",
    quote:
      "PilatesFlow ile stüdyomuzu yönetmek çok kolaylaştı. Üye takibi, ders planlaması ve ödemeler tek platformda.",
    initials: "AY",
  },
  {
    name: "Mehmet Kaya",
    role: "Stüdyo Müdürü, CoreBalance",
    quote:
      "Eskiden Excel ile saatler harcıyorduk. Şimdi tüm raporlar bir tıkla hazır. Müthiş bir zaman tasarrufu.",
    initials: "MK",
  },
  {
    name: "Zeynep Demir",
    role: "Stüdyo Sahibi, ZenPilates",
    quote:
      "Müşterilerimiz online rezervasyon yapabilmeyi çok seviyor. Stüdyomuzun profesyonel görünümüne katkı sağladı.",
    initials: "ZD",
  },
  {
    name: "Can Öztürk",
    role: "Eğitmen & Kurucu, PilatesHub",
    quote:
      "Birden fazla şubemizi tek panelden yönetebiliyoruz. Finansal raporlar sayesinde büyüme stratejimizi net görebiliyoruz.",
    initials: "CÖ",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <AnimatedSection className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-2 text-sm font-semibold text-brand">
            Müşteri Yorumları
          </p>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Stüdyo sahiplerinin gözünden
          </h2>
        </AnimatedSection>
        <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {testimonials.map((t) => (
            <StaggerItem key={t.name}>
              <motion.div
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
              >
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="mb-4 flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <blockquote className="mb-6 text-sm leading-relaxed text-gray-600">
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>
                    <div className="flex items-center gap-3">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-light text-sm font-semibold text-primary-800"
                      >
                        {t.initials}
                      </motion.div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {t.name}
                        </p>
                        <p className="text-xs text-gray-500">{t.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
