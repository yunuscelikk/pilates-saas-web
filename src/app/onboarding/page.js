"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { settingsService } from "@/services/settings.service";
import { authService } from "@/services/auth.service";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import Card, { CardContent } from "@/components/ui/card";
import ToggleSwitch from "@/components/ui/toggle-switch";
import Spinner from "@/components/ui/spinner";
import Link from "next/link";
import {
  Dumbbell,
  Building2,
  Settings,
  PartyPopper,
  Check,
  ArrowRight,
  ArrowLeft,
  UserPlus,
  CalendarPlus,
  BookOpen,
  ChevronRight,
} from "lucide-react";

// --- Step 1 Schema ---
const studioSchema = z.object({
  name: z.string().min(1, "Stüdyo adı gereklidir"),
  slug: z
    .string()
    .min(1, "URL gereklidir")
    .regex(/^[a-z0-9-]+$/, "Sadece küçük harf, rakam ve tire kullanılabilir"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

// --- Step 2 Schema ---
const preferencesSchema = z.object({
  allowOnlineBooking: z.boolean(),
  requireBookingApproval: z.boolean(),
  maxBookingPerSession: z.coerce.number().min(1, "En az 1 olmalı"),
  cancellationHoursLimit: z.coerce.number().min(0, "0 veya üzeri olmalı"),
});

const steps = [
  { id: 1, title: "Stüdyo Bilgileri", icon: Building2 },
  { id: 2, title: "Tercihler", icon: Settings },
  { id: 3, title: "Hazırsınız!", icon: PartyPopper },
];

// --- Stepper Component ---
function Stepper({ currentStep }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center gap-2">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-all duration-300 ${
              currentStep > step.id
                ? "bg-emerald-500 text-white"
                : currentStep === step.id
                  ? "bg-brand text-white shadow-lg shadow-brand/30"
                  : "bg-gray-100 text-gray-400"
            }`}
          >
            {currentStep > step.id ? (
              <Check className="h-4 w-4" />
            ) : (
              <step.icon className="h-4 w-4" />
            )}
          </div>
          {index < steps.length - 1 && (
            <div
              className={`h-0.5 w-12 rounded-full transition-all duration-500 sm:w-20 ${
                currentStep > step.id ? "bg-emerald-500" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// --- Step 1: Studio Info ---
function StudioStep({ onNext, defaultValues }) {
  const [slugAvailable, setSlugAvailable] = useState(null);
  const [checkingSlug, setCheckingSlug] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(studioSchema),
    defaultValues: defaultValues || {
      name: "",
      slug: "",
      phone: "",
      address: "",
    },
  });

  const nameValue = watch("name");
  const slugValue = watch("slug");

  // Auto-generate slug from name
  useEffect(() => {
    if (nameValue && !defaultValues?.slug) {
      const generated = nameValue
        .toLowerCase()
        .replace(/[ğ]/g, "g")
        .replace(/[ü]/g, "u")
        .replace(/[ş]/g, "s")
        .replace(/[ı]/g, "i")
        .replace(/[ö]/g, "o")
        .replace(/[ç]/g, "c")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setValue("slug", generated);
    }
  }, [nameValue, setValue, defaultValues?.slug]);

  // Check slug availability with debounce
  const checkSlug = useCallback(async (slug) => {
    if (!slug || slug.length < 2) {
      setSlugAvailable(null);
      return;
    }
    setCheckingSlug(true);
    try {
      const { data } = await authService.checkSlug(slug);
      setSlugAvailable(data.data.available);
    } catch {
      setSlugAvailable(null);
    } finally {
      setCheckingSlug(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (slugValue) checkSlug(slugValue);
    }, 500);
    return () => clearTimeout(timer);
  }, [slugValue, checkSlug]);

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-5">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Stüdyonuzu tanımlayın
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Bu bilgileri daha sonra ayarlardan değiştirebilirsiniz.
        </p>
      </div>

      <Input
        label="Stüdyo Adı"
        placeholder="Zen Pilates Studio"
        error={errors.name?.message}
        {...register("name")}
      />

      <div className="space-y-1.5">
        <Input
          label="Stüdyo URL"
          placeholder="zen-pilates"
          error={errors.slug?.message}
          description={
            slugAvailable === true
              ? undefined
              : slugAvailable === false
                ? undefined
                : "Sadece küçük harf, rakam ve tire"
          }
          {...register("slug")}
        />
        {checkingSlug && (
          <p className="text-xs text-gray-400">Kontrol ediliyor...</p>
        )}
        {!checkingSlug && slugAvailable === true && slugValue && (
          <p className="text-xs text-emerald-600 flex items-center gap-1">
            <Check className="h-3 w-3" /> Bu URL kullanılabilir
          </p>
        )}
        {!checkingSlug && slugAvailable === false && (
          <p className="text-xs text-red-600">
            Bu URL zaten kullanımda, farklı bir URL deneyin
          </p>
        )}
      </div>

      <Input
        label="Telefon"
        placeholder="0212 555 00 00"
        {...register("phone")}
      />

      <Input
        label="Adres"
        placeholder="İstanbul, Kadıköy"
        {...register("address")}
      />

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={slugAvailable === false}
      >
        Devam Et
        <ArrowRight className="h-4 w-4" />
      </Button>
    </form>
  );
}

// --- Step 2: Preferences ---
function PreferencesStep({ onNext, onBack, defaultValues }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(preferencesSchema),
    defaultValues: defaultValues || {
      allowOnlineBooking: true,
      requireBookingApproval: false,
      maxBookingPerSession: 10,
      cancellationHoursLimit: 24,
    },
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-5">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Tercihleri ayarlayın
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Stüdyonuzun çalışma tercihlerini belirleyin.
        </p>
      </div>

      <div className="space-y-4 rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">
              Online Rezervasyon
            </p>
            <p className="text-xs text-gray-500">
              Üyeler online olarak seans rezervasyonu yapabilsin
            </p>
          </div>
          <ToggleSwitch
            checked={watch("allowOnlineBooking")}
            onChange={(e) => setValue("allowOnlineBooking", e.target.checked)}
          />
        </div>

        <div className="border-t border-gray-100" />

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">
              Rezervasyon Onayı
            </p>
            <p className="text-xs text-gray-500">
              Rezervasyonlar için yönetici onayı gereksin
            </p>
          </div>
          <ToggleSwitch
            checked={watch("requireBookingApproval")}
            onChange={(e) =>
              setValue("requireBookingApproval", e.target.checked)
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Seans Kontenjanı"
          type="number"
          min="1"
          error={errors.maxBookingPerSession?.message}
          {...register("maxBookingPerSession")}
        />
        <Input
          label="İptal Limiti (Saat)"
          type="number"
          min="0"
          error={errors.cancellationHoursLimit?.message}
          {...register("cancellationHoursLimit")}
        />
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          size="lg"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
          Geri
        </Button>
        <Button type="submit" className="w-full" size="lg">
          Devam Et
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}

// --- Step 3: Complete ---
function CompleteStep() {
  const quickLinks = [
    {
      title: "İlk Eğitmeni Ekle",
      description: "Stüdyonuza eğitmen tanımlayın",
      href: "/trainers/create",
      icon: UserPlus,
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "İlk Sınıfı Oluştur",
      description: "Ders programınızı hazırlayın",
      href: "/classes/create",
      icon: CalendarPlus,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "İlk Üyeyi Kaydet",
      description: "Üye kaydı yapmaya başlayın",
      href: "/members/create",
      icon: BookOpen,
      color: "bg-brand-light text-brand",
    },
  ];

  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
        <PartyPopper className="h-10 w-10 text-emerald-500" />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900">Tebrikler! 🎉</h2>
        <p className="mt-2 text-gray-500">
          Stüdyonuz hazır. 14 günlük ücretsiz deneme süreniz başladı.
        </p>
      </div>

      <div className="space-y-3 text-left">
        <p className="text-sm font-medium text-gray-700">Hızlı Başlangıç</p>
        {quickLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <div className="group flex items-center justify-between rounded-xl border border-gray-200 p-4 transition-all hover:border-gray-300 hover:shadow-sm">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${link.color}`}
                >
                  <link.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {link.title}
                  </p>
                  <p className="text-xs text-gray-500">{link.description}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>

      <Link href="/dashboard">
        <Button className="w-full" size="lg">
          Dashboard&apos;a Git
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}

// --- Main Onboarding Page ---
export default function OnboardingPage() {
  const { user, isAuthenticated, isLoading, refreshUser } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [studioData, setStudioData] = useState(null);
  const [preferencesData, setPreferencesData] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (
      !isLoading &&
      isAuthenticated &&
      user?.Studio?.settings?.onboarding_completed
    ) {
      router.push("/dashboard");
    }
  }, [isLoading, isAuthenticated, user, router]);

  const handleStudioSubmit = (data) => {
    setStudioData(data);
    setCurrentStep(2);
  };

  const handlePreferencesSubmit = async (data) => {
    setPreferencesData(data);
    setSaving(true);

    try {
      await settingsService.update({
        name: studioData.name,
        slug: studioData.slug,
        phone: studioData.phone || undefined,
        address: studioData.address || undefined,
        settings: {
          allowOnlineBooking: data.allowOnlineBooking,
          requireBookingApproval: data.requireBookingApproval,
          maxBookingPerSession: data.maxBookingPerSession,
          cancellationHoursLimit: data.cancellationHoursLimit,
          onboarding_completed: true,
        },
      });

      await refreshUser();
      setCurrentStep(3);
    } catch (err) {
      const message =
        err.response?.data?.error || "Bir hata oluştu, tekrar deneyin.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-white to-brand-light/30 px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand">
              <Dumbbell className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">PilatesFlow</span>
          </Link>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <Stepper currentStep={currentStep} />
          <p className="text-center text-sm text-gray-500 mt-3">
            Adım {currentStep} / {steps.length} — {steps[currentStep - 1].title}
          </p>
        </div>

        {/* Card */}
        <Card>
          <CardContent className="pt-8 pb-8">
            {saving ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <Spinner size="lg" />
                <p className="text-sm text-gray-500">Stüdyonuz kuruluyor...</p>
              </div>
            ) : currentStep === 1 ? (
              <StudioStep
                onNext={handleStudioSubmit}
                defaultValues={
                  studioData || {
                    name: user?.Studio?.name || "",
                    slug: user?.Studio?.slug || "",
                    phone: user?.Studio?.phone || "",
                    address: user?.Studio?.address || "",
                  }
                }
              />
            ) : currentStep === 2 ? (
              <PreferencesStep
                onNext={handlePreferencesSubmit}
                onBack={() => setCurrentStep(1)}
                defaultValues={preferencesData}
              />
            ) : (
              <CompleteStep />
            )}
          </CardContent>
        </Card>

        {currentStep < 3 && (
          <p className="mt-4 text-center text-xs text-gray-400">
            Bu bilgileri daha sonra ayarlardan değiştirebilirsiniz.
          </p>
        )}
      </div>
    </div>
  );
}
