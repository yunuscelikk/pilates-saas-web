"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  Check,
} from "lucide-react";

const registerSchema = z
  .object({
    firstName: z.string().min(1, "Ad gereklidir"),
    lastName: z.string().min(1, "Soyad gereklidir"),
    email: z
      .string()
      .min(1, "E-posta gereklidir")
      .email("Geçerli bir e-posta girin"),
    password: z.string().min(8, "Şifre en az 8 karakter olmalıdır"),
    passwordConfirm: z.string().min(1, "Şifre tekrarı gereklidir"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Şifreler eşleşmiyor",
    path: ["passwordConfirm"],
  });

const features = [
  { icon: Users, text: "Üye yönetimi" },
  { icon: CalendarDays, text: "Ders programı & rezervasyon" },
  { icon: CreditCard, text: "Ödeme takibi" },
  { icon: BarChart3, text: "Detaylı raporlama" },
];

export default function RegisterPage() {
  const {
    register: authRegister,
    isAuthenticated,
    isLoading: authLoading,
  } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push("/onboarding");
    }
  }, [isAuthenticated, authLoading, router]);

  const onSubmit = async (data) => {
    try {
      await authRegister({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });
    } catch (err) {
      const message =
        err.response?.data?.error || "Kayıt başarısız. Lütfen tekrar deneyin.";
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
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand via-primary-700 to-primary-900 p-12 text-white flex-col justify-between">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Dumbbell className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">PilatesFlow</span>
          </Link>
        </div>

        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold leading-tight xl:text-4xl">
              Stüdyonuzu profesyonelce yönetin
            </h1>
            <p className="mt-4 text-lg text-white/80">
              14 gün ücretsiz deneyin. Kredi kartı gerekmez.
            </p>
          </div>

          <div className="space-y-4">
            {features.map((feature) => (
              <div key={feature.text} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
                  <feature.icon className="h-4 w-4" />
                </div>
                <span className="text-white/90">{feature.text}</span>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-white/10 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white/20 bg-white/15 text-xs font-medium"
                  >
                    {["A", "B", "C"][i - 1]}
                  </div>
                ))}
              </div>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg
                    key={i}
                    className="h-4 w-4 fill-yellow-400"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            <p className="text-sm text-white/90">
              &ldquo;PilatesFlow ile stüdyomuzun yönetimi çok kolaylaştı.
              Kesinlikle tavsiye ederim!&rdquo;
            </p>
            <p className="mt-2 text-xs text-white/60">— Ayşe Y., Zen Pilates</p>
          </div>
        </div>

        <p className="text-sm text-white/40">
          © 2026 PilatesFlow. Tüm hakları saklıdır.
        </p>
      </div>

      {/* Right Side - Form */}
      <div className="flex w-full items-center justify-center px-4 py-12 lg:w-1/2 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile branding */}
          <div className="mb-8 text-center lg:hidden">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand">
              <Dumbbell className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">PilatesFlow</h1>
            <p className="mt-1 text-sm text-gray-500">Hesabınızı oluşturun</p>
          </div>

          <div className="hidden lg:block mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Hesap oluşturun
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Hemen başlayın, 14 gün ücretsiz
            </p>
          </div>

          <Card>
            <CardContent className="pt-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Ad"
                    placeholder="Ahmet"
                    error={errors.firstName?.message}
                    {...register("firstName")}
                  />
                  <Input
                    label="Soyad"
                    placeholder="Yılmaz"
                    error={errors.lastName?.message}
                    {...register("lastName")}
                  />
                </div>

                <Input
                  label="E-posta"
                  type="email"
                  placeholder="ahmet@pilatesstudyo.com"
                  error={errors.email?.message}
                  {...register("email")}
                />

                <Input
                  label="Şifre"
                  type={showPassword ? "text" : "password"}
                  placeholder="En az 8 karakter"
                  error={errors.password?.message}
                  {...register("password")}
                />

                <Input
                  label="Şifre Tekrar"
                  type={showPassword ? "text" : "password"}
                  placeholder="Şifrenizi tekrar girin"
                  error={errors.passwordConfirm?.message}
                  {...register("passwordConfirm")}
                />

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    className="rounded border-gray-300 text-brand focus:ring-brand"
                  />
                  <span className="text-xs text-gray-500">
                    Şifreleri göster
                  </span>
                </label>

                <Button
                  type="submit"
                  loading={isSubmitting}
                  className="w-full"
                  size="lg"
                >
                  Ücretsiz Hesap Oluştur
                </Button>

                <div className="flex items-center gap-2 pt-1">
                  <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span className="text-xs text-gray-500">
                    14 gün ücretsiz deneme, kredi kartı gerekmez
                  </span>
                </div>
              </form>
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-sm text-gray-500">
            Zaten hesabınız var mı?{" "}
            <Link
              href="/login"
              className="font-medium text-brand hover:text-brand-dark"
            >
              Giriş yapın
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
