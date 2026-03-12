"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  usePlans,
  useCurrentSubscription,
  useInitializeCheckout,
  useCancelSubscription,
  useUpgradeSubscription,
  useRetryPayment,
  useReactivateSubscription,
} from "@/hooks/useSubscription";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import Modal from "@/components/ui/modal";
import Spinner from "@/components/ui/spinner";
import PageHeader from "@/components/ui/page-header";
import { Check, Crown, AlertTriangle, X, RefreshCw } from "lucide-react";

const STATUS_MAP = {
  trialing: { label: "Deneme", variant: "info" },
  active: { label: "Aktif", variant: "success" },
  past_due: { label: "Ödeme Gecikmiş", variant: "warning" },
  canceled: { label: "İptal Edildi", variant: "danger" },
  expired: { label: "Süresi Doldu", variant: "danger" },
};

const PLAN_FEATURES = {
  starter: [
    "50 üyeye kadar",
    "5 sınıf tanımı",
    "Temel raporlama",
    "E-posta bildirimleri",
    "1 personel hesabı",
  ],
  professional: [
    "Sınırsız üye",
    "Sınırsız sınıf",
    "Gelişmiş raporlama",
    "SMS & e-posta bildirimleri",
    "5 personel hesabı",
    "Öncelikli destek",
  ],
  enterprise: [
    "Profesyonel tüm özellikler",
    "Çoklu stüdyo desteği",
    "API erişimi",
    "Özel entegrasyonlar",
    "Sınırsız personel",
    "7/24 öncelikli destek",
  ],
};

function IyzicoCheckoutRenderer({ html }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !html) return;
    const container = containerRef.current;
    container.innerHTML = "";

    // iyzico needs this target div to render the checkout form
    const target = document.createElement("div");
    target.id = "iyzipay-checkout-form";
    target.className = "responsive";
    container.appendChild(target);

    const temp = document.createElement("div");
    temp.innerHTML = html;

    Array.from(temp.childNodes).forEach((node) => {
      if (node.nodeName === "SCRIPT") {
        const script = document.createElement("script");
        if (node.src) script.src = node.src;
        if (node.type) script.type = node.type;
        if (node.textContent) script.textContent = node.textContent;
        container.appendChild(script);
      } else {
        container.appendChild(node.cloneNode(true));
      }
    });

    return () => {
      container.innerHTML = "";
      // Clean up global iyzico variables
      window.iyziInit = undefined;
      window.iyziUcsInit = undefined;
      window.iyziSubscriptionInit = undefined;
    };
  }, [html]);

  return <div ref={containerRef} className="min-h-[400px]" />;
}

export default function SubscriptionPage() {
  const { user, refreshUser } = useAuth();
  const { data: plansData, isLoading: plansLoading } = usePlans();
  const { data: subData, isLoading: subLoading } = useCurrentSubscription();
  const initCheckout = useInitializeCheckout();
  const cancelSub = useCancelSubscription();
  const upgradeSub = useUpgradeSubscription();
  const retryPayment = useRetryPayment();
  const reactivateSub = useReactivateSubscription();

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [checkoutHtml, setCheckoutHtml] = useState("");
  const [customerForm, setCustomerForm] = useState({
    name: user?.first_name || "",
    surname: user?.last_name || "",
    email: user?.email || "",
    gsmNumber: "",
    identityNumber: "",
    address: "",
    city: "Istanbul",
    country: "Turkey",
  });

  const plans = plansData?.data || [];
  const subscription = subData?.data;
  const isOwner = user?.role === "owner";

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setShowCheckoutModal(true);
  };

  const [formError, setFormError] = useState("");
  const [cancelError, setCancelError] = useState("");
  const [upgradeError, setUpgradeError] = useState("");

  const handleCheckout = async () => {
    setFormError("");
    const { name, surname, email, gsmNumber, identityNumber, address } =
      customerForm;
    if (
      !name.trim() ||
      !surname.trim() ||
      !email.trim() ||
      !gsmNumber.trim() ||
      !identityNumber.trim() ||
      !address.trim()
    ) {
      setFormError(
        "Tüm alanları doldurunuz (Ad, Soyad, E-posta, Telefon, TC Kimlik, Adres).",
      );
      return;
    }
    try {
      const result = await initCheckout.mutateAsync({
        planId: selectedPlan.id,
        customer: customerForm,
      });
      setCheckoutHtml(result.data.checkoutFormContent);
    } catch (err) {
      setFormError(
        err.response?.data?.error || "Ödeme başlatılırken bir hata oluştu.",
      );
    }
  };

  const handleCancel = async () => {
    setCancelError("");
    try {
      await cancelSub.mutateAsync();
      await refreshUser();
      setShowCancelModal(false);
    } catch (err) {
      setCancelError(
        err.response?.data?.error || "İptal işlemi sırasında bir hata oluştu.",
      );
    }
  };

  const handleUpgrade = async (planId) => {
    setUpgradeError("");
    try {
      await upgradeSub.mutateAsync(planId);
      await refreshUser();
    } catch (err) {
      setUpgradeError(
        err.response?.data?.error ||
          "Plan değişikliği sırasında bir hata oluştu.",
      );
    }
  };

  const handleRetryPayment = async () => {
    try {
      await retryPayment.mutateAsync();
    } catch {
      // Hata React Query tarafından yönetilir
    }
  };

  const handleReactivate = (plan) => {
    setSelectedPlan(plan);
    setShowCheckoutModal(true);
  };

  const getTrialDaysLeft = () => {
    if (!subscription?.trial_ends_at) return 0;
    const diff = new Date(subscription.trial_ends_at) - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  if (plansLoading || subLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Abonelik Yönetimi"
        description="Plan bilgilerinizi görüntüleyin ve yönetin."
      />

      {/* Current Subscription Status */}
      {subscription && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {subscription.Plan?.name || "—"} Plan
                  </h3>
                  <Badge variant={STATUS_MAP[subscription.status]?.variant}>
                    {STATUS_MAP[subscription.status]?.label}
                  </Badge>
                </div>
                {subscription.status === "trialing" && (
                  <p className="text-sm text-gray-500">
                    Deneme sürenizin bitmesine{" "}
                    <span className="font-semibold text-brand">
                      {getTrialDaysLeft()} gün
                    </span>{" "}
                    kaldı.
                  </p>
                )}
                {subscription.status === "active" &&
                  subscription.current_period_end && (
                    <p className="text-sm text-gray-500">
                      Sonraki fatura:{" "}
                      {new Date(
                        subscription.current_period_end,
                      ).toLocaleDateString("tr-TR")}
                    </p>
                  )}
                {subscription.status === "past_due" && (
                  <p className="text-sm text-red-600">
                    Ödemeniz gecikmiş durumda. Lütfen ödemeyi yeniden deneyin.
                  </p>
                )}
                {subscription.status === "canceled" &&
                  subscription.cancel_at_period_end &&
                  subscription.current_period_end &&
                  new Date(subscription.current_period_end) > new Date() && (
                    <p className="text-sm text-amber-600">
                      Aboneliğiniz iptal edildi. Erişiminiz{" "}
                      <span className="font-semibold">
                        {new Date(
                          subscription.current_period_end,
                        ).toLocaleDateString("tr-TR")}
                      </span>{" "}
                      tarihine kadar devam edecektir.
                    </p>
                  )}
              </div>
              <div className="flex items-center gap-2">
                {isOwner && subscription.status === "past_due" && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleRetryPayment}
                    loading={retryPayment.isPending}
                  >
                    <RefreshCw className="mr-1 h-4 w-4" />
                    Ödemeyi Tekrarla
                  </Button>
                )}
                {isOwner &&
                  subscription.status !== "canceled" &&
                  subscription.status !== "expired" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCancelModal(true)}
                      loading={cancelSub.isPending}
                    >
                      Aboneliği İptal Et
                    </Button>
                  )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plan Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const isCurrent = subscription?.plan_id === plan.id;
          const features = PLAN_FEATURES[plan.slug] || [];
          const isPopular = plan.slug === "professional";

          return (
            <Card
              key={plan.id}
              className={`relative flex flex-col ${
                isPopular ? "border-brand shadow-lg ring-1 ring-brand" : ""
              } ${isCurrent ? "bg-gray-50" : ""}`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="info" className="px-3 py-1 text-xs">
                    En Popüler
                  </Badge>
                </div>
              )}
              {isCurrent && (
                <div className="absolute -top-3 right-4">
                  <Badge variant="success" className="px-3 py-1 text-xs">
                    <Crown className="mr-1 h-3 w-3" />
                    Mevcut Plan
                  </Badge>
                </div>
              )}
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">{plan.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col pt-0">
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    ₺{parseFloat(plan.price).toLocaleString("tr-TR")}
                  </span>
                  <span className="text-gray-500">/ay</span>
                </div>
                <ul className="mb-8 flex-1 space-y-3">
                  {features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-gray-600"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {isOwner && !isCurrent && (
                  <Button
                    variant={isPopular ? "primary" : "outline"}
                    className="w-full"
                    onClick={() => {
                      if (
                        subscription?.status === "canceled" ||
                        subscription?.status === "expired" ||
                        !subscription
                      ) {
                        handleReactivate(plan);
                      } else if (
                        subscription?.status === "active" &&
                        subscription?.iyzico_subscription_reference_code
                      ) {
                        handleUpgrade(plan.id);
                      } else {
                        handleSelectPlan(plan);
                      }
                    }}
                    loading={upgradeSub.isPending || reactivateSub.isPending}
                  >
                    {subscription?.status === "trialing"
                      ? "Bu Planı Seç"
                      : subscription?.status === "active" ||
                          subscription?.status === "past_due"
                        ? plan.sort_order >
                          (subscription?.Plan?.sort_order || 0)
                          ? "Planı Yükselt"
                          : "Plana Geç"
                        : "Abone Ol"}
                  </Button>
                )}
                {upgradeError && !isCurrent && (
                  <p className="mt-2 text-center text-xs text-red-600">
                    {upgradeError}
                  </p>
                )}
                {isCurrent && (
                  <div className="text-center text-sm font-medium text-gray-500">
                    Mevcut planınız
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Checkout Modal */}
      <Modal
        isOpen={showCheckoutModal}
        onClose={() => {
          setShowCheckoutModal(false);
          setCheckoutHtml("");
          setSelectedPlan(null);
        }}
        title={
          checkoutHtml ? "Ödeme" : `${selectedPlan?.name} Planına Abone Ol`
        }
        className="max-w-2xl"
      >
        {checkoutHtml ? (
          <IyzicoCheckoutRenderer html={checkoutHtml} />
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Ödeme işlemine devam etmek için aşağıdaki bilgileri doldurun.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Ad
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                  value={customerForm.name}
                  onChange={(e) =>
                    setCustomerForm({ ...customerForm, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Soyad
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                  value={customerForm.surname}
                  onChange={(e) =>
                    setCustomerForm({
                      ...customerForm,
                      surname: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                E-posta
              </label>
              <input
                type="email"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                value={customerForm.email}
                onChange={(e) =>
                  setCustomerForm({ ...customerForm, email: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Telefon (GSM)
                </label>
                <input
                  type="tel"
                  placeholder="+905XXXXXXXXX"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                  value={customerForm.gsmNumber}
                  onChange={(e) =>
                    setCustomerForm({
                      ...customerForm,
                      gsmNumber: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  TC Kimlik No
                </label>
                <input
                  type="text"
                  maxLength={11}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                  value={customerForm.identityNumber}
                  onChange={(e) =>
                    setCustomerForm({
                      ...customerForm,
                      identityNumber: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Adres
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                value={customerForm.address}
                onChange={(e) =>
                  setCustomerForm({ ...customerForm, address: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Şehir
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                  value={customerForm.city}
                  onChange={(e) =>
                    setCustomerForm({ ...customerForm, city: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Ülke
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                  value={customerForm.country}
                  onChange={(e) =>
                    setCustomerForm({
                      ...customerForm,
                      country: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            {formError && <p className="text-sm text-red-600">{formError}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCheckoutModal(false);
                  setSelectedPlan(null);
                  setFormError("");
                }}
              >
                İptal
              </Button>
              <Button onClick={handleCheckout} loading={initCheckout.isPending}>
                Ödemeye Geç
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Aboneliği İptal Et"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-lg bg-red-50 p-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
            <div>
              <p className="text-sm font-medium text-red-800">Emin misiniz?</p>
              <p className="mt-1 text-sm text-red-700">
                Aboneliğinizi iptal ettiğinizde mevcut dönem sonunda tüm
                özelliklerinize erişiminiz sona erecektir.
              </p>
            </div>
          </div>
          {cancelError && <p className="text-sm text-red-600">{cancelError}</p>}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowCancelModal(false);
                setCancelError("");
              }}
            >
              Vazgeç
            </Button>
            <Button
              variant="danger"
              onClick={handleCancel}
              loading={cancelSub.isPending}
            >
              Evet, İptal Et
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
