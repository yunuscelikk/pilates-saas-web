"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import AnimatedSection from "@/components/landing/motion/animated-section";

const faqs = [
  {
    question: "Rezervasyon sistemi nasıl çalışıyor?",
    answer:
      "Üyeleriniz sisteme giriş yaparak müsait dersleri görebilir ve online rezervasyon yapabilir. Siz de admin panelden rezervasyonları onaylayabilir veya iptal edebilirsiniz.",
  },
  {
    question: "Birden fazla stüdyo yönetebilir miyim?",
    answer:
      "Evet, Kurumsal planımızla birden fazla stüdyoyu tek bir hesaptan yönetebilirsiniz. Her stüdyo için ayrı personel, sınıf ve üye kayıtları tutulur.",
  },
  {
    question: "Ücretsiz deneme süresi var mı?",
    answer:
      "Evet! Tüm planlarımızı 14 gün boyunca ücretsiz deneyebilirsiniz. Kredi kartı bilgisi gerekmez, deneme süresinin sonunda otomatik ücretlendirme yapılmaz.",
  },
  {
    question: "Üyeler derslere online kayıt olabilir mi?",
    answer:
      "Evet, üyeleriniz web arayüzü üzerinden müsait dersleri görebilir, filtre uygulayabilir ve anında rezervasyon yapabilir.",
  },
  {
    question: "Verilerim güvende mi?",
    answer:
      "Kesinlikle. Tüm verileriniz SSL şifreleme ile korunur, düzenli yedeklemeler yapılır ve KVKK uyumlu altyapımızla güvende tutulur.",
  },
  {
    question: "Destek nasıl sağlanıyor?",
    answer:
      "Başlangıç planında e-posta destek, Profesyonel planda öncelikli destek, Kurumsal planda ise 7/24 telefon ve canlı destek sunuyoruz.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="scroll-mt-20 bg-gray-50 py-20">
      <div className="mx-auto max-w-3xl px-6">
        <AnimatedSection className="mb-14 text-center">
          <p className="mb-2 text-sm font-semibold text-brand">SSS</p>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Sıkça Sorulan Sorular
          </h2>
        </AnimatedSection>
        <AnimatedSection variant="fadeIn" delay={0.2}>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </AnimatedSection>
      </div>
    </section>
  );
}
