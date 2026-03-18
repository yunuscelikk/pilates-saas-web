"use client";

import { use, useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Phone, ArrowRight, Loader2 } from "lucide-react";
import { useCustomerAuth } from "@/components/customer/customer-auth-provider";
import { toast } from "sonner";

export default function LoginPage({ params }) {
  const { studioSlug } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const { sendOtp, verifyOtp, isAuthenticated } = useCustomerAuth();
  const [step, setStep] = useState("phone"); // 'phone' | 'otp'
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const otpRefs = useRef([]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirect || `/book/${studioSlug}`);
    }
  }, [isAuthenticated, redirect, router, studioSlug]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true);
    try {
      await sendOtp(phone);
      setStep("otp");
      toast.success("Doğrulama kodu gönderildi");
    } catch (error) {
      toast.error(error.response?.data?.message || "Kod gönderilemedi");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits entered
    if (value && newOtp.every((d) => d !== "")) {
      handleVerifyOtp(newOtp.join(""));
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (code) => {
    setLoading(true);
    try {
      await verifyOtp(phone, code);
      toast.success("Giriş başarılı!");
      router.push(redirect || `/book/${studioSlug}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Geçersiz kod");
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      {step === "phone" ? (
        <form onSubmit={handleSendOtp} className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
              <Phone className="h-7 w-7 text-primary-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Giriş Yap</h2>
            <p className="mt-1 text-sm text-gray-500">
              Telefon numaranızı girerek devam edin
            </p>
          </div>

          <div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0 5XX XXX XX XX"
              className="w-full rounded-xl border border-gray-300 px-4 py-3.5 text-center text-lg font-medium tracking-wider focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={loading || !phone.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-3.5 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Doğrulama Kodu Gönder
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900">Doğrulama Kodu</h2>
            <p className="mt-1 text-sm text-gray-500">
              <span className="font-medium">{phone}</span> numarasına gönderilen 6 haneli kodu girin
            </p>
          </div>

          <div className="flex justify-center gap-2">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (otpRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                className="h-14 w-12 rounded-xl border border-gray-300 text-center text-xl font-semibold focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                autoFocus={i === 0}
              />
            ))}
          </div>

          {loading && (
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
            </div>
          )}

          <button
            onClick={() => {
              setStep("phone");
              setOtp(["", "", "", "", "", ""]);
            }}
            className="w-full text-center text-sm text-primary-600 hover:underline"
          >
            Telefon numarasını değiştir
          </button>
        </div>
      )}
    </div>
  );
}
