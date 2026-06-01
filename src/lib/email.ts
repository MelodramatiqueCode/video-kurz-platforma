export async function sendPurchaseConfirmationEmail({
  to,
  programTitle,
  programUrl,
}: {
  to: string;
  programTitle: string;
  programUrl: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const from = process.env.RESEND_FROM ?? "Mamy mimo davu <onboarding@resend.dev>";

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `Prístup k programu „${programTitle}“ je aktívny`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #111;">
          <h1 style="font-size: 20px;">Ďakujeme za nákup!</h1>
          <p>Váš prístup k programu <strong>${programTitle}</strong> je pripravený.</p>
          <p><a href="${programUrl}">Otvoriť program</a></p>
          <p style="color: #666; font-size: 14px;">Ak ste platbu nevykonali vy, kontaktujte nás.</p>
        </div>
      `,
    }),
  });
}
