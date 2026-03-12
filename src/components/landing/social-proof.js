"use client";

import { Users, CalendarCheck, CreditCard } from "lucide-react";
import AnimatedSection from "@/components/landing/motion/animated-section";
import StaggerContainer, {
  StaggerItem,
} from "@/components/landing/motion/stagger-container";

const stats = [
  { label: "Aktif Stüdyo", value: "150+", icon: Users },
  { label: "İşlenen Rezervasyon", value: "50.000+", icon: CalendarCheck },
  { label: "Yönetilen Ödeme", value: "₺2M+", icon: CreditCard },
];

export default function SocialProof() {
  return (
    <section className="border-y border-gray-200 bg-gray-50/50 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <AnimatedSection variant="fadeIn">
          <p className="mb-8 text-center text-sm font-medium text-gray-500">
            Türkiye&apos;nin önde gelen pilates stüdyoları tarafından tercih
            ediliyor
          </p>
        </AnimatedSection>
        <StaggerContainer className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {stats.map((stat) => (
            <StaggerItem key={stat.label}>
              <div className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-6 text-center shadow-sm">
                <stat.icon className="h-6 w-6 text-brand" />
                <span className="text-3xl font-bold text-gray-900">
                  {stat.value}
                </span>
                <span className="text-sm text-gray-500">{stat.label}</span>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
