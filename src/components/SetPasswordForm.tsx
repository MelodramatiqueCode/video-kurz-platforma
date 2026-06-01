"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export function SetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);

    if (password.length < 6) {
      setMessage("Heslo musí mať aspoň 6 znakov.");
      return;
    }

    if (password !== confirm) {
      setMessage("Heslá sa nezhodujú.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Heslo bolo nastavené. Teraz sa môžete prihlásiť aj emailom a heslom.");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">Nové heslo</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={6}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm">Zopakujte heslo</Label>
        <Input
          id="confirm"
          type="password"
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          required
          minLength={6}
        />
      </div>
      {message ? (
        <p className={`text-sm ${message.includes("nastavené") ? "text-emerald-700" : "text-red-600"}`}>
          {message}
        </p>
      ) : null}
      <Button type="submit" disabled={loading}>
        {loading ? "Ukladám..." : "Uložiť heslo"}
      </Button>
    </form>
  );
}
