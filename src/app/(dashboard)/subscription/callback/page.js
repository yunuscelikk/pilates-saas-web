"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useCheckoutCallback } from "@/hooks/useSubscription";
import Card, { CardContent } from "@/components/ui/card";
import Button from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { CheckCircle, XCircle } from "lucide-react";

export default function SubscriptionCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { refreshUser } = useAuth();
  const checkoutCallback = useCheckoutCallback();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setErrorMessage("Geçersiz ödeme token'ı.");
      return;
    }

    checkoutCallback
      .mutateAsync(token)
      .then(async () => {
        await refreshUser();
        setStatus("success");
      })
      .catch((err) => {
        setStatus("error");
        setErrorMessage(
          err.response?.data?.message || "Ödeme doğrulanırken bir hata oluştu.",
        );
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          {status === "loading" && (
            <div className="space-y-4">
              <Spinner size="lg" />
              <p className="text-gray-600">Ödemeniz doğrulanıyor...</p>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-4">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
              <h2 className="text-xl font-semibold text-gray-900">
                Ödeme Başarılı!
              </h2>
              <p className="text-gray-600">
                Aboneliğiniz başarıyla aktifleştirildi.
              </p>
              <Button onClick={() => router.push("/subscription")}>
                Abonelik Sayfasına Dön
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <XCircle className="mx-auto h-16 w-16 text-red-500" />
              <h2 className="text-xl font-semibold text-gray-900">
                Ödeme Başarısız
              </h2>
              <p className="text-sm text-gray-600">{errorMessage}</p>
              <div className="flex justify-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => router.push("/subscription")}
                >
                  Geri Dön
                </Button>
                <Button onClick={() => router.push("/subscription")}>
                  Tekrar Dene
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
