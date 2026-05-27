import { AuthForm } from "@/components/AuthForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="mx-auto flex max-w-md px-4 py-16">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Prihlásenie</CardTitle>
          <CardDescription>Vytvorte si účet alebo sa prihláste pre prístup k programu.</CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm nextPath={params.next ?? "/program"} />
        </CardContent>
      </Card>
    </div>
  );
}
