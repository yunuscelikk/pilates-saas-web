"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Button from "@/components/ui/button";
import AnimatedButton from "@/components/landing/motion/animated-button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu, Dumbbell } from "lucide-react";

const navLinks = [
  { label: "Özellikler", href: "#features" },
  { label: "Fiyatlandırma", href: "#pricing" },
  { label: "SSS", href: "#faq" },
];

function NavLink({ href, label, onClick }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="group relative text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
    >
      {label}
      <motion.span
        className="absolute -bottom-1 left-0 h-0.5 w-full origin-left bg-brand"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      />
    </a>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  const scrollTo = (e, href) => {
    e.preventDefault();
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      className="sticky top-0 z-50 border-b backdrop-blur-lg"
      animate={{
        backgroundColor: scrolled
          ? "rgba(255, 255, 255, 0.95)"
          : "rgba(255, 255, 255, 0.8)",
        borderColor: scrolled
          ? "rgba(229, 231, 235, 0.8)"
          : "rgba(229, 231, 235, 0.6)",
        boxShadow: scrolled
          ? "0 1px 3px 0 rgba(0, 0, 0, 0.06)"
          : "0 0 0 0 rgba(0, 0, 0, 0)",
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand">
            <Dumbbell className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">PilatesFlow</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
              onClick={(e) => scrollTo(e, link.href)}
            />
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login">
            <AnimatedButton>
              <Button variant="ghost" size="sm">
                Giriş Yap
              </Button>
            </AnimatedButton>
          </Link>
          <Link href="/register">
            <AnimatedButton>
              <Button size="sm">Ücretsiz Dene</Button>
            </AnimatedButton>
          </Link>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
          onClick={() => setOpen(true)}
          aria-label="Menüyü Aç"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="right" className="w-72 p-6">
            <SheetHeader className="mb-8">
              <SheetTitle>
                <Link
                  href="/"
                  className="flex items-center gap-2"
                  onClick={() => setOpen(false)}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand">
                    <Dumbbell className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-lg font-bold">PilatesFlow</span>
                </Link>
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => scrollTo(e, link.href)}
                  className="text-base font-medium text-gray-700 hover:text-gray-900"
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-4 flex flex-col gap-3 border-t border-gray-200 pt-4">
                <Link href="/login" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Giriş Yap
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setOpen(false)}>
                  <Button className="w-full">Ücretsiz Dene</Button>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </motion.nav>
  );
}
