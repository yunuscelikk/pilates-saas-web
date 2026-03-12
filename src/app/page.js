import Navbar from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
import SocialProof from "@/components/landing/social-proof";
import Features from "@/components/landing/features";
import ProductPreview from "@/components/landing/product-preview";
import HowItWorks from "@/components/landing/how-it-works";
import Pricing from "@/components/landing/pricing";
import Testimonials from "@/components/landing/testimonials";
import FAQ from "@/components/landing/faq";
import CTA from "@/components/landing/cta";
import Footer from "@/components/landing/footer";

export const metadata = {
  title: "PilatesFlow — Pilates Stüdyo Yönetim Platformu",
  description:
    "Üyelerinizi, ders programınızı, rezervasyonlarınızı ve ödemelerinizi tek bir platformdan yönetin.",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <SocialProof />
      <Features />
      <ProductPreview />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}
