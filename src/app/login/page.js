"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import Card, { CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
  Dumbbell,
  Users,
  CalendarDays,
  CreditCard,
  BarChart3,
  Star,
} from "lucide-react";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "E-posta gereklidir")
    .email("Geçerli bir e-posta girin"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
});

export default function LoginPage() {
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, authLoading, router]);

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Giriş başarısız. Lütfen tekrar deneyin.";
      toast.error(message);
    }
  };

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
      </div>
    );
  }

  if (isAuthenticated) return null;

  return (
    <div className="flex min-h-screen">
      {/* Left: Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-between bg-gradient-to-br from-brand via-primary-700 to-primary-900 p-12 text-white">
        <div>
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Dumbbell className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">PilatesFlow</span>
          </Link>
        </div>

        <div className="space-y-6">
          <h1 className="text-3xl font-bold leading-tight xl:text-4xl">
            Tekrar hoş geldiniz
          </h1>
          <p className="text-lg text-white/80">
            Stüdyonuzu yönetmeye kaldığınız yerden devam edin.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Users, label: "Üye Yönetimi" },
              { icon: CalendarDays, label: "Ders Programı" },
              { icon: CreditCard, label: "Ödeme Takibi" },
              { icon: BarChart3, label: "Raporlar" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm backdrop-blur-sm"
              >
                <Icon className="h-4 w-4 text-white/80" />
                <span className="text-white/90">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-white/10 p-5 backdrop-blur-sm">
          <div className="flex gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="h-4 w-4 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
          <p className="text-sm italic text-white/90">
            &ldquo;PilatesFlow ile stüdyomuzun verimliliği inanılmaz arttı. Her
            şeyi tek yerden yönetmek harika.&rdquo;
          </p>
          <p className="mt-2 text-xs text-white/60">
            — Elif K., Core Pilates Studio
          </p>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex w-full items-center justify-center px-4 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Mobile branding */}
          <div className="mb-8 text-center lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand">
                <Dumbbell className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                PilatesFlow
              </span>
            </Link>
          </div>

          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900">Giriş Yap</h2>
            <p className="mt-1 text-sm text-gray-500">
              Yönetim paneline erişin
            </p>
          </div>

          <Card>
            <CardContent className="pt-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <Input
                  label="E-posta"
                  type="email"
                  placeholder="ornek@email.com"
                  error={errors.email?.message}
                  {...register("email")}
                />

                <Input
                  label="Şifre"
                  type="password"
                  placeholder="••••••••"
                  error={errors.password?.message}
                  {...register("password")}
                />

                <Button
                  type="submit"
                  loading={isSubmitting}
                  className="w-full"
                  size="lg"
                >
                  Giriş Yap
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Hesabınız yok mu?{" "}
                  <Link
                    href="/register"
                    className="font-medium text-brand hover:text-brand-dark"
                  >
                    Ücretsiz deneyin
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
