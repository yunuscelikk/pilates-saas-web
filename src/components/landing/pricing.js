"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { Check } from "lucide-react";
import AnimatedSection from "@/components/landing/motion/animated-section";
import AnimatedButton from "@/components/landing/motion/animated-button";
import StaggerContainer, {
  StaggerItem,
} from "@/components/landing/motion/stagger-container";

const plans = [
  {
    name: "Başlangıç",
    price: "₺499",
    period: "/ay",
    description: "Küçük stüdyolar için ideal başlangıç.",
    features: [
      "50 üyeye kadar",
      "5 sınıf tanımı",
      "Temel raporlama",
      "E-posta bildirimleri",
      "1 personel hesabı",
    ],
    cta: "Ücretsiz Dene",
    popular: false,
  },
  {
    name: "Profesyonel",
    price: "₺999",
    period: "/ay",
    description: "Büyüyen stüdyolar için tam özellik seti.",
    features: [
      "Sınırsız üye",
      "Sınırsız sınıf",
      "Gelişmiş raporlama",
      "SMS & e-posta bildirimleri",
      "5 personel hesabı",
      "Öncelikli destek",
    ],
    cta: "Ücretsiz Dene",
    popular: true,
  },
  {
    name: "Kurumsal",
    price: "₺1.999",
    period: "/ay",
    description: "Çoklu şube yönetimi ve özel çözümler.",
    features: [
      "Profesyonel tüm özellikler",
      "Çoklu stüdyo desteği",
      "API erişimi",
      "Özel entegrasyonlar",
      "Sınırsız personel",
      "7/24 öncelikli destek",
    ],
    cta: "İletişime Geç",
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-20 bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <AnimatedSection className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-2 text-sm font-semibold text-brand">Fiyatlandırma</p>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Stüdyonuza uygun planı seçin
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            14 gün ücretsiz deneyin, kredi kartı gerekmez.
          </p>
        </AnimatedSection>
        <StaggerContainer className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <StaggerItem key={plan.name}>
              <motion.div
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
              >
                <Card
                  className={`relative flex h-full flex-col ${plan.popular ? "border-brand shadow-lg shadow-brand/10 ring-1 ring-brand" : ""}`}
                >
                  {plan.popular && (
                    <motion.div
                      className="absolute -top-3 left-1/2 -translate-x-1/2"
                      animate={{
                        boxShadow: [
                          "0 0 0 0 rgba(98, 96, 225, 0.3)",
                          "0 0 20px 4px rgba(98, 96, 225, 0.15)",
                          "0 0 0 0 rgba(98, 96, 225, 0.3)",
                        ],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Badge variant="info" className="px-3 py-1 text-xs">
                        En Popüler
                      </Badge>
                    </motion.div>
                  )}
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    <p className="text-sm text-gray-500">{plan.description}</p>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col pt-0">
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-gray-900">
                        {plan.price}
                      </span>
                      <span className="text-gray-500">{plan.period}</span>
                    </div>
                    <ul className="mb-8 flex-1 space-y-3">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2 text-sm text-gray-600"
                        >
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link href="/register">
                      <AnimatedButton>
                        <Button
                          variant={plan.popular ? "primary" : "outline"}
                          className="w-full"
                        >
                          {plan.cta}
                        </Button>
                      </AnimatedButton>
                    </Link>
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
