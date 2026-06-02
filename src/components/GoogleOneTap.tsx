"use client";

import Script from "next/script";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { generateGoogleAuthNonce } from "@/lib/google-auth";

type CredentialResponse = {
  credential?: string;
};

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: CredentialResponse) => void;
            nonce?: string;
            use_fedcm_for_prompt?: boolean;
            auto_select?: boolean;
          }) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export function GoogleOneTap({
  nextPath,
  disabled = false,
}: {
  nextPath: string;
  disabled?: boolean;
}) {
  const router = useRouter();
  const initializedRef = useRef(false);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  async function initializeOneTap() {
    if (!clientId || disabled || initializedRef.current || !window.google) {
      return;
    }

    initializedRef.current = true;

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      return;
    }

    const [nonce, hashedNonce] = await generateGoogleAuthNonce();

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response) => {
        if (!response.credential) {
          return;
        }

        const { error } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: response.credential,
          nonce,
        });

        if (error) {
          console.error("Google One Tap sign-in failed:", error.message);
          return;
        }

        await fetch("/api/auth/sync", { method: "POST" });
        router.push(nextPath);
        router.refresh();
      },
      nonce: hashedNonce,
      use_fedcm_for_prompt: true,
      auto_select: true,
    });

    window.google.accounts.id.prompt();
  }

  if (!clientId) {
    return null;
  }

  return (
    <Script
      src="https://accounts.google.com/gsi/client"
      strategy="afterInteractive"
      onLoad={() => {
        void initializeOneTap();
      }}
    />
  );
}
