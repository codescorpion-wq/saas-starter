import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useSession } from "@/lib/auth-client";

type BillingStatus = { plan: "free" | "pro"; status: string; currentPeriodEnd: string | null };

export function Dashboard() {
  const { data: session } = useSession();
  const [billing, setBilling] = useState<BillingStatus | null>(null);

  useEffect(() => {
    api<BillingStatus>("/billing/status").then(setBilling).catch((e) => toast.error(e.message));
    if (new URLSearchParams(location.search).get("upgraded")) toast.success("You're on Pro 🎉");
  }, []);

  async function go(path: "/billing/checkout" | "/billing/portal") {
    try {
      const { url } = await api<{ url: string }>(path, { method: "POST" });
      window.location.href = url;
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <h1 className="text-2xl font-bold">Hi, {session?.user.name} 👋</h1>

      <Card>
        <CardHeader>
          <CardTitle>Plan: {billing ? billing.plan.toUpperCase() : "…"}</CardTitle>
          <CardDescription>
            {billing?.plan === "pro" && billing.currentPeriodEnd
              ? `Renews ${new Date(billing.currentPeriodEnd).toLocaleDateString()}`
              : "Upgrade to unlock everything."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {billing?.plan === "pro"
            ? <Button variant="outline" onClick={() => go("/billing/portal")}>Manage billing</Button>
            : <Button onClick={() => go("/billing/checkout")}>Upgrade to Pro</Button>}
        </CardContent>
      </Card>

      {/* 👉 Your product's main UI goes here */}
      <Card>
        <CardHeader><CardTitle>Your product</CardTitle><CardDescription>Build the core feature here.</CardDescription></CardHeader>
      </Card>
    </main>
  );
}
