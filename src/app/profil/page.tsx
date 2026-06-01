import Link from "next/link";
import { SetPasswordForm } from "@/components/SetPasswordForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await requireUser("/prihlasenie?next=/profil");

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <Card>
        <CardHeader>
          <CardTitle>Môj účet</CardTitle>
          <CardDescription>
            Prihlásený ako {user.email}. Tu si môžete nastaviť heslo pre prihlásenie emailom.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <SetPasswordForm />
          <Link href="/admin" className="text-sm text-zinc-600 underline">
            Späť do adminu
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
