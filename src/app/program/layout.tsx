import { requireEnrollment } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ProgramLayout({ children }: { children: React.ReactNode }) {
  await requireEnrollment();
  return <div className="mx-auto max-w-6xl px-4 py-10">{children}</div>;
}
