"use client";

import { BrandLogoLarge } from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function CertificateView({
  programTitle,
  userEmail,
  completedAt,
}: {
  programTitle: string;
  userEmail: string;
  completedAt: string;
}) {
  return (
    <Card className="mx-auto max-w-2xl border-primary/20">
      <CardHeader className="items-center text-center">
        <BrandLogoLarge />
        <CardTitle className="text-2xl">Certifikát o absolvovaní</CardTitle>
        <CardDescription>Program bol úspešne dokončený.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 text-center">
        <div className="rounded-2xl border border-border bg-accent/30 px-6 py-8">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Potvrdzujeme, že</p>
          <p className="mt-3 text-2xl font-semibold">{userEmail}</p>
          <p className="mt-4 text-muted-foreground">absolvoval/a program</p>
          <p className="mt-2 text-xl font-medium">{programTitle}</p>
          <p className="mt-6 text-sm text-muted-foreground">Dokončené: {completedAt}</p>
        </div>
        <Button onClick={() => window.print()}>Vytlačiť certifikát</Button>
      </CardContent>
    </Card>
  );
}
