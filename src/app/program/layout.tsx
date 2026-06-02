import { AdminPreviewBanner } from "@/components/AdminPreviewBanner";
import { requireProgramAccess } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ProgramLayout({ children }: { children: React.ReactNode }) {
  const { isAdminPreview } = await requireProgramAccess();

  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4 py-6 sm:py-10">
      {isAdminPreview ? <AdminPreviewBanner /> : null}
      {children}
    </div>
  );
}
