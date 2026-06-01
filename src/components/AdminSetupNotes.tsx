import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AdminSetupNotes() {
  return (
    <Card className="border-sky-200 bg-sky-50">
      <CardHeader>
        <CardTitle className="text-sky-950">Checklist integrácií</CardTitle>
        <CardDescription className="text-sky-900">
          Nastavenia mimo admin panelu, ktoré odblokujú plný flow.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-sky-950">
        <p>
          <strong>Stripe:</strong> pridajte `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` a Stripe Price ID vyššie.
          Checkout podporuje promo kódy.
        </p>
        <p>
          <strong>Google prihlásenie:</strong> v Supabase → Authentication → Providers zapnite Google
          (Client ID + Secret z Google Cloud Console, nie OAuth Server).
        </p>
        <p>
          <strong>Email po nákupe:</strong> voliteľne `RESEND_API_KEY` a `RESEND_FROM` vo Vercel env.
        </p>
      </CardContent>
    </Card>
  );
}
