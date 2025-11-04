"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SubscriptionService } from "@/services/subscriptionService";

export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");
  const [emailInput, setEmailInput] = useState<string>("");

  const emailFromQuery = useMemo(() => {
    const email = searchParams.get("email");
    return email ? SubscriptionService.normalizeEmail(email) : null;
  }, [searchParams]);

  useEffect(() => {
    let redirectTimer: ReturnType<typeof setTimeout> | null = null;

    async function performUnsubscribe(email: string) {
      setStatus("loading");
      setMessage("");
      const result = await SubscriptionService.unsubscribe(email);

      if (result.success) {
        setStatus("success");
        setMessage(result.message || "You have been unsubscribed.");
        redirectTimer = setTimeout(() => {
          router.replace("/");
        }, 2500);
      } else {
        setStatus("error");
        setMessage(result.error || "Failed to unsubscribe. Please try again later.");
      }
    }

    if (emailFromQuery) {
      performUnsubscribe(emailFromQuery);
    } else {
      setStatus("idle");
      setMessage("");
    }

    return () => {
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [emailFromQuery, router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = emailInput.trim();
    if (!email) {
      setStatus("error");
      setMessage("Please enter your email address.");
      return;
    }
    if (!SubscriptionService.validateEmail(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    const normalized = SubscriptionService.normalizeEmail(email);
    setMessage("");
    setStatus("loading");
    const result = await SubscriptionService.unsubscribe(normalized);
    if (result.success) {
      setStatus("success");
      setMessage(result.message || "You have been unsubscribed.");
      setEmailInput("");
      setTimeout(() => router.replace("/"), 2500);
    } else {
      setStatus("error");
      setMessage(result.error || "Failed to unsubscribe. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-2xl px-4 py-24">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Unsubscribe</h1>
          <p className="mt-2 text-sm text-gray-600">
            {status === "idle" && (emailFromQuery ? "Preparing to process your request..." : "Enter your email to unsubscribe from updates.")}
            {status === "loading" && "Processing your unsubscription..."}
            {(status === "success" || status === "error") && message}
          </p>

          {status === "success" && (
            <p className="mt-4 text-xs text-gray-500">Redirecting you to the homepage...</p>
          )}

          {!emailFromQuery && (
            <form onSubmit={onSubmit} className="mx-auto mt-6 flex max-w-md gap-2">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="your@email.com"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                aria-label="Email address"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex items-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-60"
              >
                {status === "loading" ? "Unsubscribing..." : "Unsubscribe"}
              </button>
            </form>
          )}

          {(status === "error" || status === "success") && (
            <button
              type="button"
              className="mt-6 inline-flex items-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              onClick={() => router.replace("/")}
            >
              Go to Home
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


