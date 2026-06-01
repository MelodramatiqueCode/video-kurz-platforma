import { AuthForm } from "@/components/AuthForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="mx-auto flex max-w-md px-4 py-16">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Prihlásenie</CardTitle>
          <CardDescription>Vytvorte si účet alebo sa prihláste pre prístup k programu.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {params.error === "google-auth" ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              Prihlásenie cez Google zlyhalo. Skúste to znova alebo použite email a heslo.
            </p>
          ) : null}
          <AuthForm nextPath={params.next ?? "/program"} />
        </CardContent>
      </Card>
    </div>
  );
}
