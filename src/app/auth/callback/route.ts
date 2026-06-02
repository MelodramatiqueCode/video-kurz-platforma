import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { ensureUserRecord } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const oauthError = searchParams.get("error_description") ?? searchParams.get("error");
  let next = searchParams.get("next") ?? "/program";

  if (!next.startsWith("/")) {
    next = "/program";
  }

  if (oauthError) {
    const loginUrl = new URL("/prihlasenie", origin);
    loginUrl.searchParams.set("error", "google-auth");
    loginUrl.searchParams.set("message", oauthError);
    return NextResponse.redirect(loginUrl);
  }

  if (code) {
    const redirectUrl = new URL(next, origin);
    const response = NextResponse.redirect(redirectUrl);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      },
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.email) {
        await ensureUserRecord(user.id, user.email);
      }

      return response;
    }

    const loginUrl = new URL("/prihlasenie", origin);
    loginUrl.searchParams.set("error", "google-auth");
    loginUrl.searchParams.set("message", error.message);
    return NextResponse.redirect(loginUrl);
  }

  const loginUrl = new URL("/prihlasenie", origin);
  loginUrl.searchParams.set("error", "google-auth");
  return NextResponse.redirect(loginUrl);
}
