"use client";

import { motion } from "framer-motion";
import AnimatedSection from "@/components/landing/motion/animated-section";
import { fadeUp, viewportConfig } from "@/lib/animations";

const steps = [
  {
    step: "01",
    title: "Stüdyonuzu Oluşturun",
    description:
      "Hesabınızı açın, stüdyo bilgilerinizi girin ve birkaç dakikada hazır olun.",
  },
  {
    step: "02",
    title: "Üye ve Ders Ekleyin",
    description:
      "Üyelerinizi kaydedin, sınıf programınızı oluşturun ve üyelik planlarınızı tanımlayın.",
  },
  {
    step: "03",
    title: "Otomatik Yönetin",
    description:
      "Rezervasyonlar, ödemeler ve bildirimler otomatik olarak yönetilsin.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <AnimatedSection className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-2 text-sm font-semibold text-brand">
            Nasıl Çalışır?
          </p>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            3 adımda stüdyonuzu dijitalleştirin
          </h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              variants={{
                ...fadeUp,
                visible: {
                  ...fadeUp.visible,
                  transition: {
                    ...fadeUp.visible.transition,
                    delay: i * 0.2,
                  },
                },
              }}
              initial="hidden"
              whileInView="visible"
              viewport={viewportConfig}
              className="relative text-center"
            >
              {i < steps.length - 1 && (
                <motion.div
                  className="absolute left-1/2 top-8 hidden h-0.5 w-full origin-left bg-gray-200 md:block"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={viewportConfig}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.2 + 0.3,
                    ease: "easeOut",
                  }}
                />
              )}
              <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand text-xl font-bold text-white shadow-lg shadow-brand/20">
                {step.step}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-600">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
