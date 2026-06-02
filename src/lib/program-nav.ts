export type ProgramDayNavItem = {
  id: string;
  title: string;
  slug: string;
  progress: number;
  thumbnailUrl?: string | null;
  completed?: boolean;
};

export function formatDayNavLabel(day: ProgramDayNavItem) {
  const status = day.completed ? " · hotovo" : ` · ${day.progress}%`;
  return `${day.title}${status}`;
}
