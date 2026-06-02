"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type AdminEnrollmentRow = {
  id: string;
  email: string;
  paidAt: string;
  source: "stripe" | "manual";
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("sk-SK", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function AdminStudentsSection({
  programId,
  enrollments,
}: {
  programId: string;
  enrollments: AdminEnrollmentRow[];
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleGrant(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const response = await fetch("/api/admin/enrollment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ programId, email }),
    });

    setLoading(false);

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setMessage(data.error ?? "Nepodarilo sa udeliť prístup.");
      return;
    }

    setMessage(`Prístup bol udelený pre ${email}.`);
    setEmail("");
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Študenti s prístupom</CardTitle>
        <CardDescription>
          Zoznam používateľov, ktorí si kúpili program alebo im bol prístup udelený manuálne.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {enrollments.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-200 px-4 py-6 text-sm text-zinc-600">
            Zatiaľ nemáte žiadnych študentov s aktívnym prístupom.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-zinc-200">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50 text-zinc-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Prístup od</th>
                  <th className="px-4 py-3 font-medium">Spôsob</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((enrollment) => (
                  <tr key={enrollment.id} className="border-b border-zinc-100 last:border-b-0">
                    <td className="px-4 py-3 font-medium text-zinc-900">{enrollment.email}</td>
                    <td className="px-4 py-3 text-zinc-600">{formatDate(enrollment.paidAt)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          enrollment.source === "stripe"
                            ? "rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800"
                            : "rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-800"
                        }
                      >
                        {enrollment.source === "stripe" ? "Stripe platba" : "Manuálne"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <form onSubmit={handleGrant} className="space-y-4 rounded-xl border border-zinc-200 p-4">
          <div>
            <h3 className="font-semibold">Udeliť prístup študentovi</h3>
            <p className="mt-1 text-sm text-zinc-600">
              Stačí, ak sa študent aspoň raz registroval alebo prihlásil na webe. Účet sa tu
              automaticky nájde podľa emailu.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="grant-email">Email študenta</Label>
            <Input
              id="grant-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="student@example.com"
              required
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Ukladám..." : "Udeliť prístup"}
          </Button>
          {message ? (
            <p className={`text-sm ${message.includes("Nepodarilo") || message.includes("musí") ? "text-red-600" : "text-emerald-700"}`}>
              {message}
            </p>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}
