import { FileText, NotebookPen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type AttachmentItem = {
  id: string;
  filename: string;
  type: "ATTACHMENT" | "WORKBOOK";
};

export function AttachmentList({ attachments }: { attachments: AttachmentItem[] }) {
  if (attachments.length === 0) {
    return <p className="text-sm text-zinc-500">Pre túto lekciu zatiaľ nie sú nahraté prílohy.</p>;
  }

  const workbooks = attachments.filter((item) => item.type === "WORKBOOK");
  const files = attachments.filter((item) => item.type === "ATTACHMENT");

  return (
    <div className="space-y-6">
      {workbooks.length > 0 ? (
        <section className="space-y-3">
          <h4 className="flex items-center gap-2 text-sm font-semibold">
            <NotebookPen className="h-4 w-4" />
            Pracovné zošity
          </h4>
          <div className="space-y-2">
            {workbooks.map((attachment) => (
              <a
                key={attachment.id}
                href={`/api/blob/download?id=${attachment.id}`}
                className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3 text-sm hover:bg-zinc-50"
              >
                <span>{attachment.filename}</span>
                <Badge>Stiahnuť PDF</Badge>
              </a>
            ))}
          </div>
        </section>
      ) : null}

      {files.length > 0 ? (
        <section className="space-y-3">
          <h4 className="flex items-center gap-2 text-sm font-semibold">
            <FileText className="h-4 w-4" />
            Prílohy
          </h4>
          <div className="space-y-2">
            {files.map((attachment) => (
              <a
                key={attachment.id}
                href={`/api/blob/download?id=${attachment.id}`}
                className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3 text-sm hover:bg-zinc-50"
              >
                <span>{attachment.filename}</span>
                <Badge>Stiahnuť</Badge>
              </a>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
