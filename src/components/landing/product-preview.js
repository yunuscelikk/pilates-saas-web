"use client";

import { BarChart3, Users, CalendarDays } from "lucide-react";
import AnimatedSection from "@/components/landing/motion/animated-section";

const previews = [
  {
    icon: Users,
    title: "Üye Listesi",
    description:
      "Tüm üyelerinizi filtreleyip arayın. Aktif / pasif durumlarını tek tıkla yönetin.",
  },
  {
    icon: CalendarDays,
    title: "Rezervasyon Takvimi",
    description:
      "Günlük, haftalık ve aylık görünümlerle derslerinizi planlayın.",
  },
  {
    icon: BarChart3,
    title: "Gelir Dashboard",
    description:
      "Aylık gelir trendlerini, üyelik dağılımlarını ve performans metriklerini izleyin.",
  },
];

export default function ProductPreview() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <AnimatedSection className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-2 text-sm font-semibold text-brand">
            Ürün Önizleme
          </p>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Güçlü ve kullanımı kolay arayüz
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Modern tasarım, hızlı navigasyon ve akıllı veri yönetimi.
          </p>
        </AnimatedSection>

        <div className="space-y-16">
          {previews.map((preview, i) => (
            <AnimatedSection
              key={preview.title}
              variant={i % 2 === 0 ? "slideLeft" : "slideRight"}
            >
              <div
                className={`flex flex-col items-center gap-10 lg:flex-row ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
              >
                <div className="flex-1 space-y-4">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-light text-brand">
                    <preview.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {preview.title}
                  </h3>
                  <p className="text-base leading-relaxed text-gray-600">
                    {preview.description}
                  </p>
                </div>
                <div className="flex-1">
                  <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                    <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
                      <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                      <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                      <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                    </div>
                    <div className="p-6">
                      <div className="mb-4 h-4 w-32 rounded bg-gray-200" />
                      <div className="space-y-3">
                        {[1, 2, 3, 4].map((j) => (
                          <div key={j} className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-brand-light" />
                            <div className="h-3 flex-1 rounded bg-gray-100" />
                            <div className="h-6 w-16 rounded-full bg-green-50" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
