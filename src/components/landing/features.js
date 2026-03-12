"use client";

import Card, { CardContent } from "@/components/ui/card";
import {
  Users,
  CalendarDays,
  BookOpen,
  CreditCard,
  DollarSign,
  Bell,
} from "lucide-react";
import AnimatedSection from "@/components/landing/motion/animated-section";
import StaggerContainer, {
  StaggerItem,
} from "@/components/landing/motion/stagger-container";
import AnimatedCard from "@/components/landing/motion/animated-card";

const features = [
  {
    icon: Users,
    title: "Üye Yönetimi",
    description:
      "Üyeleri kaydedin, profillerini yönetin ve katılım geçmişlerini takip edin.",
    color: "bg-brand-light text-brand",
  },
  {
    icon: CalendarDays,
    title: "Ders Programlama",
    description:
      "Grup, özel ve yarı özel dersleri kolayca planlayın ve yönetin.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: BookOpen,
    title: "Online Rezervasyon",
    description:
      "Üyeleriniz derslere online rezervasyon yapsın, siz onaylayın.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: CreditCard,
    title: "Üyelik Takibi",
    description:
      "Paket bazlı, süre bazlı veya sınırsız üyelik planları oluşturun.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: DollarSign,
    title: "Ödeme & Gelir",
    description:
      "Ödemeleri kaydedin, gelir raporlarını görüntüleyin ve mali takip yapın.",
    color: "bg-rose-50 text-rose-600",
  },
  {
    icon: Bell,
    title: "Bildirim & Hatırlatma",
    description:
      "Otomatik bildirimlerle üyelerinizi ve personelinizi bilgilendirin.",
    color: "bg-cyan-50 text-cyan-600",
  },
];

export default function Features() {
  return (
    <section id="features" className="scroll-mt-20 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <AnimatedSection className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-2 text-sm font-semibold text-brand">
            Özellikler
          </p>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Stüdyonuz için ihtiyacınız olan her şey
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Tek platform üzerinden tüm operasyonlarınızı dijitalleştirin.
          </p>
        </AnimatedSection>
        <StaggerContainer className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <AnimatedCard key={feature.title}>
              <Card className="h-full">
                <CardContent className="p-6">
                  <div
                    className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg ${feature.color}`}
                  >
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </AnimatedCard>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
