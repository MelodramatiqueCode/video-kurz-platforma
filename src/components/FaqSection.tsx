const faqs = [
  {
    question: "Ako získam prístup k programu?",
    answer:
      "Vytvorte si účet, dokončite jednorazovú platbu cez Stripe a program sa vám okamžite odomkne.",
  },
  {
    question: "Na ako dlho mám prístup?",
    answer: "Prístup je jednorazový nákup — k obsahu sa môžete vracať kedykoľvek.",
  },
  {
    question: "Môžem sledovať na mobile?",
    answer: "Áno, program funguje v prehliadači na telefóne, tablete aj počítači.",
  },
  {
    question: "Podporujete zľavové kódy?",
    answer: "Áno, pri platbe môžete zadať promo kód, ak ho máte k dispozícii.",
  },
  {
    question: "Čo ak mám problém s videom?",
    answer: "Skúste obnoviť stránku alebo iný prehliadač. Ak problém pretrváva, napíšte nám.",
  },
];

export function FaqSection() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Často kladené otázky</h2>
        <p className="text-muted-foreground">Odpovede pred nákupom aj počas programu.</p>
      </div>
      <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
        {faqs.map((faq) => (
          <details key={faq.question} className="group px-5 py-4">
            <summary className="cursor-pointer list-none font-medium marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-4">
                {faq.question}
                <span className="text-muted-foreground transition-transform group-open:rotate-45">+</span>
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
